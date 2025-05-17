import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamschiFilterComponent } from './ramschi-filter.component';

describe('RamschiFilterComponent', () => {
  let component: RamschiFilterComponent;
  let fixture: ComponentFixture<RamschiFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RamschiFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RamschiFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
