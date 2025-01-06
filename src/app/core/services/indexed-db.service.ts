import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Track } from '../models/track';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbName = 'MusicStreamDB';
  private dbVersion = 2;
  private db$: Observable<IDBDatabase>;

  constructor() {
    this.db$ = this.initDatabase();
  }

  private initDatabase(): Observable<IDBDatabase> {
    return new Observable<IDBDatabase>((observer) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = request.result;

        // Création de la table tracks (métadonnées)
        if (!db.objectStoreNames.contains('tracks')) {
          const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
          trackStore.createIndex('title', 'title', { unique: false });
          trackStore.createIndex('artist', 'artist', { unique: false });
          trackStore.createIndex('category', 'category', { unique: false });
          trackStore.createIndex('description', 'description', { unique: false });
          trackStore.createIndex('date', 'date', { unique: false });
          trackStore.createIndex('duration', 'duration', { unique: false });
        }

        if (!db.objectStoreNames.contains('audioFiles')) {
          const audioFileStore = db.createObjectStore('audioFiles', { keyPath: 'id' });
          audioFileStore.createIndex('trackId', 'trackId', { unique: false });
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
    return this.db$.pipe(
      switchMap(db => {
        return new Observable<Track>(observer => {
          const transaction = db.transaction(['tracks'], 'readwrite');
          const store = transaction.objectStore('tracks');
          const request = store.add({ ...track, id: crypto.randomUUID() });

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
    return this.db$.pipe(
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
    return this.db$.pipe(
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
    return this.db$.pipe(
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

