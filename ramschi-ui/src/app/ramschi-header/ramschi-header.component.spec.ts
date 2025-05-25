import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamschiHeaderComponent } from './ramschi-header.component';

describe('RamschiHeaderComponent', () => {
  let component: RamschiHeaderComponent;
  let fixture: ComponentFixture<RamschiHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RamschiHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RamschiHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
