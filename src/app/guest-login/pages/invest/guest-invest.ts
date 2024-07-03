import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
// import { IonSlides, ModalController, PopoverController, Platform } from '@ionic/angular';	review
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';    
// import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ToasterService } from '../../../helpers/toaster.service';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../helpers/common.service';

declare var cordova: any;
@Component({
	selector: 'app-guest-tab3',
	templateUrl: 'guest-invest.html',
	providers: [],
	styleUrls: ['guest-invest.scss']
})
export class GuestTab3Page implements OnDestroy {
	@ViewChild('slidesUpdated') sliderUpdated: ElementRef | undefined;	// IonSlides;
	@ViewChild('Slides') slider: ElementRef | undefined;


	sliderIndex: any = 0;
	sliderUpdatedIndex: number = 0;
	checkupList: any = [];
	goldenPiUrl?:SafeResourceUrl;
	slideOpts: any = {
		initialSlide: 0,
		slidesPerView: 1.5,
		speed: 400,
		arrow: false,
	};

	public overlayVisible = false;
	public displayHeader: any = [];
	public clearHeaderDetails: any = null;
	

	urlParameter: any = null;
	segmentID: any = null;

	public isRMFAN = false;

	datPipe = new DatePipe('en-US');

	public selectedClientCode: any = null;

	public isProd = environment['production'];

	private subscription = new Subscription();
	public clientAuthObj: any = null;
	equityBlockTabValue: any = 'equity';
	equityBlockButton: any[] = [
		{ name: 'Equity', value: 'equity' },
		{ name: 'Mutual Funds', value: 'mutual' },
		{ name: 'Insurance', value: 'insurance' },
		{ name: 'Bonds', value: 'bonds' },
		{ name: 'Other Products', value: 'other' }
	]

	public bondData: any[] = [
		{ icon: 'primary_bonds.svg', cardName: 'Primary Bonds', key: 'PrimaryBond' },
		{ icon: 'secondary_bonds.svg', cardName: 'Secondary Bonds', key: 'secondaryBonds' },
		{ icon: 'third_party_bonds.svg', cardName: 'Third Party Bonds', key: 'bonds' }
	]
	public equityData: any[] = [
		{ icon: 'small_case.svg', cardName: 'Smallcase', key: 'small_case'},
		{ icon: 'ipo_updated1.svg', cardName: 'IPO', key: 'ipo' },
		{ icon: 'grobox.svg', cardName: 'Grobox', key: 'grobox' },
		{ icon: 'InvestEdge-Logo.png', cardName: 'InvestEdge', key: 'invest_edge' }
	]

	public mutualData: any[] = [
		{ icon: 'start_sip.svg', cardName: 'Start SIP', key: 'start_sip' },
		{ icon: 'invest_lumpsum.svg', cardName: 'Invest Lumpsum', key: 'invest_lump' },
		{ icon: 'nfo_fmp_22.svg', cardName: 'NFO/FMP', key: 'nfo_fmp' },
		{ icon: 'transfer_holdings.svg', cardName: 'Transfer Holdings', key: 'trans_hold' },
		{ icon: 'mutfund_monitor.svg', cardName: 'Mutual Fund Monitor', key: 'fund_monitor' },
		{ icon: 'invest_basket.svg', cardName: 'Investment Baskets', key: 'invest_basket' },
	]

	public insuranceData: any[] = [
		{ icon: 'mutuafund_web.svg', cardName: 'Insurance website', key: 'web_insu' },
		{ icon: 'new_business_mapping.png', cardName: 'New Business Mapping', key: 'new-mapping' },
		{ icon: 'renew_business_mapping.png', cardName: 'Renewal Business Mapping', key: 'renewal-mapping' },
	]

	public otherData: any[] = [
		{ icon: 'fixed_depo.svg', cardName: 'Fixed Deposit', key: 'fix_deposit' }
	]

	constructor(public modalController: ModalController,
		private router: Router,
		private toast: ToasterService,
		private locationn: Location,
		public sanitizer: DomSanitizer,
		private commonService: CommonService
		// private iab: InAppBrowser
	) {}

	// for mobile when slide change get slide index value, and do functionality on base that
	async slideChanged(ev: any) {
		ev.preventDefault();
		ev.stopPropagation();
		this.sliderUpdatedIndex = await this.sliderUpdated?.nativeElement.swiper.activeIndex;

		if (this.sliderUpdatedIndex === 0) {
			this.equityBlockTabValue = 'equity';
		} else if (this.sliderUpdatedIndex === 1) {
			this.equityBlockTabValue = 'mutual';
		} else if (this.sliderUpdatedIndex === 2) {
			this.equityBlockTabValue = 'insurance';
		} else if (this.sliderUpdatedIndex === 3) {
			this.equityBlockTabValue = 'bonds';
		} else if (this.sliderUpdatedIndex === 4) {
			this.equityBlockTabValue = 'other';
		}
	}

	ionViewWillEnter() {
		this.overlayVisible = false;
		this.locationn.replaceState('/guest/guest-invest');
	}
	
	async changeSlide() {
		this.sliderIndex = await this.slider?.nativeElement.swiper.activeIndex;;
		// console.log(this.sliderIndex);
	}


	ngOnInit() {
	
	}



	
	goToSearch() {
		this.overlayVisible = !!this.overlayVisible;
		setTimeout(() => {
			//this.router.navigate(['/add-script'])
			this.router.navigate(['/dashboard-clients']);
		}, 300);
	}

	goToDashboard(){
		this.router.navigate(['/guest/guest-dashboard'])
	}
	goToNotification() {
		this.router.navigate(['/notification'])
	}

	

	ngOnDestroy() {
		clearTimeout(this.clearHeaderDetails);
		this.overlayVisible = false;
	}

	callBecomePartnerModal(cardName: "type") {
		// ignoring cardName for now
		// this.toast.displayToast(`${cardName} is not available for Guest Login`);
		this.commonService.becomePartnerModal();
	}
	
	
}
