import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommodityClientScripSummaryComponent } from './commodity-client-scrip-summary.component';

describe('CommodityClientScripSummaryComponent', () => {
  let component: CommodityClientScripSummaryComponent;
  let fixture: ComponentFixture<CommodityClientScripSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommodityClientScripSummaryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommodityClientScripSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
