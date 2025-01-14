import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-priority-icon',
  imports: [CommonModule],
  templateUrl: './priority-icon.component.html',
  styleUrl: './priority-icon.component.css'
})
export class PriorityIconComponent {
  @Input() priority!: string;
}
