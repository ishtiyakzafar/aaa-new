import { Component, Input,  OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-client-profile-capture-modal',
  providers: [WireRequestService],
  templateUrl: './client-profile-capture-modal.component.html',
  styleUrls: ['./client-profile-capture-modal.component.scss'],
})
export class ClientProfileCaptureModalComponent implements OnInit {
  @Input() clientID: any;
  @Input() clientName: any;
  clientCap: any;
  clientCode:any;
  clientBday:any;
  clientOnboarddingDate:any;
  clientSegment:any;
  clientProdPref:any;
  clientRiskProfile:any;
  LastFundTransDate:any;
  LastLoginDate:any;
  LastTradeDate:any;
  dataLoad:boolean = false;
  constructor(private modalController: ModalController,private wireReqService: WireRequestService,private storage: StorageServiceAAA) { }
  ngOnInit() {
    
  
    //console.log('hit');
    this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
       
				this.storage.get('bToken').then(token => {
					this.clientProfileCap(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.clientProfileCap(token)
				})
			}
		})
    // this.storage.get('bToken').then(token => {
    //   this.clientProfileCap(token)
    // })
  }
  clientProfileCap(token: any){
    //this.dataLoad = false;
    let clientName = this.clientName;
    //console.log('clientId', clientName);
    let clientId = this.clientID;
    //console.log('clientId dd', clientId);
    this.storage.get('userID').then((userID) => {
      //console.log('clientProfileCap', token);
      this.wireReqService.getProfileCap(token,userID,clientId).subscribe((res: any) => {
       setTimeout(() => {
        this.dataLoad = true; 
        }, 500);
        if(res['Head']['ErrorCode'] == 0){
          this.clientCap = res['Body'][0];
          this.clientCode = this.clientCap['ClientID'];
          this.clientBday = this.clientCap['ClientBday'];
          this.clientProdPref = this.clientCap['ProdPref'];
          this.clientOnboarddingDate = this.clientCap['OnboarddingDate'];
          this.clientRiskProfile = this.clientCap['RiskProfile'];
          this.clientSegment = this.clientCap['ClientSegment'];
          this.LastFundTransDate = this.clientCap['LastFundTransDate'];
          this.LastLoginDate = this.clientCap['LastLoginDate'];
          this.LastTradeDate = this.clientCap['LastTradeDate']
          //console.log('ProfileData', this.clientCap);
        }
        else{this.dataLoad = false} 
      });
    })
   
  }
  dismiss(){
		this.modalController.dismiss();
	}
}