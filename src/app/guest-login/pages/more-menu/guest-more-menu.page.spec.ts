import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuestMoreRevampPage } from './guest-more-menu.page';

describe('GuestMoreRevampPage', () => {
  let component: GuestMoreRevampPage;
  let fixture: ComponentFixture<GuestMoreRevampPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestMoreRevampPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuestMoreRevampPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
