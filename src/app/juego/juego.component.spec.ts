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
          get: () => of({ meals: [{ idMeal: '1', strMeal: 'Plato', strMealThumb: 'plato.jpg' }] })
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
});
