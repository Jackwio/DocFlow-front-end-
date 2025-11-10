/**
 * Re-exports (single source-of-truth) from the TSX implementation.
 *
 * Keeping this small `.ts` file allows imports like `@/utils/highlighting`
 * to work even when some resolvers prefer `.ts` over `.tsx`.
 */
export { highlightText, HighlightedText } from './highlighting.tsx';
export type { HighlightedTextProps } from './highlighting.tsx';
