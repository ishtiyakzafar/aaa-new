import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { Platform, ModalController } from '@ionic/angular';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject, Subscription,  } from 'rxjs';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-product-activate-deactivate',
	providers: [WireRequestService, DashBoardService],
	templateUrl: './product-activate-deactivate.component.html',
	styleUrls: ['./product-activate-deactivate.component.scss'],
})
export class ProductActivateDeactivateComponent implements OnInit {
	@ViewChild('uploadFile') uploadFile!: ElementRef;
	@Input() clientCodes?: any[];
	public scanImage!: string;
	public uniqueName!: string;
	public fileBlockValue: string = 'singleClient';
	public activateBlockValue: string = 'A';
	product: any;
	productActivity: any = {};
	csvMsg: any = null;
	productList: any[] = [
		{key:'INVESTOR', productType: "Investor Plan (Online Plus)" },
		{key:'PREMIUMP', productType: "Premium Plan (Dedicated RM)" },
		{key:'SUPERTRD', productType: "Super Trader Plan (Pro Traders)" },
		{key:'IIFLFIT', productType: "Z20 Plan" },
	]
	fileToUpload: File | null = null;
	passClientId = null;
	inputattr = false;
	prodFromSubmitted:boolean = false;
	fileTobase64:any;
	dataLoad:boolean = true;
	device:any;
	public isListVisible: boolean = false;
	private clientSearchTerms = new Subject<string>();
	allClients: any[] = [];
	dtLoad: boolean = false;


	constructor(private storage: StorageServiceAAA, private wireReqService: WireRequestService, private dashBoardService:DashBoardService, public toast: ToasterService, private platform: Platform, private commonService: CommonService) {
		if (this.platform.is('desktop')) {
			this.device = 'desktop';
		}
		if (this.platform.is('mobile')) {
			this.device = 'mobile';
		}
	 }

	ngOnInit() {
		this.commonService.setClevertapEvent('Product_Dec_Act');
		if (!this.platform.is('desktop')) {
			//this.clientCodes = JSON.parse(localStorage.getItem("clientListWireRequest"));
			this.storage.get('setClientCodes').then((clientCodes) => {
				this.clientCodes = clientCodes;
			})
		}
		// console.log(this.clientCodes);
		this.productActivity.productName = null;
		this.productActivity.passClientId = null;

		let token = localStorage.getItem('jwt_token');
		let userID = localStorage.getItem('userId1');
		let userTypeValue = localStorage.getItem('userType');
		
		if(userTypeValue==='RM'){
			userTypeValue = 'RM';
		}else if(userTypeValue==='FAN'){
			userTypeValue = 'FN';
		}else{
			userTypeValue = 'SB';
		}
		this.clientSearchTerms
		.pipe(
			debounceTime(500),
			switchMap((searchValue) => this.dashBoardService.fetchGetClientCodes(userTypeValue, userID, token, searchValue)))
		.subscribe(results => {
			let clientData = [].concat(...results);
			const data = clientData
			.filter((element: any) => element.toString().split("-")[3].toLowerCase().trim() == "false")
			.map((client: any) => {
				return `${client.toString().split("-")[0]} - ${client.toString().split("-")[1].trim()}`;	
			});
			this.setClientSearch(data);
		});
	}

	goBack() {
		window.history.back();
	}

	upload(files: any) {
		// review removed $event.target.files from html
		files = files.target.files;

		// console.log(files);
		// console.log(files[0])
		this.uniqueName = files[0].name;
		// console.log(this.uniqueName.match(/\./g).length)
		if(this.uniqueName.match(/\./g)?.length == 1){
			if(files && files[0]){
				const max_size = 5000000;
				// const allowed_types = ['.csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
				
				if (files[0].size > max_size) {
					this.csvMsg =
						'Maximum size allowed is ' + max_size / 1000000 + 'Mb';
						this.uniqueName = "";//null;
					return false;
				}
				if ( (files[0].type).includes(".csv") || (files[0].type).includes("application/vnd.ms-excel")) {
					this.csvMsg = null;
					const reader = new FileReader();
					reader.readAsDataURL(files[0]);
					reader.onload = () => {
						// console.log(reader.result);
						this.fileTobase64 = reader.result
					};
					
				}
				else{
					this.csvMsg = 'Only csv files are allowed (csv)';
					this.uniqueName = "";//null;
					return false;
				}
			}
		}
		else{
			this.csvMsg = 'Invalid Files are not allowed';
			this.uniqueName = "";//null;
			return false;
		}
		return;

	}

