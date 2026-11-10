import { Routes } from '@angular/router';

import { InicioComponent } from './inicio/inicio.component';
import { ComidaComponent } from './comida/comida.component';
import { BebidaComponent } from './bebida/bebida.component';
import { JuegoComponent } from './juego/juego.component';
import { PedidoComponent } from './pedido/pedido.component';

export const routes: Routes = [
    { path: '', component: InicioComponent, pathMatch: 'full' },
    { path: 'comida', component: ComidaComponent },
    { path: 'juego', component: JuegoComponent },
    { path: 'bebida', component: BebidaComponent },
    {path: 'pedido', component: PedidoComponent},
    { path: '**', redirectTo: '' }
];
