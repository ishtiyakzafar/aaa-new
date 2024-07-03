import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginService } from '../../pages/login/login.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-brokerage-access-control-modal',
  providers: [LoginService],
  templateUrl: './brokerage-access-control-modal.component.html',
  styleUrls: ['./brokerage-access-control-modal.component.css']
})
export class BrokerageAccessControlModalComponent {

  loginId: any;
  userName: any;
  dataLoad = false;
  accessControlData: any;
  accessControlDataFilter: any = '';
  public searchTerm = null;
  reverse: boolean = true;
  public order: any;
  public ascending = false;
  isChecked: any;
  isCheckedRow: any;
  count = 0;
  submitArr: any = [];
  public val: string = 'asc';

  constructor(private modalController: ModalController,public serviceFile: LoginService, public toast: ToasterService, private storage: StorageServiceAAA) { }
  
  ngOnInit() {
    this.loginId = localStorage.getItem('userId1');
    this.userName = localStorage.getItem('userName');
    this.getAccessData();
  }

  dismiss(){
		this.modalController.dismiss();
	}

  checkValue(event: any){
    this.count = 0;
    if(event){
      for(let i=0 ; i<this.accessControlDataFilter.length ; i++){
          this.accessControlDataFilter[i].isCheckedKey = true;
      };
    }
    else{
      for(let i=0 ; i<this.accessControlDataFilter.length ; i++){
        this.accessControlDataFilter[i].isCheckedKey = false;
      };
    }
    for(let i=0 ; i< this.accessControlDataFilter.length ; i++){
      if(this.accessControlDataFilter[i] && this.accessControlDataFilter[i].isCheckedKey && this.accessControlDataFilter[i].isCheckedKey == true){
          this.count += 1;
      }
    }
 } 

 checkValueRow(event: any,obj: any,i: any){
    this.count = 0;
    this.accessControlDataFilter[i].isCheckedKey = event;
    for(let i=0 ; i<this.accessControlDataFilter.length ; i++){
      if(this.accessControlDataFilter[i] && this.accessControlDataFilter[i].isCheckedKey && this.accessControlDataFilter[i].isCheckedKey == true){
              this.count += 1;
      }
    };
 }

  getAccessData(){
    this.dataLoad = true;
    this.serviceFile.getAccessControlData().subscribe((res: any) => {
      this.dataLoad = false;
        if (res['body']['Head']['ErrorCode'] === 0) {
          this.accessControlData = res['body']['Body'];
          this.accessControlDataFilter = this.accessControlData;
          for(let i=0 ; i<this.accessControlDataFilter.length ; i++){
            this.accessControlDataFilter[i].isCheckedKey = this.accessControlDataFilter[i].DashboardBrkgRights == '' || this.accessControlDataFilter[i].DashboardBrkgRights == 'N' ? false : true;
          };
        }
		})
  }

  changeSearchText(event: any){
    this.accessControlDataFilter = '';
    if(event == null || event == ''){
      this.accessControlDataFilter = this.accessControlData;
    }
    else{
      this.accessControlDataFilter = this.accessControlData.filter((obj: any) => {
        return obj.PartnerCode.toLowerCase().includes(event.toLowerCase()) || obj.PartnerName.toLowerCase().includes(event.toLowerCase());
      })
    }
  }

  setOrder(value: string) {
		this.reverse = !this.reverse;
		this.order = value;
    this.ascending = true;
    this.val = 'asc';
        if (this.reverse) {
            this.ascending = false;
            this.val = 'desc';
        }
	}

  onSubmit(){
    this.submitArr = [];
    for(let i=0 ; i<this.accessControlDataFilter.length ; i++){
        let obj: any = {};
        obj['loginid'] = this.accessControlDataFilter[i].Loginid;
        obj['PartnerCode'] = this.accessControlDataFilter[i].PartnerCode;
        obj['PartnerName'] = this.accessControlDataFilter[i].PartnerName;
        obj['DashboardBkrgView'] = this.accessControlDataFilter && this.accessControlDataFilter[i] && this.accessControlDataFilter[i].isCheckedKey && this.accessControlDataFilter[i].isCheckedKey == true ? 'Y' : 'N';
        this.submitArr.push(obj);
    };

    this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.updateMenuRights(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.updateMenuRights(token)
				})
			}
		})
  }

  private updateMenuRights = (token: any) => {
    this.serviceFile.updateMenuRights(this.submitArr, token).subscribe((res: any) => {
      if (res['body']['Head']['ErrorCode'] === 0) {
        this.toast.showToaster(res['body']['Body']['Msg']);
      }
    })
  }
}
