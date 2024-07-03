import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { IonSlides } from '@ionic/angular';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Platform } from '@ionic/angular';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';

@Component({
	selector: 'app-brokerage-information',
	providers: [WireRequestService],
    templateUrl: './brokerage-information.page.html',
    styleUrls: ['./brokerage-information.page.scss'],
})
export class BrokerageInformationPage implements OnInit {
   // @ViewChild('slidesUpdated', { static: false }) sliderUpdated: any;	//IonSlides;
   @ViewChild('slidesUpdated') sliderUpdated: ElementRef | undefined;

	sliderIndex: any = 0;
	sliderUpdatedIndex: number = 0;
	public equityBlockTabValue = 'cash';
	brokerageInfo:any[] = [];
	dataLoad!:boolean;
	showDP:boolean=false;
	showBrokerageButton:boolean=true;
	active:boolean[]=[];
	public showErr = false;
    // public requestType: string = "Brokerage Request";
	// public requestTypeData: any[] = [
	// 	{ requestType: "Brokerage Request" }
	// ];
    public buttonData: any[] = [
		{ name: 'Cash Segment', value: 'cash' },
		{ name: 'FNO Segment', value: 'fno' },
		{ name: 'Currency Segement', value: 'curr' },
		{ name: 'Commodity Segment	', value: 'comm' },
		{ name: 'SLBM Segment', value: 'slbm' },
		
		// { name: 'Currency Segement', value: 'currency' }
	]
    // public cashSegment: any[] = [
    //    {typeSegment: 'Delivery NSE/BSE', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
    //    {typeSegment: 'Intraday NSE/BSE', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
    //    {typeSegment: 'Trade for Trade & Z group scrip', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
    //    {typeSegment: 'Auction', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
	// ]
	public cashSeg: any[] = [];
    // public fnoSegment: any[] = [
    //     {typeSegment: 'Equity Futures', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
    //     {typeSegment: 'Index Futures', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
    //     {typeSegment: 'Equity Options', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
    //     {typeSegment: 'Index Options', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
	//  ]
	 public fnoSeg: any[] = [];
	 public vasInfo:any[] = [];
    //  public slbmSegment: any[] = [
    //     {typeSegment: 'First leg', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
    //     {typeSegment: 'Second leg', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
    //     {typeSegment: 'Auction leg', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
	//  ]
	 public slbmSeg: any[] = [];
    //  public equitySegment: any[] = [
    //     {typeSegment: 'First leg', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
    //     {typeSegment: 'Reserve leg', maxBrokerage: '0.0100', minBrokerage: '0.0100', perLot: '-', side:'One Side'},
	//  ]
	 public currencySeg:any[] = [];
	 public commSeg:any[] = [];
	 public vasPlan:any[] = [];
	 urlParameter:any;
	 clientCode:any;
	 tab1: any ='tab1';
	 tab2: any;
	 showLoader!:boolean;
	 showdptab!:boolean;

    constructor(private storage: StorageServiceAAA, private wireReqService: WireRequestService, private route: ActivatedRoute, private router: Router,
		public commonService: CommonService, private platform: Platform) { }

    ngOnInit() {
		this.showdptab=true;
		this.urlParameter = this.route.params.subscribe(params => {
			this.clientCode = params['id'];
			
		})
		this.initBrokInfo();
		this.showDP=false;
		;
		
    }

    goBack() {
        window.history.back();
    }

    segmentChange(event: any) {
		if (this.equityBlockTabValue === 'cash') {
			this.sliderUpdatedIndex = 0;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		} else if (this.equityBlockTabValue === 'fno') {
			this.sliderUpdatedIndex = 1;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		} 
		else if (this.equityBlockTabValue === 'curr') {
			this.sliderUpdatedIndex = 2;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		}
		else if (this.equityBlockTabValue === 'comm') {
			this.sliderUpdatedIndex = 3;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		} 
		else if (this.equityBlockTabValue === 'slbm') {
			this.sliderUpdatedIndex = 4;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		}
	}

