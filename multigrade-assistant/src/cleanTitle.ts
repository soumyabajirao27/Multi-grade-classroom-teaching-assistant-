/**
 * Strips subject brackets/parentheses from topic titles in English, Hindi, and Marathi.
 * E.g., "Water (EVS)" -> "Water", "[EVS] Water" -> "Water",
 * "जल (पर्यावरण अध्ययन)" -> "जल", "पाणी (परिसर अभ्यास)" -> "पाणी",
 * "Numbers in the Market (Maths)" -> "Numbers in the Market",
 * "बाज़ार में संख्याएँ (गणित)" -> "बाज़ार में संख्याएँ"
 */
export function cleanTopicTitle(title: string): string {
  if (!title) return '';
  return title
    .replace(/^\[(EVS|Maths|पर्यावरण अध्ययन|पर्यावरण|परिसर अभ्यास|गणित)\]\s*/i, '')
    .replace(/\s*\[(EVS|Maths|पर्यावरण अध्ययन|पर्यावरण|परिसर अभ्यास|गणित)\]/i, '')
    .replace(/\s*\((EVS|Maths|पर्यावरण अध्ययन|पर्यावरण|परिसर अभ्यास|गणित)\)/i, '')
    .trim();
}
