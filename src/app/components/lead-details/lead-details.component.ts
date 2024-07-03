import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { SearchComponent } from '../search/search.component';
import { Platform } from "@ionic/angular";
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-lead-details',
  providers: [DashBoardService],
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.scss'],
})
export class LeadDetailsComponent implements OnInit {

  public isShow = false;
  public onShow = false;
  public ascending: any = true;
  selectedApplicn: any;
  public order: string = 'TotalAUM';
  applicationList = [
    { option: 'All', value: undefined, status: 'All' },
    { option: 'Request Sent', value: '0', status: 'Request Sent' },//yellow
    { option: 'Request Failed', value: '1', status: 'Request failed. Apply again' }, //red
    { option: 'Request Accepted by Bank', value: '10', status: 'Mandate approval pending' },//yellow
    { option: 'Rejected due to invalid UPI', value: '11', status: 'Rejected due to invalid UPI' }, //red
    { option: 'Rejected by Bank', value: '12', status: 'Application Rejected by Bank ' },//red
    { option: 'Rejected by investor Bank', value: '21', status: 'Rejected by Investors Bank' },//red
    // { option: "Rejected by Investor Bank Due To Technical Error", value: '22', status: 'Rejected by Investor Bank' },
    { option: 'Rejected by investor.', value: '31', status: 'Rejected by Investor' },//red
    { option: 'Accepted by investor', value: '100', status: 'Application Successful' },
    { option: 'Blocked amount released', value: '110', status: 'Application Cancelled' }
  ]
  reverse: boolean = false;
  dataLoad = false;
  filterObj = {
    'PageNo': 1,
    'Sortby': '',//'ClientCode',
    'SortOrder': '',//'asc',
    'SearchBy': '',
    'SearchText': ''
  }

  clientList: any = [];
  AllClients: any = [];
  selectedProduct: any;
  ipId: any;
  checkupList: any = [];
  tokenValue: any;
  leadTimer: any;
  public searchText: any = null;
  public val: string = 'asc';
  
  constructor(private toast: ToasterService, private platform: Platform, public modalController: ModalController, public commonService: CommonService, private storage: StorageServiceAAA, private actRoute: ActivatedRoute, private dashBoardService: DashBoardService) {
    this.actRoute.params.subscribe(params => {
      this.ipId = params['id'];
    });
  }

  ngOnInit() {
    this.storage.get('topLeads').then(topl => {
      this.init(topl);
    });
  }

  init(list: any) {
    this.selectedProduct = list.find((o: any) => o.id === parseInt(this.ipId));
    this.getProduct();
  }

  getProduct() {
    this.storage.get('leadData').then(top => {
      this.selectedProduct = Object.assign(this.selectedProduct, top);
      this.timerCalc();
      this.getToken();
      this.getClientsOnPopup();
    });
  }

  timerCalc() {
    if (this.selectedProduct && this.selectedProduct.date) {
      var date_now = new Date().getTime()
      this.selectedProduct.date = new Date(this.selectedProduct.date);
      var delta = this.selectedProduct.isPreBid ? Math.abs(date_now - this.selectedProduct.date) / 1000 : Math.abs(this.selectedProduct.date - date_now) / 1000;
      // calculate (and subtract) whole days
      var days: any = Math.floor(delta / 86400);
      delta -= days * 86400;
      // calculate (and subtract) whole hours
      var hours: any = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;
      // calculate (and subtract) whole minutes
      var minutes: any = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;
      // what's left is seconds
      var seconds: any = delta % 60;

      if (days >= 1) {
        this.selectedProduct.isDay = true;
        this.selectedProduct.timerText = this.selectedProduct.isPreBid ? `Open in ${parseInt(days)} days` : `Ends in ${parseInt(days)} days`;
      }
      else {
        this.selectedProduct.isDay = false;
        this.selectedProduct.timerText = this.selectedProduct.isPreBid ? `Open in ${parseInt(hours)}:${parseInt(minutes)}:${parseInt(seconds)}` : `${parseInt(hours)}:${parseInt(minutes)}:${parseInt(seconds)}`;
      }
    }
    clearInterval(this.leadTimer);
    this.leadTimer = setInterval(() => {
      this.timerCalc();
    }, 1000);
  }
  /**
   * To get client list on pop-up.
   */
  getClientsOnPopup() {
    this.storage.get('setClientCodes').then((clientCodes) => {
      this.checkupList = clientCodes;
    })
  }

