
export enum MusicCategory {
    POP = 'pop',
    ROCK = 'rock',
    RAP = 'rap',
    CHAABI = 'cha3bi',
    RAI = 'rai'
  }

export interface Track {
  id: string;
  title: string;
  artist: string;
  description?: string;
  date: Date;
  duration: number;
  category: MusicCategory;
}
