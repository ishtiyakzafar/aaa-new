import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RealisedPnlComponent } from './realised-pnl.component';

describe('RealisedPnlComponent', () => {
  let component: RealisedPnlComponent;
  let fixture: ComponentFixture<RealisedPnlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealisedPnlComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RealisedPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
