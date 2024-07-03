import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { searchScripService } from './search-scrip.service';
import { CommonService } from '../../helpers/common.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MarketService } from '../../pages/markets/markets.service';
import { Title } from '@angular/platform-browser';
import { AddToWatchlistComponent } from '../../components/add-to-watchlist/add-to-watchlist.component';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-add-script',
  templateUrl: './add-script.page.html',
  providers: [searchScripService, CommonService, MarketService],
  styleUrls: ['./add-script.page.scss'],
})
export class AddScriptPage implements OnInit,OnDestroy  {
  @ViewChild('search') search : any;
  public dataLoad: boolean = true;
  public checked: boolean = false;
  device;
  segmentOne: any;
  segmentTwo: any;
  dashboardSegmentSelectedValue = 'search';
  expiryDatesTabValue: any;
  serchString: any;
  SymbolName: any;
  minStringMsg: any;
  search_item: any;
  searchReqObj: any;
  changedLtp: any;
  changedPClose: any;
  selectStrikePrice: any;
  passToWatchList: any;
  expirySelectedDate: any
  selectExpiryScripCode: any;
  selectStrikeRate: any;
  expiryOptionsExpiry: any;
  selectOptionsExpiryScripCode: any;
  callPutBtnToggleValue: any;
  OptioncolIndex: any;
  dateIndexValue: any;
  ShortName: any;
  optedTabValue:any;
  private subscription: any;

  // passedData = null;
  equityBlockButton: any[] = [
    { Name: 'Clients', Value: 'clients', active: 1 },
    { Name: 'Equity', Value: 'equity', active: 0 },
    { Name: 'Currency', Value: 'currency', active: 0 },
    { Name: 'Commodity', Value: 'commodity', active: 0 }
  ];


  cashFutureOptionButton: any[] = [
    { Name: 'Cash', Value: 'cash', active: 1 },
    { Name: 'Future', Value: 'future', active: 0 },
    { Name: 'Options', Value: 'options', active: 0 }
  ];

  


  lastPath: any = '';
  equityBlockTabValue: any = 'clients';
  //equityBlockTabValue = 'equity';
  cashFutureOptionTabValue: any = 'cash';
  buttonDataTwo: any;
  jsonData: any;
  searchTerm: any;
  searchData: any;
  equityCashTabList: any = [];
  equityFutureTabList: any = [];
  equityOptionTabList: any = [];
  scripSearch: string = "Please Search Scrip Name in input"
  // cashFutureOptionTabValue1 = 'future';
  // cashFutureOptionTabValue2 = 'future';
  changeParentTab: any;
  dataItems: any;
  items: any;
  isItemAvailable: boolean = false;
  equityCashClear: any;
  combineFutureData: any = [];
  combineOptionData: any = [];
  callPutOption: boolean = false;
  selectedStrikeRate: any;
  changedLastRate: any;
  catcheTimeTab:any;
  commodityrecursiveClear:any;
  clientList: any[] = [
      {name: 'Prashanjeet Chakravarthy', clientCode: 'PCSWATI'},
      {name: 'Pranali', clientCode: 'PR54367'}
  ]
  // changes only for client code
  displayClientList:any[] = [];
  clientSearchValue:any;
  public isDropDownVisible: boolean = false;
  localSearchData:any;
  typeFlag:any;
  localSerchList:any[] = [];

  isRMFAN: boolean = false;

  constructor(private http: HttpClient, private platform: Platform, private titleService: Title, private searchService: searchScripService, private commonservice: CommonService, public modalController: ModalController, private router: Router, private storage: StorageServiceAAA, private marService: MarketService) {

    if (this.platform.is('desktop')) {
      this.device = 'desktop';
      // // console.log(this.device);
    }
    if (this.platform.is('mobile')) {
      this.device = 'mobile';
      // // console.log(this.device);
    }
    // this.getButtons();

    // this.getButtonsTwo();

    this.http.get('./assets/searchTest.json').subscribe(result => {
      this.jsonData = result;
      // // console.log('search Data: ', this.jsonData);
      // // console.log('search Data 2: ', this.jsonData['body'].Data);
      this.searchData = this.jsonData['body'].Data;
      // // console.log('search data: ', this.searchData);

    });
    this.dataItems = this.searchData;
  }

  ngOnInit() {
    /* this.storage.get('userType').then( type => {
      if (type === 'RM' || type === 'FAN') this.isRMFAN = true;
      else this.isRMFAN = false;
    }) */
    localStorage.setItem('searchKey',"false")
  }

  focusButton(): void {
    setTimeout(() => {
      this.search.setFocus();
    }, 500);
  }

  // only for Client Tab select function
  enterClientName(event: any){
   
    console.log(event);
  }

