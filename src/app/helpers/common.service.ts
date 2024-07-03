import { Injectable } from "@angular/core";
// import { CleverTap } from "@ionic-native/clevertap/ngx";
import { AlertController, Platform, PopoverController } from "@ionic/angular";
//import { LoginService } from '../pages/login/login.service'
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';	
import { environment } from "../../environments/environment";
import { HTTP } from "@ionic-native/http/ngx";
import { map } from 'rxjs/operators';
// import { URLS } from "src/config/api.config";
import { URLS } from "../../config/api.config";
import moment from "moment";
import { ModalController } from '@ionic/angular';
import { CleverTap } from "@ionic-native/clevertap/ngx";
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { ungzip } from 'pako';
import { Buffer } from "buffer";
import { AnalyticsService } from "./analytics.service";
import { ToasterService } from "./toaster.service";
import { StorageServiceAAA } from "./aaa-storage.service";
import * as aesjs from 'aes-js';
import { sha256 } from 'js-sha256';
import { ComingSoonPopoverComponent } from "../components/coming-soon-popover/coming-soon-popover.component";
import { StatusRequestComponent } from "../components/status-request/status-request.component";
import { BecomePartnerModalComponent } from "../guest-login/components/become-partner-modal/become-partner-modal.component";
import { NotClickableTabsModalComponent } from "../components/not-clickable-tabs-modal/not-clickable-tabs-modal.component";
declare var clevertap: any;
declare var cordova: any;

@Injectable()
export class CommonService {

