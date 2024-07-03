import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { OrderPipe } from 'ngx-order-pipe';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { forkJoin } from 'rxjs';
import { CommonService } from '../../helpers/common.service';
import { Router } from '@angular/router';
import { SplitNameDate } from '../../helpers/splitNameDate.pipe';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { FiltersComponent } from '../filters/filters.component';

@Component({
	selector: 'app-consolidated-holdings',
	providers: [SplitNameDate],
	templateUrl: './consolidated-holdings.component.html',
	styleUrls: ['./consolidated-holdings.component.scss'],
})
export class ConsolidatedHoldingsComponent implements OnInit {
	public filterOption: any = 'client_code';
	@Input() userID: any;
	public selectOption: any = null;
	public mobilefilterOption: any = 'client_code';
	public order: string = 'quantity';
	public reverse: boolean = false;
	public colorFilterIcon: boolean = false;
	public orderbookFilter: any;
	public ascending: boolean = true;
	public selectedValue: any = 'Select';
	@Input() consHolding: any[] = [];
	@Input() consCommoHolding: any[] = [];
	concatHoldingData: any[] = [];
	totalHoldingDetails: any[] = [];
	isAscendic!: boolean;
	searchTerm: string = '';
	public isRefresh: boolean = false;
	SearchPlaceHolder = "Search by Client Code"
	selectSearch = "ClientCode";
	tokenValue: any;
	changeSegment:boolean = false;
	public selectData: any[] = [
		{ selectOption: 'NSE Cash', selectValue: 'nseCash' }
	];
	public val: string = 'asc';
	endIndex: number = 100;
	enableNextMobile: boolean = false;

	constructor(private popoverController: PopoverController, private modalController: ModalController, private orderPipe: OrderPipe, private storage: StorageServiceAAA, private clientService: ClientTradesService, private commonservice: CommonService, private router: Router, private splitNameFromDate: SplitNameDate) { }

