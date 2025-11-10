/**
 * Text highlighting utilities
 * Used for highlighting search terms in text
 */

/**
 * Highlights matching text in a string
 * @param text - The text to highlight in
 * @param query - The search query to highlight
 * @returns Array of text parts with highlight flags
 */
export function highlightText(
  text: string,
  query: string
): Array<{ text: string; highlight: boolean }> {
  if (!query || !text) {
    return [{ text, highlight: false }];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();

  if (!normalizedQuery || !normalizedText.includes(normalizedQuery)) {
    return [{ text, highlight: false }];
  }

  const parts: Array<{ text: string; highlight: boolean }> = [];
  let currentIndex = 0;
  let matchIndex = normalizedText.indexOf(normalizedQuery);

  while (matchIndex !== -1) {
    // Add text before match
    if (matchIndex > currentIndex) {
      parts.push({
        text: text.substring(currentIndex, matchIndex),
        highlight: false,
      });
    }

    // Add matched text
    parts.push({
      text: text.substring(matchIndex, matchIndex + query.length),
      highlight: true,
    });

    currentIndex = matchIndex + query.length;
    matchIndex = normalizedText.indexOf(normalizedQuery, currentIndex);
  }

  // Add remaining text after last match
  if (currentIndex < text.length) {
    parts.push({
      text: text.substring(currentIndex),
      highlight: false,
    });
  }

  return parts;
}

/**
 * Component for rendering highlighted text
 */
export interface HighlightedTextProps {
  text: string;
  query?: string;
  className?: string;
  highlightClassName?: string;
}

/**
 * React component that renders text with highlighted matches
 */
export function HighlightedText({
  text,
  query,
  className,
  highlightClassName = 'bg-yellow-200 text-neutral-900 font-semibold',
}: HighlightedTextProps) {
  const parts = highlightText(text, query || '');

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.highlight ? (
          <mark key={index} className={highlightClassName}>
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </span>
  );
}
