import type { CSSProperties } from 'react';
import { Divider } from 'yahha-ui';
import flowerLine from './artwork/decorative-elements/dividers/flower-line.svg?no-inline';

const artworkStyle = {
  width: '100%',
  '--chapter-flower-art': `url(${JSON.stringify(flowerLine)})`,
} as CSSProperties;

export default function DividerChapter() {
  return (
    <div style={artworkStyle}>
      <style>{`
        .yahha-chapter-divider {
          border: 0;
          block-size: 48px;
          background: var(--chapter-flower-art) center / 600px 48px no-repeat;
        }
        @media (forced-colors: active) {
          .yahha-chapter-divider {
            block-size: 0;
            border-block-start: var(--yahha-border-width, 1px) solid CanvasText;
            background: none;
          }
        }
      `}</style>
      <Divider className="yahha-chapter-divider" />
    </div>
  );
}
