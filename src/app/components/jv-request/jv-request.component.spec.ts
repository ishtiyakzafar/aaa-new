import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JvRequestComponent } from './jv-request.component';

describe('JvRequestComponent', () => {
  let component: JvRequestComponent;
  let fixture: ComponentFixture<JvRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvRequestComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JvRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
