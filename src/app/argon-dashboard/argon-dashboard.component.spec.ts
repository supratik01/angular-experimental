import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgonDashboardComponent } from './argon-dashboard.component';

describe('ArgonDashboardComponent', () => {
  let component: ArgonDashboardComponent;
  let fixture: ComponentFixture<ArgonDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArgonDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArgonDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
