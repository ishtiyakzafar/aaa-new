import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { ModalController } from '@ionic/angular';
import { BodHoldingBreakdownnModalComponent } from '../bod-holding-breakdownn-modal/bod-holding-breakdownn-modal.component';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { BodHoldingModalMobileComponent } from '../bod-holding-modal-mobile/bod-holding-modal-mobile.component';
import { BodCollateralModalComponent } from '../bod-collateral-modal/bod-collateral-modal.component';

@Component({
  selector: 'app-bod-holding-mobile',
  templateUrl: './bod-holding-mobile.component.html',
  styleUrls: ['./bod-holding-mobile.component.scss'],
})
export class BodHoldingMobileComponent implements OnInit {

  public clientId: any;
  public headerDetailsData: any;
  public tokenValue: any;
  public userIdValue: any;
  public dataLoad = false;
  public fnoPositionList:any[] = [];
  public slbmHoldingList:any[] = [];
  public collateralPositionList:any[] = [];
  public bodHoldingList:any = [];
  public bodBreakdownData: any;
  public bodCollateralData: any;
  equityBlockTabValue = 'equity';
  public bodAllData: any = {};
  equityBlockButton: any[] = [
    { Name: 'Equity', Value: 'equity', active: 1 },
    { Name: 'F&O', Value: 'fo', active: 0 },
    { Name: 'SLBM', Value: 'slbm', active: 0 },
    { Name: 'Collateral', Value: 'col', active: 0 }
  ];

  constructor(private wireReqService: WireRequestService, public toast: ToasterService, private commonService: CommonService, private storage: StorageServiceAAA, private modalController: ModalController) { }

  ngOnInit() {
    this.commonService.setClevertapEvent('BODHolding_Equity');
    this.clientId = JSON.parse(localStorage.getItem('clientId') || "{}");
    this.initBod();
  }

  goBack() {
		window.history.back();
	}

  initBod(){
    this.storage.get('userID').then((userID) => {
      this.storage.get('userType').then(type => {
          if (type === 'RM' || type === 'FAN') {
              this.storage.get('bToken').then(token => {
                  this.tokenValue = token;
                  this.userIdValue = userID;
                  this.bodEqHoling(token, userID);
              })
          } else {
              this.storage.get('subToken').then(token => {
                  this.tokenValue = token;
                  this.userIdValue = userID;
                  this.bodEqHoling(token,userID);
              })
          }

      })
   })   
  }

  async displyPopupCollatralmodal() {
    const modal = this.modalController.create({
        component: BodCollateralModalComponent,
        componentProps: {bodCollateralData: this.bodCollateralData},
        cssClass: 'bod_hold_collatral_modal',
      backdropDismiss: true
      });
      return (await modal).present();
  }

  equityBlockSegmentChanged(event: any) {
    if(event == 'equity'){
        // this.bodEqHoling(this.tokenValue,this.userIdValue)
        // this.order = 'ScripName'; 
        this.commonService.setClevertapEvent('BODHolding_Equity');
        this.tabChange('eq',this.tokenValue,this.userIdValue);
    }
    else if(event == 'fo'){
        // this.nfoPositionData(this.tokenValue, this.userIdValue)
        // this.order = 'Symbol';
        this.commonService.setClevertapEvent('BODHolding_FnO');
        this.tabChange('fno',this.tokenValue,this.userIdValue);
    }
    else if(event == 'col'){
        // this.nfoPositionData(this.tokenValue, this.userIdValue)
        // this.order = 'Symbol';
        this.commonService.setClevertapEvent('BODHolding_Collateral');
        this.tabChange('col',this.tokenValue,this.userIdValue);
    }
    else{
        // this.order = 'Symbol';
        // this.slbmHoldingData(this.tokenValue, this.userIdValue)
        this.commonService.setClevertapEvent('BODHolding_Slbm');
        this.tabChange('slbm',this.tokenValue,this.userIdValue);
    }
}

  tabChange(holdingType: any,token: any,userID: any){
    let collateralObj = {
      Applicable_Non_Cash: '',
      Cash_Collateral: '',
      Collateral_Benefit: '',
      Eligible_amount: '',
      Non_Cash_Collateral: '',
      Total: '',
    }
    this.dataLoad = true;
    this.wireReqService.getHoldingDetails(token, this.clientId, userID, holdingType).subscribe((res: any) => {
        if(res['Head']['ErrorCode'] == 0){
          this.bodAllData = {};
          this.bodAllData = res['Body'];
              collateralObj.Applicable_Non_Cash = res['Body'].Applicable_Non_Cash;
              collateralObj.Cash_Collateral = res['Body'].Cash_Collateral;
              collateralObj.Collateral_Benefit = res['Body'].Collateral_Benefit;
              collateralObj.Eligible_amount = res['Body'].Eligible_amount;
              collateralObj.Non_Cash_Collateral = res['Body'].Non_Cash_Collateral;
              collateralObj.Total = res['Body'].Total;
              this.bodCollateralData = collateralObj;
            if(res['Body'] && res['Body'].BODHolding && res['Body'].BODHolding.length > 0){
              this.bodHoldingList = res['Body'].BODHolding;
            }
            if(res['Body'] && res['Body'].FNOHolding && res['Body'].FNOHolding.length > 0){
              this.fnoPositionList = res['Body'].FNOHolding;
            }
            if(res['Body'] && res['Body'].SLBMHolding && res['Body'].SLBMHolding.length > 0){
              this.slbmHoldingList = res['Body'].SLBMHolding;
            }
            if(res['Body'] && res['Body'].CollateralPosition && res['Body'].CollateralPosition.length > 0){
              this.collateralPositionList = res['Body'].CollateralPosition;
            }
        } 
    })
    this.dataLoad = false;
  }

