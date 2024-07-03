import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddScriptPage } from './add-script.page';

describe('AddScriptPage', () => {
  let component: AddScriptPage;
  let fixture: ComponentFixture<AddScriptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScriptPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddScriptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
