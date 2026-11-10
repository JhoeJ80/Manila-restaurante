import { Producto } from './producto';

describe('Producto', () => {
  it('should create an instance', () => {
    expect(new Producto('Plato', 'plato.jpg', 'Ingredientes', 25000, 'Chicken', '')).toBeTruthy();
  });
});
