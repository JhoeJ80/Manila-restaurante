import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../servicios/carrito.service';
import { Producto } from '../entidades/producto';
import { FormularioComponent } from '../formulario/formulario.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [
    CommonModule,
    FormularioComponent
  ],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})

export class PedidoComponent implements OnInit {

  items: Producto[] = [];

  pedido: any = null;

  constructor(private carrito: CarritoService) { }

  ngOnInit(): void {
    this.carrito.items$.subscribe((items: Producto[]) => {
      this.items = items;
    });
  }

  quitar(item: Producto): void {
    this.carrito.quitar(this.identificar(item));
  }

  aumentar(item: Producto): void {
    this.carrito.actualizarCantidad(
      this.identificar(item),
      item.cantidad + 1
    );
  }

  disminuir(item: Producto): void {
    if (item.cantidad > 1) {
      this.carrito.actualizarCantidad(
        this.identificar(item),
        item.cantidad - 1
      );
    }
  }

  identificar(item: Producto): string {
    return item.id || item.nombre;
  }

  total(): number {
    return this.carrito.total();
  }

  recibirDatos(cliente: any): void {

    if (this.items.length === 0) {
        return;
    }

    const productosPedido = this.items.map(item => ({
        ...item
    }));

    this.pedido = {
        fecha: new Date(),
        cliente: { ...cliente },
        productos: productosPedido,

        calcularTotal: () => {
            return productosPedido.reduce(
                (acumulado, item) =>
                    acumulado + (item.precio * item.cantidad),
                0
            );
        }
    };

    console.log('Pedido recibido:', this.pedido);
}

  cerrarModal(): void {
    this.pedido = null;
    this.carrito.limpiar();
  }

  async descargarPDF(): Promise<void> {

    if (!this.pedido) {
      return;
    }

    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]);

    const doc = new jsPDF();


    doc.setFontSize(20);
    doc.text('MANILA', 105, 20, {
      align: 'center'
    });

    doc.setFontSize(14);
    doc.text('COMPROBANTE DE PEDIDO', 105, 35, {
      align: 'center'
    });

    doc.setFontSize(11);

    doc.text(
      `Fecha: ${this.pedido.fecha.toLocaleDateString('es-CO')}`,
      20,
      50
    );

    doc.text(
      `Nombre: ${this.pedido.cliente.nombre}`,
      20,
      60
    );

    doc.text(
      `Celular: ${this.pedido.cliente.celular}`,
      20,
      70
    );

    doc.text(
      `Direccion: ${this.pedido.cliente.direccion}`,
      20,
      80
    );

    autoTable(doc, {
      startY: 95,

      head: [
        ['Producto', 'Cantidad', 'Subtotal']
      ],

      body: this.pedido.productos.map((item: any) => [
        item.nombre,
        item.cantidad.toString(),
        `$${(item.precio * item.cantidad).toLocaleString('es-CO')}`
      ])
    });


    const posicionY = (doc as any).lastAutoTable.finalY + 15;

    doc.text(
      `TOTAL A PAGAR: $${this.pedido.calcularTotal().toLocaleString('es-CO')}`,
      20,
      posicionY
    );

    doc.save('comprobante-manila.pdf');
  }

}