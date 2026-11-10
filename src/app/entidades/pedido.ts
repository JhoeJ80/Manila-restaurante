import { Cliente } from './cliente';
import { Producto } from './producto';

export class Pedido {
    cliente: Cliente;
    productos: Producto[];
    fecha: Date;

    constructor(cliente: Cliente, productos: Producto[]) {
        this.cliente = new Cliente(cliente.nombre, cliente.celular, cliente.direccion);
        this.productos = productos.map(producto => {
            const copia = new Producto(
                producto.nombre,
                producto.imagen,
                producto.ingredientes,
                producto.precio,
                producto.categoria,
                producto.tipo,
                producto.id
            );
            copia.cantidad = producto.cantidad;
            copia.ingredientesDetalle = producto.ingredientesDetalle.map(ingrediente => ({ ...ingrediente }));
            return copia;
        });
        this.fecha = new Date();
    }

    calcularTotal(): number {
        return this.productos.reduce(
            (total, producto) => total + producto.precio * producto.cantidad,
            0
        );
    }
}