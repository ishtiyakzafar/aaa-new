import { Component, OnInit, ViewChild, Input, Inject, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Chart} from 'chart.js';
import { DOCUMENT } from "@angular/common";
import { Subscription } from 'rxjs';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment';
import jsPDF from 'jspdf';
import { CustomEncryption } from '../../../config/custom-encrypt';
import { FormatNumberDecimalPipe } from '../../helpers/decimalNumber.pipe';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
	selector: 'app-client-portfolio',
	providers: [ClientTradesService, CustomEncryption, FormatNumberDecimalPipe],
	templateUrl: './client-rm-portfolio.component.html',
	styleUrls: ['./client-rm-portfolio.component.scss'],
})
export class ClientRMPortfolioComponent implements OnInit, OnChanges {
	@ViewChild('chartJSContainer1') chartJSContainer1: any;
	@ViewChild('chartJSContainer2') chartJSContainer2: any;
	@ViewChild('chartJSContainer3') chartJSContainer3: any;


	@Input() selectedTab: any;
	@Input() tabsValue: any;
	clientTabValue = "rmView"
	clientTabTrack: any;
	dognut: any;
	dognut1: any;
	dognut2: any;
	treeChartFirst: any;
	treeChartSecond: any;
	public cardSegments: any[] = [
		{ name: 'Stocks', segmentValue: 'equity', value: '0', pl: '0', sequence: 0, table: 'table-1' },
		{ name: 'Mutual Funds', segmentValue: 'mutualFund', value: '0', pl: '0', sequence: 1, table: 'table-2' },
		{ name: 'Fixed Deposit', segmentValue: 'fd', value: '0', pl: '0', sequence: 2, table: 'table-3' },
		{ name: 'Bonds', segmentValue: 'bonds', value: '0', pl: '0', sequence: 3, table: 'table-4' },
		{ name: 'AIF', segmentValue: 'aif', value: '0', pl: '0', sequence: 4, table: 'table-5' },
		{ name: 'PMS', segmentValue: 'pms', value: '0', pl: '0', sequence: 5, table: 'table-6' },

	]
	public equityBlockTabValue: any = 'equity';
	public moment: any = moment;
	portfolioData:any;
	clientCode:any;
	clientName:any;
	clientEqData:any[] = [];
	mfSeg:any;
	mfSegment: any = [
		{value: 'EquityData',type: 'Equity', check: true},
		{value: 'elss',type: 'ELSS', check: false},
		{value: 'debt',type: 'Debt', check: false},
		{value: 'hybrid',type: 'Hybrid', check: false},
		{value: 'liquid',type: 'lLquid', check: false}
	]
	tokenValue:any;
	userIdValue:any;
	clientBlockTabValue:any = "EquityData";
	mfTableDisplay:any[] = [];
	displayDonutChart: boolean = true;
	displayTreeChart: boolean = false;
	currentValue:any = 0;
	investedValue:any = 0;
	lastUpdated:any;
	unRealisePlValue:any = 0;
	unRealisePlPer:any = 0;
	clientMfData:any[] = [];
	hybridCatagory:any[] = [];
	equityCatagory:any[] = [];
	elssCatagory:any[] = [];
	debtCatagory:any[] = [];
	liquidCatagory:any[] = [];
	othersCatagory:any[] = [];
	familyMappList:any[] = [];
	memberClientCode:any;
	selectRelation:any;
	displayMemberContent:boolean = true;
	checkOtp:any;
	productAssetSummary:any[] = [];
	productSummaryData:any[] = [];
	memberData:any[] = [];
	filterProdDetail:any[] = [];
	parentClientCode:any;
	htmlData: any;
	clientPmsData:any;
	totalEqHoldingValue:number = 0;
	totalEqUnrealizeGl:number = 0;
	eqHoldingPer:number = 0;
	mfAllocation = 0;
	bondsAllocation = 0;	
	aifAllocation = 0;	
	pmsAllocation = 0;	
	fdAllocation = 0;

	eqAllocation = 0;
	totalMfHoldingValue = 0;
	totalPmsHoldingValue = 0;
	totalAifHoldingValue = 0;
	totalMfUnrealizeGl = 0;
	totalBondsUnrealizeGl = 0;	
	totalFdUnrealizeGl = 0;	
	totalAifUnrealizeGl = 0;	
	totalPmsUnrealizeGl = 0;

	mfHoldingPer = 0
	bondsHoldingPer = 0
	fdHoldingPer = 0
	aifHoldingPer = 0
	pmsHoldingPer = 0

	itemsPerPage = 7;
	data: any = [];
	rmName:any = '-';
	rmEmail:any = '-';
	rmMobile:any = '-';
	dataLoad!:boolean;
	pdfLoader:boolean = true;
	stocksEquityValue = null;	
	mfEquityValue = null;
	displayRelation = "FAMILY";
	clientMappMsg:boolean = false;

	chartMemberData = [];
	chartProdData = [];
	fdData:any[] = [];
	displayReport:boolean = true;
	// portfolioRes:boolean = false;
	totalMfCurrentValue = 0;
	totalBondsCurrentValue = 0;	
	totalFdCurrentValue = 0;	
	totalAifCurrentValue = 0;	
	totalPmsCurrentValue = 0;
	parentClientName:any;
	private subscription: Subscription = new Subscription();
	memberGraph:boolean = true;
	productChartData:any[] = [];
	aifData:any[] = [];
	totalEqCurrentValue = 0
	eqTableDisplay:any[] = [];
	fdTableDisplay:any[] = [];
	bondsTableDisplay:any[] = [];
	aifTableDisplay:any[] = [];
	pmsTableDisplay:any[] = [];
	isOpen = false;
	displayStep1:boolean = false;
	displayStep2:boolean = false;
	displayStep3:boolean = false;
	verifyBtn:boolean = true;
	familyOptionDisplay:boolean = true;
	@Input() public changeDetPage: any;

