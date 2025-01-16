import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task, TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { KanbanBoardCardComponent } from '../kanban-board-card/kanban-board-card.component';
import { User, UsersService } from '../../services/users.service';
import { authGuard } from '../../services/rbac.service';
import { Notification, NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, KanbanBoardCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];
  searchTerm: string = '';
  isAdmin: boolean = false;
  filteredTasks: Task[] = [];
  users: User[] = [];
  priorityFilter: string = '';
  assigneeFilter: string = '';
  notifications: Notification[] = [];
  showNotifications: boolean = false;
  showProfile: boolean = false;

  constructor(private taskService: TaskService, private router: Router, private userService: UsersService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.loadTasks();
    this.loadUsers();
    this.isAdmin = authGuard('admin');
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
        this.categorizeTasks();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  categorizeTasks() {
    this.todoTasks = this.filteredTasks.filter(task => task.status === 'To Do');
    this.inProgressTasks = this.filteredTasks.filter(task => task.status === 'In Progress');
    this.doneTasks = this.filteredTasks.filter(task => task.status === 'Done');
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const task = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      if (newStatus && task.status !== newStatus) {
        task.status = newStatus;
        this.taskService.updateTask(task).subscribe({
          next: () => {
            let adminNotification;
            const notification = {
              message: `Task ${task.title} status changed to ${newStatus}`,
              username: task.assignee,
              timestamp: new Date(),
              read: false
            };
            if (task.assignee !== 'admin') {
              adminNotification = {
                message: `Task ${task.title} status changed to ${newStatus} for ${task.assignee}`,
                username: 'admin',
                timestamp: new Date(),
                read: false
              };
              this.notificationService.addNotification(adminNotification).subscribe();
            }
            this.notificationService.addNotification(notification).subscribe();
          },
          error: (error) => {
            console.error('Error updating task:', error);
            this.loadTasks();
          }
        });
      }
    }
  }

  getStatusFromContainerId(containerId: string): 'To Do' | 'In Progress' | 'Done' | null {
    switch (containerId) {
      case 'cdk-drop-list-0':
        return 'To Do';
      case 'cdk-drop-list-1':
        return 'In Progress';
      case 'cdk-drop-list-2':
        return 'Done';
      default:
        return null;
    }
  }

  searchTasks() {
    if (!this.searchTerm.trim()) {
      this.filteredTasks = this.tasks;
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredTasks = this.tasks.filter(task =>
        task.title.toLowerCase().includes(searchTermLower) ||
        task.description.toLowerCase().includes(searchTermLower) ||
        task.assignee.toLowerCase().includes(searchTermLower) ||
        task.priority.toLowerCase().includes(searchTermLower)
      );
    }
    this.filteredTasks = this.filteredTasks.filter(task => {
      return (
        (this.priorityFilter ? task.priority === this.priorityFilter : true) &&
        (this.assigneeFilter ? task.assignee === this.assigneeFilter : true)
      );
    });
    this.categorizeTasks();
  }

  createTask() {
    this.router.navigate(['/task']);
    console.log('Creating new task');
  }

  updateTask(task: Task) {
    this.router.navigate(['/task'], { queryParams: { id: task.id } });
    console.log('Updating task:', task);
  }

  deleteTask(task: Task) {
    if (this.isAdmin && task.id) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  callNotificationService() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
    this.notificationService.getNotifications(currentUser.role).subscribe(
      (notifications) => {
        console.log({ notifications });
        this.notifications = notifications;
        this.notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  openNotifications() {
    this.showNotifications = !this.showNotifications;
    this.callNotificationService();
  }

  markAsRead(notification: Notification) {
    console.log({ notification });
    this.notificationService.markAsRead(notification).subscribe();
    this.callNotificationService();
  }

  resetPassword() {
    this.router.navigate(['/reset-password']);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
