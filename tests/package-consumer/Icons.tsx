import { useEffect, useRef, useState } from 'react';
import {
  BookmarkIcon,
  Button,
  Icon,
  IconButton,
  TextField,
  ThemeProvider,
  type IconTone,
} from 'yahha-ui';

const themes = ['pink', 'blue', 'yellow'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
const tones: IconTone[] = [
  'inherit',
  'default',
  'muted',
  'accent',
  'success',
  'warning',
  'error',
  'info',
];
const row = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 } as const;

function ThemeIcons({ theme }: { theme: (typeof themes)[number] }) {
  const [saved, setSaved] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (svgRef.current instanceof SVGSVGElement) svgRef.current.dataset.refChecked = 'svg';
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <section data-icons-theme={theme} style={{ display: 'grid', gap: 16, minWidth: 0 }}>
        <h2>{theme}</h2>
        <div style={row}>
          <IconButton
            variant="secondary"
            aria-label={`Bookmark ${theme}`}
            aria-pressed={saved}
            data-testid="bookmark-toggle"
            onClick={() => setSaved((value) => !value)}
          >
            <BookmarkIcon filled={saved} data-testid="bookmark-toggle-glyph" />
          </IconButton>
          <span role="status">{saved ? 'Saved' : 'Not saved'}</span>
          <BookmarkIcon filled fill="gold" fillOpacity={1} data-testid="bookmark-opaque-glyph" />
        </div>

        <div style={row}>
          {sizes.map((size) => (
            <Button
              key={size}
              size={size}
              variant="secondary"
              data-testid={`host-button-${size}`}
              startIcon={<BookmarkIcon size={80} />}
            >
              Button {size}
            </Button>
          ))}
        </div>
        <div style={row}>
          {sizes.map((size) => (
            <IconButton
              key={size}
              size={size}
              variant="secondary"
              aria-label={`Host ${size} ${theme}`}
              data-testid={`host-icon-button-${size}`}
            >
              <BookmarkIcon size={80} />
            </IconButton>
          ))}
        </div>
        <div data-testid="host-field" style={{ minWidth: 0 }}>
          <TextField label={`Icon field ${theme}`} leading={<BookmarkIcon size={80} />} />
        </div>

        <div style={row}>
          {sizes.map((size) => (
            <span key={size}>
              {size}{' '}
              <Icon size={size} data-testid={`standalone-${size}`}>
                <circle cx="12" cy="12" r="8" />
              </Icon>
            </span>
          ))}
          <span>
            28{' '}
            <Icon size={28} data-testid="standalone-number">
              <circle cx="12" cy="12" r="8" />
            </Icon>
          </span>
          <span data-testid="ref-host">
            <Icon ref={svgRef} data-testid="root-ref">
              <circle cx="12" cy="12" r="8" />
            </Icon>
          </span>
        </div>

        <div style={row}>
          <Icon
            size={28}
            viewBox="-2 0 40 16"
            preserveAspectRatio="xMinYMid meet"
            fill="none"
            data-testid="custom-paint"
          >
            <path d="M0 2h12v12H0Z" fill="#d05265" />
            <path d="M20 2h12v12H20Z" fill="#357ca8" />
          </Icon>
          <svg
            viewBox="-2 0 40 16"
            width="28"
            height="28"
            preserveAspectRatio="xMinYMid meet"
            fill="none"
            aria-hidden="true"
            focusable="false"
            data-testid="native-paint"
          >
            <path d="M0 2h12v12H0Z" fill="#d05265" />
            <path d="M20 2h12v12H20Z" fill="#357ca8" />
          </svg>
          <Icon aria-label={`Named icon ${theme}`} data-testid="named-icon">
            <circle cx="12" cy="12" r="8" />
          </Icon>
          <span id={`icons-label-${theme}`}>Labelled icon {theme}</span>
          <Icon aria-labelledby={`icons-label-${theme}`} data-testid="labelled-icon">
            <circle cx="12" cy="12" r="8" />
          </Icon>
          <Icon data-testid="decorative-icon">
            <circle cx="12" cy="12" r="8" />
          </Icon>
          <Icon aria-label={`Hidden icon ${theme}`} aria-hidden="true" data-testid="hidden-icon">
            <circle cx="12" cy="12" r="8" />
          </Icon>
        </div>

        <div style={row}>
          {tones.map((tone) => (
            <span key={tone}>
              {tone}{' '}
              <Icon tone={tone} stroke="currentColor" data-testid={`tone-${tone}`}>
                <circle cx="12" cy="12" r="8" />
              </Icon>
            </span>
          ))}
          <span style={{ color: '#235e73' }}>
            <Icon data-testid="inherited-color">
              <circle cx="12" cy="12" r="8" />
            </Icon>
          </span>
          <Icon color="#693c7e" data-testid="native-color">
            <circle cx="12" cy="12" r="8" />
          </Icon>
        </div>
      </section>
    </ThemeProvider>
  );
}

export function Icons() {
  return (
    <main
      style={{
        display: 'grid',
        gap: 24,
        maxWidth: 960,
        minWidth: 0,
        margin: '0 auto',
        padding: 12,
      }}
    >
      <h1>Installed icons consumer</h1>
      {themes.map((theme) => (
        <ThemeIcons key={theme} theme={theme} />
      ))}
    </main>
  );
}
