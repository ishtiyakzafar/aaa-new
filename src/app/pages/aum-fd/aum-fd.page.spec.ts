import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AumFdPage } from './aum-fd.page';

describe('AumFdPage', () => {
  let component: AumFdPage;
  let fixture: ComponentFixture<AumFdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumFdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AumFdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
