import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { NotifictionCenterService } from './notifications.service';
import { Platform } from '@ionic/angular';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { notification } from '../../../environments/environment';
import { RaiseQueryService } from '../../pages/raise-query/raise-query.service';
declare var cordova: any;


@Component({
	selector: 'app-notification',
	providers: [NotifictionCenterService,RaiseQueryService],
	templateUrl: './notification.page.html',
	styleUrls: ['./notification.page.scss'],
})
export class NotificationPage {
	//public notificationTabValue: string = "notification";
	@ViewChild('slidesUpdated') sliderUpdated: ElementRef | undefined;
	allCategories: any[] = []; // Add a property to store all categories
  categoryFilter: string = 'AAA Updates';
  circularstableData: any[] = [];
 versionUpdatesData: any[] = [];
  archiveCircularsData: any[] = [];
  public searchValue: string = '';
  listPDFData:any[]=[];
	public dataLoad:boolean = false;
	public isOptionVisible: boolean = false;
	public resetNotificationList: any[] = [];
	public isAllChecked: boolean = true;
	public isAllClicked: boolean  = false;;
	public buttonData: any[] = [
		{ name: 'App Notifications', value: 'notification' },
		{ name: 'Exchange messages', value: 'messages' },
	]
	public notificationList: any[] = [];

	public notificationTabValue: any = null;
	sliderUpdatedIndex: number = 0;
	public notificationData: any[] = [
		{ name: 'Notifications', value: 'notifications' },
		{ name: 'Version Updates', value: 'version' }
	]

	public options: any[] = [
		// {val: 'All', isChecked: true, Category: 'all'},
		{ val: 'IIFL Ideas', isChecked: true, Category: 'ii' },
		{ val: 'News', isChecked: true, Category: 'ne' },
		{ val: 'Personalized', isChecked: true, Category: 'pa' }
	]
	constructor(private notificationService: NotifictionCenterService,private serviceFile: RaiseQueryService,
		private storage: StorageServiceAAA,
		private commonService: CommonService,
		private platform: Platform) { }

		segmentChange(event:any) {
			if (this.notificationTabValue === 'notifications') {
				this.sliderUpdatedIndex = 0;
				this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
			} else if (this.notificationTabValue === 'version') {
				this.loadVersionUpdates();
				this.sliderUpdatedIndex = 1;
				this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
			}
		}	
		async slideChanged(ev: any) {
			ev.preventDefault();
			ev.stopPropagation();
			//this.sliderUpdatedIndex = await this.sliderUpdated.getActiveIndex();
	
			if (this.sliderUpdatedIndex === 0) {
				this.notificationTabValue = 'notifications';
			} else if (this.sliderUpdatedIndex === 1) {
				this.notificationTabValue = 'version';
			}
		} 
	

	ionViewWillEnter() {
		this.dataLoad = false;
		this.commonService.analyticEvent('Home_Notification', 'Notification');
		this.commonService.setClevertapEvent('NotificationCentre');
		this.storage.get('userID').then((userID) => {
			this.notificationService.getAllNotification(userID, this.getTimeStamp()).subscribe((res: any) => {
				this.notificationList =  res['body']['Data'];
				this.resetNotificationList = this.notificationList;
				// this.isAllChecked = true;
				// this.options.forEach(element => {
				// 	element['isChecked'] = true;
				// })
				// this.isAllClicked = true;	
				
				setTimeout(() => {
					this.dataLoad = true;
					this.notificationTabValue = 'notifications';
				}, 1000);
			})
		})
	}

	// time stamp before 15 days 
	getTimeStamp() {
		var timeStamp;
		let currentTime = Date.now();
		let time15DaysEpoche = 15 * 24 * 60 * 60 * 1000;
		timeStamp = currentTime - time15DaysEpoche
		return timeStamp;
	}

	public goBack() {
		window.history.back();
	}
	loadVersionUpdates() {
		let obj = {
			portalId: '',
			searchStr: '',
			category: this.categoryFilter
		  };
		  obj.portalId = 'edbsn526a59bbdb530d16040551fc51a5efb259617703e270ab441d85842f73f62f57';
		  obj.searchStr = 'circular';
		  this.serviceFile.zohoSearch(obj).subscribe(
			(response: any) => {
			  const allCirculars = response.data;
		
				this.versionUpdatesData = allCirculars.filter((circular:any) => circular.category.name === this.categoryFilter);
			
			
			  this.dataLoad = true; 
	
	
			  
			},
			error => {
			  console.error('Error fetching circulars:', error);
			  this.dataLoad = true; 
			}
		  );
		}
	
