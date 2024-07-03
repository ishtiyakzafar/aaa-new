import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
// import * as moment from "moment";

@Component({
	selector: 'app-sip-calculator',
	templateUrl: './sip-calculator.component.html',
	styleUrls: ['./sip-calculator.component.scss'],
})
export class SipCalculatorComponent implements OnInit {

	isFocus1: boolean = false;
	isFocus2: boolean = false;
	isFocus3: boolean = false;
	isFocus4: boolean = false;
	isFocus5: boolean = false;
	public yearlyRevenue: any[] = [
		{ duration: 'Investment Amount', amount: '5,398' },
		{ duration: 'Wealth Gained', amount: '48,397' },
	];

	public sipAmount = 5000;
	public investYear = 3;
	public rateOfReturn = 15;
	public yearlyPercent: any;
	public lumpsumAmt: any;
	inputField1: boolean = false;
	inputField2: boolean = false;
	inputField3: boolean = false;
	inputField4: boolean = false;
	inputField5: boolean = false;

	public expectedAmount: Number = 0;
	public wealthGained: Number = 0;
	public investAmount: Number = 0;
	constructor(private modalController: ModalController,
		private commonService: CommonService) { }

	ngOnInit() {
		// this.calculate(5000,15,36);
	}

	public goBack() {
	  window.history.back();
	}

	// async dismiss() {
	// 	await this.modalController.dismiss();
	// }