  /**
   * To get Interested Client List.
   * @param token 
   */
  getClientList(token: string) {
    let obj = {
      'PartnerCode': localStorage.getItem('userId1'),
      'ProductName': this.selectedProduct.issueCode,
      'ProductType': this.selectedProduct && this.selectedProduct.clientCount && this.selectedProduct.clientCount.product_Type ? this.selectedProduct.clientCount.product_Type : undefined
    }
    if (this.selectedProduct.clientCount) {
      this.dashBoardService.getInterestedClientList(token, Object.assign(obj, this.filterObj))
        .subscribe((res: any) => {
          if (res && res['Body'] && res['Head']['ErrorCode'] == 0) {
            this.clientList = res['Body'].map((item: any) => {
              const client = {
                ClientName: item.ClientName.replace(/\s\s+/g, ' '),
                ClientCode: item.ClientCode,
                EMailID: item.EMailID,
                MobileNumber: item.MobileNumber,
                TotalAUM: item.TotalAUM,
                NoStatus: item.ApplicationStatus === '' ? true : false,
                ApplicationStatus: _.find(this.applicationList, function (app) {
                  if (item.ApplicationStatus === 'Rejected by Investor Bank Due To Technical Error') {
                    app.option = 'Rejected by Investor Bank Due To Technical Error';
                    app.value = '22';
                    app.status = 'Rejected by Investor Bank';
                    return app.option;
                  } else {
                    if (app.option === item.ApplicationStatus) {
                      return app.option;
                    }
                  }
                  return;
                })
              }
              return client;
            });
            this.AllClients = this.clientList;
            this.dataLoad = true;
          } else {
            if (res['Head'] && res['Head']['ErrorDescription']) {
              this.toast.displayToast(res['Head']['ErrorDescription']);
              this.dataLoad = true;
            }
          }
        },
          // error => {
          // 		console.error(error);
          // 		this.toast.displayToast(error);
          // }
        )
    } else {
      this.dataLoad = true;
    }
  }

  goBack() {
    window.history.back();
  }
  toggleFlag() {
    this.isShow = true;
  }
  close() {
    this.isShow = false;
  }

  /**
   * On click of Apply for  IIFL clients.
   */
  applyClients() {
    let ctProp = {
      'Category': this.selectedProduct.productType,
      'IPO Name': this.selectedProduct.name
    }
    this.commonService.setClevertapEvent('Top Leads IIFL Clients Clicked', ctProp);
    this.openSearchOption();
  }

  /**
   * On click of Apply for Non IIFL clients.
   */
  applyNonClients() {
    let ctProp = {
      'Category': this.selectedProduct.productType,
      'IPO Name': this.selectedProduct.name
    }
    this.commonService.setClevertapEvent('Top Leads Non IIFL Clients Clicked', ctProp);
    let dataToSend = {
      "clientCode": localStorage.getItem('userId1'),
      "Page": this.selectedProduct.issueCode
    }
    this.getToken(dataToSend);
  }

  /**
   * On click of apply btn from client list.
   */
  OnApplyClick(client: any, apply?: boolean) {
    let ctProp = {
      'ClientID': client.ClientCode,
      'Client Name': client.ClientName,
      'Contact Number': client.MobileNumber,
      'Email ID': client.EMailID,
      'AUM': client.TotalAUM,
      'IPO Status': client && client.ApplicationStatus && client.ApplicationStatus.status ? client.ApplicationStatus.status : undefined
    }
    if (apply) {
      this.commonService.setClevertapEvent('Top Leads Apply Clicked', ctProp);
    }else{
      this.commonService.setClevertapEvent('Top Leads_Modify_Clicked', ctProp);
    }
    let dataToSend = {
      "clientCode": client.ClientCode,
      "Page": apply ? this.selectedProduct.issueCode : 'H'
    }
    this.getToken(dataToSend);
  }

