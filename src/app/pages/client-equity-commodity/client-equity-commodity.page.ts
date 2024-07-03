import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientTradesService } from '../recently-viewed-client-list/client-trades.service';
import {forkJoin} from 'rxjs';
import { CommonService } from '../../helpers/common.service';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { URLS } from '../../../config/api.config';


@Component({
  selector: 'app-client-equity-commodity',
  providers: [ClientTradesService, CustomEncryption],
  templateUrl: './client-equity-commodity.page.html',
  styleUrls: ['./client-equity-commodity.page.scss'],
})
export class ClientEquityCommodityPage implements OnInit {
  public holdingsBlockTabValue: any = 'holdings';
  public isResponseReady: boolean = false;
  urlParameter:any;
  passClientID:any;
  tradeBookDetails:any[] = [];
  marginTabDetails:any[] = [];
  LedgerTabDetails:any[] = [];
  clientHoldingDetails:any = [];
  orderBookDetails:any = [];
  netPositionDetails:any[] = [];
  consHoldingPlData:any[] = [];
  public dataLoad: boolean = false;
  public changeRefresh = '1'
  tokenValue:any;

  public isRMFAN = false;

  constructor(private router: Router, private route: ActivatedRoute,private storage: StorageServiceAAA, private clientService: ClientTradesService, private commonservice: CommonService, private cipherText: CustomEncryption) { }

  ngOnInit() {
    this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
        this.isRMFAN = true;
				this.storage.get('sToken').then(token => {
					this.tokenValue = token;
					
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					// console.log(this.tokenValue);
				})
			}
		})

    this.urlParameter = this.route.params.subscribe(params => {
      this.passClientID = params['id'];
      // console.log(this.passClientID);
    });

    setTimeout(() => {
      this.storage.get('JwtToken').then(token => {
        this.OrderBookNow(token,this.passClientID);
        this.marginV2(token, this.passClientID);
        this.tradeBook(token, this.passClientID);
        this.clientHolding(token, this.passClientID);
        this.clientNetPosition(token, this.passClientID);
      })
      this.clientLedger(this.tokenValue, this.passClientID);
    },400)
   
   // this.clientHoldingPL(this.passClientID)
  }

  goToAddScript(){
    //this.router.navigate(['/add-script'])
    this.router.navigate(['/dashboard-clients']);
  }

  // Client Holding Tab Data in client
  clientHolding(token: any,clientID: any){
      this.clientService.getclientHolding(token,clientID).subscribe((res: any) => {
        // console.log(res);
        if(res['head']['status'] == 0){
          this.clientHoldingDetails = res['body']['Data'];
          setTimeout(() => {
            this.dataLoad = true;
        }, 500);
          // console.log(this.clientHoldingDetails);
        }
      })
  }
  // Order Book Tab Data in client
  OrderBookNow(token: any,clientID: any){
      this.clientService.getOrderBookNow(token,clientID).subscribe((res: any) => {
        if(res['head']['status'] == 0){
          this.orderBookDetails = res['body']['OrderBookDetail'];
        }
      })
  }
  // TradeBook Tab Data in client
  tradeBook(token: any,clientID: any){
      this.clientService.getTradeBook(token,clientID).subscribe((res: any) => {
        // console.log(res);
        if(res['head']['status'] == 0){
          this.tradeBookDetails = res['body']['tradelist'];
          // console.log(this.tradeBookDetails);
        }
    })
  }

    //Function for Conslidate Holding Tab in Mobile
    clientHoldingPL(token: any,clientID: any) {
      this.dataLoad = false;
        this.clientService.getHoldingPl(token, clientID).subscribe((res: any) => {
          // console.log(res);
          if (res['head']['status'] == 0) {
            this.consHoldingPlData = res['body']['Lst_HoldingPL'];
            setTimeout(() => {
              this.dataLoad = true;
          }, 500);
          }
        })
    }

     // function for net position in equity and commodity
  clientNetPosition(token: any,clientID: any) {
    this.dataLoad = false;
     let eqNetPosition = this.clientService.getNetPositioneq(token, clientID);
     let CommNetPosition = this.clientService.getNetPositioncomm(token, clientID);
      forkJoin([eqNetPosition, CommNetPosition]).subscribe((response: any) => {
          this.netPositionDetails = response[0]['body']['TradeData'].concat(response[1]['body']['TradeData']);
          setTimeout(() => {
            this.dataLoad = true;
        }, 500);
        })
  }

  //Function for Margin V2 Tab in Mobile
  marginV2(token: any,clientID: any){
      this.clientService.getMarginV2(token,clientID).subscribe((res: any) => {
        // console.log(res);
        if(res['head']['status'] == 0){
            this.marginTabDetails = res['body'];
            setTimeout(() => {
              this.dataLoad = true;
          }, 500);
            // console.log(this.marginTabDetails);
        }
      })
  }

//Function for Margin V2 Tab in Mobile
  clientLedger(token: any,clientID: any){
      this.clientService.getclientLedger1(token,clientID, this.DateDisplay('previous'),this.DateDisplay('current') )
      .subscribe((res: any) => {
        // console.log(res);
        if(res['head']['status'] == 0){
          this.LedgerTabDetails = res['body'];
          // console.log(this.LedgerTabDetails);
          this.isResponseReady = true;
        }
      })
  }

 
  //Function for last Month Dates in Mobile
	// last one month dates
	DateDisplay(monthValue: any) {
		var d = new Date();
		if (monthValue == "previous") {
			d.setDate(d.getDate() - 30);
			return this.commonservice.formatDate(d)
		}
		else if(monthValue == "current"){
			d.setDate(d.getDate() );
			return this.commonservice.formatDate(d)
		}
    return;
  }

  doRefresh(){
    this.changeRefresh = '2'

    setTimeout(() => {
      this.changeRefresh = '1'
    }, 500);

  }
  
  goBack() {
    window.history.back();
  }

  pledge() {
		this.commonservice.setClevertapEvent('Pledge_Securities');
    this.commonservice.analyticEvent('Pledge_Securities', 'Client & Trades');
		this.storage.get('userID').then(ID => {
			const cnt = this.cipherText.aesEncrypt(ID);
			//const app = 2;
      const app = 3;
			const clientCode = this.cipherText.aesEncrypt(this.passClientID);
			const dealerID = this.cipherText.aesEncrypt(ID);
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === "FAN") {
					this.storage.get('sToken').then(token => {
						const url = URLS['pledgeSecurity']['url'] + '?cnt=' + cnt + '&app=' + app + '&clientCode=' + clientCode + '&dealerid=' + dealerID + '&authToken=' + token;
						window.open(url, '_blank');
					})
				} else if (type === 'SUB BROKER') {
					this.storage.get('subToken').then(token => {
						const url = URLS['pledgeSecurity']['url'] + '?cnt=' + cnt + '&app=' + app + '&clientCode=' + clientCode + '&dealerid=' + dealerID + '&authToken=' + token;
						window.open(url, '_blank');
					})
				}
			})
		})
	}

}
