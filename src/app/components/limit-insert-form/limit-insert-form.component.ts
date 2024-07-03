import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Platform, ModalController } from '@ionic/angular';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject, Subscription,  } from 'rxjs';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-limit-insert-form',
	providers: [WireRequestService, ToasterService, DashBoardService],
	templateUrl: './limit-insert-form.component.html',
	styleUrls: ['./limit-insert-form.component.scss'],
})
export class LimitInsertFormComponent implements OnInit {
	@Output() passLimitFieldInput = new EventEmitter<any>();
	@Output() passClientIdFieled = new EventEmitter<any>();
	@Input() passClientId: any = null;
	@Input() passClientIdValidation: any;
	device:any;
	clientCodeList:any;
	dataLoad:boolean = true;
	public segmentData: any[] = [
		{ segment: 'TT', value:'TT' },
		{ segment: 'Non TT', value:"NONTT" },
	]
	clientId:any;
	public marginRequirementData: any[] = [
		{ marginRequirement: 'Intraday Margin' },
		{ marginRequirement: 'CMS Updated' },
		{ marginRequirement: 'Cheque will be collected' },
		{ marginRequirement: 'Stock transfer from outside DP' },
		{ marginRequirement: 'Family accounts' }
	]
	limitform: any = {};
	limitformError: any = {
		ActualLimit: '',
		ReqLimit: '',
		ReqRemark: ''
	}
	public isListVisible: boolean = false;
	private clientSearchTerms = new Subject<string>();
	allClients: any[] = [];
	dtLoad: boolean = false;
	public clientSearchValue: any = null;

	constructor(private wireReqService: WireRequestService, private dashBoardService:DashBoardService,
		private storage: StorageServiceAAA, public toast: ToasterService, private commonService:CommonService, private router: Router, private platform: Platform) { }
	fields: any = {};
	formError: boolean = false;
	isDropDownVisible:boolean = false;
	clientIdLimitErrMsg = "Client ID is required"
	Loadvalue: boolean = false;
	inputattr: boolean = false;


	ngOnInit() {
		// console.log(this.clientCodeList);
		this.limitform.MarginRequirement = null;
		this.limitform.SegmentID = null;


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

	ionViewWillEnter() {
		this.storage.get('setClientCodes').then((clientCodes) => {
			this.clientCodeList = clientCodes;
		})
		//this.clientCodeList = JSON.parse(localStorage.getItem("clientListWireRequest"));
		if (!this.platform.is('desktop')) {
			this.passClientIdValidation = true;
		}
	}
	// changes in client ID with type
	inputChange(event: any, validate?: any) {
		// console.log(validate);
		this.passLimitFieldInput.next({ data: this.limitform, validate: validate });
	}
	// allows numbers only in text field
	numberOnly(event: any): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;

	}

	goBack(){
	 //this.router.navigate(['/wire-requests']);
	 	window.history.back();

	}

	limitChangeRedirect(){
		this.router.navigate(['/view-reports'],{ queryParams: {report: 'LimitChange'}});
	}

	submitLimitForm(formvalid: any) {
		// if(formvalid == false){
		// 	return;
		// }
		if( Number(this.limitform.ActualLimit)  < Number(this.limitform.ReqLimit)){
			this.toast.displayToast('Request Limit cannot be more than Limit Request')
		}
		else{
			this.dataLoad = false;

			this.storage.get('userID').then((userID) => {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.submitRequest(token, userID)
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.submitRequest(token, userID)
					})
				}
			})
			})	
			
		}
		

	}


	// validae the form at server side
	submitRequest(token: any, userId: any) {
		let clientObj = { clientID: this.passClientId};
		let obj = { ...this.limitform, ...clientObj };
		// console.log(obj);
		this.commonService.setClevertapEvent('Limit_Insert_Report');
		this.commonService.analyticEvent('Limit_Insert_Report', 'Wire Reports');
		this.wireReqService.limitedValidator(token, obj, userId).subscribe((res: any) => {
			if (res['Head']['ErrorCode'] == 0 && res['Body']['ErrorCode'] == 0) {
				this.submitLimitInsert(token, obj, userId)
			}
			else {
				this.dataLoad = true;
				this.toast.displayToast(res['Body']['ErrorDesc']);
			}
		})

	}


	inputClientId(event: any) {
		// console.log(event);
		if ( event === undefined ||  event == null) {
			this.clientIdLimitErrMsg = "Client ID is required";
			this.passClientIdValidation = false;
		} else {
			this.clientIdLimitErrMsg = "";
			this.passClientIdValidation = true;
		}
		
   }


	// submit the form after validation
	submitLimitInsert(token: any, obj: any, userId: any) {
		let caseId = this.commonService.getRandomInt(100000, 999999999);
		this.wireReqService.limitedInsert(token, obj, caseId, userId).subscribe((res: any) => {
			this.dataLoad = true;
			if (res['Head']['ErrorCode'] == 0 && res['Body']['ErrorCode'] == 0) {
				this.toast.displayToast("Limit Request has been Inserted Successfully");
				setTimeout(() => {
					this.limitform = {
						ActualLimit:'',
						ReqLimit:'',
						ReqRemark:'',
						SegmentID:null,
						MarginRequirement: null
					}
					this.passClientId = null;
					this.passClientIdFieled.emit(this.passClientId)
				}, 400);
			}
			else {
				this.toast.displayToast(res['Body']['ErrorDesc']);
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
			this.onCancel()
		}
	}

	hideDropDown() {
	
		setTimeout(() => {
			this.isListVisible = false;
		}, 300);
	}
	displayClientDetails(data: any) {
		this.limitform.passClientId = data.ClientCode.split('-')[0].trim();
		this.clientId = data.ClientCode;
		this.clientIdLimitErrMsg = "";
		this.passClientIdValidation = true;
	}
	onCancel(){
		this.clientIdLimitErrMsg = "Client ID is required";
		this.passClientIdValidation = false;
		this.clientSearchValue=null;
		this.clientId = null;
	}


}
