import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { FundTransferService } from '../../pages/fund-transfer/fund-transfer.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject, Subscription,  } from 'rxjs';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { PayoutHistoryComponent } from '../payout-history/payout-history.component';

@Component({
	selector: 'app-sendto-bank',
	providers: [FundTransferService, DashBoardService],
	templateUrl: './sendto-bank.component.html',
	styleUrls: ['./sendto-bank.component.scss'],
})
export class SendtoBankComponent implements OnInit {
	@Input() equityPayoutSendToBank: any;
	@Input() equityPayoutAmount: any;
	@Input() passClientCode: any;
	@Input() isDesktop: any;
	@Output() outputClientCode = new EventEmitter<string>();
	@Output() addParentOverlay = new EventEmitter<boolean>();

	selectBankList = [
		{ bankname: "ICICI Bank", acc: "003509898914" },
		{ bankname: "SBI Bank", acc: "003509898915" },
		{ bankname: "HDFC Bank", acc: "003509898912" },
		{ bankname: "Axis Bank", acc: "003509898918" },
	]
	inputattr = false;
	clientId:any;
	bankList: any[] = [];
	selectBankNameDetail: any[] = [];
	transferBtnEnable: boolean = false;
	transferBtnEnable1: boolean = false;
	enterAmount: any;
	enterRemark: any;
	remarkLength!: number;
	dataLoad: boolean = true;
    clientCodeList:any;
	bodyClass: string = "move-fund-container";
	isAmountInvalid: boolean = false;
	//equityPayoutSendToBank:any;
	public isListVisible: boolean = false;
	private clientSearchTerms = new Subject<string>();
	allClients: any[] = [];
	dtLoad: boolean = false;
	public clientSearchValue: any = null;
	clientIdInputValidate!: boolean;
	clientIdLimitErrMsg: string = "Client ID is required";
	disableTransferBtn = true;
	constructor(private modalController: ModalController,private commonService: CommonService,private dashBoardService:DashBoardService, private fundTransferSer: FundTransferService, public toast: ToasterService, private storage: StorageServiceAAA,private platform: Platform) { }

