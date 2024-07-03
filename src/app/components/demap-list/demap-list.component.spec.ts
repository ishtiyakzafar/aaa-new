import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemapListComponent } from './demap-list.component';

describe('DemapListComponent', () => {
  let component: DemapListComponent;
  let fixture: ComponentFixture<DemapListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemapListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemapListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
