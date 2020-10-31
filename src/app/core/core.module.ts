import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Layouts
import { MainLayoutComponent } from './layouts/main-layout.component';

// Components
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    MainLayoutComponent,
    PageNotFoundComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule.forRoot(),
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    PageNotFoundComponent,
    MainLayoutComponent
  ]
})
export class CoreModule { }
