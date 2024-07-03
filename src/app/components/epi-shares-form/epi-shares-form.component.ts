import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, switchMap } from 'rxjs/operators';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-epi-shares-form',
  templateUrl: './epi-shares-form.component.html',
  styleUrls: ['./epi-shares-form.component.scss'],
})
export class EpiSharesFormComponent implements OnInit, OnChanges {
  @Input() passClientId: any;
  dataLoad = false;
  symbol: any;
  private searchScripItems = new Subject<string>();
  searchResult: any = [];
	public isListVisible: boolean = false;
  dropdownLoader: boolean = false;
  selectedType: any;
  selectedDropType: any;
  displayScripSearchResult: any[] = [];
	DpIdDetails: any[] = [];
	DPIdList: any[] = [];
	dpId: any;
  ascending: boolean= true;
  fetchClientDematHolding: any[] = [];
  SubmitEPIRequest: any[] = [];
  inputattr = false;
  disableSubmitButton: boolean = true;
  enteredEPIQty: any;
  token!: string;

  constructor(private storage: StorageServiceAAA,private wireReqService: WireRequestService,public toast: ToasterService,private commonService: CommonService) { }
  
  
  ngOnChanges(changes: SimpleChanges): void {
    
    if(this.passClientId){

      this.dpId = ""; 
      this.fetchClientDematHolding = []; 
      this.displayScripSearchResult = [];
      this.displayScripSearchResult = [];
      this.enteredEPIQty = null;
      this.selectedDropType = "";
      this.dataLoad = true;

      this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.getDpIds(token)
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.getDpIds(token)
					})
				}

			});
    }
  }

  

  ngOnInit() {

    this.token = localStorage.getItem('JwtToken') || "";
    this.searchScripItems
    .pipe(
      debounceTime(500),
       switchMap((searchValue) => this.wireReqService.getSearchScripDetails(this.token, searchValue)))
     .subscribe( (res: any) => {
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
    }, (error) => {
      this.searchResult = [];
      this.dropdownLoader = false;
      this.isListVisible = false;
      this.toast.displayToast("Unable to fetch data");
    });
  }

  searchText(txt: any){

    this.enteredEPIQty = null;
    this.displayScripSearchResult = [];
    this.fetchClientDematHolding = [];

    if(txt && txt.length >= 3){

      this.selectedType = txt;
     // this.disableSubmit = false;
      this.isListVisible = true;
      this.dropdownLoader = true;
      this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
            this.token = token;
            this.searchScripItems.next(txt);
					})
				} else {
					this.storage.get('subToken').then(token => {
            this.token = token;
            this.searchScripItems.next(txt);
					})
				}

			});
    } else {
      
      //this.disableSubmit = true;
      this.searchResult = [];
      this.isListVisible = false;
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
    this.displayScripSearchResult = [value];

    if(this.displayScripSearchResult[0].ISIN && this.dpId){

      this.dataLoad = true;
      this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						this.clientDematHoldings(token);
					})
				} else {
					this.storage.get('subToken').then(token => {
						this.clientDematHoldings(token);
					});
				}
			});
    }
  }

  clientDematHoldings = (token: any) => {
      this.wireReqService.getclientDematHoldings(token,this.passClientId, this.dpId, this.displayScripSearchResult[0].ISIN)
      .subscribe((res: any) => {
        if(res && res['Body']){
          this.fetchClientDematHolding = res['Body'];

        }else{
          this.disableSubmitButton = true;
          this.fetchClientDematHolding = [];
          if(res['Head']['ErrorDescription'] == "No records found."){
            this.toast.displayToast("Quantity not found for client: " + this.passClientId);
          }
      }
      this.dataLoad = false;
  }, (error) => { 
      this.dataLoad = false;
      this.disableSubmitButton = true;
      this.toast.displayToast("Total Qty Not Found");
  });
  
  }

  onSearchbarClick = () => {

    if(this.searchResult.length > 0){

      this.isListVisible = !this.isListVisible;
    }
  }
  
  getDpIds(token: any) {
		var obj = { "UserCode": this.passClientId, "UserType": "4" }
		this.wireReqService.getProfileDetails(token, obj).subscribe((res: any) => {
			if(res && res['Body'] && res['Body'].DP){
				this.DpIdDetails = res['Body'].DP;
			}
			//this.nsdlList = [];
			//this.cdslList = [];
			this.DPIdList = [];
			if (this.DpIdDetails.length > 0) {
				this.DpIdDetails.forEach((element, index) => {
					// this.nsdlList.push(element.DPID);
					// this.cdslList.push((element.BOID).trim());
					if(element.DPID.includes("IN")){
						let str = element.DPID + element.BOID;
						this.DPIdList.push((str).trim());
					}
					else{
						this.DPIdList.push((element.BOID).trim())
					}
					
					this.dpId = this.DPIdList[0];
          this.dataLoad = false;
				});
			}
      this.dataLoad = false;
		})
	}  

  submitForm = () => {
		this.commonService.setClevertapEvent('EPI_submit_clicked', { 'Login ID': localStorage.getItem('userId1') });
    this.disableSubmitButton = true;
    if(this.dpId && this.fetchClientDematHolding[0].TotalQty && this.passClientId && 
        this.displayScripSearchResult[0].ISIN && this.displayScripSearchResult[0].Symbol
        && this.enteredEPIQty){

          this.dataLoad = true;
          this.storage.get('userType').then(type => {
            if (type === 'RM' || type === 'FAN') {
              this.storage.get('bToken').then(token => {
                this.callSubmitEPIRequest(token);
              })
            } else {
              this.storage.get('subToken').then(token => {
                this.callSubmitEPIRequest(token);

              });
            }
          });

    } else {

      // disable button
      // toast

    }
    
  }

  callSubmitEPIRequest = (token: any) => {

    if(this.enteredEPIQty <= +this.fetchClientDematHolding[0].TotalQty){
      this.disableSubmitButton = false;
      } else {
        this.disableSubmitButton = true;
        this.toast.displayToast("Entered EPI quantity should not be greater than Total EPI quantity");
        return;
    }
    this.wireReqService.submitEPIRequest(token, this.passClientId,this.dpId,
      this.displayScripSearchResult[0].ISIN,this.displayScripSearchResult[0].Symbol,this.enteredEPIQty)
      .subscribe((res: any) => {

        this.dpId = ""; 
        this.fetchClientDematHolding = []; 
        this.displayScripSearchResult = [];
        this.displayScripSearchResult = [];
        this.enteredEPIQty = null;
        this.dataLoad = false;

        if(res['Head']['ErrorCode'] == 0 && res['Body']){
          
          this.toast.displayToast(res['Body']['Msg']);
        } else {
          this.toast.displayToast(res['Head']['ErrorDescription']);
        }
        this.dataLoad = false;

      });
  }
  
  handleEPIQtyChange = (value: any) => {
    // review removed $event.target.value from html
    value = value.target.value;
    if(this.dpId && (this.fetchClientDematHolding && this.fetchClientDematHolding[0].TotalQty) && this.passClientId && 
      this.displayScripSearchResult[0].ISIN && this.displayScripSearchResult[0].Symbol
      && value && value > 0){
        if(this.fetchClientDematHolding.length > 0 && value > +this.fetchClientDematHolding[0].TotalQty){
          this.disableSubmitButton = true;
          return;
        }
        this.enteredEPIQty = value;
        this.disableSubmitButton = false;
      } else {
        this.disableSubmitButton = true;
      }
  }
  
}