	actionSegmentChanged(event: any) {
		
		// this.fileBlockValue = event;
	}

	prodSegmentChanged(event: any) {
		if(event == 'singleClient'){
			this.csvMsg = null;
			this.uniqueName = "";// null;
		}
		if(event == 'fileUpload'){
			this.productActivity.passClientId = null;
			this.productActivity.ReqRemark = null;
			this.prodFromSubmitted = false
		}
	}

	submitForm(formValid: any, productAct: any) {
		this.prodFromSubmitted = true
		if(this.fileBlockValue == 'singleClient'){
			if (formValid == false) {
				return;
			}
			this.getStorageValue('singleData')
		}

		else{
			if(productAct.controls.productName.valid){
				if(this.uniqueName == null){
					this.csvMsg = 'file upload is required'
				}
				else{
					this.getStorageValue('fileupload')
				}
			}
			
		}
	}

	getStorageValue(value: any){
		this.storage.get('userID').then((userID) => {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						if(value == 'singleData'){
							this.submitforSigle(token, userID)
						}else{
							this.submitForfileUpload(token, userID)
						}
					})
				} else {
					this.storage.get('subToken').then(token => {
						if(value == 'singleData'){
							this.submitforSigle(token, userID)
						}else{
							this.submitForfileUpload(token, userID)
						}
					})
				}
			})
		})
	}
	
	submitForfileUpload(token: any, userId: any){
		let obj = {
			clientID: "",
			productName: this.productActivity.productName,
			action: this.activateBlockValue,
			remark: "",
			isupload:"true",
			fileData: this.fileTobase64.split(',')[1]
		}
		// console.log(obj);
		this.submitProdActDecData(token, obj, userId)
	}

	submitforSigle(token: any, userId: any) {
			let obj = {
				clientID: this.productActivity.passClientId,
				productName: this.productActivity.productName,
				action: this.activateBlockValue,
				remark: this.productActivity.ReqRemark,
				isupload:"false",
				fileData:""
			}
			// console.log(obj);
		this.submitProdActDecData(token, obj, userId)
	}

	submitProdActDecData(token: any, obj: any, userId: any){
		this.dataLoad = false;	
		this.wireReqService.submitProdActDec(token, obj, userId).subscribe((res) => {
			setTimeout(() => {
				this.dataLoad = true;;
			}, 500);
			if (res['Head']['ErrorCode'] == 0) {
				this.toast.displayToast(res['Body']['ResponseStatus']);
				
				setTimeout(() => {
					this.productActivity = {
						passClientId: null,
						productName: null,
						ReqRemark: null
					}
				}, 500);

				setTimeout(() => {
					this.prodFromSubmitted = false;
				}, 1000);
				
				
			}
			else {
				this.toast.displayToast(res['Head']['ErrorDescription']);
			}
		})
	}	

	setClientSearch(res: any) {
		if (res.length) {
			let data = [];
			for (const item of res) {
				data.push({
					ClientCode: item
				})
			}
			this.allClients = data;
		} else {
			this.allClients = [];
		}
		this.dtLoad = true;
	}
	searchClient(text: any) {
		let searchValue = text.trim();
		this.isListVisible = false;
		if (searchValue && searchValue.length > 3) {
			this.dtLoad = false;
			this.isListVisible = true;
			this.clientSearchTerms.next(searchValue);
		} else {
			this.allClients = [];
		}
	}
	hideDropDown() {
		setTimeout(() => {
			this.isListVisible = false;
		}, 300);
	}
	displayClientDetails(data: any) {
		this.productActivity.passClientId = data.ClientCode.split('-')[0].trim();
	}

}
