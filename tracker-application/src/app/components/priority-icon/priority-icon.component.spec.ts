import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityIconComponent } from './priority-icon.component';

describe('PriorityIconComponent', () => {
  let component: PriorityIconComponent;
  let fixture: ComponentFixture<PriorityIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorityIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
