import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageAccessControlModalComponent } from './brokerage-access-control-modal.component';

describe('BrokerageAccessControlModalComponent', () => {
  let component: BrokerageAccessControlModalComponent;
  let fixture: ComponentFixture<BrokerageAccessControlModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrokerageAccessControlModalComponent]
    });
    fixture = TestBed.createComponent(BrokerageAccessControlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
