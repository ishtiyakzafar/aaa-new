import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewLoginPage } from './new-login.page';

describe('NewLoginPage', () => {
  let component: NewLoginPage;
  let fixture: ComponentFixture<NewLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
