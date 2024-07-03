import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { Platform, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
	selector: 'app-brokerage-requests-status',
	providers: [WireRequestService],
	templateUrl: './brokerage-requests-status.component.html',
	styleUrls: ['./brokerage-requests-status.component.scss'],
})
export class BrokerageRequestsStatusComponent implements OnInit, OnChanges {
    @Input() brokerageReqObj: any;
    dataLoad:boolean = false
    public requestData: any[] = [
        {
            serialNum: '543212', clientCode:'VINRM02', requestStatus: 'Pending with IRA', requestDetails: [
                {
                    CashIntraday: 30000000, CashDelivery: 10000000, Cash1Day1st: 10000000, Cash1Day2nd: 0.1000, FAQ1Day1st: 0.0100,
                    FAO1Day2nd: 0.1000, CashDel1st: 0.1000, CashDelMPS: 0.0200, FAO1DayMPS:0.0200, Cash1DayMPS:0.0200
                }
            ]
        },
        {
            serialNum: '543213', clientCode:'VINRM02', requestStatus: 'Approved by Back Office', requestDetails: [
                {
                    CashIntraday: 30000000, CashDelivery: 10000000, Cash1Day1st: 10000000, Cash1Day2nd: 0.1000, FAQ1Day1st: 0.0100,
                    FAO1Day2nd: 0.1000, CashDel1st: 0.1000, CashDelMPS: 0.0200, FAO1DayMPS:0.0200, Cash1DayMPS:0.0200
                }
            ]
        },
        {
            serialNum: '543214', clientCode:'VINRM02', requestStatus: 'Rejected by IRA', requestDetails: [
                {
                    CashIntraday: 30000000, CashDelivery: 10000000, Cash1Day1st: 10000000, Cash1Day2nd: 0.1000, FAQ1Day1st: 0.0100,
                    FAO1Day2nd: 0.1000, CashDel1st: 0.1000, CashDelMPS: 0.0200, FAO1DayMPS:0.0200, Cash1DayMPS:0.0200
                }
            ]
        },

        {
            serialNum: '543215', clientCode:'VINRM02', requestStatus: 'Pending with Back Office', requestDetails: [
                {
                    CashIntraday: 30000000, CashDelivery: 10000000, Cash1Day1st: 10000000, Cash1Day2nd: 0.1000, FAQ1Day1st: 0.0100,
                    FAO1Day2nd: 0.1000, CashDel1st: 0.1000, CashDelMPS: 0.0200, FAO1DayMPS:0.0200, Cash1DayMPS:0.0200
                }
            ]
        },
        {
            serialNum: '543216', clientCode:'VINRM02', requestStatus: 'Approved By IRA', requestDetails: [
                {
                    CashIntraday: 30000000, CashDelivery: 10000000, Cash1Day1st: 10000000, Cash1Day2nd: 0.1000, FAQ1Day1st: 0.0100,
                    FAO1Day2nd: 0.1000, CashDel1st: 0.1000, CashDelMPS: 0.0200, FAO1DayMPS:0.0200, Cash1DayMPS:0.0200
                }
            ]
        },
        {
            serialNum: '543217', clientCode:'VINRM02', requestStatus: 'Rejected By Back Office', requestDetails: [
                {
                    CashIntraday: 30000000, CashDelivery: 10000000, Cash1Day1st: 10000000, Cash1Day2nd: 0.1000, FAQ1Day1st: 0.0100,
                    FAO1Day2nd: 0.1000, CashDel1st: 0.1000, CashDelMPS: 0.0200, FAO1DayMPS:0.0200, Cash1DayMPS:0.0200
                }
            ]
        },
    ]
    public clientDetails: any[] = [
        {}, {}, {}, {}, {}
    ]
    checkBrokerageApproval!:string;
    brokerageAllow:boolean = false;
    displayAppRejBtn:boolean = false;
    raiseRequestBtn:boolean = false;
    brokergeReqList!:any[];
    searchCode:any;
	constructor(private wireReqService: WireRequestService, private storage: StorageServiceAAA, private commonService: CommonService, private platform: Platform, private router: Router, public toast: ToasterService) { }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
            this.brokerageReqObj = this.commonService.getData() ? this.commonService.getData() : this.brokerageReqObj;
            this.brokerageAllow = false;
            if (this.brokerageReqObj) {
                this.InitBrokergeRequest()
            }
        }
    }

	ngOnInit() {
        this.commonService.setClevertapEvent('Brokerage_Requests');
        this.commonService.analyticEvent('Brokerage_Requests', 'Wire Request');
        this. brokerageReqObj = this.commonService.getData() ? this.commonService.getData() : this.brokerageReqObj;
        if (this.platform.is('mobile') && !(this.brokerageReqObj && this.brokerageReqObj.isDesktopCall)) {
            if (this.brokerageReqObj) {
                this.InitBrokergeRequest();
            }

        }
    }

    // coming soon popup when click donwload option
    comingOption(event: any) {
        this.commonService.comingSoon(event, 'Coming Soon', 'coming')
    }
    
    InitBrokergeRequest(){
        this.dataLoad = false;
        this.displayAppRejBtn = false;
        this.raiseRequestBtn = false;
        this.brokergeReqList = [];
        this.storage.get('userID').then((userID) => {
        this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.brokerageApprovaData(token, userID)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.brokerageApprovaData(token, userID)
				})
			}
        })
     }) 


  
    }

	goBack() {
        window.history.back()
    }

    goToCreateRequest(){
        //this.router.navigate(['/wire-requests/', "brokerage-request"]);
        if (!this.platform.is('mobile')) {
			this.router.navigate(['/wire-requests','brokerage-request']);
		}
		else{
			this.router.navigate(['brok-insert-mobile']);
		}
    }

    dropClick(id: any, arr: any) {
        arr.forEach((element: any, ind: any) => {
          if (id !== element.Srno) {
            element['isVisible'] = false;
          } else {
            element['isVisible'] = element['isVisible'] ? false : true;
          }
        });
      }

	brokerageApprovaData(token: any, userID: any) {
        this.storage.get('setAccessChecker').then((accessChecker) => {
            if(accessChecker.includes("BrokerageException")){
                this.displayAppRejBtn = true,
                this.raiseRequestBtn = true
            }
        })
        this.brokerageRequestList(token, this.brokerageReqObj, userID)
        // this.wireReqService.getBrokerageApproval(token, userID).subscribe((res) => {
		// 	if(res['Head']['ErrorCode'] == 0){
        //         console.log(this.brokerageReqObj);
		// 		this.checkBrokerageApproval = res['Body']['BrokerageApproval'];
		// 		if(this.checkBrokerageApproval == 'Y' || this.checkBrokerageApproval == 'N'){
        //             this.brokerageRequestList(token, this.brokerageReqObj, userID)
        //         }
        //         else{
        //             this.brokerageAllow = true
        //         }
        //     }
        //     else{
        //         this.brokerageAllow = true
        //         setTimeout(() => {
        //             this.dataLoad = true; 
        //      }, 400); 
        //     }
		// 	console.log(res);
		// })
	}

	brokerageRequestList(token: any, reqObj: any, userID: any){
		this.wireReqService.getBrokerageRequest(token,reqObj, userID).subscribe((res: any) => {
            this.brokergeReqList = [];
            if(res['Head']['ErrorCode'] == 0){
                res['Body']['objBrokerageRequestStatusResBody'].forEach((element: any) => {
                    this.brokergeReqList.push({
                        Srno: element.Srno,
                        ClientCode: element.ClientCode,
                        CashIntradayFirstSidePerc: element.CashIntradayFirstSidePerc,
                        CashIntradaySecondSidePerc: element.CashIntradaySecondSidePerc,
                        CashIntradayMinimumPerShare: element.CashIntradayMinimumPerShare,
                        CashDeliveryFirstSidePerc: element.CashDeliveryFirstSidePerc,
                        CashDeliveryMinimumPerShare: element.CashDeliveryMinimumPerShare,
                        CashT2TFirstSidePerc:element.CashT2TFirstSidePerc,
                        CashT2TMinimumPerShare: element.CashT2TMinimumPerShare,
                        FuturesIntradayFirstSidePerc: element.FuturesIntradayFirstSidePerc,
                        FuturesIntradaySecondSidePerc: element.FuturesIntradaySecondSidePerc,
                        FuturesIntradayMinimumPerShare: element.FuturesIntradayMinimumPerShare,
                        FuturesDeliveryFirstSidePerc: element.FuturesDeliveryFirstSidePerc,
                        FuturesDeliveryMinimumPerShare: element.FuturesDeliveryMinimumPerShare,
                        OptionsPerLot: element.OptionsPerLot,
                        OptionsIndexPerc: element.OptionsIndexPerc,
                        NoBrokerageForSecondSide: element.NoBrokerageForSecondSide,
                        Remark: element.Remark,
                        MkrID: element.MkrID,
                        Mkrdt: element.Mkrdt,
                        AppID: element.AppID,
                        Appdt: element.Appdt,
                        RemarkRej: element.RemarkRej == "" ? '-': element.RemarkRej,
                        Status:element.Status.trim(),
                    })
                });
               // this.brokergeReqList = res['Body']['objBrokerageRequestStatusResBody']
            }
            else{
                this.brokerageAllow = true
            }

            setTimeout(() => {
                this.dataLoad = true; 
         }, 400);
			
		})	
		
    }

    brokApprovalRejRequest(reqStatus: any, Obj: any){
        this.storage.get('userID').then((userID) => {
            this.storage.get('userType').then(type => {
                if (type === 'RM' || type === 'FAN') {
                    this.storage.get('bToken').then(token => {
                        this.brokerageApprovedRejBtn(token, userID,reqStatus,Obj)
                    })
                } else {
                    this.storage.get('subToken').then(token => {
                        this.brokerageApprovedRejBtn(token, userID, reqStatus,Obj)
                    })
                }
            })
         }) 
    }
    
    brokerageApprovedRejBtn(token: any, userId: any, reqRa: any, obj: any){
        this.wireReqService.getBrokApprovalRej(token,obj,reqRa,userId).subscribe((res) => {
            if(res['Head']['ErrorCode'] == 0 && res['Body']['Status'] == 0 ){
                this.InitBrokergeRequest()
                 this.toast.displayToast('Status has been updated successfully');
               
            }
            else{
                this.toast.displayToast(res['Head']['ErrorDescription']);
            }
        })   
  }
  raiseaRequest(){
    this.router.navigate(['/wire-requests/brokerage-request']);
  }
}
