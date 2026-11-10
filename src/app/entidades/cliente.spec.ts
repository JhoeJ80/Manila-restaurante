import { Cliente } from './cliente';

describe('Cliente', () => {
  it('should create an instance', () => {
    expect(new Cliente('Ana Pérez', '3001234567', 'Calle 1 # 2-3')).toBeTruthy();
  });
});
