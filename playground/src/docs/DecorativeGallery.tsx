import catalogSource from '../examples/scenes/artwork/decorative-elements/catalog.json?raw';
import styles from './decorative-gallery.module.css';

type Item = { id: string; name: string; file: string; note?: string };
const catalog = JSON.parse(catalogSource) as Record<
  'patterns' | 'titles' | 'dividers' | 'motifs',
  Item[]
>;
const pictures = import.meta.glob<string>(
  '../examples/scenes/artwork/decorative-elements/**/*.svg',
  { eager: true, query: '?no-inline', import: 'default' },
);
const assetRoot = '../examples/scenes/artwork/decorative-elements/';
const friends: Item[] = [
  { id: 'chiikawa', name: '吉伊贴纸', file: 'friends/chiikawa-sticker.svg' },
  { id: 'hachiware', name: '小八贴纸', file: 'friends/hachiware-sticker.svg' },
  { id: 'usagi', name: '乌萨奇贴纸', file: 'friends/usagi-sticker.svg' },
  { id: 'note', name: '朋友纸签', file: 'friends/friends-note.svg' },
  { id: 'pattern', name: '朋友背景', file: 'friends/friends-pattern.svg' },
];

function Resource({ item, kind }: { item: Item; kind: string }) {
  const href = pictures[assetRoot + item.file];
  const isPattern = kind === 'patterns' || item.file.endsWith('friends-pattern.svg');
  return (
    <li className={styles.item}>
      <div
        className={`${styles.preview} ${kind === 'titles' ? styles.title : ''}`}
        style={isPattern ? { backgroundImage: `url("${href}")` } : undefined}
      >
        {!isPattern && <img src={href} alt="" loading="lazy" />}
        {kind === 'titles' && <span>今天的小发现</span>}
      </div>
      <h4>{item.name}</h4>
      <a href={href} download={item.file.split('/').at(-1)}>
        下载 SVG
      </a>
    </li>
  );
}

export default function DecorativeGallery() {
  return (
    <div className={styles.gallery}>
      <h3>吉伊和朋友们</h3>
      <ul className={styles.grid}>
        {friends.map((item) => (
          <Resource key={item.id} item={item} kind="friends" />
        ))}
      </ul>
      {(
        [
          ['patterns', '背景纹样'],
          ['titles', '标题底形'],
          ['dividers', '装饰分隔线'],
          ['motifs', '小图案与贴纸'],
        ] as const
      ).map(([kind, title]) => (
        <details key={kind} className={styles.group}>
          <summary>
            {title} · {catalog[kind].length} 种
          </summary>
          <ul className={styles.grid}>
            {catalog[kind].map((item) => (
              <Resource key={item.id} item={item} kind={kind} />
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
