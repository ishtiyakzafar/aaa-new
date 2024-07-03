import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CallSupportModelComponent } from './call-support-model.component';

describe('CallSupportModelComponent', () => {
  let component: CallSupportModelComponent;
  let fixture: ComponentFixture<CallSupportModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallSupportModelComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CallSupportModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
