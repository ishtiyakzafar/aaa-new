import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UnrealizedPnlComponent } from './unrealized-pnl.component';

describe('UnrealizedPnlComponent', () => {
  let component: UnrealizedPnlComponent;
  let fixture: ComponentFixture<UnrealizedPnlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnrealizedPnlComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UnrealizedPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
