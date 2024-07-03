import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-sip-book',
	templateUrl: './sip-book.component.html',
	styleUrls: ['./sip-book.component.scss'],
})
export class SipBookComponent implements OnInit {
	@ViewChild('dognutChart') dognutChart: any;
	@Input() sipBookTabData: any;
	public clientCode = null;
    public searchTerm = null;
    public placeholderInput: string = 'Type Client Code';
	public liveBlockTabValue: any = 'liveSips';
	public dognut: any;
	public sipBlock: any[] = [
		// { name: 'Live SIPs', value: 'liveSips', time: '', sips: '159', dataValue: '40.23K', page: 'sip-live'},
		// { name: 'New SIPs', value: 'newSips',  time: 'In July 2020', sips: '23', dataValue: '80.23K', page: 'sip-new'},
		// { name: 'Bounced SIPs', value: 'bouncedSips',  time: 'In Last 60 Days', sips: '23', dataValue: '80.23K', page: 'sip-bounced'},
		// { name: 'Ceased SIPs', value: 'ceasedSips',  time: 'In Last 60 Days', sips: '23', dataValue: '80.23K', page: 'sip-ceased'}
    ]
    public clientBlockSegmentValue: string = "clientCode";
    public segmentButtonOption: any[] = [
        {name: 'Client Code', value: 'clientCode'},
        {name: 'Name', value: 'clientName'}
    ]

	constructor(private router: Router,
		private commonService: CommonService,
		private storage: StorageServiceAAA) { }

	ngOnInit() {
		this.commonService.eventObservable.subscribe((obj) => {
			if (obj && obj['event'] === 'sipEvent') {
				// this.clientCode = obj['data']['clientCode'];
				const params = {
					code: obj['data']['clientCode'],
					data: obj['data']['value'],
				}
				this.setData(params);
			}
		})
		const event: any = {
			detail: {
				value: 'liveSips',
				clientCode: this.clientCode
			}
		}
		this.commonService.setData(event);
		this.sipBlock = this.sipBookTabData;
	}

    segmentChange() {
		if (this.clientBlockSegmentValue === 'clientName') {
			this.placeholderInput = 'Type Name';
		} else {
			this.placeholderInput = 'Type Client Code';
		}
	}

	public setData(obj: any) {
		this.clientCode = obj['clientCode'];
		this.sipBookTabData = [];
		this.sipBookTabData = obj['data'];
		this.sipBlock = this.sipBookTabData;
	}

	ngOnChanges() {
		const newData = this.sipBookTabData;
		this.sipBookTabData = newData;
		const params = {
			code: this.clientCode,
			data: this.sipBookTabData
		}
		this.setData(params);
	}

	public searchText() {
		const obj = {
			SearchText: this.searchTerm,
			SearchBy: this.clientBlockSegmentValue,
			page: 1
		}
		this.commonService.setEvent(this.liveBlockTabValue+'SearchText', obj);
		/* if (this.searchTerm.length > 2) {
			return;
		} else {
			this.commonService.setEvent(this.liveBlockTabValue+'SearchText', obj);
		} */
	}

	public onSegmentChanged(event: any) {
		this.searchTerm = null;
		this.storage.get('empCode').then( code => {
			const obj: any = {
				clientCode: code,
				value: event['detail']['value']
			}
			this.commonService.setData(obj);
		})
	}

	goToPage(page: any) {
		if (page) {
			this.router.navigate(['/' + page]);
		} else {
			return;
		}
	}

}
