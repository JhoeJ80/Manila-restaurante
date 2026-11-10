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

    const peticiones = Array.from({ length: 2 }, () =>
      this.http.get<any>('https://www.themealdb.com/api/json/v1/1/random.php')
    );

    forkJoin(peticiones).subscribe((respuestas) => {
      const comidas = respuestas.map(r => r.meals[0]);

      const idsUnicos = new Map<string, any>();
      comidas.forEach(c => idsUnicos.set(c.idMeal, c));
      const objetivosReales = Array.from(idsUnicos.values());

      const cartasObjetivo: any[] = objetivosReales.map(c => ({
        idMeal: c.idMeal,
        nombre: c.strMeal,
        imagen: c.strMealThumb,
        pos: 0,
        descubierta: false,
        esObjetivo: true,
        encontrada: false,
        errada: false
      }));

      const cartasVacias: any[] = Array.from({ length: 14 }, () => ({
        idMeal: null,
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