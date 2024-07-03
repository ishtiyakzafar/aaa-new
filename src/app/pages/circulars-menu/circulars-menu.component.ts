import { Component, OnInit, ViewChild, Input, Output, OnChanges, EventEmitter, SimpleChanges, ElementRef } from '@angular/core';
import { Platform, NavController, AlertController } from '@ionic/angular';
//import { IonSlides, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'
import moment from 'moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { debounceTime, switchMap } from 'rxjs/operators';
import { RaiseQueryService } from '../../pages/raise-query/raise-query.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
@Component({
  selector: 'app-circulars-menu',
  providers: [NgxDaterangepickerMd,RaiseQueryService],
  templateUrl: './circulars-menu.component.html',
  styleUrls: ['./circulars-menu.component.scss'],
})
export class CircularsMenuComponent implements OnInit {
 // @ViewChild('slidesUpdated', { static: false }) sliderUpdated: IonSlides;

 @ViewChild('slidesUpdated') sliderUpdated: ElementRef | undefined;
 public dataLoad:boolean = true;
  public circularTabValue:any = null;
  sliderUpdatedIndex: number = 0;
  allCategories: any[] = []; // Add a property to store all categories
  categoriesLast30Days: any[] = [];
  categoriesOlderThan30Days: any[] = [];
  categoryFilter: string = 'all';
  circularstableData: any[] = [];
  latestCircularsData: any[] = [];
  archiveCircularsData: any[] = [];
  public searchValue: string = '';
  fromDate: any;
  toDate: any;
  myOptions:any = {
		dateFormat: 'dd/mm/yyyy',
		showSelectorArrow: true,
		showMonthNumber: false,
	}
  startDate:any= moment().subtract(1, 'years').format("YYYY-MM-DD");
  endDate:any= moment(new Date()).format("YYYY-MM-DD");
  disableToDte: boolean = true;
	startDateFormat:any;
	endDateFormat:any;
  listPDFData:any[]=[];
  NgxDaterangepickerMd! : NgxDaterangepickerMd;
	currentDate: any;
  showStartDatePicker: boolean = false;
	showEndDatePicker: boolean = false;

  constructor(
    private serviceFile: RaiseQueryService,
    private storage: StorageServiceAAA,router: Router,
    public toast: ToasterService,
		private platform: Platform,
    private elementRef: ElementRef) {
			router.events.forEach((event) => {
				this.platform.backButton.subscribeWithPriority(10, () => {
					window.history.back();
				});
			  });
  }
  ngOnInit() {
    let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		this.currentDate = moment(new Date()).format("YYYY-MM-DD");
		this.myOptions['disableSince'] = { year: moment(tomorrow).format('YYYY'), month: moment(tomorrow).format('MM'), day: moment(tomorrow).format('DD') }
  this.loadCircularsData();
 
  }
  ionViewWillEnter() {
		this.dataLoad = true;
  
    setTimeout(() => {
      this.dataLoad = true;
      this.circularTabValue = 'latest';
    }, 1000);
  }

  public circularsData: any[] = [
		{ name: 'Latest', value: 'latest' },
		{ name: 'Archive', value: 'archive' }
	]
  loadCircularsData() {
    // Assuming you want to search for the last 30 days of circulars
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const formattedDate = thirtyDaysAgo.toISOString().split('T')[0];
    let obj = {
      portalId: '',
      searchStr: '',
      category: this.categoryFilter,
      startDate: this.startDate, 
      endDate: this.endDate  
    };
    obj.portalId = 'edbsn526a59bbdb530d16040551fc51a5efb259617703e270ab441d85842f73f62f57';
    obj.searchStr = 'circular';
    this.serviceFile.zohoSearch(obj).subscribe(
      (response: any) => {
        const allCirculars = response.data;
  
          if (this.categoryFilter === 'all') {
            this.latestCircularsData = allCirculars.filter((circular:any) =>new Date(circular.modifiedTime) >= thirtyDaysAgo);
            if (this.startDate && this.endDate) {
              this.archiveCircularsData = allCirculars.filter((circular:any) =>{
                const circularDate =  moment(circular.modifiedTime).format('YYYY-MM-DD');
                return circularDate >= this.startDate && circularDate <= this.endDate;
              });
           
            }
            else{
              this.archiveCircularsData = allCirculars.filter((circular:any) =>new Date(circular.modifiedTime) < thirtyDaysAgo);
            } 
          } 
          else {
            this.latestCircularsData = allCirculars.filter((circular:any) =>circular.category.name === this.categoryFilter && new Date(circular.modifiedTime) >= thirtyDaysAgo);
            if (this.startDate && this.endDate) {
              this.archiveCircularsData = allCirculars.filter((circular:any) =>{
                const circularDate = moment(circular.modifiedTime).format('YYYY-MM-DD');
                return circular.category.name === this.categoryFilter && circularDate >= this.startDate && circularDate <= this.endDate;
              });
            }
            else{
              this.archiveCircularsData = allCirculars.filter((circular:any) =>circular.category.name === this.categoryFilter && new Date(circular.modifiedTime) < thirtyDaysAgo);
            }
          }
     
        this.dataLoad = true; 
     
    this.categoriesLast30Days = this.extractUniqueCategories(allCirculars.filter((circular:any) =>new Date(circular.modifiedTime) >= thirtyDaysAgo));
    
    this.categoriesOlderThan30Days = this.extractUniqueCategories(allCirculars.filter((circular:any) =>new Date(circular.modifiedTime) < thirtyDaysAgo));
   
    if (!this.categoriesLast30Days.find(category => category.name === this.categoryFilter) && ! this.categoriesOlderThan30Days.find(category => category.name === this.categoryFilter)) {
      this.categoryFilter = 'all';
    }
  },
  error => {
    console.error('Error fetching circulars:', error);
    this.dataLoad = true; 
  }
);
}


loadArchiveData() {
  this.categoryFilter = 'all';
  this.loadCircularsData(); // Assuming you already have a function to load circular data
}

loadLatestData() {
  this.categoryFilter = 'all';
  this.loadCircularsData(); // Assuming you already have a function to load circular data
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
  public goBack() {
		window.history.back();
	}
  filterCirculars(circulars: any[]): any[] {
    if (this.searchValue.length < 4) {
      return circulars;
    }
    const lowercasedSearchValue = this.searchValue.toLowerCase();
    return circulars.filter(circular =>
      circular.title.toLowerCase().includes(lowercasedSearchValue) ||
      circular.summary.toLowerCase().includes(lowercasedSearchValue)
    );
  }
  isLastThreeDays(modifiedTime: string): boolean {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 7);
    const circularDate = new Date(modifiedTime);
    
    return circularDate >= threeDaysAgo;
  }
  
