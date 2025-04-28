import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssigneeComponent } from './new-assignee.component';

describe('NewAssigneeComponent', () => {
  let component: NewAssigneeComponent;
  let fixture: ComponentFixture<NewAssigneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAssigneeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAssigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
