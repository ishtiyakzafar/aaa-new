import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendtoBankComponent } from './sendto-bank.component';

describe('SendtoBankComponent', () => {
  let component: SendtoBankComponent;
  let fixture: ComponentFixture<SendtoBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendtoBankComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendtoBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
