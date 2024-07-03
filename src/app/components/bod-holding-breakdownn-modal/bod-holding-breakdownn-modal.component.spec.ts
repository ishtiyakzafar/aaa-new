import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BodHoldingBreakdownnModalComponent } from './bod-holding-breakdownn-modal.component';

describe('BodHoldingBreakdownnModalComponent', () => {
  let component: BodHoldingBreakdownnModalComponent;
  let fixture: ComponentFixture<BodHoldingBreakdownnModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodHoldingBreakdownnModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BodHoldingBreakdownnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
