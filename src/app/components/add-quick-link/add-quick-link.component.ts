import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QuickLinkModalComponent } from '../quick-link-modal/quick-link-modal.component';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { Router } from '@angular/router';
import { InvestService } from '../../pages/invest/invest.service';
import { CommonService } from '../../helpers/common.service';

@Component({
	selector: 'app-add-quick-link',
	templateUrl: './add-quick-link.component.html',
	styleUrl: './add-quick-link.component.scss'
})
export class AddQuickLinkComponent implements OnInit, OnChanges {
	qckList: any[] = [];
	tokenValue: any;
	@Input() showQuickLink:any;
	constructor(public modalController: ModalController, private storage: StorageServiceAAA, private dashBoardService: DashBoardService, private router: Router, private investService:InvestService,private commonService:CommonService) { }

	ngOnChanges(): void {
		this.fetchQuickLinks();
	}

	ngOnInit() {
	}

	fetchQuickLinks() {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tokenValue = token;
					this.quickLinkList(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					this.quickLinkList(token);
				})
			}
		})
	}

	quickLinkList(token: any) {
		let data = {
			"PartnerCode": localStorage.getItem('userId1'),
			"Type": "Selected",
			"Search_By": "",
			"Search_Text": ""
		}
		this.dashBoardService
			.getQuickLinks(token, data)
			.subscribe((res: any) => {
				if (res["Head"]["ErrorCode"] == 0) {
					this.qckList = res["Body"];
				} else if (res["Head"]["ErrorCode"] == 1) {
					this.qckList = []
				}
			});
	}

	navigateLinks(url: string, name: string) {
		if (url.includes('http://') || url.includes('https://')) {
			if (name == 'ACE BackOffice') {
				this.commonService.navigateToACEBackOffice();
			} else if (name == 'Mutual Funds') {
				this.investService.mutualFund('SIP');
				this.commonService.setClevertapEvent('Invest_MF_StartSIP');
			} else if (name == 'Image Branding') {
				this.commonService.navigateToImageBrading();
			} else {
				window.open(url);
			}
		} else {
			if (name == 'Insurance') {
				this.investService.insuranceLinks('web');
			} else if (name == 'InvestEdge') {
				this.investService.investEdgeLink();
			} else {
				this.router.navigateByUrl(url);
			}
		}
	}

	async displyPopupManageQuickLink() {
		this.commonService.setClevertapEvent('ManageLinks_Clicked', { 'Login ID': localStorage.getItem('userId1') });
		
		const modal = await this.modalController.create({
			component: QuickLinkModalComponent,
			cssClass: 'quick-link-modal',
			backdropDismiss: true
		});
		modal.onDidDismiss()
			.then((data: any) => {
				if (data) {
					this.fetchQuickLinks();
				}
			});
		return (await modal).present();
	}
}