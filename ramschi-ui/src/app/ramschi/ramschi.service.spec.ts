import { TestBed } from '@angular/core/testing';

import { RamschiService } from './ramschi.service';

describe('RamschiService', () => {
  let service: RamschiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RamschiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
