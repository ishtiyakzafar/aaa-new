import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonService } from '../../helpers/common.service';
import { Router } from '@angular/router';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-dashboard-mf-tab',
 templateUrl: './dashboard-mf-tab.component.html',
  styleUrl: './dashboard-mf-tab.component.scss'
})
export class DashboardMfTabComponent {

  @Input() dashSwitch:any;
  public mfDashboardData: any = [];
  public bodyParam: any;
  loader = true;
  @Input() toggleChange: any;
  NonRegisteredinfomsg = false;
  dashClientinfomsg=false;
  OnlyMFnfomsg = false;
  @Input() showBrokerage = false;
  @Input() showHideDashboardValue= false;
  
  constructor(private commonService: CommonService,private router: Router,private dashBoardService: DashBoardService, private storage: StorageServiceAAA,public toast: ToasterService){}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty("showHideDashboardValue") && Object.entries(changes).length == 1) {
      return;
    }
    this.loader = true;
    this.mfDataApi();
  }

  mfDataApi(){
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
					this.initmfDetails(token,this.bodyParam);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.initmfDetails(token,this.bodyParam);
				})
			}
		})
  }

  initmfDetails(token: any, body: any){
    this.dashBoardService.getMFDashboard(token, body)
    .subscribe((res: any) => {
      if (res['Head']['ErrorCode'] == 0) {
        this.mfDashboardData = res['Body'];
        this.loader = false;
      }
      else{
        this.loader = false;
        this.mfDashboardData = [];
        this.toast.displayToast(res['Head']['ErrorDescription']);
      }
    })
  }

  onAumClick(){
      this.router.navigate(['/dashboard-aum'],{ queryParams: {Tab: 'MF'}});
      this.commonService.setClevertapEvent('Dashboard_AUM_clicked', { 'Login ID': localStorage.getItem('userId1'), 'Type': localStorage.getItem('DashTabSelect') });
  }

  onPayoutClick(){
      this.router.navigate(['/dashboard-brokerage'],{ queryParams: {Tab: 'MF'}});
      this.commonService.setClevertapEvent('Dashboard_Brokerage_clicked', { 'Login ID': localStorage.getItem('userId1'), 'Type': localStorage.getItem('DashTabSelect') });
  }

  onClientsClick(){
      this.router.navigate(['/dashboard-clients'],{ queryParams: {Tab: 'MF'}});
      this.commonService.setClevertapEvent('Dashboard_Clients_clicked', { 'Login ID': localStorage.getItem('userId1'), 'Type': localStorage.getItem('DashTabSelect') });
  }

  onDashClients(param: any){
    switch (param) {
      case 'NonReg':
          this.router.navigate(['/dashboard-clients'],{ queryParams: {Tab: 'MF', SubTab: 'Active'}});
          this.commonService.setClevertapEvent('MF_NonRegisteredClients_Clicked', { 'Login ID': localStorage.getItem('userId1') });
          break;
      case 'OnlyMF':
          this.router.navigate(['/dashboard-clients'],{ queryParams: {Tab: 'MF', SubTab: 'Dormant'}});
          this.commonService.setClevertapEvent('MF_OnlyMF_Clicked', { 'Login ID': localStorage.getItem('userId1') });
          break;
      case 'TotalNew':
          this.router.navigate(['/dashboard-aum'],{ queryParams: {Tab: 'MF', SubTab: 'TotalNew'}});
          this.commonService.setClevertapEvent('MF_NewSIP_Clicked', { 'Login ID': localStorage.getItem('userId1') });
          break;
      case 'NewSip':
          this.router.navigate(['/dashboard-aum'],{ queryParams: {Tab: 'MF', SubTab: 'NewSip'}});
          this.commonService.setClevertapEvent('MF_NewSIPvalue_Clicked', { 'Login ID': localStorage.getItem('userId1') });
          break;
      case 'LiveSip':
          this.router.navigate(['/dashboard-aum'],{ queryParams: {Tab: 'MF', SubTab: 'LiveSip'}});
          this.commonService.setClevertapEvent('MF_LiveSIPvalue_Clicked', { 'Login ID': localStorage.getItem('userId1') });
          break;
      case 'TotalLive':
          this.router.navigate(['/dashboard-aum'],{ queryParams: {Tab: 'MF', SubTab: 'TotalLive'}});
          this.commonService.setClevertapEvent('MF_LiveSIP_Clicked', { 'Login ID': localStorage.getItem('userId1') });
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
