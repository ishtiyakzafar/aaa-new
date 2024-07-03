import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MarketService } from '../../pages/markets/markets.service';
import { IndicesDetailsComponent } from '../indices-details/indices-details.component';
import * as aesjs from 'aes-js';
import { sha256 } from 'js-sha256';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NewLoginService } from '../../pages/new-login/new-login.service';
import { environment, investObj } from '../../../environments/environment';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { CommonService } from '../../helpers/common.service';
import { InvestService } from '../../pages/invest/invest.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

declare var cordova: any;
@Component({
    selector: 'app-common-header-revamp',
    templateUrl: './common-header-revamp.component.html',
    providers: [MarketService,NewLoginService],
    styleUrls: ['./common-header-revamp.component.scss'],
})
export class CommonHeaderRevampComponent implements OnInit,OnDestroy  {
	userType: any;
    userID: any;
	userIdLength = localStorage.getItem('userId1')?.length;
    @Input() displayHeaderDetails: any[] = [];
    clearHeaderDetails: any;
    // public details: any[] = [
    //     {type: 'NIFTY', value: '10,302.10', changes: '11.15 (0.05%)'},
    //     {type: 'BANK NIFTY', value: '10,302.10', changes: '11.15 (0.05%)'},
    //     {type: 'SENSEX', value: '10,302.10', changes: '11.15 (0.05%)'}
    // ]
	public subscription: any;
	userTypeVal = localStorage.getItem('userType');
	public md5: any;
	check={
		  delay: 2000,
          disableOnInteraction: true,
	}

    constructor(public modalController: ModalController, 
		private marService: MarketService,
		private storage: StorageServiceAAA,
		private cookieService: CookieService,
        private investService: InvestService,
		private cipherText: CustomEncryption,
		private http: HttpClient, 
		private router: Router,
		public serviceFile: NewLoginService,
		private commonService: CommonService) { }

    ngOnInit() {}
	ngOnChanges(){
		// console.log(this.displayHeaderDetails);
	}
	convertFormat(val:any){
		// return this.commonService.numberFormatWithCommaUnit(val);
		// return this.commonService.formatNumberComma(val);
	}
	async details(value: any) {
		var objPass = {
			symbol: value.Symbol,
			scripCode: value.ScripCode,
			exch: value.Exch,
			exchType: value.ExchType
		}
		const modal = this.modalController.create({
			component: IndicesDetailsComponent,
			componentProps: { "IndParams": objPass },
			cssClass: 'superstars indices-details'
		});
		return (await modal).present();
	}

	dissmiss() {
		this.modalController.dismiss();
	}

	ionViewWillLeave() {
		clearInterval(this.clearHeaderDetails);
		// clearTimeout(this.clearHeaderDetails);
	}

	ngOnDestroy() {
		clearInterval(this.clearHeaderDetails);
		// clearTimeout(this.clearHeaderDetails);
		this.dissmiss();

		if(this.subscription){
			this.subscription = this.subscription.unsubscribe();
		}

	}

	onHelpClick(){
		if (localStorage.getItem('crmToken')) {
			this.commonService.setClevertapEvent('Help_Clicked');
			this.router.navigate(['/help-support']);
		} else {
			this.serviceFile.getCrmToken().subscribe((res:any) => {
				localStorage.setItem('crmToken', res['Body']['Token']);
				this.commonService.setClevertapEvent('Help_Clicked');
				this.router.navigate(['/help-support']);
			});
		}
	}
	
	public openAccount() {
		this.commonService.setClevertapEvent('OpenAccount_CTA');
		this.addUser();
	}
	async addUser() {
		const modal = await this.modalController.create({
			component: AddUserComponent,
			cssClass: 'add-user'
		});

		modal.onDidDismiss().then((data) => {
			if (data['data']) {
				const type = data['data']['type'];
				this.getClientAuthToken(type);
			}
		})
		return await modal.present();
	}

	public getClientAuthToken(addUser: any) {
		this.subscription = new Subscription();
		this.storage.get('userID').then((ID) => {
			var todayValue: any;
			var today = new Date();
			let dd = String(today.getUTCDate());
			let ddate = today.getUTCDate();
			let mm = String(today.getUTCMonth() + 1);
			let month = today.getUTCMonth() + 1;
			let yyyy = today.getUTCFullYear().toString().substring(2, 4);
			if (ddate < 10) {
				dd = '0' + dd;
			}
			if (month < 10) {
				mm = '0' + mm;
			}
        	todayValue = dd.toString() + mm.toString() + yyyy;
			let IP = "10.150.10.1";
			let appSource = "AAA";
			let parameter = this.encryptCode(ID).trim() + IP.trim() + appSource.trim() + todayValue;
			this.storage.get('userType').then((type) => {
				let userValue = null;
				if (type === 'RM' || type === 'FAN') {
					userValue = type;
				} else if (type === 'SUB BROKER') {
					userValue = 'SubBroker';
				}
				const obj = {
					"head": {
						"checkSum": this.genCheckSum(environment['checkSumKEY'] + parameter),
						"appSource": "AAA"
					},
					"body": {
						"ip": "10.150.10.1",
    					"LoginId": this.encryptCode(ID)
					}
				}
				this.subscription.add(
					this.investService
						.getUserAuthe(obj)
						.subscribe((response: any) => {
							if (response && response['data'] && response['data'].length) {
								let paramStr = this.encryptCode(ID).trim() + appSource.trim() + todayValue;
											let param = {
												"LoginId": this.encryptCode(ID),
												"Token": response['data'],
												"AppSource": appSource,
												"Checksum": this.genCheckSum(environment['checkSumKEY'] + paramStr),
											}
										if (addUser === 'addClient') {
											this.commonService.setClevertapEvent('OpenAccount_NonIndividualClient');
											this.OpenWindowWithPost(investObj['addUser']['addClientURL'], '_blank', param);
										} else if (addUser === 'ICA') {
											this.commonService.setClevertapEvent('OpenAccount_IndividualClient');
											this.OpenWindowWithPost(investObj['addUser']['addICA'], '_blank', param);
										} else if (addUser === 'advisor') {
											this.commonService.setClevertapEvent('OpenAccount_RegisterAdvisor');
											this.OpenWindowWithPost(investObj['addUser']['addSubbrokerURL'], '_blank', param);
										} else if (addUser === 'NRI') {
											this.commonService.setClevertapEvent('OpenAccount_NRIClient');
											const url = investObj['addUser']['addNRI'];
											window.open(url);
										} else {
											return;
										}
							}
						})
				)
			})
		})
	}