	commonChartOptions: any = {
		cutout: '80%',
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false
			}
		}
	}
	pdfChartOptions: any = {
		cutout: '70%',
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false
			}
		}
	}
	chart1Labels: string[] = [];
	chart1Data: any[] = [
		{ data: [], backgroundColor: ['#5E3FBE', '#A88DEB', '#84DDFC', '#f1956c'], borderWidth: 0 }
	];
	chart2Labels: string[] = [];
	chart2Data: any[] = [
		{ data: [], backgroundColor: ['#5E3FBE', '#A88DEB', '#84DDFC', '#F1956C', '#FFEA81'], borderWidth: 0 }
	];
	chart3Labels: string[] = [];
	chart3Data: any[] = [
		{ data: [], backgroundColor: ['#5E3FBE', '#A88DEB', '#84DDFC', '#F1956C', '#FFEA81', '#593CC7', '#0080B2'], borderWidth: 0 }
	];
	pdfFamilyLabels: string[] = [];
	pdfFamilyData: any[] = [
		{ data: [], backgroundColor: ['#FF4F01', '#FF9000', '#F9C501', '#8BCA01', '#00B29C'], borderWidth: 0 }
	];
	pdfproductWiseLabels: string[] = [];
	pdfproductWiseData: any[] = [
		{ data: [], backgroundColor: ['#FF4F01', '#FF9000', '#F9C501', '#8BCA01', '#00B29C', '#0080B2'], borderWidth: 0 }
	];

	constructor(@Inject(DOCUMENT) private document: Document,
		private clientService: ClientTradesService, private storage: StorageServiceAAA, private ciphetText: CustomEncryption, private router: Router, public toast: ToasterService,
		private sanitize: DomSanitizer, private formatNumDecimal:FormatNumberDecimalPipe, private commonService: CommonService
		) { 
			
		}

	ngOnChanges(changes: SimpleChanges): void {
		if(localStorage.getItem('memberCount')){
			this.familyMappList = JSON.parse(localStorage.getItem('memberCount') || "{}");
		}
	}
	
	ngOnInit() {
		this.subscription = new Subscription();
		this.initPortfolio();
	}
	
	initPortfolio(){
		let clientDetails = JSON.parse(localStorage.getItem('select_client') || "{}");
		this.clientName = clientDetails['ClientName'];
		this.clientCode = clientDetails['ClientCode'];
		this.parentClientCode = clientDetails['ClientCode'];
		this.parentClientName = clientDetails['ClientName']
		let clientID = this.ciphetText.aesEncrypt(this.clientCode);
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('userID').then((userId) => {
					this.storage.get('sToken').then(token => {
						this.tokenValue = token;
						this.userIdValue = userId;
						// this.getClientPortfolio(token, clientID, this.ciphetText.aesEncrypt(userId), '1')
						this.getFamilyDropdown(token, clientID, this.ciphetText.aesEncrypt(userId))
						// this.getEqClientTable(token, clientID, this.ciphetText.aesEncrypt(userId), '1')
						// this.getProductSummary(token, clientID, this.ciphetText.aesEncrypt(userId), '1');
						// this.getMfDetails(token, clientID, this.ciphetText.aesEncrypt(userId), '1');
						// this.getFdDetails(token, clientID, this.ciphetText.aesEncrypt(userId), '1')
						// this.getBondsDetail(token, clientID, this.ciphetText.aesEncrypt(userId), '1')
						// this.getAifDetail(token, clientID, this.ciphetText.aesEncrypt(userId), '1')
						// this.getPmsDetail(token, clientID, this.ciphetText.aesEncrypt(userId), '1')
					})
				})
			} else {
				this.storage.get('userID').then((userId) => {
					this.storage.get('subToken').then(token => {
						this.tokenValue = token;
						this.userIdValue = userId;
						// this.getClientPortfolio(token, clientID, this.ciphetText.aesEncrypt(userId), '1')
						this.getFamilyDropdown(token, clientID, this.ciphetText.aesEncrypt(userId))
						// this.getEqClientTable(token, clientID, this.ciphetText.aesEncrypt(userId), '1')
						// this.getProductSummary(token, clientID, this.ciphetText.aesEncrypt(userId), '1');
						// this.getMfDetails(token, clientID, this.ciphetText.aesEncrypt(userId), '1');
						// this.getFdDetails(token, clientID, this.ciphetText.aesEncrypt(userId), '1')
						// this.getBondsDetail(token, clientID, this.ciphetText.aesEncrypt(userId), '1')
						// this.getAifDetail(token, clientID, this.ciphetText.aesEncrypt(userId), '1')
						// this.getPmsDetail(token, clientID, this.ciphetText.aesEncrypt(userId), '1')
					})
				})
			}
		})

		this.storage.get('pDetails').then(details => {
			this.rmName = details['Name']
			this.rmEmail = details['Email']
			this.rmMobile = details['MobileNo']
		})
		this.displayRelation = 'FAMILY';
	}

	getFamilyDropdown(token: any, id: any, userid: any) {
		this.subscription.add(
			this.clientService.getFamilyMapping(token, id, userid)
				.subscribe((res: any) => {
					this.familyOptionDisplay = true;
					if(res['Head']['ErrorCode'] == 0){
						if(res['Body']['FamillyMapp'].length ==  1){
							this.familyOptionDisplay = false;
							if(res['Body']['FamillyMapp'][0]['Successflag'] == 'N'){
								this.familyMappList = [];
								this.dataLoad = true;
								this.clientMappMsg = true
							}
							if(res['Body']['FamillyMapp'][0] && res['Body']['FamillyMapp'][0]['ParentClientCode'].length == 0){
								this.familyMappList = res['Body']['FamillyMapp'];
								
								this.getClientPortfolio(token, id, userid, '0');
								this.getEqClientTable(token, id, userid, '0')
								this.getProductSummary(token, id, userid, '0');
								this.getMfDetails(token, id, userid, '0');
								this.getFdDetails(token, id, userid, '0')
								this.getBondsDetail(token, id, userid, '0')
								this.getAifDetail(token, id, userid, '0')
								this.getPmsDetail(token, id, userid, '0')
							}
							else{
								this.familyMappList = res['Body']['FamillyMapp'];
								this.getClientPortfolio(token, id, userid, '1');
								this.getEqClientTable(token, id, userid, '1')
								this.getProductSummary(token, id, userid, '1');
								this.getMfDetails(token, id, userid, '1');
								this.getFdDetails(token, id, userid, '1')
								this.getBondsDetail(token, id, userid, '1')
								this.getAifDetail(token, id, userid, '1')
								this.getPmsDetail(token, id, userid, '1')
							}
							// if(res['Body']['FamillyMapp'][0] && res['Body']['FamillyMapp'][0]['ParentClientCode'].length > 0){
								this.displayRelation = this.familyMappList[0]['Relation'] && this.familyMappList[0]['Relation'].length > 0 ? this.familyMappList[0]['Relation'] : 'SELF';	
							// }
						}
						else{
							this.familyOptionDisplay = true;
							this.familyMappList = res['Body']['FamillyMapp'];
							this.getClientPortfolio(token, id, userid, '1');
							this.getEqClientTable(token, id, userid, '1')
							this.getProductSummary(token, id, userid, '1');
							this.getMfDetails(token, id, userid, '1');
							this.getFdDetails(token, id, userid, '1')
							this.getBondsDetail(token, id, userid, '1')
							this.getAifDetail(token, id, userid, '1')
							this.getPmsDetail(token, id, userid, '1')
						}
						if(this.familyMappList && this.familyMappList.length > 0){
							this.familyMappList.forEach(element => {
								element.Relation = element.Relation && element.Relation.length == 0 ? 'SELF' : element.Relation
							})
						}
					}
					else{
						this.familyMappList = [];
						this.clientMappMsg = true;
						this.dataLoad = true;
					}
				})
		)
	}

	goToFamilyPortfolio(){
		this.resetData();
		this.initPortfolio();
	}

	// async openPopover(ev, message?) {
	// 	const items = [
	// 		{ title: message, value: message },
	// 	]
	// 	ev.stopPropagation();
	// 	const popover = await this.popoverController.create({
	// 		component: ItemPopoverComponent,
	// 		componentProps: { items: items },
	// 		cssClass: "coming-soon-popover item-popover",
	// 		//mode: "ios",
	// 		showBackdrop: false,
	// 		event: ev
	// 		// translucent: true
	// 	});
	// 	return await popover.present();
	// }


	calculateSum(array: any, property: any) {	
		const total = array.reduce((accumulator: any, object: any) => {	
			return accumulator + +object[property];	
		}, 0);	
		return total;	
	}


		// Function to generate the HTML for the tables
			// Function to generate the HTML for the tables
			async generateTablesHTML() {

				this.pdfLoader = false;
				
				if(this.memberData.length > 0){
					this.data = [
						{
							pageTitle: 'Family Distribution',
							pageNumber: '3',
							subTitle: null,
							hasTable: true,
							tableHead: ['Members', 'Current Value', 'Allocation', 'Unrealized P&L', 'P&L%'],
							totalData: this.familyHoldingDist
						},
						{
							pageTitle: 'Product Wise Holdings',
							pageNumber: '4',
							subTitle: 'Stocks',
							hasTable: true,
							tableHead: ['Scrip Name', 'Qty', 'Purchase Price', 'Invested Value', 'Current Price', 'Current Value', 'Net P&L', 'P&L%'],
							totalData: this.clientEqData
						},
						{
							pageTitle: 'Product Wise Holdings',
							pageNumber: '5',
							subTitle: 'Mutual Funds',
							hasTable: true,
							tableHead: ['Scheme Name', 'Category', 'Unit', 'Invested Value', 'Current Value', 'NAV', 'Net P&L', 'P&L%'],
							totalData: this.clientMfData
						},
						{
							pageTitle: 'Product Wise Holdings',
							pageNumber: '6',
							subTitle: 'Bonds',
							hasTable: true,
							tableHead: ['Bond Name', 'Tenure', 'Date of Investment', 'Invested Value', 'ROI', 'Maturity Date'],
							totalData: this.bondsData
						},
						{
							pageTitle: 'Product Wise Holdings',
							pageNumber: '7',
							subTitle: 'Fixed Deposit',
							hasTable: true,
							tableHead: ['Company Name', 'Tenure', 'Date of Investment', 'Invested Value', 'ROI', 'Maturity Date'],
							totalData: this.fdData
						},
						{
							pageTitle: 'Product Wise Holdings',
							pageNumber: '8',
							subTitle: 'AIF',
							hasTable: true,
							tableHead: ['Scheme Name', 'AUM Date', 'Invested Value', 'Current Value', 'Commitment Amount', 'NET P&L', 'P&L%'],
							totalData: this.aifData
						},
						{
							pageTitle: 'Product Wise Holdings',
							pageNumber: '9',
							subTitle: 'PMS',
							hasTable: true,
							tableHead: ['Scheme Name', 'AUM Date', 'Invested Value', 'Current Value', 'NET P&L', 'P&L%'],
							totalData: this.pmsData
						}
						
			
					];
				} else {
					this.data = [
						{
							pageTitle: 'Product Wise Holdings',
							pageNumber: '3',
							subTitle: 'Stocks',
							hasTable: true,
							tableHead: ['Scrip Name', 'Qty', 'Purchase Price', 'Invested Value', 'Current Price', 'Current Value', 'Net P&L', 'P&L%'],
							totalData: this.clientEqData
						},
						{
							pageTitle: 'Product Wise Holdings',
							pageNumber: '4',
							subTitle: 'Mutual Funds',
							hasTable: true,
							tableHead: ['Scheme Name', 'Category', 'Unit', 'Invested Value', 'Current Value', 'NAV', 'Net P&L', 'P&L%'],
							totalData: this.clientMfData
						},
						{
							pageTitle: 'Product Wise Holdings',
							pageNumber: '5',
							subTitle: 'Bonds',
							hasTable: true,
							tableHead: ['Bond Name', 'Tenure', 'Invested Value', 'Current Value', 'ROI', 'Maturity Date'],
							totalData: this.bondsData
						},
						{
							pageTitle: 'Product Wise Holdings',
							pageNumber: '6',
							subTitle: 'Fixed Deposit',
							hasTable: true,
							tableHead: ['Company Name', 'Tenure', 'Date of Investment', 'Invested Value', 'ROI', 'Maturity Date'],
							totalData: this.fdData
						},
						{
							pageTitle: 'Product Wise Holdings',
							pageNumber: '7',
							subTitle: 'AIF',
							hasTable: true,
							tableHead: ['Scheme Name', 'AUM Date', 'Invested Value', 'Current Value', 'Commitment Amount', 'NET P&L', 'P&L%'],
							totalData: this.aifData
						},
						{
							pageTitle: 'Product Wise Holdings',
							pageNumber: '8',
							subTitle: 'PMS',
							hasTable: true,
							tableHead: ['Scheme Name', 'AUM Date', 'Invested Value', 'Current Value', 'NET P&L', 'P&L%'],
							totalData: this.pmsData
						}
			
					];
				}
		
				let html = '';
		
				let memberList = '';
	
				let productList = '';
		
				for (let index = 0; index < this.memberData.length; index++) {
					const element = this.memberData[index];
	
					memberList += 		'<tr style="vertical-align: top;">'
					memberList += 			'<td style="display: flex;width: 100px;padding-bottom: 5px;">'
					memberList += 				'<img src="./assets/imgs/' + element.img + '.png" style="height: 12px; margin-right: 5%; margin-top: 3%">'
					memberList += 				'<div style="display: flex;flex-direction: column;"><span>' + element['CLIENTCODE'] + '</span>'
					memberList += 				'<span style="color: #999; font-size:8px;">' + (element['Relation'] === 'No' ? '-' : element['Relation']) + '</span></div>'
					memberList += 			'</td>'
					memberList += 			'<td style="font-size: 12px;color: #000000;font-weight: 700;text-align: right;">' + this.commonService.numberFormatWithCommaUnit(element['EQUITYVALUE']) + '</td>'
					memberList += 			'<td style="font-size: 8px;color: #000000;font-weight: 700;line-height: 1.8;text-align: right; padding-left: 5px;">' + element['EQUITYPERCENTAGE'] + '%</td>'
					memberList += 		'</tr>'
				}
	
				for (let index = 0; index < this.productChartData.length; index++) {
					const element = this.productChartData[index];
	
					productList += 		'<tr style="vertical-align: top;">'
					productList += 			'<td style="display: flex;padding-bottom: 5px;">'
					productList += 				'<img src="./assets/imgs/'+ element.img +'.png" style="height: 12px; margin-right: 5%;margin-top: 5%">'
					productList += 				'<div style="display: flex;flex-direction: column;"><span>'+ (element['PRODUCT'] === 'BO' || element['PRODUCT'] === 'BD' ? 'Bonds' : (element['PRODUCT'] === 'DE' ? 'Stocks' : element['PRODUCT'])) +'</span>'
					productList += 			'</td>'
					productList += 			'<td style="font-size: 12px;color: #000000;font-weight: 700;text-align: right;">' + this.commonService.numberFormatWithCommaUnit(element['EQUITYVALUE']) + '</td>'
					productList += 			'<td style="font-size: 8px;color: #000000;font-weight: 700;line-height: 1.8;text-align: right;padding-right: 10px;">' + this.numberFormat(element['EQUITYPERCENTAGE']) + '%</td>'
					productList += 		'</tr>'
				}
					
		
				const page1 = `<page size="A4" layout="landscape" orientation="landscape">            
							<div class="first-page" style="position: relative;overflow: hidden;margin: 0px 0px 10px 0px;padding: 0px;border: none;width: 842px;">
								<div style="height: 575px;">
									<div style="position: relative;" >
										<!-- Header Background image -->
										<img style="position: absolute; top: 0; left: 0; z-index: 1; width:100%; height: 230px;" src="../assets/imgs/vector_header_background.png" alt="Header Background">
									
										<!-- Header Image -->
										<img style="position: relative; z-index: 2; width:100%; height: 300px;" src="../assets/imgs/vector_header.png" alt="Header Image">
									
										<!-- Logo Image -->
										<img style="position: absolute; top: 15px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">
									
										<!-- Date -->
										<div style="position: absolute; font-family: 'Inter', sans-serif; top: 15px; right: 15px; z-index: 4; color: #FFFFFF;">
										${moment(new Date()).format('MMM DD, YYYY')}
										</div>
									
										<!-- Text -->
										<div style="position: absolute; top: 43%; left: 50%; transform: translate(-50%, -50%); z-index: 5; color: #FFFFFF; text-align: center;">
										<span style="font-family: 'Inter', sans-serif; font-weight: 700; font-size: 38px;">PORTFOLIO 360</span>
										<br>
										<span style="font-family: 'Inter', sans-serif; font-size: 20px; font-style: normal; font-weight: 400; line-height: normal;">Analysis Report ${this.displayRelation === 'FAMILY' ? '(Family)' : '(Self)'}</span>
										</div>
									</div >
										
							
									<div style="position:relative;">
									
										<div style="float:left; margin-left: 20px;">
											<div>
												<span style="color: #010101;
												font-size: 20px;
												font-weight: 600;
												font-family: 'Inter', sans-serif;
												line-height: normal;">${this.clientName}</span>
												<br>
												<span style="color: #64798C;
												font-size: 14px;
												font-weight: 400;
												font-family: 'Inter', sans-serif;
												line-height: normal;">${this.clientCode}</span>
											</div>
										
									
											<div style="margin-top:30px;">
												<div> <img src="../assets/imgs/user.png" style="vertical-align: middle;"><span style="color: #434343;
												font-size: 14px;
												font-weight: 600;
												font-family: 'Inter', sans-serif;
												line-height: normal; margin-left:10px;">${this.rmName}</span>
													<br>
													<span style="color: #6E6E6E;
												font-size: 12px;
												font-weight: 400;
												font-family: 'Inter', sans-serif;
												line-height: normal; margin-left:30px;">Relationship Manager</span>
												</div>
												<div style="margin-left:28px; margin-top: 5px;">
													<img src="../assets/imgs/smartphone.png" style="vertical-align: middle;">&nbsp;<span style="color: #6E6E6E;
														font-size: 12px;
														font-weight: 400;
														font-family: 'Inter', sans-serif;
														line-height: 18px;">+91&nbsp; ${this.rmMobile}</span>
												</div>
												<div style="margin-left:28px; margin-top: 1px;"><img src="../assets/imgs/mail.png" style="vertical-align: middle;">&nbsp;&nbsp;<span style="color: #6E6E6E;
													font-size: 12px;
													font-weight: 400;
													font-family: 'Inter', sans-serif;
													line-height: 18px;">${this.rmEmail}</span></div>
									
									
												<div style="margin-top:20px;">
													<img src="../assets/imgs/phone.png" style="vertical-align: middle;"> <span style="color: #434343;
														font-size: 14px;
														font-weight: 600;
														font-family: 'Inter', sans-serif;
														line-height: normal; margin-left: 4px;"> 1860-267-3000, 7039-050-000 </span>
									
													<img src="../assets/imgs/maili.png" style="margin-left: 35px; vertical-align: middle;"> <span style="color: #434343;
														font-size: 14px;
														font-weight: 600;
														font-family: 'Inter', sans-serif;
														line-height: normal;">cs@iifl.com</span>
												</div>
									
											</div>
										</div>
										
									</div>
									</div>								
							</div>
						</page>`;
	
	
				const successBackColor = '#D5EDCC';
				const successBorderColor = '#A6D893';
				const successColor = '#2BA400';
	
				const dangerBackColor = '#FBEAEA';
				const dangerBorderColor = '#F0B9B7';
				const dangerColor = '#DF514C';
		
				const page2 = `<page size="A4" layout="landscape">
										<div class="second-page"
											style="position: relative;overflow: hidden;margin: 20px 0px 0px 0px;padding: 0px;border: none;width: 842px;">
											<div style="height: 595px;">
												<div style="position: relative;">
													<!-- Header Background image -->
													<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">
													<!-- Logo Image -->
													<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">
													<!-- Date -->
													<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C;
														text-align: right;
														font-family: 'Inter', sans-serif;
														font-size: 18px;
														font-weight: 600;
														line-height: normal;">
														${this.clientName}
													</div>
												</div>
												<div style="position: relative;
													top: 90px;
													left: 21px;">
													<span style="color: #4733CB;
														font-size: 24px;
														font-weight: 600;
														font-family: 'Inter', sans-serif;
														line-height: normal;">Executive Summary</span>
													<br>
													<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">
												</div>
												<div style="position: relative; top: 120px; left: 21px;">
													<div style="width: 100%; display:flex; justify-content: space-around;">
														<div style="width: 22%;margin-right: 3%;
														background: #D5E5FC;border: 1px solid #A8C0E4;
														box-shadow: 0px 5px 10px #0000001A;
															width: 147px;
															display:flex;
															flex-direction:column;
															height: 82px;
															padding: 10px;
															justify-content: center;
															align-items: center;
															gap: 10px;  border-radius: 8px;
															background-size: cover;">
															<span style="color: #2778F1;
																font-size: 24px;
																font-weight: 700;
																font-family: 'Inter', sans-serif;
																line-height: 24px;">${this.commonService.numberFormatWithUnit(this.currentValue)}</span>
															<span style="color: #6E6E6E;
																text-align: center;
																font-size: 14px;
																font-weight: 400;
																font-family: 'Inter', sans-serif;
																line-height: normal;">Current Value</span>
														</div>
														<div style="width: 22%;margin-right: 3%; 
														background: #FAE8DB;
														border: 1px solid #ECC3A8;
														box-shadow: 0px 5px 10px #0000001A;
															width: 147px;
															height: 82px;
															display:flex;
															flex-direction:column;
															padding: 10px;
															justify-content: center;
															align-items: center;
															gap: 10px; border-radius: 8px;
															background-size: cover;"> <span style="color: #DE8600;
															font-size: 24px;
															font-weight: 700;
															font-family: 'Inter', sans-serif;
															line-height: 24px;">${this.commonService.numberFormatWithUnit(this.investedValue)}</span>
															<span style="color: #6E6E6E;
																text-align: center;
																font-size: 14px;
																font-weight: 400;
																font-family: 'Inter', sans-serif;
																line-height: normal;">Holding Cost</span>
														</div>
														<div style="width: 22%;margin-right: 3%; 
														background: ${this.unRealisePlValue > 0 ? successBackColor : (this.unRealisePlValue < 0 ? dangerBackColor : '#ccc')};
														border: 1px solid ${this.unRealisePlValue > 0 ? successBorderColor : (this.unRealisePlValue < 0 ? dangerBorderColor : '#6E6E6E')};
														box-shadow: 0px 5px 10px ${this.unRealisePlValue > 0 ? successBorderColor : (this.unRealisePlValue < 0 ? dangerBorderColor : '#6E6E6E')};
															width: 147px;
															height: 82px;
															display:flex;
															flex-direction:column;
															padding: 10px;
															justify-content: center;
															align-items: center;
															gap: 10px;
															border-radius: 8px;
															background-size: cover;">
															<span style="color: ${this.unRealisePlValue > 0 ? successColor : (this.unRealisePlValue < 0 ? dangerColor : '#6E6E6E')};
																font-size: 24px;
																font-weight: 700;
																font-family: 'Inter', sans-serif;
																line-height: 24px;">${this.commonService.numberFormatWithUnit(this.unRealisePlValue)}
															</span>
															<span style="color: #6E6E6E;
																text-align: center;
																font-size: 14px;
																font-weight: 400;
																font-family: 'Inter', sans-serif;
																line-height: normal;">Unrealized P&L
															</span>
														</div>
														<div style="width: 22%; margin-right: 5%; 
														background: ${this.unRealisePlPer > 0 ? successBackColor : (this.unRealisePlPer < 0 ? dangerBackColor : '#ccc')};
														border: 1px solid ${this.unRealisePlPer > 0 ? successBorderColor : (this.unRealisePlPer < 0 ? dangerBorderColor : '#6E6E6E')};
														box-shadow: 0px 5px 10px ${this.unRealisePlPer > 0 ? successBorderColor : (this.unRealisePlPer < 0 ? dangerBorderColor : '#6E6E6E')};
															width: 147px;
															height: 82px;
															padding: 10px;
															justify-content: center;
															display:flex;
															flex-direction:column;
															align-items: center;
															gap: 10px; 
															border-radius: 8px;
															background-size: cover;">
															<span style="color: ${this.unRealisePlPer > 0 ? successColor : (this.unRealisePlPer < 0 ? dangerColor : '#6E6E6E')};
																font-size: 24px;
																font-weight: 700;
																font-family: 'Inter', sans-serif;
																line-height: 24px;">${this.numberFormat(this.unRealisePlPer)}%
															</span>
															<span style="color: #6E6E6E;
																text-align: center;
																font-size: 14px;
																font-weight: 400;
																font-family: 'Inter', sans-serif;
																line-height: normal;">Unrealized P&L
															</span>
														</div>
													</div>
													<div style="display:flex; margin-top:6%;justify-content: center;">
														<div style="width:46%;color: #000;margin-right: 10%;
															font-size: 18px;
															font-weight: 700;
															line-height: normal;" class=${this.memberData.length === 0 ? 'displayNone' : ''}>
															Family Wise
															<div style="display:flex; margin-top:6%;">
																<div style="height: 180px; width: 180px;position: relative;">
																	<p style="font-size: 14px;font-family: 'Inter', sans-serif;color: #000000;position: absolute;text-align: center;margin: 0;top: 33%;left: 25%;line-height: 1;"><span style="font-size: 18px;font-weight: 600;">${this.memberData.length < 10 ? '0' + this.memberData.length : this.memberData.length}</span><br>Members</p>
																</div>
																<div style="display: flex;align-items: center;">
																	<table style="width: 180px;font-size:12px;font-family: 'Inter', sans-serif;font-weight:700;">
																		<tbody>
																			${memberList}
																		</tbody>
																	</table>
																</div>
															</div>
														</div>
														<div style="width:50%; color: #000;
															font-size: 18px;
															font-weight: 700;
															line-height: normal;" class=${this.productChartData.length === 0 ? 'displayNone' : ''}>
															Product Wise
															<div style="display:flex; margin-top:6%;">
																<div style=" height: 180px; width: 180px;position: relative;">
																	<p style="font-size: 14px;font-family: 'Inter', sans-serif;color: #000000;position: absolute;text-align: center;margin: 0;top: 33%;left: 27%;line-height: 1;"><span style="font-size: 18px;font-weight: 600;">${this.productChartData.length < 10 ? '0' + this.productChartData.length : this.productChartData.length}</span><br>Products</p>
																</div>
																<div style="display: flex;align-items: center;">
																	<table style="width: 170px;font-size:12px;font-family: 'Inter', sans-serif;font-weight:700;">
																		<tbody>
																			${productList}
																		</tbody>
																	</table>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div style="position: absolute;bottom: 2%;left: 2%;">
												<span style="color: #817A9A;
													text-align: center;
													font-size: 14px;
													font-family: 'Inter', sans-serif;
													font-weight: 700;
													line-height: normal;">PORTFOLIO 360</span>&nbsp;
												<span style="color: #84859E;
													font-size: 10px;
													font-weight: 400;
													font-family: 'Inter', sans-serif;
													line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>
											</div>											
										</div>
									</page>`;

									//Page 2 - page number code
								// 	<div style="position: absolute;bottom: 2%;right: 2%;">
								// 	<span style="color: #84859E;
								// 	text-align: center;
								// 	font-size: 12px;
								// 	font-weight: 700;
								// 	line-height: normal;">01</span>
								// </div>
		
				// const total = ((this.totalEqUnrealizeGl + this.totalMfUnrealizeGl) / (this.totalEqHoldingValue + this.totalMfHoldingValue)) * 100
				const total = ((this.totalEqUnrealizeGl + this.totalMfUnrealizeGl + this.totalBondsUnrealizeGl + this.totalFdUnrealizeGl + this.totalAifUnrealizeGl + this.totalPmsUnrealizeGl) / (this.totalBondsCurrentValue + this.totalFdCurrentValue + this.totalPmsHoldingValue + this.totalAifHoldingValue + this.totalEqHoldingValue + this.totalMfHoldingValue) * 100);
				//const total = parseFloat(this.eqHoldingPer.toString()) + parseFloat(this.mfHoldingPer.toString());
				//familyTotalInvestment
				const page3 = `<page size="A4" layout="landscape" orientation="landscape">            
									<div class="third-page" style="position: relative;overflow: hidden;padding: 0px;border: none;width: 842px;">
										<div style="height: 595px;">
											<div style="position: relative;">
												<!-- Header Background image -->
												<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">
												<!-- Logo Image -->
												<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">
												<!-- Date -->
												<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C;
													text-align: right;
													font-family: 'Inter', sans-serif;
													font-size: 18px;
													font-style: normal;
													font-weight: 600;
													line-height: normal;">
													${this.clientName}
												</div>
											</div>
											
											<div style="position: relative;
											top: 90px;
											left: 21px;">
												<span style="color: #4733CB;
														font-family: 'Inter', sans-serif;
														font-size: 24px;
														font-style: normal;
														font-weight: 600;
														line-height: normal;">Product Wise Distribution</span>
														<br>
												<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">
											</div>
										
											<div style="position: relative;
											top: 120px;
											left: 21px;">
											<table style="width: 95%; table-layout: fixed; border-collapse: collapse;">
												<thead>
												<tr style="color: #615F78;
													font-family: 'Inter', sans-serif;
													font-size: 12px;
													font-style: normal;
													font-weight: 500;
													line-height: normal;background: #DBDAF3; height: 31px;">
													<th style="text-align: left; padding-left: 2.5%;" colspan="2">Product</th>
													<th style="text-align: right;">Current Value</th>
													<th style="text-align: right;">Allocation</th>
													<th style="text-align: right;">Unrealized P&L</th>
													<th style="text-align: right; padding-right: 2.5%;">P&L%</th>
												</tr>
												</thead>
												<tbody>
												<tr style="color: #000;
														font-family: 'Inter', sans-serif;
														font-size: 11px;
														font-style: normal;
														font-weight: 500;
														line-height: normal; width: 782px;
																height: 45px;
																flex-shrink: 0;">
													<td style="text-align: left; padding-left: 2.5%;" colspan="2">Stocks</td>
													<td style="text-align: right;">${this.numberFormat(this.totalEqCurrentValue)}</td>
													<td style="text-align: right;">${this.numberFormat(this.eqAllocation)}%</td>
													<td style="text-align: right;">${this.numberFormat(this.totalEqUnrealizeGl)}</td>
													<td style="text-align: right; padding-right: 2.5%; color:${(+this.eqHoldingPer > 0 ? '#009E3B' : (+this.eqHoldingPer < 0 ? '#DF514C' : '#000000')) }">${this.eqHoldingPer < 0 ? '(' : ''}${this.numberFormat(this.eqHoldingPer)}%${this.eqHoldingPer < 0 ? ')' : ''}</td>
												</tr>
												<tr style="width: 782px;
																height: 45px;
																flex-shrink: 0; background: #F0F0F0;color: #000;
														text-align: right;
														font-family: 'Inter', sans-serif;
														font-size: 11px;
														font-style: normal;
														font-weight: 500;
														line-height: normal;">
													<td style="text-align: left; padding-left: 2.5%;" colspan="2" >Mutual Funds</td>
													<td style="text-align: right;">${this.numberFormat(this.totalMfCurrentValue)}</td>
													<td style="text-align: right;">${this.numberFormat(this.mfAllocation)}%</td>
													<td style="text-align: right;">${this.numberFormat(this.totalMfUnrealizeGl)}</td>
													<td style="text-align: right; padding-right: 2.5%; color: ${(+this.mfHoldingPer > 0 ? '#009E3B' : (+this.mfHoldingPer < 0 ? '#DF514C' : '#000000')) }">${this.mfHoldingPer < 0 ? '(' : ''}${this.mfHoldingPer}%${this.mfHoldingPer < 0 ? ')' : ''}</td>
												</tr>
												<tr style="width: 782px;
																height: 45px;
																flex-shrink: 0;color: #000;
														text-align: right;
														font-family: 'Inter', sans-serif;
														font-size: 11px;
														font-style: normal;
														font-weight: 500;
														line-height: normal;">
													<td style="text-align: left; padding-left: 2.5%;" colspan="2" >Bonds</td>
													<td style="text-align: right;">${this.numberFormat(this.totalBondsCurrentValue)}</td>
													<td style="text-align: right;">${this.numberFormat(this.bondsAllocation)}%</td>
													<td style="text-align: right;">${this.numberFormat(this.totalBondsUnrealizeGl)}</td>
													<td style="text-align: right; padding-right: 2.5%; color: ${(+this.bondsHoldingPer > 0 ? '#009E3B' : (+this.bondsHoldingPer < 0 ? '#DF514C' : '#000000')) }">${this.bondsHoldingPer < 0 ? '(' : ''}${this.bondsHoldingPer}%${this.bondsHoldingPer < 0 ? ')' : ''}</td>
												</tr>
												<tr style="width: 782px;
																height: 45px;
																flex-shrink: 0; background: #F0F0F0;color: #000;
														text-align: right;
														font-family: 'Inter', sans-serif;
														font-size: 11px;
														font-style: normal;
														font-weight: 500;
														line-height: normal;">
													<td style="text-align: left; padding-left: 2.5%;" colspan="2" >Fixed Deposit</td>
													<td style="text-align: right;">${this.numberFormat(this.totalFdCurrentValue)}</td>
													<td style="text-align: right;">${this.numberFormat(this.fdAllocation)}%</td>
													<td style="text-align: right;">${this.numberFormat(this.totalFdUnrealizeGl)}</td>
													<td style="text-align: right; padding-right: 2.5%; color: ${(+this.fdHoldingPer > 0 ? '#009E3B' : (+this.fdHoldingPer < 0 ? '#DF514C' : '#000000')) }">${this.fdHoldingPer < 0 ? '(' : ''}${this.fdHoldingPer}%${this.fdHoldingPer < 0 ? ')' : ''}</td>
												</tr>
												<tr style="width: 782px;
																height: 45px;
																flex-shrink: 0; color: #000;
														text-align: right;
														font-family: 'Inter', sans-serif;
														font-size: 11px;
														font-style: normal;
														font-weight: 500;
														line-height: normal;">
													<td style="text-align: left; padding-left: 2.5%;" colspan="2" >AIF</td>
													<td style="text-align: right;">${this.numberFormat(this.totalAifCurrentValue)}</td>
													<td style="text-align: right;">${this.numberFormat(this.aifAllocation)}%</td>
													<td style="text-align: right;">${this.numberFormat(this.totalAifUnrealizeGl)}</td>
													<td style="text-align: right; padding-right: 2.5%; color: ${(+this.aifHoldingPer > 0 ? '#009E3B' : (+this.aifHoldingPer < 0 ? '#DF514C' : '#000000')) }">${this.aifHoldingPer < 0 ? '(' : ''}${this.aifHoldingPer}%${this.aifHoldingPer < 0 ? ')' : ''}</td>
												</tr>
												<tr style="width: 782px;
																height: 45px;
																flex-shrink: 0; background: #F0F0F0;color: #000;
														text-align: right;
														font-family: 'Inter', sans-serif;
														font-size: 11px;
														font-style: normal;
														font-weight: 500;
														line-height: normal;">
													<td style="text-align: left; padding-left: 2.5%;" colspan="2" >PMS</td>
													<td style="text-align: right;">${this.numberFormat(this.totalPmsCurrentValue)}</td>
													<td style="text-align: right;">${this.numberFormat(this.pmsAllocation)}%</td>
													<td style="text-align: right;">${this.numberFormat(this.totalPmsUnrealizeGl)}</td>
													<td style="text-align: right; padding-right: 2.5%; color: ${(+this.pmsHoldingPer > 0 ? '#009E3B' : (+this.pmsHoldingPer < 0 ? '#DF514C' : '#000000')) }">${this.pmsHoldingPer < 0 ? '(' : ''}${this.pmsHoldingPer}%${this.pmsHoldingPer < 0 ? ')' : ''}</td>
												</tr>
												<tr style="width: 782px;
														height: 51px;
														flex-shrink: 0; background: #FFF7EC;color: #000;
												text-align: right;
												font-family: 'Inter', sans-serif;
												font-size: 12px;
												font-style: normal;
												font-weight: 600;
												line-height: normal;">
													<td style="text-align: left; padding-left: 2.5%;" colspan="2">Total</td>
													<td style="text-align: right;">${this.numberFormat(this.totalEqCurrentValue + this.totalMfCurrentValue + this.totalBondsCurrentValue + this.totalFdCurrentValue + this.totalAifCurrentValue + this.totalPmsCurrentValue)}</td>
													<td style="text-align: right;">${this.numberFormat(+this.eqAllocation + +this.mfAllocation + +this.bondsAllocation + +this.fdAllocation + +this.aifAllocation + +this.pmsAllocation)}%</td>
													<td style="text-align: right;">${this.numberFormat(this.totalEqUnrealizeGl + this.totalMfUnrealizeGl + this.totalBondsUnrealizeGl + this.totalFdUnrealizeGl + this.totalAifUnrealizeGl + this.totalPmsUnrealizeGl)}</td>
													<td style="text-align: right; padding-right: 2.5%; color: ${(total > 0 ? '#009E3B' : (total < 0 ? '#DF514C' : '#000000'))}">${total < 0 ? '(' : ''}${this.numberFormat(total)}%${total < 0 ? ')' : ''}</td>
												</tr>
												</tbody>
											</table>
									
											</div>
											</div>
										<div style="position: absolute;bottom: 2%;left: 2%;"><span style="color: #817A9A;
											text-align: center;
											font-family: 'Inter', sans-serif;
											font-size: 14px;
											font-style: normal;
											font-weight: 700;
											line-height: normal;">PORTFOLIO 360</span>&nbsp;
											<span style="color: #84859E;
											font-family: 'Inter', sans-serif;
											font-size: 10px;
											font-style: normal;
											font-weight: 400;
											line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>
									
										</div>
										
									</div>
								</page>`;
		
		//page 3 - page number code
		// <div style="position: absolute;bottom: 2%;right: 2%;">
		// 	<span style="color: #84859E;
		// 	text-align: center;
		// 	font-size: 12px;
		// 	font-weight: 700;
		// 	line-height: normal;">02</span>
		// </div>
		
		
				html += page1;
				html += page2;
				if(this.productChartData.length > 0){
					html += page3;
				}
		
				for (const singleData of this.data) {
					let pageNo = 2;
					for (const tableIndex of this.getTableIndexes(singleData.totalData)) {
						pageNo++;
						html += `<page size="A4" layout="landscape" orientation="landscape">`;
						html += `<div class="page_${tableIndex}" style="position: relative; overflow: hidden; margin: 0px 0px 0px 0px; padding: 0px; border: none; width: 842px">`;
						html += `<div style="height: 595px;">`;
						html += `<img style="position: absolute; top: 0; left: 0; z-index: 1;" src="../assets/imgs/vector-heading-table.png" alt="Header Background">`;
						html += `<img style="position: absolute; top: 12px; left: 20px; z-index: 3;" src="../assets/imgs/Logo.png" alt="Logo">`;
						html += `<div style="position: absolute; top: 15px; right: 20px; z-index: 3; color: #6C638C; text-align: right; font-family: 'Inter', sans-serif; font-size: 18px; font-style: normal; font-weight: 600; line-height: normal;">${this.clientName}</div>`;
						html += `<div style="position: relative; top: 90px; left: 21px;">`;
						html += `<span style="color: #4733CB; font-family: 'Inter', sans-serif; font-size: 24px; font-style: normal; font-weight: 600; line-height: normal;">${singleData.pageTitle}</span><br>`;
						html += `<img src="../assets/imgs/RectangleBig.png">&nbsp;<img src="../assets/imgs/RectangleSmall.png">`;
						html += `</div>`;
						if (singleData.subTitle !== null) {
							html += `<div style="position: relative; top: 110px; left: 21px;">`;
							html += `<img src="../assets/imgs/verticalLineRed.png">`;
							html += `<span style="color: #000000; font-style: normal; margin-top: 10px; text-transform: uppercase; font-family: 'Inter', sans-serif; font-size: 18px; margin-left: 5px; line-height: normal;">${singleData.subTitle}</span><br>`;
							html += `</div>`;
						}
						html += `<div style="position: relative; top: 120px; left: 21px;">`;
						// html += `<h1>Table ${tableIndex + 1}</h1>`;
						html += `<table style="width: 95%; table-layout: fixed; border-collapse: collapse;"><thead><tr style="color: #615F78;
								font-family: 'Inter', sans-serif;
								font-size: 12px;
								font-style: normal;
								font-weight: 500;
								line-height: normal;background: #DBDAF3; height: 40px;">`;
		
						/* for (const tableHeading of singleData.tableHead) {
							console.log(tableIndex , 'index')
						  html += `<th>${tableHeading}</th>`;
						} */
		
						for (let ind = 0; ind < singleData.tableHead.length; ind++) {
							const element = singleData.tableHead[ind];
							if (ind === 0) html += `<th style="text-align: left; padding-left: 2.5%;width: 15%;">${element}</th>`;
							else if (ind == singleData.tableHead.length - 1) html += `<th style="text-align: right;padding-right: 2.5%;">${element}</th>`;
							else html += `<th style="text-align: right; padding-left: 2%">${element}</th>`;
						}
		
						html += `</tr></thead><tbody>`;
						let counter = 0;
						for (const record of this.getTableData(tableIndex, singleData.totalData)) {
							counter++;
							// console.log(counter, 'counter', singleData.totalData.length, 'legnth', tableIndex, 'table index');
							let rowColorCode;
							let profitNLossColor;
							let netProfitNLossColor;
							let style;
							((counter % 2 == 0) ? rowColorCode = '#F0F0F0' : rowColorCode = '#fff');
		
							/* if(tableIndex > 0) {
								var totalLength = counter + 
							} else {
								counter === singleData.totalData.length ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: 'Inter', sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = 'color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;'
							} */
		
							if (singleData.pageTitle === 'Family Distribution' && singleData.subTitle === null) {
								record.CLIENTCODE === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
		
								(record.UNREALISEDPLVAL > 0 ? netProfitNLossColor = '#009E3B' : (record.UNREALISEDPLVAL < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
								(record.UNREALISEDPLPER > 0 ? profitNLossColor = '#009E3B' : (record.UNREALISEDPLPER < 0 ? profitNLossColor = '#DF514C' : profitNLossColor = '#000000'));
								
								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.CLIENTCODE}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.CURRENTVALUE)}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.HLDPERCENTAGE)}</td>`;
								html += `<td style="text-align: right;color: ${netProfitNLossColor}"">${record.UNREALISEDPLVAL < 0 ? '(' : ''}${this.numberFormat(record.UNREALISEDPLVAL)}${record.UNREALISEDPLVAL < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${profitNLossColor}"> ${record.UNREALISEDPLPER < 0 ? '(' : ''}${this.numberFormat(record.UNREALISEDPLPER)}${record.UNREALISEDPLPER < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Stocks') {
								record.INSTRUMENTNAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								
								(record.UNREALIEDGL > 0 ? netProfitNLossColor = '#009E3B' : (record.UNREALIEDGL < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
								(record.UNRLGAINLOSSPER > 0 ? profitNLossColor = '#009E3B' : (record.UNRLGAINLOSSPER < 0 ? profitNLossColor = '#DF514C' : profitNLossColor = '#000000'));
								
								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.INSTRUMENTNAME}</td>`;
								html += `<td style="text-align: right;">${record.QUANTITY == '--' ? '--' : parseInt(record.QUANTITY)}</td>`;
								html += `<td style="text-align: right;">${record.AVGPURCHASEPRICE == '-' ? '--' : record.AVGPURCHASEPRICE == 0 ? '--' : this.numberFormat(record.AVGPURCHASEPRICE)}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.HOLDINGCOST)}</td>`;
								html += `<td style="text-align: right;">${record.PreviousClosingPrice == '-' ? '--' : record.PreviousClosingPrice == 0 ? '--' : this.numberFormat(record.PreviousClosingPrice)}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.MARKETVALUE)}</td>`;
								html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.UNREALIEDGL < 0 ? '(' : ''}${this.numberFormat(record.UNREALIEDGL)}${record.UNREALIEDGL < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${profitNLossColor}">${record.UNRLGAINLOSSPER < 0 ? '(' : ''}${this.numberFormat(record.UNRLGAINLOSSPER)}${record.UNRLGAINLOSSPER < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Mutual Funds') {
								record.Scheme_Name === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								(record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
								
								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.Scheme_Name}</td>`
								html += `<td style="text-align: right;">${record.scheme_category}</td>`;
								html += `<td style="text-align: right;">${record.Present_Units == '-' ? '--' : record.Present_Units == 0 ? '--' : this.numberFormat(+(record.Present_Units))}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.Current_Investment)}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.Present_Value)}</td>`;
								html += `<td style="text-align: right;">${record.Present_NAV == '-' ? '--' : this.numberFormat(record.Present_NAV)}</td>`;
								html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Bonds') {
								record.BondCompany === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								// (record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
								
								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.BondCompany}</td>`
								html += `<td style="text-align: right;">${record.Tenor ? record.Tenor : '--'}</td>`;
								html += `<td style="text-align: right;">${record.BondBookingDate ? moment(record.BondBookingDate).format('DD/MM/YYYY') : '--'}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.BondAmount)}</td>`;
								html += `<td style="text-align: right;">${record.Rateofinterest ? record.Rateofinterest : '--'}</td>`;
								html += `<td style="text-align: right;padding-right: 2.5%;">${record.BondMaturityDate ? moment(record.BondMaturityDate).format('DD/MM/YYYY') : '--'}</td>`;
								
								// html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
								// html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'Fixed Deposit') {
								record.FDCompany === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								// (record.Unrealized_Profit > 0 ? netProfitNLossColor = '#009E3B' : (record.Unrealized_Profit < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
								
								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.FDCompany}</td>`
								html += `<td style="text-align: right;">${record.Tenor ? record.Tenor : '--'}</td>`;
								html += `<td style="text-align: right;">${record.FDBookingDate ? moment(record.FDBookingDate).format('DD/MM/YYYY') : '--'}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.FDBookingAmount)}</td>`;
								html += `<td style="text-align: right;">${record.RateOfInterest ? record.RateOfInterest : '--'}</td>`;
								html += `<td style="text-align: right;padding-right: 2.5%;">${record.FDMaturityDate ? moment(record.FDMaturityDate).format('DD/MM/YYYY') : '--'}</td>`;
	
								// html += `<td style="text-align: right;">${record.Present_NAV == '-' ? '--' : this.numberFormat(record.Present_NAV)}</td>`;
								// html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.Unrealized_Profit < 0 ? '(' : ''}${this.numberFormat(record.Unrealized_Profit)}${record.Unrealized_Profit < 0 ? ')' : ''}</td>`;
								// html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['pnlValue'] > 0 ? '#009E3B' : (record['pnlValue'] < 0 ? '#DF514C' : '#000000')}">${record['pnlValue'] < 0 ? '(' : ''}${this.numberFormat(record['pnlValue'])}${record['pnlValue'] < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'AIF') {
								record.SCHEMENAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								(record.netpl > 0 ? netProfitNLossColor = '#009E3B' : (record.netpl < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
	
								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.SCHEMENAME}</td>`
								html += `<td style="text-align: right;">${record.AUMDATE ? record.AUMDATE: '--'}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.NETINVESTMENT)}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.CRRENTVALUE)}</td>`;
								html += `<td style="text-align: right;">${record.COMMITMENTAMOUNT}</td>`;
	
								html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.netpl < 0 ? '(' : ''}${this.numberFormat(record.netpl)}${record.netpl < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${ record['plPer'] == '--' ? '#000000' :  record['plPer'] > 0 ? '#009E3B' : (record['plPer'] < 0 ? '#DF514C' : '#000000')}">${record['plPer'] < 0 ? '(' : ''}${record['plPer'] == '--' ? '--' : this.numberFormat(record['plPer'])}${record['plPer'] < 0 ? ')' : ''}</td>`;
							} else if (singleData.pageTitle === 'Product Wise Holdings' && singleData.subTitle == 'PMS') {
								record.SCHEMENAME === 'Total' ? style = 'height: 51px; flex-shrink: 0; background: #FFF7EC;color: #000; text-align: right; font-family: Inter, sans-serif; font-size: 12px; font-style: normal; font-weight: 600; line-height: normal;' : style = `color: #000; font-family: 'Inter', sans-serif; font-size: 11px; font-style: normal; font-weight: 500; line-height: normal; width: 782px; background: ${rowColorCode}; height: 45px; flex-shrink: 0;`
								html += `<tr style="${style}">`;
								(record.netpl > 0 ? netProfitNLossColor = '#009E3B' : (record.netpl < 0 ? netProfitNLossColor = '#DF514C' : netProfitNLossColor = '#000000'));
	
								html += `<td style="text-align: left; padding-left: 2.5%;width: 15%;">${record.SCHEMENAME}</td>`
								html += `<td style="text-align: right;">${record.AUMDATE ? record.AUMDATE: '--'}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.NETINVESTMENT)}</td>`;
								html += `<td style="text-align: right;">${this.numberFormat(record.CRRENTVALUE)}</td>`;
	
								html += `<td style="text-align: right;color: ${netProfitNLossColor}">${record.netpl < 0 ? '(' : ''}${this.numberFormat(record.netpl)}${record.netpl < 0 ? ')' : ''}</td>`;
								html += `<td style="text-align: right; padding-right: 2.5%; color: ${record['plPer'] > 0 ? '#009E3B' : (record['plPer'] < 0 ? '#DF514C' : '#000000')}">${record['plPer'] < 0 ? '(' : ''}${this.numberFormat(record['plPer'])}${record['plPer'] < 0 ? ')' : ''}</td>`;
							}
		
							html += `</tr>`;
						}
						html += `</tbody></table></div>
						</div>
							<div style="position: absolute;bottom: 2%;left: 2%;"><span style="color: #817A9A;
									text-align: center;
									font-family: 'Inter', sans-serif;
									font-size: 14px;
									font-style: normal;
									font-weight: 700;
									line-height: normal;">PORTFOLIO 360</span>&nbsp;
								<span style="color: #84859E;
										font-family: 'Inter', sans-serif;
										font-size: 10px;
										font-style: normal;
										font-weight: 400;
										line-height: normal;">${moment(new Date()).format('MMM DD, YYYY')}</span>	
							</div>
							
						</div></page>`;
					}
				}

				//Total page number code
				// <div style="position: absolute;bottom: 2%;right: 2%;">
				// 	<span style="color: #84859E;
				// 	text-align: center;
				// 	font-size: 12px;
				// 	font-weight: 700;
				// 	line-height: normal;">${singleData.pageNumber < 10 ? '0' + (+singleData.pageNumber + +tableIndex) : (+singleData.pageNumber + +tableIndex)}</span>
				// </div>
		
				this.htmlData = await this.sanitize.bypassSecurityTrustHtml(html);
		
	
				let productData = ['DE', 'MF'];
				// let productPer = [eqDisplayChart, mfDisplayChart];
				// this.chartProdData = [eqDisplayChart, mfDisplayChart];
				let memberPer: any = []
	
				if(this.memberData.length > 0){
					this.memberData.forEach((element, i) => {
						memberPer.push(parseInt(element.EQUITYPERCENTAGE))
						element.img = 'img' + i;
					})
				}
				setTimeout(() => {
					this.familyMemberPdfGraphDisplay(this.chartMemberData, memberPer);
					this.productPDFGraph(productData, this.chartProdData)
					setTimeout(() => {
						this.downloadPDF(this.memberData, this.productChartData, this.displayRelation);
					}, 3000);
				}, 4000);
			}
		
			numberFormat(value: any) {
				return this.formatNumDecimal.transform(value)
			}
		
			getTableData(pageIndex: number, data: any) {
				const startIndex = pageIndex * this.itemsPerPage;
				const endIndex = startIndex + this.itemsPerPage;
				return data.slice(startIndex, endIndex);
			}
		
			getTableIndexes(data: any): number[] {
				return Array.from({ length: Math.ceil(data.length / this.itemsPerPage) }, (_, i) => i);
			}
		
			public downloadPDF(memberGraphData: any, productGraphData: any, displayRelation: any) {
		
				const doc = new jsPDF({
					orientation: 'l', // landscape
					unit: 'pt', // points, pixels won't work properly
					// format: "A4" // set needed dimensions for any element
					format: [842, 595] // set needed dimensions for any element
				});
				const specialElementHandlers = {
					'#editor': function (element: any, renderer: any) {
						return true;
					}
				};
		
		
				this.pdfLoader = true;
				// var pageCount = doc.getNumberOfPages();
				// console.log(pageCount, 'pageCount');
		
				var width = doc.internal.pageSize.getWidth();
				var height = doc.internal.pageSize.getHeight();
		
				let pageHeight = doc.internal.pageSize.height;
		
				// Before adding new content
				let y = 500 // Height position of new content
				let x = 30
				if (y >= pageHeight) {
					y = 0 // Restart height position
				}
				/* doc.html(elementHTML.innerHTML, {
					x,
					y,
				}); */
		
				// return;
				/* let canvas;
				canvas = document.querySelector('#chartJSContainer4');
				  //creates image
				//   var canvasImg = canvas.toDataURL("image/jpeg", 1.0);
				  var dataURL = canvas.toDataURL();
				
				  //creates PDF from img
				  doc.setPage(2);
				//   doc.text(15, 15, "Cool Chart");
				  doc.addImage(dataURL, 'JPEG', 0, 0, 150, 150 );
				  doc.save('canvas.pdf'); */
		
				var elementHTML: any = document.querySelector("#content");
				let canvas: any;
				canvas = document.querySelector('#familyMemberPDFGraph');
				//creates image
				//   var canvasImg = canvas.toDataURL("image/jpeg", 1.0);
				var dataURL: any = canvas.toDataURL();
		
				let canvas2: any;
				canvas2 = document.querySelector('#productWise');
				//creates image
				//   var canvasImg = canvas.toDataURL("image/jpeg", 1.0);
				var dataURL2 = canvas2.toDataURL();
		
				// no need to remove id
				// document.getElementById('familyMemberPDFGraph')?.remove();
				// document.getElementById('productWise')?.remove();
				const _this = this;
				doc.html(elementHTML.innerHTML, {
					callback: function (doc) {
						// Save the PDF
						/* let pageNo;
						pageNo = doc.getNumberOfPages().toString();
						// doc.setPage(7);
		
						// doc.setFontSize(12);//optional
						// doc.setTextColor(40);//optional
						// doc.setFont('normal');//optional
						// doc.text(pageNo, 150, doc.internal.pageSize.height - 10);
		
						for (var i = 1; i <= doc.getNumberOfPages(); i++) {
							if (i != 1) {
								doc.setPage(i);
								doc.setFontSize(14);//optional
								doc.setTextColor('#84859E');//optional
								doc.setFont('sans-serif', 'sans-serif', '900');//optional
								doc.text(i < 10 ? '0' + String(i - 1) : String(i - 1), doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 20);
								// doc.text('PORTFOLIO 360', 30, doc.internal.pageSize.height - 20);
		
								// doc.addImage('../assets/imgs/portfolio.png','PNG', 30, doc.internal.pageSize.height - 40, 100, 20);
		
							}
						} */
		
						// doc.text(150,285, 'page ' + doc.page);
						/* let canvas;
						canvas = document.querySelector('#chartJSContainer4');
						//creates image
						//   var canvasImg = canvas.toDataURL("image/jpeg", 1.0);
						var dataURL = canvas.toDataURL();
		
						document.getElementById('chartJSContainer4').remove() */
		
						//creates PDF from img
						doc.setPage(2);
						//   doc.text(15, 15, "Cool Chart");
						
						if(memberGraphData.length > 0 && productGraphData.length > 0){
							doc.addImage(dataURL, 'JPEG', 20, 350, 150, 150);
							doc.addImage(dataURL2, 'JPEG', 470, 350, 150, 150);
						} else if(memberGraphData.length === 0 && productGraphData.length > 0) {
							doc.addImage(dataURL2, 'JPEG', 233, 355, 150, 150);
						} else if(memberGraphData.length > 0 && productGraphData.length === 0) {
							doc.addImage(dataURL, 'JPEG', 233, 355, 150, 150);
						}
						doc.deletePage(doc.getNumberOfPages())
						
						let fileName = displayRelation === 'FAMILY' ? 'Family' : 'Self';
						doc.save(fileName + ' Portfolio ' + _this.clientCode + '.pdf');
					},
					// width: 160, //target width in the PDF document
					// windowWidth: 675 //window width in CSS pixels
				});
		
			}
	
	
	
	familyDropdown(obj: any){
		var element: any = this.document.getElementById("ClientMainBox");
		//this.displayReport = false;
		element.classList.toggle("d-none");
		this.clientName = obj['ClientName'];
		this.clientCode = obj['ClientCode'];
		this.displayRelation = obj['Relation'];
		let childCode = this.ciphetText.aesEncrypt(obj['ClientCode']);
		let parentClientId = this.ciphetText.aesEncrypt(this.parentClientCode);
		this.resetData();
		this.getClientPortfolio(this.tokenValue, parentClientId, this.ciphetText.aesEncrypt(obj['PartnerCode']),'0', childCode)
		//this.getFamilyDropdown(this.tokenValue, clientID, this.ciphetText.aesEncrypt(this.userIdValue))
		this.getEqClientTable(this.tokenValue, parentClientId, this.ciphetText.aesEncrypt(obj['PartnerCode']),'0', childCode)
		this.getProductSummary(this.tokenValue, parentClientId, this.ciphetText.aesEncrypt(obj['PartnerCode']), '0', childCode);
		this.getMfDetails(this.tokenValue, parentClientId,this.ciphetText.aesEncrypt(obj['PartnerCode']),'0', childCode)
		this.getFdDetails(this.tokenValue, parentClientId,this.ciphetText.aesEncrypt(obj['PartnerCode']),'0', childCode)
		this.getBondsDetail(this.tokenValue, parentClientId,this.ciphetText.aesEncrypt(obj['PartnerCode']),'0', childCode)
		this.getAifDetail(this.tokenValue, parentClientId,this.ciphetText.aesEncrypt(obj['PartnerCode']),'0', childCode)
		this.getPmsDetail(this.tokenValue, parentClientId,this.ciphetText.aesEncrypt(obj['PartnerCode']),'0', childCode)
	}

	resetData(){
		this.cardSegments = [
			{ name: 'Stocks', segmentValue: 'eq', value: '0', pl: '0', sequence: 0, table: 'table-1' },
			{ name: 'Mutual Funds', segmentValue: 'mf', value: '0', pl: '0', sequence: 1, table: 'table-2' },
			{ name: 'Fixed Deposit', segmentValue: 'fd', value: '0', pl: '0', sequence: 2, table: 'table-3'},
			{ name: 'Bonds', segmentValue: 'bonds', value: '0', pl: '0', sequence: 3, table: 'table-4' },
			{ name: 'AIF', segmentValue: 'aif', value: '0', pl: '0', sequence: 4, table: 'table-5' },
			{ name: 'PMS', segmentValue: 'pms', value: '0', pl: '0', sequence: 5, table: 'table-6' },
		]
		this.currentValue = 0;
		this.investedValue = 0;
		this.unRealisePlValue = 0;
		this.unRealisePlPer = 0;
		this.lastUpdated = null;
		this.productAssetSummary = [];
		this.productSummaryData = [];
		this.memberData = [];
		this.memberGraph = true;
		this.clientEqData = [];
		this.clientMfData = [];
		this.clientMappMsg = false;
		this.totalEqHoldingValue = 0;
		this.totalEqUnrealizeGl = 0;
		this.eqHoldingPer = 0;
		this.mfAllocation = 0;
		this.bondsAllocation = 0;	
		this.aifAllocation = 0;	
		this.pmsAllocation = 0;	
		this.fdAllocation = 0;

		this.eqAllocation = 0;
		this.mfTableDisplay = [];
		this.hybridCatagory = [];
		this.equityCatagory = [];
		this.elssCatagory = [];
		this.debtCatagory = [];
		this.liquidCatagory = [];
		this.eqTableDisplay = [];
		this.fdTableDisplay = [];
		this.bondsTableDisplay = [];
		this.aifTableDisplay = [];
		this.pmsTableDisplay = [];
		this.totalMfHoldingValue = 0;
		this.totalPmsHoldingValue = 0;
		this.totalAifHoldingValue = 0;
		this.totalMfUnrealizeGl = 0;

		this.totalBondsUnrealizeGl = 0;	
		this.totalFdUnrealizeGl = 0;	
		this.totalAifUnrealizeGl = 0;	
		this.totalPmsUnrealizeGl = 0;
		

		this.totalEqCurrentValue = 0
		this.totalMfCurrentValue = 0;
		this.totalBondsCurrentValue = 0;	
		this.totalFdCurrentValue = 0;	
		this.totalAifCurrentValue = 0;	
		this.totalPmsCurrentValue = 0;

		this.mfHoldingPer = 0;
		this.bondsHoldingPer = 0	
		this.fdHoldingPer = 0	
		this.aifHoldingPer = 0	
		this.pmsHoldingPer = 0

		this.aifData = [];
		this.bondsData = [];
		this.fdData = [];
		this.pmsData = [];
		//this.familyOptionDisplay = true;

	}

	mfSegClick(id: any){
		const ele = document.getElementById(id) as HTMLInputElement;
		ele.checked = false;
	}

	portfolioSummary:any[] = [];
	displayPdf:boolean = true;
	familyTotalInvestment:any = 0;
	familyHoldTotalPer:any = 0;
	

	getClientPortfolio(token: any, id: any, userid: any,consFlag: any, childCode?: any) {
		this.subscription.add(
			this.clientService.getClientPortfolio(token, id, userid,consFlag, childCode)
				.subscribe((response: any) => {
					// this.portfolioRes = true;
					if(response['Head']['ErrorCode'] == 0){
						if(response['Body']['ClientPortfolioSummaryMapp'] && response['Body']['ClientPortfolioSummaryMapp'].length){
							this.portfolioSummary = response['Body']['ClientPortfolioSummaryMapp'];
							this.portfolioData = response['Body']['ClientPortfolioSummaryMapp'][0];
							this.currentValue =  this.portfolioData['CURRENTVALUE'] && this.portfolioData['CURRENTVALUE'].length > 0 ? parseInt(this.portfolioData['CURRENTVALUE']) : 0
							this.investedValue = this.portfolioData['INVESTEDVALUE'] && this.portfolioData['INVESTEDVALUE'].length > 0 ?  parseInt(this.portfolioData['INVESTEDVALUE']) : 0;
							this.lastUpdated = this.portfolioData['LASTUPDATEDON'];
							this.unRealisePlValue = this.portfolioData['UNREALISEDPLVAL'] && this.portfolioData['UNREALISEDPLVAL'].length > 0 ? parseInt(this.portfolioData['UNREALISEDPLVAL']) : 0;
							this.unRealisePlPer = this.portfolioData['UNREALISEDPLPER'];
						}
						if(consFlag == '1' && response['Body']['ClientPortfolioSummary1Mapp'] && response['Body']['ClientPortfolioSummary1Mapp'].length){
							this.familyHoldingDist = response['Body']['ClientPortfolioSummary1Mapp'];
							this.familyTotalInvestment = this.calculateSum(this.familyHoldingDist, 'INVESTEDVALUE')
							const obj: any = {
								"CLIENTCODE": "Total",
								"CURRENTVALUE": this.calculateSum(this.familyHoldingDist, 'CURRENTVALUE'),
								"HLDPERCENTAGE": this.calculateSum(this.familyHoldingDist, 'HLDPERCENTAGE'),
								"UNREALISEDPLVAL": this.calculateSum(this.familyHoldingDist, 'UNREALISEDPLVAL'),
								//"UNREALISEDPLPER": this.calculateSum(this.familyHoldingDist, 'UNREALISEDPLPER')
							}
							obj['UNREALISEDPLPER'] = (obj['UNREALISEDPLVAL'] / this.familyTotalInvestment) * 100;
							this.familyHoldingDist.push(obj);
						}
					}
					if(consFlag == '1' && this.currentValue == 0 && this.investedValue == 0){
						this.clientMappMsg = true
						this.dataLoad = true;
					}
				})
		)
	}

	familyHoldingDist:any[] = [];

	displayQty(value: any){
		return parseInt(value) 
	}

	getEqClientTable(token: any, id: any, userid: any,consFlag: any, childCode?: any) {
		this.subscription.add(
			this.clientService.getClientEqDetails(token, id, userid, consFlag,childCode)
				.subscribe((res: any) => {
					if(res['Head']['ErrorCode'] == 0){
						// if(res['Body']['ClientEquityDetailsMap']['Successflag'] && res['Body']['ClientEquityDetailsMap']['Successflag'] != 'N'){
						// 	this.dataLoad = true;
						// }
						//console.log(res['Body']['ClientEquityDetailsMapp']);
						//this.eqTableDisplay = res['Body']['ClientEquityDetailsMapp'];

						this.clientEqData = res['Body']['ClientEquityDetailsMapp'];
						if(this.clientEqData && this.clientEqData.length){
							this.eqTableDisplay = this.clientEqData.filter(element => {
								return element.INSTRUMENTNAME != 'Total'
							})

							this.totalEqHoldingValue = 0;
							this.totalEqUnrealizeGl = 0;
							this.totalEqCurrentValue = 0
							this.clientEqData.forEach(element => {
								this.totalEqCurrentValue = this.totalEqCurrentValue + parseFloat(element.MARKETVALUE);
								
								this.totalEqHoldingValue = this.totalEqHoldingValue + parseFloat(element.HOLDINGCOST);
								this.totalEqUnrealizeGl = this.totalEqUnrealizeGl + parseFloat(element.UNREALIEDGL)
							})
							this.eqHoldingPer = this.numberFormat((this.totalEqUnrealizeGl / this.totalEqHoldingValue) * 100);

							this.cardSegments[0]['value'] = this.numberFormat(this.totalEqCurrentValue);
							this.cardSegments[0]['pl'] = this.numberFormat(this.eqHoldingPer)
							const obj: any = {
								// "BSECODE": "500180",
								// "SECTORTYPE": "",
								"INSTRUMENTNAME": "Total",
								"QUANTITY": '--',
								"AVGPURCHASEPRICE": '-',
								"HOLDINGCOST": this.calculateSum(this.clientEqData, 'HOLDINGCOST'),
								"PreviousClosingPrice": '-',
								"MARKETVALUE": this.calculateSum(this.clientEqData, 'MARKETVALUE'),
								"UNREALIEDGL": this.calculateSum(this.clientEqData, 'UNREALIEDGL'),
								//"UNRLGAINLOSSPER": this.calculateSum(this.clientEqData, 'UNRLGAINLOSSPER')
							}
							obj['UNRLGAINLOSSPER'] = (obj['UNREALIEDGL'] / obj['HOLDINGCOST']) * 100
							this.clientEqData.push(obj);
						}

						if(res['Body']['ClientEquityDetailsMap'] && res['Body']['ClientEquityDetailsMap'][0]['Successflag'] == 'N'){
							this.dataLoad = true;
						}
					
					}
				
				}, error =>{
					this.clientEqData = [];
					this.dataLoad = true;
				})
		)
	}

	getFdDetails(token: any, id: any, userid: any,consFlag: any, childCode?: any) {
		this.subscription.add(
			this.clientService.getFixDepoDetails(token, id, userid, consFlag, childCode)
				.subscribe((res: any) => {
					if(res['Body']['FDDetail'] && res['Body']['FDDetail'].length > 0){
						this.fdData = res['Body']['FDDetail'];
						this.fdTableDisplay = this.fdData.filter(element => {
							return element.FDCompany != 'Total'
						})
						this.fdData.forEach(element => {	
							this.totalFdCurrentValue = this.totalFdCurrentValue + parseFloat(element.FDBookingAmount);	
						})
						this.cardSegments[2]['value'] = this.numberFormat(this.calculateSum(this.fdData, 'FDBookingAmount'));
						this.cardSegments[2]['pl'] = '-';

						const obj = {
							"FDCompany": "Total",
							"Tenor": '',
							"FDBookingDate": '',
							"FDBookingAmount": this.calculateSum(this.fdData, 'FDBookingAmount'),
							"RateOfInterest": this.calculateSum(this.fdData, 'RateOfInterest'),
							"FDMaturityDate": '',
						}
						this.fdData.push(obj);
					}
					else{
						this.cardSegments[2]['pl'] = '-';
					}
				}, error => {
					this.cardSegments[2]['pl'] = '-';
				})
		)	
	}

	bondsData:any[] = [];

	getBondsDetail(token: any, id: any, userid: any,consFlag: any, childCode?: any){
		this.subscription.add(
			this.clientService.getBondDetails(token, id, userid, consFlag, childCode)
				.subscribe((res: any) => {
					if(res['Body']['BondDetail'] && res['Body']['BondDetail'].length > 0){
						this.bondsData = res['Body']['BondDetail'];
						this.bondsTableDisplay = this.bondsData.filter(element => {
							return element.BondCompany != 'Total'
						})

						this.bondsData.forEach(element => {	
							this.totalBondsCurrentValue = this.totalBondsCurrentValue + parseFloat(element.BondAmount);	
						})

						this.cardSegments[3]['value'] = this.numberFormat(this.calculateSum(this.bondsData, 'BondAmount'));
						this.cardSegments[3]['pl'] = '-';

						const obj = {
							"BondCompany": "Total",
							"Tenor": '',
							"BondAmount": this.calculateSum(this.bondsData, 'BondAmount'),
							"Present_Value": this.calculateSum(this.bondsData, 'Present_Value'),
							"Rateofinterest": '',
							"BondMaturityDate": '',
						}
						this.bondsData.push(obj);
						
					}
					else{
						this.cardSegments[3]['pl'] = '-';
					}
				}, error => {
					this.bondsData = [];
					this.cardSegments[3]['pl'] = '-';

				})
		)	
	}

	pmsData:any[] = [];

	getPmsDetail(token: any, id: any, userid: any,consFlag: any, childCode?: any){
		this.subscription.add(
			this.clientService.getPmsDetails(token, id, userid, consFlag, childCode)
				.subscribe((res: any) => {
					this.totalPmsHoldingValue = 0;
					
					if(res['Body']['ClientPMSDetailsMapp'] && res['Body']['ClientPMSDetailsMapp'].length > 0){
						this.pmsData = res['Body']['ClientPMSDetailsMapp'];
						this.pmsTableDisplay = this.pmsData.filter(element => {
							return element.SCHEMENAME != 'Total'
						})

						this.pmsData.forEach(element => {
							element.netpl = (element.CRRENTVALUE - element.NETINVESTMENT)
							element.plPer = ((element.CRRENTVALUE - element.NETINVESTMENT) / element.NETINVESTMENT) * 100
							this.totalPmsCurrentValue = this.totalPmsCurrentValue + parseFloat(element.CRRENTVALUE);	
							this.totalPmsUnrealizeGl = this.totalPmsUnrealizeGl + parseFloat(element.netpl);
							this.totalPmsHoldingValue = this.totalPmsHoldingValue + parseFloat(element.NETINVESTMENT);
						})
						this.pmsHoldingPer = this.numberFormat((this.calculateSum(this.pmsData, 'netpl') / this.calculateSum(this.pmsData, 'NETINVESTMENT')) * 100);
						this.cardSegments[5]['value'] = this.numberFormat(this.calculateSum(this.pmsData, 'CRRENTVALUE'))
						this.cardSegments[5]['pl'] = this.numberFormat((this.calculateSum(this.pmsData, 'netpl') / this.calculateSum(this.pmsData, 'NETINVESTMENT')) * 100)

						const obj = {
							"SCHEMENAME": "Total",
							"CREATEDON": '',
							"NETINVESTMENT": this.calculateSum(this.pmsData, 'NETINVESTMENT'),
							"CRRENTVALUE": this.calculateSum(this.pmsData, 'CRRENTVALUE'),
							// "Present_Value": this.calculateSum(this.pmsData, 'Present_Value'),
							// "Present_NAV": '-',
							"netpl": this.calculateSum(this.pmsData, 'netpl'),
							"plPer": this.pmsHoldingPer
						}
						// obj['plPer'] = (obj['netpl'] / obj['NETINVESTMENT']) * 100

						this.pmsData.push(obj);
					}
				})
		)
	}

	getAifDetail(token: any, id: any, userid: any,consFlag: any, childCode?: any) {
		this.subscription.add(
			this.clientService.getAifDetails(token, id, userid, consFlag, childCode)
				.subscribe((res: any) => {
					this.totalAifHoldingValue = 0;
					if(res['Body']['ClientAIFDetailsMapp'] && res['Body']['ClientAIFDetailsMapp'].length > 0){
						this.aifData = res['Body']['ClientAIFDetailsMapp'];
						this.aifTableDisplay = this.aifData.filter(element => {
							return element.SCHEMENAME != 'Total'
						})

						this.aifData.forEach(element => {
							element.CRRENTVALUE = element.CRRENTVALUE.length > 0 ? element.CRRENTVALUE : 0
							element.NETINVESTMENT = element.NETINVESTMENT.length > 0 ? element.NETINVESTMENT : 0
							element.COMMITMENTAMOUNT = element.COMMITMENTAMOUNT.length > 0 ? element.COMMITMENTAMOUNT : 0
							element.netpl = (element.CRRENTVALUE - element.NETINVESTMENT)
							if(element.NETINVESTMENT == 0){
								element.plPer = '--'
							}
							else{
								element.plPer = ((element.CRRENTVALUE - element.NETINVESTMENT) / element.NETINVESTMENT) * 100
							}
							
							this.totalAifCurrentValue = this.totalAifCurrentValue + parseFloat(element.CRRENTVALUE);	
							this.totalAifUnrealizeGl = this.totalAifUnrealizeGl + parseFloat(element.netpl);
							this.totalAifHoldingValue = this.totalAifHoldingValue + parseFloat(element.NETINVESTMENT);
						})
						this.aifHoldingPer = this.numberFormat((this.calculateSum(this.aifData, 'netpl') / this.calculateSum(this.aifData, 'NETINVESTMENT')) * 100);
						this.cardSegments[4]['value'] = this.numberFormat(this.calculateSum(this.aifData, 'CRRENTVALUE'));
						this.cardSegments[4]['pl'] = this.numberFormat((this.calculateSum(this.aifData, 'netpl') / this.calculateSum(this.aifData, 'NETINVESTMENT')) * 100)

						const obj = {
							"SCHEMENAME": "Total",
							"CREATEDON": '',
							"NETINVESTMENT": this.calculateSum(this.aifData, 'NETINVESTMENT'),
							"CRRENTVALUE": this.calculateSum(this.aifData, 'CRRENTVALUE'),
							"COMMITMENTAMOUNT": this.calculateSum(this.aifData, 'COMMITMENTAMOUNT'),
							// "Present_Value": this.calculateSum(this.aifData, 'Present_Value'),
							// "Present_NAV": '-',
							"netpl": this.calculateSum(this.aifData, 'netpl'),
							"plPer": this.aifHoldingPer
						}
						// obj['plPer'] = (obj['netpl'] / obj['NETINVESTMENT']) * 100

						this.aifData.push(obj);
					}
				})
		)	
	}

	getProductSummary(token: any, id: any, userid: any, consFlag: any, childCode?: any) {
		this.dataLoad = false;
		this.subscription.add(
			this.clientService.getProductSummary(token, id, userid, consFlag, childCode)
				.subscribe((res: any) => {
					if(res['Head']['ErrorCode'] == 0){
						if(res['Body']['AssetSummary'] || res['Body']['ProductSummary']){
							if(res['Body']['AssetSummary'].length > 0){
								this.productAssetSummary = res['Body']['AssetSummary'].sort((a: any, b: any) => parseFloat(b.EQUITYPERCENTAGE) - parseFloat(a.EQUITYPERCENTAGE));
							}
							this.productSummaryData = res['Body']['ProductSummary'];
							this.memberData = res['Body']['ClientSummary'];

							this.memberData.forEach(element => {
								element.Relation = 'No'
								this.familyMappList.forEach(data => {
									if(data.ClientCode == element.CLIENTCODE){
										element.Relation = data.Relation
									}
								})								
							})

							if(this.memberData.length){
								this.memberData = this.memberData.sort((a, b) => parseFloat(b.EQUITYPERCENTAGE) - parseFloat(a.EQUITYPERCENTAGE));
							}
							else{
								this.memberGraph = false;
							}

							if(this.memberData.length == 1){
								if(this.memberData[0].Relation == 'SELF'){
									this.memberGraph = false
								}
							}

							let assetData: any = [];
							let assetPer: any = []
							if(this.productAssetSummary.length > 0){
								this.productAssetSummary.forEach(element => {
									assetData.push(element.ASSET);
									assetPer.push(parseFloat(element.EQUITYPERCENTAGE))
								})
							}

							let EqObj = this.productSummaryData.find(o => o.PRODUCT === 'DE');
							let eqValue = 0; let emValue = 0; let dmValue = 0;
							let eqPer = 0; let emPer = 0; let dmPer = 0;
							
							if(EqObj){
								 eqPer = (EqObj['EQUITYPERCENTAGE'])
								 this.eqAllocation = eqPer;
								 this.stocksEquityValue = EqObj['EQUITYVALUE'];
							}

							let checkMfValue = false;
							if(this.productSummaryData.length > 0){
								let bondsObj = this.productSummaryData.find(o => o.PRODUCT === 'BO') || this.productSummaryData.find(o => o.PRODUCT === 'BD');	
								let fdObj = this.productSummaryData.find(o => o.PRODUCT === 'FD');	
								let aifObj = this.productSummaryData.find(o => o.PRODUCT === 'AIF');	
								let pmsObj = this.productSummaryData.find(o => o.PRODUCT === 'PMS');
								this.bondsAllocation = bondsObj ? bondsObj['EQUITYPERCENTAGE'] : 0;	
								this.fdAllocation = fdObj ? fdObj['EQUITYPERCENTAGE'] : 0;	
								this.aifAllocation = aifObj ? aifObj['EQUITYPERCENTAGE'] : 0;	
								this.pmsAllocation = pmsObj ? pmsObj['EQUITYPERCENTAGE'] : 0;

								this.productSummaryData.forEach(element => {
									if(element.PRODUCT == 'DM' || element.PRODUCT == 'EM' || element.PRODUCT == 'HM' || element.PRODUCT == 'LM' || element.PRODUCT == 'CM' ||  element.PRODUCT == 'OM'){
										element.type = 'MF';
										checkMfValue = true;
									}
									else{
										element.type = 'Others'
									}
								})
								
							}
							
							if(checkMfValue){
								let mfDataObj = {
									'PRODUCT':'MF',
									'type': 'Others',
									'EQUITYVALUE' : this.productSummaryData.filter((item) =>item.type == 'MF')
									.map((item) => +item.EQUITYVALUE)
									.reduce((sum, current) => sum + current),
									'EQUITYPERCENTAGE' : this.productSummaryData.filter((item) =>item.type == 'MF')
									.map((item) => +item.EQUITYPERCENTAGE)
									.reduce((sum, current) => sum + current),
								}
								this.productSummaryData.push(mfDataObj)
							}

							this.productSummaryData = this.productSummaryData.filter(element => {
								return element.type == 'Others'
							})
						
							if(checkMfValue){
								let mfObj = this.productSummaryData.find(o => o.PRODUCT === 'MF');
								this.mfAllocation = mfObj['EQUITYPERCENTAGE'];
								this.mfEquityValue = mfObj['EQUITYVALUE'];
							}
							
							let memberData: any = [];
							let memberPer: any = []

							if(this.memberData.length > 0){
								this.memberData.forEach((element, i) => {
									memberData.push(element.CLIENTCODE);
									memberPer.push(parseFloat(element.EQUITYPERCENTAGE))
									element.img = 'img' + i;
								})
							}

							let productPer: any = [];
							 let productData: any = [];

							 this.productChartData = this.productSummaryData.sort((a, b) => parseFloat(b.EQUITYPERCENTAGE) - parseFloat(a.EQUITYPERCENTAGE));

							 if(this.productChartData.length > 0){
								this.productChartData.forEach((element, i) => {
									element.img = 'img' + i;
									productData.push(element.PRODUCT);
									productPer.push(this.numberFormat(element.EQUITYPERCENTAGE))
									
								})
								this.chartProdData = productPer;
							}

							this.productChartData = this.productChartData.sort((a, b) => parseFloat(b.per) - parseFloat(a.per));
							this.dataLoad = true;

								setTimeout(() => {
									document.querySelectorAll(".category-panel-li")[0].classList.add("active");
								}, 3500);

								if(this.dataLoad){
									this.chartDisplay(assetData,assetPer)
									if(this.memberGraph){
										this.chartDisplay1(memberData, memberPer)
									}
									this.chartDisplay2(productData, productPer)
								}
								this.chartMemberData = memberData;
						}

						if(res['Body']['ClientProductDetailsMap'] && res['Body']['ClientProductDetailsMap'][0]['Successflag'] == 'N'){
							this.dataLoad = true;
							this.displayReport = false;
						}
						
					}
					else{
						this.dataLoad = true;
					}
					
				}, error => {
					this.dataLoad = true;
				})

				
		)
	}
	
	tabTableContent(panel_name: any, tabItem: any, name?: any) {
		if (this.document.querySelectorAll(".category-panel-li").length > 0) {
			this.document.querySelectorAll(".category-panel-li").forEach(function (item, i) {
				document.querySelectorAll(".category-panel-li")[i].classList.remove("active");
			});
			document.querySelectorAll(".category-panel-li")[panel_name].classList.add("active");
			this.document.querySelectorAll(".tab-content-block").forEach(function (item, i) {
				document.querySelectorAll(".tab-content-block")[i].classList.remove("active");
			});
			// panel_name.classList.add("active");
			document.querySelector(".tab-content-block." + tabItem)?.classList.add("active");
		}
	}
	
	getMfDetails(token: any, clientId: any, userId: any,consFlag: any, childCode?: any){
		this.subscription.add(
			this.clientService.getClientMfDetails(token, clientId, userId,consFlag, childCode)
				.subscribe((res: any) => {
					if(res['Head']['ErrorCode'] == 0){
						this.clientMfData = res['Body']['MFDetail'];
						this.hybridCatagory = [];
						this.equityCatagory = [];
						this.elssCatagory = [];
						this.debtCatagory = [];
						this.liquidCatagory = [];

						this.totalMfHoldingValue = 0;
						this.totalMfUnrealizeGl = 0;
						this.totalMfCurrentValue = 0;

						if(this.clientMfData && this.clientMfData.length){
							this.clientMfData.forEach((element) => {
								const pnlValue = ((element.Unrealized_Profit / element.Current_Investment) * 100);
								element['pnlValue'] = pnlValue;
								if ((element.SCHEME_CATEGORY).includes('Hybrid') == true) {
									element.scheme_category = "Hybrid";
								}
								else if ((element.SCHEME_CATEGORY).includes('Equity') == true) {
									if ((element.SCHEME_CATEGORY).includes('Equity Linked Savings Scheme') == true) {
										element.scheme_category = "ELSS";
									}
									else {
										element.scheme_category = "Equity"
										this.equityCatagory.push(element);
									}
								}
								else if ((element.SCHEME_CATEGORY).includes('Debt') == true) {
									if ((element.SCHEME_CATEGORY).includes('Liquid') == true) {
										element.scheme_category = "Liquid";
									}
									else {
										element.scheme_category = "Debt";
									}
								}
								else {
									element.scheme_category = element.SCHEME_CATEGORY;
								}
								this.totalMfHoldingValue = this.totalMfHoldingValue + parseFloat(element.Current_Investment);
								
								this.totalMfUnrealizeGl = this.totalMfUnrealizeGl + parseFloat(element.Unrealized_Profit);
								this.totalMfCurrentValue = this.totalMfCurrentValue + parseFloat(element.Present_Value);
							})
							this.mfHoldingPer = this.numberFormat((this.totalMfUnrealizeGl / this.totalMfHoldingValue) * 100);

							this.cardSegments[1]['value'] = this.numberFormat(this.totalMfCurrentValue);
							this.cardSegments[1]['pl'] = this.numberFormat(this.mfHoldingPer)
							
							this.hybridCatagory = this.clientMfData.filter(element => {
								return element.scheme_category == 'Hybrid'
							})
	
							this.equityCatagory = this.clientMfData.filter(element => {
								return element.scheme_category == 'Equity'
							})
	
							this.elssCatagory = this.clientMfData.filter(element => {
								return element.scheme_category == 'ELSS'
							})
	
							this.debtCatagory = this.clientMfData.filter(element => {
								return element.scheme_category == 'Debt'
							})
	
							this.liquidCatagory = this.clientMfData.filter(element => {
								return element.scheme_category == 'Liquid'
							})
							this.segmentChangeMf('EquityData');

							const obj: any = {
								"Scheme_Name": "Total",
								"scheme_category": '',
								"Present_Units": '-',
								"Current_Investment": this.calculateSum(this.clientMfData, 'Current_Investment'),
								"Present_Value": this.calculateSum(this.clientMfData, 'Present_Value'),
								"Present_NAV": '-',
								"Unrealized_Profit": this.calculateSum(this.clientMfData, 'Unrealized_Profit'),
								//"pnlValue": this.calculateSum(this.clientMfData, 'pnlValue')
							}
							obj['pnlValue'] = (obj['Unrealized_Profit'] / obj['Current_Investment']) * 100
	
							this.clientMfData.push(obj);
						}
					}
				})
		)
	}

	
	//getClientMfDetails
	segmentChangeMf(value: any){
		if(value == 'elss'){
			this.mfTableDisplay = this.elssCatagory
		}
		if(value == 'debt'){
			this.mfTableDisplay = this.debtCatagory
		}
		if(value == 'hybrid'){
			this.mfTableDisplay = this.hybridCatagory
		}
		if(value == 'liquid'){
			this.mfTableDisplay = this.liquidCatagory
		}
		if(value == 'EquityData'){
			this.mfTableDisplay = this.equityCatagory
		}
	}

	// presentPopover1(e: Event) {
	// 	this.popover.event = e;
	// 	this.isOpen = true;
	//   }
	
	myBreakdown(index: any,id: any) {

		if(document.querySelectorAll(".breakdown_more_box").length > 0){
			document.querySelectorAll(".breakdown_more_box").forEach(function(item,i){
			  document.querySelectorAll(".breakdown_more_box")[i].classList.add("d-none");
		  });

		}

		document.querySelectorAll(".breakdown_more_box")[index].classList.toggle("d-none");

		//document.querySelectorAll(".breakdown_more_box")[i].classList.add("d-none")

			// panel_name.classList.add("active");
			
		// if (params == '1') {
			// var element = document.getElementById(id);
			// console.log(element);
			// element.classList.toggle("d-none");

		// }
	}
	
	myClientselect() {
		var element: any = this.document.getElementById("ClientMainBox");
		element.classList.toggle("d-none");
	}

	breakdownTable() {
		this.document.querySelector('.breakdownTable')?.classList.remove('d-none');
		this.document.querySelector('.tableoverlay')?.classList.remove('d-none');
		this.document.querySelector('#breakDown')?.classList.toggle("d-none");
		//this.document.querySelector('.select_client_dropdown_main')?.classList.add('d-none');
	}

	closeBreakdown() {
		document.querySelector('.breakdownTable')?.classList.add('d-none');
		document.querySelector('.tableoverlay')?.classList.add('d-none');
	}
	
	addMemberForm(){
		this.document.querySelector('.addmemeberForm')?.classList.remove('d-none');
		this.document.querySelector('.tableoverlay')?.classList.remove('d-none');
		this.displayStep1 = true;
		this.displayStep2 = false;
		this.displayStep3 = false;
		this.otpInput = null;
		this.verifyBtn = true;
	}


	closeForm() {
		document.querySelector('.addmemeberForm')?.classList.add('d-none');
		document.querySelector('.tableoverlay')?.classList.add('d-none');
		this.resetForm();
		this.resetFamilyDropdown(this.tokenValue, this.ciphetText.aesEncrypt(this.parentClientCode), this.ciphetText.aesEncrypt(this.userIdValue))
	}

	resetForm(){
		// const ele1 = document.getElementById('clientIdFrom') as HTMLInputElement;
		// ele1.style.display = 'block';
		// const ele = document.getElementById('otpBox') as HTMLInputElement;
		// ele.style.display = 'none';
		this.memberClientCode = null;
		this.selectRelation = null;
		this.otpInput = null;
		this.displayStep1 = true;
		this.displayStep2 = false;
		this.displayStep3 = false;
		this.verifyBtn = true;
		const ele1 = document.getElementById('memberPop') as HTMLInputElement;
		ele1.style.display = 'block';
	}

	addMemberFormnext(){
		if(this.memberClientCode && this.selectRelation){
			let params = {
				"Type": "Add",
				"FamilyName": this.memberClientCode,
				"MakerID": this.clientCode,
				"Relation": this.selectRelation,
				"OTP":  ""
			}
			this.subscription.add(
				this.clientService.getMemberDetails(params,this.tokenValue)
					.subscribe((res: any) => {
						if(res['Head']['ErrorCode'] == 0){
							if(res['Body']['ClientFamilyMappingDetailsMapp']){
							  let getOtpObj = res['Body']['ClientFamilyMappingDetailsMapp'].filter((obj: any) => obj.ClientCode == this.memberClientCode && obj.Status == 'Inactive');
							   this.checkOtp = getOtpObj[0]['OTP'];
							
							   localStorage.setItem('saveOtp', this.checkOtp);
							   	this.displayStep1 = false;
								this.displayStep2 = true;
								this.displayStep3 = false;
							//    this.document.querySelector('.step2').classList.remove('d-none');
							//    const ele1 = document.getElementById('clientIdFrom') as HTMLInputElement;
							//    ele1.style.display = 'none';
							}
						
						}
						else if (res['Head']['ErrorCode'] == 1 && res['Head']['ErrorDescription'].includes('already exist')) {
							let alredyExistClientObj = res['Body']['ClientFamilyMappingDetailsMapp'].filter((obj: any) => obj.ClientCode == this.memberClientCode && obj.Status == 'Inactive');
							this.resendOTP()
							//this.toast.displayToast(res['Head']['ErrorDescription']);
						}
						else{
							this.toast.displayToast(res['Head']['ErrorDescription']);
						}
					})
			)
		
			//this.addVerifyMember('Add')
		}
		else{
			this.toast.displayToast('Please select input value')
		}

		// const btnEle = document.getElementById('verifyMemberBtn') as HTMLInputElement;
		// btnEle.disabled = true;
	}

	resendOTP(){
		let params = {
			"Type": "Resend",
			"FamilyName": this.memberClientCode,
			"MakerID": this.clientCode,
			"Relation": this.selectRelation,
			"OTP":  ""
		}
		this.subscription.add(
			this.clientService.getMemberDetails(params,this.tokenValue)
				.subscribe((res: any) => {
					if(res['Head']['ErrorCode'] == 0){
						if(res['Body']['ClientFamilyMappingDetailsMapp']){
							//if()
						  let getOtpObj = res['Body']['ClientFamilyMappingDetailsMapp'].filter((obj: any) => obj.ClientCode == this.memberClientCode && obj.Status == 'Inactive');
						   this.checkOtp = getOtpObj[0]['OTP'];
						
						   localStorage.setItem('saveOtp', this.checkOtp);
						   this.displayStep1 = false;
						   this.displayStep2 = true;
						   this.displayStep3 = false;
						//    this.document.querySelector('.step2').classList.remove('d-none');
						//    const ele1 = document.getElementById('clientIdFrom') as HTMLInputElement;
						//    ele1.style.display = 'none';
						}
					
					}
					else{
						this.toast.displayToast(res['Head']['ErrorDescription']);
					}
				})
			)	
	}

	otpInput:any;

	onOtpChanged(event: any){
		this.otpInput = event
	}

	onotpFieldCompleted(event: any){
		// const btnEle = document.getElementById('verifyMemberBtn') as HTMLInputElement;
		// btnEle.disabled = false;
		this.verifyBtn = false;
	}

	verifyMember(){
		if(this.otpInput == this.checkOtp){
			let params = {
				"Type": "Verify",
				"FamilyName": this.memberClientCode,
				"MakerID": this.clientCode,
				"Relation": this.selectRelation,
				"OTP": this.checkOtp
			}
			this.subscription.add(
				this.clientService.getMemberDetails(params,this.tokenValue)
					.subscribe((res: any) => {
						if(res['Head']['ErrorCode'] == 0){
							this.toast.displayToast(res['Body']['SuccessMsg']);
							const ele1 = document.getElementById('memberPop') as HTMLInputElement;
							ele1.style.display = 'none';
							this.displayStep1 = false;
							this.displayStep2 = false;
							this.displayStep3 = true;
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

	chartDisplay(label?: any, data?: any) {
		setTimeout(() => {
			this.chart1Data[0].data = data;
			this.chart1Labels = label;
			// this.dognut = new Chart(this.chartJSContainer1.nativeElement, {
			// 	type: 'doughnut',
			// 	data: {
			// 		labels: label,
			// 		datasets: [{
			// 			data: data,
			// 			borderWidth: 0,
			// 			backgroundColor: ['#5E3FBE', '#A88DEB', '#84DDFC', '#f1956c']
			// 		}],
			// 	},
			// 	options: {
			// 		cutout: '80%',
			// 		responsive: true,
			// 		maintainAspectRatio: false,
			// 		plugins: {
			// 			legend: {
			// 				display: false
			// 			}
			// 		}
					
			// 	},
			// });
		}, 1000);
		
	}

	chartDisplay1(label?: any, data?: any) {
		setTimeout(() => {
			this.chart2Data[0].data = data;
			this.chart2Labels = label;
			// this.dognut1 = new Chart(this.chartJSContainer2.nativeElement, {
			// 	type: 'doughnut',
			// 	data: {
			// 		labels: label,
			// 		datasets: [{
			// 			data: data,
			// 			borderWidth: 0,
			// 			backgroundColor: ['#5E3FBE', '#A88DEB', '#84DDFC', '#F1956C', '#FFEA81']
			// 		}],
			// 	},
			// 	options: {
			// 		cutout: '80%',
			// 		responsive: true,
			// 		maintainAspectRatio: false,
			// 		plugins: {
			// 			legend: {
			// 				display: false
			// 			}
			// 		}
			// 	},
			// });
		}, 1000);
			
		
	}

	chartDisplay2(label?: any, data?: any) {
		setTimeout(() => {
			this.chart3Data[0].data = data;
			this.chart3Labels = label;
			// this.dognut2 = new Chart(this.chartJSContainer3.nativeElement, {
			// 	type: 'doughnut',
			// 	data: {
			// 		labels: label,
			// 		datasets: [{
			// 			data: data,
			// 			borderWidth: 0,
			// 			backgroundColor: ['#5E3FBE', '#A88DEB', '#84DDFC', '#F1956C', '#FFEA81', '#593CC7', '#0080B2']
			// 		}],
			// 	},
			// 	options: {
			// 		cutout: '80%',
			// 		responsive: true,
			// 		maintainAspectRatio: false,
			// 		plugins: {
			// 			legend: {
			// 				display: false
			// 			}
			// 		}
			// 	},
			// });
		}, 1000);
		
	}

		familyMemberPdfGraphDisplay(label?: any, data?: any) {
			setTimeout(()=> {
				this.pdfFamilyData[0].data = data;
				this.pdfFamilyLabels = label;
			},400);
		// 	let ab: any;
		// ab = document.getElementById('familyMemberPDFGraph');
		
		// this.dognut1 = new Chart(ab, {
		// 	type: 'doughnut',
		// 	data: {
		// 		labels: label,
		// 		datasets: [{
		// 			data: data,
		// 			borderWidth: 0,
		// 			backgroundColor: ['#FF4F01', '#FF9000', '#F9C501', '#8BCA01', '#00B29C']
		// 		}],
		// 	},
		// 	options: {
		// 		cutout: '70%',
		// 		responsive: true,
		// 		maintainAspectRatio: false,
		// 		plugins: {
		// 			legend: {
		// 				display: false
		// 			}
		// 		}
		// 	},
		// });

	}

	productPDFGraph(label?: any, data?: any) {

		setTimeout(() => {
			this.pdfproductWiseData[0].data = data;
			this.pdfproductWiseLabels = label;
		});
		// let ab: any;
		// ab = document.getElementById('productWise');
		// setTimeout(() => {
		// 	this.dognut2 = new Chart(ab, {
		// 		type: 'doughnut',
		// 		data: {
		// 			labels: label,
		// 			datasets: [{
		// 				data: data,
		// 				borderWidth: 0,
		// 				// backgroundColor: ['#FF4F01', '#FF9000', '#84DDFC', '#F1956C', '#FFEA81', '#593CC7']
		// 				backgroundColor: ['#FF4F01', '#FF9000', '#F9C501', '#8BCA01', '#00B29C', '#0080B2']
		// 			}],
		// 		},
		// 		options: {
		// 			cutout: '70%',
		// 			responsive: true,
		// 			maintainAspectRatio: false,
		// 			plugins: {
		// 				legend: {
		// 					display: false
		// 				}
		// 			}
		// 		},
		// 	});
		// }, 1000);

	}
	
	chartType(type: any) {
		// if (type == 'tree') {
		// 	this.displayDonutChart = false;
		// 	this.displayTreeChart = true;
		// 	setTimeout(() => {
		// 		this.treeMap1()
		// 	}, 2000);
			

		// }
		// else {
		// 	this.displayDonutChart = true;
		// 	this.displayTreeChart = false;
		// 	this.getProductSummary(this.tokenValue, this.ciphetText.aesEncrypt(this.clientCode), this.ciphetText.aesEncrypt(this.userIdValue));
			
		// }
	}

	
	getShortName(value: any){
		if(value && value.length){
			var shortName = value.match(/\b(\w)/g); // ['J','S','O','N']
			return shortName.join('');
		}

	}

	portfolioForm(){
		const url = 'https://forms.gle/5wJ16ssQtqCWJbtq5';
		window.open(url, '_blank');
	}

	goToAccDetail(){
		localStorage.setItem('clientDetail', "true");
		this.router.navigate(['/client-account-details', this.clientCode]);
	}

	resetFamilyDropdown(token: any, id: any, userid: any) {
		this.subscription.add(
			this.clientService.getFamilyMapping(token, id, userid)
				.subscribe((res: any) => {
					if(res['Head']['ErrorCode'] == 0){
						if(res['Body']['FamillyMapp'].length > 0){
							if(res['Body']['FamillyMapp'][0]['Successflag'] == 'N'){
								this.familyMappList = [];
							}
							else{
								this.familyMappList = res['Body']['FamillyMapp'];
							}
							
						}
						else{
							this.familyMappList = [];
						}
						
					}
				})
		)
	}
}
