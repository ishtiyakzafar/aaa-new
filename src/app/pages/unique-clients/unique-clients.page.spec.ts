import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UniqueClientsPage } from './unique-clients.page';

describe('UniqueClientsPage', () => {
  let component: UniqueClientsPage;
  let fixture: ComponentFixture<UniqueClientsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniqueClientsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UniqueClientsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