	submit() {
		// this.successfull();
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

	rangeSelected(event: any) {
		console.log(event);

	}

	calculate() {
		/* let newrate = +this.rateOfReturn / 1200
		let odemif = (this.sipAmount * +this.investYear)
		let revisedemiz = this.futureValue(newrate, +this.investYear, this.sipAmount, 0, 1)
		let amtemif = Math.abs(revisedemiz)
		let gainAmt = amtemif - odemif
		const ExpectedAmount = this.commonService.formatNumberComma(Math.round(amtemif));
		const AmountInvested = this.commonService.formatNumberComma(Math.round(odemif));
		const WealthGain = this.commonService.formatNumberComma(Math.round(gainAmt));

		this.expectedAmount = ExpectedAmount;
		this.investAmount = AmountInvested;
		this.wealthGained = WealthGain; */

		/* const newValue = P * Math.pow(( 1+ r/n ),(n * t))  +  PMT * ((Math.pow((1 + r/n) , (n * t)) - 1) / (r/n)) */

		// let P = 5000, PMT = 100 , r = 5/100 , n = 12, t = 10;
		// const oldPMT = 100;
		// let updatedValue = 0;
		// let simpleInterest = P * Math.pow(( 1+ r/n ),(n * t)); 
		// for(var i = 0 ; i < t; i++) {
		// 	let year = 1;
		// 	// if ( i > 0) {
		// 		PMT = PMT + ((oldPMT * 10) / 100);
		// 	// }
		// 	console.log(PMT, 'PMT');

		// 	const newValue = PMT * ((Math.pow((1 + r/n) , (n * year)) - 1) / (r/n));

		// 	updatedValue = updatedValue + newValue;
		// 	console.log(updatedValue, 'updatedValue');

		// }
		// console.log(updatedValue + simpleInterest);
		this.some();


		// console.log(P * Math.pow(( 1+ r/n ),(n * t)));
		// console.log(PMT * ((Math.pow((1 + r/n) , (n * t)) - 1) / (r/n)));

		// const newValue = P * Math.pow(( 1+ r/n ),(n * t))  +  PMT * ((Math.pow((1 + r/n) , (n * t)) - 1) / (r/n))

	}

	private futureValue(rateevent: any, nperevent: any, pmtevent: any, pvevent: any, typeevent: any) {
		// let P = 5000, PMT = 100 , r = 5/100 , n = 12, t = 10;
		// const newValue = P * (1+r/n)^(n * t)  +  PMT * (((1 + r/n)^(n * t) - 1) / (r/n))
		// console.log(newValue);

		/* const pow = Math.pow(1 + rate, nper)
		let fv;

		if (rate > 0) {
			fv = pmt * (1 + rate * type) * (1 - pow) / rate - pv * pow
			fv = P(1+r/n)^(nt) ] + [ PMT × (((1 + r/n)^(nt) - 1) / (r/n))
		} else {
			fv = (-1 * (pv + pmt * nper))
		}
		
		return Math.round(fv) */
	}

	public reset() {
		this.sipAmount = 5000;
		this.investYear = 3;
		this.rateOfReturn = 15;
		this.lumpsumAmt = null;
		this.yearlyPercent = null;

		this.clearValues();
	}

	public clearValues() {
		this.expectedAmount = 0;
		this.investAmount = 0;
		this.wealthGained = 0;
	}

	public some() {

		this.clearValues();

		// let p = Number(this.lumpsumAmt),
		// r = Number(this.rateOfReturn)/100,
		// n = 12,
		// t = Number(this.investYear);
		// this.wealthGained = Math.floor(p * Math.pow(1 + (r / n), n * t));
		// let sip = +this.sipAmount;
		// let inc = sip * Number(this.yearlyPercent) / 100;

		// let finalValue = 0;

		// // let inc = 100 * 10 / 100;
		// for (var i = 1; i <= t; i++) {

		// 	if (i > 1) {
		// 		// sip = sip + inc;
		// 		sip = sip + inc;
		//     }
		// 	this.investAmount = +this.investAmount + (sip * n)

		// 	let interest = Math.floor(sip * ((Math.pow(1 + (r / n), n * 1) - 1) / (r / n)));
		// 	// console.log(interest);

		// 	finalValue = finalValue + interest;
		// 	// this.expectedAmount = Math.floor(sip * ((Math.pow(1 + (r / n), n * i) - 1) / (r / n)));
		// 	// console.log(+this.wealthGained + Number(finalValue),'==============', finalValue);
		// }

		// this.investAmount = Math.floor(+this.investAmount + p) ;
		// this.expectedAmount = +this.wealthGained + +this.investAmount + finalValue;


		// let p = Number(this.lumpsumAmt); //initial amt 5000
		// let sip = +this.sipAmount; //sip amount 500
		// let r = Number(this.rateOfReturn)/100; // rate of interest 0.12
		// let n = 12;
		// let t = Number(this.investYear); //tenure 2
		// let simple_interest = p * Math.pow(1 + (r / n), n * t);
		// console.log(simple_interest);
		// let inc = sip * Number(this.yearlyPercent) / 100;
		// let finalinterest = 0;
		// for (var i = 1; i <= t; i++) {
		// 	if (i > 1) {
		// 		sip = sip + inc;
		// 	}

		// 	this.investAmount = Math.floor(+this.investAmount + (sip * n));

		// 	let interest = sip * ((Math.pow(1 + (r / n), n * 1) - 1) / (r / n));
		// 	//for the first year you earn 2000
		// 	//sip changes and increase by 10 perce
		// 	//second yeat you earn 3k total earn 2+3 k
		// 	//total earn = 1 year + 1 year + 1 year
		// 	//=2+3+4
		// 	// console.log(interest, 'interest');

		// 	finalinterest = finalinterest + interest;
		// }
		// // console.log(simple_interest , finalinterest); //total interst earn

		// this.investAmount = Math.floor(+this.investAmount + p) ;

		// this.expectedAmount = simple_interest + finalinterest;

		// this.wealthGained = +this.expectedAmount - Number(this.investAmount);
		// console.log(this.investAmount , 'investamt', this.expectedAmount, 'expeccted amt', this.wealthGained, 'wealth gained'); // expected value

		let balance = +this.lumpsumAmt;
		let month = this.investYear * 12;
		let _sip = +this.sipAmount;
		let rate_month = +this.rateOfReturn / 12; //month rate
		let _inc = _sip * (+this.yearlyPercent) / 100;
		let totalmoney = +this.lumpsumAmt;
		for (let i = 1; i <= month; i++) {
			if (i != 1 && i % 12 == 1) {
				_sip = _sip + _inc;
			}
			totalmoney = totalmoney + _sip;
			balance = balance + _sip;
			let interest = balance * (rate_month / 100);
			balance = balance + Math.round(interest);

		}

		this.investAmount = totalmoney;
		this.expectedAmount = Math.floor(balance);
		this.wealthGained = balance - totalmoney;
		
		// System.out.println(balance); //total balance
		// System.out.println(totalmoney); //total money added
	}

	dummy() {
		let investmentAmt = 0;
		let p = 5000, r = 5 / 100, n = 12, t = 10;
		let simple_interest = p * Math.pow(1 + (r / n), n * t);
		let sip = 100;
		const sip2 = 100;
		let inc = 100 * 10 / 100;
		let interest = 0;
		for (var i = 1; i <= t; i++) {

			if (i > 1) {
				// sip = sip + inc;
				sip = sip + n;
			}
			investmentAmt = investmentAmt + (sip * n)
			interest = sip * ((Math.pow(1 + (r / n), n * i) - 1) / (r / n));
		}
		// console.log(investmentAmt + p + sip2, 'invest amount', investmentAmt + p - sip2);
		// console.log(interest, 'expected amount');
		// console.log(simple_interest, 'wealth gained');

	}
	// Validation for sip Amount input field on keypress
	public changesipAmount(event: any, sipAmountvalidate: any) {
		this.inputField1 = false;

		if (sipAmountvalidate.model == null || !this.isNotInt(sipAmountvalidate.model) || sipAmountvalidate.viewModel < 500 || sipAmountvalidate.viewModel > 1000000) {
			this.inputField1 = true;
		}

	}
	// Validation for Invest Amount input field on keypress
	public invAmountAmount(event: any, invYeartvalidate: any) {
		this.inputField2 = false;
		if (invYeartvalidate.model == null || invYeartvalidate.viewModel < 0.5 || invYeartvalidate.viewModel > 24 || this.checkDecimal(invYeartvalidate.viewModel) > 2) {
			this.inputField2 = true;
		}
	}
	// Validation for Exchange Return input field on keypress
	public exRateReturn(event: any, rateReturnValidate: any) {
		this.inputField3 = false;
		if (rateReturnValidate.model == null || rateReturnValidate.viewModel < 6 || rateReturnValidate.viewModel > 35 || this.checkDecimal(rateReturnValidate.viewModel) > 2) {
			this.inputField3 = true;
		}
	}
	// Validation for year Increase perct input field on keypress
	public yearPerctValidate(event: any, yearIncValidate: any) {
		this.inputField4 = false;
		if(yearIncValidate.viewModel < 1 || yearIncValidate.viewModel > 100){
			this.inputField4 = true;
		}
	}
	 // Validation for Initial Investment input field on keypress
	public initInvestment(event: any, InitInvestValidate: any) {
		this.inputField5 = false;
		if(InitInvestValidate.viewModel < 0 || InitInvestValidate.viewModel > 10000000 ){
			this.inputField5 = true;
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
