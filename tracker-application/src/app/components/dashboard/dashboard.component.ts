import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task, TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { KanbanBoardCardComponent } from '../kanban-board-card/kanban-board-card.component';
import { User, UsersService } from '../../services/users.service';
import { authGuard } from '../../services/rbac.service';

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

  constructor(private taskService: TaskService, private router: Router, private userService: UsersService) {}

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
            if (this.isAdmin) {
              console.log(`Task ${task.title} status changed to ${newStatus}`);
            }
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
      case 'todoList':
        return 'To Do';
      case 'inProgressList':
        return 'In Progress';
      case 'doneList':
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
}
