import { TestBed } from '@angular/core/testing';
import { Producto } from '../entidades/producto';
import { CarritoService } from './carrito.service';

describe('CarritoService', () => {
  let service: CarritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoService);
  });

  it('adds products and combines quantities for the same product', () => {
    const producto = new Producto('Plato', 'plato.jpg', 'Ingredientes', 25000, 'Chicken', '', '1');

    service.agregar(producto);
    service.agregar(producto);

    expect(service.obtenerItems().length).toBe(1);
    expect(service.obtenerItems()[0].cantidad).toBe(2);
    expect(service.total()).toBe(50000);
  });

  it('removes products from the cart', () => {
    const producto = new Producto('Plato', 'plato.jpg', 'Ingredientes', 25000, 'Chicken', '', '1');
    service.agregar(producto);

    service.quitar(producto.nombre);

    expect(service.obtenerItems()).toEqual([]);
  });

  it('keeps the selected quantity and allows it to be updated', () => {
    const producto = new Producto('Plato', 'plato.jpg', 'Ingredientes', 25000, 'Chicken', '', '1');
    producto.cantidad = 3;

    service.agregar(producto);
    service.actualizarCantidad('1', 4);

    expect(service.obtenerItems()[0].cantidad).toBe(4);
    expect(service.total()).toBe(100000);
  });

  it('adds selected quantities to an existing product', () => {
    const producto = new Producto('Plato', 'plato.jpg', 'Ingredientes', 25000, 'Chicken', '', '1');
    service.agregar(producto);
    producto.cantidad = 2;
    service.agregar(producto);

    expect(service.obtenerItems()[0].cantidad).toBe(3);
  });
});