	private genCheckSum(blob: any) {
		blob = blob.trim();
		const newblob = CryptoJS.enc.Utf8.parse(blob);
		const hash = CryptoJS.MD5(newblob);
		const md5 = hash.toString(CryptoJS.enc.Hex)
		this.md5 = md5;
		this.md5 = this.md5.slice(0,this.md5.length / 2);
		return this.md5.toUpperCase();
	  }

	  public encryptCode(clientCode: any){
		let clearText = clientCode;
			let encryptionKey = CryptoJS.enc.Utf8.parse('IIFV2AAAAP0223PD');
			let salt = CryptoJS.enc.Base64.parse('SXZhbiBNZWR2ZWRldg=='); 
			
			let iterations = 1000; 
			let keyAndIv = CryptoJS.PBKDF2(encryptionKey, salt, { keySize: 256/32 + 128/32, iterations: iterations, hasher: CryptoJS.algo.SHA1 }); 
			let hexKeyAndIv = CryptoJS.enc.Hex.stringify(keyAndIv);
			let key = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(0, 64));
			let iv = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(64, hexKeyAndIv.length));
			let encryptedStr = CryptoJS.AES.encrypt(CryptoJS.enc.Utf16LE.parse(clearText), key, {iv: iv}).toString();
			return encryptedStr;
	}

	public encryptTest(clientCode: any){
		let clearText = clientCode;
			let encryptionKey = CryptoJS.enc.Utf8.parse('IIFV2SPBNI11888');
			let salt = CryptoJS.enc.Base64.parse('SXZhbiBNZWR2ZWRldg=='); 
			let iterations = 1000; 
			let keyAndIv = CryptoJS.PBKDF2(encryptionKey, salt, { keySize: 256/32 + 128/32, iterations: iterations, hasher: CryptoJS.algo.SHA1 }); 
			let hexKeyAndIv = CryptoJS.enc.Hex.stringify(keyAndIv);
			let key = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(0, 64));
			let iv = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(64, hexKeyAndIv.length));
			let encryptedStr = CryptoJS.AES.encrypt(CryptoJS.enc.Utf16LE.parse(clearText), key, {iv: iv}).toString();
			return encryptedStr;
	}

	public OpenWindowWithPost(url: any, name: any, params: any) {
		if (this.commonService.isApp()) {
			var pageContent = '<html><head></head><body><form id="loginForm1" action="'+ url +'" method="post">' +
				'<input type="hidden" name="LoginId" value="' + params.LoginId + '">' +
				'<input type="hidden" name="Token" value="' + params.Token + '">' +
				'<input type="hidden" name="AppSource" value="' + params.AppSource + '">' +
				'<input type="hidden" name="Checksum" value="' + params.Checksum + '">' +
				'</form> <script type="text/javascript">document.getElementById("loginForm1").submit();</script></body></html>';
			var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
			cordova.InAppBrowser.open(
				pageContentUrl,
				"_blank",
				"hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
			);
		}
		else{
							var mapForm = document.createElement("form");
                            mapForm.target = "_blank";
                            mapForm.method = "POST";
                            mapForm.action = url;
                            Object.keys(params).forEach(function (param) {
                                var mapInput = document.createElement("input");
                                mapInput.type = "hidden";
                                mapInput.name = param;
                                mapInput.setAttribute("value", params[param]);
                                mapForm.appendChild(mapInput);
                            });
                            document.body.appendChild(mapForm);
                            mapForm.submit();
		}
    }
    
    public encryptAnchorEdgeElement(element: any) {
		const key = 'a65nc3278b9p3489ccea6rt6514k3548';
		return this.encrypt(aesjs.utils.utf8.toBytes(element), sha256.digest(key))
    }
    
    public encrypt(data: any, key: any) {
        // console.log(data, key)
        const ivs = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]
        var aesCbc = new aesjs.ModeOfOperation.cbc(key, ivs);

        var encryptedBytes = aesCbc.encrypt(aesjs.padding.pkcs7.pad(data));

        // To print or store the binary data, you may convert it to hex
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        var hexArray: any = encryptedHex
            .replace(/\r|\n/g, "")
            .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
            .replace(/ +$/, "")
            .split(" ");
        var byteString = String.fromCharCode.apply(null, hexArray);
        var base64string = window.btoa(byteString);
        return base64string;
    }
  






  

}
