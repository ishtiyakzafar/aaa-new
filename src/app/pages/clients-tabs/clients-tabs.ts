import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'clients-tabs',
  templateUrl: './clients-tabs.html',
  styleUrls: ['./clients-tabs.scss'],
})
export class ClientTabsPage implements OnInit {
  @ViewChild('chartJSContainer1') chartJSContainer1: any;
  @ViewChild('chartJSContainer2') chartJSContainer2: any;
  @ViewChild('chartJSContainer3') chartJSContainer3: any;


  
  clientTabValue = "rmView"
  @Output() passTabParams = new EventEmitter<any>();
  @Input() clientCode: any;
  clientTabTrack:any;
  dognut:any;
  dognut1:any;
  dognut2:any;
  treeChartFirst:any;
  treeChartSecond:any;
  public cardSegments: any[] = [
    {name: 'Direct Equity', segmentValue:'equity', value:'7,23,500.25' , pl:'+ 25.58%'},
    {name: 'Mutual Funds', segmentValue:'mutualFund', value:'5,45,290.45' , pl:'+ 24.58%'},
    {name: 'Fixed Deposit', segmentValue:'fd', value:'4,45,300.00' , pl:'+ 25.58%'},
    {name: 'Bonds', segmentValue:'bonds', value:'1,45,129.25' , pl:'+ 25.58%'},
    {name: 'AIF', segmentValue:'aif', value:'4,45,129.25' , pl:'+ 25.58%'},
    {name: 'PMS', segmentValue:'pms', value:'7,45,129.25' , pl:'+ 25.58%'},
    {name: 'Held-Away', segmentValue:'heldaway', value:'8,45,129.25' , pl:'+ 25.58%'},
  ]
  public equityBlockTabValue = 'equity';
  selectedTab:any;
  constructor(private router: Router) { }

  ngOnInit() {
    

  }

  ionViewWillEnter(){
   
  }

  goToAccDetail(){
    this.router.navigate(['/client-account-details']);
  }

  changeClientTab(event: any){
    this.passTabParams.emit(event.detail.value);
    this.clientTabValue = event.detail.value;

  }

}
