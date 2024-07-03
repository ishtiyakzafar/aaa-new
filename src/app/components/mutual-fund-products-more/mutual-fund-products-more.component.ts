import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { investObj } from '../../../environments/environment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-mutual-fund-products-more',
	templateUrl: './mutual-fund-products-more.component.html',
	styleUrls: ['./mutual-fund-products-more.component.scss'],
})
export class MutualFundProductsMoreComponent implements OnInit {
	datas: any[] = [
		{ productName: 'Start SIP', type: 'SIP' },
		{ productName: 'Invest Lumpsum', type: 'LS' },
		{ productName: 'SIP Basket', type: 'SB' },
		{ productName: 'Smart Save', type: 'SS' },
		{ productName: 'Transfer Holdings', type: 'TH' },
		// {productName: 'Mutual Fund Monitor', type: ''}
	];
	constructor(public modalController: ModalController,
		private storage: StorageServiceAAA,
		private platform: Platform,
		private cipherText: CustomEncryption) { }

	ngOnInit() { }

	// dissmiss popup
	dissmiss() {
		this.modalController.dismiss();
	}

	public redirect(flag: any) {
		// IOS:  11 
		// Android:  12   
		// AAA website :  13
		let appSource: any = null;
		if (this.platform.is('android')) {
			appSource = this.cipherText.aesEncrypt(12);
		} else if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
			appSource = this.cipherText.aesEncrypt(13);
		} else if (this.platform.is('ios')) {
			appSource = this.cipherText.aesEncrypt(11);
		}
		const flagENC = this.cipherText.aesEncrypt(flag);
		this.storage.get('userType').then((role) => {
			if (role === 'RM' || role === 'FAN') {
				const roleENC = this.cipherText.aesEncrypt(role);
	
				this.storage.get('bToken').then((sCookie) => {
					const swarajCookie = sCookie.split('=');
	
					this.storage.get('userID').then((clientCode) => {
						const codeENC = this.cipherText.aesEncrypt(clientCode);
						const obj = {
							token: swarajCookie[1],
							Flag: flagENC,
							Appsource: appSource,
							ClientCode: codeENC,
							Role: roleENC
						}

						const url = investObj['mutualFund']['url'] + '?token=' + swarajCookie[1] + '&Flag=' + flagENC + '&Appsource=' + appSource + '&ClientCode=' + codeENC + '&Role=' + roleENC;
						this.OpenWindowWithPost(investObj['mutualFund']['url'], '_blank', obj);
						// window.open(url);
					})
				})
			} else if (role === 'SUB BROKER') {
				const roleENC = this.cipherText.aesEncrypt('SubBroker');
				
				this.storage.get('subToken').then((sCookie) => {
					const brokerToken = sCookie.split('=');
	
					this.storage.get('userID').then((clientCode) => {
						const codeENC = this.cipherText.aesEncrypt(clientCode);
						const obj = {
							token: brokerToken[1],
							Flag: flagENC,
							Appsource: appSource,
							ClientCode: codeENC,
							Role: roleENC
						}
						// const url = investObj['mutualFund']['url'] + '?token=' + brokerToken[1] + '&Flag=' + flagENC + '&Appsource=' + appSource + '&ClientCode=' + codeENC + '&Role=' + roleENC;
						this.OpenWindowWithPost(investObj['mutualFund']['url'], '_blank', obj);
						// window.open(url);
					})
				})
			}
		})

	}

	// navitate with link
	navigateLink(link?: any, value1?: any, value2?: any) {
		if (link && !value1 && !value2) {
			window.open(link, '_blank');
		} else if (link && value1 && !value2) {
			window.open(link + value1, '_blank');
		} else if (link && value1 && value2) {
			window.open(link + value1 + '&' + value2, '_blank');
		} else {
			return;
		}
	}

	public OpenWindowWithPost(url: any, name: any, params: any) {
		var form = document.createElement("form") as HTMLFormElement;
		form.setAttribute("method", "post");
		form.setAttribute("action", url);
		form.setAttribute("target", name);

		for (var i in params) {
			if (params.hasOwnProperty(i)) {
				var input = document.createElement('input');
				input.type = 'hidden';
				input.name = i;
				input.value = params[i];
				form.appendChild(input);
			}
		}

		document.body.appendChild(form);

		//note I am using a post.htm page since I did not want to make double request to the page 
		//it might have some Page_Load call which might screw things up.
		form.submit();

		// document.body.removeChild(form);
		// window.open("post.htm", name);

	}

}
