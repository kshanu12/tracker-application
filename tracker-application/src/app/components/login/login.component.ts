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
  constructor(private router: Router, private authService: AuthService) {}
  onLogin() {
    this.authService.login({username: this.user, password: this.password}).subscribe({
      next: (response) => {
        if(response && response.length > 0){
          console.log("Login successful");
          console.log(response);
          this.router.navigate(['/dashboard']);
        }
        else{
          alert("Login failed");
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
