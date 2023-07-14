export interface Team {
  team: TeamInformation;
  venue: HomeGround;
}

export interface TeamInformation {
  code: string;
  country: string;
  founded: number;
  id: number;
  logo: string;
  name: string;
  national: boolean;
}

export interface HomeGround {
  address: string;
  capacity: number;
  city: string;
  id: number;
  image: string;
  surface: string;
}

export interface Country {
  code: string;
  flag: string;
  name: string;
}

export interface LeagueParent {
  league: League;
  country: Country;
  seasons: any[];
}

export interface League {
  id: number;
  logo: string;
  type: string;
  name: string;
}

export interface PlayerInformation {
  player: PlayerBio;
  statistics: [];
}

export interface PlayerBio {
  id: number;
  age: number;
  birth: {};
  firstName: string;
  height: string;
  injured: boolean;
  lastName: string;
  name: string;
  nationality: string;
  photo: string;
  weight: string;
}

export interface Transfer {
  date: string;
  teams: {
    in: TeamInformation;
    out: TeamInformation;
  };
  type: string;
}

export interface Condition {
  condition1: any;
  condition2: any;
}

export const topFootballingNations = [
  'Argentina',
  'France',
  'Brazil',
  'Germany',
  'Spain',
  'Uruguay',
  'Italy',
  'England',
  'Switzerland',
  'Belgium',
  'Croatia',
  'Netherlands',
  'Portugal',
  'Wales',
  'Norway',
];

export const topFootballLeagueIds = [39, 140, 61, 78, 135, 94];


export const characterMap = {
  'à': 'a',
  'á': 'a',
  'â': 'a',
  'ã': 'a',
  'ä': 'a',
  'å': 'a',
  'æ': 'ae',
  'ć': 'c',
  'ç': 'c',
  'è': 'e',
  'é': 'e',
  'ê': 'e',
  'ë': 'e',
  'ì': 'i',
  'í': 'i',
  'î': 'i',
  'ï': 'i',
  'ð': 'd',
  'ñ': 'n',
  'ò': 'o',
  'ó': 'o',
  'ô': 'o',
  'õ': 'o',
  'ö': 'o',
  'ø': 'o',
  'ù': 'u',
  'ú': 'u',
  'û': 'u',
  'ü': 'u',
  'ý': 'y',
  'ÿ': 'y',
  'š': 's',
  'ž': 'z',
  'þ': 'th',
  'ß': 'ss',
};
