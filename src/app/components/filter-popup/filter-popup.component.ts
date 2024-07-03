import { Component, Input, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-filter-popup',
	templateUrl: './filter-popup.component.html',
	styleUrls: ['./filter-popup.component.scss'],
})
export class FilterPopupComponent implements OnInit {
	@Input() clientFilter: any;
	@Input() active: any;
	radioBoxValue:any = 'clientCode';
	public isAllChecked!: boolean;
	filterMessages: any[] = [];
	arrayFilter: any;
	filteredItems: any[] = [];
	public toggleVal: any;
	public fromBrokerage = false;

	public options = [
	    // { val: 'All', isChecked: false },
	    { val: 'Equity', filterLabel:1, isChecked:true},
	    { val: 'ELSS',  filterLabel:2, isChecked:true },
	    { val: 'Debt', filterLabel:3, isChecked:true },
	    { val: 'Hybrid', filterLabel:4, isChecked:true },
	    { val: 'Liquid', filterLabel:5, isChecked:true },
	    { val: 'Others', filterLabel:6, isChecked:true },
	  ];
	;
	checkedFilter:any[] = [];
	constructor(public popover: PopoverController, private navParams: NavParams, private commonService: CommonService,private route:ActivatedRoute,private router: Router) { 
		route.params.subscribe(val => {
			if(this.router.url.includes("dashboard-brokerage")){
				this.fromBrokerage = true;
			}
		});
	}

	ngOnInit() {
		//console.log(JSON.parse(localStorage.getItem('setCheckBox')));
		// review
		this.toggleVal = localStorage.getItem('toggleSwitch');
		let checkValue = localStorage.getItem('setCheckBox') ? JSON.parse(localStorage.getItem('setCheckBox') || "{}") : "{}";
		if (checkValue !== "{}") {	
			//this.isAllChecked = false;
			this.options = JSON.parse(localStorage.getItem('setCheckBox') || "{}");
			this.options.forEach(element => {
				element.isChecked = element.isChecked;
			});
		}
		else{
			this.isAllChecked = true;
		}
		if(this.clientFilter == true){
			this.radioBoxValue = this.active;
			if(this.active == 'partnerCode'){
				this.radioBoxValue = 'groupCode';
			}
		}
	}

	ionViewWillEnter(){
		//this.isAllChecked = true;
	
		// else{
		// 	this.isAllChecked = true;	
		// }	
	}

	// check on select All
	selectAll(event: any) {
		//localStorage.removeItem('setCheckBox');
		//this.isAllClicked = true;
		if (event) {
			this.options.forEach(element => {
				element['isChecked'] = true;

			});
		} else {
			this.options.forEach(element => {
				element['isChecked'] = false;
			});
		}

	}

	innerSelect() {
		//this.isAllClicked = false;
	}

	// filter the Notification List on Select 
	filterData(options: any, itemIndex?: any) {
		//const filterMessages = [];
		this.filterMessages = [];
		// if (!this.isAllClicked) {
		// 	this.isAllChecked = false;
		// }

		// if(options[0]['isChecked'] && options[1]['isChecked'] && options[2]['isChecked'] && options[3]['isChecked'] && options[4]['isChecked'] && options[5]['isChecked']){
		// 	this.isAllChecked = true;
		// }
		options.forEach((optionElem: any) => {
			if (optionElem['isChecked']) {
				this.filterMessages.push(optionElem.filterLabel);
			}
			else{
				this.isAllChecked = false;
			}
		})

	}

	async closepopover() {
		// console.log(this.options);
		 if(this.isAllChecked == false){
			localStorage.setItem('setCheckBox',JSON.stringify(this.options))
		}
		else{
			localStorage.removeItem('setCheckBox');
		}
		// console.log(JSON.parse(localStorage.getItem('setCheckBox')));

		await this.popover.dismiss({
			dismissed: true,
			passData:this.filterMessages,
			flag:1
		});

	}

	async radioGroupChange(event: any){
		this.radioBoxValue = event;
		localStorage.setItem('setBtn', 'true')
		this.commonService.setData(event)
		await this.popover.dismiss({
			passData:event
		});
	}

	// click on filter popup


}
