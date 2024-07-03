import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RealTimeMarginShortfallComponent } from './real-time-margin-shortfall.component';

describe('RealTimeMarginShortfallComponent', () => {
  let component: RealTimeMarginShortfallComponent;
  let fixture: ComponentFixture<RealTimeMarginShortfallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealTimeMarginShortfallComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RealTimeMarginShortfallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
