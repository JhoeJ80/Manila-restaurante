
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { IngredienteProducto, Producto } from '../entidades/producto';
import { ComidaApiService } from '../servicios/comida-api.service';
import { CarritoService } from '../servicios/carrito.service';

@Component({
  selector: 'app-comida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comida.component.html',
  styleUrl: './comida.component.css'
})
export class ComidaComponent implements OnInit {

  categorias: any[] = [];
  comidas: Producto[] = [];

  tipoBusqueda: 'nombre' | 'ingrediente' = 'nombre';
  terminoBusqueda = '';

  categoriaSeleccionada = '';
  cargando = false;
  error = '';

  ingredientesAbiertos: string | null = null;
  cargandoDetalleId: string | null = null;
  errorDetalle = '';
  private preciosAsignados = new Map<string, number>();

  constructor(
    private comidaApi: ComidaApiService,
    private carrito: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  
  async cargarCategorias(): Promise<void> {
    try {
      const respuesta: any = await firstValueFrom(
        this.comidaApi.categorias()
      );

      this.categorias = respuesta.categories || [];
    } catch (error) {
      this.error = 'No se pudieron cargar las categorías.';
      console.error(error);
    }
  }

  
  convertirProductos(datos: any[]): Producto[] {
    return datos.map(comida => {
      const ingredientes: IngredienteProducto[] = [];

      for (let i = 1; i <= 20; i++) {
        const nombre = comida[`strIngredient${i}`]?.trim();
        const medida = comida[`strMeasure${i}`]?.trim();

        if (nombre) {
          ingredientes.push({ nombre, medida: medida || '' });
        }
      }

      const id = comida.idMeal || comida.strMeal;
      const producto = new Producto(
        comida.strMeal,
        comida.strMealThumb,
        ingredientes.map(item => item.nombre).join(', ') || 'Consulta los ingredientes',
        this.obtenerPrecio(id),
        comida.strCategory || this.categoriaSeleccionada || 'Sin categoría',
        comida.strArea || 'Internacional',
        id
      );
      producto.ingredientesDetalle = ingredientes;

      return producto;
    });
  }

  private obtenerPrecio(id: string): number {
    let precio = this.preciosAsignados.get(id);

    if (precio === undefined) {
      precio = (Math.floor(Math.random() * 131) + 20) * 1000;
      this.preciosAsignados.set(id, precio);
    }

    return precio;
  }

  
  async buscar(): Promise<void> {
    if (!this.terminoBusqueda.trim()) return;

    this.cargando = true;
    this.error = '';
    this.categoriaSeleccionada = '';

    try {
      const respuesta: any = this.tipoBusqueda === 'nombre'
        ? await firstValueFrom(
            this.comidaApi.buscarPorNombre(this.terminoBusqueda.trim())
          )
        : await firstValueFrom(
            this.comidaApi.buscarPorIngrediente(this.terminoBusqueda.trim())
          );

      this.comidas = this.convertirProductos(respuesta.meals || []);
      this.ingredientesAbiertos = null;

    } catch (error) {
      this.error = 'Error al buscar las comidas.';
      console.error(error);
    } finally {
      this.cargando = false;
    }
  }

  
  async seleccionarCategoria(categoria: string): Promise<void> {
    if (this.categoriaSeleccionada === categoria) {
      this.categoriaSeleccionada = '';
      this.comidas = [];
      this.ingredientesAbiertos = null;
      return;
    }

    this.categoriaSeleccionada = categoria;
    this.terminoBusqueda = '';
    this.cargando = true;
    this.error = '';

    try {
      const respuesta: any = await firstValueFrom(
        this.comidaApi.comidasPorCategoria(categoria)
      );

      this.comidas = this.convertirProductos(respuesta.meals || []);
      this.ingredientesAbiertos = null;

    } catch (error) {
      this.error = 'No se pudieron cargar las comidas.';
      console.error(error);
    } finally {
      this.cargando = false;
    }
  }

  async toggleIngredientes(comida: Producto): Promise<void> {
    const id = this.identificar(comida);
    this.errorDetalle = '';

    if (this.ingredientesAbiertos === id) {
      this.ingredientesAbiertos = null;
      return;
    }

    if (comida.ingredientesDetalle.length > 0) {
      this.ingredientesAbiertos = id;
      return;
    }
    this.cargandoDetalleId = id;
    this.cargandoDetalleId = id;

    try {
      const respuesta: any = await firstValueFrom(
        this.comidaApi.buscarPorId(comida.id)
      );
      const detalle = respuesta.meals?.[0];

      if (!detalle) {
        this.errorDetalle = 'No se encontraron ingredientes.';
        return;
      }

      const producto = this.convertirProductos([detalle])[0];
      if (producto.ingredientesDetalle.length === 0) {
        this.errorDetalle = 'No se encontraron ingredientes.';
        return;
      }

      comida.ingredientes = producto.ingredientes;
      comida.ingredientesDetalle = producto.ingredientesDetalle;
      comida.categoria = producto.categoria;
      comida.tipo = producto.tipo;
      this.ingredientesAbiertos = id;
    } catch (error) {
      console.error(error);
      this.errorDetalle = 'No se pudieron cargar los ingredientes.';
    } finally {
      this.cargandoDetalleId = null;
    }
  }

  identificar(comida: Producto): string {
    return comida.id || comida.nombre;
  }

  obtenerIngredientes(comida: Producto): IngredienteProducto[] {
    return comida.ingredientesDetalle;
  }

 
  aumentar(producto: Producto): void {
    producto.cantidad++;
  }

  
  disminuir(producto: Producto): void {
    if (producto.cantidad > 1) {
      producto.cantidad--;
    }
  }

  
  agregarAlPedido(producto: Producto): void {
    this.carrito.agregar(producto);
    producto.cantidad = 1;
  }

}