  formatChange(date: any){
    return moment(date).format('DD/MM/YYYY');
  }

  convertFunc(val: any){
    let value = parseFloat(val);
    return parseFloat(value.toFixed(2));
  }

  iconClick(dataObj: any){
    dataObj.onClick = !dataObj.onClick;
  }

  async displyPopupBodholdingbreakdownn() {
    const modal = this.modalController.create({
        component: BodHoldingBreakdownnModalComponent,
        componentProps: {bodBreakdownData: this.bodBreakdownData},
        cssClass: 'bod_hold_breakdown_modal',
      backdropDismiss: true
      });
      return (await modal).present();
    } 

    async displyPopupBodholdingtable(dataObj: any) {
      const modal = this.modalController.create({
          component: BodHoldingModalMobileComponent,
          componentProps: {dataObj: dataObj},
          cssClass: 'bod_hold_modal',
        backdropDismiss: true
        });
        return (await modal).present();
      } 

  bodEqHoling(token: any, userID: any){
    let breakdownnObj = { 
      NSEDerivativeSpan: '',
      NSEDerivativeExposure: '',
      NSECurrencySpan: '',
      NSECurrencyExposure: '',
      BSEDerivativeSpan: '',
      BSEDerivativeExposure: '',
      MCXCurrencySpan: '',
      MCXCurrencyExposure: '',
      CommoditySpan: ''
    };
    this.dataLoad = true;
    this.wireReqService.getHeaderDetails(token, this.clientId).subscribe((res: any) => {
        if(res['Head']['ErrorCode'] == 0){
            this.headerDetailsData = res['Body'];
                breakdownnObj.NSEDerivativeSpan = res['Body'].NSEDerivativeSpan;
                breakdownnObj.NSEDerivativeExposure = res['Body'].NSEDerivativeExposure;
                breakdownnObj.NSECurrencySpan = res['Body'].NSECurrencySpan;
                breakdownnObj.NSECurrencyExposure = res['Body'].NSECurrencyExposure;
                breakdownnObj.BSEDerivativeSpan = res['Body'].BSEDerivativeSpan;
                breakdownnObj.BSEDerivativeExposure = res['Body'].BSEDerivativeExposure;
                breakdownnObj.MCXCurrencySpan = res['Body'].MCXCurrencySpan;
                breakdownnObj.MCXCurrencyExposure = res['Body'].MCXCurrencyExposure;
                breakdownnObj.CommoditySpan = res['Body'].CommoditySpan;
                this.bodBreakdownData = breakdownnObj;
        } 
    });  
   
    this.wireReqService.getHoldingDetails(token, this.clientId, userID, 'eq').subscribe((res: any) => {
      this.bodAllData = {};
        if(res['Head']['ErrorCode'] == 0){
            this.dataLoad = false;
            if(res['Body'] && res['Body'].BODHolding.length > 0){
              this.bodAllData = res['Body'];
              this.bodHoldingList = res['Body'].BODHolding;
        }
        } 
        this.dataLoad = false;
    })   
}

