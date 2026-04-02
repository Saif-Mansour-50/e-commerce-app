import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomenFashionComponent } from './women-fashion.component';

describe('WomenFashionComponent', () => {
  let component: WomenFashionComponent;
  let fixture: ComponentFixture<WomenFashionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WomenFashionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WomenFashionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
