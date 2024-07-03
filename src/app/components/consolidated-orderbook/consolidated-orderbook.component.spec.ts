import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConsolidatedOrderbookComponent } from './consolidated-orderbook.component';

describe('ConsolidatedOrderbookComponent', () => {
  let component: ConsolidatedOrderbookComponent;
  let fixture: ComponentFixture<ConsolidatedOrderbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedOrderbookComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsolidatedOrderbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
