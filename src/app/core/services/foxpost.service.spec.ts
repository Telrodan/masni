import { TestBed } from '@angular/core/testing';

import { FoxpostService } from './foxpost.service';

describe('FoxpostService', () => {
  let service: FoxpostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoxpostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
