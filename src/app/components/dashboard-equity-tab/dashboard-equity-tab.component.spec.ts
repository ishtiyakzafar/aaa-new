import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEquityTabComponent } from './dashboard-equity-tab.component';

describe('DashboardEquityTabComponent', () => {
  let component: DashboardEquityTabComponent;
  let fixture: ComponentFixture<DashboardEquityTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEquityTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardEquityTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
