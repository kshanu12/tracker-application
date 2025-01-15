import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { PriorityIconComponent } from '../priority-icon/priority-icon.component';
import { authGuard } from '../../services/rbac.service';

@Component({
  selector: 'app-kanban-board-card',
  standalone: true,
  imports: [CommonModule, PriorityIconComponent],
  templateUrl: './kanban-board-card.component.html',
  styleUrl: './kanban-board-card.component.css'
})
export class KanbanBoardCardComponent {
  @Input() task!: Task;
  @Input() isAdmin!: boolean;
  @Output() updateTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();

  timeLeft: string = '';
  timeLeftColor: string = '';

  ngOnInit() {
    this.updateTimeLeft();
  }

  private updateTimeLeft(): void {
    const now = new Date();
    const dueDate = new Date(this.task.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    
    this.timeLeftColor = timeDiff > 0 ? 'green' : 'red';
    console.log(timeDiff);

    if (timeDiff < 0) {
      const overdueDays = Math.abs(Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
      this.timeLeft = `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`;
    } else {
      const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      this.timeLeft = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
    }
  }
  callAuthGuard(role: string){
    return authGuard(role);
  }
}
