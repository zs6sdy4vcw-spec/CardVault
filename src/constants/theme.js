export const COLORS = {
  bg: '#0a0c10',
  surface: '#111318',
  card: '#161a22',
  border: '#1e2430',
  accent: '#e8b84b',
  accentDim: '#b8913a',
  red: '#e84b4b',
  green: '#4be87a',
  blue: '#4b9fe8',
  text: '#eef0f4',
  muted: '#6b7280',
  mutedLight: '#9ca3af',
  nhl: '#4b9fe8',
  nfl: '#e84b4b',
};

export const SPORT_COLORS = { NHL: COLORS.nhl, NFL: COLORS.nfl };
export const SPORT_EMOJIS = { NHL: '🏒', NFL: '🏈' };

export const CONDITIONS = [
  // ── Non gradé ──────────────────────────────────────────────────────────────
  'Ungraded / Raw',
  'Near Mint / Mint (NM/MT)',
  'Near Mint (NM)',
  'Excellent / Mint (EX/MT)',
  'Excellent (EX)',
  'Very Good / Excellent (VG/EX)',
  'Very Good (VG)',
  'Good (G)',
  'Fair',
  'Poor',
  // ── PSA ────────────────────────────────────────────────────────────────────
  'PSA 10 — Gem Mint',
  'PSA 9 — Mint',
  'PSA 8.5 — NM/MT+',
  'PSA 8 — NM/MT',
  'PSA 7.5 — NM+',
  'PSA 7 — Near Mint',
  'PSA 6 — EX/MT',
  'PSA 5 — EX',
  'PSA 4 — VG/EX',
  'PSA 3 — VG',
  'PSA 2 — Good',
  'PSA 1.5 — Fair',
  'PSA 1 — Poor',
  // ── BGS / Beckett ──────────────────────────────────────────────────────────
  'BGS 10 — Pristine',
  'BGS 9.5 — Gem Mint',
  'BGS 9 — Mint',
  'BGS 8.5 — NM/MT+',
  'BGS 8 — NM/MT',
  'BGS 7.5 — NM+',
  'BGS 7 — Near Mint',
  'BGS 6.5 — EX/MT+',
  'BGS 6 — EX/MT',
  // ── SGC ────────────────────────────────────────────────────────────────────
  'SGC 10 — Pristine',
  'SGC 9.5 — Mint+',
  'SGC 9 — Mint',
  'SGC 8.5 — NM/MT+',
  'SGC 8 — NM/MT',
  'SGC 7.5 — NM+',
  'SGC 7 — Near Mint',
  // ── CGC ────────────────────────────────────────────────────────────────────
  'CGC 10 — Pristine',
  'CGC 9.5 — Gem Mint',
  'CGC 9 — Mint',
  'CGC 8.5 — NM/MT+',
  'CGC 8 — NM/MT',
];

export const CAD_USD_RATE = 0.74;
export const formatCAD = (v) => `CA$${Number(v).toFixed(2)}`;
export const formatUSD = (v) => `US$${Number(v).toFixed(2)}`;
export const formatBoth = (cad) => `${formatCAD(cad)} / ${formatUSD(cad * CAD_USD_RATE)}`;

export const SAMPLE_CARDS = [
  { id: 1, player: 'Connor McDavid', team: 'Edmonton Oilers', sport: 'NHL', year: '2015-16', set: 'Upper Deck Young Guns', condition: 'Mint 9', valueCad: 1200, quantity: 1, notes: 'RC rookie card', cardNumber: '201', img: null },
  { id: 2, player: 'Patrick Mahomes', team: 'Kansas City Chiefs', sport: 'NFL', year: '2017', set: 'Panini Prizm', condition: 'Gem Mint 10', valueCad: 3500, quantity: 1, notes: 'PSA graded', cardNumber: '269', img: null },
  { id: 3, player: 'Auston Matthews', team: 'Toronto Maple Leafs', sport: 'NHL', year: '2016-17', set: 'O-Pee-Chee Platinum', condition: 'Near Mint 8', valueCad: 420, quantity: 2, notes: '', cardNumber: '', img: null },
  { id: 4, player: 'Josh Allen', team: 'Buffalo Bills', sport: 'NFL', year: '2018', set: 'Panini Donruss Optic', condition: 'Mint 9', valueCad: 890, quantity: 1, notes: 'Auto version', cardNumber: '', img: null },
];
