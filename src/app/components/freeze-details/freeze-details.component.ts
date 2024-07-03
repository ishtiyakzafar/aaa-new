import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Platform } from "@ionic/angular";
import { StorageServiceAAA } from "../../helpers/aaa-storage.service";
import { ToasterService } from "../../helpers/toaster.service";
import { WireRequestService } from "../../pages/wire-requests/wire-requests.service";
import { CommonService } from "../../helpers/common.service";
import moment from 'moment';

@Component({
    selector : 'app-freeze-details',
    templateUrl : './freeze-details.component.html',
    styleUrls : ['./freeze-details.component.scss']
})
export class FreezeDetailsComponent implements OnChanges, OnInit {
    
    @Input() freezeReason: any = null;
    @Input() callFromDesktop: boolean = false;
    freezeDeatilsList: any = [];
    freezeDeatilsListCopy: any = [];
    public ascending!: boolean;
	public dataLoad = false;
	public order: any;
	reverse: boolean = false;
    searchValue!: string;
    public val: string = 'asc';

    constructor(private storage: StorageServiceAAA, 
        private platform: Platform, 
        private toast: ToasterService,
        private wireReqService: WireRequestService,
        public commonService: CommonService)
    {  }

    ngOnInit(): void {

        this.freezeReason = this.commonService.getData();
        if(this.freezeReason && this.freezeReason.toString() == localStorage.getItem("userId1")?.toString()){
            this.freezeReason = undefined;
            return;
        }
        if(!this.callFromDesktop && (this.freezeReason !== null && this.freezeReason !== undefined)){ 
            this.searchValue = "";//null;
            this.getFreezeDetails();
        }
    }

    ngOnChanges(): void {
        
        if(this.callFromDesktop && (this.freezeReason !== null && this.freezeReason !== undefined)){
            this.searchValue = "";// null;
            this.getFreezeDetails();
        } else {
            // mobile view
        }
        
    }

    getFreezeDetails = () => {
        this.dataLoad = true;
        this.storage.get('userID').then((userId) => {
            this.storage.get('userType').then(type => {
                if (type === 'RM' || type === 'FAN') {
                    this.storage.get('bToken').then(token => {
                        this.callFreezeDeatilsAPI(token,userId)
                    })
                } else {
                    this.storage.get('subToken').then(token => {
                        this.callFreezeDeatilsAPI(token,userId)
                    })
                }
            })
        });
    }

    callFreezeDeatilsAPI = (token: any, userId: any) => {

        this.freezeDeatilsList = [];
        this.freezeDeatilsListCopy = [];
        this.wireReqService.getFreezeDetails(token,this.freezeReason, userId).subscribe({
            next: (res:any)=> { 

                if(res['Head']['ErrorCode'] == 0){
                                    
                    if(res['Body'].length > 0){

                        this.freezeDeatilsList = res['Body'];
                        this.freezeDeatilsListCopy = res['Body'];
                    }
                } else{

                    this.toast.displayToast(res['Head']['ErrorDescription']);
                }
                this.dataLoad = false;
            },
            error: (err: any) => {
                this.dataLoad = false;
                this.toast.displayToast("Unable to fetch Freeze Details");
             }
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

    formatChange(date: any){
        return moment(date).format('DD/MM/YYYY');
      }

    public searchText(txt: any) {

        this.dataLoad = true;
        if (txt) {
            this.searchValue = txt.trim();
            this.freezeDeatilsList = this.freezeDeatilsListCopy.filter((item: any) => {
                return item.Clientcode.toLowerCase().includes(this.searchValue.toLowerCase());
            });
        }
        else {
          this.freezeDeatilsList = this.freezeDeatilsListCopy;
        }
        this.dataLoad = false;
    }

    /**
     * On click of pdf/excel icon
     */
    onPdfExcelDownload(type: any) {
        this.commonService.setClevertapEvent('Summaries_freezedetails', { 'Login ID': localStorage.getItem('userId1') });
        if (this.freezeDeatilsList && this.freezeDeatilsList.length > 0) {
            this.dataLoad = true;
            let info: any = [];
            let head = [["Client Code", "Freeze Reason", "Freeze Date", "Group Code"]];
            this.freezeDeatilsList.forEach((element: any) => {
                info.push([element.Clientcode, element.FreezeReason, `${element.FreezeDate.slice(0,4)}/${element.FreezeDate.slice(4,6)}/${element.FreezeDate.slice(6,8)}`, element.wirecode]);
            });
            if (type === 'pdf') {
                this.commonService.savePdfFile(head, info);
                this.dataLoad = false;
            } else {
                this.commonService.exportDataToExcel(head[0], info, 'Freeze Details');
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