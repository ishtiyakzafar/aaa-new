import { Component, ElementRef, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientSummaryRemarksComponent } from '../client-summary-remarks/client-summary-remarks.component';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
    selector: 'app-client-summary',
    providers: [WireRequestService],
    templateUrl: './client-summary.component.html',
    styleUrls: ['./client-summary.component.scss'],
})
export class ClientSummaryComponent implements OnInit, OnChanges {
    @ViewChild('detail') detail!: ElementRef;
    @Input () branchId: any;
    public detailHeight!: number;
    public ascending!: boolean;
    public order: any = '';
    searchValue:any;
    dataLoad:boolean = false;
    fileLoad:boolean = false;
    public remarkId: any = null;
    public toggleStatus = false;
    public isonsave = false;
    reverse: boolean = false;
    public wait = false;
    public remarkList = [
        {BranchRemarkID: '1', remarkCode: 'Cheque collected- CMS updated'},
        {BranchRemarkID: '2', remarkCode: 'Cheque on way - CMS will be updated by 11:00 am'},
        {BranchRemarkID: '3', remarkCode: 'Shares received as additional margin'},
        {BranchRemarkID: '4', remarkCode: 'Client done Net transfer'},
        {BranchRemarkID: '5', remarkCode: 'BTST (Buy Today Sell Tomorrow) Customer by 10 am'},
        {BranchRemarkID: '6', remarkCode: 'Cheque Cleared but credit not given'},
        {BranchRemarkID: '7', remarkCode: 'Liquid fund sold'}
      ];
      public clientBlockSegmentValue: string = "clientCode";
      public placeholderInput: string = 'Search Client Code or Branch Code';
      public searchTerm: any;
      public PageNo = 1;
      public SortBy: any = "ALB";
      public SortOrder: any = "asc";
      public SearchText: any = '';
      public SearchBy: any = '';
      public enableNext = false;
      public saveCount = 0;
      sendDataToChild:boolean = false;
      public showBtn = false;
      public HoldBlockSellandBranchRemarkIDList: any = [];
      public segmentButtonOption: any[] = [
        {name: 'Client Code/PAN', value: 'clientCode'},
        {name: 'Name', value: 'clientName'}
    ]
    reportData = [];
    summList = [];
    clonedArr = [];
    scrollTimes = 0;
    scrollLoad = false;
    pageLimit = 100;
    datas: any = [];
    summaryDetails:any[] = [];
    public token: any;
    constructor(private modalController: ModalController, private commonService: CommonService ,  private storage: StorageServiceAAA, private wireReqService: WireRequestService, public toast: ToasterService) { }
    ngOnChanges(changes: SimpleChanges): void {
        // if(this.summaryDetails.length > 0){
        //     this.showBtn = true;
        // }
        // this.PageNo = 1;
        this.initClientSummary();
    }

    ngOnInit() { 
        // if(this.summaryDetails.length > 0){
        //     this.showBtn = true;
        // }
        // this.initClientSummary(true);
    }

    // coming soon popup when click donwload option
    comingOption(event: any) {
        this.commonService.comingSoon(event, 'Coming Soon', 'coming')
    }

