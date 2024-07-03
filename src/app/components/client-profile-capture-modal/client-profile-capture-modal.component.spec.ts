import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClientProfileCaptureModalComponent } from './client-profile-capture-modal.component';

describe('ClientProfileCaptureModalComponent', () => {
  let component: ClientProfileCaptureModalComponent;
  let fixture: ComponentFixture<ClientProfileCaptureModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProfileCaptureModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientProfileCaptureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
