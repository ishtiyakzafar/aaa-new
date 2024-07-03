import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMfTabComponent } from './dashboard-mf-tab.component';

describe('DashboardMfTabComponent', () => {
  let component: DashboardMfTabComponent;
  let fixture: ComponentFixture<DashboardMfTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMfTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardMfTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
