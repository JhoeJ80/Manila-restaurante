import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../entidades/producto';


@Injectable({ providedIn: 'root' })
export class CarritoService {
    private items = new BehaviorSubject<Producto[]>([]);
    items$ = this.items.asObservable();

    agregar(item: Producto) {
        const actuales = this.items.value;
        const identificador = item.id || item.nombre;
        const cantidad = Math.max(1, Math.floor(item.cantidad || 1));
        const existente = actuales.find(i => (i.id || i.nombre) === identificador);

        if (existente) {
            existente.cantidad += cantidad;
            this.items.next([...actuales]);
        } else {
            this.items.next([...actuales, { ...item, cantidad }]);
        }
    }

    actualizarCantidad(identificador: string, cantidad: number): void {
        const cantidadValida = Math.floor(cantidad);
        if (cantidadValida < 1) {
            return;
        }

        const actuales = this.items.value.map(item =>
            (item.id || item.nombre) === identificador
                ? { ...item, cantidad: cantidadValida }
                : item
        );
        this.items.next(actuales);
    }

    quitar(identificador: string) {
        this.items.next(this.items.value.filter(
            item => item.id !== identificador && item.nombre !== identificador
        ));
    }

    obtenerItems(): Producto[] {
        return this.items.value;
    }

    limpiar() {
        this.items.next([]);
    }

    total(): number {
        return this.items.value.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    }
    precioRamdon(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}