    // for mobile when slide change get slide index value, and do functionality on base that
	async slideChanged(ev: any) {
		ev.preventDefault();
		ev.stopPropagation();
		this.sliderUpdatedIndex = await this.sliderUpdated?.nativeElement.swiper.activeIndex;

		if (this.sliderUpdatedIndex === 0) {
			this.equityBlockTabValue = 'cash';
		} else if (this.sliderUpdatedIndex === 1) {
			this.equityBlockTabValue = 'fno';
		} else if (this.sliderUpdatedIndex === 2) {
			this.equityBlockTabValue = 'curr';
		} else if (this.sliderUpdatedIndex === 3) {
			this.equityBlockTabValue = 'comm';
		}
		else if (this.sliderUpdatedIndex === 4) {
			this.equityBlockTabValue = 'slbm';
		}
	}

	initBrokInfo(){
		this.showLoader=true;
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.BrokInfoData(token);
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.BrokInfoData(token);
				})
			}
		})
	}

	BrokInfoData(token: any){
		this.showLoader = true;
		this.wireReqService.getBrokerageInfo(token, this.clientCode).subscribe((res: any) => {
			if(res['Head']['ErrorCode'] == 0){
				this.showLoader = true;
				this.brokerageInfo = res['Body']['BrokerageData'];
				this.vasInfo = res['Body']['VasData'];
				
					this.dataLoad = true;
					this.showLoader=false;
					this.showdptab=false;	
				
            
				this.planStructureSeg(this.brokerageInfo, this.vasInfo);
				this.showErr = false;
			}
			else{
				this.showLoader = false;
				this.showErr = true;
			}
		})	
	}

	planStructureSeg(arr: any, vasArr: any){
		// console.log('array Length'+arr.length)
		// let cashSegment = [];
		// let fnoSegment = [];
		// let currSegment = [];

	 let cashSegmentIndex = arr.findIndex((x: any) => x.Segment === "Cash Segment" && x.Row === "Header");
	//  console.log(cashSegmentIndex);
	 
	 let fnoSegmentIndex = arr.findIndex((x: any) => x.Segment === "FNO Segment" && x.Row === "Header");
	//  console.log(fnoSegmentIndex);
	 
	 
	 let currSegmentIndex = arr.findIndex((x: any) => x.Segment === "Currency Segment" && x.Row === "Header");
	//  console.log(currSegmentIndex);
	 
	 let commSegmentIndex = arr.findIndex((x: any) => x.Segment === "Commodity Segment" && x.Row === "Header");
	//  console.log(currSegmentIndex);	


	 let slmbSegmentIndex = arr.findIndex((x: any) => x.Segment === "SLBM Segment" && x.Row === "Header");
	//  console.log(slmbSegmentIndex);

	this.cashSeg = arr.slice(cashSegmentIndex+1 ,fnoSegmentIndex);
	// console.log(this.cashSeg);
	
	this.fnoSeg = arr.slice(fnoSegmentIndex+1 ,currSegmentIndex);
	// console.log(this.fnoSeg);


	if(currSegmentIndex != -1){
		this.currencySeg = arr.slice(currSegmentIndex+1 ,commSegmentIndex);
		// console.log(this.currencySeg);
	}
	else{
		this.currencySeg = [];
	}

	if(commSegmentIndex != -1){
		this.commSeg = arr.slice(commSegmentIndex+1 ,slmbSegmentIndex);
		// console.log(this.commSeg);
	
	}	
	else{
		this.commSeg = [];
	}
	
	




	this.slbmSeg = arr.slice(slmbSegmentIndex+1 , this.brokerageInfo.length);
	// console.log(this.slbmSeg);


	
	if(vasArr[1] === undefined){
		this.vasPlan = [];	
	}
	else{
		this.vasPlan = [vasArr[1]];
	}

	// this.vasPlan = this.vasPlan.push(vasArr[1]);
	// console.log(this.vasPlan);

	}

	goToBrokrModification(){
		this.commonService.setClevertapEvent('Brokerage_Modification');
		this.commonService.analyticEvent('Brokerage_Modification', 'Wire Reports');
		if (this.platform.is('desktop')) {
			this.router.navigate(['/wire-requests','brokerage-request']);
		}
		else{
			this.router.navigate(['brok-insert-mobile']);
		}
	}
	clickDPCharge(client_code: any,val: any){
		
			this.clientCode=client_code;
	    this.dataLoad=false;
		this.showDP=true;
		this.showBrokerageButton=false;
		this.tab2='tab2';
		this.tab1=null;
		
		
	}
	clickBrokeragePlanStructure(val: any){
		
		this.initBrokInfo();
		this.showDP=false;
		this.showBrokerageButton=true;
		this.tab1='tab1';
		this.tab2=null;
	}

}
