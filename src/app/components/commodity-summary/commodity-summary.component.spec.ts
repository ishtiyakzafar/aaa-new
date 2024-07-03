import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommoditySummaryComponent } from './commodity-summary.component';

describe('CommoditySummaryComponent', () => {
  let component: CommoditySummaryComponent;
  let fixture: ComponentFixture<CommoditySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommoditySummaryComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommoditySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});