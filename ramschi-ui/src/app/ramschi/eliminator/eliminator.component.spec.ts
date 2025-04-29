import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminatorComponent } from './eliminator.component';

describe('EliminatorComponent', () => {
  let component: EliminatorComponent;
  let fixture: ComponentFixture<EliminatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