  /**
   * Get token value.
   */
  getToken(obj?: any) {
    this.storage.get('userType').then(type => {
      if (type === 'RM' || type === 'FAN') {
        this.storage.get('bToken').then(token => {
          if (obj) {
            this.applyFun(token, obj);
          } else {
            this.getClientList(token);
          }
        })
      } else {
        this.storage.get('subToken').then(token => {
          if (obj) {
            this.applyFun(token, obj);
          } else {
            this.getClientList(token);
          }
        })
      }
    })
  }

  /**
   * API call for apply client & Non-client.
   * @param token 
   * @param obj 
   */
  applyFun(token: string, obj: any) {
    let appSource;
    if (this.platform.is('android')) {
      appSource = 12;
    } else if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
      appSource = 13;
    } else if (this.platform.is('ios')) {
      appSource = 11;
    }
    obj['appSource'] = appSource,
      obj['clientType'] = 6,
      obj['requesterCode'] = localStorage.getItem('userId1'),

      this.dashBoardService.applyClientNonClient(token, obj).subscribe((res: any) => {
        if (res['statusCode'] == 0) {
          let url = res['resultData']['url'];
          // if (this.commonService.isApp()) {
          //   var ref = cordova.InAppBrowser.open(url, '_blank');
          //   ref.addEventListener('loadstart', this.loadstartCallback);
          //   ref.addEventListener('loadstop', this.loadstopCallback);
          //   ref.addEventListener('loaderror', this.loaderrorCallback);
          //   ref.addEventListener('exit', this.exitCallback);
          // } else {
          window.open(url, '_blank');
          // }
        } else {
          if (res['resultData']) {
            this.toast.displayToast(res['resultData']);
          }
        }
      },
        // error => {
        // 		console.error(error);
        // 		this.toast.displayToast(error);
        // }
      )
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

  /**
   * Open popup to select client. 
   * */
  async openSearchOption() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: 'search-modal',
      componentProps: {
        HealthCheckupList: this.checkupList,
        smallCase: true
      }
    });

    modal.onDidDismiss().then((data:any) => {
      if (data["data"]) {
        const response = data['data'];
        console.log(response);
        if (response['selectedValue'] === null) return;
        if (response && response.selectedValue && response.selectedValue.ClientCode) {
          let dataToSend = {
            "clientCode": response.selectedValue.ClientCode,
            "Page": this.selectedProduct.issueCode
          }
          this.getToken(dataToSend);
        }
      }
    });
    return await modal.present();
  }

  /**
   * On searchbar
   */
  searchInList(ev: any) {
    if (ev && ev.target && ev.target.value) {
      const text = ev.target.value.toLowerCase().trim().replace(/\s\s+/g, ' ');
      this.clientList = this.AllClients.filter((c: any) => (c.ClientName.toLowerCase().trim().indexOf(text) > -1) || (c.ClientCode.toLowerCase().trim().indexOf(text) > -1));
      this.dataLoad = true;
    } else {
      this.getToken();
    }
  }

  /**
   * Sorting in list.
   * @param value 
   */
  //sorting function for column
  setOrder(value: string) {
    this.reverse = !this.reverse;
    this.order = value;
    if (this.reverse) {
      this.ascending = false;
      this.val = 'desc';
    } else {
      this.ascending = true;
      this.val = 'asc';
    }
  }

  /**
   * On Application drop-down change.
   */
  filterByApplicationSts(ev: any) {
    this.dataLoad = false;
    if (ev && ev.status === 'All') {
      this.getToken();
    } else {
      this.clientList = this.AllClients.filter((item: any) => {
        if (ev.option === 'Rejected by investor Bank') {
          return item && item.ApplicationStatus && item.ApplicationStatus.option && (item.ApplicationStatus.option === 'Rejected by investor Bank' || item.ApplicationStatus.option === 'Rejected by Investor Bank Due To Technical Error');
        } else {
          return item && item.ApplicationStatus && item.ApplicationStatus.option === ev.option;
        }
      });
      this.dataLoad = true;
    }
  }
}
