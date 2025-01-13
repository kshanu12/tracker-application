import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Task, TaskService } from '../../services/task.service';
import { User, UsersService } from '../../services/users.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
  task: Task = {
    id: '',
    title: '',
    description: '',
    status: 'To Do',
    assignee: '',
    dueDate: ''
  };

  users: User[] =[];

  constructor(
    private taskService: TaskService,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  onSubmit() {
    this.taskService.createTask(this.task).subscribe({
      next: () => {
        console.log('Task created successfully');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error creating task:', error);
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
