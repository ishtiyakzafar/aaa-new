import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpHoldingReportsComponent } from './dp-holding-reports.component';

describe('DpHoldingReportsComponent', () => {
  let component: DpHoldingReportsComponent;
  let fixture: ComponentFixture<DpHoldingReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DpHoldingReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DpHoldingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
