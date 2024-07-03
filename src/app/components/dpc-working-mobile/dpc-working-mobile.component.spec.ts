import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DpcWorkingMobileComponent } from './dpc-working-mobile.component';

describe('DpcWorkingMobileComponent', () => {
  let component: DpcWorkingMobileComponent;
  let fixture: ComponentFixture<DpcWorkingMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpcWorkingMobileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DpcWorkingMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
