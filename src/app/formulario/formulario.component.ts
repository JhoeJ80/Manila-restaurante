import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../entidades/cliente';

@Component({
    selector: 'app-formulario',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './formulario.component.html',
    styleUrl: './formulario.component.css'
})
export class FormularioComponent {

    cliente = new Cliente();
    error?: string;

    @Output() enviarDatos = new EventEmitter<Cliente>();

    realizarPedido(): void {
        const nombre = this.cliente.nombre.trim();
        const celular = this.cliente.celular.trim();
        const direccion = this.cliente.direccion.trim();
        if (!nombre || !celular || !direccion) {
            this.error = 'Completa todos los datos antes de confirmar el pedido.';
            return;
        }

        this.error = undefined;
        this.enviarDatos.emit(new Cliente(nombre, celular, direccion));
    }

    limpiar(): void {
        this.cliente = new Cliente();
        this.error = undefined;
    }
}