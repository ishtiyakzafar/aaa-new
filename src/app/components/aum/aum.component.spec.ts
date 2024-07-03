import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AumComponent } from './aum.component';

describe('AumComponent', () => {
  let component: AumComponent;
  let fixture: ComponentFixture<AumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
