import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SummaryConfirmModalComponent } from '../summary-confirm-modal/summary-confirm-modal.component';
import { SummaryDetailsModalComponent } from '../summary-details-modal/summary-details-modal.component';
import { SummaryReasonsModalComponent } from '../summary-reasons-modal/summary-reasons-modal.component';
import { ToasterService } from '../../helpers/toaster.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-client-summary-mobile',
  templateUrl: './client-summary-mobile.component.html',
  styleUrls: ['./client-summary-mobile.component.scss'],
})
export class ClientSummaryMobileComponent implements OnInit  {

  public isOpen = false;
  public summaryDetails: any;
  public PageNo = 1;
  public SortBy: any = '';
  public SortOrder: any = '';
  dataLoad:boolean = false;
  public toggleStatus = false;
  public saveCount = 0;
  public tokenVal: any;
  public HoldBlockSellandBranchRemarkIDList: any = [];
  public remarkId: any = null;
  public RemarkCode: any = "Remark Not selected";
  public totalRemarkData: any;
  public remarkCodeStr: any = "Remark Not selected";
  searchValue:any;
  public searchValArr: any = [];
  reportData: any = [];
  public showBtn = false;
  endIndex: number = 50;
  enableNextMobile: boolean = false;

  constructor(private modalController: ModalController,public toast: ToasterService,private wireReqService: WireRequestService,private route: ActivatedRoute,
	private commonService: CommonService, private storage: StorageServiceAAA) { }

  ngOnInit() {
	if(this.route.snapshot.queryParams['branch'] != undefined || this.route.snapshot.queryParams['token'] != undefined){
		localStorage.setItem('branch', JSON.stringify(this.route.snapshot.queryParams['branch']));
		localStorage.setItem('token', JSON.stringify(this.route.snapshot.queryParams['token']));
	}
	if(JSON.parse(localStorage.getItem("branch") || "{}") == null || JSON.parse(localStorage.getItem("token") || "{}") == null){
		this.route.queryParamMap.subscribe(params => 
			this.summaryList(params.get('token'),params.get('branch'),'','',this.PageNo,'ALB','asc')
		);
	}
	else{
		this.summaryList(JSON.parse(localStorage.getItem("token") || "{}"),JSON.parse(localStorage.getItem("branch") || "{}"),'','',this.PageNo,'ALB','asc')
	}

  }

  getRemark(dataObj: any) {
	// this.totalRemarkData = JSON.parse(localStorage.getItem('remarkData') || "{}");
	this.storage.get('remarkData').then((data) => {
		this.totalRemarkData = {};
		if(data) this.totalRemarkData = data;
	})
	for(let i=0;i<this.totalRemarkData.length;i++){
		if(dataObj.ClientCode == this.totalRemarkData[i].ClientCode){
			dataObj.RemarkCode = this.totalRemarkData[i].RemarkCode;
		}
	}
  }

  summaryList(token: any,branchId: any,SearchBy: any,SearchText: any,PageNo: any,SortBy: any,SortOrder: any){
	this.dataLoad = true;
	this.wireReqService.getClientSummary(token,branchId, SearchBy, SearchText,0,SortBy,SortOrder)
	.subscribe((res: any) => {
		if(res['Head']['ErrorCode'] == 0){
			this.summaryDetails = res['Body']['ClientSummary'];
			this.reportData = res['Body']['ClientSummary'];
			this.commonService.setRemarkData(this.summaryDetails);
			this.dataLoad = false;
			if(this.summaryDetails.length > 49){
				this.showBtn = true;
				this.enableNextMobile = true;
			}
			else{
				this.showBtn = false;
			}
		}
		else{
			this.toast.displayToast(res['Head']['ErrorDescription']);
		}
		this.dataLoad = false;
	});
  }

	onPrev(){
		this.PageNo -= 1;
		if(this.PageNo >= 1){
			this.summaryList(JSON.parse(localStorage.getItem("token") || "{}"),JSON.parse(localStorage.getItem("branch") || "{}"),'','',this.PageNo,this.SortBy,this.SortOrder);
		}
	}

	onNext(){
		this.PageNo += 1;
		if(this.PageNo > 1){
			this.summaryList(JSON.parse(localStorage.getItem("token") || "{}"),JSON.parse(localStorage.getItem("branch") || "{}"),'','',this.PageNo,this.SortBy,this.SortOrder);
		}
	}

  goBack() {
		window.history.back();
	}

  dismiss(){
		this.modalController.dismiss();
	  }

	classCheck(ALB: any){
		if(ALB > 0){
			return false;
		}
		return true;
	}

	async displyPopupText(dataObj: any) {
		const modal = this.modalController.create({
				component: SummaryDetailsModalComponent,
				componentProps: {dataObj},
				cssClass: 'summary_details',
		  backdropDismiss: true
			});
			return (await modal).present();
	} 
	
	async displyPopupText1(HoldBlockSellandBranchRemarkIDList: any) {
		const modal = this.modalController.create({
			component: SummaryConfirmModalComponent,
			componentProps: {HoldBlockSellandBranchRemarkIDList},
			cssClass: 'summary_confirm',
		backdropDismiss: true
		});
		return (await modal).present();
	} 

