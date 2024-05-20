import { TestBed } from '@angular/core/testing';

import { ConnectWithClientService } from './connect-with-client.service';

describe('ConnectWithClientService', () => {
  let service: ConnectWithClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectWithClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
