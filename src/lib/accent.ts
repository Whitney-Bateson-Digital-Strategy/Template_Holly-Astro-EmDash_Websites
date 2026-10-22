/**
 * Splits headline text on *asterisks*: "Food that *fits your life*" → [{text:"Food that "}, {text:"fits your life", hl:true}].
 * A lone or unmatched asterisk is kept as plain text, so a typo never hides words.
 */
export interface AccentPart { text: string; hl?: boolean }

export function splitAccent(raw: string): AccentPart[] {
  const parts: AccentPart[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  for (let m = re.exec(raw); m; m = re.exec(raw)) {
    if (m.index > last) parts.push({ text: raw.slice(last, m.index) });
    parts.push({ text: m[1], hl: true });
    last = re.lastIndex;
  }
  if (last < raw.length) parts.push({ text: raw.slice(last) });
  return parts;
}

/** Headline text without the asterisks (for page titles, alt text, etc.) */
export const plainAccent = (raw: string) => splitAccent(raw).map((p) => p.text).join("");
