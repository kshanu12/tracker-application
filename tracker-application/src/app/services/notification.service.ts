import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getNotifications(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications?username=${username}&read=false`);
  }

  addNotification(notification: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/notifications`, notification);
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notifications/${id}`);
  }

  markAsRead(notification: Notification): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifications/${notification?.id}`, { ...notification, read: true });
  }
}