	ngOnInit() {

		if(!this.platform.is("desktop")){
			this.storage.get('setClientCodes').then((clientCodes) => {
				this.clientCodeList = clientCodes;
			});
			this.bodyClass = "move-fund-container mb-mobile";
		}
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

	ngOnChanges(changes: any): void {

		if(this.passClientCode){
			var data = {
				"ClientCode": this.passClientCode,
				"ClientName": ""
			}
			localStorage.setItem('select_client', JSON.stringify(data))
		}

		if(this.platform.is("desktop") || this.isDesktop){

			if(changes['passClientCode'] && typeof(changes['passClientCode'].currentValue) == 'string'){
			
				this.initFundPayout();
				this.availableInnerTransfer();
				this.enterAmount = null;
				this.enterRemark = '';
				this.transferBtnEnable = false;
				this.transferBtnEnable1 = false;
			}
		}
    }

	initFundPayout() {

		this.selectBankNameDetail = [];
		this.fundTransferSer.getfundPayout(this.passClientCode).subscribe((res: any) => {
			if (res['Status'] == 0) {
				this.bankList = res['PayOutBanksEquity'];
				// console.log(this.bankList)
				this.selectBankNameDetail = this.bankList[0].BankName;
			}
		})
	}

	// availableInnerTransfer() {

	// 	this.fundTransferSer.getTotalFund(this.passClientCode).subscribe((res: any) => {
	// 		if (res['body']['Status'] == 0 && res['head']['status'] == 0){
	// 			this.equityPayoutSendToBank = res['body']['EquityPayoutAmount'];
	// 		} else{
	// 			this.toast.displayToast(res['body']['Message']);
	// 			this.equityPayoutSendToBank = this.equityPayoutSendToBank = res['body']['EquityPayoutAmount'] ? this.equityPayoutSendToBank = res['body']['EquityPayoutAmount']:"NA";
	// 		}	
	// 	})
	// }

	availableInnerTransfer() {
		this.fundTransferSer.getTotalFund(this.passClientCode).subscribe((res:any) => {
			const body = res['body'];
			const head = res['head'];
	
			setTimeout(() => {
				if (body && head && head['status'] == "0" && body['Status'] == 0) {
					this.equityPayoutSendToBank = body['EquityPayoutAmount'];
				} else {
					//const errorMessage = body ? body['Message'] : 'Unknown error';
					this.toast.displayToast(res['body']['Message']);
					this.equityPayoutSendToBank = this.equityPayoutSendToBank || "NA";
				}   
			}, 3000)
		});
	}

	splitIfscBankName(item: any, params: any) {
		if (params == 0) {
			return item.split('--->')[0]
		}
		else {
			return item.split('--->')[1]
		}

	}

	confirmWithdra() {
		this.commonService.setClevertapEvent('PayoutRequest', { 'Login ID': localStorage.getItem('userId1') });
		//this.dataLoad = true;
		this.addParentOverlay.emit(true);
		if (this.enterAmount > this.equityPayoutSendToBank) {
			return;
		} else if (this.enterRemark.length === 0 || this.remarkLength > 200) {
			return;
		} else {
			this.transferBtnEnable = false;
			this.transferBtnEnable1 = false;
			// setTimeout(() => {
			// 	this.dataLoad = true;
			// }, 1000);
			this.confirmWithrawPassToken()
		}
	
		
	}

	confirmWithrawPassToken(){
		this.storage.get('userID').then((userID) => {
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('tokenValue').then(token => {
						this.confirmSendWithraw(token, userID)
					})
				} else {
					this.storage.get('tokenValue').then(token => {
						this.confirmSendWithraw(token, userID)
					})
				}
			})
		})
						
	}

	confirmSendWithraw(token: any, userId: any){

		// this.dataLoad = false;
		this.fundTransferSer.getPayoutRequest(this.enterAmount, this.enterRemark, this.selectBankNameDetail.toString().replace(">","#"), userId, this.passClientCode, token)
		.subscribe((res: any) => {
			// this.dataLoad = true;
			this.addParentOverlay.emit(false);

			if (res['Head']['ErrorCode'] == 0){ 			//&& res['body']['status'] == 0) {
				this.toast.displayToast(res['Body']['Remark']);
			}
			else {
				this.toast.displayToast(res['Head']['ErrorDescription']);
			}
			setTimeout(() => {
				this.enterAmount = null;
				this.enterRemark = '';
				this.transferBtnEnable = false;
				this.transferBtnEnable1 = false;
			}, 1500);
		})
	}

	changeAmountValue(event: any) {
		//this.transferBtnEnable = false;
		this.isAmountInvalid = false;
		if(typeof(this.equityPayoutAmount) === 'number'){

			if(this.enterAmount != null && this.enterAmount > this.equityPayoutSendToBank){
				this.transferBtnEnable = false;
				return;
			}
	
			var ammountPattern = new RegExp(/^-?\d+\.?\d*$/);
			this.isAmountInvalid = !ammountPattern.test(this.enterAmount);
			if(this.isAmountInvalid){
				this.transferBtnEnable = false;
				return;
			} 
			
			this.transferBtnEnable = true;
		}
		// console.log(this.transferBtnEnable);
		// if (event == null || event >= this.equityPayoutSendToBank ) {
		// 	this.transferBtnEnable = false;
		// }
		// else {
		// 	this.transferBtnEnable = true;
		// }
	}

	changeRemark(event: any) {
		this.remarkLength = event.length;
		if (this.remarkLength == 0 || this.remarkLength > 200) {
			this.transferBtnEnable1 = false;
		}
		else {
			this.transferBtnEnable1 = true;
		}
	}

	async viewPayoutHistory() {
		const modal = this.modalController.create({
			component: PayoutHistoryComponent,
			//	componentProps: { "IndParams": '' },
			cssClass: 'superstars indices-details exposure-list'
		});
		return (await modal).present();
	}

	changeClientId(event: any){

        if (!this.platform.is('desktop')) {

			if(event){
				this.passClientCode = event.ClientCode;
				this.initFundPayout();
				this.availableInnerTransfer();
				this.outputClientCode.emit(event.ClientCode);
			}
			this.enterAmount = null;
			this.enterRemark = '';
			this.transferBtnEnable = false;
			this.transferBtnEnable1 = false;
        }
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
		this.passClientCode = data.ClientCode.split('-')[0].trim();
		this.clientId = data.ClientCode.split('-')[0].trim();
		this.clientIdLimitErrMsg = "";
		this.clientIdInputValidate = true;
		this.initFundPayout();
		this.availableInnerTransfer();
		this.outputClientCode.emit(this.passClientCode);
	}
	onCancel(){
		this.clientIdLimitErrMsg = "Client ID is required";
		this.clientIdInputValidate = false;
		this.passClientCode=null;
		this.clientId = null;
	}



}