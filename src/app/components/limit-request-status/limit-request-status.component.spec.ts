import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LimitRequestStatusPage } from './limit-request-status.component';

describe('LimitRequestStatusPage', () => {
  let component: LimitRequestStatusPage;
  let fixture: ComponentFixture<LimitRequestStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitRequestStatusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LimitRequestStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
