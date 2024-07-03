import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'app-sip-revenue-calculator',
	templateUrl: './sip-revenue-calculator.component.html',
	styleUrls: ['./sip-revenue-calculator.component.scss'],
})
export class SipRevenueCalculatorComponent implements OnInit {
	isFocus1: boolean = false;
	isFocus2: boolean = false;
	isFocus3: boolean = false;
	isFocus4: boolean = false;
	isFocus5: boolean = false;
	inputField: boolean = false;
	inputField1: boolean = false;
	inputField2: boolean = false;
	inputField3: boolean = false;
	inputField4: boolean = false;

	SipNoLength!:number;
	SipAmountLength!:number;
	public noOfSip = 20;
	public sipAmount = 5000;
	public years = 3;
	public monthlyReturn = 10;
	public trailPer = 0.80;
	
	public yearlyRevenue: any[] = [];
	public expectedAmount: any;

	constructor(private modalController: ModalController) { }

	ngOnInit() { }

	public goBack() {
	  window.history.back();
	}

	// async dismiss() {
	// 	await this.modalController.dismiss();
	// }


	submit() {
		// this.successfull();
		// this.calculateRevenue(5000,20,3,10 / 1200,0.008,0 / 100);
	}

	focus1() {
		this.isFocus1 = true;
	}

	focusOut1() {
		this.isFocus1 = false;
	}

	focus2() {
		this.isFocus2 = true;
	}

	focusOut2() {
		this.isFocus2 = false;
	}

	focus3() {
		this.isFocus3 = true;
	}

	focusOut3() {
		this.isFocus3 = false;
	}

	focus4() {
		this.isFocus4 = true;
	}

	focusOut4() {
		this.isFocus4 = false;
	}

	focus5() {
		this.isFocus5 = true;
	}

	focusOut5() {
		this.isFocus5 = false;
	}

	public clearValues() {
		this.noOfSip = 20;
		this.sipAmount = 5000;
		this.years = 3;
		this.monthlyReturn = 10;
		this.trailPer = 0.80;
	}

	public resetValues() {
		this.clearValues();
		this.expectedAmount = null;
		this.yearlyRevenue = [];

	}

	public calculateRevenue() {
		this.expectedAmount = null;
		this.yearlyRevenue = [];
		
		let totalTrail = 0;
		let resultValue = 0;
		let totalReturnValue = 0;
		let totalUpfront = 0;
		let sumOfResultValue = 0;
		const upfront = 0 / 100;

		let j = 0;
		for (var i = 1; i <= +this.years * 12; i++) {

			let investedAmt = ((i * +this.sipAmount) + totalReturnValue);
			let returnValue = (investedAmt * +((Number(this.monthlyReturn) / 1200).toFixed(3)));
			let totalVal = (investedAmt + returnValue);
			totalReturnValue = (totalReturnValue + returnValue);

			let trail = (totalVal * +this.noOfSip * +this.trailPer / 12);


			totalTrail = totalTrail + trail;
			totalUpfront = (totalUpfront + (+this.sipAmount * +this.noOfSip * upfront));
			resultValue = totalTrail + totalUpfront;
			if ((i % 12) == 0) {
				sumOfResultValue = sumOfResultValue + resultValue;
				j = this.updateUIWithRevenue(resultValue, j); // resultValue is the year wise value do roundoff to display
				totalTrail = 0;
				totalUpfront = 0;
			}
		}
		this.expectedAmount = (sumOfResultValue / 100);
		return sumOfResultValue;
	}

	private updateUIWithRevenue(totalTrail: any, j: any) {
		this.yearlyRevenue.push({
			duration: 'YEAR ' + ++j,
			amount: Math.ceil(totalTrail / 100)
		})
		return j;
	}

	// SIP no validation on input Field
	public changeSipNo(event: any, sipNovalidate: any) {
		this.inputField = false;
		if(sipNovalidate.viewModel != null){
			this.SipNoLength = (sipNovalidate.viewModel).toString().length;
		}
		
		if (sipNovalidate.viewModel == null || !this.isNotInt(sipNovalidate.viewModel) || sipNovalidate.viewModel < 0 ||  this.SipNoLength > 8) {
			this.inputField = true;
		}
	}

	// SIP amount validation input
	public changeAvgSip(event: any, avgSipvalidate: any) {
		this.inputField1 = false;
		if(avgSipvalidate.viewModel != null){
			this.SipAmountLength = (avgSipvalidate.viewModel).toString().length;
		}
		
		if (avgSipvalidate.viewModel == null || !this.isNotInt(avgSipvalidate.viewModel) || avgSipvalidate.viewModel < 0 ||  this.SipAmountLength > 10) {
			this.inputField1 = true;
		}
	}
	// Tenure SIP validation on input Field
	public changeTenureSip(event: any, tenureSip: any) {
		this.inputField2 = false;
		if (tenureSip.viewModel == null || !this.isNotInt(tenureSip.viewModel) || tenureSip.viewModel < 0 || tenureSip.viewModel > 5) {
			this.inputField2 = true;
		}
	}
	// Exchange Return validation on input Field
	public changeExReturn(event: any, exReturnValidate: any) {
		this.inputField3 = false;
		if(exReturnValidate.model == null  || exReturnValidate.viewModel < 0 || this.checkDecimal(exReturnValidate.viewModel) > 3 || exReturnValidate.viewModel > 100 ){
			this.inputField3 = true;
		}
	}
	// Trail Return validation on input Field
	public changeTrailReturn(event: any, trailValidate: any) {
		this.inputField4 = false;
		if(trailValidate.model == null  || trailValidate.viewModel < 0 || this.checkDecimal(trailValidate.viewModel) > 3 || trailValidate.viewModel > 2){
			this.inputField4 = true;
		}
	}

	// Only For Integer Value
	isNotInt(n: any) {
		return Number(n) === n && n % 1 === 0;
	}

	// Check the Decimal Digits
	checkDecimal(value: any) {
		if (Math.floor(value) !== value && value != null)
			return value.toString().split(".")[1].length || 0;
		return 0;
	}

}
