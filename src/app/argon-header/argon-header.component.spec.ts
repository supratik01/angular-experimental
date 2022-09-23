import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgonHeaderComponent } from './argon-header.component';

describe('ArgonHeaderComponent', () => {
  let component: ArgonHeaderComponent;
  let fixture: ComponentFixture<ArgonHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArgonHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArgonHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
