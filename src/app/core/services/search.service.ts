import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchText = new BehaviorSubject<string>('');
  searchText$ = this.searchText.asObservable();

  updateSearch(text: string) {
    console.log("search service")
    this.searchText.next(text);
  }}