	async displyPopupText2(dataObj: any) {
		const modal = this.modalController.create({
			component: SummaryReasonsModalComponent,
			componentProps: {dataObj},
			cssClass: 'select_Reason',
			backdropDismiss: true
		});
		setTimeout(() => {
			this.getRemark(dataObj);
		}, 2500);
		return (await modal).present();
	}
        
	onChange(event: any,obj: any){
		this.toggleStatus= event;	
		this.saveCount = 0;
		for(let i=0 ; i< this.summaryDetails.length ; i++){
			if(this.summaryDetails[i] && this.summaryDetails[i].toggleStatus){
				this.saveCount += 1;
			}
		
		}
	// if(event.target.checked != false){
	// 	this.displyPopupText2(dataObj);
	// }
	}

	// handleChange(event: any){
	// 	this.searchValArr = event.target.value;
	// }

	save(){
		var d = new Date(); 
		var h = d.getHours();

		if(!(h >= 0 && h < 9)){
			this.toast.displayToast('Request can only be submitted before 9.00 AM');
			return;
		}

		this.HoldBlockSellandBranchRemarkIDList = [];

		for(let i=0 ; i< this.summaryDetails.length ; i++){
			if(this.summaryDetails[i] && this.summaryDetails[i].toggleStatus == true){
				this.HoldBlockSellandBranchRemarkIDList.push({
					'MakerId': this.summaryDetails[i].ClientCode,
					'HoldBlockSell': this.summaryDetails[i].toggleStatus == true ? '1' : '0',
					'BranchRemarkID': this.totalRemarkData[i].BranchRemarkID,
					// 'RemarkCode': this.totalRemarkData[i].RemarkCode
				});
			}
		}

		this.displyPopupText1(this.HoldBlockSellandBranchRemarkIDList);
	}

	cancel(){
		for(let i=0 ; i< this.summaryDetails.length ; i++){
			if(this.summaryDetails[i] && this.summaryDetails[i].toggleStatus){
				delete this.summaryDetails[i].toggleStatus;
			}
		}
		this.saveCount = 0;
	}

	/**
	   * On click of pdf/excel icon
	   */
	onPdfExcelDownload(type: any) {
		this.commonService.setClevertapEvent('Riskreport_ClientSummary', { 'PartnerCode': localStorage.getItem('userId1') });
		if (this.reportData && this.reportData.length > 0) {
			this.dataLoad = true;
			let info: any = [];
			let head = [["Client Code", "Client Branch", "Client Category", "AGHVC", "ALB", "BMFD", "MarginAHV", "MarginGHV", "MarginTHV", "HoRemarks", "NetWorth", "Span", "THV", "Unclearedcheq", "Undelivered", "HoRemarks", "Partner Remarks"]];
			this.reportData.forEach((element: any) => {
				info.push([element.ClientCode, element.ClientBranch, element.ClientCategory, element.AGHVC, element.ALB, element.BMFD, element.MarginAHV, element.MarginGHV, element.MarginTHV, element.HoRemarks, element.NetWorth, element.Span, element.THV, element.Unclearedcheq, element.Undelivered, element.HoRemarks, element.PartnerRemarks])
			})
			if (type === 'pdf') {
				this.commonService.savePdfFile(head, info);
				this.dataLoad = false;
			} else {
				this.commonService.exportDataToExcel(head[0], info, 'Client Summary');
				this.dataLoad = false;
			}
		} else {
			this.toast.displayToast('No Data Found');
		}
	}

	loadDataMobile = (event: any) => {

		this.enableNextMobile = false;
		if(this.summaryDetails.length > this.endIndex) this.enableNextMobile = true;

		if(this.enableNextMobile){
			setTimeout(() => {
				this.endIndex += 50;
				event.target.complete();
				if(this.endIndex > this.summaryDetails.length){
					event.target.disabled = true;
				}
			}, 1000);
		}		
	}

	public searchText(txt: any) {
		this.enableNextMobile = false;
		this.dataLoad = true;
        if (txt) {
			
            this.searchValue = txt.trim();
            this.summaryDetails = this.reportData.filter((item: any) => {
                return item.ClientCode.toLowerCase().includes(this.searchValue.toLowerCase());
            });
			setTimeout(() => {
				if(this.summaryDetails.length > 50){
					this.enableNextMobile = true;
				}
				this.endIndex = 50;
				this.scrollToTop();
				this.dataLoad = false;
			}, 1000);
		}
		else{
			this.summaryDetails = this.reportData;
			setTimeout(() => {
				if(this.summaryDetails.length > 50){
					this.enableNextMobile = true;
				}
				this.endIndex = 50;
				this.scrollToTop();
				this.dataLoad = false;
			}, 1000);
		}
    }

	scrollToTop = () => {

		let dataMobile: any = document.getElementById("mobileTableContainer");
		if(dataMobile) dataMobile.scrollTop = 0;    
	}
}
