import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject, Subscription,  } from 'rxjs';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';

@Component({
  selector: 'app-brok-insert-mobile',
  providers: [DashBoardService],
  templateUrl: './brok-insert-mobile.component.html',
  styleUrls: ['./brok-insert-mobile.component.scss'],
})
export class BrokInsertMobileComponent implements OnInit {
  public reportTypeData: any[] = [
		{ reportType: "Hybrid Brokerage", value:"H"},
		{ reportType: "Permanent Brokerage", value:"P" },
  ];
  reportType:any = "P"
  inputattr = false;
  clientCodeList:any = [];
  clientId:any;
  public isListVisible: boolean = false;
	private clientSearchTerms = new Subject<string>();
	allClients: any[] = [];
	dtLoad: boolean = false;
	public clientSearchValue: any = null;
  clientIdInputValidate!: boolean;
  clientIdLimitErrMsg: string = "Client ID is required";
  constructor(private router: Router, private dashBoardService:DashBoardService,  private storage: StorageServiceAAA,private commonService:CommonService) { }

  ngOnInit() {
    //this.clientCodeList = JSON.parse(localStorage.getItem("clientListWireRequest"));
    this.storage.get('setClientCodes').then((clientCodes) => {
			this.clientCodeList = clientCodes;
		})
    this.storage.get('setAccessMaker').then((accessMaker) => {
      if(accessMaker.includes("BrokerageException-Hybrid")){
        this.reportTypeData = [
          	  { reportType: "Hybrid Brokerage", value:"H"},
		      { reportType: "Permanent Brokerage", value:"P" },
        ]
        this.reportType = "P"
      }
    })
     

		let token = localStorage.getItem('jwt_token');
		let userID = localStorage.getItem('userId1');
		let userTypeValue = localStorage.getItem('userType');
		if(userTypeValue==='RM'){
			userTypeValue = 'RM';
		}else if(userTypeValue==='FAN'){
			userTypeValue = 'FN';
		}else{
			userTypeValue = 'SB';
		}
		this.clientSearchTerms
			.pipe(
				debounceTime(500),
				switchMap((searchValue) => this.dashBoardService.fetchGetClientCodes(userTypeValue, userID, token, searchValue)))
			.subscribe(results => {
				let clientData = [].concat(...results);
				const data = clientData
				.filter((element: any) => element.toString().split("-")[3].toLowerCase().trim() == "false")
				.map((client: any) => {
					return `${client.toString().split("-")[0]} - ${client.toString().split("-")[1].trim()}`;	
				});
				this.setClientSearch(data);
			});

  }

  goBack() {
    window.history.back()
  }

  changeClientCodes(event: any){
    localStorage.setItem('setClientCode', event.ClientCode)
    // console.log(event.ClientCode);
  }

  goToBrokInsertDetails(){
	//localStorage.setItem('setClientCode', ClientCode)
    // console.log(this.reportType);
    this.router.navigate(['/brokerage-insert', this.reportType]);
  }

  brokerageRequestRedirect(){
		this.router.navigate(['/view-reports'],{ queryParams: {report: 'BrokerageRequest'}});
	}

  setClientSearch(res: any) {
		if (res.length) {
			let data = [];
			for (const item of res) {
				data.push({
					ClientCode: item
				})
			}
			this.allClients = data;
		} else {
			this.allClients = [];
		}
		this.dtLoad = true;
	}

	searchClient(text: any) {
		let searchValue = text.trim();
		this.isListVisible = false;
		if (searchValue && searchValue.length > 3) {
			this.dtLoad = false;
			this.isListVisible = true;
			this.clientSearchTerms.next(searchValue);
		} else {
			this.allClients = [];
			this.onCancel()
		}
	}

	hideDropDown() {
	
		setTimeout(() => {
			this.isListVisible = false;
		}, 300);
	}
	displayClientDetails(data: any) {
		this.clientSearchValue = data.ClientCode.split('-')[0].trim();
		this.clientId = data.ClientCode.split('-')[0].trim();
		this.clientIdLimitErrMsg = "";
		this.clientIdInputValidate = true;
		localStorage.setItem('setClientCode', this.clientId)
		
	}
	onCancel(){
		this.clientIdLimitErrMsg = "Client ID is required";
		this.clientIdInputValidate = false;
		this.clientSearchValue=null;
		this.clientId = null;
	}


}
