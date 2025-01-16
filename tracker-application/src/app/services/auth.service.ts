import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?username=${credentials.username}&password=${credentials.password}`);
  }

  register(user: {username: string, email: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, {...user, role: 'user'});
  }

  changePassword(username: string, currentPassword: string, newPassword: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users?username=${username}`)
      .pipe(
        map((users: any[]) => {
          if (users.length > 0) {
            const user = users[0];
            if (user.password === currentPassword) {
              return { id: user.id, username: user.username, password: newPassword };
            } else {
              throw 'Current password is incorrect';
            }
          } else {
            throw 'User not found';
          }
        }),
        map(user => {
          return this.http.patch(`${this.apiUrl}/users/${user.id}`, { password: user.password }).subscribe(
            () => true,
            () => { throw 'Failed to update password'; }
          );
        })
      );
  }
} 