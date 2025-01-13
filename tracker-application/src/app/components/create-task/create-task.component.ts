import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  users: User[] = [];

  constructor(
    private taskService: TaskService,
    private router: Router,
    private usersService: UsersService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.task.id = params['id'];
      if (this.task.id) {
        this.taskService.getTask(this.task.id).subscribe((task) => {
          this.task = task;
        });
      }
    });
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  onSubmit() {
    console.log(this.task);
    if (this.task.id !== '' && this.task.id !== null && this.task.id !== undefined) {
      this.taskService.updateTask(this.task).subscribe({
        next: () => {
          console.log('Task updated successfully');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error updating task:', error);
        }
      });
    } else {
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
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
