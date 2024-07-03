import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { OrderPipe } from 'ngx-order-pipe';
import { FiltersComponent } from '../filters/filters.component';
import { ClientTradesService } from '../../pages/recently-viewed-client-list/client-trades.service';
import { ComingSoonPopoverComponent } from '../coming-soon-popover/coming-soon-popover.component';
import { CommonService } from '../../helpers/common.service';
import { Router } from '@angular/router';
import { SplitNameDate } from '../../helpers/splitNameDate.pipe';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-consolidated-orderbook',
	providers: [ClientTradesService, SplitNameDate],
	templateUrl: './consolidated-orderbook.component.html',
	styleUrls: ['./consolidated-orderbook.component.scss'],
})
export class ConsolidatedOrderbookComponent implements OnInit {
	consOrderBookData: any[] = [];
	@Input() userID: any;
	@Input() tokenValue:any;
    public isAtoZSorting: boolean = false;
	public isRefresh: boolean = false;
	public filterOption: any = 'client_code';
	public order: string = 'clientCode';
	public reverse: boolean = false;
	public mobilefilterOption: any = 'client_code';
	public colorFilterIcon: boolean = false;
	public orderbookFilter: any;
    public ascending = true;
	public statusSegmentValue: any = 'fullyExecuted';
	public quantitySegmentValue: any = 'quantity';
	consOrderBookDetails: any[] = [];
	@Input() consOrderBook: any[] = [];
	searchTerm: string = '';
	isAscendic!: boolean;
	isAscendic1!: boolean;
	statusChanged:boolean = false;
	placeholderInput: string = 'Search by Client Code';
	public statusSegmentButton: any[] = [
		{ button: 'Fully Executed', value: 'fullyExecuted' },
		{ button: 'Partially Executed', value: 'partiallyExecuted' },
		{ button: 'Cancelled', value: 'cancelled' },
		{ button: 'Approved', value: 'approved' },
		{ button: 'Rejected by IIFL', value: 'rejected_iifl' },
		// {button: 'Sort by', value: 'sortStatus'}
	];
	public quantitySegmentButton: any[] = [
		{ button: 'Quantity', value: 'quantity' },
		{ button: 'Traded Quantity', value: 'tradedQuantity' },
		{ button: 'Pending Quantity', value: 'pendingQuantity' },
	];
	
	constructor(private popoverController: PopoverController, private modalController: ModalController, private orderPipe: OrderPipe, private storage: StorageServiceAAA, private clientService: ClientTradesService, private commonservice: CommonService, private router: Router, private splitNameFromDate: SplitNameDate) { }

	ngOnInit() {
		this.isRefresh = true;
			this.clientService.getConsOrderBook(this.userID).subscribe((res: any) => {
				if (res['head']['status'] == 0) {
					this.consOrderBookDetails = res['body']['OrderBookDetailAAA'];
					this.consOrderBookDetails.forEach((element, index) => {
						element.srNo = index;
					  })
					setTimeout(() => {
						this.isRefresh = false;
					}, 500);
					this.consOrderBookData = this.consOrderBookDetails;
					// console.log(this.consOrderBookData);
				}
			})
		this.orderPipe.transform(this.consOrderBookData, 'ClientId');
		this.commonservice.setClevertapEvent('ConsolidatedOrderbook');
	}

	// ionViewWillEnter() {

	// }

	//sorting function for column
	setOrder(value: string) {
		this.reverse = !this.reverse;
		this.order = value;
        if (this.reverse) {
            this.ascending = false;
        } else {
            this.ascending = true;
        }
	}

	displyOrderStatus(qty: any,pendingQty: any, orderStatus: any, SlTriggered: any):any {
		var status;
		if (orderStatus.includes("Pending") || orderStatus.includes("Modified")  || orderStatus.includes("SL Triggered")) {
			
			if (pendingQty == 0) {
				status = "Fully Executed";
			} else if (qty > pendingQty) {
				status = "Partially Executed";
			} 
			else if (SlTriggered.toUpperCase() == "Y") {
				status = "SL Triggered"
			} else {
				status = orderStatus;
			}
		}
		else {
			// if (orderStatus == "Rejected By 5P")
			// 	status = "Rejected By IIFL";
			// else {
			// 	status = orderStatus;
			// }
            status = orderStatus;
		}
		return status
	}

