import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AumMldsComponent } from './aum-mlds.component';

describe('AumMldsComponent', () => {
  let component: AumMldsComponent;
  let fixture: ComponentFixture<AumMldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumMldsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AumMldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
