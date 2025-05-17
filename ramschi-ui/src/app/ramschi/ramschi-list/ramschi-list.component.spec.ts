import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamschiListComponent } from './ramschi-list.component';

describe('RamschiListComponent', () => {
  let component: RamschiListComponent;
  let fixture: ComponentFixture<RamschiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RamschiListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RamschiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
