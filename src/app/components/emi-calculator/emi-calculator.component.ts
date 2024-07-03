import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';

@Component({
	selector: 'app-emi-calculator',
	templateUrl: './emi-calculator.component.html',
	styleUrls: ['./emi-calculator.component.scss'],
})
export class EmiCalculatorComponent implements OnInit {
	isFocus1: boolean = false;
	isFocus2: boolean = false;
	isFocus3: boolean = false;
	isFocus4: boolean = false;
	isFocus5: boolean = false;
	
	// public yearlyRevenue: any[] = [
	//   {duration: 'Principal Amount', amount: '50,000'},
	//   {duration: 'Interest Payable', amount: '3.85.411'},
	// ];

	public loanAmount = 5000000;
	public tenure = 1;
	public interestRate = 9.50;

	public totalRevenue: Number = 0;
	public interestPay: Number = 0;
	public principalAmount: Number = 0;
	public emiAmount: Number = 0;
	inputField:boolean = false;
	inputField1:boolean = false;
	inputField2:boolean = false;

	constructor(private modalController: ModalController,
		private commonService: CommonService
	) { }

	ngOnInit() { }
	

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

	calculateEMIValue() {
		const loanTenure_ = (+this.tenure * 12); // in generic terms tenure multiply by 12
		let R = (+this.interestRate / (12 * 100)); // loan interest divide by 12 * 100
		const emiAmount_ = ((+this.loanAmount * R * (this.calDvdnt(R, +loanTenure_))) / ((Math.pow(((1 + R)), +loanTenure_) - 1)));
		const interestAmount = ((+emiAmount_ * (+loanTenure_)) - (+this.loanAmount));

		this.totalRevenue = +this.commonService.numberFormatWithCommaUnit(Math.round(interestAmount) + (+this.loanAmount));
		this.interestPay = Math.round(interestAmount);
		this.principalAmount = (+this.loanAmount);
		this.emiAmount = Math.round(emiAmount_);
	}

	private calDvdnt(Rate: any, Months: any) {
		return Math.pow((1 + Rate), Months)
	}

	public resetValues() {
		this.loanAmount = 5000000;
		this.tenure = 1;
		this.interestRate = 9.50;
		this.totalRevenue = 0;
		this.interestPay = 0;
		this.principalAmount = 0;
		this.emiAmount = 0;
		//this.clearValues();
	}
	clearValues(){

	}
    // Validation for Amount Input Field
	public changeloanAmount(event: any, loanAmountvalidate: any) {
		this.inputField = false;
		if(loanAmountvalidate.model == null || !this.isNotInt(loanAmountvalidate.model) || loanAmountvalidate.viewModel < 100000 || loanAmountvalidate.viewModel > 20000000 ){
			this.inputField = true;
		}
		
	}
	// Validation for Input Tenure Field
	public changeTenure(event: any, tenurevalidate: any) {
		this.inputField1 = false;
		if(tenurevalidate.model == null  || tenurevalidate.viewModel < 1 || tenurevalidate.viewModel > 30 || this.checkDecimal(tenurevalidate.viewModel) > 2){
			this.inputField1 = true;
		}

	}
	// Validation for Input Interest Rate Field
	public changeIntRate(event: any, intValidate: any) {
		this.inputField2 = false;
		if(intValidate.model == null  || intValidate.viewModel < 1 || intValidate.viewModel > 100 || this.checkDecimal(intValidate.viewModel) > 2){
			this.inputField2 = true;
		}

	}
    // Only For Integer Value
	isNotInt(n: any){
		return Number(n) === n && n % 1 === 0;
	}
	// Check the Decimal Digits
	checkDecimal(value: any) {
		if (Math.floor(value) !== value && value != null)
			return value.toString().split(".")[1].length || 0;
		return 0;
	}
}
