import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, switchMap } from 'rxjs/operators';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';

@Component({
  selector: 'app-scriptwise-summary',
  templateUrl: './scriptwise-summary.component.html',
  styleUrls: ['./scriptwise-summary.component.scss'],
})
export class ScriptwiseSummaryComponent implements OnInit {

  dataLoad = false;
  symbol: any;
  scriptSummaryData: any[] = [];
  scriptDropdownData: any[] = [];
  selectedDropType: any;
  totalCount = 0;
  searchSymbol: any;
  tokenVal: any;
  public placeholderInput: string = 'Search...';
  selectedType: any;
  visible: boolean = false;
  isDiv = false;
  disableSubmit = true;
  private searchScripItems = new Subject<string>();
  searchResult: any = [];
	public isListVisible: boolean = false;
  dropdownLoader: boolean = false;

  constructor(private storage: StorageServiceAAA,private wireReqService: WireRequestService,public toast: ToasterService,private commonService: CommonService) { }

  ngOnInit() {

    this.tokenVal = localStorage.getItem('JwtToken');
    this.searchScripItems
    .pipe(
      debounceTime(500),
        switchMap((searchValue) => this.wireReqService.getSearchScripDetails(this.tokenVal, searchValue))).subscribe({
          next: (res:any)=> { 

            if(res['Head']['ErrorCode'] == 0 && res['Body']){

              this.searchResult = res['Body'];
              this.searchResult = this.searchResult.filter((item: any) => {
                if(item.Symbol.trim() != ""){
                  return item;
                }
              });
            } else{
    
              this.searchResult = [];
            }
            this.dropdownLoader = false;
          },
          error: (err: any) => {
            this.searchResult = [];
            this.dropdownLoader = false;
            this.isListVisible = false;
            this.toast.displayToast("Unable to fetch data");
           }
      });
   }

  searchText(txt: any){
    if(txt && txt.length >= 3){

      this.selectedType = txt;
      this.disableSubmit = false;
      this.isListVisible = true;
      this.dropdownLoader = true;
      this.storage.get('userType').then(type => {
          if (type === 'RM' || type === 'FAN') {
              this.storage.get('bToken').then(token => {
                this.tokenVal = token;
                this.searchScripItems.next(txt);
              })
          } else {
              this.storage.get('subToken').then(token => {
                this.tokenVal = token;
                this.searchScripItems.next(txt);
              })
          }
      });
    } else {
      
      this.disableSubmit = true;
      this.searchResult = [];
      this.isListVisible = false;
    }
  }
  
  goBack() {
		window.history.back();
	}
  close() {
		this.isDiv = false;
		this.visible = false;
	}

  getData(){
    this.dataLoad = true;
    this.storage.get('userID').then((userId) => {
      this.storage.get('userType').then(type => {
          if (type === 'RM' || type === 'FAN') {
              this.storage.get('bToken').then(token => {
                  this.callScripSummaryAPI(token,userId)
              })
          } else {
              this.storage.get('subToken').then(token => {
                  this.callScripSummaryAPI(token,userId)
              })
          }
      })
    });
  }

  callScripSummaryAPI = (token: string, userId: string) => {

    this.wireReqService.getScripSummaryReport(token,userId,this.selectedType)
    .subscribe((res: any) => {
			if (res['Head']['ErrorCode'] == 0) {
        this.commonService.setClevertapEvent('ScripSummary_Clicked');
				this.scriptSummaryData = res['Body']['ScriptSummaryReport'];
        this.totalCount = res['Body']['TotalCount'];
        setTimeout(() => {
          this.dataLoad = false;
        }, 500);
			}
      else {
        setTimeout(() => {
          this.dataLoad = false;
        }, 500);
        this.scriptSummaryData = [];
        this.totalCount = 0;
        this.toast.displayToast(res['Head']['ErrorDescription']);
      }
      this.selectedType = null;
      this.selectedDropType = null;
      this.searchResult = [];
      this.disableSubmit = true;
		});
  }

  downloadReport(){
    if (this.scriptSummaryData.length > 0) {
    let head: any;
		let info: any = [];
    head = [["Login ID", "Branch", "Scrip Name", "Qty", "Rate"]];
					this.scriptSummaryData.forEach((element) => {
						info.push([element.Loginid, element.Branch, element.ScripName, element.Qty, element.Rate])
					});
    this.commonService.exportDataToExcel(head[0], info, 'Scrip Report');
  }else {
    this.toast.displayToast('No Data Found');
  }
  }

  hideDropDown = () => {
    setTimeout(() => {
      this.isListVisible = false;
    }, 300);
  }

  setSearchValue = (value: any) => {
    this.selectedType = value.Symbol;
    this.selectedDropType = value.ScripName;
    this.searchResult = [value];
  }

  onSearchbarClick = () => {

    if(this.searchResult.length > 0){

      this.isListVisible = !this.isListVisible;
    }
  }

}