    initClientSummary(getAllData?: boolean, fileType?: string) {
        this.dataLoad = false;
        this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
                    this.token = token;
                    if (getAllData) {
                        this.fileLoad = true;
                        let passSortBy = ((fileType == 'pdf') || (fileType == 'excel')) ? 'ALB' : '';
                        let passOrderBy = ((fileType == 'pdf') || (fileType == 'excel')) ? 'asc' : ''; 
                        this.summaryList(token, '', '', 0, passSortBy,passOrderBy, true, fileType);
                    } else {
                        this.summaryList(token, '', '', this.PageNo, this.SortBy, this.SortOrder);
                    }
				})
			} else {
				this.storage.get('subToken').then(token => {
                    this.token = token;
                    if (getAllData) {
                        let passSortBy = ((fileType == 'pdf') || (fileType == 'excel')) ? 'ALB' : '';
                        let passOrderBy = ((fileType == 'pdf') || (fileType == 'excel')) ? 'asc' : ''; 
                        this.summaryList(token, '', '', 0, passSortBy,passOrderBy, true, fileType);
                    } else {
                        this.summaryList(token, '', '', this.PageNo, this.SortBy, this.SortOrder);
                    }
                })
			}

		})
    }

    segmentChange() {
		this.searchTerm = '';
		this.sendDataToChild = false;
		if (this.clientBlockSegmentValue === 'clientName') {
			this.placeholderInput = 'Type Name or Branch Code';
		} else {
			this.placeholderInput = 'Type Client Code or Branch Code';
		}
	}

    public searchText(txt: any) {
        if (txt) {
            this.searchValue = txt.trim();
            this.datas = [];
            this.datas = this.clonedArr;
            this.datas = this.datas.filter((item: any) => {
                return item.ClientCode.toLowerCase().includes(this.searchValue.toLowerCase()) || item.ClientBranch.toLowerCase().includes(this.searchValue.toLowerCase());
            });
        } else {
            this.onScrollData(1);
        }
    }

    setOrder(value: string) {
		if (this.datas.length) {
			this.dataLoad = false;
            this.enableNext = false;
			if (this.order === value) {
				this.reverse = !this.reverse;
			}
			this.order = value;
			
			this.datas = [];
			this.PageNo = 1;
			this.SortBy = value;
			this.SortOrder = this.reverse ? 'asc' : 'dsc';
            if (this.reverse) {
                this.ascending = true;
            } else {
                this.ascending = false;
            }
			if (!this.wait) {
				this.wait = true;			
				this.summaryList(this.token,'','',this.PageNo,this.SortBy,this.SortOrder);
			}
		} else return;
	}

    save(){
        var d = new Date(); 
        var h = d.getHours();

        if(!(h >= 0 && h < 9)){
            this.toast.displayToast('Request can only be submitted before 9.00 AM');
            return;
        }

        this.HoldBlockSellandBranchRemarkIDList = [];

        for(let i=0 ; i< this.datas.length ; i++){
            if(this.datas[i] && this.datas[i].toggleStatus == true && this.datas[i].ToSave){
                this.HoldBlockSellandBranchRemarkIDList.push({
                    'MakerId': this.datas[i].ClientCode,
                    'HoldBlockSell': this.datas[i].toggleStatus == true ? '1' : '0',
                    'BranchRemarkID': this.datas[i].BranchRemarkID
                });
            }
        }

        this.wireReqService.editSummaryReport(this.token, this.HoldBlockSellandBranchRemarkIDList).subscribe((res: any) => {
            if(res['Head']['ErrorCode'] == 0){
              this.commonService.setClevertapEvent('reports_risk_client_summary_submit');
              this.toast.displayToast(res['Body']['Status']);
              this.summaryList(this.token,'','',this.PageNo,this.SortBy,this.SortOrder);
              this.saveCount = 0;
            }
            else{
            //   this.toast.displayToast(res['Head']['ErrorDescription']);
              this.toast.displayToast("Kindly select the BR Remark to submit the request");
            }
          });
      }
    
      cancel(){
        for(let i=0 ; i< this.datas.length ; i++){
            if(this.datas[i] && this.datas[i].toggleStatus && this.datas[i].ToSave){
                delete this.datas[i].toggleStatus;
            }
            if(this.datas[i] && this.datas[i].BranchRemarkID && this.datas[i].ToSave){
               delete this.datas[i].BranchRemarkID;
            }
        }
        this.saveCount = 0;
      }

      divScroll(event: any) {
		const tableHeight = event.target.offsetHeight;
		const scrollHeight = event.target.scrollHeight,
			scrollerEndPoint = scrollHeight - tableHeight,
			tableScrollTop = event.target.scrollTop;

			// if (tableScrollTop >= scrollerEndPoint - 100 && this.enableNext && !this.wait) {
            //     this.wait = true;
			// 	this.PageNo += 1;
			// 	this.summaryList(this.token,this.SearchBy,this.SearchText,this.PageNo,this.SortBy,this.SortOrder);
			// }
	    }
    
      toggleChange(event: any,obj: any){
        this.toggleStatus= event;
        this.saveCount = 0;
        for (let i = 0; i < this.datas.length; i++) {
            if (this.datas[i] && this.datas[i].toggleStatus && this.datas[i].PartnerRemarks === '') {
                this.saveCount += 1;
            } else if (this.datas[i].BranchRemarkID && !this.datas[i].toggleStatus) {
                this.datas[i].BranchRemarkID = null;
            }
        }
    }

    summaryList(token: any, SearchBy?: any, SearchText?: any, PageNo?: any, SortBy?: any, SortOrder?: any, isDownload?: any, fileType?: any) {
        this.dataLoad = false;
        this.searchValue = "";
        if (this.branchId && this.branchId != undefined) {
            this.SearchText = SearchText;
            this.SearchBy = SearchBy;
            this.wireReqService.getClientSummary(token, this.branchId, SearchBy, SearchText, 0, SortBy, SortOrder)
            .subscribe((res: any) => {
                this.wait = false;
                this.scrollTimes = 0;
                if (res['Head']['ErrorCode'] == 0) {
                    this.reportData = res['Body']['ClientSummary'];
                    if (res['Body']['ClientSummary'].length === 0) {
                        this.enableNext = false;
                        this.dataLoad = true;
                        this.fileLoad = false;
                    } else {
                        let totalRecords = res['Body']['ClientSummary'].length;
                        this.scrollTimes = Math.floor(totalRecords/this.pageLimit);
                        if(totalRecords % this.pageLimit > 0){
                            this.scrollTimes = Math.floor(totalRecords/this.pageLimit) + 1;
                        }
                        this.clonedArr = res['Body']['ClientSummary'];
                        this.summList = this.clonedArr.slice(0, this.pageLimit);
                        if (isDownload) {
                            this.onPdfExcelDownload(fileType, res['Body']['ClientSummary']);
                            setTimeout(() => {
                                this.dataLoad = true
                            }, 500);
                        } else {
                            if (this.PageNo === 1) {
                                this.datas = [];
                            }
                            this.summList.forEach((ele: any) => {
                                let pRemarks = ele.PartnerRemarks != "" ? this.remarkList.find(obj => obj.remarkCode === ele.PartnerRemarks) : undefined;
                                this.datas.push({
                                    HoRemarks: ele.HoRemarks,
                                    ClientCode: ele.ClientCode,
                                    ClientBranch: ele.ClientBranch,
                                    ClientCategory: ele.ClientCategory,
                                    AGHVC: ele.AGHVC,
                                    ALB: ele.ALB,
                                    Unclearedcheq: ele.Unclearedcheq,
                                    Undelivered: ele.Undelivered,
                                    THV: ele.THV,
                                    Span: ele.Span,
                                    BMFD: ele.BMFD,
                                    MarginTHV: ele.MarginTHV,
                                    MarginAHV: ele.MarginAHV,
                                    MarginGHV: ele.MarginGHV,
                                    HoldBlockSell: ele.HoldBlockSell,
                                    NetWorth: ele.NetWorth,
                                    PartnerRemarks: ele.PartnerRemarks,
                                    ToSave: ele.PartnerRemarks ? false : true,
                                    BranchRemarkID: pRemarks && pRemarks.BranchRemarkID ? pRemarks.BranchRemarkID : undefined,
                                    toggleStatus: pRemarks && pRemarks.BranchRemarkID ? true : false,
                                })
                            });
                            if (this.summList.length > 49) {
                                this.enableNext = true;
                            }
                            else {
                                this.enableNext = false;
                            }
                            setTimeout(() => {
                                this.dataLoad = true
                            }, 500);
                        }
                    }
                }
                else {
                    this.datas = [];
                    this.summList = [];
                    setTimeout(() => {
                        this.dataLoad = true
                    }, 500);
                    this.enableNext = false;
                }
            })
        }
        else {
            this.dataLoad = true;
        }
    }

    ionViewWillEnter(){
        
    }

    onPrev(){
        this.PageNo -= 1;
        if(this.PageNo >= 1){
		    this.summaryList(this.token,this.SearchBy,this.SearchText,this.PageNo,this.SortBy,this.SortOrder);
        }
    }

    onNext(){
        this.PageNo += 1;
        if(this.PageNo > 1){
		    this.summaryList(this.token,this.SearchBy,this.SearchText,this.PageNo,this.SortBy,this.SortOrder);
        }
    }
    
    dropClick(uniqueID: any, arr: any) {
        arr.forEach((element: any, ind: any) => {
			if (uniqueID !== element.ClientCode) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
				if (element['isVisible']) {
					setTimeout(() => {
						this.detailHeight = this.detail.nativeElement.offsetHeight;
                        // console.log('height= ' + this.detailHeight);
					}, 100);
				}
			}
		});
    }

    styleFunc(isVisible: any,height: any){
       return isVisible ? '' + (height + 10) + 'px': '';
    }
    
    async AddRemark(i: any, clientCode: any, checkStatus: any, partnerRemark: any) {
		const modal = await this.modalController.create({
			component: ClientSummaryRemarksComponent,
			componentProps: { "Index": i, "clientCode":clientCode, "checkbox":checkStatus, "Remark":partnerRemark},
			cssClass: 'superstars addRemark'
        });
        modal.onDidDismiss().then((data) => {
        //    console.log(data);
           if(data['data']['passData'] === 1){
            const receiveData = data['data']['passData'];
            // this.summaryDetails[receiveData['rowIndex']].PartnerRemarks =  receiveData['selectRemark'];
            // this.summaryDetails[receiveData['rowIndex']].HoldCheck =  receiveData['holdSellCheck'];
            this.initClientSummary();
           }
           else{
         
           }
          
		})
		return modal.present();
	
    }
    
    /**
     * To download pdf/excel icon.
     */
    onPdfExcelDownload(fileType: string, fileData: any) {
        this.commonService.setClevertapEvent('Riskreport_ClientSummary', { 'PartnerCode': localStorage.getItem('userId1') });
        if (fileData && fileData.length > 0) {
            let info: any = [];
            let head = [["Client Code", "Client Branch", "Client Category", "AGHVC", "ALB", "BMFD", "MarginAHV", "MarginGHV", "MarginTHV",  "HoRemarks", "NetWorth", "Span", "THV", "Unclearedcheq", "Undelivered", "HoRemarks", "Partner Remarks"]];
            fileData.forEach((element: any) => {
                info.push([element.ClientCode, element.ClientBranch, element.ClientCategory, element.AGHVC, element.ALB, element.BMFD, element.MarginAHV, element.MarginGHV, element.MarginTHV, element.HoRemarks, element.NetWorth, element.Span, element.THV, element.Unclearedcheq, element.Undelivered, element.HoRemarks, element.PartnerRemarks])
            })
            if (fileType === 'pdf') {
                this.commonService.savePdfFile(head, info);
                this.fileLoad = false;
            } else {
                this.commonService.exportDataToExcel(head[0], info, 'Client Summary');
                this.fileLoad = false;
            }
        } else {
            this.toast.displayToast('No Data Found');
        }
    }

    onScrollData(n: any){
        this.datas = [];
        this.summList = [];
        this.summList = this.clonedArr.slice(0, this.pageLimit*n);
        this.scrollLoad = false;
        this.summList.forEach((ele: any) => {
            let pRemarks = ele.PartnerRemarks != "" ? this.remarkList.find(obj => obj.remarkCode === ele.PartnerRemarks) : undefined;
            this.datas.push({
                HoRemarks: ele.HoRemarks,
                ClientCode: ele.ClientCode,
                ClientBranch: ele.ClientBranch,
                ClientCategory: ele.ClientCategory,
                AGHVC: ele.AGHVC,
                ALB: ele.ALB,
                Unclearedcheq: ele.Unclearedcheq,
                Undelivered: ele.Undelivered,
                THV: ele.THV,
                Span: ele.Span,
                BMFD: ele.BMFD,
                NBFCTHV: ele.NBFCTHV,
                NBFCTHVC: ele.NBFCTHVC,
                MarginTHV: ele.MarginTHV,
                MarginAHV: ele.MarginAHV,
                MarginGHV: ele.MarginGHV,
                HoldBlockSell: ele.HoldBlockSell,
                NetWorth: ele.NetWorth,
                PartnerRemarks: ele.PartnerRemarks,
                ToSave: ele.PartnerRemarks ? false : true,
                BranchRemarkID: pRemarks && pRemarks.BranchRemarkID ? pRemarks.BranchRemarkID : undefined,
                toggleStatus: pRemarks && pRemarks.BranchRemarkID ? true : false,
            })
        })
    }

    /**
     * To load data on page scroll
     * @param event 
     */
    public loadData(event: any) {
        this.scrollLoad = true;
        setTimeout(() => {
            event.target.complete();
            if (this.scrollTimes > 0) {
                this.PageNo += 1;
                this.scrollTimes -=1;
                this.onScrollData(this.PageNo);
            } else {
                event.target.disabled = true
                this.scrollLoad = false;
            };
        }, 100);
    }
}
