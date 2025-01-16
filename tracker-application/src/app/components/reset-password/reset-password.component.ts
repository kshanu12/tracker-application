import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  errorMessage: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  currentPassword: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { };

  onSubmit() {
    this.username = JSON.parse(localStorage.getItem('currentUser') || '{}').username;
    if (this.password === '' || this.confirmPassword === '' || this.currentPassword === '') {
      this.errorMessage = '*Please fill in all fields';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = '*Passwords do not match';
      return;
    }
    if (this.password === this.currentPassword) {
      this.errorMessage = '*New password cannot be the same as the current password';
      return;
    }
    this.authService.changePassword(this.username, this.currentPassword, this.password).subscribe((response: any) => {
      this.successMessage = '*Password changed successfully';
      this.errorMessage = '';
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);
    }, () => {
      this.errorMessage = '*Failed to change password';
    });
  }
}
