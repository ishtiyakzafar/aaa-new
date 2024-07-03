import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform} from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';

@Component({
    selector: 'app-mutual-fund',
    templateUrl: './mutual-fund.component.html',
    styleUrls: ['./mutual-fund.component.scss'],
})
export class MutualFundComponent implements OnInit {
    public passClientID!: string;
    public holdingsBlockTabValue: string = 'holdings';
    public segmentObj: any[] = [
        {name: 'Holdings', value: 'holdings'},
        {name: 'SIP Registration Book', value: 'sipRegisBook'},
        {name: 'Order Book', value: 'orderBook'},
        {name: 'Account Statement', value: 'accountStatement'},
    ]
    device:any
    constructor(private platform: Platform,
        public commonService: CommonService,
        private route: ActivatedRoute) {
        if (this.platform.is('desktop')) {
			this.device = 'desktop';
		}
		if (this.platform.is('mobile')) {
			this.device = 'mobile';
		}
     }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.passClientID = params['id'];
            /* this.clientCode =	params['id'];
            params['id1'] ? this.clientName =	params['id1'].split('-').join(' ') : this.clientName = '-';
            this.financialYrList =  this.getFinancialYearList(this.getCurrentFinancialYear().split('-')[0],this.getCurrentFinancialYear().split('-')[1])
       
            this.yearRangeValue  = this.financialYrList[0] */
           });
    }

    goBack() {
        window.history.back();
    }

    mfSegmentChange(event: any){
        localStorage.removeItem('setCheckBox')
    }

    mutual_fund_tab(type: any){
        if (type == 'sipRegisBook') {
			this.commonService.setClevertapEvent('Trades SIP registration book', { 'Login ID': localStorage.getItem('userId1') });
		} else if (type == 'orderBook') {
			this.commonService.setClevertapEvent('Trades orderbook', { 'Login ID': localStorage.getItem('userId1') });
		} else if (type == 'accountStatement') {
			this.commonService.setClevertapEvent('Trades Account Statement', { 'Login ID': localStorage.getItem('userId1') });
		}
    }

}
