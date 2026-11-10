import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { JuegoComponent } from './juego.component';

describe('JuegoComponent', () => {
  let component: JuegoComponent;
  let fixture: ComponentFixture<JuegoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuegoComponent],
      providers: [{
        provide: HttpClient,
        useValue: {
          get: (url: string) => url.includes('themealdb')
            ? of({ meals: [{ idMeal: '1', strMeal: 'Plato', strMealThumb: 'plato.jpg' }] })
            : of({ drinks: [{ idDrink: '2', strDrink: 'Cóctel', strDrinkThumb: 'coctel.jpg' }] })
        }
      }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows an X when an incorrect card is selected', () => {
    const cartaIncorrecta = component.cartas.find(carta => !carta.esObjetivo)!;

    component.descubre2(cartaIncorrecta.pos);
    fixture.detectChanges();

    expect(cartaIncorrecta.errada).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('X');
  });

  it('uses one meal image and one cocktail image as targets', () => {
    expect(component.objetivos.map(objetivo => objetivo.tipo)).toEqual([
      'Comida',
      'Cóctel'
    ]);
    expect(component.objetivos.map(objetivo => objetivo.imagen)).toEqual([
      'plato.jpg',
      'coctel.jpg'
    ]);
  });
});
