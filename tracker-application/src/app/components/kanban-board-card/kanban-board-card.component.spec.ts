import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBoardCardComponent } from './kanban-board-card.component';

describe('KanbanBoardCardComponent', () => {
  let component: KanbanBoardCardComponent;
  let fixture: ComponentFixture<KanbanBoardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanBoardCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanBoardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
