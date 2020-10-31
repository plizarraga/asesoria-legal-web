import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiCuentaComponent } from './mi-cuenta.component';
import { MiCuentaRoutingModule } from './mi-cuenta-routing.module';

@NgModule({
  declarations: [MiCuentaComponent],
  imports: [
    CommonModule,
    MiCuentaRoutingModule
  ]
})
export class MiCuentaModule { }
