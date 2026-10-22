/**
 * Structured data emitter.
 *
 * Rendered as a plain <script> in the server component tree, so the JSON-LD is present
 * in the initial HTML response and does not depend on JavaScript executing. A crawler
 * that does not run scripts still sees the entity graph.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from typed constants in src/lib/schema.ts, never from
      // user input, so there is no injection surface here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
