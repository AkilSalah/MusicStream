export interface Track {
  id: string;
  title: string;
  artist: string;
  description?: string;
  addedAt: Date;
  duration: number;
  category: MusicCategory;
  fileUrl: string;
  imageUrl?: string;
}

export enum MusicCategory {
  POP = 'pop',
  ROCK = 'rock',
  RAI = 'rai',
  RAP = 'rap',
  CHAABI = 'cha3bi',
  OTHER = 'other'
}

export enum PlayerState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  STOPPED = 'stopped',
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success'
}