	dropClick(uniqueID: any, arr: any) {

		//this.trackByMethod(index, dataObj)
		arr.forEach((element: any, ind: any) => {
			if (uniqueID !== element.BrokerOrderId) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
			}
		});
    }
    
    // show popup for why rejected
    async whyRejected(ev: any, message?: any) {
		const items = [
			{ title: message, value: message },
		]
		ev.stopPropagation();
		const popover = await this.popoverController.create({
			component: ComingSoonPopoverComponent,
			componentProps: { items: items },
			cssClass: "coming-soon-popover",
			// mode: "md",
			showBackdrop: false,
			event: ev
			// translucent: true
		});
		return await popover.present();
	}

	// filter popup scrip name, code, requested by and quantity
	async filterPopup() {
		this.colorFilterIcon = true;
		const modal = await this.modalController.create({
			component: FiltersComponent,
			cssClass: 'filter',
			componentProps: {
				orderbookFilter: [
					{ option: 'Client Code' },
					{ option: 'Scrip Name' },
					{ option: 'Status' },
					// { option: 'Requested By' },
					{ option: 'Quantity' },
				]
			}
		});
		modal.onDidDismiss().then(data => {
			if (data['data']) {
				const response = data['data'];
				this.searchTerm = '';
					this.resetData();
				if (response['result']['option'] === 'Client Code') {
					this.mobilefilterOption = 'client_code';
					this.placeholderInput = 'Search by Client Code'
				} else if (response['result']['option'] === 'Scrip Name') {
					this.mobilefilterOption = 'scrip_name';
					this.placeholderInput = 'Search by Scrip Name'
				} else if (response['result']['option'] === 'Status') {
					this.mobilefilterOption = 'status';
					this.changeStatus('fullyExecuted');
				} else if (response['result']['option'] === 'Quantity') {
					this.mobilefilterOption = 'quantity';
				}
			}
		});
		return await modal.present();
	}
	// reset all the things as oninit 
	resetData(flag?: any) {
		// console.log(flag);
		this.reverse = false;
		this.order = "srNo"
		this.isRefresh = true;
		
		if (flag == '1') {
			this.statusSegmentValue = 'fullyExecuted';
			this.consOrderBookData = this.consOrderBookDetails.filter(function (el) {
				return el.PendingQty == 0 || el.OrderStatus == "Fully Executed";
			});
		}
		else {
			this.consOrderBookData = this.consOrderBookDetails;
		}
		setTimeout(() => {
			this.isRefresh = false;
		}, 500);
		this.consOrderBookData.forEach((element, ind) => {
			element['isVisible'] = false;
		});
	}
	// Sorting with alphabetic order of status
	sortByStatus() {
		this.isRefresh = true;
		this.statusSegmentValue = null;
        this.consOrderBookData = this.consOrderBookDetails;
		this.isAtoZSorting = true;
		this.consOrderBookData.forEach((element, index) => {
			if (element.OrderStatus.includes("Pending") || element.OrderStatus.includes("Modified")  || element.OrderStatus.includes("SL Triggered")) {
				if (element.PendingQty == 0) {
					element.OrderStatus = "Fully Executed";
				} else if (element.Qty > element.PendingQty) {
					element.OrderStatus = "Partially Executed";
				} 
				else if (element.SLTriggered.toUpperCase() == "Y") {
					element.OrderStatus = "SL Triggered"
				} 
			
			}
		  })
		this.setOrder('OrderStatus');
		setTimeout(() => {
			this.isRefresh = false;
		}, 500);
	}

	// Select the filter Option
	selectFilterOption(selectValue: any) {
		if (selectValue == 'client_code') {
			if(this.searchTerm.length > 0 || this.statusChanged){
				this.searchTerm = '';
				this.statusChanged = false;
				this.resetData();
			}
		}
		else if (selectValue == 'status') {
			this.changeStatus('fullyExecuted');
		}
		else if(selectValue == 'scrip_name'){
			if(this.searchTerm.length > 0 || this.statusChanged){
				this.searchTerm = '';
				this.statusChanged = false;
				this.resetData();
			}	
		}
		else if (selectValue == 'quantity') {
			if(this.searchTerm.length > 0 || this.statusChanged){
				this.searchTerm = '';
				this.statusChanged = false;
				this.resetData();
			}	
		}
	}

	searchType(event: any,type: any){
		this.consOrderBookData = this.consOrderBookDetails;
		if(type == '1'){
			// console.log(type);
			this.consOrderBookData = this.consOrderBookData.filter((item) => {
				return item.ClientId.toLowerCase().includes(event.toLowerCase());
			  });
		}
		if(type == '2'){
			this.consOrderBookData = this.consOrderBookData.filter((item) => {
				return item.ScripName.toLowerCase().includes(event.toLowerCase());
			  });
		}
	}


	// Select the status and change the list according to status
	changeStatus(status: any) {
        this.resetData();
		this.isAtoZSorting = false;
		this.statusChanged = true;
		if (status == 'fullyExecuted') {
			this.resetData('1');
			this.consOrderBookData = this.consOrderBookData.filter(function (el: any) {
				if (el.OrderStatus.includes("Pending") || el.OrderStatus.includes("Modified") || el.OrderStatus.includes("SL Triggered") || el.OrderStatus.includes("Fully Executed"))   {
					return el.PendingQty == 0 || el.OrderStatus == "Fully Executed";
				}
				return;
			});
		}
		else if (status == 'partiallyExecuted') {
			this.resetData();
			this.consOrderBookData = this.consOrderBookData.filter(function (el: any) {
				if (el.OrderStatus.includes("Pending") || el.OrderStatus.includes("Modified")  || el.OrderStatus.includes("SL Triggered") || el.OrderStatus.includes("Partially Executed")) {
					return (el.Qty > el.PendingQty) && el.PendingQty != 0 ; 
				}
				return;
			});
		}
		else if (status == 'cancelled') {
			this.resetData();
			this.consOrderBookData = this.consOrderBookData.filter(function (el: any) {
				return el.OrderStatus == "Cancelled"
			});
		}
		else if (status == 'approved') {
			this.resetData();
			this.consOrderBookData = this.consOrderBookData.filter(function (el) {
				return el.OrderStatus == 'Approved'
			});
		}
		else if (status == 'rejected_iifl') {
			this.resetData();
			this.consOrderBookData = this.consOrderBookData.filter(function (el) {
				return el.OrderStatus == "Rejected By 5P" || el.OrderStatus == "Rejected by Exch"

			});
		}

	}
	// Sorting according to Quantity
	changeQunatity(quanatityValue: any) {
		// this.resetData();
		if (quanatityValue == 'quantity') {
			this.setOrder('Qty');
		}
		else if (quanatityValue == 'tradedQuantity') {
			this.setOrder('TradedQty');
		}
		else if (quanatityValue == 'pendingQuantity') {
			this.setOrder('PendingQty');
		}
	}

	splitDate(value: any){
		return value.slice(0, 10)
	}

	goToClientDetails(dataObj: any){
		if(this.splitNameFromDate.transform(dataObj.ScripName,"date").length == 0){
			this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, dataObj.ScripName.split(' ')[0] + dataObj.ExchType, dataObj.ScripName.split(' ')[0]]);
		}
		else{
			if(dataObj.ScripName.includes('CE') || dataObj.ScripName.includes('PE')){
				this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, this.splitNameFromDate.transform(dataObj.ScripName,"date").split(' ').join('-').toUpperCase().substring(1) + dataObj.ExchType, dataObj.ScripName.split(' ')[0]])
			}
			else{
				this.router.navigate(['/company-details', dataObj.Exch, dataObj.ExchType, dataObj.ScripCode, this.splitNameFromDate.transform(dataObj.ScripName,"date").split(' ').join('-').toUpperCase().substring(1) + dataObj.ExchType, dataObj.ScripName.split(' ')[0]])
			}
		}

	}


}
