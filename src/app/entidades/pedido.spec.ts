import { Pedido } from './pedido';
import { Cliente } from './cliente';
import { Producto } from './producto';

describe('Pedido', () => {
  it('calculates the total using each product quantity', () => {
    const cliente = new Cliente('Ana Pérez', '3001234567', 'Calle 1 # 2-3');
    const producto = new Producto('Plato', 'plato.jpg', 'Ingredientes', 25000, 'Chicken', '');
    producto.cantidad = 2;
    const bebida = new Producto('Bebida', 'bebida.jpg', 'Ingredientes', 5000, 'Cocktail', '');
    const pedido = new Pedido(cliente, [producto, bebida]);

    expect(pedido.calcularTotal()).toBe(55000);
  });
});
