import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenFashionComponent } from './men-fashion.component';

describe('MenFashionComponent', () => {
  let component: MenFashionComponent;
  let fixture: ComponentFixture<MenFashionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenFashionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenFashionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
