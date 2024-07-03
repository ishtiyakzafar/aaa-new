import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HelpFaqSubrootComponent } from './help-faq-subroot.component';

describe('HelpFaqSubrootComponent', () => {
  let component: HelpFaqSubrootComponent;
  let fixture: ComponentFixture<HelpFaqSubrootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpFaqSubrootComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpFaqSubrootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
