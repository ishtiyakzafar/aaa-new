import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FundTransferService } from '../../pages/fund-transfer/fund-transfer.service';
import { Subscription, from, interval } from 'rxjs';
// import { NewLoginService } from '../../pages/new-login/new-login.service';
import { Platform } from '@ionic/angular';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';


@Component({
  selector: 'app-fund-transfer',
  providers: [FundTransferService],
  templateUrl: './fund-transfer.page.html',
  styleUrls: ['./fund-transfer.page.scss'],
})
export class FundTransferPage{
  fundTabValue = 'bank'
  public buttonData: any[] = [
		// { name: 'Move Funds', value: 'fund'},
		{ name: 'Send to Bank', value: 'bank'}
  ]

  equityPayoutAmount:any;
  mfPayoutAmount:any;
  equityPayoutSendToBank:any;

  dataLoad:boolean = true;
  displayChild: boolean = true;
  apiCounter: number = 2;

  private subscription = new Subscription();
	@Input() passClientCode: any;
	@Output() addParentOverlay = new EventEmitter<boolean>();
  @Input() isDesktop: any;
  
  constructor(private router: Router, private fundTransferSer: FundTransferService, private storage: StorageServiceAAA, private platform: Platform,
    public toast: ToasterService) { }

  ngOnInit() {

    if(this.platform.is("desktop") || this.isDesktop){

      if(this.passClientCode == null){
        this.displayChild = false;
      }
    }
  }

  ngOnChanges(): void {

    if(this.platform.is("desktop") || this.isDesktop){
      this.dataLoad = false;
      this.addParentOverlay.emit(true);

      if(this.passClientCode){

        this.InitPayoutAmount();
        this.availableInnerTransfer();
        this.displayChild = true;
      } else {
        
        this.dataLoad = true;
        this.addParentOverlay.emit(false);
      }
    }
  }
  
  InitPayoutAmount(){

    this.fundTransferSer.getTotalFund(this.passClientCode).subscribe((res: any) => {
      // this.dataLoad = true;
      if(res['body']['Status'] == 0 && res['head']['status'] == 0){
        this.equityPayoutAmount = res['body']['EquityPayoutAmount']
        this.mfPayoutAmount = res['body']['MFPayoutAmount']
      } else {
        this.toast.displayToast(res['body']['Message']);
        this.equityPayoutAmount = "NA";
        this.mfPayoutAmount = "NA";
      }
      this.removeLoader();
    })
  
  }

  availableInnerTransfer(){

    this.fundTransferSer.getAmountForInterTransfer(this.passClientCode).subscribe((res: any) => {

      if(res['body']['Status'] == 0 && res['head']['status'] == 0){

        this.equityPayoutSendToBank = res['body']['EquityAmount']
      } else {
        this.toast.displayToast(res['body']['Message']);
        this.equityPayoutSendToBank = "NA";
      }
      this.removeLoader();
       
    })
  }

  segmentChange(event: any){

  }

  goBack(){

    window.history.back();
  }

  // public generateToken(profileDetails) {
	// 	const params = {
  //     JwtAAAToken: profileDetails['JwtToken'],
  //     userIdValue: profileDetails['UserId']
	// 	}
	// 	this.subscription = new Subscription();
	// 	// this.storage.get('bToken').then(token => {
	// 	this.subscription.add(
	// 		this.serviceFile
	// 			.getToken(params, profileDetails)
	// 			.subscribe((response) => {
	// 				console.log(response);
	// 				if (+response['body']['status'] === 0 && +response['head']['status'] === 0) {
	// 					this.storage.set('JwtToken', response['body']['formAuthToken']);
	// 				} else {
	// 					this.toast.displayToast(response['head']['ErrorDescription']);
	// 				}
	// 			})
	// 	)
	// }


  goToPayoutHistory(){

    this.router.navigate(['/payout-history']);
  }

  clientCodeFromChild(clientCode: string){

    if(clientCode){

      this.dataLoad = false;
      this.passClientCode = clientCode;
      this.InitPayoutAmount();
      this.availableInnerTransfer();
    } else {

      this.passClientCode = "";
      this.equityPayoutAmount = "";
      this.mfPayoutAmount = "";
      this.equityPayoutSendToBank = "";
    }
    
  }

  removeLoader = () => {

    this.apiCounter--;
    if(this.apiCounter === 0){
        this.dataLoad = true;
        this.addParentOverlay.emit(false);
        this.apiCounter = 2;
    }
  }

  public overlayClicked(event: any) {
		event.preventDefault();
	}

  addOverlayFunction = (event: any) => {
    this.dataLoad = !event;
    this.addParentOverlay.emit(event);
  }
}
