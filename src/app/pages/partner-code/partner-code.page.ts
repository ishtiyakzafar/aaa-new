import { Component, OnInit } from '@angular/core';
import { Subscription, from } from 'rxjs';
import { LoginService } from '../../pages/login/login.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-partner-code',
	providers: [LoginService],
	templateUrl: './partner-code.page.html',
	styleUrls: ['./partner-code.page.scss'],
})
export class PartnerCodePage implements OnInit {
	public partnerName!: string;
	public partnerCode!: string;
	public detailVisibility: boolean = false;
	public details: any[] = [];
	clientSearchValue: any;
	clientSerchName: any;
	public isDropDownVisible: boolean = false;
	clientList: any[] = []
	private subscription = new Subscription();
	dataLoad: boolean = true
	showDetails: boolean = false;
	partnerCodes: any
	partnerEmail: any
	ClientMobileNo: any
	constructor(private storage: StorageServiceAAA, private loginService: LoginService) { }

	ngOnInit() {
		this.storage.get('userType').then(type => {
			if (type == 'RM' || type == 'FAN') {
				this.storage.get('mappingDetails').then((details) => {
					this.clientList = details;
				});
			}
			else {
				this.storage.get('subBrokermapping').then((details) => {
					this.clientList = details;
				});
			}

		})
	}

	goBack() {
		window.history.back();
	}

	searchFilter() {
		this.detailVisibility = true;
	}

	showDropDown() {
		this.isDropDownVisible = true;
		this.clientSearchValue = '';
		this.showDetails = false;
	}

	hideDropDown() {
		setTimeout(() => {
			this.isDropDownVisible = false;
			this.showDetails = true;
		}, 200);
	}

	displayClientDetails(data: any) {
		this.dataLoad = false;
		this.clientSearchValue = data['ClientCode'];
		this.clientSerchName = data['ClientName']

		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.showProfile(type, token, this.clientSearchValue, this.clientSerchName)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.showProfile(type, token, this.clientSearchValue, this.clientSerchName)
				})
			}
		})

	}

	showProfile(userType: any, tokenValue: any, userCode: any, userName: any) {
		this.subscription = new Subscription();
		const params = {
			UserCode: userCode,
			UserType: 4
		}

		this.subscription.add(
			this.loginService
				.getRMProfile(params, tokenValue)
				.subscribe((response: any) => {
					this.dataLoad = true;
					this.showDetails = true
					// console.log(response);
					if (response['Head']['ErrorCode'] == 0) {

						this.partnerName = response['Body']['ClientName']
						this.partnerCode = response['Body']['ClientCode']
						this.details = [
							{ title: 'Email', value: response['Body']['ClientEmail'] },
							{ title: 'Contact No.', value: response['Body']['ClientMobileNo'] }
						]


					}
					else {
						this.partnerName = userName
						this.partnerCode = userCode
						this.details = [
							{ title: 'Email', value: "-" },
							{ title: 'Contact No.', value: "-" }
						]
					}
				})
		)

	}

}
