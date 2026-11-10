import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BebidaApiService } from './bebida-api.service';

describe('BebidaApiService', () => {
  let service: BebidaApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(BebidaApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('searches drinks by name', () => {
    service.buscarPorNombre('margarita').subscribe();
    const request = http.expectOne(
      'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita'
    );
    expect(request.request.method).toBe('GET');
    request.flush({ drinks: [] });
  });

  it('filters drinks by alcohol type', () => {
    service.buscarPorAlcohol('Non alcoholic').subscribe();
    const request = http.expectOne(
      'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non%20alcoholic'
    );
    expect(request.request.method).toBe('GET');
    request.flush({ drinks: [] });
  });
});
