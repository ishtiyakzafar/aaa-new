import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BulkBlockDealsPage } from './bulk-block-deals.page';

describe('BulkBlockDealsPage', () => {
  let component: BulkBlockDealsPage;
  let fixture: ComponentFixture<BulkBlockDealsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkBlockDealsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BulkBlockDealsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
