import { Component, OnInit } from '@angular/core';
import { Platform,ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { CommonService } from '../../helpers/common.service';
import { ActivatedRoute, Router} from '@angular/router';
import { EmiCalculatorComponent } from '../../components/emi-calculator/emi-calculator.component';
import { SipCalculatorComponent } from '../../components/sip-calculator/sip-calculator.component';
import { SipRevenueCalculatorComponent } from '../../components/sip-revenue-calculator/sip-revenue-calculator.component';
import { SpanMarginCalculatorComponent } from '../../components/span-margin-calculator/span-margin-calculator.component';
import { GoalCalculatorComponent } from '../../components/goal-calculator/goal-calculator.component';



@Component({
  selector: 'app-calculators',
  templateUrl: './calculators.page.html',
  styleUrls: ['./calculators.page.scss'],
})
export class CalculatorsPage implements OnInit {
  public calculatorTabValue: any;
  public calculatorType: any[] = [
    {name: 'EMI Calculator', value: 'emi'},
    {name: 'SIP Calculator', value: 'sip'},
    {name: 'SIP Revenue Calculator', value: 'sipRevenue'},
    {name: 'Span Margin Calculator', value: 'spanMargin'},
    {name: 'Goal Calculator', value: 'goal'}
  ]
  urlParameter:any;
  calculatorSeg:any;
  constructor(private modalController: ModalController, private commonService: CommonService, private location: Location, private route: ActivatedRoute, private platform: Platform, private router: Router) { }

  ngOnInit() {
    this.commonService.analyticEvent('More_Calculators', 'Calculators');
    this.commonService.setClevertapEvent('Calculators');
   

  }

  ionViewWillEnter() {
    this.urlParameter = this.route.params.subscribe(params => {
			this.calculatorSeg = params['id'];
    });

    // console.log(this.calculatorSeg);
    
    if(this.calculatorSeg == 'sip'){
      if (this.platform.is('desktop')) {
        this.calculatorTabValue = 'sip'
      }
      else{
        this.goToCalculator('sip')
      }

    }

    else if(this.calculatorSeg == 'sipRevenue'){
      if (this.platform.is('desktop')) {
        this.calculatorTabValue = 'sipRevenue'
      }
      else{
        this.goToCalculator('sipRevenue')
      }
    }
    
    else if(this.calculatorSeg == 'spanMargin'){
      this.calculatorTabValue = 'spanMargin'
    }
    else if(this.calculatorSeg == 'goal'){
      this.calculatorTabValue = 'goal'
    }
    else if(this.calculatorSeg == 'emi'){
      if (this.platform.is('desktop')) {
        this.calculatorTabValue = 'emi'
      }
      else{
        this.goToCalculator('emi')
      }
      
    }

  }

  public goBack() {
    window.history.back();
  }

  // open relevant calculator
  async goToCalculator(calculatorType: any) {
    if (calculatorType === 'emi') {
      const modal = await this.modalController.create({
        component: EmiCalculatorComponent,
        cssClass: 'emi-calculator calculator-modal',
        componentProps: {}
      });
      return await modal.present();
    } else if (calculatorType === 'sip') {
      const modal = await this.modalController.create({
        component: SipCalculatorComponent,
        cssClass: 'sip-calculator calculator-modal',
        componentProps: {}
      });
      return await modal.present();
    } else if (calculatorType === 'spanMargin') {
      const modal = await this.modalController.create({
        component: SpanMarginCalculatorComponent,
        cssClass: 'span-margin-calculator calculator-modal',
        componentProps: {}
      });
      return await modal.present();
    } else if (calculatorType === 'sipRevenue') {
      const modal = await this.modalController.create({
        component: SipRevenueCalculatorComponent,
        cssClass: 'sip-revenue-calculator calculator-modal',
        componentProps: {}
      });
      return await modal.present();
    } else if (calculatorType === 'goal') {
      const modal = await this.modalController.create({
        component: GoalCalculatorComponent,
       // cssClass: 'sip-revenue-calculator calculator-modal',
        componentProps: {}
      });
      return await modal.present();
    }
  }

  segmentChanged(event: any) {
    // console.log(event)
    this.location.replaceState('/calculators/' + event);
    // if(event == 'sip'){
    //   this.location.replaceState('/calculators/' + event);
    // }
    // else if(event == 'sipRevenue'){

    // }
    // else if(event == 'spanMargin'){
      
    // }
    // else if(event == 'goal'){
      
    // }
   }
}
