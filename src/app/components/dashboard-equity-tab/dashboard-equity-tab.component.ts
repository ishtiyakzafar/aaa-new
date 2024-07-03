import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonService } from '../../helpers/common.service';
import { Router } from '@angular/router';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-dashboard-equity-tab',
 templateUrl: './dashboard-equity-tab.component.html',
  styleUrl: './dashboard-equity-tab.component.scss'
})
export class DashboardEquityTabComponent {

  @Input() dashSwitch:any;
  public equityDashboardData: any = [];
  public bodyParam: any;
  loader = true;
  @Input() toggleChange: any;
  NewClientinfomsg = false;
  ActiveClientinfomsg = false;
  dashClientinfomsg = false;
  Dormantinfomsg = false;
  @Input() showBrokerage = false;
  @Input() showHideDashboardValue= false;

  constructor(private commonService: CommonService,private router: Router,private dashBoardService: DashBoardService, private storage: StorageServiceAAA,public toast: ToasterService){}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty("showHideDashboardValue") && Object.entries(changes).length == 1) {
      return;
    }
    this.loader = true;
    this.equityDataApi();
  }

  equityDataApi(){
    let userId1 = localStorage.getItem('userId1');
    this.storage.get('empCode').then(val => {
      localStorage.setItem('empCode',val);
			this.bodyParam = {
        "LoginID": userId1,    
        "PartnerID": val ? val : userId1,
        "Role": localStorage.getItem('userChannel'),
        "DataType": this.toggleChange
      };
		});

    this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.initequityDetails(token,this.bodyParam);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.initequityDetails(token,this.bodyParam);
				})
			}
		})
  }

  initequityDetails(token: any, body: any){
    this.dashBoardService.getEquityDashboard(token, body)
    .subscribe((res: any) => {
      if (res['Head']['ErrorCode'] == 0) {
        this.equityDashboardData = res['Body'];
        this.loader = false;
      }
      else{
        this.loader = false;
        this.equityDashboardData = [];
        this.toast.displayToast(res['Head']['ErrorDescription']);
      }
    })
  }

  onAumClick(){
      this.router.navigate(['/dashboard-aum']);
      this.commonService.setClevertapEvent('Dashboard_AUM_clicked', { 'Login ID': localStorage.getItem('userId1'), 'Type': localStorage.getItem('DashTabSelect') });
  }

  onBrokerageClick(){
      this.router.navigate(['/dashboard-brokerage']);
      this.commonService.setClevertapEvent('Dashboard_Brokerage_clicked', { 'Login ID': localStorage.getItem('userId1'), 'Type': localStorage.getItem('DashTabSelect') });
  }

  onClientsClick(){
    this.router.navigate(['/dashboard-clients'],{ queryParams: {Tab: 'Equity'}});
    this.commonService.setClevertapEvent('Dashboard_Clients_clicked', { 'Login ID': localStorage.getItem('userId1'), 'Type': localStorage.getItem('DashTabSelect') });
  }

  onDashClients(param: any){
    switch (param) {
      case 'Active':
          this.router.navigate(['/dashboard-clients'],{ queryParams: {Tab: 'Equity', SubTab: 'Active'}});

          this.commonService.setClevertapEvent('Equity_ActiveClients_Clicked', { 'Login ID': localStorage.getItem('userId1') });
          break;
      case 'Dormant':
          this.router.navigate(['/dashboard-clients'],{ queryParams: {Tab: 'Equity', SubTab: 'Dormant'}});

          this.commonService.setClevertapEvent('Equity_DormantClients_Clicked', { 'Login ID': localStorage.getItem('userId1') });
          break;
      case 'NewClient':
          localStorage.setItem('isNewClientTab', 'NewClient');
          this.router.navigate(['/dashboard-clients'],{ queryParams: {Tab: 'Equity', SubTab: 'NewClient'}});

          this.commonService.setClevertapEvent('Equity_NewClients_Clicked', { 'Login ID': localStorage.getItem('userId1') });
          break;
    }
  }

  convertFormat(val:any){
    return this.commonService.numberFormatWithUnit(val);
  }
  public async callnotClickableTabModal() {
		this.commonService.notClickableTabModal();
	}
}
