import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCrossSellTabComponent } from './dashboard-cross-sell-tab.component';

describe('DashboardCrossSellTabComponent', () => {
  let component: DashboardCrossSellTabComponent;
  let fixture: ComponentFixture<DashboardCrossSellTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCrossSellTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardCrossSellTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