	//private subscription = new Subscription();
	private clientCodes = URLS.clientCodesList;
	private getIpDetails = URLS.getIpDetails;
	private editIp = URLS.editIpDetail;
	private nativeHeaders = environment['nativeHeaders'];
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];
	clientCodeList: any[] = [];
	public lastBack = null;
	private field: string | undefined;
	public eventObservable = new Subject<any>();
	public paySearchValue = new Subject<any>();
	public event: any = {};
	monthYearDropDown: any[] = []
	public formattedDate: any;
	public a = 0;
	clientList: any;
	base64pdfData:any;
	public remarkData: any = [];

	constructor(
		//public serviceFile: LoginService,
		private platform: Platform,
		private analytics: AnalyticsService,
		private alertController: AlertController,
		private storage: StorageServiceAAA,
		private popoverController: PopoverController,
		private mobClevertap: CleverTap,
		private httpClient: HttpClient,
		private nativeHttp: HTTP,
		private http:HttpClient,
		private modalController: ModalController,
		public toast: ToasterService,
		private fileOpener: FileOpener,
		private file: File
	) {
		/* document.addEventListener('onCleverTapProfileDidInitialize', (e: any) => {
			console.log('onCleverTapProfileDidInitialize');
			console.log(e.CleverTapID);
		});

		clevertap.notificationCallback = function (msg) {
			//raise the notification viewed and clicked events in the callback
			clevertap.raiseNotificationViewed();
			console.log(JSON.stringify(msg));
		}; */
	}


	setData(val: string | undefined) {
		this.field = val;
	}

	analyticEvent(eventName: any, method: any) {
		this.analytics.event(eventName, {
			'method': method
		});
	}

	getData() {
		return this.field;
	}

	// show popup for coming soon
	// async comingSoon(ev: { stopPropagation: () => void; }, message: any, value: any) {
	async comingSoon(ev: Event, message: any, value: any) {
		const items = [
			{ title: message, value: value },
		]
		ev.stopPropagation();
		const popover = await this.popoverController.create({
			component: ComingSoonPopoverComponent,
			componentProps: { items: items },
			cssClass: "coming-soon-popover",
			// mode: "md",
			showBackdrop: false,
			event: ev
			// translucent: true
		});
		return await popover.present();
	}


	clearEvent() {
		// this.eventObservable.next();			next required a value
		this.eventObservable.next(null);
	}

	/**	    
	 * @param key : Property name sets user data with a named key as passed key in argument
	 * @param data : Setter sets user data on passed key in argument
	 */

	public setEvent(event: string, data: any) {
		/* console.log("setEvent"); 
		console.log('data in service',data);     */
		this.event = { 'event': event, 'data': data };
		this.eventObservable.next(this.event);
	}

	public setSearchValue(data: any) {
		this.paySearchValue.next(data);
	}

	getDate(val: string | any[]) {
		let sliceddate: any = val.slice(6, 19);
		let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		let utcSeconds = sliceddate / 1000;
		let date1 = new Date(0); // The 0 there is the key, which sets the date to the epoch
		date1.setUTCSeconds(utcSeconds);
		let date = date1.getDate();
		let month = months[date1.getMonth()];
		let year = date1.getFullYear();


		return this.formattedDate = date + ' ' + month + ' ' + year;
	}

	getDataAsObservable() {
		return this.storage.get('mappingDetails');
	}

	getSUBDataAsObservable() {
		return this.storage.get('subBrokermapping');
	}

	// match client with dashboard scripname
	async matchClientCode(clientCode: any) {
		let hasMagenicVendor;

		await this.storage.get('userType').then(async type => {
			this.clientList = (type === 'RM' || type === 'FAN') ? await this.getDataAsObservable() : await this.getSUBDataAsObservable();
		})

		// console.log(this.clientList, 'cleint list');
		hasMagenicVendor = this.clientList.some((value: { [x: string]: any; }) => value['ClientCode'] == clientCode);
		return hasMagenicVendor
	}

	async displyPopupText() {
		const modal = await this.modalController.create({
			component: StatusRequestComponent,
			cssClass: 'superstars cancel-request popup-text',
			componentProps: {
				"title": "",
				"msgContent": "Cannot view client details as this client is not mapped under you.",
				"buttonVisibility": false
			}
		})
		return modal.present();
	}


	formatDate(date: Date) {			// function modified
		var dd = date.getDate().toString();
		var mm = (date.getMonth() + 1).toString();
		var yyyy = date.getFullYear();
		if (parseInt(dd) < 10) { dd = '0' + dd }
		if (parseInt(mm) < 10) { mm = '0' + mm }
		date = new Date(`${yyyy.toString()}-${mm}-${dd}`);
		return date
	}

	// last one month dates
	lastMonthDate(monthValue: string) {
		var d = new Date();
		if (monthValue == "previous") {
			d.setDate(d.getDate() - 30);
			return this.formatDate(d)
		}
		else if (monthValue == "current") {
			d.setDate(d.getDate());
			return this.formatDate(d)
		}
		return null;
	}

	inputRestriction(value: string | string[]) {
		if (value.includes('<') || value.includes('>') || value.includes(';') || value.includes('/')) {
			return true
		}
		return false
	}

	getToday(value: any) {
		var dd = value.getDate();
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var yyyy = value.getFullYear();
		let mm = months[value.getMonth()];
		if (dd < 10) {
			dd = '0' + dd;
		}
		return value = dd + '-' + mm + '-' + yyyy;
	}
	last12Month(onlyMonths?: any, onlyYear?: any) {
		this.monthYearDropDown = [];
		var monthName = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
		var d = new Date();
		var i;
		d.setDate(1);
		if (onlyYear) {
			for (i = 0; i <= 10; i++) {
				this.monthYearDropDown.push(d.getFullYear() - i);
			}
		} else if (onlyMonths) {
			for (i = 0; i <= 11; i++) {
				this.monthYearDropDown.push(monthName[i]);
				// d.setMonth(d.getMonth() - 1);
			}
		} else {
			for (i = 0; i <= 11; i++) {
				this.monthYearDropDown.push(monthName[d.getMonth()] + '-' + d.getFullYear());
				d.setMonth(d.getMonth() - 1);
			}
		}
		return this.monthYearDropDown
	}


	displayDecimalDigits(value: number) {
		if (value == 0 || value == Math.round(value)) {
			return value
		}
		else {
			return value.toFixed(2);
		}

	}
	
	/**
	 * To convert byte array to pdf and download
	 * @param data //byte array
	 */
	downLoadMfReportFun(data: any,name?: string) {
		if (data['response'] && data['response'].length > 0) {
			const blobdata = new Blob([new Uint8Array(data['response'])], { type: 'application/pdf' });
			if (this.platform.is('desktop')) {
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blobdata);
				link.download = name?name:'sharedReport' + '.pdf';
				document.body.append(link);
				link.click();
				link.remove();
			} else if (this.platform.is('mobileweb')) {
				const fileName = name?name:'sharedReport' + ".pdf";
				saveAs(blobdata, fileName)
				// var fileURL = URL.createObjectURL(blobdata);
				// window.open(fileURL);	
			} else {

				// old code
				// const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
				const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalRootDirectory + 'Download/';

				const filename = 'share-report' + this.getRandomInt(1, 1000)
				// let downloadPDF: any = data['response'];
				fetch(URL.createObjectURL(blobdata),
					{
						method: "GET"
					}).then(res => res.blob()).then(blob => {

						this.file.writeFile(writeDirectory, filename + '.pdf', blob, { replace: true }).then(res => {
							this.fileOpener.open(
								res.nativeURL,
								'application/pdf'
							)
						}).catch(err => {
							console.log("save error")
						});
					}).catch(err => {
						console.log("error")
					});
			}
		}
		else {
			if (data['head'] && data['head']['Status'] == -1) {
				this.toast.displayToast('No Data Available in the selected Date Range');
			} else {
				this.toast.displayToast(data['head']['Message']);
			}
		}
	}

	downLoadReportFun(res: { [x: string]: { [x: string]: string; }; }, name?: any, type?: string) {
		if (res['Head']['ErrorCode'] == '0' && res['Body'] && res['Body']['rptData']) {
			this.base64pdfData = res['Body']['rptData'];
			if (this.platform.is('mobileweb')) {
				const byteCharacters = atob(this.base64pdfData);
				const byteNumbers = new Array(byteCharacters.length);
				for (let i = 0; i < byteCharacters.length; i++) {
					byteNumbers[i] = byteCharacters.charCodeAt(i);
				}
				const byteArray = new Uint8Array(byteNumbers);
				const blobdata = new Blob([byteArray], {type: 'application/pdf'});
				const fileName = name?name:'sharedReport' + ".pdf";
				saveAs(blobdata, fileName);
			} else if (this.platform.is('desktop')) {
				if (type === 'excel') {
					this.downloadExcel(this.base64pdfData, name);
				} else {
					this.convertDownloadpdf(this.base64pdfData, name);
				}
			} else {
				if (type === 'excel') {
					this.downloadXlsForMobile(this.base64pdfData,false, name);
				} else {
					this.saveAndOpenPdf(this.base64pdfData,name);
				}
			}
  
		}
		else{
			if( res['Body'] && res['Body']['Msg'] && !res['Body']['rptData']){

				if((res['Body']['Msg']).toString().toLowerCase() === "please provide valid parameters."){
					this.toast.displayToast("No records found with the given parameters");
				} else {
					this.toast.displayToast(res['Body']['Msg']); 
				}
			}else{
				this.toast.displayToast(res['Head']['ErrorDescription']); 
			}
		}
	}

	downLoadDPCReportFun(res: any, fileType: string, name?: any) {
		if (res['Head']['ErrorCode'] == 0) {
			this.base64pdfData = res['Body']['rptData'];
			if (fileType == 'pdf') {
				if (this.platform.is('mobileweb')) {
					const blobdata = new Blob([this.convertStringToBuffer(atob(this.base64pdfData))], { type: 'application/pdf' });
					const fileName = name?name:'sharedReport' + ".pdf";
					saveAs(blobdata, fileName);
				} else if (this.platform.is('desktop')) {
					this.convertDownloadpdf(this.base64pdfData,name);
				} else {
					this.saveAndOpenPdf(this.base64pdfData,name);
				}
			} else {
				if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
					this.downloadXlsFile(this.base64pdfData,name);
				} else {
					this.downloadXlsForMobile(this.base64pdfData,name);
				}
			}
		}
		else {
			this.toast.displayToast(res['Head']['ErrorDescription']);
		}
	}

	/**
	 * To download .xls file in mobile app.
	 * @param response 
	 */
	downloadXlsForMobile(response: any, isArrayRes?: any,name?: any | undefined) {
		let blob;
		if (isArrayRes) {
			blob = response;
		} else {
			blob = new Blob([this.convertStringToBuffer(atob(response))], {
				type: ''
			});
		}
		// old code
		// const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
		const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalRootDirectory + 'Download/';
		
		const filename = name?name:'share-report' + this.getRandomInt(1, 1000)
		fetch(URL.createObjectURL(blob),
			{
				method: "GET"
			}).then(res => res.blob()).then(blob => {

				this.file.writeFile(writeDirectory, filename + '.xls', blob, { replace: true }).then(res => {
					this.fileOpener.open(
						res.nativeURL,
						'application/vnd.ms-excel'
					)
				}).catch(err => {
					console.log("save error")
				});
			}).catch(err => {
				console.log("error")
			});
	}

	downloadXlsFile(response: string,name?: any) {
		var blob = new Blob([this.convertStringToBuffer(atob(response))], {
			type: ''
		});
		const filename = name?name:'sharedReport';
		saveAs(blob, filename+".xls");
	}

	convertStringToBuffer(str: any) {
		var buf = new ArrayBuffer(str.length);
		var view = new Uint8Array(buf);
		for (var i = 0; i != str.length; ++i) view[i] = str.charCodeAt(i) & 0xFF;
		return buf;
	}

	convertDownloadpdf(pdfbase64: string,name?: any) {
		const linkSource = 'data:application/pdf;base64,' + pdfbase64;
		const downloadLink = document.createElement("a");
		const fileName = name?name:'sharedReport' + ".pdf";
		downloadLink.href = linkSource;
		downloadLink.download = fileName;
		downloadLink.click();
	}

	saveAndOpenPdf(base64: any,name?: any){
		//const fileTransfer: FileTransferObject = this.transfer.create();
		// const writeDirectory = this.platform.is('ios') ? cordova.file.documentsDirectory : 'file:///storage/emulated/0/Download/';

		// old code
		// const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
		const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalRootDirectory + 'Download/';

		const filename = name?name:'share-report'+this.getRandomInt(1, 1000)
		// console.log(filename);
		let downloadPDF: any = base64
        fetch('data:application/pdf;base64,' + downloadPDF,
          {
            method: "GET"
          }).then(res => res.blob()).then(blob => {
				//  console.log(blob);
				 
            this.file.writeFile(writeDirectory, filename+'.pdf', blob, { replace: true }).then(res => {
				// console.log(res.toInternalURL())
              this.fileOpener.open(
                res.nativeURL,
                'application/pdf'
			  )
            }).catch(err => {
                console.log("save error")     
       		});
          }).catch(err => {
                console.log("error")
          });
	}

	/**
	 * Convert base64 string to excel file.
	 * @param stringData - base64 string
	 * @param name - file name
	 */
	downloadExcel(stringData: string,name?: any){
		const linkSource = 'data:application/vnd.ms-excel;base64,' + stringData;
		const downloadLink = document.createElement("a");
		const fileName = name?name:'sharedReport' + ".xls";
		downloadLink.href = linkSource;
		downloadLink.download = fileName;
		downloadLink.click();
	}

	getRandomInt(min: number, max: number) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	formatNumberComma(value: { toString: () => string; }) {
		var parts = value.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
		// var x = value.toString();
		// var afterPoint = '';
		// if(x.indexOf('.') > 0)
		//    afterPoint = x.substring(x.indexOf('.'),x.length);
		// x = Math.floor(x);
		// x=x.toString();
		// var lastThree = x.substring(x.length-3);
		// var otherNumbers = x.substring(0,x.length-3);
		// if(otherNumbers != '')
		//     lastThree = ',' + lastThree;
		// var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint
		// return res;
	}

	displayTitleForBusinessOpps(key: string,nameOrIcon: string){
		// key is what was initially passed. 
		// nameOrIcon accepted values are 'displayName' or'icon'.  whether you want to use it for Name('displayName') or Icon ('icon')
		let displayCardsOPtion: any = {};
		if(key == 'EquityHoldingsAbove25L'){
			displayCardsOPtion = {
				displayName: 'High Net Worth(above 25L equity holdings)',
				icon: 'assets/svg/high-net_worth.svg'
			} 
		}
		else if(key == 'NotInvestedInSIP'){
			displayCardsOPtion = {
				displayName : 'Not invested in SIP',
				icon: 'assets/svg/not_inv_sip.svg'
			} 
			
		}
		else if(key == 'CeasedSIPs'){
			displayCardsOPtion = {
				displayName : 'Ceased SIPs in last 60 days',
				icon: 'assets/svg/ceasedsip.svg'
			} 
		}
		else if(key == 'BouncedSIPs'){
			displayCardsOPtion = {
				displayName : 'Bounced SIPs in last 60 days',
				icon: 'assets/svg/bouncedsip.svg'
			} 
		}
		else if(key == 'MaturingFDCount'){
			displayCardsOPtion = {
				displayName : 'FDs maturing in next 60 days',
				icon: 'assets/svg/sip60days.svg'
			} 
		}
		else if(key == 'NotInvestedInMF'){
			displayCardsOPtion = {
				displayName : 'Not invested in Mutual Funds',
				icon: 'assets/svg/not_inv_mf.svg'
			}
		}
		else if(key == 'PMSAIFLeadsCount'){
			displayCardsOPtion = {
				displayName : 'PMS AIF Leads',
				icon: 'assets/svg/pmsleads.svg'
			}
		}
		else if(key == 'FAOActiveNotTraded'){
			displayCardsOPtion = {
				displayName : 'F&O active but not traded',
				icon: 'assets/svg/nfo_icon.svg'
			}
		}
		else if(key == 'NCDorDebtHoldings'){
			displayCardsOPtion = {
				displayName : 'NCD or Debt Holdings',
				icon: 'assets/svg/client_logged.svg'
			}
		}
		else if(key == 'EquityMFLeadsCount'){
			displayCardsOPtion = {
				displayName : 'Equity Mutual Fund Leads',
				icon: 'assets/svg/mfleads.svg'
			}
		}
		else if(key == 'FixedIncomeLeadsCount'){
			displayCardsOPtion = {
				displayName : 'Fixed Income Leads',
				icon: 'assets/svg/fixedleads.svg'
			}
		}
		else if(key == 'Last30bday'){
			displayCardsOPtion = {
				displayName : 'Having Birthday in Next 30 Days',
				icon: 'assets/svg/cake.svg'
			}
		}
		else if(key == 'P1P2Clients'){
			displayCardsOPtion = {
				displayName : 'P1,P2 Clients not met in last one month',
				icon: 'assets/svg/user-p1.svg'
			}
		}
		else if(key == 'otherclients'){
			displayCardsOPtion = {
				displayName : 'Other Clients not met in last one quarter',
				icon: 'assets/svg/user-2.svg'
			}
	}
		else{
			displayCardsOPtion = {
				displayName : key,
				icon: ''
			}
			
		}
	   return nameOrIcon.toLowerCase() == 'icon' ? displayCardsOPtion.icon : displayCardsOPtion.displayName;
	}

	numberFormatWithOnly_K(value: number) {
		var val;
		val = Math.abs(value)
		val = this.formatNumberComma(this.displayDecimalDigits(val / 1000));
		return val;
	}

	numberFormatWithCommaUnit(value: number) {
		var val, signValue;
		signValue = value
		val = Math.abs(value)
		if (val >= 10000000) {
			val = this.formatNumberComma(this.displayDecimalDigits(val / 10000000)) + ' Cr';

		} else if (val >= 100000) {
			val = this.formatNumberComma(this.displayDecimalDigits(val / 100000)) + ' L';
		}
		else if (val >= 1000) {
			val = this.formatNumberComma(this.displayDecimalDigits(val / 1000)) + ' K';
		}
		else if (val < 1000 && val > 99) {
			val = this.displayDecimalDigits(val);
		}
		else if (val < 100) {
			val = this.displayDecimalDigits(val);
		}
		if (signValue < 0) {
			return '-' + val;
		}
		else {
			return val;
		}
	}

	currentMonthFirstDate(){
		var date = new Date();
		var firstDay = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYYMMDD');
		return firstDay
	}
	numberFormatWithUnit(value: number) {
		var val, signValue;
		signValue = value
		val = Math.abs(value)
		if (val >= 10000000) {
			val = this.displayDecimalDigits(val / 10000000) + 'Cr';

		} else if (val >= 100000) {
			val = this.displayDecimalDigits(val / 100000) + 'L';
		}
		else if (val >= 1000) {
			val = this.displayDecimalDigits(val / 1000) + 'K';
		}
		else if (val < 100) {
			val = this.displayDecimalDigits(val);
		}
		if (signValue < 0) {
			return '-' + val;
		}
		else {
			return val;
		}
	}

	changeDataFormat(dateValue: string) {
		let monthName = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var date;
		return dateValue.substring(6, 8) + ' ' + monthName[parseInt(dateValue.substring(4, 6))] + ' ' + dateValue.substring(0, 4)
	}



	Last7Days(day: string) {
		var result = [];
		for (var i = 0; i < 8; i++) {
			var d = new Date();
			d.setDate(d.getDate() - i);
			result.push(this.formatDate(d));
		}
		if (day == 'first') {
			return result[0]
		}
		else if (day == 'last') {
			return result[7]
		}
		return result
		// this.weekDateList = result;

	}

	dateMonYrFromat(date: any) {
		var dd = date.getDate();
		var mm = date.getMonth() + 1;
		var yyyy = date.getFullYear();
		if (dd < 10) { dd = '0' + dd }
		if (mm < 10) { mm = '0' + mm }
		date = dd + '-' + mm + '-' + yyyy;
		// date = dd.toString() + mm + yyyy;
		return date
	}

	convertDateToMillisec(date: string | number | Date) {
		return new Date(date).getTime();
	}


	lastWeekISOConverted(day: string) {
		// assigned type
		var result: Date[] = [];
		for (var i = 0; i < 8; i++) {
			var d = new Date();
			d.setDate(d.getDate() - i);
			result.push((d));
		}
		if (day == 'first') {
			return result[0];
		}
		else if (day == 'last') {
			return result[7]
		}
		// changed return, will return first by default instead of Date []
		return result[0];

	}

	lastMonthISOConverted(monthValue: string) {
		var d = new Date();
		if (monthValue == "previous") {
			d.setDate(d.getDate() - 30);
			return d
		}
		else if (monthValue == "current") {
			d.setDate(d.getDate());
			return d
		}
		return d;
	}

	// datetoISO(date){
	// 	const event = new Date(date);
	// 	return event.toISOString()
	// }




	async backbuttonSubscribeMethod() {
		this.a = 0;
		this.platform.backButton.subscribe(async () => {
			if (location.pathname == '/dashboard') {
				this.a++;
				if (this.a == 1) { // logic for double tap
					const alert = await this.alertController.create({
						header: 'Exit App',
						message: 'Are you sure, you want to exit app?',
						buttons: [
							{
								text: 'Yes',
								role: 'Yes',
								cssClass: 'secondary',
								handler: () => {
									(navigator as any)['app'].exitApp();
								}
							},
							{
								text: 'No',
								role: 'Cancel',
								cssClass: 'secondary',
								handler: () => {
									alert.dismiss();
								}
							}
						]
					});
					alert.present();
					this.a = 0;
				}
			}
		});
		/* let a = 0;
		this.platform.backButton.subscribe(async () => {
			if (Date.now() - this.lastBack < 500) { // logic for double tap: delay of 500ms between two clicks of back button
				// navigator['app'].exitApp();
				const alert = await this.alertController.create({
					header: 'Exit App',
					message: 'Are you sure, you want to exit app?',
					buttons: [
						{
							text: 'Yes',
							role: 'Yes',
							cssClass: 'secondary',
							handler: () => {
								navigator['app'].exitApp();
							}
						},
						{
							text: 'No',
							role: 'Cancel',
							cssClass: 'secondary',
							handler: () => {
								alert.dismiss();
							}
						}
					]
				});
				alert.present();
			}
			this.lastBack = Date.now();
		}); */
	}

	backbuttonUnsubscribeMethod() {
		this.platform.backButton.unsubscribe();
	}

	public getClientCodeList(cookie?: any){
		this.storage.get('userID').then(ID => {
			//this.subscription.add(
				this.getClientCodes(cookie, ID).
					subscribe((response: any) => {
						// console.log(response);
						if (response['Head']['ErrorCode'] == 0) {
							//this.clientCodeList = response['Body']['objGetClientCodesResBody'];
							const Details1 = this.getGzipData(response['Body']);
							this.clientCodeList = Details1.objGetClientCodesResBody;
						} else {
							this.clientCodeList = []
						}
						return this.storage.set('setClientCodes', this.clientCodeList);
					})
			//);
		})
	}

	public getGzipData(response: string){
		const gzipedData = atob(response);
						
		const gzipedDataArray = Uint8Array.from(gzipedData, c => c.charCodeAt(0))
		return JSON.parse(new TextDecoder().decode(ungzip(gzipedDataArray)));
	}

	public getClientCodes(cookievalue: any, userId: any): Observable<{}> {
		let params = {"body":{"Code":userId},"head":{"AppName":this.clientCodes.appName,"AppVer":"1.0.26.0","Key":this.clientCodes.key,"OsName":"Android","RequestCode":"CVUpdateLead01",
		"userType": localStorage.getItem('userType')}}
		let obj: any = {
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.isApp() ? from(this.nativeHttp.post(this.clientCodes.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})): this.httpClient.post(this.clientCodes.url, params, { headers: new HttpHeaders(obj) });
	}

	public setClevertapEvent(eventName: string, eventProps?: any) {
		if (!this.isApp()) {
			this.storage.get('userID').then(ID => {
				// clevertap.profile.push(ID);
				if (eventProps) {
					if(typeof eventProps === 'object'){
						clevertap.event.push(eventName, eventProps);
					}else{
						clevertap.event.push(eventName, {desc: eventProps});
					}
				} else clevertap.event.push(eventName);
				// clevertap.recordEventWithNameAndProps(eventName, eventProps);
			})
		} else {
			if (eventProps) {
				this.mobClevertap.recordEventWithNameAndProps(eventName, eventProps);
			} else {
				this.mobClevertap.recordEventWithName(eventName);
			}
		}
		/* this.mobClevertap.profileGetCleverTapID().then( ID => {
			console.log('Clevertap ID :----> ' , ID);
		}) */
	}

	public setRemarkData(data: any){
		this.remarkData = data;
		this.storage.set("remarkData",JSON.stringify(data))
		// localStorage.setItem('remarkData',JSON.stringify(data));
	}

	public getRemarkData(){
		return this.remarkData;
	}


	public getPlatform() {
		return this.platform.is('android') ? 'Android' : this.platform.is('ios') ? 'IOS' : 'WEB';
	}

	public isApp() {
		return ((this.platform.is('android') || this.platform.is('ios')) && (!this.platform.is('mobileweb'))) ? true : false;
	}

	public goBack(){
		window.history.back();
	}

	/**
	* Save response array to excel file
	*/
	public exportDataToExcel(header: any, data: any, name: string, extra?: any) {
		//Create a workbook with a worksheet
		let workbook = new Workbook();
		let worksheet = workbook.addWorksheet(name);
		// worksheet.mergeCells('C1', 'F4');
		if (extra) {
			let titleRow1 = worksheet.getCell('C1');
			titleRow1.font = {
				name: 'Calibri',
				size: 16,
				underline: 'single',
				bold: true,
				color: { argb: '0085A3' }
			}
			titleRow1.alignment = { vertical: 'middle', horizontal: 'center' }
			let headerRow1 = worksheet.addRow(extra.topSectionHead[0]);
			headerRow1.eachCell((cell, number) => {
				cell.fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: '4167B8' },
					bgColor: { argb: '' }
				}
				cell.font = {
					bold: true,
					color: { argb: 'FFFFFF' },
					size: 12
				}
			})

			//Adding Data with Conditional Formatting
			extra.topSectionRow.forEach((d: any) => {
				let row = worksheet.addRow(d);
				row.eachCell((cell) => {
					cell.font = { name: 'Calibri', family: 4, size: 11 };
				})
			}
			);
		}
		let titleRow = extra ? worksheet.getCell('C5') : worksheet.getCell('C1');
		titleRow.font = {
			name: 'Calibri',
			size: 16,
			underline: 'single',
			bold: true,
			color: { argb: '0085A3' }
		}
		titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
		let headerRow = worksheet.addRow(header);
		headerRow.eachCell((cell, number) => {
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: '4167B8' },
				bgColor: { argb: '' },

			}
			cell.font = {
				bold: true,
				color: { argb: 'FFFFFF' },
				size: 12,

			}
		})

		//Adding Data with Conditional Formatting
		data.forEach((d: any) => {
			let row = worksheet.addRow(d);
			row.eachCell((cell) => {
				cell.font = { name: 'Calibri', family: 4, size: 11 };
			})
		}
		);
		worksheet.getColumn(1).width = 25;
		worksheet.getColumn(2).width = 20;
		worksheet.getColumn(3).width = 10;
		worksheet.getColumn(4).width = 15;
		worksheet.getColumn(5).width = 15;
		worksheet.getColumn(6).width = 15;
		worksheet.getColumn(7).width = 15;
		worksheet.getColumn(8).width = 20;

		//Generate & Save Excel File
		workbook.xlsx.writeBuffer().then((data) => {
			let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			if (this.isApp()) {
				this.downloadXlsForMobile(blob, true);
			}
			else {
				saveAs(blob, name?name:'reports' + '.xlsx');
			}
		})
	}

	/**
	 * Save response array to save pdf file
	 */
	public savePdfFile(header: any, data: any, extra?: any) {
		const doc = new jsPDF('l', 'mm', 'a1');
		if (extra) {
			autoTable(doc, {
				head: extra.topSectionHead,
				body: extra.topSectionRow,
				theme: 'grid',
				styles: { overflow: 'linebreak' },
				headStyles: { fillColor: '#f2f4f4', textColor: '#000000', fontSize: 9 }, // Purple
				columnStyles: { text: { cellWidth: 'auto' } },
			});
		}
		autoTable(doc, {
			head: header,
			body: data,
			theme: 'grid',
			// startY: extra ? 50 : undefined,
			styles: { overflow: 'linebreak' },
			headStyles: { fillColor: '#f2f4f4', textColor: '#000000', fontSize: 9 },
			columnStyles: { text: { cellWidth: 'auto' } },
		});
		var blobData = doc.output("blob");
		// console.log(blobData);
		if (this.isApp()) {

			// old code
			// const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
			const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalRootDirectory + 'Download/';
			const filename = 'reports' + this.getRandomInt(1, 1000);
			fetch(URL.createObjectURL(blobData),
			{
				method: "GET"
			}).then(res => res.blob()).then(blob => {
				this.file.writeFile(writeDirectory, filename + '.pdf', blob, { replace: true }).then((res: any) => {
					this.fileOpener.open(
						res.nativeURL,
						'application/pdf'
					)
				}).catch(err => {
					console.log("save error")
				});
			}).catch(err => {
				console.log("error");
			});
		} else {
			doc.save('reports.pdf');
		}
	}

	getIonDateTimeFormat = (date: Date): string => {
		return `${date.getFullYear().toString()}-${("0"+(date.getMonth()+1).toString()).slice(-2)}-${("0"+(date.getDate()).toString()).slice(-2)}`
	}

	downloadPdfBlobForMobileApp = (blob: any, fileName: string) => {
		const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalRootDirectory + 'Download/';

		const filename = fileName ? fileName:'report'+this.getRandomInt(1, 1000)
				 
		fetch(URL.createObjectURL(blob),
		{
			method: "GET"
		}).then(res => res.blob()).then(blob => {
			this.file.writeFile(writeDirectory, filename + '.pdf', blob, { replace: true }).then((res: any) => {
				this.fileOpener.open(
					res.nativeURL,
					'application/pdf'
				)
			}).catch(err => {
				console.log("save error")
			});
		}).catch(err => {
			console.log("error");
		});
	}

	public editIPDetails(cookievalue: any, payload: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.editIp.key,
				"AppName": this.editIp.appName,
				"AppVer": "01",
				"OsName": "Android"
			},
			"body": payload
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.isApp() ? from(this.nativeHttp.post(this.editIp.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.editIp.url, params, { headers: new HttpHeaders(obj) });
	}

	public getPartnerDetails(cookievalue: any, dataToSend: any): Observable<{}> {
		let params = {
			"head": {
				"RequestCode": "CVUpdateLead01",
				"Key": this.getIpDetails.key,
				"AppName": this.getIpDetails.appName,
				"AppVer": "01",
				"OsName": "Android"
			},
			"body":dataToSend
		}
		let obj: any = {
			'Ocp-Apim-Subscription-Key': this.gatewaySubscriptionKey.aaa,
			'appID': localStorage.getItem('appID') || ''
		};
		if (cookievalue) {
			obj['token'] = cookievalue;
		}
		if (this.isApp()) this.nativeHttp.setDataSerializer('json');
		return this.isApp() ? from(this.nativeHttp.post(this.getIpDetails.url, params, Object.assign(obj, this.nativeHeaders))).pipe(map(response => {
			return JSON.parse(response['data'] as any);
		})) : this.httpClient.post(this.getIpDetails.url, params, { headers: new HttpHeaders(obj) });
	}

	navigateToACEBackOffice() {
		this.setClevertapEvent('AceReport');
		this.analyticEvent('More_Ace_Report', 'Ace Report in More');
		this.storage.get('userType').then(type => {
			let userType = type;
			this.storage.get('userID').then((ID) => {
				let userID = ID;
				if (userType === 'RM' || userType === 'FAN') {
					this.storage.get('bToken').then(token => {
						const passObj = {
							LoginId: userID,
							CookieValue: token.replace('.ASPXAUTH=', '')
						}
						const url = 'https://distributionbackoffice.iifl.in/mflandingpage.aspx';
						if (this.isApp()) {
							this.openACEForMobile(url, token, userID);
						} else {
							this.OpenWindowWithPost(url, '_blank', passObj);
						}
					})
				} else {
					this.storage.get('subToken').then(token => {
						const passObj = {
							LoginId: userID,
							CookieValue: token.replace('.ASPXAUTH=', '')
						}

						const url = 'https://distributionbackoffice.iifl.in/mflandingpage.aspx';
						if (this.isApp()) {
							this.openACEForMobile(url, token, userID);
						} else {
							this.OpenWindowWithPost(url, '_blank', passObj);
						}
					})
				}
			})
		})
	}

	openACEForMobile(url: string, token: string, userID: any) {
		var pageContent = '<html><head></head><body><form id="loginForm" action="' + url + '" method="post">' +
			'<input type="hidden" name="LoginId" value="' + userID + '">' +
			'<input type="hidden" name="CookieValue" value="' + token.replace('.ASPXAUTH=', '') + '">' +
			'</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';
		var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
		var browserRef = cordova.InAppBrowser.open(
			pageContentUrl,
			"_blank",
			"hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
		);
	}

	public OpenWindowWithPost(url: any, name: any, params: any) {
		if (this.isApp()) {
			var pageContent = '<html><head></head><body><form id="loginForm1" action="' + url + '" method="post">' +
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
		else {
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

	navigateToImageBrading() {
		this.analyticEvent('More_Image_Branding', 'Image Branding');
		this.setClevertapEvent('ImageBranding');
		this.storage.get('userType').then(type => {
			let userType = type;
			this.storage.get('userID').then((ID) => {
				let userID = ID;
				if (userType === 'RM' || userType === 'FAN') {
					this.storage.get('bToken').then(token => {
						const passObj = {
							clientCode: decodeURIComponent(encodeURIComponent(this.encryptAnchorEdgeElement(userID).trim())),
							clientType: decodeURIComponent(encodeURIComponent(this.encryptAnchorEdgeElement(userType).trim())),
							authToken: decodeURIComponent(encodeURIComponent(this.encryptAnchorEdgeElement(token.replace('.ASPXAUTH=', '')).trim()))
						}
						const url = environment['imageBranding']['url'];
						if (this.isApp()) {
							var pageContent = '<html><head></head><body><form id="loginForm" action=" ' + url + ' " method="post">' +
								'<input type="hidden" name="clientCode" value="' + decodeURIComponent(encodeURIComponent(this.encryptAnchorEdgeElement(userID).trim())) + '">' +
								'<input type="hidden" name="clientType" value="' + decodeURIComponent(encodeURIComponent(this.encryptAnchorEdgeElement(userType).trim())) + '">' +
								'<input type="hidden" name="authToken" value="' + decodeURIComponent(encodeURIComponent(this.encryptAnchorEdgeElement(token.replace('.ASPXAUTH=', '')).trim())) + '">' +
								'</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';
							var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
							var browserRef = cordova.InAppBrowser.open(
								pageContentUrl,
								"_blank",
								"hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
							);
						} else {
							this.OpenWindowWithPost(url, '_blank', passObj);
						}
					})
				} else {
					this.storage.get('subToken').then(token => {
						const passObj = {
							clientCode: decodeURIComponent(encodeURIComponent(this.encryptAnchorEdgeElement(userID).trim())),
							clientType: decodeURIComponent(encodeURIComponent(this.encryptAnchorEdgeElement(userType).trim())),
							authToken: decodeURIComponent(encodeURIComponent(this.encryptAnchorEdgeElement(token.replace('.ASPXAUTH=', '')).trim()))
						}
						const url = environment['imageBranding']['url'];
						if (this.isApp()) {
							var pageContent = '<html><head></head><body><form id="loginForm" action=" ' + url + ' " method="post">' +
								'<input type="hidden" name="clientCode" value="' + decodeURIComponent(encodeURIComponent(this.encryptAnchorEdgeElement(userID).trim())) + '">' +
								'<input type="hidden" name="clientType" value="' + decodeURIComponent(encodeURIComponent(this.encryptAnchorEdgeElement(userType).trim())) + '">' +
								'<input type="hidden" name="authToken" value="' + decodeURIComponent(encodeURIComponent(this.encryptAnchorEdgeElement(token.replace('.ASPXAUTH=', '')).trim())) + '">' +
								'</form> <script type="text/javascript">document.getElementById("loginForm").submit();</script></body></html>';
							var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);
							var browserRef = cordova.InAppBrowser.open(
								pageContentUrl,
								"_blank",
								"hidden=no,location=no,clearsessioncache=yes,clearcache=yes"
							);
						} else {
							this.OpenWindowWithPost(url, '_blank', passObj);
						}
					})
				}
			});
		});
	}

	public encryptAnchorEdgeElement(element: any) {
		const key = 'a65nc3278b9p3489ccea6rt6514k3548';
		return this.encrypt(aesjs.utils.utf8.toBytes(element), sha256.digest(key))
	}

	public encrypt(data: any, key: any) {
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

	public async becomePartnerModal() {
		const modal = await this.modalController.create({
			component: BecomePartnerModalComponent,
			cssClass: 'become-partner',
			backdropDismiss: true
		});
		modal.onDidDismiss()
			.then((data: any) => {
			});
		return (await modal).present();
	}

	public async notClickableTabModal() {
		const modal = await this.modalController.create({
			component: NotClickableTabsModalComponent,
			cssClass: 'not-clickable-tabs',
			backdropDismiss: true
		});
		modal.onDidDismiss()
			.then((data: any) => {
			});
		return (await modal).present();
	}
}