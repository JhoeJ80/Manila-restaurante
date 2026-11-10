import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-juego',
  standalone: true,
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css'],
  imports: [CommonModule]
})
export class JuegoComponent implements OnInit {

  cartas: any[] = [];
  objetivos: any[] = [];
  encontrados = 0;
  intentos = 0;
  cargando = true;
  gano = false;

  constructor(private http: HttpClient,
    private tc: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego(): void {
    this.cargando = true;
    this.gano = false;
    this.encontrados = 0;
    this.intentos = 0;
    this.objetivos = [];

    forkJoin({
      comida: this.http.get<any>(
        'https://www.themealdb.com/api/json/v1/1/random.php'
      ),
      coctel: this.http.get<any>(
        'https://www.thecocktaildb.com/api/json/v1/1/random.php'
      )
    }).subscribe(({ comida, coctel }) => {
      const platos = comida.meals[0];
      const bebida = coctel.drinks[0];

      const cartasObjetivo: any[] = [
        {
          id: platos.idMeal,
          tipo: 'Comida',
          nombre: platos.strMeal,
          imagen: platos.strMealThumb,
          pos: 0,
          descubierta: false,
          esObjetivo: true,
          encontrada: false,
          errada: false
        },
        {
          id: bebida.idDrink,
          tipo: 'Cóctel',
          nombre: bebida.strDrink,
          imagen: bebida.strDrinkThumb,
          pos: 0,
          descubierta: false,
          esObjetivo: true,
          encontrada: false,
          errada: false
        }
      ];

      const cartasVacias: any[] = Array.from({ length: 14 }, () => ({
        id: null,
        tipo: '',
        nombre: '',
        imagen: 'assets/img/logo-manila.svg',
        pos: 0,
        descubierta: false,
        esObjetivo: false,
        encontrada: false,
        errada: false
      }));

      let mazo: any[] = [...cartasObjetivo, ...cartasVacias];

      for (let i = mazo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
      }

      mazo.forEach((carta, index) => carta.pos = index + 1);

      this.cartas = mazo;
      this.objetivos = cartasObjetivo;
      this.cargando = false;

      this.tc.detectChanges();
    });
  }

  descubre2(pos: number): void {
    if (this.gano) return;

    const carta = this.cartas.find(c => c.pos === pos);
    if (!carta || carta.descubierta) return;

    carta.descubierta = true;
    carta.errada = !carta.esObjetivo;
    this.intentos++;

    if (carta.esObjetivo) {
      carta.encontrada = true;
      this.encontrados++;

      if (this.encontrados === 2) {
        this.gano = true;
      }
    }

    this.tc.detectChanges();
  }
}