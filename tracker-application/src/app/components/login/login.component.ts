import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: string = '';
  password: string = '';
  error: string = '';
  constructor(private router: Router, private authService: AuthService) {}
  onLogin() {
    if(this.user === '' || this.password === ''){
      this.error = "*Please enter a username and password";
      return;
    }
    this.authService.login({username: this.user, password: this.password}).subscribe({
      next: (response) => {
        if(response && response.length > 0){
          localStorage.setItem('currentUser', JSON.stringify(response[0]));
          this.router.navigate(['/dashboard']);
        }
        else{
          this.error = "*Login failed. Please check your username and password.";
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
}
