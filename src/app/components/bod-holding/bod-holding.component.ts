import { Component, ElementRef, OnInit, ViewChild, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import moment from 'moment';
import { ClientsDetailsModelComponent } from '../clients-details-model/clients-details-model.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ClientProfileCaptureModalComponent } from '../client-profile-capture-modal/client-profile-capture-modal.component';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import { environment } from '../../../environments/environment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';

@Component({
    selector: 'app-bod-holding',
    providers: [WireRequestService, ShareReportService],
    templateUrl: './bod-holding.component.html',
    styleUrls: ['./bod-holding.component.scss'],
})
export class BodHoldingComponent implements OnInit, OnChanges {
    @ViewChild('detail') detail!: ElementRef;
    @Input() passClientIdValue: any;
    @Input() wireCode: any;
    equityBlockTabValue: any = 'equity';
    reverse: boolean = false;
	ascending: boolean = true;
    // public ascending: boolean;
    dataLoad!:boolean;
    public moment: any = moment;
    public isShow = false;
    public onShow = false;
    public isDiv = false;
	public isProd = environment['production'];
    public order: string = 'ScripName';
    equityBlockButton: any = [
        { Name: 'Equity', Value: 'equity', active: 1 },
        { Name: 'F&O', Value: 'fo', active: 0 },
        { Name: 'SLBM', Value: 'slbm', active: 0 },
        { Name: 'Collateral', Value: 'col', active: 0 }
    ];
    public detailHeight!: number;
    public isOnlyRM: any = localStorage.getItem('userType');
    public val: string = 'asc';
   
    bodHoldingEqList:any[] = [];
    nfoPositionList:any[] = [];
    slbmHoldingList:any[] = [];
    bodHoldingList:any = [];
    tokenValue:any;
    userIdValue:any;
    headerDetailsData: any;
    displayAdditionalHeaders : boolean =  false;
    isClientMapped: boolean = false;
    
    constructor(private router: Router,private modalController: ModalController,private storage: StorageServiceAAA,public toast: ToasterService, private wireReqService: WireRequestService, private commonService: CommonService, private shareReportSer:ShareReportService) { }
    ngOnChanges(changes: SimpleChanges): void {
        this.bodHoldingEqList = [];
        this.nfoPositionList = [];
        this.slbmHoldingList = [];
        this.bodHoldingList = [];
        this.equityBlockTabValue = 'equity';
        this.order = 'ScripName';
        this.initBodHolding();
    }

    ngOnInit() {
        this.commonService.setClevertapEvent('BODHolding_Equity');
        this.commonService.setClevertapEvent('BOD_Holdings');
        this.commonService.analyticEvent('BOD_Holdings', 'Wire Reports');
    }

    // coming soon popup when click donwload option
    comingOption(event: any) {
        this.commonService.comingSoon(event, 'Coming Soon', 'coming')
    }
    close(){
        this.onShow = false;
        this.isShow = false;
        this.isDiv = false;
        if(this.bodHoldingList && this.bodHoldingList['BODHolding']){
        for(let i=0;i<this.bodHoldingList['BODHolding'].length;i++){
            this.bodHoldingList['BODHolding'][i].onShow = false;
        }
      }
    }
    
    // call Init Bod Holding Function
    initBodHolding(){
        //this.dataLoad = false;
            
        this.storage.get('userID').then((userID) => {
            this.storage.get('userType').then(type => {
                if (type === 'RM' || type === 'FAN') {
                    this.storage.get('bToken').then(token => {
                        this.tokenValue = token;
                        this.userIdValue = userID;
                        this.bodEqHoling(token, userID)
                       
                    })
                } else {
                    this.storage.get('subToken').then(token => {
                        this.tokenValue = token;
                        this.userIdValue = userID;
                        this.bodEqHoling(token,userID)
                        // this.nfoPositionData(token, userID)
                        // this.slbmHoldingData(token, userID)
                    })
                }
    
            })
         })    
       
    }
    toggleFlag(){
        this.isShow = true;
        this.isDiv = true;
    }
    tableToggle(dataObj: any,arr: any,id: any){
        // dataObj.onShow = true;
        // this.onShow = true;
        this.isDiv = true;
        for(let i=0;i<arr.length;i++){
            arr[i].onShow = false;
            this.isDiv = true;
        }
        arr[id].onShow = true;
    }
    // for Equity Tab in Holding
    bodEqHoling(token: any, userID: any){
        //userID = this.wireCode;
        if(this.passClientIdValue == ''){
            this.toast.displayToast('Kindly select Client Id');
            return;
        }
        this.wireReqService.getHeaderDetails(token, this.passClientIdValue).subscribe((res: any) => {
            if(res['Head']['ErrorCode'] == 0){
                this.headerDetailsData = res['Body'];
                this.isClientMapped = true;
            } else if(res['Head']['ErrorCode'] === 4) {
                this.headerDetailsData = null;
                this.isClientMapped = false;
            }
        });  
        // this.dataLoad = false;
        // this.wireReqService.getBodHoling(token, this.passClientIdValue, userID).subscribe((res) => {
          
        //     if(res['Head']['ErrorCode'] == 0){
        //         this.bodHoldingEqList = res['Body']['BODHolding'];
        //         this.bodHoldingEqList.forEach((element, index) => {
		// 			element.srNo = index;
        //         })
        //         // console.log(this.bodHoldingEqList);
        //         this.order = 'ScripName';
        //     }
        //     this.dataLoad = true;
            
        // })
        this.dataLoad = false;
        if(this.passClientIdValue == ''){
            this.toast.displayToast('Kindly select Client Id');
            return;
        }
        this.wireReqService.getHoldingDetails(token, this.passClientIdValue, userID, 'eq').subscribe((res: any) => {
            this.dataLoad = true;
            if(res['Head']['ErrorCode'] == 0){
                this.isClientMapped = true;
                this.bodHoldingList = res['Body'];
                if(res['Body'] && res['Body'].BODHolding.length > 0){
                    res['Body'].BODHolding.forEach((element: any, index: any) => {
					element.srNo = index;
                })
            }
            } else if(res['Head']['ErrorCode'] === 1){
                this.toast.displayToast(res['Head']['ErrorDescription']);
                this.isClientMapped = false;
            }
        })   
    }
    // for NFO Tab in Holding
    nfoPositionData(token: any, userID: any){
        this.dataLoad = false;
        userID = this.wireCode;
        if(this.passClientIdValue == ''){
            this.toast.displayToast('Kindly select Client Id');
            return;
        }
        this.wireReqService.getFnoPositions(token, this.passClientIdValue, userID).subscribe((res: any) => {
            this.dataLoad = true;
            if(res['Head']['ErrorCode'] == 0){
                this.nfoPositionList = res['Body']['FNOHolding'];
                this.nfoPositionList.forEach((element, index) => {
					element.srNo = index;
                })
            }
        })   
    }
    // for slmb Tab in Holding
    slbmHoldingData(token: any, userID: any){
        this.dataLoad = false;
        userID = this.wireCode;
        if(this.passClientIdValue == ''){
            this.toast.displayToast('Kindly select Client Id');
            return;
        }
        this.wireReqService.getSlbmHoldings(token, this.passClientIdValue, userID).subscribe((res: any) => {
            this.dataLoad = true;
            if(res['Head']['ErrorCode'] == 0){
                this.slbmHoldingList =  res['Body']['SLBMHolding'];
                this.slbmHoldingList.forEach((element, index) => {
					element.srNo = index;
				})
            }
        })   
    }

    dropClick(id: any, arr: any) {
        // event.preventDefault();
            arr.forEach((element: any, ind: any) => {
                if (id !== element.srNo) {
                    element['isVisible'] = false;
                } else {
                    element['isVisible'] = element['isVisible'] ? false : true;
                    if (element['isVisible']) {
                        setTimeout(() => {
                            this.detailHeight = this.detail.nativeElement.offsetHeight;
                        }, 100);
                    }
                }
            });
    
   
    }

    formatChange(date: any){
        return moment(date).format('DD/MM/YYYY');
    }

    // call the function after change the segment
    equityBlockSegmentChanged(event: any) {
        if(event == 'equity'){
            // this.bodEqHoling(this.tokenValue,this.userIdValue)
            this.commonService.setClevertapEvent('BODHolding_Equity');
            this.order = 'ScripName'; 
            this.tabChange('eq',this.tokenValue,this.userIdValue);
        }
        else if(event == 'fo'){
            // this.nfoPositionData(this.tokenValue, this.userIdValue)
            this.commonService.setClevertapEvent('BODHolding_FnO');
            this.order = 'Symbol';
            this.tabChange('fno',this.tokenValue,this.userIdValue);
        }
        else if(event == 'col'){
            // this.nfoPositionData(this.tokenValue, this.userIdValue)
            this.commonService.setClevertapEvent('BODHolding_Collateral');
            this.order = 'Symbol';
            this.tabChange('col',this.tokenValue,this.userIdValue);
        }
        else{
            this.order = 'Symbol';
            // this.slbmHoldingData(this.tokenValue, this.userIdValue)
            this.commonService.setClevertapEvent('BODHolding_Slbm');
            this.tabChange('slbm',this.tokenValue,this.userIdValue);
        }
    }

    tabChange(holdingType: any,token: any,userID: any){
        this.dataLoad = false;
        if(this.passClientIdValue == ''){
            this.toast.displayToast('Kindly select Client Id');
            return;
        }
        this.wireReqService.getHoldingDetails(token, this.passClientIdValue, userID, holdingType).subscribe((res: any) => {
            this.dataLoad = true;
            if(res['Head']['ErrorCode'] == 0){
                this.bodHoldingList = res['Body'];
                // if(this.bodHoldingList && this.bodHoldingList.length > 0){
                // this.bodHoldingList.forEach((element, index) => {
				// 	element.srNo = index;
                // });
                // }
                if(res['Body'] && res['Body'].BODHolding && res['Body'].BODHolding.length > 0){
                    res['Body'].BODHolding.forEach((element: any, index: any) => {
					element.srNo = index;
                })
            }
                if(res['Body'] && res['Body'].FNOHolding && res['Body'].FNOHolding.length > 0){
                    res['Body'].FNOHolding.forEach((element: any, index: any) => {
                    element.srNo = index;
                })
            }
                if(res['Body'] && res['Body'].SLBMHolding && res['Body'].SLBMHolding.length > 0){
                    res['Body'].SLBMHolding.forEach((element: any, index: any) => {
                    element.srNo = index;
                })
            }
                if(res['Body'] && res['Body'].CollateralPosition && res['Body'].CollateralPosition.length > 0){
                    res['Body'].CollateralPosition.forEach((element: any, index: any) => {
                    element.srNo = index;
                })
            }
            } 
        })   
    }

    convertFunc(val: any){
        if(val){
            let value = parseFloat(val);
            return parseFloat(value.toFixed(2));
        }
        return 0;   // added return statement
    }

    setOrder(value: string) {
		this.reverse = !this.reverse;
		this.order = value;
        if (this.reverse) {
            this.ascending = false;
            this.val = 'desc';
        } else {
            this.ascending = true;
            this.val = 'asc';
        }
	}

    /**
     * On click of pdf/excel icon
     */
    onPdfExcelDownload(type: any) {
        if (this.headerDetailsData) {
            this.dataLoad = false;
            let info = [];
            let head = [["Client Category", "Cash", "Wire Code", "Activation Date", "AHVCover", "ALB", "BMFDBNPLLedgerBalance", "BSEDerivativeExposure", "BSEDerivativeSpan","BMFD", "CommoditySpan","Dormant", "FDR", "FNO","Freeze", "AGHV Cover", "LedBalT2", "MCXCurrencyExposure", "MCXCurrencySpan", "MarginAHV", "MarginGHV", "MarginTHV", "MtoMDrCr", "NSECurrencyExposure", "NSECurrencySpan", "NSEDerivativeExposure", "NSEDerivativeSpan", "NetWorth", "POA","Product Plan", "SpanExposureMargin", "UnclCheque"]];
            info.push([this.headerDetailsData.ClientCategory, this.headerDetailsData.Cash, this.headerDetailsData.WireCode, this.formatChange(this.headerDetailsData.ActivationDate), this.headerDetailsData.AHVCover, this.convertFunc(this.headerDetailsData.ALB), this.convertFunc(this.headerDetailsData.BMFDBNPLLedgerBalance), this.convertFunc(this.headerDetailsData.BSEDerivativeExposure), this.convertFunc(this.headerDetailsData.BSEDerivativeSpan), this.headerDetailsData.BMFD, this.convertFunc(this.headerDetailsData.CommoditySpan),this.headerDetailsData.IsDormant, this.convertFunc(this.headerDetailsData.FDR), this.headerDetailsData.FNO, this.headerDetailsData.IsFreeze, this.headerDetailsData.GHVCover, this.convertFunc(this.headerDetailsData.LedBalT2), this.convertFunc(this.headerDetailsData.MCXCurrencyExposure), this.convertFunc(this.headerDetailsData.MCXCurrencySpan), this.convertFunc(this.headerDetailsData.MarginAHV), this.convertFunc(this.headerDetailsData.MarginGHV), this.convertFunc(this.headerDetailsData.MarginTHV), this.convertFunc(this.headerDetailsData.MtoMDrCr), this.convertFunc(this.headerDetailsData.NSECurrencyExposure), this.convertFunc(this.headerDetailsData.NSECurrencySpan), this.convertFunc(this.headerDetailsData.NSEDerivativeExposure), this.convertFunc(this.headerDetailsData.NSEDerivativeSpan), this.convertFunc(this.headerDetailsData.NetWorth), this.headerDetailsData.POA, this.headerDetailsData.ProductPlan, this.convertFunc(this.headerDetailsData.SpanExposureMargin), this.convertFunc(this.headerDetailsData.UnclCheque)]);
            if (type === 'pdf') {
                this.commonService.savePdfFile(head, info);
                this.dataLoad = true;
            } else {
                this.commonService.exportDataToExcel(head[0], info, 'BOD Holding');
                this.dataLoad = true;
            }
        } else {
            this.toast.displayToast('No Data Found');
        }
    }


    /**
     * On click of pdf/excel icon (for tab-view)
     */
    onDownloadReport(type: any) {
        let rptData;
        if (this.bodHoldingList) {
            this.dataLoad = false;
            let header: any = [];
            let info: any = []
            let extra;
            let topSectionHead = [];
            let topSectionRow = [];
            switch (this.equityBlockTabValue) {
                case 'equity':
                    this.commonService.setClevertapEvent('BODHolding_Equity', { 'PartnerCode': localStorage.getItem('userId1') });
                    rptData = this.bodHoldingList.BODHolding;
                    if (rptData && rptData.length > 0) {
                        topSectionHead = [["Total", "ZHV", "AGHV"]];
                        topSectionRow.push([this.convertFunc(this.bodHoldingList.Total), this.convertFunc(this.bodHoldingList.Zhv), this.convertFunc(this.bodHoldingList.Aghv)]);
                        extra = { topSectionHead, topSectionRow };

                        header = [["AdjHold", "BMFDEarmark", "BMFDEarmarkedPledge", "BMFDFunded", "BMFDFundedPledge", "BSE", "CDSL", "CDSLPledgeMargin", "Closingprice", "Coll", "Exp", "HaircutPer (pct.)", "MF", "NSDL", "NSDLPledgeMargin", "Pool", "ScripName", "Segment", "TotalSum", "TotalVal", "UnpaidQty"]];
                        rptData.forEach((element: any) => {
                            info.push([element.AdjHold, element.BMFDEarmark, element.BMFDEarmarkedPledge, element.BMFDFunded, element.BMFDFundedPledge, element.BSE, element.CDSL, element.CDSLPledgeMargin, element.Closingprice, element.Coll, element.Exp, element.HaircutPer, element.MF, element.NSDL, element.NSDLPledgeMargin, element.Pool, element.ScripName, element.Segment, element.TotalSum, element.TotalVal, element.UnpaidQty]);
                        })
                    } else {
                        this.toast.displayToast('No Data Found');
                    }
                    break;
                case 'fo':
                    this.commonService.setClevertapEvent('BODHolding_FnO', { 'PartnerCode': localStorage.getItem('userId1') });
                    rptData = this.bodHoldingList.FNOHolding;
                    if (rptData && rptData.length > 0) {
                        topSectionHead = [["Total"]];
                        topSectionRow.push([this.convertFunc(this.bodHoldingList.Total)]);
                        extra = { topSectionHead, topSectionRow };

                        header = [["AvgRate", "Buy", "CallPut", "Exchange", "ExchangeType", "Expiry", "LastPrice", "Margin", "Net", "Product", "Sell", "StkPrice", "Symbol", "Value"]];
                        rptData.forEach((element: any) => {
                            info.push([element.AvgRate, element.Buy, element.CallPut, element.Exchange, element.ExchangeType, element.Expiry, element.LastPrice, element.Margin, element.Net, element.Product, element.Sell, element.StkPrice, element.Symbol, element.Value]);
                        })
                    } else {
                        this.toast.displayToast('No Data Found');
                    }
                    break;
                case 'slbm':
                    this.commonService.setClevertapEvent('BODHolding_Slbm', { 'PartnerCode': localStorage.getItem('userId1') });
                    rptData = this.bodHoldingList.SLBMHolding;
                    if (rptData && rptData.length > 0) {
                        topSectionHead = [["Total"]];
                        topSectionRow.push([this.convertFunc(this.bodHoldingList.Total)]);
                        extra = { topSectionHead, topSectionRow };

                        header = [["Symbol", "Date", "Exp Date", "Exchange Type", "Exchange", "BLFlag", "Buy Qty", "Net Qty", "Price", "Sell Qty", "Series", "Values"]]
                        rptData.forEach((element: any) => {
                            info.push([element.Symbol, moment(element.Date).format('DD/MM/YYYY'), moment(element.ExpDate).format('DD/MM/YYYY'), element.ExchangeType, element.Exchange, element.BLFlag, element.BuyQty, element.NetQty, element.Price, element.SellQty, element.Series, element.Values])
                        })
                    } else {
                        this.toast.displayToast('No Data Found');
                    }
                    break;
                case 'col':
                    this.commonService.setClevertapEvent('BODHolding_Collateral', { 'PartnerCode': localStorage.getItem('userId1') });
                    rptData = this.bodHoldingList.CollateralPosition;
                    if (rptData && rptData.length > 0) {
                        topSectionHead = [["Total", "Non_Cash_Collateral", "Eligible_amount", "Collateral_Benefit", "Cash_Collateral", "Applicable_Non_Cash"]];
                        topSectionRow.push([this.convertFunc(this.bodHoldingList.Total), this.convertFunc(this.bodHoldingList.Non_Cash_Collateral), this.convertFunc(this.bodHoldingList.Eligible_amount), this.convertFunc(this.bodHoldingList.Collateral_Benefit), this.convertFunc(this.bodHoldingList.Cash_Collateral), this.convertFunc(this.bodHoldingList.Applicable_Non_Cash)]);
                        extra = { topSectionHead, topSectionRow };

                        header = [["Client Code ", "Symbol", "Haircut", "IsCashComponent", "Price", "Qty", "Value_WithHC", "Value_WithoutHC", "Description"]],
                            rptData.forEach((element: any) => {
                                info.push([element.ClientCode, element.Symbol, element.Haircut, element.IsCashComponent, element.Price, element.Qty, element.Value_WithHC, element.Value_WithoutHC, element.Description])
                            })
                    } else {
                        this.toast.displayToast('No Data Found');
                    }
                    break;
                default:
                    break;
            }
            if (info && info.length > 0) {
                if (type === 'pdf') {
                    this.commonService.savePdfFile(header, info, extra);
                    this.dataLoad = true;
                }
            } else {
                this.toast.displayToast('No Data Found');
            }
        } else {
            this.toast.displayToast('No Data Found');
        }
    }

    async clientDetailsPopup() {
		this.commonService.setClevertapEvent('Client_Details_Page');
		this.commonService.analyticEvent('Client_Details_Page', 'Client & Trades');
		const modal = this.modalController.create({
			component: ClientsDetailsModelComponent,
			componentProps: { "IndParams": '', clientID: this.passClientIdValue },
			cssClass: 'superstars client-details'
		});
		return (await modal).present();
	}

    goToBrokeragePlan() {
		localStorage.setItem('clientDetail', "true");
		if(this.passClientIdValue != ''){
			this.commonService.setClevertapEvent('Brokerage_Information');
			this.commonService.analyticEvent('Brokerage_Information', 'Wire Reports');
			this.router.navigate(['/brokerage-information',this.passClientIdValue]);
		}
		else{
			this.toast.displayToast("Client Code is not available");
		}
	}

    goToClientInteractions() {
		//console.log('Clientinteractions_clicked', 'Clientinteractions_clicked');
		this.commonService.setClevertapEvent('Clientinteractions_clicked', { 'PartnerCode': localStorage.getItem('userId1') });
		this.router.navigate(['/client-interactions'],{ queryParams: {id: this.passClientIdValue}});
	}

    async displyPopupClientProfile() {
		const modal = this.modalController.create({
			component: ClientProfileCaptureModalComponent,
			componentProps: {clientID: this.passClientIdValue },
			cssClass: 'client_profile_modal',
		  	backdropDismiss: true
		  });
		  return (await modal).present();
		}

        goToShareReport() {
            localStorage.setItem('clientDetail', "true");
                this.router.navigate(['/share-reports', this.passClientIdValue, '-']);
        }

    /**
     * To download SSRS report(Excel)
     */
    onExcelDownload() {
        if (this.passClientIdValue == '') {
            this.toast.displayToast('Kindly select Client Id');
            return;
        }
        this.dataLoad = false;
        this.storage.get('userType').then(type => {
            if (type === 'RM' || type === 'FAN') {
                this.storage.get('bToken').then(token => {
                    this.getExcelFile(token);
                })
            } else {
                this.storage.get('subToken').then(token => {
                    this.getExcelFile(token);
                })
            }
        })
    }

    getExcelFile(token: any) {
        let obj = {
            rptId: this.isProd ? "492" : "14449",
            ClientCode: this.passClientIdValue,
            loginid: localStorage.getItem('userId1'),
            SendEmail: "N",
            ReportFormat: "EXCEL",
            CallFrom: "AAA"
        }
        this.shareReportSer.sharedDownloadReport(token, obj).subscribe((res) => {
            this.commonService.downLoadReportFun(res, 'BOD Holding', 'excel');
            this.dataLoad = true;
        });
    }
}
