import { Injectable } from '@angular/core';
import { Track } from '../models/track';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap, throwError } from "rxjs";
import { DBSchema, IDBPDatabase, openDB } from "idb";
import { v4 as uuidv4 } from 'uuid'; 

interface AudioFileRecord {
  id: string;
  file: Blob;
}
interface ImageFileRecord {
  id: string;
  file: Blob;
}

interface TrackDB extends DBSchema {
  tracks: {
    key: string;
    value: Track;
  };
  audioFiles: {
    key: string;
    value: AudioFileRecord;
  };
  imageFiles: {
    key: string;
    value: ImageFileRecord;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  public dbReady$ = new BehaviorSubject<boolean>(false);
  private db: IDBPDatabase<TrackDB> | undefined;

  constructor() {
    this.initializeDB().then(() => {
      this.dbReady$.next(true);
    }).catch(error => {
      console.error('Database initialization failed:', error);
      this.dbReady$.error(error);
    });
  }

  private async initializeDB() {
    try {
      this.db = await openDB<TrackDB>('trackDB', 5, {  
        upgrade(db, oldVersion, newVersion) {
          if (!db.objectStoreNames.contains('tracks')) {
            db.createObjectStore('tracks', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('audioFiles')) {
            db.createObjectStore('audioFiles', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('imageFiles')) {
            db.createObjectStore('imageFiles', { keyPath: 'id' });
          }
        },
      });
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private ensureDB(): Observable<IDBPDatabase<TrackDB>> {
    return this.dbReady$.pipe(
      switchMap(ready => {
        if (ready && this.db) {
          return from(Promise.resolve(this.db));
        }
        return throwError(() => new Error('Database not initialized'));
      })
    );
  }

  saveTrackMetadata(track: Track): Observable<void> {
    return this.ensureDB().pipe(
      switchMap(db => from(db.put('tracks', track))),
      map(() => undefined),
      catchError((error) => {
        console.error('Error saving track metadata:', error);
        return throwError(() => new Error('Error saving track metadata.'));
      })
    );
  }

  saveAudioFile(id: string, file: Blob): Observable<void> {
    if (!file.type.startsWith('audio/')) {
      return throwError(() => new Error('Invalid file type. Must be an audio file.'));
    }

    const audioFileRecord: AudioFileRecord = {
      id,
      file
    };

    return this.ensureDB().pipe(
      switchMap(db => from(db.put('audioFiles', audioFileRecord))),
      map(() => {
        console.log('File and ID saved successfully');
      }),
      catchError((error) => {
        console.error('Error saving audio file:', error);
        return throwError(() => new Error('Error saving audio file.'));
      })
    );
  }

  saveImageFile(id: string, file: Blob): Observable<void> {
    if (!file.type.startsWith('image/')) {
      return throwError(() => new Error('Invalid file type. Must be an image file.'));
    }

    const imageFileRecord: ImageFileRecord = {
      id,
      file
    };

    return this.ensureDB().pipe(
      switchMap(db => from(db.put('imageFiles', imageFileRecord))),
      map(() => undefined),
      catchError((error) => {
        console.error('Error saving image file:', error);
        return throwError(() => new Error('Error saving image file.'));
      })
    );
  }
  
  addTrack(track: Track, audioFile: Blob, imageFile?: Blob): Observable<Track> {
    if (!track || !track.title || !track.artist) {
      return throwError(() => new Error('Invalid track data.'));
    }

    const trackToSave: Track = {
      ...track,
      id: track.id || uuidv4(),
      addedAt: track.addedAt || new Date()
    };

    return this.saveTrackMetadata(trackToSave).pipe(
      switchMap(() => this.saveAudioFile(trackToSave.id, audioFile)),
      switchMap(() => imageFile ? this.saveImageFile(trackToSave.id, imageFile) : of(undefined)),
      map(() => trackToSave),
      catchError((error) => {
        console.error('Error adding track:', error);
        return throwError(() => new Error('Error adding track.'));
      })
    );
  }
  
  // Dans le service
updateTrackMetadata(track: Track): Observable<Track> {
  return this.saveTrackMetadata(track).pipe(
    map(() => track),
    catchError((error) => {
      console.error('Error updating track metadata:', error);
      return throwError(() => new Error('Error updating track metadata.'));
    })
  );
}

updateTrack(updatedTrack: Track, audioFile: Blob, imageFile?: Blob): Observable<Track> {
  return this.saveTrackMetadata(updatedTrack).pipe(
    switchMap(() => this.saveAudioFile(updatedTrack.id, audioFile)),
    switchMap(() => imageFile ? this.saveImageFile(updatedTrack.id, imageFile) : of(undefined)),
    map(() => updatedTrack),
    catchError((error) => {
      console.error('Error updating track:', error);
      return throwError(() => new Error('Error updating track.'));
    })
  );
}

deleteTrack(id: string): Observable<void> {
  return this.ensureDB().pipe(
    switchMap(db =>
      from(Promise.all([
        db.delete('tracks', id),
        db.delete('audioFiles', id),
        db.delete('imageFiles', id)
      ]))
    ),
    map(() => undefined),
    catchError((error) => {
      console.error('Error deleting track:', error);
      return throwError(() => new Error('Error deleting track.'));
    })
  );
}

  getTrackById(id: string): Observable<Track | undefined> {
    return this.ensureDB().pipe(
      switchMap(db => from(db.get('tracks', id))),
      catchError((error) => {
        console.error('Error fetching track by ID:', error);
        return throwError(() => new Error('Error fetching track by ID.'));
      })
    );
  }

  getAudioFile(id: string): Observable<Blob | undefined> {
    return this.ensureDB().pipe(
      switchMap(db => from(db.get('audioFiles', id))),
      map(record => record?.file),
      catchError((error) => {
        console.error('Error fetching audio file:', error);
        return throwError(() => new Error('Error fetching audio file.'));
      })
    );
  }

  getImageFile(id: string): Observable<Blob | undefined> {
    return this.ensureDB().pipe(
      switchMap(db => from(db.get('imageFiles', id))),
      map(record => record?.file),
      catchError((error) => {
        console.error('Error fetching image file:', error);
        return throwError(() => new Error('Error fetching image file.'));
      })
    );
  }


  getAllTrackMetadata(): Observable<Track[]> {
    return this.ensureDB().pipe(
      switchMap(db => from(db.getAll('tracks'))),
      catchError((error) => {
        console.error('Error fetching all tracks:', error);
        return throwError(() => new Error('Error fetching all tracks.'));
      })
    );
  }

  getAllAudioFiles(): Observable<Blob[]> {
    return this.ensureDB().pipe(
      switchMap(db => from(db.getAll('audioFiles'))),
      map(records => records.map(record => record.file)),
      catchError((error) => {
        console.error('Error fetching all audio files:', error);
        return throwError(() => new Error('Error fetching all audio files.'));
      })
    );
  }
}
