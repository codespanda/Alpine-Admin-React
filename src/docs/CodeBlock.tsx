/*
 * Self-contained code block with a copy-to-clipboard button.
 * Depends only on React — nothing from the rest of the app.
 */
import { useState } from 'react';

export function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div className="alpine-docs__code">
      <div className="alpine-docs__code-head">
        <span className="alpine-docs__code-lang">{lang}</span>
        <button
          type="button"
          onClick={copy}
          className={`alpine-docs__copy${copied ? ' is-copied' : ''}`}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
