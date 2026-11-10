import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { InicioComponent } from './inicio.component';
import { ComidaApiService } from '../servicios/comida-api.service';
import { BebidaApiService } from '../servicios/bebida-api.service';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [
        { provide: ComidaApiService, useValue: { recibirDatos: () => of({ meals: [] }) } },
        { provide: BebidaApiService, useValue: { recibirDatos: () => of({ drinks: [] }) } }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
