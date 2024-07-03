import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Platform } from "@ionic/angular";
import moment from "moment";
import { StorageServiceAAA } from "../../helpers/aaa-storage.service";
import { ToasterService } from "../../helpers/toaster.service";
import { WireRequestService } from "../../pages/wire-requests/wire-requests.service";
import { CommonService } from "../../helpers/common.service";

@Component({
    selector : 'app-dp-modification-details',
    templateUrl : './dp-modification-details.component.html',
    styleUrls : ['./dp-modification-details.component.scss']
})
export class DpModificationDetailsComponent implements OnChanges, OnInit {

    @Input() fromDate: any;
    @Input() toDate: any;
    @Input() dpType!: string;
    public ascending!: boolean;
	public dataLoad = true;
	public order: any;
	reverse: boolean = false;
    searchValue!: string;
    dpModificationDetailsList: any = [];
    dpModificationDetailsListCopy: any = [];
    collapsed: boolean[] = [];
    public moment: any = moment;
    previousIndex!: number;
    public val: string = 'asc';

    constructor(private storage: StorageServiceAAA, 
        private platform: Platform, 
        private toast: ToasterService,
        private wireReqService: WireRequestService,
        public commonService: CommonService)
    {  }
    
    ngOnInit(): void {

        let dpModificationData: any = this.commonService.getData();

        if(dpModificationData.fromDate && dpModificationData.toDate && dpModificationData.dpType){

            this.fromDate = dpModificationData.fromDate;
            this.toDate = dpModificationData.toDate;
            this.dpType = dpModificationData.dpType;
            this.getDpModificationDetails();
        }
    }
    
    ngOnChanges(): void {

        if(this.platform.is('desktop') || (this.fromDate && this.toDate && this.dpType)){
           
            this.getDpModificationDetails();
        }
    }

    getDpModificationDetails = () => {
        this.dataLoad = true;
        this.searchValue = '';
        this.storage.get('userID').then((userId) => {
            this.storage.get('userType').then(type => {
                if (type === 'RM' || type === 'FAN') {
                    this.storage.get('bToken').then(token => {

                        this.storage.get('cookieValue').then(cookie => {
                            if(cookie){
                                this.callDpModificationDetails(`${token};${cookie.split(';')[0]}`, userId);
                            }
                        })
                    })
                } else {
                    this.storage.get('subToken').then(token => {

                        this.storage.get('cookieValue').then(cookie => {
                            this.callDpModificationDetails(`${token};${cookie.split(';')[0]}`, userId);
                        })
                    });
                }
            })
        });
    }

    callDpModificationDetails = (token: any, userId: any) => {
        this.commonService.setClevertapEvent('DP_Modification_Clicked/download', { 'Login ID': localStorage.getItem('userId1') });
        
        this.dpModificationDetailsList = [];
        this.dpModificationDetailsListCopy = [];
        
        this.wireReqService.getDpModificationReport(token,userId,this.dpType,this.fromDate,this.toDate).subscribe( (res: any) => {
            if(res['Head']['ErrorCode'] == 0){
                
                if(res['Body'].length > 0){

                    this.dpModificationDetailsList = res['Body'];

                    this.dpModificationDetailsList.forEach((e: any) => {
                        e.InwardMkrDate = new Date(e.InwardMkrDate);
                        e.DpStatusUpdateDate = new Date(e.DpStatusUpdateDate);
                    });
                    this.dpModificationDetailsListCopy = this.dpModificationDetailsList;
                }
            } else{

                this.toast.displayToast(res['Head']['ErrorDescription']);
            }
            this.dataLoad = false;
        }, (error) => { 
            this.dataLoad = false;
            this.toast.displayToast("Unable to fetch DP Modifiction Details");
        });
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

    onCollapse(i: any) {
        
        if(this.previousIndex === i){
            this.collapsed[i] = !this.collapsed[i];
        } else {
            this.collapsed[this.previousIndex] = false;// null;     review
            this.collapsed[i] = !this.collapsed[i];
            this.previousIndex = i;
        }
    }

    public searchText(txt: any) {
        if (txt) {
            this.searchValue = txt.trim();
            this.dpModificationDetailsList = this.dpModificationDetailsListCopy.filter((item: any) => {
                return item.LoginId.toLowerCase().includes(this.searchValue.toLowerCase()) || item.DematAcc.toLowerCase().includes(this.searchValue.toLowerCase());
             });
        }
        else {
          this.dpModificationDetailsList = this.dpModificationDetailsListCopy;
        }
      }
    /**
     * On click of pdf/excel icon
     */
    onPdfExcelDownload(type: any) {
        this.commonService.setClevertapEvent('Summaries_DPModification', { 'Login ID': localStorage.getItem('userId1') });
        this.commonService.setClevertapEvent('DP_Modification_Clicked/download', { 'Login ID': localStorage.getItem('userId1') });
        if (this.dpModificationDetailsList && this.dpModificationDetailsList.length > 0) {
            this.dataLoad = true;
            let info: any = [];
            let head = [["Client Code", "Demat Acccount", "Group Code", "Document Type", "DP Type", "Inward Maker Id", "Inward Maker Date", "Dp Status", "Dp Status Update Date", "Dp Rejection Reason", "Dp Status Maker Id"]];
            
            this.dpModificationDetailsList.sort((a: any,b: any) => { return Date.parse(b.InwardMkrDate) - Date.parse(a.InwardMkrDate)});
            this.setOrder('InwardMkrDate');
            this.dpModificationDetailsList.forEach((element: any) => {
                info.push([element.LoginId, element.DematAcc, element.GroupCode, element.DocumnetType,element.DPType,element.InwardMkrId, moment(element.InwardMkrDate).format('DD/MM/YYYY'), element.DpStatus, moment(element.DpStatusUpdateDate).format('DD/MM/YYYY'), element.DpRejectionReason, element.DpStatusMkrId]);            });
            if (type === 'pdf') {
                this.commonService.savePdfFile(head, info);
                this.dataLoad = false;
            } else {
                this.commonService.exportDataToExcel(head[0], info, 'DP Modification');
                this.dataLoad = false;
            }
        } else {
            this.toast.displayToast('No Data Found');
        }
    }

    goBack() {
        window.history.back();
    }
}
    
