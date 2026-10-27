export type ExampleThemeScope = 'inherited' | 'explicit';

/** App.tsx for a separate, unchanged Example.tsx module; no source parsing or rewriting. */
export function createExampleEntry(themeScope: ExampleThemeScope = 'inherited'): string {
  if (themeScope === 'explicit') {
    return `import Example from './Example';
import 'yahha-ui/style.css';

export default function App() {
  return <Example />;
}
`;
  }
  return `import { ThemeProvider } from 'yahha-ui';
import Example from './Example';
import 'yahha-ui/style.css';

export default function App() {
  return (
    <ThemeProvider theme="chiikawa">
      <Example />
    </ThemeProvider>
  );
}
`;
}
