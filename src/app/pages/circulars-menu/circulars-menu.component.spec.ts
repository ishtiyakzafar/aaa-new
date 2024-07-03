import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularsMenuComponent } from './circulars-menu.component';

describe('CircularsMenuComponent', () => {
  let component: CircularsMenuComponent;
  let fixture: ComponentFixture<CircularsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularsMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CircularsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
