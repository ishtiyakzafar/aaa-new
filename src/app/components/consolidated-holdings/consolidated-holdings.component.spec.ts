import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConsolidatedHoldingsComponent } from './consolidated-holdings.component';

describe('ConsolidatedHoldingsComponent', () => {
  let component: ConsolidatedHoldingsComponent;
  let fixture: ComponentFixture<ConsolidatedHoldingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedHoldingsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsolidatedHoldingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
