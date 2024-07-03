import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOverallTabComponent } from './dashboard-overall-tab.component';

describe('DashboardOverallTabComponent', () => {
  let component: DashboardOverallTabComponent;
  let fixture: ComponentFixture<DashboardOverallTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOverallTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardOverallTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
