import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize, map } from 'rxjs/operators';
import faker from 'faker';
// const faker = require('faker');

// array in local storage for users
const usersKey = 'asesoria-legal-fake-users';
const users = JSON.parse(localStorage.getItem(usersKey)) || [];

// array in local storage for citas
const citasKey = 'asesoria-legal-fake-citas';
let citas = JSON.parse(localStorage.getItem(citasKey)) || [];

// add test user and save if users array is empty
if (!users.length) {
  users.push(
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@outlook.com',
      password: '1234567',
      role: 'user',
      refreshTokens: []
    },
    {
      id: 2,
      firstName: 'Jimi',
      lastName: 'Hendrix',
      email: 'jhendrix@outlook.com',
      password: '1234567',
      role: 'asesor',
      refreshTokens: []
    });
  localStorage.setItem(usersKey, JSON.stringify(users));
}

// add test citas and save if citas array is empty
if (!citas.length) {
  const temasMock = ['Divorcio', 'Contrato', 'Inmigración', 'Herencia'];

  // Citas próximas
  for (let index = 0; index < 7; index++) {
    citas.push({
      id: faker.random.number(),
      fecha: faker.date.future(),
      tema: faker.random.arrayElement(temasMock),
      abogado: faker.name.findName(),
      cliente: faker.name.findName(),
      link: 'https://zoom.cita.com/' + faker.random.number()
    });
  }

  // Citas archivadas
  for (let index = 0; index < 15; index++) {
    citas.push({
      id: faker.random.number(),
      fecha: faker.date.past(),
      tema: faker.random.arrayElement(temasMock),
      abogado: faker.name.findName(),
      cliente: faker.name.findName(),
      link: 'https://zoom.cita.com/' + faker.random.number()
    });
  }

  localStorage.setItem(citasKey, JSON.stringify(citas));
}
// MOCK DATA - END

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        // Auth api routes
        case url.endsWith('/users/auth/signin') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();

        // Citas api routes
        case url.endsWith('/citas') && method === 'GET':
          return getCitas();
        case url.match(/\/citas\/\d+$/) && method === 'GET':
          return getCitaById();
        case url.endsWith('/citas') && method === 'POST':
          return createCita();
        case url.match(/\/citas\/\d+$/) && method === 'PUT':
          return updateCita();
        case url.match(/\/citas\/\d+$/) && method === 'DELETE':
          return deleteCita();
          // Default route
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate(): Observable<HttpResponse<any>> {
      const { email, password } = body.user;
      const user = users.find(x => x.email === email && x.password === password);

      if (!user) { return error('Correo electrónico/contraseña incorrectos'); }

      // add refresh token to user
      user.refreshTokens.push(generateRefreshToken());
      localStorage.setItem(usersKey, JSON.stringify(users));

      return ok({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        jwtToken: generateJwtToken()
      });
    }

    function getUsers(): Observable<HttpResponse<any>> | Observable<never> {
      if (!isLoggedIn()) { return unauthorized(); }
      return ok(users);
    }

    // citas functions routes
    function getCitas(): Observable<HttpResponse<any>> | Observable<never> {
      // if (!isLoggedIn()) { return unauthorized(); }
      return ok(citas);
    }

    function getCitaById(): Observable<HttpResponse<any>> {
      // if (!isLoggedIn()) { return unauthorized(); }
      const cita = citas.find(x => x.id === idFromUrl());
      return ok(cita);
    }

    function createCita(): Observable<HttpResponse<any>> {
      // if (!isLoggedIn()) { return unauthorized(); }
      const cita = body;

      // assign cita id and a few other properties then save
      cita.id = newModelId(citas);
      citas.push(cita);
      localStorage.setItem(citasKey, JSON.stringify(citas));

      return ok();
    }

    function updateCita(): Observable<HttpResponse<any>> {
      // if (!isLoggedIn()) { return unauthorized(); }

      const params = body;
      const cita = citas.find(x => x.id === idFromUrl());

      // update and save cita
      Object.assign(cita, params);
      localStorage.setItem(citasKey, JSON.stringify(citas));

      return ok();
    }

    function deleteCita(): Observable<HttpResponse<any>> {
      // if (!isLoggedIn()) { return unauthorized(); }

      citas = citas.filter(x => x.id !== idFromUrl());
      localStorage.setItem(citasKey, JSON.stringify(citas));
      return ok();
    }

    // Helpers functions
    function ok(body?): Observable<HttpResponse<any>> {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message): Observable<never> {
      return throwError({ error: { message } });
    }

    function unauthorized(): Observable<never> {
      return throwError({ status: 401, error: { message: 'Unauthorized' } });
    }

    function isLoggedIn(): boolean {
      // check if jwt token is in auth header
      const authHeader = headers.get('Authorization');
      if (!authHeader.startsWith('Bearer fake-jwt-token')) { return false; };

      // check if token is expired
      const jwtToken = JSON.parse(atob(authHeader.split('.')[1]));
      const tokenExpired = Date.now() > (jwtToken.exp * 1000);
      if (tokenExpired) { return false; }

      return true;
    }

    function generateJwtToken(): string {
      // create token that expires in 15 minutes
      const tokenPayload = { exp: Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000) }
      return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
    }

    function generateRefreshToken(): string {
      const token = new Date().getTime().toString();

      // add token cookie that expires in 7 days
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;

      return token;
    }

    function getRefreshToken(): string {
      // get refresh token from cookie
      return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
    }

    function idFromUrl(): number {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function uuidFromUrl(): string {
      const uuid = url.split('/')[2];
      return uuid;
    }

    function newModelId(model): number {
      return model.length ? Math.max(...model.map(x => x.id)) + 1 : 1;
    }
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
