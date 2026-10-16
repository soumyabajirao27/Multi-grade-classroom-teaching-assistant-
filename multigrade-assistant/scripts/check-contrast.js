// Calculation of relative luminance and contrast ratios under WCAG 2.1
function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}

function sRgbLuminance([r, g, b]) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(hex1, hex2) {
  const l1 = sRgbLuminance(hexToRgb(hex1));
  const l2 = sRgbLuminance(hexToRgb(hex2));
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Number(ratio.toFixed(2));
}

const pairs = [
  // Light theme
  { name: 'Light body text on bg', fg: '#1A2925', bg: '#F9F6F0', min: 4.5 },
  { name: 'Light body text on card', fg: '#1A2925', bg: '#FFFFFF', min: 4.5 },
  { name: 'Light muted text on bg', fg: '#50635C', bg: '#F9F6F0', min: 4.5 },
  { name: 'Light muted text on card', fg: '#50635C', bg: '#FFFFFF', min: 4.5 },
  { name: 'Light chalkboard header text', fg: '#FFFFFF', bg: '#143831', min: 4.5 },
  { name: 'Light marigold primary btn text', fg: '#1F1C16', bg: '#E29000', min: 4.5 },
  { name: 'Light success green on card', fg: '#16643C', bg: '#FFFFFF', min: 4.5 },
  { name: 'Light error red on card', fg: '#B53018', bg: '#FFFFFF', min: 4.5 },
  
  // Grade tags on light card
  { name: 'G1 on card', fg: '#A62619', bg: '#FFFFFF', min: 4.5 },
  { name: 'G2 on card', fg: '#8C5600', bg: '#FFFFFF', min: 4.5 },
  { name: 'G3 on card', fg: '#16643C', bg: '#FFFFFF', min: 4.5 },
  { name: 'G4 on card', fg: '#195B8A', bg: '#FFFFFF', min: 4.5 },
  { name: 'G5 on card', fg: '#692C84', bg: '#FFFFFF', min: 4.5 },

  // Dark theme
  { name: 'Dark body text on bg', fg: '#E5EDE9', bg: '#101715', min: 4.5 },
  { name: 'Dark body text on card', fg: '#E5EDE9', bg: '#18221F', min: 4.5 },
  { name: 'Dark muted text on bg', fg: '#9DB3AA', bg: '#101715', min: 4.5 },
  { name: 'Dark muted text on card', fg: '#9DB3AA', bg: '#18221F', min: 4.5 },
  { name: 'Dark header text', fg: '#E5EDE9', bg: '#101715', min: 4.5 },
  { name: 'Dark marigold btn text', fg: '#141414', bg: '#F5A623', min: 4.5 },
  { name: 'Dark success green on card', fg: '#59D999', bg: '#18221F', min: 4.5 },
  { name: 'Dark error red on card', fg: '#FF8A75', bg: '#18221F', min: 4.5 },

  // Grade tags on dark card
  { name: 'Dark G1 on card', fg: '#FF7B6B', bg: '#18221F', min: 4.5 },
  { name: 'Dark G2 on card', fg: '#FFB84D', bg: '#18221F', min: 4.5 },
  { name: 'Dark G3 on card', fg: '#59D999', bg: '#18221F', min: 4.5 },
  { name: 'Dark G4 on card', fg: '#6AB8F7', bg: '#18221F', min: 4.5 },
  { name: 'Dark G5 on card', fg: '#CB8FFF', bg: '#18221F', min: 4.5 },
];

console.log('--- Contrast Ratio Check (WCAG AA Target: >= 4.5:1) ---');
let allPass = true;
for (const p of pairs) {
  const c = contrast(p.fg, p.bg);
  const pass = c >= p.min;
  if (!pass) allPass = false;
  console.log(`${pass ? 'PASS' : 'FAIL'} [${c}:1] ${p.name} (fg: ${p.fg}, bg: ${p.bg}, min: ${p.min}:1)`);
}

if (!allPass) {
  process.exit(1);
} else {
  console.log('\nAll color token combinations pass WCAG AA (>= 4.5:1) requirement!');
}
