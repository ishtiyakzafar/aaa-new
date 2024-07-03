import { Component, OnInit, ElementRef, Renderer2, Inject, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from "@angular/common";
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {CodeInputComponent} from 'angular-code-input';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { ToasterService } from '../../helpers/toaster.service';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';


@Component({
	selector: 'client-acc-details',
	providers: [WireRequestService, ClientTradesService, CustomEncryption],
	templateUrl: './client-account-details.component.html',
	styleUrls: ['./client-account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit {
	@ViewChild('codeInput') codeInput !: CodeInputComponent;

	displayMemberContent:boolean = true;
	clientId:any;
	nscSegments = [
		{name:'Cash', status: false},
		{name:'Derivative', status: false},
		{name:'Currency', status: false},
		{name:'Commodity', status: false},
	]
	bscSegments = [
		{name:'Cash', status: false},
		{name:'Derivative', status: false},
		{name:'Currency', status: false},
		{name:'Commodity', status: false},
	]
	mcxSegments = [
		{name:'Derivative', status: false},
		{name:'Commodity', status: false},
	]
	ncdexSegments = [
		{name:'Derivative', status: false},
		{name:'Commodity', status: false},
	]
	otpInput:any;
	memberClientCode:any;
	selectRelation:any;
	tokenValue:any;
	checkOtp:any;
	userIdValue:any;
	dataLoad?:boolean;
	display1:boolean = false;
	display2:boolean = false;
	display3:boolean = false;
	verifyBtn:boolean = true;
	displayTabs:boolean = true;
	jointHolders: any = [];

	portfolioToken:any;
	portfolioId:any;
	portfolioUserId:any;
	private subscription: Subscription = new Subscription();
	constructor(private router: Router, private renderer: Renderer2, private elem: ElementRef,private wireReqService: WireRequestService,private route: ActivatedRoute,private storage: StorageServiceAAA,
		@Inject(DOCUMENT) private document: any,	//Document,
		 private clientService: ClientTradesService,
		 private ciphetText: CustomEncryption, public toast: ToasterService) { }

	
	ngOnInit() {
		localStorage.setItem('saveClientId', 'true');
		this.subscription = new Subscription();
		this.route.params.subscribe(params => {
			this.clientId =	params['id'];
		});
		if(location.pathname.includes('portfolio')){
			this.portfolioToken = '.ASPXAUTH='+localStorage.getItem('portfolioToken');
			this.portfolioUserId = ""
			this.portfolioId = localStorage.getItem('portfolioId');
			if(!(this.portfolioToken && this.portfolioId)){
				this.router.navigate(['/not-found']);
				return;
			}
		}

		if(location.pathname.includes('account')){
			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('userID').then((userId) => {
						this.storage.get('bToken').then(token => {
							this.portfolioToken = token;
							this.portfolioUserId = this.ciphetText.aesEncrypt(userId);
						
						})
					})
				
				} else {
					this.storage.get('subToken').then(token => {
						this.storage.get('userID').then((userId) => {
							this.portfolioToken = token;
							this.portfolioUserId = this.ciphetText.aesEncrypt(userId);
						})
						
					})
				}
	
			})
		}

		setTimeout(() => {
			this.clientProfileDetails(this.portfolioToken);
			this.getFamilyDropdown();
		}, 1000);

		
		
		localStorage.removeItem('saveOtp');
		localStorage.removeItem('memberCount');
	}

	profileDetails:any = [];
	clientName:any;
	clientMobNo:any;
	clientEmail:any;
	DpDetails:any[] = [];
	activeSegment:any;
	familyMappList:any[] = [];
	
	getFamilyDropdown() {
		let clientID = this.ciphetText.aesEncrypt(this.clientId);
		this.subscription.add(
			this.clientService.getFamilyMapping(this.portfolioToken, clientID, this.portfolioUserId)
				.subscribe((res: any) => {
					if(res['Head']['ErrorCode'] == 0){
						this.dataLoad = false;
						if(res['Body']['FamillyMapp'].length > 0){
							if(res['Body']['FamillyMapp'][0]['Successflag'] == 'N'){
								this.familyMappList = [];
							}
							else{
								this.familyMappList = res['Body']['FamillyMapp'];
								this.familyMappList.forEach(element => {
									element.Relation = element.Relation && element.Relation.length >  0 ? element.Relation : 'SELF';
								})
								localStorage.setItem('memberCount', JSON.stringify(this.familyMappList));
							}
							
						}
						else{
							this.familyMappList = [];
						}
						
					}
				}, (error: any) => {
					this.familyMappList = [];
					this.dataLoad = false;
				})
		)
	}

	clientProfileDetails(token: any){
		this.dataLoad = true;
		var obj =  {"UserCode": this.clientId,"UserType": "4"}
    	 this.wireReqService.getProfileDetails(token, obj).subscribe((res: any) => {
		 	if(res['Head']['ErrorCode'] == 0){
				this.displayTabs = true;
				this.dataLoad = false;
				this.profileDetails = res['Body'];
				this.clientName = this.profileDetails['ClientName'];
				this.clientMobNo = this.profileDetails['ClientMobileNo'];
				this.clientEmail = this.profileDetails['ClientEmail'];
				this.DpDetails = this.profileDetails['DP'];
				this.activeSegment = this.profileDetails['ActiveSegments'];
				this.nscSegments = [
					{name:'Cash', status: this.activeSegment.includes('NSECASH')},
					{name:'Derivative', status: this.activeSegment.includes('NSEFO')},
					{name:'Currency',  status: this.activeSegment.includes('NSECURRENCY')},
					{name:'Commodity',  status: this.activeSegment.includes('NSECOMMODITY')},
				]
				this.bscSegments = [
					{name:'Cash', status: this.activeSegment.includes('BSECASH')},
					{name:'Derivative', status: this.activeSegment.includes('BSEFO')},
					{name:'Currency',  status: this.activeSegment.includes('BSECURRENCY')},
					{name:'Commodity',  status: this.activeSegment.includes('BSECOMMODITY')},
				]
				this.mcxSegments = [
					{name:'Derivative', status: this.activeSegment.includes('MCXFO')},
					{name:'Commodity',  status: this.activeSegment.includes('MCXCOMMODITY')},
				]
				this.ncdexSegments = [
					{name:'Derivative', status: this.activeSegment.includes('NCDEXFO')},
					{name:'Commodity',  status: this.activeSegment.includes('NCDEXCOMMODITY')},
				]
				let array = [];
				for (let item of this.profileDetails['JointHolder']) {
					array.push({
						jointHolderName: item.JointHolder1Name,
						jointHolderPan: item.JointHolder1Pan,
					});
					array.push({
						jointHolderName: item.JointHolder2Name,
						jointHolderPan: item.JointHolder2Pan,
					});
					array.push({
						jointHolderName: item.JointHolder3Name,
						jointHolderPan: item.JointHolder3Pan,
					});
				}
			
				this.jointHolders = array.filter((item) => item.jointHolderName && item.jointHolderPan);
				const getSuffix = (ind:any) => {
					if (ind === 2) {
						return 'Second Holder';
					} else if (ind === 3) {
						return 'Third Holder';
					} else if (ind === 4) {
						return 'Fourth Holder';
					} else if (ind === 5) {
						return 'Fifth Holder';
					} else if (ind === 6) {
						return 'Sixth Holder';
					} else if (ind === 7) {
						return 'Seventh Holder';
					} else if (ind === 8) {
						return 'Eighth Holder';
					} else if (ind === 9) {
						return 'Ninth Holder';
					} else if (ind === 10) {
						return 'Tenth Holder';
					} else if (ind === 11) {
						return 'Eleventh Holder';
					} else if (ind === 12) {
						return 'Twelfth Holder';
					} else if (ind === 13) {
						return 'Thirteenth Holder';
					} else if (ind === 14) {
						return 'Fourteenth Holder';
					} else if (ind === 15) {
						return 'Fifteenth Holder';
					}
					else{
						return;
					}
				};
 
				this.jointHolders = this.jointHolders.map((item:any, index:any) => ({ ...item, title: getSuffix(index + 2) }));
			}
			else{
				this.profileDetails = [];
				this.dataLoad = false;
				this.displayTabs = false;
			}
		
			}, error => {
				this.profileDetails = [];
				this.dataLoad = false;
			})
	}
	


	tabTableContent(tabItem: any){   
		//const elements = this.document.querySelectorAll('.ac_tap');
		this.document.querySelectorAll(".ac_tap").forEach((item: any,i: any)=>{
			document.querySelectorAll(".ac_tap")[i].classList.add("d-none");
		});
		document.querySelectorAll(".ac_tap."+tabItem)[0].classList.remove("d-none");
	}

	onOtpChanged(event: any){
		this.otpInput = event
	}

	onotpFieldCompleted(event: any){
		// const btnEle = document.getElementById('verifyMemberBtn') as HTMLInputElement;
		// btnEle.disabled = false;
		this.verifyBtn = false;
	}

	addMemberForm(){
		this.document.querySelector('.addmemeberForm1').classList.remove('d-none');
		this.document.querySelector('.tableoverlay1').classList.remove('d-none');
		this.display1 = true;
		this.display2 = false;
		this.display3 = false;
		this.otpInput = null;
		this.verifyBtn = true;

	}

	addMemberFormnext(){
		if(this.memberClientCode && this.selectRelation){
			let params = {
				"Type": "Add",
				"FamilyName": this.memberClientCode,
				"MakerID": this.clientId,
				"Relation": this.selectRelation,
				"OTP":  ""
			}
			this.subscription.add(
				this.clientService.getMemberDetails(params,this.portfolioToken)
					.subscribe((res: any) => {
						if(res['Head']['ErrorCode'] == 0){
							if(res['Body']['ClientFamilyMappingDetailsMapp']){
							  let getOtpObj = res['Body']['ClientFamilyMappingDetailsMapp'].filter((obj: any) => obj.ClientCode == this.memberClientCode && obj.Status == 'Inactive');
							   this.checkOtp = getOtpObj[0]['OTP'];
							
							   localStorage.setItem('saveOtp', this.checkOtp);
							   	this.display1 = false;
								this.display2 = true;
								this.display3 = false;
							 //  this.document.querySelector('.step2').classList.remove('d-none');
							//    const ele1 = document.getElementById('clientIdFrom1') as HTMLInputElement;
							//    ele1.style.display = 'none';
							//    const ele2 = document.getElementById('otpBox1') as HTMLInputElement;
							//    ele2.style.display = 'block';
							}
						
						}
						else if (res['Head']['ErrorCode'] == 1 && res['Head']['ErrorDescription'].includes('already exist')) {
							let alredyExistClientObj = res['Body']['ClientFamilyMappingDetailsMapp'].filter((obj: any) => obj.ClientCode == this.memberClientCode && obj.Status == 'Inactive');
							this.resendOTP()
						}
						else{
							this.toast.displayToast(res['Head']['ErrorDescription']);
						}
					})
			)
		}
		else{
			this.toast.displayToast('Please select input value')
		}
	}

	resendOTP(){
		let params = {
			"Type": "Resend",
			"FamilyName": this.memberClientCode,
			"MakerID": this.clientId,
			"Relation": this.selectRelation,
			"OTP":  ""
		}
		this.subscription.add(
			this.clientService.getMemberDetails(params,this.portfolioToken)
				.subscribe((res: any) => {
					if(res['Head']['ErrorCode'] == 0){
						if(res['Body']['ClientFamilyMappingDetailsMapp']){
						  let getOtpObj = res['Body']['ClientFamilyMappingDetailsMapp'].filter((obj: any) => obj.ClientCode == this.memberClientCode && obj.Status == 'Inactive');
						   this.checkOtp = getOtpObj[0]['OTP'];
						
						   localStorage.setItem('saveOtp', this.checkOtp);
						   this.display1 = false;
						   this.display2 = true;
						   this.display3 = false;
						//    this.document.querySelector('.step2').classList.remove('d-none');
						//    const ele1 = document.getElementById('clientIdFrom1') as HTMLInputElement;
						//    ele1.style.display = 'none';
						}
					
					}
					else{
						this.toast.displayToast(res['Head']['ErrorDescription']);
					}
				})
			)	
	}

	closeForm() {
		this.document.querySelector('.addmemeberForm1').classList.add('d-none');
		this.document.querySelector('.tableoverlay1').classList.add('d-none');
		this.resetForm();
		this.getFamilyDropdown()
	}

	resetForm(){
		// const ele1 = document.getElementById('clientIdFrom1') as HTMLInputElement;
		// ele1.style.display = 'block';
		// const ele = document.getElementById('otpBox1') as HTMLInputElement;
		// ele.style.display = 'none';
		this.memberClientCode = null;
		this.selectRelation = null;
		this.otpInput = null;
		this.display1 = true;
		this.display2 = false;
		this.display3 = false;
		this.verifyBtn = true;
		const ele1 = document.getElementById('memberPop') as HTMLInputElement;
		ele1.style.display = 'block';

	}

	verifyMember(){
		if(this.otpInput == this.checkOtp){
			let params = {
				"Type": "Verify",
				"FamilyName": this.memberClientCode,
				"MakerID": this.clientId,
				"Relation": this.selectRelation,
				"OTP": this.checkOtp
			}
			this.subscription.add(
				this.clientService.getMemberDetails(params,this.portfolioToken)
					.subscribe((res: any) => {
						if(res['Head']['ErrorCode'] == 0){
							this.toast.displayToast(res['Body']['SuccessMsg'])
							const ele1 = document.getElementById('memberPop') as HTMLInputElement;
							ele1.style.display = 'none';
							this.display1 = false;
							this.display2 = false;
							this.display3 = true;
							// this.document.querySelector('.step3').classList.remove('d-none');
							// const ele1 = document.getElementById('memberPop') as HTMLInputElement;
							// ele1.style.display = 'none';
						}
						else{
							this.toast.displayToast(res['Body']['ErrorDescription'])
						}
					})
			)
			//this.addVerifyMember('Verify', this.checkOtp);
		
		}
		else{
			this.toast.displayToast('Invalid OTP');
		}
		
	}

	removeMember(data: any){
		let params = {
			"Type": "Delete",
			"FamilyName": data.ClientCode,
			"MakerID": this.clientId,
			"Relation": data.Relation,
			"OTP": ""
		}
		this.subscription.add(
			this.clientService.getMemberDetails(params,this.portfolioToken)
				.subscribe((res: any) => {
					if(res['Head']['ErrorCode'] == 0){
						this.toast.displayToast(res['Body']['SuccessMsg'])
						this.getFamilyDropdown();
						
					}
					else{
						this.toast.displayToast(res['Body']['ErrorDescription'])
					}
				})
		)
	}

	getShortName(value: any){
		if(value && value.length){
			var shortName = value.match(/\b(\w)/g); // ['J','S','O','N']
			return shortName.join('');
		}

	}
	// back to previous page
    back() {
		// this.storage.set('hierarchyList', this.selectOptionArr);
        window.history.back();
	}
}
