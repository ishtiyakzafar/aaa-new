import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConsolidatedTradeListingComponent } from './consolidated-trade-listing.component';

describe('ConsolidatedTradeListingComponent', () => {
  let component: ConsolidatedTradeListingComponent;
  let fixture: ComponentFixture<ConsolidatedTradeListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedTradeListingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsolidatedTradeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
