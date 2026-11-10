
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { IngredienteProducto, Producto } from '../entidades/producto';
import { BebidaApiService } from '../servicios/bebida-api.service';
import { CarritoService } from '../servicios/carrito.service';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bebida.component.html',
  styleUrl: './bebida.component.css'
})
export class BebidaComponent implements OnInit {

  bebidas: Producto[] = [];
  categorias: string[] = ['Ordinary Drink', 'Cocktail'];

  tipoBusqueda: 'nombre' | 'ingrediente' = 'nombre';
  terminoBusqueda = '';

  tipoFiltro = '';
  categoriaFiltro = '';

  cargando = false;
  error = '';

  ingredientesAbiertos: string | null = null;
  cargandoDetalleId: string | null = null;
  errorDetalle = '';
  private preciosAsignados = new Map<string, number>();

  constructor(
    private bebidaApi: BebidaApiService,
    private carrito: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarBebidas();
  }

  async cargarBebidas(): Promise<void> {
    this.cargando = true;
    this.error = '';

    try {
      const respuesta: any = await firstValueFrom(
        this.bebidaApi.recibirDatos()
      );

      this.bebidas = this.convertirProductos(respuesta.drinks || []);

    } catch (error) {
      console.error(error);
      this.error = 'No se pudieron cargar las bebidas.';
    } finally {
      this.cargando = false;
    }
  }


  private convertirProductos(datos: any[]): Producto[] {
    return datos.map(bebida => {
      const ingredientes: IngredienteProducto[] = [];

      for (let i = 1; i <= 15; i++) {
        const nombre = bebida[`strIngredient${i}`]?.trim();
        const medida = bebida[`strMeasure${i}`]?.trim();

        if (nombre) {
          ingredientes.push({
            nombre,
            medida: medida || ''
          });
        }
      }

      const id = bebida.idDrink || bebida.strDrink;
      const producto = new Producto(
        bebida.strDrink,
        bebida.strDrinkThumb,
        ingredientes.map(item => item.nombre).join(', ') ||
          'Consulta los ingredientes',
        this.obtenerPrecio(id),
        bebida.strCategory || this.categoriaFiltro || 'Sin categoría',
        bebida.strAlcoholic || this.tipoFiltro || 'No especificado',
        id
      );

      producto.ingredientesDetalle = ingredientes;

      return producto;
    });
  }

  private obtenerPrecio(id: string): number {
    let precio = this.preciosAsignados.get(id);

    if (precio === undefined) {
      precio = (Math.floor(Math.random() * 18) + 8) * 1000;
      this.preciosAsignados.set(id, precio);
    }

    return precio;
  }

  
  async buscar(): Promise<void> {
    this.cargando = true;
    this.error = '';
    this.ingredientesAbiertos = null;

    try {
      let respuesta: any;

      if (this.terminoBusqueda.trim()) {
        const termino = this.terminoBusqueda.trim();

        respuesta = this.tipoBusqueda === 'nombre'
          ? await firstValueFrom(this.bebidaApi.buscarPorNombre(termino))
          : await firstValueFrom(this.bebidaApi.buscarPorIngrediente(termino));
      } else if (this.categoriaFiltro) {
        respuesta = await firstValueFrom(
          this.bebidaApi.buscarPorCategoria(this.categoriaFiltro)
        );
      } else {
        respuesta = await firstValueFrom(this.bebidaApi.recibirDatos());
      }

      let resultados: any[] = respuesta.drinks || [];

      
      if (this.tipoFiltro) {
        const filtro: any = await firstValueFrom(
          this.bebidaApi.buscarPorAlcohol(this.tipoFiltro)
        );

        const ids = new Set(
          (filtro.drinks || []).map((item: any) => item.idDrink)
        );

        resultados = resultados.filter(item => ids.has(item.idDrink));
      }

      
      if (this.categoriaFiltro && this.terminoBusqueda.trim()) {
        const filtro: any = await firstValueFrom(
          this.bebidaApi.buscarPorCategoria(this.categoriaFiltro)
        );

        const ids = new Set(
          (filtro.drinks || []).map((item: any) => item.idDrink)
        );

        resultados = resultados.filter(item => ids.has(item.idDrink));
      }

      this.bebidas = this.convertirProductos(resultados);

    } catch (error) {
      console.error(error);
      this.error = 'No se pudo completar la búsqueda.';
    } finally {
      this.cargando = false;
    }
  }

  async toggleIngredientes(bebida: Producto): Promise<void> {
    const id = bebida.id;

    if (this.ingredientesAbiertos === id) {
      this.ingredientesAbiertos = null;
      return;
    }

    if (bebida.ingredientesDetalle.length > 0) {
      this.ingredientesAbiertos = id;
      return;
    }

    this.cargandoDetalleId = id;
    this.errorDetalle = '';

    try {
      const respuesta: any = await firstValueFrom(
        this.bebidaApi.buscarPorId(id)
      );

      const detalle = respuesta.drinks?.[0];

      if (!detalle) {
        this.errorDetalle = 'No se encontraron ingredientes.';
        return;
      }

      const producto = this.convertirProductos([detalle])[0];

      bebida.ingredientes = producto.ingredientes;
      bebida.ingredientesDetalle = producto.ingredientesDetalle;
      bebida.categoria = producto.categoria;
      bebida.tipo = producto.tipo;

      this.ingredientesAbiertos = id;

    } catch (error) {
      console.error(error);
      this.errorDetalle = 'No se pudieron cargar los ingredientes.';
    } finally {
      this.cargandoDetalleId = null;
    }
  }

  nombreCategoria(categoria: string): string {
    return categoria.replace(/_/g, ' ');
  }

  nombreTipo(tipo: string): string {
    if (tipo === 'Alcoholic') return 'Alcohólica';
    if (tipo === 'Non alcoholic' || tipo === 'Non_Alcoholic') return 'Sin alcohol';
    return tipo || 'No especificado';
  }

  aumentar(bebida: Producto): void {
    bebida.cantidad++;
  }

  disminuir(bebida: Producto): void {
    if (bebida.cantidad > 1) {
      bebida.cantidad--;
    }
  }

  agregarAlPedido(bebida: Producto): void {
    this.carrito.agregar(bebida);
    bebida.cantidad = 1;
  }

  identificar(bebida: Producto): string {
    return bebida.id || bebida.nombre;
  }

  obtenerIngredientes(bebida: Producto): IngredienteProducto[] {
    return bebida.ingredientesDetalle;
  }
}
