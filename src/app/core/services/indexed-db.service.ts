import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Track } from '../models/track';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbName = 'MusicStreamDB';
  private dbVersion = 1;

  constructor() {}

  initDatabase(): Observable<void> {
    return this.openDatabase().pipe(
      map(() => {
        console.log('Base de données initialisée avec succès');
      })
    );
  }

  private openDatabase(): Observable<IDBDatabase> {
    return new Observable<IDBDatabase>((observer) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains('tracks')) {
          db.createObjectStore('tracks', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('audioFiles')) {
          db.createObjectStore('audioFiles', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = () => {
        observer.next(request.result);
        observer.complete();
      };

      request.onerror = () => {
        observer.error(request.error);
      };
    });
  }

  addTrack(track: Track): Observable<Track> {
    return this.openDatabase().pipe(
      switchMap(db => {
        return new Observable<Track>(observer => {
          const transaction = db.transaction(['tracks'], 'readwrite');
          const store = transaction.objectStore('tracks');
          const request = store.add(track);

          request.onsuccess = () => {
            observer.next(track);
            observer.complete();
          };

          request.onerror = () => {
            observer.error(request.error);
          };
        });
      })
    );
  }

  getAllTracks(): Observable<Track[]> {
    return this.openDatabase().pipe(
      switchMap(db => {
        return new Observable<Track[]>(observer => {
          const transaction = db.transaction(['tracks'], 'readonly');
          const store = transaction.objectStore('tracks');
          const request = store.getAll();

          request.onsuccess = () => {
            observer.next(request.result);
            observer.complete();
          };

          request.onerror = () => {
            observer.error(request.error);
          };
        });
      })
    );
  }

  updateTrack(track: Track): Observable<Track> {
    return this.openDatabase().pipe(
      switchMap(db => {
        return new Observable<Track>(observer => {
          const transaction = db.transaction(['tracks'], 'readwrite');
          const store = transaction.objectStore('tracks');
          const request = store.put(track);

          request.onsuccess = () => {
            observer.next(track);
            observer.complete();
          };

          request.onerror = () => {
            observer.error(request.error);
          };
        });
      })
    );
  }

  deleteTrack(id: string): Observable<void> {
    return this.openDatabase().pipe(
      switchMap(db => {
        return new Observable<void>(observer => {
          const transaction = db.transaction(['tracks'], 'readwrite');
          const store = transaction.objectStore('tracks');
          const request = store.delete(id);

          request.onsuccess = () => {
            observer.next();
            observer.complete();
          };

          request.onerror = () => {
            observer.error(request.error);
          };
        });
      })
    );
  }
}