  extractUniqueCategories(circulars: any[]): any[] {
    const categoriesMap = new Map<string, any>();
    circulars.forEach((circular:any) =>{
      const categoryId = circular.category.id;
      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, circular.category);
      }
    });
    return Array.from(categoriesMap.values());
  }
  getFilteredCirculars(circulars: any[]): any[] {
    if (this.categoryFilter === 'all') {
      return circulars;
    } else {
      return circulars.filter((circular:any) =>circular.category.id === this.categoryFilter);
    }
  }
  categoryFilterChange(event:any) {
    // Set the selected category filter
    this.categoryFilter = event.detail.value;
    this.loadCircularsData();
   
    // Reset slider to the first slide when the category filter changes
    this.sliderUpdatedIndex = 0;
    this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
  }
  
  segmentChange(event:any) {
    if (event.detail.value === 'latest') {
      this.searchValue = ''; 
      this.loadLatestData();
      this.sliderUpdatedIndex = 0;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
    } else if (event.detail.value === 'archive') {
      this.loadArchiveData();
      this.searchValue = '';
      this.sliderUpdatedIndex = 0;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
    }
  }	

  async slideChanged(ev: any) {
    ev.preventDefault();
    ev.stopPropagation();
    //this.sliderUpdatedIndex = await this.sliderUpdated.getActiveIndex();
    if (this.sliderUpdatedIndex === 0) {
      this.circularTabValue = 'latest';
    } else if (this.sliderUpdatedIndex === 1) {
      this.circularTabValue = 'archive';
    }
  } 
  
  toggleStartDatePicker() {
		
    this.showStartDatePicker = !this.showStartDatePicker;
		// Optional: Hide end date picker if shown
		this.showEndDatePicker = false;
	}
	
	toggleEndDatePicker() {

    this.showEndDatePicker = !this.showEndDatePicker;
		// Optional: Hide start date picker if shown
		this.showStartDatePicker = false;
	}

  hideDatePicker( type: string, event?:any) {
		// Update selectedDate with the changed value
		const datediv = this.elementRef.nativeElement.querySelector('ion-datetime');
		const isMonthYearDisplayed = datediv.classList.contains('show-month-and-year');
		
		if (!isMonthYearDisplayed) {
      if (type === 'start') {
        this.showStartDatePicker = false;
        if(event != undefined){
          this.onStartDateChanged();
        }
      } else if (type === 'end') {
        this.showEndDatePicker = false;
        if(event != undefined){
          this.onEndDateChanged1();
        }
      } 
		} 

	}

	onStartDateChanged() {

		if(new Date(this.startDate) > new Date(this.endDate)){
			this.toast.displayToast("From date cannot be greater than To Date");
  		this.startDate = moment().subtract(1, 'months').format("YYYY-MM-DD");
  		this.endDate = moment(new Date()).format("YYYY-MM-DD");
      return;
		}
    if (this.startDate  && this.endDate) {
      this.loadCircularsData();
    }
	}
	// new code end date
	onEndDateChanged1() {

		if(new Date(this.startDate) > new Date(this.endDate)){
			this.toast.displayToast("From date cannot be greater than To Date");
  		this.startDate = moment().subtract(1, 'months').format("YYYY-MM-DD");
  		this.endDate = moment(new Date()).format("YYYY-MM-DD");
      return;
		}
    if (this.startDate  && this.endDate) {
      this.loadCircularsData();
    }
	}
}