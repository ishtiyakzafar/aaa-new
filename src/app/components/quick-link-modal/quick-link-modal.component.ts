import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { CommonService } from '../../helpers/common.service';


@Component({
	selector: 'app-quick-link-modal',
	providers: [DashBoardService],
	templateUrl: './quick-link-modal.component.html',
	styleUrl: './quick-link-modal.component.scss'
})
export class QuickLinkModalComponent implements OnInit {
	constructor(private modalController: ModalController, private commonService: CommonService, private dashBoardService: DashBoardService, private storage: StorageServiceAAA, private toast: ToasterService) { }
	tokenValue: any;
	searchValue: any;
	addedLinks: any[] = [];
	allLinks: any[] = [];
	allLinksCpy: any[] = [];
	listLoad: boolean = false;
	selectedLinks: any[] = [];
	srchTxt: any = 'ALL';
	srchBy: any = 'LinkName';
	addNum: any = 6;
	public isDropDownVisible: boolean = false;
	public dataLoad: boolean = false;

	ngOnInit() {
		this.fetchQuickLinks();
	}

	fetchQuickLinks() {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.tokenValue = token;
					this.getSelectedLink(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
					this.getSelectedLink(token);
				})
			}
		})
	}

	getSelectedLink(token: any) {
		let data = {
			"PartnerCode": localStorage.getItem('userId1'),
			"Type": "Selected",
			"Search_By": '',
			"Search_Text": ''
		}
		this.dashBoardService
			.getQuickLinks(token, data)
			.subscribe((res: any) => {
				if (res["Head"]["ErrorCode"] == 0) {
					if (res["Body"] && res["Body"].length >0) {
						this.addedLinks = res["Body"];
						this.getUnselectedLink(token);
					}
					this.dataLoad = true;
				} else if (res["Head"]["ErrorCode"] == 1) {
					this.addedLinks = []
					this.dataLoad = true;
					this.getUnselectedLink(token);
				}
			});
	}

	getUnselectedLink(token: any) {
		let data = {
			"PartnerCode": localStorage.getItem('userId1'),
			"Type": "Unselected",
			"Search_By": this.srchBy,
			"Search_Text": this.srchTxt
		}
		this.dashBoardService
			.getQuickLinks(token, data)
			.subscribe((res: any) => {
				if (res["Head"]["ErrorCode"] == 0) {
					this.allLinks = res["Body"];
					if (this.addedLinks && this.selectedLinks && ((this.selectedLinks.length + this.addedLinks.length) > 5)) {
					this.allLinks = this.allLinks.map((element) => {
						return {
								ID:element.ID,
								Link:element.Link,
								LinkName:element.LinkName,
								Checked: element.Checked,
								disable:true
							}
					});
				}
					this.allLinksCpy = res["Body"];
					this.listLoad = true;
				} else if (res["Head"]["ErrorCode"] == 1) {
					this.allLinks = [];
					this.allLinksCpy = [];
					this.listLoad = true;
				}
			});
	}
	showDropDown() {
		this.isDropDownVisible = true;
		this.dataLoad = true;
	}

	hideDropDown() {
		// setTimeout(() => {
		// 	this.isDropDownVisible = false;
		// }, 500);
	}

	overlayClicked(event: any) {
		event.preventDefault();
		this.isDropDownVisible = false;
	}
	onCheck(event: any, data: any) {
		if (event.target.checked) {
			this.selectedLinks.push(data);
			if (this.addedLinks && this.selectedLinks && ((this.selectedLinks.length + this.addedLinks.length) > 5)) {
				this.allLinks = this.allLinks.map((element) => {
					return {
							ID:element.ID,
							Link:element.Link,
							LinkName:element.LinkName,
							Checked: element.Checked ? true :false,
							disable:element.Checked ? false :true
						}
				});
			}
		} else {
			let removeIndex = this.selectedLinks.findIndex((itm: any) => itm.ID === data.ID);
			if (removeIndex !== -1){
				this.selectedLinks.splice(removeIndex, 1);
			}
			if (this.addedLinks && this.selectedLinks && ((this.selectedLinks.length + this.addedLinks.length) >= 5)) {
				this.allLinks = this.allLinks.map((element) => {
					return {
							ID:element.ID,
							Link:element.Link,
							LinkName:element.LinkName,
							Checked: element.Checked,
							disable:false
						}
				});
			}
				
		}
	}

	addRemoveLink(action: string, value?: any) {
		let data: any;
		this.isDropDownVisible = false;
		if (action === 'ADD') {
			if (this.addedLinks && this.selectedLinks && ((this.selectedLinks.length + this.addedLinks.length) > 6)) {
				this.commonService.setClevertapEvent('AddQuickLink_Clicked', { 'Login ID': localStorage.getItem('userId1') });
				this.toast.displayToast('Please remove one of the existing Quick links to add more');
				return;
			}
			if(this.selectedLinks && this.selectedLinks.length>0){
				this.addedLinks = this.selectedLinks.map((element) => {
					return {
						PartnerCode: localStorage.getItem('userId1'),
						ID: element['ID'],
						Action: action
					}
				});
				data = this.addedLinks;
			}
		} else {
			data = [{
				"PartnerCode": localStorage.getItem('userId1'),
				"ID": value['ID'],
				"Action": action
			}];
		}
		if (data && data[0]?.ID) {
			this.dashBoardService
				.addQuickLinks(this.tokenValue, data)
				.subscribe((res: any) => {
					if (res["Head"]["ErrorCode"] == 0) {
						this.toast.displayToast(res["Head"]["ErrorDescription"]);
					} else {
						this.toast.displayToast(res["Head"]["ErrorDescription"]);
					}
					this.selectedLinks = [];
					this.fetchQuickLinks();
				});
		} else {
			this.toast.displayToast('Please select quick link');
				this.selectedLinks = [];
				this.fetchQuickLinks();
		}
	}

	searchText(value: any) {
		if (value != null && value.trim().length > 2) {
			this.searchValue = value.trim();
			this.allLinks = this.allLinksCpy.filter((item: any) => {
				return item.LinkName.toLowerCase().includes(this.searchValue.toLowerCase());
			});
		} else {
			this.selectedLinks = [];		 
			this.allLinks = this.allLinksCpy.map((element) => {
				return {
					ID:element.ID,
					Link:element.Link,
					LinkName:element.LinkName,
					Checked: false
				}
			});
		}
	}

	dismiss() {
		this.modalController.dismiss();
	}
}