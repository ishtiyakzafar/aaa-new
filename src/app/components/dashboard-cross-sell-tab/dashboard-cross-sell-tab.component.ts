import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonService } from '../../helpers/common.service';
import { Router } from '@angular/router';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-dashboard-cross-sell-tab',
   templateUrl: './dashboard-cross-sell-tab.component.html',
  styleUrl: './dashboard-cross-sell-tab.component.scss'
})
export class DashboardCrossSellTabComponent {

  @Input() dashSwitch:any;
  public crossDashboardData: any = [];
  public bodyParam: any;
  loader = true;
  @Input() toggleChange: any;
  @Input() showBrokerage = false;
  @Input() showHideDashboardValue= false;
  dashClientinfomsg =false;

  constructor(private commonService: CommonService,private router: Router,private dashBoardService: DashBoardService, private storage: StorageServiceAAA,public toast: ToasterService){}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty("showHideDashboardValue") && Object.entries(changes).length == 1) {
      return;
    }
    this.loader = true;
    this.crossDataApi();
  }

  crossDataApi(){
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
					this.initcrossDetails(token,this.bodyParam);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.initcrossDetails(token,this.bodyParam);
				})
			}
		})
  }

  initcrossDetails(token: any, body: any){
    this.dashBoardService.getCrossSellDetails(token, body)
    .subscribe((res: any) => {
      if (res['Head']['ErrorCode'] == 0) {
        this.crossDashboardData = res['Body'];
        this.loader = false;
      }
      else{
        this.loader = false;
        this.crossDashboardData = [];
        this.toast.displayToast(res['Head']['ErrorDescription']);
      }
    })
  }

  onAumClick(){
      this.router.navigate(['/dashboard-aum'],{ queryParams: {Tab: 'FD'}});
      this.commonService.setClevertapEvent('Dashboard_AUM_clicked', { 'Login ID': localStorage.getItem('userId1'), 'Type': localStorage.getItem('DashTabSelect') });
  }

  onPayoutClick(){
      this.router.navigate(['/dashboard-brokerage'],{ queryParams: {Tab: 'FD'}});
      this.commonService.setClevertapEvent('Dashboard_Brokerage_clicked', { 'Login ID': localStorage.getItem('userId1'), 'Type': localStorage.getItem('DashTabSelect') });
  }

  onClientsClick(){
      this.router.navigate(['/dashboard-clients'],{ queryParams: {Tab: 'CS'}});
      this.commonService.setClevertapEvent('Dashboard_Clients_clicked', { 'Login ID': localStorage.getItem('userId1'), 'Type': localStorage.getItem('DashTabSelect') });
  }

  onDashClients(param: any){
    switch (param) {
      case 'FD':
          this.router.navigate(['/dashboard-aum'],{ queryParams: {Tab: 'FD'}});
          this.commonService.setClevertapEvent('FDBondAUM_Clicked', { 'Login ID': localStorage.getItem('userId1') });
          break;
      case 'PMS':
          this.router.navigate(['/dashboard-aum'],{ queryParams: {Tab: 'PMS'}});
          this.commonService.setClevertapEvent('PMSAIFAUM_Clicked', { 'Login ID': localStorage.getItem('userId1') });
          break;
      case 'MLD':
          this.router.navigate(['/dashboard-aum'],{ queryParams: {Tab: 'MLD'}});
          this.commonService.setClevertapEvent('MLDGOLD_Clicked', { 'Login ID': localStorage.getItem('userId1') });
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
