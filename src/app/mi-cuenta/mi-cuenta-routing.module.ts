import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../_shared/guards/auth.guard';
import { IRole } from '../_shared/models';

import { MiCuentaComponent } from './mi-cuenta.component';

const routes: Routes = [
  { path: '', component: MiCuentaComponent, canActivate: [], data: { roles: [] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiCuentaRoutingModule { }
