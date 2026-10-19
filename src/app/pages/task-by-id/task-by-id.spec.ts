import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskById } from './task-by-id';

describe('TaskById', () => {
  let component: TaskById;
  let fixture: ComponentFixture<TaskById>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskById],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskById);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
