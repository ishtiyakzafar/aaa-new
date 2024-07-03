import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BusinessOpportunitiesDetailsComponent } from './business-opportunities-details.component';

describe('BusinessOpportunitiesDetailsComponent', () => {
  let component: BusinessOpportunitiesDetailsComponent;
  let fixture: ComponentFixture<BusinessOpportunitiesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessOpportunitiesDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessOpportunitiesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
