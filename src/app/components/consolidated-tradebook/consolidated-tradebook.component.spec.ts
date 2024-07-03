import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConsolidatedTradebookComponent } from './consolidated-tradebook.component';

describe('ConsolidatedTradebookComponent', () => {
  let component: ConsolidatedTradebookComponent;
  let fixture: ComponentFixture<ConsolidatedTradebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedTradebookComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsolidatedTradebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
