import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router
  ) {}

  canActivate() {
    const isLoggedIn = localStorage.getItem('currentUser');
    if (isLoggedIn) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
} 