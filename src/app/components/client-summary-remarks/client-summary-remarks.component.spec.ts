import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClientSummaryRemarksComponent } from './client-summary-remarks.component';

describe('ClientSummaryRemarksComponent', () => {
  let component: ClientSummaryRemarksComponent;
  let fixture: ComponentFixture<ClientSummaryRemarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSummaryRemarksComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientSummaryRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
