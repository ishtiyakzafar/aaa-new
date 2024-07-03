import { Component, OnInit, Input } from '@angular/core';
import { FundTransferService } from '../../pages/fund-transfer/fund-transfer.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-move-funds',
	providers: [FundTransferService],
	templateUrl: './move-funds.component.html',
	styleUrls: ['./move-funds.component.scss'],
})
export class MoveFundsComponent implements OnInit {
	@Input() equityPayoutAmount: any
	@Input() mfPayoutAmount:any

	accountTr = 'ME'
	transferBtnEnable: boolean = false
	enterAmount: any;
	dataLoad: boolean = true;

	constructor(private fundTransferSer: FundTransferService, public toast: ToasterService, private storage: StorageServiceAAA) { }

	ngOnInit() {

	}

	InitPayoutAmount() {
		let clientCode = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || '{}')['ClientCode'] : "{}";
		this.fundTransferSer.getTotalFund(clientCode).subscribe((res: any) => {
			setTimeout(() => {
				this.dataLoad = true;
			}, 1000);
			if (res['body']['Status'] == 0 && res['head']['status'] == 0)
				this.equityPayoutAmount = res['body']['EquityPayoutAmount']
			this.mfPayoutAmount = res['body']['MFPayoutAmount']
		})
	}



	segmentChangedTrAccount(event: any) {
		// console.log(event)
		this.enterAmount = null;
		this.transferBtnEnable = false;
	}

	// allows numbers only in text field
	numberOnly(event: any): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;

	}


	changeAmountValue(event: any) {
		this.transferBtnEnable = false;
		// if (this.accountTr === 'EM') {
		// 	this.enterAmount != null && this.enterAmount > this.equityPayoutAmount ? this.transferBtnEnable = false : this.transferBtnEnable = true;
		// }
		// else {
			this.enterAmount != null && this.enterAmount > this.mfPayoutAmount ? this.transferBtnEnable = false : this.transferBtnEnable = true;
		// }
	}





	transferFund() {
		if (this.transferBtnEnable == true) {
			this.dataLoad = false;
			this.storage.get('userID').then((userID) => {
				this.storage.get('userType').then(type => {
					if (type === 'RM' || type === 'FAN') {
						this.storage.get('sToken').then(token => {
							this.RequestTransfer(token, userID)

						})
					} else {
						this.storage.get('subToken').then(token => {
							this.RequestTransfer(token, userID)
						})
					}
				})
			})
		}
	}

	RequestTransfer(token: any, userID: any) {
		let clientCode = localStorage.getItem('select_client') ? JSON.parse(localStorage.getItem('select_client') || '{}')['ClientCode'] : "{}";
		this.fundTransferSer.requestTransferLedger(token, this.enterAmount, this.accountTr, userID, clientCode).subscribe((res: any) => {
			if (res['body']['status'] == 0 && res['head']['status'] == 0) {
				this.InitPayoutAmount();
				this.enterAmount = null;
				this.toast.displayToast("Amount has been transferred Successfully");
			}
			else {
				this.toast.displayToast(res['body']['Msg']);
				setTimeout(() => {
					this.dataLoad = true;
				}, 1000);
			}
		})
	}
}