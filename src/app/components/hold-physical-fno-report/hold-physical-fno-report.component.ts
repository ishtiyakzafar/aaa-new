import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from '../../pages/login/login.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-hold-physical-fno-report',
  templateUrl: './hold-physical-fno-report.component.html',
  styleUrls: ['./hold-physical-fno-report.component.scss'],
})
export class HoldPhysicalFnoReportComponent implements OnInit {
  @Input() physicalngfc: any;
  @Input() wireCodeId: any;
  clientHolddata: any;
  reportData: any = [];
  userid: any;
  onselectatleast!: boolean;
  isChecked: boolean[] = [];
  collapsed: boolean[] = [];
  selectall!: boolean;
  selectedItemsList: any = [];
  groupList: any = [];
  tokendata: any;
  public isDropDownVisible: boolean = false;
  public clientSearchValue: any = null;
  public dataLoad: boolean = false;
  clientList: any[] = [];
  monthinclude!: boolean;
  dayvalue!: number;
  result_Date!: Date;
  thursdayPeriod: any;
  searchValue: any;
  scripcode: any = [];

  public clientBlockSegmentValue: string = "clientCode";

  private subscription = new Subscription();
  constructor(private wireservice: WireRequestService, private commonService: CommonService, private storage: StorageServiceAAA, public serviceFile: LoginService, private toast: ToasterService) { }

  ngOnInit() {
    this.onselectatleast = true;
  }
  ngOnChanges() {
    if(!this.wireCodeId){
      this.toast.displayToast('Kindly select Wire Code');
      return;
    }
    this.selectedItemsList = [];
    if (this.physicalngfc == "7") {
      let userid = this.storage.get('userID').then((userID) => {
        this.userid = userID;
        let token = this.storage.get('bToken').then(token => {
          this.tokendata = token;
          if (this.userid != "") {
            let body = {
              "PartnerCode": this.wireCodeId == 'All' ? localStorage.getItem('userId1') : this.wireCodeId,
              "ClientCode": ""
            }
            this.dataLoad = true;
            this.wireservice.getallClientWireRequest(body, this.tokendata).subscribe(res => {
              this.clientHolddata = res['Body'];
              this.reportData = res['Body'];
              this.dataLoad = false;
            })
          }
        })
      });
      function getLastThursday(year: any, month: any) {
        let d = new Date(year, month, 0);
        d.setDate(d.getDate() - d.getDay() - 3);
        return d;
      }
      // Get all last Thursdays for current year
      for (var y = new Date().getFullYear(), i = 1; i <= 12; i++) {

        let thursdayList = getLastThursday(y, i).toDateString();
        var d = new Date();
        getdaysDifference(thursdayList);
        const shortName = d.toLocaleString('en-US', { month: 'short' });
        let monthinclude = thursdayList.includes(shortName);
        if (monthinclude == true) {
          this.thursdayPeriod = thursdayList;
          this.thursdayPeriod = this.thursdayPeriod.split("Thu");
          const d = new Date();
          let text = d.toDateString();

          var thursDate = new Date(thursdayList).getDate()
          var curr_date = new Date(text).getDate();
          this.dayvalue = (thursDate - curr_date);


        }
      }

    }


  }


  selectclient(e: any, obj: any, index: any) {
   let sameClient = [];
    if (e.target.checked) {
      sameClient = this.clientHolddata.filter((item: any) => {
        if (item.ClientCode === obj.ClientCode) {
          item['isChecked'] = true;
          return item;
        }
      });
      if (sameClient && sameClient.length > 0) {
        this.selectedItemsList = this.selectedItemsList.concat(sameClient);
      } else {
        this.selectedItemsList.push(obj)
      }
    }
    else {
      
      for (var i = 0; i < this.selectedItemsList.length; i++) {
        if (this.clientHolddata[index].SCRIPCODE == this.selectedItemsList[i].SCRIPCODE) {
          this.selectedItemsList.splice(i, 1);
          this.isChecked[index]=false;
          
          
        }
      }
      this.clientHolddata.filter((item: any) => {
        if (item.ClientCode === obj.ClientCode) {
          item['isChecked'] = false;
          this.selectedItemsList.splice(item, 1);
        }
      });
    }
    if (this.selectedItemsList.length == 0) {
      this.onselectatleast = true;
      this.selectall = false;
      
    }
    else {
      this.onselectatleast = false;
    }
   
  }

