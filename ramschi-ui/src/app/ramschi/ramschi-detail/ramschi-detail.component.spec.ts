import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamschiDetailComponent } from './ramschi-detail.component';

describe('RamschiDetailComponent', () => {
  let component: RamschiDetailComponent;
  let fixture: ComponentFixture<RamschiDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RamschiDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RamschiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
