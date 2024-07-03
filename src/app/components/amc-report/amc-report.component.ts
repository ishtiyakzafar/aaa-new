import { Component, Input, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { DaterangepickerDirective, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import * as _ from 'lodash';
import { saveAs } from 'file-saver';
import { Platform } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';

@Component({
	selector: 'app-amc-report',
	providers: [],
	templateUrl: './amc-report.component.html',
	styleUrls: ['./amc-report.component.scss'],
})
export class AmcReportComponent implements OnInit {
	@ViewChild(DaterangepickerDirective, { static: true }) picker!: DaterangepickerDirective;
	@Input() searchValue: any;
	@Input() typeOfClient: any;
	showError: any;
	showNote = false;
	reportTypeData: any = [
		{ reportType: "AMC Report", value: "AMC Report" }
	];
	selectedReportType: any;
	amcList: any = [];
	AMCProvider: any;
	AMCType: any;
	selectedCustomDate!: { startDate: moment.Moment, endDate: moment.Moment };
	fromDate: any;
	toDate: any;
	dataLoad: boolean = false;
	radioType: any = 'amc1';
	customSt: any;
	customEnd: any;
	currentMonthStart: any;
	prevMonthFirstDate: any;
	prevMonthLastDate: any;
	clientDetails: any;
	maxDate: any;
	currentYearStartDate = (new Date().getMonth()) < 3 ? `04/01/${new Date().getFullYear() - 1}` : `04/01/${new Date().getFullYear()}`;
	lastYearStartDate = (new Date().getMonth()) > 2 ?  `04/01/${new Date().getFullYear() - 1}` : `04/01/${new Date().getFullYear() - 2}`;
	lastYearEndDate = (new Date().getMonth()) > 2 ?  `03/31/${new Date().getFullYear()}` : `03/31/${new Date().getFullYear() - 1}`;

	constructor(private storage: StorageServiceAAA,private platform: Platform, private clientService: ClientTradesService, public toast: ToasterService, private commonService: CommonService) { }
	ngOnInit() {
		this.maxDate = moment();
		this.getAMCList();
		
		this.clientDetails = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || '{}') : null;
		if (!this.platform.is('desktop')) {
			if (this.typeOfClient) {
				this.searchValue = this.clientDetails.ClientCode;
			} else {

				this.searchValue = localStorage.getItem('cliData') ? JSON.parse(localStorage.getItem('cliData') || '{}').search : '{}';
				this.typeOfClient = localStorage.getItem('cliData') ? JSON.parse(localStorage.getItem('cliData') || '{}').type : '{}';
			}
		}
		this.selectedReportType = this.reportTypeData[0]['value'];
		this.currentMonthStart = moment(this.commonService.getToday(new Date(moment().startOf('month').format('DD/MM/YYYY')))).format('DD/MM/YYYY');
		this.prevMonthFirstDate = moment(this.commonService.getToday(new Date(new Date().getFullYear() - (new Date().getMonth() > 0 ? 0 : 1), (new Date().getMonth() - 1 + 12) % 12, 1))).format('DD/MM/YYYY');
		this.prevMonthLastDate = moment(this.commonService.getToday(new Date(new Date().getFullYear(), new Date().getMonth(), 0))).format('MM/DD/YYYY');
	}


	ngOnChanges() {
		this.showError = undefined;
		this.AMCType = undefined;
	} 

	/**
	 * On custom date range changed.
	 */
	dateChange(ev: any) {
		if (ev && ev.startDate != undefined || ev.startDate != null || ev.endDate != undefined || ev.endDate != null) {
			this.customSt = this.commonService.getToday(new Date(ev.startDate));
			this.customEnd = this.commonService.getToday(new Date(ev.endDate));
		}
	}

	/**
	 * On radio button changed.
	 * @param val 
	 */
	onItemChange(val: any) {
		this.showNote = false;
		this.showError = undefined;
		this.radioType = val;
		if (this.radioType === 'amc3') {
			this.showNote = true;
		}
	}
	/**
	 * On AMC changed.
	 */
	amcChange(ev: any) {
		this.AMCProvider = ev.AMCProvider;
		this.showError = undefined;
	}

	/**
	 * To construct payload object & token value.
	 */
	onDownloadClick() {
		this.dataLoad = true;
		this.showError = undefined;
		let clevertapString = localStorage.getItem('typeOC') + 'AMC_Downloaded';
		this.commonService.setClevertapEvent(clevertapString);
		if (this.radioType === 'amc1') {
			// this.fromDate = moment(new Date(moment().startOf('month').format('MM/DD/YYYY'))).format('MM/DD/YYYY');
			this.fromDate = this.currentYearStartDate;
			this.toDate = moment(new Date()).format('MM/DD/YYYY');
		} else if (this.radioType === 'amc2') {
			// this.fromDate = moment(new Date(new Date().getFullYear() - (new Date().getMonth() > 0 ? 0 : 1), (new Date().getMonth() - 1 + 12) % 12, 1)).format('MM/DD/YYYY');
			// this.toDate = moment(new Date(new Date().getFullYear(), new Date().getMonth(), 0)).format('MM/DD/YYYY');
			this.fromDate = this.lastYearStartDate;
			this.toDate = this.lastYearEndDate;
		} else if (this.radioType === 'amc3') {
			this.fromDate = moment(this.selectedCustomDate.startDate).format('MM/DD/YYYY');
			this.toDate = moment(this.selectedCustomDate.endDate).format('MM/DD/YYYY');
		}
		if (this.AMCType && this.fromDate && this.toDate && this.fromDate != '"Invalid date"' && this.toDate != "Invalid date") {
			let submission: any = {
				OrderRequesterCode: localStorage.getItem('userId1'),
				Fromdt: this.fromDate,
				Todt: this.toDate,
				Sttype: this.AMCType,
				Soutput: "S",
				PanNo: this.searchValue,
				ClientCode: this.typeOfClient === 'offlineClients' ? '' : this.searchValue,
				EmailID: "sinkaromkar@gmail.com"
			}
			submission = this.typeOfClient === 'offlineClients' ? submission : _.omit(submission, ['PanNo', 'EmailID']);
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.getAMCReport(submission, token);
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.getAMCReport(submission, token);
					})
				}
			})
		} else {
			this.dataLoad = false;
			if (!this.AMCType) {
				this.toast.displayToast('Please select AMC');
			} else {
				this.toast.displayToast('Please select Date');
			}
		}
	}

	/**
	 * To call API and download AMC statement.
	 * @param submission 
	 * @param token 
	 */
	getAMCReport(submission: any, token: string) {
		this.clientService.getAmcStatementReport(submission, token)
			.subscribe((res: any) => {
				if (res['Status'] === '0') {
					if (this.AMCProvider === 'K' && res['Filedata']) {
						if (this.platform.is('mobileweb')) {
							const byteCharacters = atob(res['Filedata']);
							const byteNumbers = new Array(byteCharacters.length);
							for (let i = 0; i < byteCharacters.length; i++) {
								byteNumbers[i] = byteCharacters.charCodeAt(i);
							}
							const byteArray = new Uint8Array(byteNumbers);
							const blobdata = new Blob([byteArray], { type: 'application/pdf' });
							const fileName = "sharedReport.pdf";
							saveAs(blobdata, fileName);
						} else if (this.platform.is('desktop')) {
							this.commonService.convertDownloadpdf(res['Filedata']);
						} else {
							this.commonService.saveAndOpenPdf(res['Filedata']);
						}
					} else if (res && res['Checksumdetails'] && this.AMCProvider === 'C') {
						const key = CryptoJS.enc.Utf8.parse('IIFV2SPBNI118881');
						const iv1 = CryptoJS.enc.Utf8.parse('IIFV2SPBNI118881');
						const decrypted = CryptoJS.AES.decrypt(res['Checksumdetails'], key, {
							keySize: 16,
							iv: iv1,
							mode: CryptoJS.mode.ECB,
							padding: CryptoJS.pad.Pkcs7
						});
						const parser = new DOMParser();
						const doc3 = parser.parseFromString(decrypted.toString(CryptoJS.enc.Utf8), "text/html");
						const x: any = doc3.getElementById('PostForm') as HTMLFormElement;
						let obj: any = {};
						for (let i = 0; i < x['length']; i++) {
							obj[x['elements'][i]['name']] = x['elements'][i]['value'];
						}
						var mapForm = document.createElement("form") as HTMLFormElement;
						mapForm.target = "_blank";
						mapForm.method = "POST";
						mapForm.action = 'https://soa.camsonline.com/InvestorServices/COL_SOADistributionReq.aspx';
						Object.keys(obj).forEach(function (param) {
							var mapInput = document.createElement("input");
							mapInput.type = "hidden";
							mapInput.name = param;
							mapInput.setAttribute("value", obj[param]);
							mapForm.appendChild(mapInput);
						});
						document.body.appendChild(mapForm);
						mapForm.submit();
					}
				} else {
					this.showError = res['Message'];
				}
				this.dataLoad = false;
			})
	}

	goBack() {
		window.history.back();
	}

	/**
	 * To get token for AMC list.
	 */
	getAMCList() {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getList(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getList(token);
				})
			}
		})
	}

	/**
	 * To call API and get AMC.
	 * @param submission 
	 * @param token 
	 */
	getList(token: string) {
		this.clientService.getAMCData(token)
			.subscribe((res: any) => {
				if (res && res['AMCList']) {
					this.amcList = res['AMCList'];
				}else{
					this.amcList = [];
				}
			})
	}
}