import type { ReactNode } from 'react';
import { ChevronDown, Code2 } from 'lucide-react';

export function Art({ src, className = '' }: { src: string; className?: string }) {
  return (
    <img
      className={`character-art ${className}`}
      src={src}
      width="1536"
      height="1024"
      alt=""
      draggable={false}
    />
  );
}

function CodeSample({ children }: { children: string }) {
  return (
    <details className="code-sample">
      <summary>
        <Code2 size={14} />
        React 用法
        <ChevronDown size={14} />
      </summary>
      <pre>
        <code>{children}</code>
      </pre>
    </details>
  );
}

export function DemoSection({
  id,
  title,
  component,
  description,
  children,
  code,
}: {
  id: string;
  title: string;
  component: string;
  description: string;
  children: ReactNode;
  code: string;
}) {
  return (
    <section id={id} className="demo-section" aria-labelledby={`${id}-title`}>
      <header className="section-heading">
        <div>
          <h2 id={`${id}-title`}>
            {title}
            <code>{component}</code>
          </h2>
          <p>{description}</p>
        </div>
      </header>
      {children}
      <CodeSample>{code}</CodeSample>
    </section>
  );
}
