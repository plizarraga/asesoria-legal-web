import { Component, OnInit } from '@angular/core';

import { IUser } from '../../_shared/models/user.model';
import { IRole } from '../../_shared/models/role.model';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']

})
export class NavbarComponent implements OnInit {
  user: IUser;
  searchFormMobileActive = false;

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(x => this.user = x);
  }

  get isAdmin(): boolean {
    return this.user && this.user.role === IRole.Admin;
  }

  get isUser(): boolean {
    return this.user && this.user.role === IRole.User ;
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
  }
}
