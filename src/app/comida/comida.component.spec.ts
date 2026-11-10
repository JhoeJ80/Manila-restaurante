import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ComidaApiService } from '../servicios/comida-api.service';
import { ComidaComponent } from './comida.component';

describe('ComidaComponent', () => {
  let component: ComidaComponent;
  let fixture: ComponentFixture<ComidaComponent>;
  let comidaApi: jasmine.SpyObj<ComidaApiService>;

  beforeEach(async () => {
    comidaApi = jasmine.createSpyObj<ComidaApiService>('ComidaApiService', [
      'categorias',
      'comidasPorCategoria',
      'buscarPorNombre',
      'buscarPorIngrediente',
      'buscarPorId'
    ]);
    comidaApi.categorias.and.returnValue(of({
      categories: [{ strCategory: 'Seafood', strCategoryThumb: 'seafood.jpg' }]
    }));
    comidaApi.comidasPorCategoria.and.returnValue(of({
      meals: [{
        idMeal: '1',
        strMeal: 'Ceviche',
        strMealThumb: 'ceviche.jpg',
        strCategory: 'Seafood',
        strArea: 'Peruvian'
      }]
    }));

    await TestBed.configureTestingModule({
      imports: [ComidaComponent],
      providers: [{ provide: ComidaApiService, useValue: comidaApi }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('assigns a random price that stays the same for the same meal', () => {
    spyOn(Math, 'random').and.returnValue(0);
    const comida = {
      idMeal: '1',
      strMeal: 'Ceviche',
      strMealThumb: 'ceviche.jpg'
    };

    const primeraConversion = component.convertirProductos([comida])[0];
    const segundaConversion = component.convertirProductos([comida])[0];

    expect(primeraConversion.precio).toBe(20000);
    expect(segundaConversion.precio).toBe(primeraConversion.precio);
  });

  it('allows the maximum meal price of 150000 COP', () => {
    spyOn(Math, 'random').and.returnValue(0.999999);

    const producto = component.convertirProductos([{
      idMeal: '2',
      strMeal: 'Arepa',
      strMealThumb: 'arepa.jpg'
    }])[0];

    expect(producto.precio).toBe(150000);
  });

  it('loads category meals when a category is selected', async () => {
    await fixture.whenStable();

    await component.seleccionarCategoria('Seafood');
    fixture.detectChanges();

    expect(component.categorias[0].strCategory).toBe('Seafood');
    expect(component.comidas[0].nombre).toBe('Ceviche');
    expect(component.categoriaSeleccionada).toBe('Seafood');
  });

  it('loads and displays ingredients for a meal from a category', async () => {
    comidaApi.buscarPorId.and.returnValue(of({
      meals: [{
        idMeal: '1',
        strMeal: 'Ceviche',
        strMealThumb: 'ceviche.jpg',
        strCategory: 'Seafood',
        strArea: 'Peruvian',
        strIngredient1: 'Fish',
        strMeasure1: '200 g'
      }]
    }));
    component.comidas = component.convertirProductos([{
      idMeal: '1',
      strMeal: 'Ceviche',
      strMealThumb: 'ceviche.jpg'
    }]);

    await component.toggleIngredientes(component.comidas[0]);
    fixture.detectChanges();

    expect(comidaApi.buscarPorId).toHaveBeenCalledWith('1');
    expect(component.comidas[0].ingredientesDetalle).toEqual([
      { nombre: 'Fish', medida: '200 g' }
    ]);
    expect(fixture.nativeElement.textContent).toContain('Fish');
    expect(fixture.nativeElement.textContent).toContain('200 g');
  });
});
