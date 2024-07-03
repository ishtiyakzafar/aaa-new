import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonService } from '../../helpers/common.service';
import { Router } from '@angular/router';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { LoginService } from '../../pages/login/login.service';


@Component({
  selector: 'app-dashboard-overall-tab',
  templateUrl: './dashboard-overall-tab.component.html',
  styleUrl: './dashboard-overall-tab.component.scss'
})
export class DashboardOverallTabComponent {

  @Input() dashSwitch:any;
  public overallDashboardData: any = [];
  public bodyParam: any;
  loader = true;
  @Input() toggleChange: any;
  activClientinfomsg = false;
  dashClientinfomsg=false;
  DormantClientinfomsg = false;
  showIcon: any;
  isBrokerageVisible:any;
  @Input() showBrokerage = false;
 @Input() showHideDashboardValue= false;
  constructor(private commonService: CommonService,private router: Router,private dashBoardService: DashBoardService, private storage: StorageServiceAAA,public toast: ToasterService,  public serviceFile: LoginService){}


  ngOnInit() {}
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty("showHideDashboardValue") && Object.entries(changes).length == 1) {
      return;
    }
    this.loader = true;
    this.overallDataApi();
  }

  overallDataApi(){
    let userId1 = localStorage.getItem('userId1');
    this.storage.get('empCode').then(val => {
      localStorage.setItem('empCode',val || userId1 || '{}');
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
					this.initOverallDetails(token,this.bodyParam);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.initOverallDetails(token,this.bodyParam);
				})
			}
		})

  }

  initOverallDetails(token: any, body: any){
    this.dashBoardService.getOverallDashboard(token, body)
    .subscribe((res: any) => {
      if (res['Head']['ErrorCode'] == 0) {
        this.overallDashboardData = res['Body'];
        this.loader = false;
      }
      else{
        this.loader = false;
        this.overallDashboardData = [];
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

  onClientsClick(param: any){
      if(param == 'Total'){
        this.router.navigate(['/dashboard-clients'],{ queryParams: {Tab: 'Overall'}});

        this.commonService.setClevertapEvent('Dashboard_Clients_clicked', { 'Login ID': localStorage.getItem('userId1'), 'Type': localStorage.getItem('DashTabSelect') });
      }
      else if(param == 'Active'){
        this.router.navigate(['/dashboard-clients'],{ queryParams: {Tab: 'Overall', SubTab: 'Active'}});

        this.commonService.setClevertapEvent('Overall_ActiveClients_Clicked', { 'Login ID': localStorage.getItem('userId1') });
      }
      else{
        this.router.navigate(['/dashboard-clients'],{ queryParams: {Tab: 'Overall', SubTab: 'Dormant'}});

        this.commonService.setClevertapEvent('Overall_DormantClients_Clicked', { 'Login ID': localStorage.getItem('userId1') });
      }
  }

  onDashClients(param: any){
    switch (param) {
      case 'EquityAUM':
          this.router.navigate(['/dashboard-aum']);
          this.commonService.setClevertapEvent('Overall_EquityAUM_Clicked', { 'Login ID': localStorage.getItem('userId1') });
          break;
      case 'MFAUM':
          this.router.navigate(['/dashboard-aum'],{ queryParams: {Tab: 'MF'}});
          this.commonService.setClevertapEvent('Overall_MFAUM_Clicked', { 'Login ID': localStorage.getItem('userId1') });
          break;
      case 'CROSSELL':
          this.router.navigate(['/dashboard-aum'],{ queryParams: {Tab: 'FD'}});
          this.commonService.setClevertapEvent('Overall_CrossellAUM_Clicked', { 'Login ID': localStorage.getItem('userId1') });
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
