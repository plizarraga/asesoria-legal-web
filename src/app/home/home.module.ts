import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { CitasListComponent } from './citas-list/citas-list.component';
import { CitasDetailsComponent } from './citas-details/citas-details.component';

@NgModule({
  declarations: [
    HomeComponent,
    CitasListComponent,
    CitasDetailsComponent
  ],
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    HomeRoutingModule
  ],
  exports: []
})
export class HomeModule { }
