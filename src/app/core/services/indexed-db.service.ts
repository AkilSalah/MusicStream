import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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
}