# /// script
# requires-python = ">=3.10"
# dependencies = ["fonttools==4.68.0", "brotli==1.2.1"]
# ///
"""Generate complete, locally served webfont chunks from pinned official fonts.

Run with `uv run scripts/build-fonts.py`; normal site builds use checked-in output.
"""

import argparse
from concurrent.futures import ProcessPoolExecutor
from hashlib import sha256
from io import BytesIO
import json
import logging
import os
from pathlib import Path
import shutil
import tempfile
from urllib.request import urlopen
from zipfile import ZipFile

import brotli
from fontTools import __version__ as fonttools_version, subset
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parent.parent
DESTINATION = ROOT / "playground/src/assets/fonts"
CHUNK_SIZE = 512
SOURCES = [
    {
        "id": "wenkai",
        "family": "WenKai",
        "version": "1.530",
        "filename": "LXGWWenKai-Regular.ttf",
        "url": "https://github.com/lxgw/LxgwWenKai/releases/download/v1.530/LXGWWenKai-Regular.ttf",
        "sha256": "2d73eea94ad808999d90c0000c239a84a33b09d4bc6ab6c5b8bbf1eda8a7fc8b",
    },
    {
        "id": "marker",
        "family": "Marker",
        "version": "1.004",
        "filename": "LxgwMarkerGothic-v1.004.zip",
        "url": "https://github.com/lxgw/LxgwMarkerGothic/releases/download/v1.004/LxgwMarkerGothic-v1.004.zip",
        "archiveSha256": "4a30c82200664d5366ed8ef822ee2085ad16c767862396b96b8924fd94297aa6",
        "archiveMember": "LxgwMarkerGothic-v1.004/fonts/ttf/LXGWMarkerGothic-Regular.ttf",
        "sha256": "dfc9b27ef9e83024d5926d4a1feb70604eaf8c16aa73659c81d75a22accadae4",
    },
]


def ranges(values):
    result = []
    for value in sorted(values):
        if result and value == result[-1][1] + 1:
            result[-1][1] = value
        else:
            result.append([value, value])
    return result


def css_range(values):
    return ", ".join(
        f"U+{start:X}" if start == end else f"U+{start:X}-{end:X}" for start, end in values
    )


def load_source(source, cache):
    path = cache / source["filename"]
    expected = source.get("archiveSha256", source["sha256"])
    if not path.exists():
        cache.mkdir(parents=True, exist_ok=True)
        with urlopen(source["url"], timeout=120) as response:
            data = response.read()
        if sha256(data).hexdigest() != expected:
            raise ValueError(f"Downloaded source checksum differs: {source['filename']}")
        path.write_bytes(data)
    data = path.read_bytes()
    if sha256(data).hexdigest() != expected:
        raise ValueError(f"Source checksum differs: {path}")
    if "archiveMember" in source:
        with ZipFile(BytesIO(data)) as archive:
            data = archive.read(source["archiveMember"])
    if sha256(data).hexdigest() != source["sha256"]:
        raise ValueError(f"TTF checksum differs: {source['id']}")
    return data


def site_characters():
    # This only chooses the small first chunk. Every other upstream character is
    # also emitted, so new articles and user input do not depend on this corpus.
    characters = set(range(32, 127))
    extensions = {".ts", ".tsx", ".css", ".json", ".md"}
    for directory in ("playground/src", "examples/blog/src"):
        for path in sorted((ROOT / directory).rglob("*")):
            if path.suffix in extensions and "fonts" not in path.parts:
                characters.update(ord(character) for character in path.read_text())
    return characters