  /**
       * On click of pdf/excel icon
       */
  onPdfExcelDownload(type: any) {
    if (this.headerDetailsData) {
      this.dataLoad = true;
      let info = [];
      let head = [["Client Category", "Cash", "Wire Code", "Activation Date", "AHVCover", "ALB", "BMFDBNPLLedgerBalance", "BSEDerivativeExposure", "BSEDerivativeSpan", "CommoditySpan", "FDR", "FNO", "GHVCover", "LedBalT2", "MCXCurrencyExposure", "MCXCurrencySpan", "MarginAHV", "MarginGHV", "MarginTHV", "MtoMDrCr", "NSECurrencyExposure", "NSECurrencySpan", "NSEDerivativeExposure", "NSEDerivativeSpan", "NetWorth", "POA", "SpanExposureMargin", "UnclCheque"]];
      info.push([this.headerDetailsData.ClientCategory, this.headerDetailsData.Cash, this.headerDetailsData.WireCode, this.formatChange(this.headerDetailsData.ActivationDate), this.headerDetailsData.AHVCover, this.convertFunc(this.headerDetailsData.ALB), this.convertFunc(this.headerDetailsData.BMFDBNPLLedgerBalance), this.convertFunc(this.headerDetailsData.BSEDerivativeExposure), this.convertFunc(this.headerDetailsData.BSEDerivativeSpan), this.convertFunc(this.headerDetailsData.CommoditySpan), this.convertFunc(this.headerDetailsData.FDR), this.headerDetailsData.FNO, this.headerDetailsData.GHVCover, this.convertFunc(this.headerDetailsData.LedBalT2), this.convertFunc(this.headerDetailsData.MCXCurrencyExposure), this.convertFunc(this.headerDetailsData.MCXCurrencySpan), this.convertFunc(this.headerDetailsData.MarginAHV), this.convertFunc(this.headerDetailsData.MarginGHV), this.convertFunc(this.headerDetailsData.MarginTHV), this.convertFunc(this.headerDetailsData.MtoMDrCr), this.convertFunc(this.headerDetailsData.NSECurrencyExposure), this.convertFunc(this.headerDetailsData.NSECurrencySpan), this.convertFunc(this.headerDetailsData.NSEDerivativeExposure), this.convertFunc(this.headerDetailsData.NSEDerivativeSpan), this.convertFunc(this.headerDetailsData.NetWorth), this.headerDetailsData.POA, this.convertFunc(this.headerDetailsData.SpanExposureMargin), this.convertFunc(this.headerDetailsData.UnclCheque)]);
      if (type === 'pdf') {
        this.commonService.savePdfFile(head, info);
        this.dataLoad = false;
      } else {
        this.commonService.exportDataToExcel(head[0], info, 'BOD Holding');
        this.dataLoad = false;
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
      this.dataLoad = true;
      let header: any = [];
      let info: any = []
      let extra;
      let topSectionHead = [];
      let topSectionRow = [];
      switch (this.equityBlockTabValue) {
        case 'equity':
          this.commonService.setClevertapEvent('BODHolding_Equity', { 'PartnerCode': localStorage.getItem('userId1') });
          rptData = this.bodAllData.BODHolding;
          if (rptData && rptData.length > 0) {
            topSectionHead = [["Total", "ZHV", "AGHV"]];
            topSectionRow.push([this.convertFunc(this.bodAllData.Total), this.convertFunc(this.bodAllData.Zhv), this.convertFunc(this.bodAllData.Aghv)]);
            extra = { topSectionHead, topSectionRow };

            header = [["AdjHold", "BMFDEarmark", "BMFDEarmarkedPledge", "BMFDFunded", "BMFDFundedPledge", "BSE", "CDSL", "CDSLPledgeMargin", "Closingprice", "Coll", "Exp", "HaircutPer (pct.)", "MF",  "NSDL", "NSDLPledgeMargin", "Pool", "ScripName", "Segment", "TotalSum", "TotalVal", "UnpaidQty"]];
            rptData.forEach((element: any) => {
              info.push([element.AdjHold, element.BMFDEarmark, element.BMFDEarmarkedPledge, element.BMFDFunded, element.BMFDFundedPledge, element.BSE, element.CDSL, element.CDSLPledgeMargin, element.Closingprice, element.Coll, element.Exp, element.HaircutPer, element.MF, element.NSDL, element.NSDLPledgeMargin, element.Pool, element.ScripName, element.Segment, element.TotalSum, element.TotalVal, element.UnpaidQty]);
            })
          } else {
            this.toast.displayToast('No Data Found');
          }
          break;
        case 'fo':
          this.commonService.setClevertapEvent('BODHolding_FnO', { 'PartnerCode': localStorage.getItem('userId1') });
          rptData = this.bodAllData.FNOHolding;
          if (rptData && rptData.length > 0) {
            topSectionHead = [["Total"]];
            topSectionRow.push([this.convertFunc(this.bodAllData.Total)]);
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
          rptData = this.bodAllData.SLBMHolding;
          if (rptData && rptData.length > 0) {
            topSectionHead = [["Total"]];
            topSectionRow.push([this.convertFunc(this.bodAllData.Total)]);
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
          rptData = this.bodAllData.CollateralPosition;
          if (rptData && rptData.length > 0) {
            topSectionHead = [["Total", "Non_Cash_Collateral", "Eligible_amount", "Collateral_Benefit", "Cash_Collateral", "Applicable_Non_Cash"]];
            topSectionRow.push([this.convertFunc(this.bodAllData.Total), this.convertFunc(this.bodAllData.Non_Cash_Collateral), this.convertFunc(this.bodAllData.Eligible_amount), this.convertFunc(this.bodAllData.Collateral_Benefit), this.convertFunc(this.bodAllData.Cash_Collateral), this.convertFunc(this.bodAllData.Applicable_Non_Cash)]);
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
          this.dataLoad = false;
        } else {
          this.commonService.exportDataToExcel(header[0], info, 'BOD Holding', extra);
          this.dataLoad = false;
        }
      } else {
        this.toast.displayToast('No Data Found');
      }
    } else {
      this.toast.displayToast('No Data Found');
    }
  }
}
