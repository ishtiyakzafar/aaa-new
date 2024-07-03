import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageCustomMappingPage } from './manage-custom-mapping';

describe('ManageCustomMappingPage', () => {
  let component: ManageCustomMappingPage;
  let fixture: ComponentFixture<ManageCustomMappingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCustomMappingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageCustomMappingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
