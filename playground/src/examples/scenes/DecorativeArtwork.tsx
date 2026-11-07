import { useState } from 'react';
import { Select, TextField } from 'yahha-ui';
import flowerPattern from './artwork/decorative-elements/patterns/flower-sprout.svg?no-inline';
import friendsPattern from './artwork/decorative-elements/friends/friends-pattern.svg?no-inline';
import friendsNote from './artwork/decorative-elements/friends/friends-note.svg?no-inline';
import chiikawa from './artwork/decorative-elements/friends/chiikawa-sticker.svg?no-inline';
import hachiware from './artwork/decorative-elements/friends/hachiware-sticker.svg?no-inline';
import usagi from './artwork/decorative-elements/friends/usagi-sticker.svg?no-inline';

/** Standalone composition: the characters are images and the heading remains real text. */
export default function DecorativeArtwork() {
  const [title, setTitle] = useState('今天的小发现');
  const [pattern, setPattern] = useState<string | null>('none');
  return (
    <div className="friends-decoration-demo">
      <style>{`
        .friends-decoration-demo { display: grid; gap: 24px; }
        .friends-decoration-controls { display: flex; align-items: center; flex-wrap: wrap; gap: 16px 24px; }
        .friends-decoration-controls > :first-child { flex: 1 1 240px; }
        .friends-decoration-stage { position: relative; isolation: isolate; background: var(--yahha-neutral-surface, #f1f8ff); padding: 20px; }
        .friends-decoration-pattern { position: absolute; inset: 0; z-index: -1; background-repeat: repeat; background-size: 340px; opacity: .32; pointer-events: none; }
        .friends-decoration-paper { position: relative; width: min(100%, 620px); margin: auto; container-type: inline-size; }
        .friends-decoration-paper > img { display: block; width: 100%; height: auto; }
        .friends-decoration-title { position: absolute; left: 18.95%; top: 51.25%; width: 62.63%; height: 28%; display: grid; place-items: center; margin: 0; padding: 0; text-align: center; overflow-wrap: anywhere; font-size: clamp(12px, 4cqw, 26px); font-weight: 600; line-height: 1.3; }
        .friends-decoration-strip { display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; }
        .friends-decoration-strip figure { display: grid; justify-items: center; gap: 4px; margin: 0; }
        .friends-decoration-strip img { display: block; width: 88px; height: 88px; object-fit: contain; }
        .friends-decoration-strip figcaption { font-size: 12px; color: var(--yahha-muted, #7a5c6d); }
        @media (max-width: 480px) { .friends-decoration-stage { padding: 12px 0; } .friends-decoration-strip { gap: 8px; } .friends-decoration-strip img { width: 72px; height: 72px; } }
        @media (forced-colors: active) { .friends-decoration-pattern { display: none; } }
      `}</style>
      <div className="friends-decoration-controls">
        <TextField
          label="纸签标题"
          value={title}
          maxLength={12}
          onChange={(event) => setTitle(event.currentTarget.value)}
          hint="标题是页面文字，可以编辑和复制。"
        />
        <Select
          label="背景图案"
          value={pattern}
          onValueChange={setPattern}
          options={[
            { value: 'none', label: '无图案' },
            { value: 'flower', label: '花草' },
            { value: 'friends', label: '朋友' },
          ]}
        />
      </div>
      <div className="friends-decoration-stage">
        {pattern !== 'none' && pattern !== null && (
          <div
            className="friends-decoration-pattern"
            style={{
              backgroundImage: `url("${pattern === 'friends' ? friendsPattern : flowerPattern}")`,
            }}
            aria-hidden="true"
          />
        )}
        <div className="friends-decoration-paper">
          <img src={friendsNote} alt="" width="760" height="400" />
          <h3 className="friends-decoration-title">{title.trim() || '今天的小发现'}</h3>
        </div>
      </div>
      <div className="friends-decoration-strip">
        {[
          { name: '吉伊', src: chiikawa },
          { name: '小八', src: hachiware },
          { name: '乌萨奇', src: usagi },
        ].map((friend) => (
          <figure key={friend.name}>
            <img src={friend.src} width="88" height="88" alt="" />
            <figcaption>{friend.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
