import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { MiCuentaComponent } from './mi-cuenta.component';
import { MiCuentaRoutingModule } from './mi-cuenta-routing.module';

@NgModule({
  declarations: [MiCuentaComponent],
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    MiCuentaRoutingModule
  ]
})
export class MiCuentaModule { }
