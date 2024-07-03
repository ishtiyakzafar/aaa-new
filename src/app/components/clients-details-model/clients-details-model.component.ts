import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-clients-details-model',
  providers: [WireRequestService],
  templateUrl: './clients-details-model.component.html',
  styleUrls: ['./clients-details-model.component.scss'],
})
export class ClientsDetailsModelComponent implements OnInit {
  @Input() clientID: any;
  dataLoad:boolean = false;
  clientDetails:any;
  clientCode:any;
  clientName:any;
  clientEmail:any;
  clientMobile:any;
  clientAddress:any;
  clientPan:any;
  account:any;
  rmCode:any;
  rmName:any;
  rmEmail:any;
  rmMobile:any;
  activeSegment:any;
  DpDetils:any;
  bankDetail:any;
  BoDetils:any;
  currentBrokeragePlan?:string;
  clientStatus?:string;
  settlementFrequency?:string;
  runningACAuth?:string;
  POA?:string;
  freeze?: string;
  dormant?: string;
  jointHolders: any = [];
  authValue: any;
 
  constructor(private modalController: ModalController, private storage: StorageServiceAAA, private wireReqService: WireRequestService, public toast: ToasterService) { }

  ngOnInit() {
    this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.clientProfileDetails(token)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.clientProfileDetails(token)
				})
			}

		})
  }

  clientProfileDetails(token: any){
    var obj =  {"UserCode": this.clientID,"UserType": "4"}
    this.wireReqService.getProfileDetails(token, obj).subscribe((res: any) => {
      
      setTimeout(() => {
        this.dataLoad = true; 
     }, 500);
     if(res['Head']['ErrorCode'] == 0){
      this.clientDetails = res['Body'];
      this.authValue = res && res['Body'] && res['Body']['AuthorizedPerson'] && res['Body']['AuthorizedPerson'][0] ? res['Body']['AuthorizedPerson'][0] : [];
      this.clientCode = this.clientDetails['ClientCode'];
      this.clientName = this.clientDetails['ClientName'];
      this.clientEmail = this.clientDetails['ClientEmail'];
      this.clientMobile = ( this.clientDetails['ClientMobileNoAlternate'] != (undefined || "") && 
          this.clientDetails['ClientMobileNoAlternate'].toString().length >= 5 ) ? 
              `${this.clientDetails['ClientMobileNo']} / ${this.clientDetails['ClientMobileNoAlternate']}`:
              this.clientDetails['ClientMobileNo'];
     this.clientAddress = this.clientDetails['ClientAddress'];
     this.clientPan = this.clientDetails['ClientPanno'];
     this.account  = this.clientDetails['AccountNo'];
     this.rmCode = this.clientDetails['RMCode'];
     this.rmName = this.clientDetails['RMName'];
     this.rmEmail = this.clientDetails['RMEmail'];
     this.rmMobile = this.clientDetails['RMMobileNo'];
     this.activeSegment = this.clientDetails['ActiveSegments'];
     this.currentBrokeragePlan=this.clientDetails['ProductName'];
     this.freeze = this.clientDetails['FreezeYN'];
     this.dormant = this.clientDetails['IsDormant'];

     let array = [];
       for (let item of this.clientDetails['JointHolder']) {
         array.push({
           jointHolderName: item.JointHolder1Name,
           jointHolderPan: item.JointHolder1Pan,
         });
         array.push({
           jointHolderName: item.JointHolder2Name,
           jointHolderPan: item.JointHolder2Pan,
         });
         array.push({
           jointHolderName: item.JointHolder3Name,
           jointHolderPan: item.JointHolder3Pan,
         });
       }
     
       this.jointHolders = array.filter((item) => item.jointHolderName && item.jointHolderPan);
       const getSuffix = (ind: any) => {
         if (ind === 2) {
           return 'Second Holder';
         } else if (ind === 3) {
           return 'Third Holder';
         } else if (ind === 4) {
           return 'Fourth Holder';
         } else if (ind === 5) {
           return 'Fifth Holder';
         } else if (ind === 6) {
           return 'Sixth Holder';
         } else if (ind === 7) {
           return 'Seventh Holder';
         } else if (ind === 8) {
           return 'Eighth Holder';
         } else if (ind === 9) {
           return 'Ninth Holder';
         } else if (ind === 10) {
           return 'Tenth Holder';
         } else if (ind === 11) {
           return 'Eleventh Holder';
         } else if (ind === 12) {
           return 'Twelfth Holder';
         } else if (ind === 13) {
           return 'Thirteenth Holder';
         } else if (ind === 14) {
           return 'Fourteenth Holder';
         } else if (ind === 15) {
           return 'Fifteenth Holder';
         }else{
          return;
         }
       };
       
       this.jointHolders = this.jointHolders.map((item:any, index:any) => ({ ...item, title: getSuffix(index + 2) }));
     
     if(this.currentBrokeragePlan==""){
       this.currentBrokeragePlan="-";
     }
    //  this.clientStatus="Active";
    //  if(this.clientDetails['DP']['Status']=="I"){
    //    this.clientStatus="Inactive";
    //  }
     
     
     switch (this.clientDetails['SettlementFrequency']){
        case("Q"):
        this.settlementFrequency="Quarterly";
        break;
        case("M"):
        this.settlementFrequency="Monthly";
        break;
        case("Y"):
        this.settlementFrequency="Yearly";
        break;
        default:
          this.settlementFrequency="-";
        break;
     }
     this.runningACAuth=this.clientDetails['RunningACAuthorization'];
     this.POA=this.clientDetails['POA'];
     if(this.POA=="Y"){
       this.POA="YES"
     }
     else if(this.POA=="N"){
       this.POA="NO"
     }

    this.DpDetils = this.clientDetails['DP'].map(function(elem: any){

      return {
        DPID : elem.DPID,
        Status: `${elem.Status ? `${(elem.Status.toUpperCase() === "A" ? "Active" : "Inactive")}` : ""}`,
        Default: `${elem.Default ? `${(elem.Default.toUpperCase() === "Y" ? "Y" : "N")}` : ""}`
      }
    });
    let sts = this.DpDetils.map((value: any) => value.Status);
    this.clientStatus = sts.toString();
    this.BoDetils = this.clientDetails['DP'].map(function(elem: any){
      return `${elem.BOID}`;
    });
    this.bankDetail = this.clientDetails['Bank'];
 
   }
        else{
          this.toast.displayToast(res['Body']['ErrorDescription']);
        }
    }) 
  }


  dismiss() {
		this.modalController.dismiss();
  }
  
  spacepipe(data: any){
    return data.split('|').join(' | ')
  }

}