def generate_chunk(task):
    source_path, destination, relative, codepoints = task
    logging.getLogger("fontTools.subset").setLevel(logging.ERROR)
    font = TTFont(source_path, recalcTimestamp=False)
    options = subset.Options()
    options.flavor = "woff2"
    options.recalc_timestamp = False
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.layout_features = ["*"]
    # Mirrored Unicode aliases live in their own disjoint CSS ranges.
    options.bidi_closure = False
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=codepoints)
    subsetter.subset(font)
    output = Path(destination) / relative
    output.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2"
    font.save(output)
    # Check the actual encoded file, not just the requested subset list.
    encoded = TTFont(output)
    actual = set(encoded.getBestCmap())
    if actual != set(codepoints):
        raise ValueError(f"Encoded coverage differs: {relative}")
    data = output.read_bytes()
    return {
        "file": relative,
        "bytes": len(data),
        "sha256": sha256(data).hexdigest(),
        "ranges": ranges(actual),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    cache = Path(os.environ.get("XDG_CACHE_HOME", Path.home() / ".cache")) / "yahha-ui/fonts"
    parser.add_argument("--source-dir", type=Path, default=cache)
    args = parser.parse_args()
    if DESTINATION.is_symlink():
        raise ValueError(f"Generated font directory must not be a symbolic link: {DESTINATION}")
    common = site_characters()
    manifest = {
        "schemaVersion": 1,
        "generator": {
            "fontTools": fonttools_version,
            "brotli": brotli.__version__,
            "chunkSize": CHUNK_SIZE,
        },
        "fonts": [],
    }
    # Keep the existing generated directory intact if a download or subset fails.
    with tempfile.TemporaryDirectory(prefix="yahha-fonts-") as temporary:
        staging = Path(temporary) / "fonts"
        staging.mkdir()
        for source in SOURCES:
            data = load_source(source, args.source_dir)
            original_path = Path(temporary) / f"{source['id']}.ttf"
            original_path.write_bytes(data)
            original = TTFont(BytesIO(data))
            coverage = set(original.getBestCmap())
            first = coverage & common
            remaining = sorted(coverage - first)
            chunks = [("common", first)] + [
                (f"part-{index // CHUNK_SIZE:03d}", remaining[index : index + CHUNK_SIZE])
                for index in range(0, len(remaining), CHUNK_SIZE)
            ]
            tasks = [
                (str(original_path), str(staging), f"{source['id']}/{name}.woff2", sorted(values))
                for name, values in chunks
            ]
            with ProcessPoolExecutor(max_workers=min(4, os.cpu_count() or 1)) as workers:
                files = list(workers.map(generate_chunk, tasks))
            combined = set()
            for file in files:
                values = {value for start, end in file["ranges"] for value in range(start, end + 1)}
                if combined & values:
                    raise ValueError(f"Overlapping chunks: {source['id']}")
                combined.update(values)
            if combined != coverage:
                raise ValueError(f"Incomplete upstream coverage: {source['id']}")
            css = "/* Generated by npm run fonts:generate. */\n" + "\n".join(
                "@font-face {\n"
                f"  font-family: {source['family']};\n"
                f"  src: url('./{file['file']}') format('woff2');\n"
                "  font-style: normal;\n"
                "  font-weight: 400;\n"
                "  font-display: swap;\n"
                f"  unicode-range: {css_range(file['ranges'])};\n"
                "}\n"
                for file in files
            )
            css_name = f"{source['id']}.css"
            (staging / css_name).write_text(css)
            manifest["fonts"].append(
                {
                    "id": source["id"],
                    "family": source["family"],
                    "version": source["version"],
                    "weight": 400,
                    "source": {
                        key: source[key]
                        for key in ("url", "sha256", "archiveSha256", "archiveMember")
                        if key in source
                    },
                    "coverage": ranges(coverage),
                    "codepointCount": len(coverage),
                    "css": css_name,
                    "cssSha256": sha256(css.encode()).hexdigest(),
                    "files": files,
                }
            )
            print(
                f"{source['family']}: {len(coverage):,} codepoints, {len(files)} chunks, "
                f"common {files[0]['bytes']:,} bytes, total {sum(file['bytes'] for file in files):,} bytes",
                flush=True,
            )
        (staging / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
        DESTINATION.mkdir(parents=True, exist_ok=True)
        for path in DESTINATION.iterdir():
            if path.is_dir() and not path.is_symlink():
                shutil.rmtree(path)
            else:
                path.unlink()
        shutil.copytree(staging, DESTINATION, dirs_exist_ok=True)


if __name__ == "__main__":
    main()
