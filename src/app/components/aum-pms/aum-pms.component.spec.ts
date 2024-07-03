import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AumPmsComponent } from './aum-pms.component';

describe('AumPmsComponent', () => {
  let component: AumPmsComponent;
  let fixture: ComponentFixture<AumPmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumPmsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AumPmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
