import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import * as moment from 'moment';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { StatusRequestComponent } from '../status-request/status-request.component';

@Component({
    selector: 'app-limit-request-status',
    providers: [WireRequestService],
    templateUrl: './limit-request-status.component.html',
    styleUrls: ['./limit-request-status.component.scss'],
})
export class LimitRequestStatusPage implements OnInit, OnChanges {
    @Input() limitReqStatusObj: any;
    public detailHeight!: number;
    reverse: boolean = false;
    order: string = 'clientName';
    ascending: boolean = true;
    public dataLoad: boolean = false;
    clientcodeSearch:string = '';
    applyLimitReqPage:boolean = false;
    searchCode:any;
  
    limitstatusDetails:any = [];
    resetLimitStatus:any = [];
    clientCodeList:any = [];
    moment: any = moment;
    public val: string = 'asc';


    constructor(private modalController: ModalController, private router: Router, 
        private storage: StorageServiceAAA, private wireReqService: WireRequestService, private commonService:CommonService, private platform: Platform) { }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
            this.limitReqStatusObj = this.commonService.getData() ? this.commonService.getData() : this.limitReqStatusObj;
            if (this.limitReqStatusObj === undefined) {
                this.dataLoad = true;
            }
            else {
                this.applyLimitReqPage = false;
                this.initLimitRequest();
            }

        }
    }
    ngOnInit() {
        this.limitReqStatusObj = this.commonService.getData() ? this.commonService.getData() : this.limitReqStatusObj;
        if (this.platform.is('mobile') && !(this.limitReqStatusObj && this.limitReqStatusObj.isDesktopCall)) {
            if (this.limitReqStatusObj) {
                this.initLimitRequest();
            }
        }
    }

    // coming soon popup when click donwload option
    comingOption(event: any) {
        this.commonService.comingSoon(event, 'Coming Soon', 'coming')
    }

    initLimitRequest(){
        this.limitstatusDetails = [];
        this.dataLoad = false;
        this.storage.get('userID').then((userID) => {
            this.storage.get('userType').then(type => {
                if (type === 'RM' || type === 'FAN') {
                    this.storage.get('bToken').then(token => {
                        this.limitReqList(token,userID)
                    })
                } else {
                    this.storage.get('subToken').then(token => {
                        this.limitReqList(token,userID)
                    })
                }
            })
		})
      
    }

    // display details function
    dropClick(uniqueID: any, arr: any) {
        arr.forEach((element: any, ind: any) => {
			if (uniqueID !== element.ClientCode) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
		
			}
		});
		// console.log(arr);
	}

    limitReqList(token: any, userId: any){
        // console.log(this.limitReqStatusObj);
        let caseId = 0;
        this.wireReqService.getLimitReqStatus(token, caseId, this.limitReqStatusObj, userId).subscribe((res: any) => {
            if(res['Head']['ErrorCode'] == 0){
                if(res['Body']['LimitDetails'].length > 0){
                    this.limitstatusDetails = res['Body']['LimitDetails'];
                    this.resetLimitStatus = res['Body']['LimitDetails']
                    // console.log(this.limitstatusDetails);
                }
                else{
                    this.applyLimitReqPage = true;     
                }
                setTimeout(() => {
                    this.dataLoad = true;
                }, 500);
            }
            else{
                this.applyLimitReqPage = true;   
                setTimeout(() => {
                    this.dataLoad = true;
                }, 500);
            }
        })
    }
    
    changeDataFormat(dateValue: any){
        let monthName: any = ["Jan","Feb","Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var date;
        return dateValue.substring(6,8)+' '+ monthName[parseInt(dateValue.substring(4,6))]+' '+dateValue.substring(0,4)
    }

    filterClientCode(event: any){
        // console.log(event);
        if(event.length > 0){
            this.limitstatusDetails = this.limitstatusDetails.filter((item: any) => {
                return item.ClientCode.toLowerCase().includes(event.toLowerCase());

            });
        }
        else{
            this.limitstatusDetails = this.resetLimitStatus 
        }
    }
  

    // sorting function for column
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

    async cancelRequest() {
        const modal = await this.modalController.create({
            component: StatusRequestComponent,
            cssClass: 'superstars cancel-request',
            componentProps: {
                "title":"Cancel Request",
                "msgContent": "To cancel request kindly contact RMS",
                "buttonVisibility": false
            }
        })
        return await modal.present();
    }
    goBack() {
        window.history.back()
    }
    
    goToCreateRequest(){
        if (!this.platform.is('mobile')) {
            this.router.navigate(['/wire-requests',"limit-change"]);	
        }
		else{
			this.router.navigate(['limit-insert']);
		}
    }

    

}
