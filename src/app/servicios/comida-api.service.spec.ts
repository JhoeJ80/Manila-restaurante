import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ComidaApiService } from './comida-api.service';

describe('ComidaApiService', () => {
  let service: ComidaApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ComidaApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('searches meals by name', () => {
    service.buscarPorNombre('teriyaki').subscribe();
    const request = http.expectOne(
      'https://www.themealdb.com/api/json/v1/1/search.php?s=teriyaki'
    );
    expect(request.request.method).toBe('GET');
    request.flush({ meals: [] });
  });

  it('loads category cards and meals for the selected category', async () => {
    service.categorias().subscribe();
    http.expectOne('https://www.themealdb.com/api/json/v1/1/categories.php')
      .flush({ categories: [{ strCategory: 'Seafood' }] });

    service.comidasPorCategoria('Seafood').subscribe();
    http.expectOne('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood')
      .flush({ meals: [{ strMeal: 'Baked salmon' }] });
  });
});
