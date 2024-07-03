import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AumFdComponent } from './aum-fd.component';

describe('AumFdComponent', () => {
  let component: AumFdComponent;
  let fixture: ComponentFixture<AumFdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumFdComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AumFdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
