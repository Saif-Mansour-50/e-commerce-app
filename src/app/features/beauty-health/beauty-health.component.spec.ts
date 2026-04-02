import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeautyHealthComponent } from './beauty-health.component';

describe('BeautyHealthComponent', () => {
  let component: BeautyHealthComponent;
  let fixture: ComponentFixture<BeautyHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeautyHealthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BeautyHealthComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
