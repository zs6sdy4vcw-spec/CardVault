// ─────────────────────────────────────────────────────────────────────────────
// Base de données des équipes sportives — CardVault
// Couleurs HEX officielles — NHL, NFL, NBA, MLB
// Source : teamcolorcodes.com / jimniels/teamcolors
// ─────────────────────────────────────────────────────────────────────────────

export const TEAMS = {

  // ── NHL ────────────────────────────────────────────────────────────────────
  NHL: [
    { name: 'Anaheim Ducks',          abbr: 'ANA', primary: '#F47A38', secondary: '#B9975B', city: 'Anaheim' },
    { name: 'Arizona Coyotes',        abbr: 'ARI', primary: '#8C2633', secondary: '#E2D6B5', city: 'Arizona' },
    { name: 'Boston Bruins',          abbr: 'BOS', primary: '#FFB81C', secondary: '#000000', city: 'Boston' },
    { name: 'Buffalo Sabres',         abbr: 'BUF', primary: '#003087', secondary: '#FFB81C', city: 'Buffalo' },
    { name: 'Calgary Flames',         abbr: 'CGY', primary: '#C8102E', secondary: '#F1BE48', city: 'Calgary' },
    { name: 'Carolina Hurricanes',    abbr: 'CAR', primary: '#CC0000', secondary: '#000000', city: 'Carolina' },
    { name: 'Chicago Blackhawks',     abbr: 'CHI', primary: '#CF0A2C', secondary: '#000000', city: 'Chicago' },
    { name: 'Colorado Avalanche',     abbr: 'COL', primary: '#6F263D', secondary: '#236192', city: 'Colorado' },
    { name: 'Columbus Blue Jackets',  abbr: 'CBJ', primary: '#002654', secondary: '#CE1126', city: 'Columbus' },
    { name: 'Dallas Stars',           abbr: 'DAL', primary: '#006847', secondary: '#8F8F8C', city: 'Dallas' },
    { name: 'Detroit Red Wings',      abbr: 'DET', primary: '#CE1126', secondary: '#FFFFFF', city: 'Detroit' },
    { name: 'Edmonton Oilers',        abbr: 'EDM', primary: '#FF4C00', secondary: '#003B7B', city: 'Edmonton' },
    { name: 'Florida Panthers',       abbr: 'FLA', primary: '#041E42', secondary: '#C8102E', city: 'Florida' },
    { name: 'Los Angeles Kings',      abbr: 'LAK', primary: '#111111', secondary: '#A2AAAD', city: 'Los Angeles' },
    { name: 'Minnesota Wild',         abbr: 'MIN', primary: '#154734', secondary: '#A6192E', city: 'Minnesota' },
    { name: 'Montréal Canadiens',     abbr: 'MTL', primary: '#AF1E2D', secondary: '#192168', city: 'Montréal' },
    { name: 'Nashville Predators',    abbr: 'NSH', primary: '#FFB81C', secondary: '#041E42', city: 'Nashville' },
    { name: 'New Jersey Devils',      abbr: 'NJD', primary: '#CE1126', secondary: '#000000', city: 'New Jersey' },
    { name: 'New York Islanders',     abbr: 'NYI', primary: '#00539B', secondary: '#F47D30', city: 'New York' },
    { name: 'New York Rangers',       abbr: 'NYR', primary: '#0038A8', secondary: '#CE1126', city: 'New York' },
    { name: 'Ottawa Senators',        abbr: 'OTT', primary: '#C52032', secondary: '#C69214', city: 'Ottawa' },
    { name: 'Philadelphia Flyers',    abbr: 'PHI', primary: '#F74902', secondary: '#000000', city: 'Philadelphia' },
    { name: 'Pittsburgh Penguins',    abbr: 'PIT', primary: '#000000', secondary: '#CFC493', city: 'Pittsburgh' },
    { name: 'San Jose Sharks',        abbr: 'SJS', primary: '#006D75', secondary: '#EA7200', city: 'San Jose' },
    { name: 'Seattle Kraken',         abbr: 'SEA', primary: '#001628', secondary: '#99D9D9', city: 'Seattle' },
    { name: 'St. Louis Blues',        abbr: 'STL', primary: '#002F87', secondary: '#FCB514', city: 'St. Louis' },
    { name: 'Tampa Bay Lightning',    abbr: 'TBL', primary: '#002868', secondary: '#FFFFFF', city: 'Tampa Bay' },
    { name: 'Toronto Maple Leafs',    abbr: 'TOR', primary: '#003E7E', secondary: '#FFFFFF', city: 'Toronto' },
    { name: 'Utah Hockey Club',       abbr: 'UTA', primary: '#010101', secondary: '#69B3E7', city: 'Utah' },
    { name: 'Vancouver Canucks',      abbr: 'VAN', primary: '#00205B', secondary: '#00843D', city: 'Vancouver' },
    { name: 'Vegas Golden Knights',   abbr: 'VGK', primary: '#B4975A', secondary: '#333F42', city: 'Vegas' },
    { name: 'Washington Capitals',    abbr: 'WSH', primary: '#041E42', secondary: '#C8102E', city: 'Washington' },
    { name: 'Winnipeg Jets',          abbr: 'WPG', primary: '#041E42', secondary: '#004C97', city: 'Winnipeg' },
  ],

  // ── NFL ────────────────────────────────────────────────────────────────────
  NFL: [
    { name: 'Arizona Cardinals',      abbr: 'ARI', primary: '#97233F', secondary: '#000000', city: 'Arizona' },
    { name: 'Atlanta Falcons',        abbr: 'ATL', primary: '#A71930', secondary: '#000000', city: 'Atlanta' },
    { name: 'Baltimore Ravens',       abbr: 'BAL', primary: '#241773', secondary: '#000000', city: 'Baltimore' },
    { name: 'Buffalo Bills',          abbr: 'BUF', primary: '#00338D', secondary: '#C60C30', city: 'Buffalo' },
    { name: 'Carolina Panthers',      abbr: 'CAR', primary: '#0085CA', secondary: '#000000', city: 'Carolina' },
    { name: 'Chicago Bears',          abbr: 'CHI', primary: '#0B162A', secondary: '#C83803', city: 'Chicago' },
    { name: 'Cincinnati Bengals',     abbr: 'CIN', primary: '#FB4F14', secondary: '#000000', city: 'Cincinnati' },
    { name: 'Cleveland Browns',       abbr: 'CLE', primary: '#311D00', secondary: '#FF3C00', city: 'Cleveland' },
    { name: 'Dallas Cowboys',         abbr: 'DAL', primary: '#003594', secondary: '#869397', city: 'Dallas' },
    { name: 'Denver Broncos',         abbr: 'DEN', primary: '#FB4F14', secondary: '#002244', city: 'Denver' },
    { name: 'Detroit Lions',          abbr: 'DET', primary: '#0076B6', secondary: '#B0B7BC', city: 'Detroit' },
    { name: 'Green Bay Packers',      abbr: 'GB',  primary: '#203731', secondary: '#FFB612', city: 'Green Bay' },
    { name: 'Houston Texans',         abbr: 'HOU', primary: '#03202F', secondary: '#A71930', city: 'Houston' },
    { name: 'Indianapolis Colts',     abbr: 'IND', primary: '#002C5F', secondary: '#A2AAAD', city: 'Indianapolis' },
    { name: 'Jacksonville Jaguars',   abbr: 'JAX', primary: '#006778', secondary: '#9F792C', city: 'Jacksonville' },
    { name: 'Kansas City Chiefs',     abbr: 'KC',  primary: '#E31837', secondary: '#FFB81C', city: 'Kansas City' },
    { name: 'Las Vegas Raiders',      abbr: 'LV',  primary: '#000000', secondary: '#A5ACAF', city: 'Las Vegas' },
    { name: 'Los Angeles Chargers',   abbr: 'LAC', primary: '#0080C6', secondary: '#FFC20E', city: 'Los Angeles' },
    { name: 'Los Angeles Rams',       abbr: 'LAR', primary: '#003594', secondary: '#FFA300', city: 'Los Angeles' },
    { name: 'Miami Dolphins',         abbr: 'MIA', primary: '#008E97', secondary: '#FC4C02', city: 'Miami' },
    { name: 'Minnesota Vikings',      abbr: 'MIN', primary: '#4F2683', secondary: '#FFC62F', city: 'Minnesota' },
    { name: 'New England Patriots',   abbr: 'NE',  primary: '#002244', secondary: '#C60C30', city: 'New England' },
    { name: 'New Orleans Saints',     abbr: 'NO',  primary: '#D3BC8D', secondary: '#000000', city: 'New Orleans' },
    { name: 'New York Giants',        abbr: 'NYG', primary: '#0B2265', secondary: '#A71930', city: 'New York' },
    { name: 'New York Jets',          abbr: 'NYJ', primary: '#125740', secondary: '#000000', city: 'New York' },
    { name: 'Philadelphia Eagles',    abbr: 'PHI', primary: '#004C54', secondary: '#A5ACAF', city: 'Philadelphia' },
    { name: 'Pittsburgh Steelers',    abbr: 'PIT', primary: '#000000', secondary: '#FFB612', city: 'Pittsburgh' },
    { name: 'San Francisco 49ers',    abbr: 'SF',  primary: '#AA0000', secondary: '#B3995D', city: 'San Francisco' },
    { name: 'Seattle Seahawks',       abbr: 'SEA', primary: '#002244', secondary: '#69BE28', city: 'Seattle' },
    { name: 'Tampa Bay Buccaneers',   abbr: 'TB',  primary: '#D50A0A', secondary: '#FF7900', city: 'Tampa Bay' },
    { name: 'Tennessee Titans',       abbr: 'TEN', primary: '#0C2340', secondary: '#4B92DB', city: 'Tennessee' },
    { name: 'Washington Commanders',  abbr: 'WAS', primary: '#5A1414', secondary: '#FFB612', city: 'Washington' },
  ],

  // ── NBA ────────────────────────────────────────────────────────────────────
  NBA: [
    { name: 'Atlanta Hawks',          abbr: 'ATL', primary: '#C1D32F', secondary: '#E03A3E', city: 'Atlanta' },
    { name: 'Boston Celtics',         abbr: 'BOS', primary: '#007A33', secondary: '#BA9653', city: 'Boston' },
    { name: 'Brooklyn Nets',          abbr: 'BKN', primary: '#000000', secondary: '#FFFFFF', city: 'Brooklyn' },
    { name: 'Charlotte Hornets',      abbr: 'CHA', primary: '#1D1160', secondary: '#00788C', city: 'Charlotte' },
    { name: 'Chicago Bulls',          abbr: 'CHI', primary: '#CE1141', secondary: '#000000', city: 'Chicago' },
    { name: 'Cleveland Cavaliers',    abbr: 'CLE', primary: '#860038', secondary: '#FDBB30', city: 'Cleveland' },
    { name: 'Dallas Mavericks',       abbr: 'DAL', primary: '#00538C', secondary: '#002B5E', city: 'Dallas' },
    { name: 'Denver Nuggets',         abbr: 'DEN', primary: '#0E2240', secondary: '#FEC524', city: 'Denver' },
    { name: 'Detroit Pistons',        abbr: 'DET', primary: '#C8102E', secondary: '#006BB6', city: 'Detroit' },
    { name: 'Golden State Warriors',  abbr: 'GSW', primary: '#1D428A', secondary: '#FFC72C', city: 'Golden State' },
    { name: 'Houston Rockets',        abbr: 'HOU', primary: '#CE1141', secondary: '#000000', city: 'Houston' },
    { name: 'Indiana Pacers',         abbr: 'IND', primary: '#002D62', secondary: '#FDBB30', city: 'Indiana' },
    { name: 'LA Clippers',            abbr: 'LAC', primary: '#C8102E', secondary: '#1D428A', city: 'Los Angeles' },
    { name: 'Los Angeles Lakers',     abbr: 'LAL', primary: '#552583', secondary: '#FDB927', city: 'Los Angeles' },
    { name: 'Memphis Grizzlies',      abbr: 'MEM', primary: '#5D76A9', secondary: '#12173F', city: 'Memphis' },
    { name: 'Miami Heat',             abbr: 'MIA', primary: '#98002E', secondary: '#F9A01B', city: 'Miami' },
    { name: 'Milwaukee Bucks',        abbr: 'MIL', primary: '#00471B', secondary: '#EEE1C6', city: 'Milwaukee' },
    { name: 'Minnesota Timberwolves', abbr: 'MIN', primary: '#0C2340', secondary: '#236192', city: 'Minnesota' },
    { name: 'New Orleans Pelicans',   abbr: 'NOP', primary: '#0C2340', secondary: '#C8102E', city: 'New Orleans' },
    { name: 'New York Knicks',        abbr: 'NYK', primary: '#006BB6', secondary: '#F58426', city: 'New York' },
    { name: 'Oklahoma City Thunder',  abbr: 'OKC', primary: '#007AC1', secondary: '#EF3B24', city: 'Oklahoma City' },
    { name: 'Orlando Magic',          abbr: 'ORL', primary: '#0077C0', secondary: '#000000', city: 'Orlando' },
    { name: 'Philadelphia 76ers',     abbr: 'PHI', primary: '#006BB6', secondary: '#ED174C', city: 'Philadelphia' },
    { name: 'Phoenix Suns',           abbr: 'PHX', primary: '#1D1160', secondary: '#E56020', city: 'Phoenix' },
    { name: 'Portland Trail Blazers', abbr: 'POR', primary: '#E03A3E', secondary: '#000000', city: 'Portland' },
    { name: 'Sacramento Kings',       abbr: 'SAC', primary: '#5A2D81', secondary: '#63727A', city: 'Sacramento' },
    { name: 'San Antonio Spurs',      abbr: 'SAS', primary: '#000000', secondary: '#C4CED4', city: 'San Antonio' },
    { name: 'Toronto Raptors',        abbr: 'TOR', primary: '#CE1141', secondary: '#000000', city: 'Toronto' },
    { name: 'Utah Jazz',              abbr: 'UTA', primary: '#002B5C', secondary: '#00471B', city: 'Utah' },
    { name: 'Washington Wizards',     abbr: 'WAS', primary: '#002B5C', secondary: '#E31837', city: 'Washington' },
  ],

  // ── MLB ────────────────────────────────────────────────────────────────────
  MLB: [
    { name: 'Arizona Diamondbacks',   abbr: 'ARI', primary: '#A71930', secondary: '#E3D4AD', city: 'Arizona' },
    { name: 'Atlanta Braves',         abbr: 'ATL', primary: '#CE1141', secondary: '#13274F', city: 'Atlanta' },
    { name: 'Baltimore Orioles',      abbr: 'BAL', primary: '#DF4601', secondary: '#000000', city: 'Baltimore' },
    { name: 'Boston Red Sox',         abbr: 'BOS', primary: '#BD3039', secondary: '#0D2B56', city: 'Boston' },
    { name: 'Chicago Cubs',           abbr: 'CHC', primary: '#0E3386', secondary: '#CC3433', city: 'Chicago' },
    { name: 'Chicago White Sox',      abbr: 'CWS', primary: '#27251F', secondary: '#C4CED4', city: 'Chicago' },
    { name: 'Cincinnati Reds',        abbr: 'CIN', primary: '#C6011F', secondary: '#000000', city: 'Cincinnati' },
    { name: 'Cleveland Guardians',    abbr: 'CLE', primary: '#00385D', secondary: '#E50022', city: 'Cleveland' },
    { name: 'Colorado Rockies',       abbr: 'COL', primary: '#33006F', secondary: '#C4CED4', city: 'Colorado' },
    { name: 'Detroit Tigers',         abbr: 'DET', primary: '#0C2340', secondary: '#FA4616', city: 'Detroit' },
    { name: 'Houston Astros',         abbr: 'HOU', primary: '#002D62', secondary: '#EB6E1F', city: 'Houston' },
    { name: 'Kansas City Royals',     abbr: 'KC',  primary: '#004687', secondary: '#C09A5B', city: 'Kansas City' },
    { name: 'Los Angeles Angels',     abbr: 'LAA', primary: '#BA0021', secondary: '#003263', city: 'Los Angeles' },
    { name: 'Los Angeles Dodgers',    abbr: 'LAD', primary: '#005A9C', secondary: '#EF3E42', city: 'Los Angeles' },
    { name: 'Miami Marlins',          abbr: 'MIA', primary: '#00A3E0', secondary: '#EF3340', city: 'Miami' },
    { name: 'Milwaukee Brewers',      abbr: 'MIL', primary: '#FFC52F', secondary: '#12284B', city: 'Milwaukee' },
    { name: 'Minnesota Twins',        abbr: 'MIN', primary: '#002B5C', secondary: '#D31145', city: 'Minnesota' },
    { name: 'New York Mets',          abbr: 'NYM', primary: '#002D72', secondary: '#FF5910', city: 'New York' },
    { name: 'New York Yankees',       abbr: 'NYY', primary: '#003087', secondary: '#E4002C', city: 'New York' },
    { name: 'Oakland Athletics',      abbr: 'OAK', primary: '#003831', secondary: '#EFB21E', city: 'Oakland' },
    { name: 'Philadelphia Phillies',  abbr: 'PHI', primary: '#E81828', secondary: '#002D72', city: 'Philadelphia' },
    { name: 'Pittsburgh Pirates',     abbr: 'PIT', primary: '#27251F', secondary: '#FDB827', city: 'Pittsburgh' },
    { name: 'San Diego Padres',       abbr: 'SD',  primary: '#2F241D', secondary: '#FFC425', city: 'San Diego' },
    { name: 'San Francisco Giants',   abbr: 'SF',  primary: '#FD5A1E', secondary: '#27251F', city: 'San Francisco' },
    { name: 'Seattle Mariners',       abbr: 'SEA', primary: '#0C2C56', secondary: '#005C5C', city: 'Seattle' },
    { name: 'St. Louis Cardinals',    abbr: 'STL', primary: '#C41E3A', secondary: '#0C2340', city: 'St. Louis' },
    { name: 'Tampa Bay Rays',         abbr: 'TB',  primary: '#092C5C', secondary: '#8FBCE6', city: 'Tampa Bay' },
    { name: 'Texas Rangers',          abbr: 'TEX', primary: '#003278', secondary: '#C0111F', city: 'Texas' },
    { name: 'Toronto Blue Jays',      abbr: 'TOR', primary: '#134A8E', secondary: '#1D2D5C', city: 'Toronto' },
    { name: 'Washington Nationals',   abbr: 'WAS', primary: '#AB0003', secondary: '#14225A', city: 'Washington' },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

// Retourne toutes les équipes d'un sport
export function getTeamsBySport(sport) {
  return TEAMS[sport] || [];
}

// Recherche une équipe par nom (fuzzy)
export function findTeam(sport, teamName) {
  if (!teamName || !sport) return null;
  const teams = TEAMS[sport] || [];
  const q = teamName.toLowerCase().trim();
  return teams.find(t =>
    t.name.toLowerCase().includes(q) ||
    t.city.toLowerCase().includes(q) ||
    t.abbr.toLowerCase() === q ||
    q.includes(t.city.toLowerCase()) ||
    q.includes(t.name.toLowerCase().split(' ').pop()) // last word (ex: "Oilers")
  ) || null;
}

// Retourne les couleurs d'une équipe
export function getTeamColors(sport, teamName) {
  const team = findTeam(sport, teamName);
  if (!team) return { primary: null, secondary: null };
  return { primary: team.primary, secondary: team.secondary };
}

// Suggestions d'équipes pour l'autocomplete
export function suggestTeams(sport, query) {
  if (!query || query.length < 2) return [];
  const teams = TEAMS[sport] || [];
  const q = query.toLowerCase();
  return teams
    .filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q)
    )
    .slice(0, 5);
}
