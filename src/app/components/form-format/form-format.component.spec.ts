import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormFormatComponent } from './form-format.component';

describe('FormFormatComponent', () => {
  let component: FormFormatComponent;
  let fixture: ComponentFixture<FormFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormFormatComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});