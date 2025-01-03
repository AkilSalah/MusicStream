import { TestBed } from '@angular/core/testing';

import { IndexedDbService } from './indexed-db.service';
describe('IndexedDBService', () => {
  let service: IndexedDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
