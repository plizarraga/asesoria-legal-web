import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

// Custom Interceptors
import { ErrorInterceptor } from './_shared/interceptors/error.interceptor';
import { fakeBackendProvider } from './_shared/interceptors/fake-backend.interceptor';
import { JwtInterceptor } from './_shared/interceptors/jwt.interceptor';

// Components
import { AppComponent } from './app.component';

// Custom Modules
import { CoreModule } from './core/core.module';
import { SharedModule } from './_shared/shared.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    CoreModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