	ngOnInit() {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('sToken').then(token => {
					this.tokenValue = token;

				})
			} else {
				this.storage.get('subToken').then(token => {
					this.tokenValue = token;
				})
			}
		})
		this.isRefresh = true;
		setTimeout(() => {
			// this.storage.get('sToken').then((token) => {
			let consHoldingEqDetails = this.clientService.getconsolidateHolding(this.tokenValue, this.userID);
			let consCommHoldingDetails = this.clientService.getconsolidateCommodityHolding(this.tokenValue, this.userID);
			forkJoin([consHoldingEqDetails, consCommHoldingDetails]).subscribe((response: any) => {
				this.totalHoldingDetails = response[0]['body']['HoldingAAA'].concat(response[1]['body']['Data']);
				this.totalHoldingDetails.forEach((element, index) => {
					element.srNo = index;
				})
				this.concatHoldingData = this.totalHoldingDetails
				if(this.concatHoldingData.length > 100) this.enableNextMobile = true;
				setTimeout(() => {
					this.isRefresh = false;
				}, 500);
			})
			//  })
			this.orderPipe.transform(this.concatHoldingData, 'quantity');
		}, 700);
		this.commonservice.setClevertapEvent('ConsolidatedHoldings');
	}


	// sorting function for column
	setOrder(value: string) {
		this.enableNextMobile = false;
		if(this.concatHoldingData.length > 100){
			this.isRefresh = true;
		}
		this.reverse = !this.reverse;
		this.order = value;
		if (this.reverse) {
			this.ascending = false;
			this.val = 'desc';
		} else {
			this.ascending = true;
			this.val = 'asc';
		}
		if(this.concatHoldingData.length > 100){
			setTimeout(() => {
				this.enableNextMobile = true;
				this.endIndex = 100;
				this.desktopTablescrollToTop();
				this.isRefresh = false;
			}, 400);
		}
	}
	// Filter the list according to selected Item 
	async openPopover(ev: any) {
		
		const items = [
			{ title: 'NSE Cash' },
			{ title: 'BSE Cash' },
			{ title: 'NSE & FO' },
			{ title: 'BSE F&O' },
			{ title: 'NSE Currency' },
			{ title: 'NSE Commodity' },
			{ title: 'BSE Commodity' },
			{ title: 'MCX Commodity' },
			{ title: 'NCDEX Commodity' }
		];
		ev.stopPropagation();
		const popover = await this.popoverController.create({
			component: PopoverComponent,
			componentProps: { items: items },
			cssClass: "custom-popover select-popover",
			mode: "md",
			showBackdrop: false,
			event: ev
			// translucent: true
		});

		popover.onDidDismiss().then((data:any) => {
			this.changeSegment = true;
			if (data["data"]) {
				this.isRefresh = true;
				this.concatHoldingData = this.totalHoldingDetails
				// this.ngOnInit();
				setTimeout(() => {
					this.isRefresh = false;
				}, 500);
				this.setOrder('srNo');
				const response = data['data'];
				if (response['result']['title']) {
					this.selectedValue = response['result']['title'];
					if (this.selectedValue == "NSE Cash") {
						this.concatHoldingData = this.concatHoldingData.filter(function (el) {
							return el.Exch == "N" && el.ExchType == "C"
						});
					}
					else if (this.selectedValue == "BSE Cash") {
						this.concatHoldingData = this.concatHoldingData.filter(function (el) {
							return el.Exch == "B" && el.ExchType == "C"
						});
					}
					else if (this.selectedValue == "NSE & FO") {
						this.concatHoldingData = this.concatHoldingData.filter(function (el) {
							var array = [];
							var res = el.Symbol.split(' ')[0];
							var res1 = el.Symbol.split(res)[1];
							array = [res, res1];
							return el.Exch == "N" && el.ExchType == "D" && array[1] != "";
						});
					}
					else if (this.selectedValue == "BSE F&O") {
						this.concatHoldingData = this.concatHoldingData.filter(function (el) {
							var array = [];
							var res = el.Symbol.split(' ')[0];
							var res1 = el.Symbol.split(res)[1];
							array = [res, res1];
							return el.Exch == "B" && el.ExchType == "D" && array[1] != "";
						});
					}
					else if (this.selectedValue == "NSE Currency") {
						this.concatHoldingData = this.concatHoldingData.filter(function (el) {
							return el.Exch == "N" && el.ExchType == "U"
						});
					}
					else if (this.selectedValue == "NSE Commodity") {
						this.concatHoldingData = this.concatHoldingData.filter(function (el) {
							return el.Exch == "N" && el.ExchType == "Y"
						});
					}
					else if (this.selectedValue == "BSE Commodity") {
						this.concatHoldingData = this.concatHoldingData.filter(function (el) {
							return el.Exch == "B" && el.ExchType == "Y"
						});
					}
					else if (this.selectedValue == "MCX Commodity") {
						this.concatHoldingData = this.concatHoldingData.filter(function (el) {
							return el.Exch == "M" && el.ExchType == "D"
						});
					}
					else if (this.selectedValue == "NCDEX Commodity") {
						this.concatHoldingData = this.concatHoldingData.filter(function (el) {
							return el.Exch == "N" && el.ExchType == "X"
						});
					}
				}
			}
			this.enableNextMobile = false;
			setTimeout(() => {
				this.enableNextMobile = true;
				if(this.concatHoldingData.length > 100) this.enableNextMobile = true;
				this.desktopTablescrollToTop();
			}, 400);
		});
		return await popover.present();
	}

	resetData() {
		this.selectedValue = 'Select';
		this.isRefresh = true;
		this.concatHoldingData = this.totalHoldingDetails;
		this.reverse = false;
		this.order = "srNo";
		this.concatHoldingData.forEach((element, ind) => {
			element['isVisible'] = false;
		});
		this.setOrder("srNo")
		setTimeout(() => {
			this.isRefresh = false;
		}, 500);
	}

	// filter popup scrip name, code, requested by and quantity
	async filterPopup() {
		this.colorFilterIcon = true;
		const modal = await this.modalController.create({
			component: FiltersComponent,
			cssClass: 'filter tradebook holdings',
			componentProps: {
				orderbookFilter: [
					{ option: 'Client Code' },
					{ option: 'Scrip Name' },
					{ option: 'Segment' },
				]
			}
		});
		modal.onDidDismiss().then((data: any) => {
			if (data['data']) {
				const response = data['data'];
				this.resetData()
				this.searchTerm = '';
				if (response['result']['option'] === 'Client Code') {
					this.mobilefilterOption = 'client_code';
					this.SearchPlaceHolder = "Search by Client Code"
				} else if (response['result']['option'] === 'Scrip Name') {
					this.mobilefilterOption = 'scrip_name';
					this.SearchPlaceHolder = "Search by Scrip Name"
				} else if (response['result']['option'] === 'Segment') {
					this.mobilefilterOption = 'segment';
					
				}
			}
			this.enableNextMobile = false;
			setTimeout(() => {
				if(this.concatHoldingData.length > 100) this.enableNextMobile = true;
				this.endIndex = 100;
				this.desktopTablescrollToTop();
			}, 400);
		});
		return await modal.present();
	}


	percentChangeValue(quantity: any, currentPrice: any, previousClose: any, perChange: any) {
		if (quantity < 0) {
			//Sell Order
			//loss  ltp-previousClose should be positive
			if (currentPrice - previousClose > 0) {
				if (perChange > 0) {
					perChange = 0 - (perChange);
				}
				return perChange;
			} else {   //profit ltp-previousClose should be negative
				if (perChange < 0) {
					perChange = 0 - (perChange);
				}
				return perChange;
			}
		}
		return perChange;

	}

	dropClick(sr: any, arr: any) {
		arr.forEach((element: any, ind: any) => {
			if (sr !== element.srNo) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
			}
		});
	}

	//click on sort
	// sortBySegment() {
	// 	this.selectedValue = 'Select';
	// 	this.isRefresh = true;
	// 	this.concatHoldingData = this.totalHoldingDetails;
	// 	//this.reverse = false;
	// 	this.concatHoldingData.forEach((element, ind) => {
	// 		element['isVisible'] = false;
	// 	});
	// 	this.setOrder("Symbol")
	// 	setTimeout(() => {
	// 		this.isRefresh = false;
	// 	}, 500);
	// 	// this.isAscendic ? this.ascendic() : this.descendic()
	// }
	// sort the list in asc order
	// ascendic() {
	// 	this.isAscendic = false;
	// 	this.concatHoldingData.sort((a, b) => (a.ExchType > b.ExchType) ? 1 : -1)
	// }
	// // sort the list in dsc order
	// descendic() {
	// 	this.isAscendic = true;
	// 	this.concatHoldingData.sort((a, b) => (a.ExchType > b.ExchType) ? -1 : 1)
	// }

	// Filter Selection for Holding List
	selectFilterOption(event: any) {
		// if (this.searchTerm.length > 0 || this.changeSegment) {
		// 	this.searchTerm = '';
		// 	this.changeSegment = false;
		// 	this.resetData()
		// }
		this.endIndex = 100;
		this.desktopTablescrollToTop();
		if (event == 'segment') {
			if(this.searchTerm.length > 0){
				this.resetData();
			}
			
		}
		else if (event == 'client_code') {
		  if(this.searchTerm.length > 0 || this.changeSegment){
		    this.changeSegment = false;
		    this.resetData()
		    this.searchTerm = '';
		  }

		}
		else if(event == 'scrip_name'){
			if(this.searchTerm.length > 0 || this.changeSegment){
				this.changeSegment = false;
				this.resetData()
				this.searchTerm = '';
			}
		}
	}
	searchType(event: any, type: any) {
		
		this.isRefresh = true;
		this.enableNextMobile = false;
		this.concatHoldingData = this.totalHoldingDetails;
		if (type == '1') {
			this.concatHoldingData = this.concatHoldingData.filter((item) => {
				return item.ClientCode.toLowerCase().includes(event.toLowerCase());
			});
		}
		else if (type == '2') {
			this.concatHoldingData = this.concatHoldingData.filter((item) => {
				return item.Symbol.toLowerCase().includes(event.toLowerCase());
			});
		}
		setTimeout(() => {
			this.endIndex = 100;
			this.enableNextMobile = true;
			this.desktopTablescrollToTop();
			this.isRefresh = false;
		}, 400);
	}
	
	goToClientDetails(dataObj: any){
		if(dataObj.Exch == 'N'){
			dataObj.ScripCode = dataObj.NseCode
		}
		else{
			dataObj.ScripCode = dataObj.BseCode
		}
		if(this.splitNameFromDate.transform(dataObj.Symbol,"date").length == 0){
			this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, dataObj.Symbol + dataObj.ExchType, dataObj.Symbol]);
		}
		else{
			if(dataObj.Symbol.includes('CE') || dataObj.Symbol.includes('PE')){
				this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, this.splitNameFromDate.transform(dataObj.Symbol,"date").split(' ').join('-').toUpperCase().substring(1) + dataObj.ExchType, dataObj.Symbol.split(' ')[0]])
			}
			else{
				this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, this.splitNameFromDate.transform(dataObj.Symbol,"date").split(' ').join('-').toUpperCase().substring(1) + dataObj.ExchType, dataObj.Symbol.split(' ')[0]])
			}
		}

	}

	tableScroll = (event: any) => {

		if(this.concatHoldingData.length > this.endIndex){
			const tableHeight = event.target.offsetHeight;
			const scrollHeight = event.target.scrollHeight,
			scrollerEndPoint = scrollHeight - tableHeight,
			tableScrollTop = event.target.scrollTop;
	
			if (tableScrollTop >= scrollerEndPoint - 100) {
				this.endIndex += 100;
			}
		}
		
	}

	desktopTablescrollToTop = () => {

		let table: any = document.getElementById("desktopTableContainer");
		if(table) table.scrollTop = 0;       
		
		let dataMobile: any = document.getElementById("mobileTableContainer");
		if(dataMobile) dataMobile.scrollTop = 0;    
	}

	loadDataMobile = (event: any) => {

		this.enableNextMobile = false;
		if(this.concatHoldingData.length > this.endIndex) this.enableNextMobile = true;

		if(this.enableNextMobile){
			setTimeout(() => {
				this.endIndex += 100;
				event.target.complete();
				if(this.endIndex > this.concatHoldingData.length){
					event.target.disabled = true;
				}
			}, 1000);
		}		
	}
}
