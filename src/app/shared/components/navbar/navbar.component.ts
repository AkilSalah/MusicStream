import { Component } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchText: string = '';
  
  constructor(private searchService: SearchService) {}

  onSearch() {
    console.log('hello navbar')
    this.searchService.updateSearch(this.searchText);
  }
}
