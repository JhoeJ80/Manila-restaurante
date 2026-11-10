
import { Component, OnInit } from '@angular/core';
import { Producto } from '../entidades/producto';
import { ComidaApiService } from '../servicios/comida-api.service';
import { CommonModule } from '@angular/common';
import { BebidaApiService } from '../servicios/bebida-api.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent implements OnInit{


  platoEstrella: Producto | null = null;
  bebidaEstrella: Producto | null = null;
  
  constructor(private servicioComida: ComidaApiService, private servicioBebida: BebidaApiService) { }
  ngOnInit(): void {
    this.cargarComidaEstrella();
    this.cargarBebidaEstrella();
  }

  cargarBebidaEstrella(): void {
    this.servicioBebida.recibirDatos().subscribe(
      (data) => {
        const bebida = data.drinks?.[0];
        if (!bebida) {
          this.bebidaEstrella = null;
          return;
        }

        this.bebidaEstrella = new Producto(
          bebida.strDrink,
          bebida.strDrinkThumb,
          '',
          0,
          bebida.strCategory || '',
          bebida.strAlcoholic || '',
          bebida.idDrink
        );
        console.log('Bebida estrella:', this.bebidaEstrella);
      },
      (error) => {
        console.error('Error al cargar la bebida estrella:', error);
      }
    ); 
}

  cargarComidaEstrella(): void {
    this.servicioComida.recibirDatos().subscribe(
      (data) => {
        const comida = data.meals?.[0];
        if (!comida) {
          this.platoEstrella = null;
          return;
        }

        this.platoEstrella = new Producto(
          comida.strMeal,
          comida.strMealThumb,
          '',
          0,
          comida.strCategory || '',
          comida.strArea || '',
          comida.idMeal
        );
        console.log('Comida estrella:', this.platoEstrella);
      },
      (error) => {
        console.error('Error al cargar la comida estrella:', error);
      }
    );
}
  
}