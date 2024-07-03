import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PartnerCodePage } from './partner-code.page';

describe('PartnerCodePage', () => {
  let component: PartnerCodePage;
  let fixture: ComponentFixture<PartnerCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerCodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PartnerCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
