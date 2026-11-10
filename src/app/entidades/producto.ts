
export interface IngredienteProducto {
    nombre: string;
    medida: string;
}

export class Producto {

    nombre: string;
    imagen: string;
    ingredientes: string;
    precio: number;
    categoria: string;
    tipo: string;
    cantidad: number;
    id: string;
    ingredientesDetalle: IngredienteProducto[] = [];

    constructor(nombre: string, imagen: string, ingredientes: string,
                precio: number, categoria: string, tipo: string, id = '') {

        this.nombre = nombre;
        this.imagen = imagen;
        this.ingredientes = ingredientes;
        this.precio = precio;
        this.categoria = categoria;
        this.tipo = tipo;
        this.cantidad = 1;
        this.id = id;
    }
}
