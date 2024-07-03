import { Component, OnInit } from '@angular/core';
import { MutualFundService } from '../../components/mutual-fund/mutual-fund.service';
import moment from 'moment';
import { Platform, ModalController } from '@ionic/angular';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
    selector: 'app-sip-registration-book',
    providers: [ MutualFundService ],
    templateUrl: './sip-registration-book.component.html',
    styleUrls: ['./sip-registration-book.component.scss'],
})
export class SipRegistrationBookComponent implements OnInit {
    public dataLoad!: boolean;
    public detailHeight!: number;
    public tabValue: string = 'activeSip';
    public allBlockTabValue: string = 'all';
    device:any;
    public tabOptions: any[] = [
        {name: 'Active SIP', value: 'activeSip'},
        {name: 'Inactive SIP', value: 'inactiveSip'},
    ]
    searchCode:any;
    public details: any[] = [];
    sipRegList:any[] = [];
    resetRegList:any[] = [];
    constructor(private mutualFundSer:MutualFundService, private storage: StorageServiceAAA, private platform: Platform) { 
        
        if (this.platform.is('desktop')) {
            this.device = 'desktop';
        }
        if (this.platform.is('mobile')) {
            this.device = 'mobile';
        }
    }

    ngOnInit() {
        let today = moment(new Date(), "M/D/YYYY H:mm").valueOf();
        let previousDate = moment(new Date().setFullYear(new Date().getFullYear() - 1)).valueOf();
        this.dataLoad = false
        this.storage.get('userID').then((userID) => {
            this.storage.get('userType').then(type => {
                let clientCode = JSON.parse(localStorage.getItem('select_client') || "{}")['ClientCode']
                    this.mutualFundSer.getSipRegistraBook(previousDate,today, userID,type,clientCode).subscribe((res: any) => {
                        this.dataLoad = true;
                        if(res['Status'] == 0){
                            if(res['lstOrderDetail'].length > 0){
                                this.sipRegList = res['lstOrderDetail'];
                                this.resetRegList = res['lstOrderDetail']
                                this.sipRegList = this.sipRegList.filter(function (el) {
                                    return el.Status == "Accepted"
                                });
                            }
                            else{
                                this.sipRegList = [];  
                            }

                        }
                })
            })
        })    
     
        // this.details = this.detailsActive;
       
     }

     getCatagoty(status: any){
        this.sipRegList = this.resetRegList
        if(status ==  'active'){
            this.sipRegList = this.sipRegList.filter(function (el) {
                return el.Status == "Accepted"
            });
        }
        else{
            this.sipRegList = this.sipRegList.filter(function (el) {
                return el.Status != "Accepted"
            });
        }
       
     }

    segmentChange(ev: any) {
        //this.dataLoad = false;
        this.searchCode = "";
        if (ev['detail']['value'] === 'activeSip') {
            this.getCatagoty('active')
           // this.details = this.detailsActive;
        } else {
            this.getCatagoty('inactive')
           // this.details = this.detailsInactive;
        }
        // setTimeout(() => {
        //     this.dataLoad = true;
        // }, 1000);
        // console.log(ev['detail']['value']);
    }

    dropClick(index: any, arr: any) {
		// event.preventDefault();
		arr.forEach((element: any, ind: any) => {
			if (index !== ind) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
				if (element['isVisible']) {
					setTimeout(() => {
						// this.detailHeight = this.detail.nativeElement.offsetHeight;
						// console.log('height= ' + this.detailHeight);
					}, 100);
				}
			}
		});
    }
    
    splitStatus(status: any){
        return status.split(' ')[0];
    }

}