  // set title for different tab
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
    // this.lastPath = '';
  }

  disableParentEvent(e: any) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }


  showDropDown() {
		this.isDropDownVisible = true;
		//this.clientSearchValue = '';
	}

	hideDropDown() {
		setTimeout(() => {
			this.isDropDownVisible = false;
		}, 500);
  }
  
  displayClientDetails(data: any){
    // console.log(data);
    localStorage.removeItem('searchObj')
    this.SaveDataToLocalStorage(data)
    if (!this.platform.is('desktop')) {
      this.storage.get('userType').then(type => {
        if (type == 'RM' || type == 'FAN') {
          this.router.navigate(['/client-details', data.ClientCode, data.ClientName.split(' ').join('-')]);
        }
        else{
          this.router.navigate(['/client-details', data.ClientCode, '-']);
        }
      })
      // // console.log(this.device);
    }
    else{
      localStorage.setItem('searchKey',"true")
      localStorage.setItem('searchObj', JSON.stringify(data))
      this.router.navigate(['/client-trades', 'clients']);
    }
    
    
   
    //console.log(data);
   

  }

  SaveDataToLocalStorage(data: any) {
		var a: any = [];
		// Parse the serialized data back into an aray of objects
    let localData: any = localStorage.getItem('search_session') || [];
		a = JSON.parse(localData);   // review
    // Push the new data (whether it be an object or anything else) onto the array
		a.push(data);
		// Alert the array value
		//  alert(a);  // Should be something like [Object array]
		// Re-serialize the array back into a string and store it in localStorage
		localStorage.setItem('search_session', JSON.stringify(a));
	}
  // change the Expiry date in future


  checkSegmentValue() {
    if (this.equityBlockTabValue === 'equity') {
      //  this.cashFutureOptionTabValue = 'cash';
      this.cashFutureOptionButton = [
        { Name: 'Cash', Value: 'cash', active: 1 },
        { Name: 'Future', Value: 'future', active: 0 },
        { Name: 'Options', Value: 'options', active: 0 }
      ];
    } else if (this.equityBlockTabValue === 'currency') {
     // this.cashFutureOptionTabValue = 'future';
      this.cashFutureOptionButton = [
        { Name: 'Future', Value: 'future', active: 1},
        { Name: 'Options', Value: 'options', active: 0 }
      ];
      // this.cashFutureOptionTabValue = this.cashFutureOptionButton[0].value;
    } else if (this.equityBlockTabValue === 'commodity') {
      // this.cashFutureOptionTabValue = 'future';
      this.cashFutureOptionButton = [
        { Name: 'Future', Value: 'future', active: 0 },
      ];
    }
  }

   // call the function after change the segment
  equityBlockSegmentChanged(event: any, cashfutureTab: any) {
    this.checkSegmentValue();
    if (event == 'equity') {
      if(cashfutureTab == 'equity'){
        this.cashFutureOptionTabValue = 'cash'
      }
      this.equitySegmentChanged(this.equityBlockTabValue, this.cashFutureOptionTabValue);
    }

   
    else if (event == 'currency') {
      if(cashfutureTab == 'currency'){
        this.cashFutureOptionTabValue = 'future'
      }
      this.equitySegmentChanged(this.equityBlockTabValue, this.cashFutureOptionTabValue)
    }
    else if (event == 'commodity') {
      this.cashFutureOptionTabValue = 'future';
      this.equitySegmentChanged(this.equityBlockTabValue, this.cashFutureOptionTabValue)
    }
    else if(event == 'clients'){
      // console.log('Client Tab is Selected')
      this.recentSearchClient()
    }

  }

  recentSearchClient(){
    this.localSearchData = localStorage.getItem('search_session') ? JSON.parse(localStorage.getItem('search_session') || "{}") : null;
    // console.log(this.localSearchData);
    var arrayData = []
		if (this.localSearchData == undefined || this.localSearchData == null) {
			this.localSerchList = [];
			//this.dataLoad = true;
    }
    else{
      this.localSearchData.forEach((data: any, index: any) => {
       // this.localSerchList.push(data);
       arrayData.push(data);
       this.localSerchList = Array.from(new Set(this.localSearchData.map((a: any) => a.ClientCode)))
       .map(ClientCode => {
         return this.localSearchData.find((a: any) => a.ClientCode === ClientCode)
       })
      //  console.log(this.localSerchList);
			})
    }
  }

  removeDuplicateValue(data: any) {
		return data.reduce((acc: any, curr: any) => acc.includes(curr) ? acc : [...acc, curr], [])
	}
  // call the function after type in search box
  getItems(ev: any) {
    // // console.log(ev.detail.value)
    this.serchString = ev;
    if (this.serchString == '') {
      this.minStringMsg = null
      this.scripSearch = "Please Search Scrip Name in input";
      this.combineFutureData = [];
      this.equityCashTabList = [];
    }
    else if (this.serchString != '') {
      if(this.commonservice.inputRestriction(this.serchString) == true){
        this.minStringMsg = 'Invalid Characters are not allowed';
        return;
      }
      if (this.serchString.length <= 2) {
        this.minStringMsg = 'Please enter 3 characters at least...';
      }
      else if (this.serchString.length > 2) {
        this.minStringMsg = null;
        this.equityBlockSegmentChanged(this.equityBlockTabValue,this.cashFutureOptionTabValue );
      }
    }
  }

  selectExpiryDate(data: any, index: any, colindex: any) {
    this.expirySelectedDate = this.changeDateFormat(data.Expiry)
    this.selectExpiryScripCode = data.ScripCode;
    this.equityFutureTabList[index].ScripCode = data.ScripCode;
   // this.recursiveCall(this.equityFutureTabList, this.catcheTimeTab);
   if(this.equityBlockTabValue !== 'commodity'){
    this.recursiveCall(this.equityFutureTabList, this.catcheTimeTab);
    this.optedTabValue = '1'
    this.updateData(this.combineFutureData, data.ScripCode, index, "/Date(0)/", colindex, this.optedTabValue)
  }
  else{
    this.recursiveCallCommodity(this.equityFutureTabList, this.catcheTimeTab);
    this.optedTabValue = '2'
    this.updateData(this.combineFutureData, data.ScripCode, index, "/Date(0)/", colindex, this.optedTabValue)
  }
  
  }

  segmentChanged(event: any) {
    // console.log(event);
  }

  ionViewWillEnter() {
   // console.log(this.serchString);
   localStorage.setItem('searchKey',"false")
    if (this.serchString !== undefined) {
     // console.log(this.equityBlockTabValue);
     // console.log(this.cashFutureOptionTabValue);
      this.equityBlockSegmentChanged(this.equityBlockTabValue, this.cashFutureOptionTabValue);
    }

    this.focusButton()
    this.clientSearchValue = '';
    this.storage.get('userType').then(type => {
			if (type == 'RM' || type == 'FAN') {
				this.storage.get('mappingDetails').then((details) => {
          this.typeFlag = "1"
        this.displayClientList = details;
        // console.log(this.displayClientList);
				});
			}
			else{
				this.storage.get('subBrokermapping').then((details) => {
          this.typeFlag = "2"
					this.displayClientList = details;
				});
			}	

    })
    
    this.recentSearchClient()
  }

  updateData(arrayName: any, scripCode: any, indexValue: any, catcheTime: any, dateArrayIndex: any, optedTabValue: any) {
    var array = [];
    // this.combineFutureData = [];
    let passObj: any = {};
    passObj['Exch'] = arrayName[indexValue].Exchange;
    passObj['ExchType'] = arrayName[indexValue].ExchangeType;
    passObj['ScripCode'] = scripCode;
    passObj['ClientLoginType'] = 0;
    passObj['LastRequestTime'] = catcheTime;
    passObj['RequestType'] = 0;
    array.push(passObj);
    //console.log(this.equityBlockTabValue);
    // update the equity and currency
    if(optedTabValue == '1'){
      this.searchService.getMarketFeedSearch(array, catcheTime).subscribe((chaangeResponse) => {
       this.combineFutureFun(chaangeResponse,scripCode,indexValue,catcheTime,dateArrayIndex, optedTabValue)
     })
   }
   // update the commodity
   else if(optedTabValue == '2'){
       this.searchService.getCommodityMarketFeed(array, catcheTime).subscribe((chaangeResponse) => {
       this.combineFutureFun(chaangeResponse,scripCode,indexValue,catcheTime,dateArrayIndex, optedTabValue)
     })
   }
    // update the commodity
  }

  // common function to call update the furure in all tabs
  combineFutureFun(chaangeResponse: any, scripCode: any, indexValue: any,catcheTime: any,dateArrayIndex: any, optedTabValue: any){
    this.changedLastRate = chaangeResponse['Data'][0].LastRate;
    this.changedPClose = chaangeResponse['Data'][0].PClose;
    var index = this.combineFutureData.indexOf(this.combineFutureData[indexValue]);
    // console.log(index);
    if (index !== -1) {
      this.combineFutureData[index] = {
        "Exchange": this.combineFutureData[index].Exchange,
        "ExchangeType": this.combineFutureData[index].ExchangeType,
        "Name": this.combineFutureData[index].Name,
        "Expiry": this.combineFutureData[index].Expiry,
        "ScripCode": scripCode,
        "LastRate": this.changedLastRate,
        "PClose": this.changedPClose,
        "array": this.combineFutureData[index].array,
        "isVisible": true,
        "dateActive": this.combineFutureData[index].array[dateArrayIndex].Expiry,
        "activeModelDate": this.monthYearDateFormat(this.combineFutureData[index].array[dateArrayIndex].Expiry)
      };
    }
   // console.log(this.combineFutureData);
    if(optedTabValue == '1'){
      this.recursiveCall(this.combineFutureData, catcheTime);
    }
    else if(optedTabValue == '2'){
      this.recursiveCallCommodity(this.combineFutureData, catcheTime);
    }
    
  }

  selectOptiosExpiryDate(data: any, parentArry: any, index: any, dateColIndex: any) {
    // console.log(data);
    // console.log(parentArry);
    // console.log('dateCol', dateColIndex);
    this.OptioncolIndex = dateColIndex;
    // console.log(parentArry.callPutOption);
    if (parentArry.callPutOption == true) {
      parentArry.btnObj = 'CALL'
    }
    else {
      parentArry.btnObj = 'PUT'
    }
    this.expiryOptionsExpiry = this.changeDateFormat(data.Expiry)
    var obj = {
      "Exch": parentArry.Exchange,
      "CallPut": parentArry.btnObj,
      "Symbol": parentArry.Name,
      "Expiry": this.expiryOptionsExpiry
    }
    this.searchService.getSearchOptionDetails(obj).subscribe((response: any) => {
       this.updateDataOptions(this.combineOptionData, response['Data'], index, "/Date(0)/", dateColIndex, response['Data'][0].ScripCode, response['Data'][0].StrikeRate);
    })

  }


  // Update the option list on change
  updateDataOptions(arrayName: any, detailsArray: any, indexValue: any, catcheTime: any, dateColIndex: any, selectedScripCode: any, selectedStrikeRate: any) {
    // console.log(arrayName);
    var array = [];
    // this.combineFutureData = [];
    let passObj: any = {};
    passObj['Exch'] = arrayName[indexValue].Exchange;
    passObj['ExchType'] = arrayName[indexValue].ExchangeType;
    passObj['ScripCode'] = selectedScripCode;
    passObj['ClientLoginType'] = 0;
    passObj['LastRequestTime'] = catcheTime;
    passObj['RequestType'] = 0;
    array.push(passObj);
    // // console.log(array);
    this.searchService.getMarketFeedSearch(array, catcheTime).subscribe((chaangeResponse: any) => {
      // console.log(chaangeResponse['Data'])
      this.changedLastRate = chaangeResponse['Data'][0].LastRate;
      this.changedPClose = chaangeResponse['Data'][0].PClose;
      // console.log(this.changedLastRate);


      var index = this.combineOptionData.indexOf(this.combineOptionData[indexValue]);
      // console.log(index);
      if (index !== -1) {

        this.combineOptionData[index] = {
          "CPType": this.combineOptionData[index].CPType,
          "Exchange": this.combineOptionData[index].Exchange,
          "ExchangeType": this.combineOptionData[index].ExchangeType,
          "Name": this.combineOptionData[index].Name,
          "Expiry": this.combineOptionData[index].Expiry,
          "ScripCode": selectedScripCode,
          "LastRate": this.changedLastRate,
          "PClose": this.changedPClose,
          "btnObj": this.combineOptionData[index].btnObj,
          "callPutOption": this.combineOptionData[index].callPutOption,
          "defaultstrikeRate": selectedStrikeRate,
          "isVisible": true,
          "array": this.combineOptionData[index].array,
          "dateActive": this.combineOptionData[index].array[dateColIndex].Expiry,
          "activeModelDate": this.monthYearDateFormat(this.combineOptionData[index].array[dateColIndex].Expiry),
          "strikeRate": detailsArray
        };
      }
      // console.log(this.combineOptionData);
       this.recursiveCall(this.combineOptionData,catcheTime);
      })
    }

  strikeRateChangeOption(event: any, parentArry: any, rowIndex: any) {
    this.combineOptionData[rowIndex].array.forEach((element: any, index: any) => {
      if (this.combineOptionData[rowIndex].dateActive == element.Expiry) {
        this.dateIndexValue = index;
        
      }
    })
    this.selectedStrikeRate = event
    // console.log(parentArry.callPutOption);
    if (parentArry.callPutOption == true) {
      parentArry.btnObj = 'CALL'
    }
    else {
      parentArry.btnObj = 'PUT'
    }

    var obj = {
      "Exch": parentArry.Exchange,
      "CallPut": parentArry.btnObj,
      "Symbol": parentArry.Name,
      "Expiry": this.expiryOptionsExpiry
    }
    this.searchService.getSearchOptionDetails(obj).subscribe((response: any) => {
      response['Data'].forEach((element: any, index: any) => {
        if (event == element.StrikeRate) {
          this.selectedStrikeRate = event;
          this.selectOptionsExpiryScripCode = element.ScripCode;
          this.equityOptionTabList[rowIndex].ScripCode = element.ScripCode;
         // this.recursiveCall(this.equityOptionTabList,this.catcheTimeTab);
          this.updateDataOptions(this.combineOptionData, response['Data'], rowIndex, "/Date(0)/", this.dateIndexValue, element.ScripCode, this.selectedStrikeRate)
        }
      })
    })
  }

  toggleCallPutBtn(data: any, rowIndex: any) {
    // console.log(data.callPutOption);
    this.callPuttoogleMobDesk(data,rowIndex);
  }

  checkUncheck(data: any,rowIndex: any){
    data.callPutOption = !data.callPutOption;
    // console.log(data.callPutOption);
    this.callPuttoogleMobDesk(data,rowIndex);
  }
  callPuttoogleMobDesk(data: any,rowIndex: any){
    if (data.callPutOption == true) {
      data.btnObj = 'CALL'
    }
    else {
      data.btnObj = 'PUT'
    }
    // console.log('selectStrikeRate', this.selectedStrikeRate);
    var obj = {
      "Exch": data.Exchange,
      "CallPut": data.btnObj,
      "Symbol": data.Name,
      "Expiry": this.expiryOptionsExpiry
    }
    // console.log(data.btnObj);
    this.combineOptionData[rowIndex].array.forEach((element: any, index: any) => {

      if (this.combineOptionData[rowIndex].dateActive == element.Expiry) {
        this.dateIndexValue = index;

        // console.log('rowIndex', rowIndex);
        // console.log('colIndex', this.dateIndexValue);
      }
    })
    this.searchService.getSearchOptionDetails(obj).subscribe((response: any) => {
      this.selectedStrikeRate = data.defaultstrikeRate;
      if (data.btnObj == 'PUT') {
        this.selectOptionsExpiryScripCode = parseInt(data.ScripCode) + 1;
      }
      else {
        this.selectOptionsExpiryScripCode = this.selectOptionsExpiryScripCode - 1;
      }
      this.equityOptionTabList[rowIndex].ScripCode = this.selectOptionsExpiryScripCode;
      //this.recursiveCall(this.equityOptionTabList,this.catcheTimeTab);
      this.updateDataOptions(this.combineOptionData, response['Data'], rowIndex, "/Date(0)/", this.dateIndexValue, this.selectOptionsExpiryScripCode.toString(), data.defaultstrikeRate)
    })
  }
  
  // combine array with all parameter in all cases of future
  futureCommonData(array: any, event: any, catcheTime: any) {
    this.dataLoad = false;
    array.forEach((element: any, index: any) => {
      this.combineFutureData = []
      
      var futureDetailsObj = {
        "Exch": element.Exchange,
        "ExchType": element.ExchangeType,
        "Symbol": element.Name
      }
      if (event !== 'commodity') {
        this.searchService.getSearchFutureDetails(futureDetailsObj).subscribe((res: any) => {
          if (res['Status'] === 0) {
            this.dataLoad = true;
          } else {
            this.dataLoad = true;
          }
          // console.log(res['Data']);
          var pushObj = {
            "Exchange": element.Exchange,
            "ExchangeType": element.ExchangeType,
            "Name": element.Name,
            "ScripCode": element.ScripCode,
            "Expiry": element.Expiry,
            "LastRate": element.LastRate,
            "PClose": element.PClose,
            "array": res['Data'],
            "dateActive": element.Expiry,
            "activeModelDate": this.monthYearDateFormat(element.Expiry)
          }
          //  this.expirySelectedDate = this.changeDateFormat(pushObj.Expiry);
          this.combineFutureData.push(pushObj);
          this.recursiveCall(this.combineFutureData, catcheTime);
          // console.log(this.combineFutureData);
        })
      }
      else {
        this.searchService.getSearchFutureCommoDetails(futureDetailsObj).subscribe((res: any) => {
          // console.log(res['Data']);
          if (res['Status']) {
            this.dataLoad = true;
          } else {
            this.dataLoad = true;
          }
          var pushObj = {
            "Exchange": element.Exchange,
            "ExchangeType": element.ExchangeType,
            "Name": element.Name,
            "ScripCode": element.ScripCode,
            "Expiry": element.Expiry,
            "LastRate": element.LastRate,
            "PClose": element.PClose,
            "array": res['Data'],
            "dateActive": element.Expiry,
            "activeModelDate": this.monthYearDateFormat(element.Expiry)
          }
          this.combineFutureData.push(pushObj);
         // console.log(this.combineFutureData);

          this.recursiveCallCommodity(this.combineFutureData, catcheTime);
          
           
          // this.recursiveCall(this.combineFutureData,catcheTime)
        })
      }

    })
  }

  // continus call API for commodity 
  recursiveCallCommodity(arrayName: any, catcheTime: any) {
    var array: any = [];
    arrayName.forEach((element: any, index: any) => {
      var passObj: any = {};
      passObj['Exch'] = element.Exchange;
      passObj['ExchType'] = element.ExchangeType;
      passObj['ScripCode'] = element.ScripCode;
      passObj['ClientLoginType'] = 0;
      passObj['LastRequestTime'] = catcheTime;
      passObj['RequestType'] = 0;
      array.push(passObj);
    });
    this.passValuetoCallCommodity(arrayName, array, catcheTime);
  }

  passValuetoCallCommodity(arrayName: any, array: any, catcheTime: any) {
    this.searchService.getCommodityMarketFeed(array, catcheTime).subscribe((res: any) => {
      arrayName.forEach((data: any, index: any) => {
          res['Data'].forEach((element: any, index: any) => {
            if(data.ScripCode == element.Token){
              data.LastRate = element.LastRate;
              data.PClose = element.PClose;
            }
          })
        })
       // console.log(arrayName);
    })
    clearTimeout(this.commodityrecursiveClear);
    this.commodityrecursiveClear = setTimeout(() => {
      this.passValuetoCallCommodity(arrayName, array, catcheTime);
    }, 2000);
  }
  

    // API call to update the list of data
  recursiveCall(arrayName: any, catcheTime: any) {
    var array: any = [];
    arrayName.forEach((element: any, index: any) => {
      var passObj: any = {};
      passObj['Exch'] = element.Exchange;
      passObj['ExchType'] = element.ExchangeType;
      passObj['ScripCode'] = element.ScripCode;
      passObj['ClientLoginType'] = 0;
      passObj['LastRequestTime'] = catcheTime;
      passObj['RequestType'] = 0;
      array.push(passObj);
    });
    this.PassValuetoCall(arrayName, array, catcheTime);
  }
  

  PassValuetoCall(arrayName: any, array: any, catcheTime: any) {
    this.searchService.getMarketFeedSearch(array, catcheTime).subscribe((res: any) => {
      arrayName.forEach((data: any, index: any) => {
          res['Data'].forEach((element: any, index: any) => {
            if(data.ScripCode == element.Token){
              data.LastRate = element.LastRate;
              data.PClose = element.PClose;
            }
          })
        })
       // console.log(arrayName);
    })
    clearTimeout(this.equityCashClear);
    this.equityCashClear = setTimeout(() => {
      this.PassValuetoCall(arrayName, array, catcheTime);
    }, 2000);
  }



