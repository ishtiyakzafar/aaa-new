import { Component } from '@angular/core';
import { ToasterService } from '../../helpers/toaster.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { CommonService } from '../../helpers/common.service';
import moment from "moment";
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-settlement-payout-report',
  templateUrl: './settlement-payout-report.component.html',
  styleUrl: './settlement-payout-report.component.css'
})
export class SettlementPayoutReportComponent {
  public ascending = false;
  public dataLoad = false;
  public order: any;
  reverse: boolean = false;
  searchValue:any= '';
  settlementPayoutReportList: any = [];
  settlementPayoutReportListCopy: any = [];
  collapsed: boolean[] = [];
  public moment: any = moment;
  constructor(private storage: StorageServiceAAA,
    private toast: ToasterService,
    private wireReqService: WireRequestService,
    public commonService: CommonService) { }
  ngOnInit() {
    this.dataLoad = true;
    this.searchValue = '';
    this.storage.get('userID').then((userId:any) => {
      this.storage.get('userType').then((type:any) => {
        if (type === 'RM' || type === 'FAN') {
          this.storage.get('bToken').then((token:any) => {
            this.storage.get('cookieValue').then((cookie:any) => {
              if (cookie) {
                this.callGetSettlementPayoutReport(`${token};${cookie.split(';')[0]}`, userId);
              }
            })
          })
        } else {
          this.storage.get('subToken').then((token:any) => {
            this.storage.get('cookieValue').then((cookie:any) => {
              this.callGetSettlementPayoutReport(`${token};${cookie.split(';')[0]}`, userId);
            })
          })
        }
      })
    });
  }
  callGetSettlementPayoutReport = (token:any, userId:any) => {
    this.commonService.setClevertapEvent('Settlement_Payout_Clicked', { 'Login ID': localStorage.getItem('userId1') });
    this.settlementPayoutReportList = [];
    this.settlementPayoutReportListCopy = [];
    
    this.wireReqService.getSettlementPayoutReport(token, userId).subscribe({
      next: (res:any)=> { 

        if (res['Head']['ErrorCode'] == 0) {
          if (res['Body'].length > 0) {
            this.settlementPayoutReportList = res['Body'];
            this.settlementPayoutReportList.forEach((e:any) => {
              e.ProcessDate = new Date(`${e.ProcessDate.slice(0, 4)}/${e.ProcessDate.slice(4, 6)}/${e.ProcessDate.slice(6, 8)}`);
              e.TentativePayoutDate = new Date(`${e.TentativePayoutDate.slice(0, 4)}/${e.TentativePayoutDate.slice(4, 6)}/${e.TentativePayoutDate.slice(6, 8)}`);
              e.ledgerbal = parseFloat(e.LedgerBalance);
              e.ledger_bal_two_decimal = parseFloat(e.LedgerBalance).toFixed(2);
              e.payoutVal = parseFloat(e.PayoutValue);
            });
            this.settlementPayoutReportListCopy = res['Body'];
          }
        } else {
          this.toast.displayToast(res['Head']['ErrorDescription']);
        }
        this.dataLoad = false;
      },
      error: (err: any) => { 
        this.dataLoad = false;
        this.toast.displayToast("Unable to fetch Settlement Payout Report");
       }
  });
  }
  setOrder(value: string) {
    this.reverse = !this.reverse;
    this.order = value;
    if (this.reverse) {
      this.ascending = false;
    } else {
      this.ascending = true;
    }
  }
  public searchText(txt:any) {
    if (txt) {
      this.searchValue = txt.trim();
      this.settlementPayoutReportList = this.settlementPayoutReportListCopy.filter((item:any) => {
        return item.ClientCode.toLowerCase().includes(this.searchValue.toLowerCase()) || item.GroupCode.toLowerCase().includes(this.searchValue.toLowerCase());
      });
    }
    else {
      this.settlementPayoutReportList = this.settlementPayoutReportListCopy;
    }
  }
  onExcelDownload() {
    this.commonService.setClevertapEvent('Settlement_Download_Clicked', { 'Login ID': localStorage.getItem('userId1') });
    if (this.settlementPayoutReportList && this.settlementPayoutReportList.length > 0) {
      this.dataLoad = true;
      let info:any = [];
      let head = [["Client Code", "Group Code", "Client Name", "Process Date", "Ledger Balance", "Tentative Payout Date", "Payout Value"]];
      this.settlementPayoutReportList.sort((a:any, b:any) => { return Date.parse(b.ProcessDate) - Date.parse(a.ProcessDate) });
      this.setOrder('ProcessDate');
      this.settlementPayoutReportList.forEach((element:any) => {
        info.push([element.ClientCode, element.GroupCode, element.ClientName, moment(element.ProcessDate).format('DD/MM/YYYY'), element.ledger_bal_two_decimal, moment(element.TentativePayoutDate).format('DD/MM/YYYY'), element.PayoutValue]);
      });
      this.commonService.exportDataToExcel(head[0], info, 'Settlement Payout Report');
      this.dataLoad = false;
    } else {
      this.toast.displayToast('No Data Found');
    }
  }
  goBack() {
    window.history.back();
  }
}
