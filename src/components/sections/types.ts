import type { Edit } from "../../lib/edit";

/** Props every section component gets from Sections.astro */
export interface SectionProps {
  /** The stored section (block) values */
  b: Record<string, any>;
  /** Editing attributes for this section's fields */
  e: Edit;
  /** True when this is a white section right after another white one: it skips its top padding */
  flush: boolean;
  /** Position among sections of the same type on the page (0 = first) */
  n: number;
}
