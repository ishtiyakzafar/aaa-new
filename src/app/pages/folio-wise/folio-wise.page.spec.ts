import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FolioWisePage } from './folio-wise.page';

describe('FolioWisePage', () => {
  let component: FolioWisePage;
  let fixture: ComponentFixture<FolioWisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolioWisePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FolioWisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
