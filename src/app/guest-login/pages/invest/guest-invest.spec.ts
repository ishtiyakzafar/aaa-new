import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuestTab3Page } from './guest-invest';

describe('GuestTab3Page', () => {
  let component: GuestTab3Page;
  let fixture: ComponentFixture<GuestTab3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuestTab3Page],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuestTab3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