		getAttachment(categoryId: string) {
			let obj = {
			  portalId: '',
			  categoryId: categoryId
			};
			obj.portalId = 'edbsn526a59bbdb530d16040551fc51a5efb259617703e270ab441d85842f73f62f57';
		  
			this.serviceFile.zohoAttachment(obj).subscribe(res => {
			  this.listPDFData = res.data;
			  if (this.listPDFData && this.listPDFData.length > 0) {
				const urlPDF = this.listPDFData[0].contentUrl;
		  
				// Open the PDF in a new tab
				const pdfWindow:any = window.open();
				pdfWindow.location.href = urlPDF;
			  } else {
				console.error('No PDF data available.');
			  }
			});
		  }
	  
		  downloadPdf(categoryId: string) {
			this.getAttachment(categoryId);
		  }


	hideOption() {
		this.isOptionVisible = false;
	}
	// click on filter popup
	showOption(e: any, item?: any) {
		e.stopPropagation();
		this.isOptionVisible = !this.isOptionVisible;
		if (item) {
			this.isOptionVisible = true;
		}
	}
	// check on select All
	selectAll(event: any) {
		// console.log(event);
		// this.isAllClicked = true;
		if (event) {
			this.options.forEach(element => {
				element['isChecked'] = true;
				setTimeout(() => {
					this.notificationList = this.resetNotificationList;
				}, 1000);
			});
		} else {
			this.options.forEach(element => {
				element['isChecked'] = false;
			});
			setTimeout(() => {
				this.notificationList = [];
			}, 1000);
		}
	
	}


	// filter the Notification List on Select 
	filterData(options: any, itemIndex?: any) {
		const filterMessages: any = [];
		// if (!this.isAllClicked) {
		// 	this.isAllChecked = false;
		// }
		options.forEach((optionElem: any) => {
			if (optionElem['isChecked']) {
				this.notificationList = this.resetNotificationList;
				this.notificationList.forEach((elem) => {
					if (elem['Category'].toLowerCase() === optionElem['Category'].toLowerCase()) {
						filterMessages.push(elem);
					}
				});
			}
			else{
				this.isAllChecked = false;
			}
			
		});
		// if(options[0].isChecked && options[1].isChecked && options[2].isChecked){
		// 	this.isAllChecked = true;
		// }
		this.notificationList = filterMessages;
		// console.log(this.notificationList);
	}

	innerSelect() {
		this.isAllClicked = false;
	}
	// Convert Epoche time to date and time Format
	getDateTimeFormat(val: any) {
		let sliceddate = val.slice(6, 19);
		let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		let utcSeconds = sliceddate / 1000;
		let date1 = new Date(0); // The 0 there is the key, which sets the date to the epoch
		date1.setUTCSeconds(utcSeconds);
		let date = date1.getDate();
		let month = months[date1.getMonth()];
		let year = date1.getFullYear();
		let Time = date1.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
		return date + ' ' + month + ' ' + year + '  ' + Time;
	}

	exchMessage(){
		if (this.commonService.isApp() && this.platform.is('ios')) {
			var ref = cordova.InAppBrowser.open(notification['notificationLink']['link'], '_blank');
			ref.addEventListener('loadstart', this.loadstartCallback);
			ref.addEventListener('loadstop', this.loadstopCallback);
			ref.addEventListener('loaderror', this.loaderrorCallback);
			ref.addEventListener('exit', this.exitCallback);
		} else {
			window.open(notification['notificationLink']['link'], '_blank');
		}
	}

		public loadstartCallback(event: any) {
		console.log('Loading started: ' + event.url)
	}

	public loadstopCallback(event: any) {
		console.log('Loading finished: ' + event.url)
	}

	public loaderrorCallback(error: any) {
		console.log('Loading error: ' + error.message)
	}

	public exitCallback() {
		console.log('Browser is closed...')
	}

}