// combine array with all parameter in all cases of options
  optionsCommonData(array: any, event: any, catcheTime: any) {
    this.dataLoad = false;
    array.forEach((element: any, index: any) => {
      this.combineOptionData = []
      var optionExpiryDateObj = {
        "Exch": element.Exchange,
        "ExchType": element.ExchangeType,
        "Symbol": element.Name
      }
      if (element.CPType == "CE") {
        element.btnType = "CALL";
        this.callPutOption = true;
         this.checked = true
        element.callPutOption = true;
      }
      else {
        element.btnType = "PUT";
        this.callPutOption = false;
        element.callPutOption = false;
      }
      var optionDetails = {
        "Exch": element.Exchange,
        "CallPut": element.btnType,
        "Symbol": element.Name,
        "Expiry": this.changeDateFormat(element.Expiry)
      }
      this.searchService.getSearchOptionDetails(optionDetails).subscribe((response: any) => {


        this.searchService.getSearchOptionExpiry(optionExpiryDateObj).subscribe((res: any) => {
          if (res['Status']) {
            this.dataLoad = true;
          } else {
            this.dataLoad = true;
          }
          var pushObj1 = {
            "Exchange": element.Exchange,
            "ExchangeType": element.ExchangeType,
            "Name": element.Name,
            "CPType": element.CPType,
            "Expiry": element.Expiry,
            "LastRate": element.LastRate,
            "ScripCode": element.ScripCode,
            "PClose": element.PClose,
            "array": res['Data'],
            "callPutOption": element.callPutOption,
            "strikeRate": response['Data'],
            "dateActive": element.Expiry,
            "activeModelDate": this.monthYearDateFormat(element.Expiry),
            "defaultstrikeRate": response['Data'][0].StrikeRate
          }
          this.expiryOptionsExpiry = this.changeDateFormat(pushObj1.Expiry);
          this.selectedStrikeRate = pushObj1.defaultstrikeRate
          //this.selectStrikePri  ce = pushObj1.strikeRate[0].StrikeRate;
          this.combineOptionData.push(pushObj1);
          // console.log(this.combineOptionData);
           this.recursiveCall(this.combineOptionData,catcheTime);
          })
      })
    })
  }


  equitySegmentChanged(event: any, tabValue: any) {
    if (tabValue == 'cash') {
      clearTimeout(this.commodityrecursiveClear);
      this.searchReqObj = {
        "Exch": "N", "ExchType": "C", "Symbol": this.serchString
      }

      if (this.searchReqObj.Symbol !== undefined && this.searchReqObj.Symbol.length > 2) {
        this.dataLoad = false;
        this.searchService.getEquityCash(this.searchReqObj).subscribe((res: any) => {
          // console.log(res);
          if (res['Status'] == 0 && res['Data'].length > 0) {
            
            // console.log(this.equityCashTabList);
            this.dataLoad = true;
            this.equityCashTabList = res['Data'];
            this.recursiveCall(this.equityCashTabList, res['CacheTime'].replace('+0530', ''));
          }
          else {
            this.dataLoad = true;
            this.equityCashTabList = [];
            this.scripSearch = res['Message'];
          }
        })
      }
    }
    else if (tabValue == 'future') {
     // clearTimeout(this.commodityrecursiveClear);
      // this.dataLoad = false;
      this.equityCashTabList = [];
      this.searchReqObj = {
        "DerivativeType": "F", "Symbol": this.serchString
      }

      if (event == 'equity') {
        clearTimeout(this.commodityrecursiveClear);
        this.equityFutureTabList = [];
        // this.dataLoad = false;
        // console.log(this.searchReqObj.Symbol);
        if (this.searchReqObj.Symbol !== undefined && this.searchReqObj.Symbol.length > 2) {
          this.dataLoad = false;
          this.searchService.getEquityFutureOpt(this.searchReqObj).subscribe((res: any) => {
            // console.log('future data', res);
            
            // console.log(res['Status']);
            if (res['Status'] == 0 && res['Data'].length > 0) {
              this.catcheTimeTab = res['CacheTime'].replace('+0530', '');
              this.dataLoad = true;
              this.equityFutureTabList = res['Data'];
              this.futureCommonData(this.equityFutureTabList, event, res['CacheTime'].replace('+0530', ''));
              
            }
            else {
              this.dataLoad = true;
              clearTimeout(this.equityCashClear);
              this.equityFutureTabList = [];
              this.scripSearch = res['Message'];
            }
          })
        }
      }
      else if (event == 'currency') {
        // this.dataLoad = false;
        clearTimeout(this.commodityrecursiveClear);
        this.equityFutureTabList = [];
        // console.log('enter currency');
        // console.log(this.searchReqObj.Symbol);
        if (this.searchReqObj.Symbol !== undefined && this.searchReqObj.Symbol.length > 2) {
          this.dataLoad = false;
          this.searchService.getCurrencyFutureOpt(this.searchReqObj).subscribe((res: any) => {
            // console.log(res);
            if (res['Status'] == 0 && res['Data'].length > 0) {
              this.catcheTimeTab = res['CacheTime'].replace('+0530', '');
              this.dataLoad = true;
              this.equityFutureTabList = res['Data'];

             // console.log(this.equityFutureTabList);
              //  // console.log(this.equityFutureTabList);
              this.futureCommonData(this.equityFutureTabList, event, res['CacheTime'].replace('+0530', ''));
            }
            else {
              this.dataLoad = true;
              clearTimeout(this.equityCashClear);
              this.equityFutureTabList = [];
              // console.log(this.equityFutureTabList);
              this.scripSearch = res['Message'];
            }
          })
        }
      }

      else if (event == 'commodity') {
        clearTimeout(this.equityCashClear);
        // this.dataLoad = false;
        this.equityFutureTabList = [];
        if (this.serchString !== undefined && this.serchString.length > 2) {
          this.dataLoad = false;
          this.searchService.getCommodityFuture(this.serchString).subscribe((res: any) => {
            // console.log(res);
            if (res['Status'] == 0 && res['Data'].length > 0) {
              this.catcheTimeTab = res['CacheTime'].replace('+0530', '');
              this.dataLoad = true;
              this.equityFutureTabList = res['Data'];
              // console.log(this.equityFutureTabList);
              this.futureCommonData(this.equityFutureTabList, event, res['CacheTime'].replace('+0530', ''));
            }
            else {
              this.equityFutureTabList = [];
              this.dataLoad = true;
              clearTimeout(this.equityCashClear);
              this.scripSearch = res['Message'];
            }
          })
        }
      }
    }
    else if (tabValue == 'options') {
      clearTimeout(this.commodityrecursiveClear);
      // this.dataLoad = false;
      //this.equityFutureTabList = [];
      this.searchReqObj = {
        "DerivativeType": "O", "Symbol": this.serchString
      }
      if (event == 'equity') {
        this.equityOptionTabList = [];
        // console.log(this.searchReqObj.Symbol);
        if (this.searchReqObj.Symbol !== undefined && this.searchReqObj.Symbol.length > 2) {
          this.dataLoad = false;
          this.searchService.getEquityFutureOpt(this.searchReqObj).subscribe((res: any) => {
            if (res['Status'] == 0 && res['Data'].length > 0) {
              this.catcheTimeTab = res['CacheTime'].replace('+0530', '');
              this.equityOptionTabList = res['Data'];
              this.dataLoad = true;
              // console.log(this.equityOptionTabList);
              // this.recursiveCall(this.equityOptionTabList);
             // this.recursiveCall(this.equityOptionTabList, res['CacheTime'].replace('+0530', ''));
              this.optionsCommonData(this.equityOptionTabList, event, res['CacheTime'].replace('+0530', ''));
            }
            else {
              this.dataLoad = true;
              this.equityOptionTabList = [];
              this.scripSearch = res['Message'];
            }
          })
        }
      }
      else if (event == 'currency') {
        this.combineFutureData = [];
        this.equityOptionTabList = [];
        // console.log(this.searchReqObj);
       // this.equityOptionTabList = [];
        // console.log(this.searchReqObj.Symbol);
        if (this.searchReqObj.Symbol !== undefined && this.searchReqObj.Symbol.length > 2) {
          this.dataLoad = false;
          this.searchService.getCurrencyFutureOpt(this.searchReqObj).subscribe((res: any) => {
            this.dataLoad = true;
            // console.log(res);
            if (res['Status'] == 0 && res['Data'].length > 0) {
              this.catcheTimeTab = res['CacheTime'].replace('+0530', '');
              this.equityOptionTabList = res['Data'];
              //this.recursiveCall(this.equityOptionTabList, res['CacheTime'].replace('+0530', ''));
              this.optionsCommonData(this.equityOptionTabList, event, res['CacheTime'].replace('+0530', ''));
            }
            else {
              this.dataLoad = true;
              this.equityOptionTabList = [];
              this.scripSearch = res['Message'];
            }
          })
        }
      }
    }

  }
  // function for change the date Format
  changeDateFormat(date: any) {
    return this.commonservice.getDate(date);
  }

  monthYearDateFormat(date: any) {
    return this.commonservice.getDate(date).slice(0, -5);
  }
  

  goToClientList(data: any) {
    clearTimeout(this.equityCashClear);
    clearTimeout(this.commodityrecursiveClear);
    if (this.cashFutureOptionTabValue == 'cash') {
      this.router.navigate(['/client-list', data.Exchange, data.ExchangeType, data.ScripCode, data.Symbol]);
    }
    if (this.cashFutureOptionTabValue == 'future') {
      // console.log(data.ScripCode);
     // this.router.navigate(['/client-list', data.Exchange, data.ExchangeType + '-' + this.changeDateFormat(data.dateActive).split(' ').join('-').toUpperCase(), data.ScripCode, data.Name]);
     this.router.navigate(['/client-list', data.Exchange, data.ExchangeType + '-' + this.changeDateFormat(data.dateActive).split(' ').join('-').toUpperCase(), data.ScripCode, data.Name]);
    }
    if (this.cashFutureOptionTabValue == 'options') {
      // console.log(data);
      var callPutbtnName
      if (data.callPutOption == true) {
        callPutbtnName = 'CE';
      }
      else {
        callPutbtnName = 'PE';
      }
      this.router.navigate(['/client-list', data.Exchange, data.ExchangeType + '-' + this.changeDateFormat(data.dateActive).split(' ').join('-').toUpperCase() + '-' + callPutbtnName + '-' + data.defaultstrikeRate, data.ScripCode, data.Name]);
    }
  }

  
	public addToRecent(exch: any, exchType: any, code: any) {
		this.storage.get('userID').then( (token) => {
			const params = {
				"Clientcode": token,
				"MWname": "RECENTVIEWED",
				"ClientLoginType":0,
				"Data": [
					{
						"Exch": exch,
						"ExchType": exchType,
						"ScripCode": code,
						"Action":"A"
					}
				]
			}
	
			this.subscription = new Subscription();
	
			this.subscription.add(
				this.marService
				.recentScrip(params)
				.subscribe( (response) => {
          // console.log(response);
					//this.router.navigate(['/company-details', exch , exchType, code, fName.split(' ').join('-') + exchType, shortName]);
					
				})
			)
		})
	}


  goToCompanyDetails(data: any) {
    clearTimeout(this.equityCashClear);
    clearTimeout(this.commodityrecursiveClear);
    this.addToRecent(data.Exchange,data.ExchangeType,data.ScripCode);
    if (this.cashFutureOptionTabValue == 'cash') {
      this.router.navigate(['/company-details', data.Exchange, data.ExchangeType, data.ScripCode, data.FullName.split(' ').join('-') + data.ExchangeType, data.Symbol]);
    }
    if (this.cashFutureOptionTabValue == 'future') {
      this.router.navigate(['/company-details', data.Exchange, data.ExchangeType, data.ScripCode, this.changeDateFormat(data.dateActive).split(' ').join('-').toUpperCase() + data.ExchangeType, data.Name]);
    }
    if (this.cashFutureOptionTabValue == 'options') {
      var callPutbtnName
      if (data.callPutOption == false) {
        callPutbtnName = 'PE';
      }
      else {
        callPutbtnName = 'CE';
      }
     // console.log(['/client-list', data.Exchange, data.ExchangeType + '-' + this.changeDateFormat(data.dateActive).split(' ').join('-') + '-' +callPutbtnName +'-' + data.defaultstrikeRate, data.ScripCode, data.Name]);
      this.router.navigate(['/company-details', data.Exchange, data.ExchangeType, data.ScripCode, this.changeDateFormat(data.dateActive).split(' ').join('-').toUpperCase() + '-' + callPutbtnName + '-' + data.defaultstrikeRate + data.ExchangeType, data.Name]);

    }
  }

  async goToWatchList(data: any) {
    this.passToWatchList = {
      scripcode: data.ScripCode,
      exchcode: data.Exchange,
      exchtypecode: data.ExchangeType
    }
    if (this.cashFutureOptionTabValue == 'cash') {
      this.ShortName = data.Symbol
    }
    if (this.cashFutureOptionTabValue == 'future') {
      this.ShortName = data.Name
      this.passToWatchList.futurevalue = this.changeDateFormat(data.dateActive);
    }

    if (this.cashFutureOptionTabValue == 'options') {
      this.ShortName = data.Name;
      if (data.callPutOption == true) {
        this.passToWatchList.btnName = 'CE';
      }
      else {
        this.passToWatchList.btnName = 'PE';
      }
      this.passToWatchList.futurevalue = this.changeDateFormat(data.dateActive) + ' | ';
      this.passToWatchList.strikePriceValue = data.defaultstrikeRate;
    }

    const modal = await this.modalController.create({
      component: AddToWatchlistComponent,
      cssClass: 'add-to-watchlist',
      componentProps: {
        "addWatchName": this.ShortName,
        "addWatchLTP": data.LastRate,
        "addWatchPclose": data.PClose,
        "addWatchScripCode": this.passToWatchList
      }
    });
    return await modal.present();
  }

  goToPrevious() {
    window.history.back();
  }
  dropClick(index: any, arr: any) {
    // console.log(arr);
    // this.dropBtn = true;
    // // console.log('Closing value: ', val.High);
    arr.forEach((element: any, ind: any) => {
      if ((index) !== ind) {
        element['isVisible'] = false;
      } else {
        element['isVisible'] = element['isVisible'] ? false : true;
      }
    });
    // val['isVisible'] = val['isVisible'] ? false : true;
  }

  changeNumerAfterDecimal(value: any){
		if(this.equityBlockTabValue == 'currency'){
		  return this.commonservice.formatNumberComma(parseFloat(value).toFixed(4));
		}
		else{
		  return this.commonservice.formatNumberComma(parseFloat(value).toFixed(2));
		}
	}


  ngDoCheck() {
    // // console.log(document.location.pathname);
    // this.checkSegmentValue();
    this.lastPath = document.location.pathname;
    if (this.lastPath === '/dashboard') {
      this.dashboardSegmentSelectedValue = 'dashboard';
      this.titleService.setTitle('IIFL AAA Dashboard');
    } else if (this.lastPath === '/markets') {
      this.dashboardSegmentSelectedValue = 'markets';
      this.titleService.setTitle('IIFL AAA Markets');
    } else if (this.lastPath === '/invest') {
      this.dashboardSegmentSelectedValue = 'invest';
      this.titleService.setTitle('IIFL AAA Invest');
    } else if (this.lastPath === '/client-trades') {
      this.dashboardSegmentSelectedValue = 'client';
      this.titleService.setTitle('IIFL AAA Client & Trades');
    } else if (this.lastPath === '/more') {
      this.dashboardSegmentSelectedValue = 'more';
      this.titleService.setTitle('IIFL AAA Tools');
    }
  }
  ionViewWillLeave() {
    clearTimeout(this.equityCashClear);
    clearTimeout(this.commodityrecursiveClear);
  }
  
  ngOnDestroy(): void {
		if(this.subscription){
			this.subscription = this.subscription.unsubscribe();
		}
	}
  
}
