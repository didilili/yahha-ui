import { EmptyState, Text } from 'yahha-ui';
import emptyCollectionArtwork from './artwork/little-days-empty-collection.svg?no-inline';
import emptySearchArtwork from './artwork/little-days-search-empty.svg?no-inline';

export default function EmptyIllustrations() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: 24,
      }}
    >
      {[
        { label: '收藏口袋', src: emptyCollectionArtwork },
        { label: '搜索纸条', src: emptySearchArtwork },
      ].map(({ label, src }) => (
        <div key={label}>
          <Text size="sm" tone="muted">
            {label}
          </Text>
          <EmptyState
            title="还没有手记"
            description="写下今天想记住的一件小事。"
            illustration={
              <img
                src={src}
                alt=""
                width="240"
                height="180"
                style={{
                  display: 'block',
                  width: 'min(240px, 100%)',
                  height: 'auto',
                  margin: 'auto',
                }}
              />
            }
          />
        </div>
      ))}
    </div>
  );
}