  checkUncheckall(e: any) {
    
    this.selectedItemsList=[];
    for (var i = 0; i < this.clientHolddata.length; i++) {
      // this.isChecked[i] = this.selectall;
      
      
      if (this.selectall == true) {
        this.isChecked[i] = this.clientHolddata[i].HOLD === '1' ? false : this.selectall;
        this.onselectatleast = this.clientHolddata[i].HOLD === '1' ? true : false;
        this.selectedItemsList.push(this.clientHolddata[i])
      }
      else {
        this.onselectatleast = true;
        this.isChecked[i] = this.selectall;
        this.selectedItemsList = [];
      }
    }     
  }
  onHoldSelectedReports() {
    if(!this.wireCodeId){
      this.toast.displayToast('Kindly select Wire Code');
      return;
    }
    function getLastThursday(year: any, month: any) {
      let d = new Date(year, month, 0);
      d.setDate(d.getDate() - d.getDay() - 3);
      return d;
    }


    
          if (this.selectedItemsList.length > 0) {
            this.selectedItemsList.forEach((item: any, index: any) => {
              this.groupList.push({ "ClientCode": item.ClientCode, "ScripCode": Number(item.SCRIPCODE), "Hold": 1 });
            });
          
          
      this.wireservice.holdSelectedReports(this.groupList, this.tokendata, this.userid).subscribe(res => {
          let body = {
                  "PartnerCode": this.wireCodeId == 'All' ? localStorage.getItem('userId1') : this.wireCodeId,
                  "ClientCode": ""
          } 
          this.dataLoad = true;
          this.selectedItemsList = [];
          this.groupList=[];
          this.monthinclude = false;
          this.commonService.setClevertapEvent('reports_risk_hold_physical_submit');
            if (res['Head']['ErrorCode'] == 5) {
              this.toast.displayToast(res['Head']['ErrorDescription']);  

            } else if(res['Head']['ErrorCode'] == 0) {
              this.toast.displayToast(res['Body']['Msg']);
                  
            }
            else{
              this.dataLoad = false;
            }
            this.wireservice.getallClientWireRequest(body, this.tokendata).subscribe(res => {
              this.clientHolddata = res['Body'];
              this.reportData = res['Body'];
              this.dataLoad = false;
              this.selectall=false;
              this.onselectatleast=true
            })
          })
        }
        // }

      // }
    // }

  }
  showDropDown() {

    this.isDropDownVisible = true;
    this.clientSearchValue = '';
    this.dataLoad = true;


    this.storage.get('userType').then(type => {
      if (type === 'RM' || type === 'FAN') {
        this.storage.get('sToken').then(token => {
          this.getMappingRM(token)

        })
      } else {
        this.storage.get('subToken').then(token => {
          this.getMappingRM(token)
        })
      }
    })





  }
  public getMappingRM(cookieValue: any) {
    this.dataLoad = false;
    this.storage.get('userID').then((userId) => {
      this.subscription = new Subscription();
      const params = {
        AdminCode: userId
      }
      this.subscription.add(
        this.serviceFile
          .getRMMapping(params, userId, cookieValue)
          .subscribe((response: any) => {
            this.dataLoad = true;
            if (response['body'].status == 0) {
              this.clientList = response['body'].details;
              this.storage.set('mappingDetails', response['body'].details);
            }
            else {
              this.clientList = [];
            }
          })
      )
    })
  }
  onSelectedClient(client_code: any) {

    let body: any = {
      "PartnerCode": this.userid,
      "ClientCode": client_code
    }
    this.wireservice.getallClientWireRequest(body, this.tokendata).subscribe(res => {
      this.clientHolddata = res['Body'];
      this.reportData = res['Body'];

    });
  }

  hideDropDown() {
    setTimeout(() => {
      this.isDropDownVisible = false;
    }, 500);
  }
  onCollapse(i: any) {
    this.collapsed[i] = !this.collapsed[i];
  }
  onClosePopup() {
    this.monthinclude = true;
  }
  searchText() {
    // this.PageNo = 1;
    if (this.searchValue == '' || this.searchValue == undefined) {
      this.clientBlockSegmentValue = '';
    }
    // this.sendDataToChild = true;
  }

  /**
   * On click of pdf/excel icon
   */
  onPdfExcelDownload(type: any) {
    this.commonService.setClevertapEvent('Riskreport_FnO', { 'PartnerCode': localStorage.getItem('userId1') });
    if (this.reportData && this.reportData.length > 0) {
      this.dataLoad = true;
      let info: any = [];
      let head = [["Client Code", "Contract Name", "Cash Available Quantity", "BOD Quantity", "HOLD", "LTP (Rs)", "MoneynessType", "Product Type", "SCRIPCODE", "Spot price", "Today NetQuantity", "Total NetQuantity"]];
      this.reportData.forEach((element: any) => {
        info.push([element.ClientCode, element.ContractName, element.CashAvailableQuantity, element.BODQuantity, element.HOLD, element.LTP, element.MoneynessType, element.ProductType, element.SCRIPCODE, element.Spotprice, element.TodayNetQuantity, element.TotalNetQuantity])
      })
      if (type === 'pdf') {
        this.commonService.savePdfFile(head, info);
        this.dataLoad = false;
      } else {
        this.commonService.exportDataToExcel(head[0], info, 'Hold Physical FNO Report');
        this.dataLoad = false;
      }
    } else {
      this.toast.displayToast('No Data Found');
    }
  }

}
function getdaysDifference(thursdayList: string) {
  const oneDay = 24 * 60 * 60 * 1000
  var d = new Date();
  var changethursdaystring = new Date(thursdayList).getTime();
  const differenceMs = Math.abs(changethursdaystring - d.getTime());
  // this.dayvalue= Math.round(differenceMs / oneDay);
}

