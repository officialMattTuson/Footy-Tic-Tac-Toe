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