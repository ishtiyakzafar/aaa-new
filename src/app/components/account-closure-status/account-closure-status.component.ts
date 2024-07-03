import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Platform } from "@ionic/angular";
import moment from "moment";
import { StorageServiceAAA } from "../../helpers/aaa-storage.service";
import { CommonService } from "../../helpers/common.service";
import { ToasterService } from "../../helpers/toaster.service";
import { WireRequestService } from "../../pages/wire-requests/wire-requests.service";

@Component({
  selector: 'app-account-closure-status',
  templateUrl: './account-closure-status.component.html',
  styleUrls: ['./account-closure-status.component.scss'],
})
export class AccountClosureStatusComponent implements OnChanges {

  @Input() fromDate: any;
  @Input() toDate: any;
  public ascending!: boolean;
  public dataLoad = false;
  public order: any;
  reverse: boolean = false;
  searchValue!: string;
  accountClosureStatusList: any = [];
  accountClosureStatusListCopy: any = [];
  collapsed: boolean[] = [];
  public moment: any = moment;
  previousIndex!: number;
  public val: string = 'asc';

  constructor(private storage: StorageServiceAAA,
    private platform: Platform,
    private toast: ToasterService,
    private wireReqService: WireRequestService,
    public commonService: CommonService) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.platform.is('desktop') && this.fromDate && this.toDate) {

      this.getAccountCloserStatus();
    }
  }

  getAccountCloserStatus = () => {
    this.dataLoad = true;
    this.searchValue = '';
    this.storage.get('userID').then((userId) => {
      this.storage.get('userType').then(type => {
        if (type === 'RM' || type === 'FAN') {
          this.storage.get('bToken').then(token => {

            this.storage.get('cookieValue').then(cookie => {
              if (cookie) {
                this.callAccountClosureStatus(`${token};${cookie.split(';')[0]}`, userId);
              }
            })
          })
        } else {
          this.storage.get('subToken').then(token => {

            this.storage.get('cookieValue').then(cookie => {
              this.callAccountClosureStatus(`${token};${cookie.split(';')[0]}`, userId);
            })
          })
        }
      })
    });
  }

  callAccountClosureStatus = (token: any, userId: any) => {
    this.commonService.setClevertapEvent('Report_Clicked', { 'Login ID': localStorage.getItem('userId1'), 'Report Name': 'Account Closure' });

    this.accountClosureStatusList = [];
    this.accountClosureStatusListCopy = [];

    const from_date = moment(this.fromDate).format('MM/DD/YYYY');
    const to_date = moment(this.toDate).format('MM/DD/YYYY');

    this.wireReqService.getAccountClosureStatus(token, userId, from_date, to_date).subscribe((res: any) => {
      if (res['Head']['ErrorCode'] == 0) {

        if (res['Body'].length > 0) {

          this.accountClosureStatusList = res['Body'];
          this.accountClosureStatusList.forEach((e: any) => {
            e.LetterRecvDate = new Date(`${e.LetterRecvDate.split('/')[1]}/${e.LetterRecvDate.split('/')[0]}/${e.LetterRecvDate.split('/')[2]}`);
          });
          console.log( this.accountClosureStatusList)
          this.accountClosureStatusListCopy = res['Body'];
        }
      } else {

        this.toast.displayToast(res['Head']['ErrorDescription']);
      }
      this.dataLoad = false;
    }, (error: any) => {
      this.dataLoad = false;
      this.toast.displayToast("Unable to fetch DP Modifiction Details");
    });
  }

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

  onCollapse(i: any) {

    if (this.previousIndex === i) {
      this.collapsed[i] = !this.collapsed[i];
    } else {
      this.collapsed[this.previousIndex] = false; //null;
      this.collapsed[i] = !this.collapsed[i];
      this.previousIndex = i;
    }
  }

  public searchText(txt: any) {
    if (txt) {
      this.searchValue = txt.trim();
      this.accountClosureStatusList = this.accountClosureStatusListCopy.filter((item: any) => {
        return item.ClientCode.toLowerCase().includes(this.searchValue.toLowerCase()) || item.DpId.toLowerCase().includes(this.searchValue.toLowerCase());
      });
    }
    else {
      this.accountClosureStatusList = this.accountClosureStatusListCopy;
    }
  }
  /**
   * On click of pdf/excel icon
   */
  onPdfExcelDownload(type: any) {
    this.commonService.setClevertapEvent('Report_Download', { 'Login ID': localStorage.getItem('userId1'), 'Report Name': 'Account Closure' });
    if (this.accountClosureStatusList && this.accountClosureStatusList.length > 0) {
      this.dataLoad = true;
      let info: any = [];
      let head = [["Client Code", "DP ID", "Letter Receive Date", "Closure For", "Customer Care", "Customer Care Remark", "Back Office Status", "BO Remark", "DP Status", "DP Remark", "Accounts Status", "Account Closure Date"]];
      this.accountClosureStatusList.sort((a: any, b: any) => { return Date.parse(b.LetterRecvDate) - Date.parse(a.LetterRecvDate) });
      this.setOrder('LetterRecvDate');
      this.accountClosureStatusList.forEach((element: any) => {
        info.push([element.ClientCode, element.DpId, moment(element.LetterRecvDate).format('DD/MM/YYYY'), element.ClosureFor, element.CustomerCare, element.RemarkCC, element.BackOfficeStatus, element.RemarkBO, element.DpStatus, element.RemarkDp, element.AccountStatus, element.AccountClosureDate]);
      });
      if (type === 'pdf') {
        this.commonService.savePdfFile(head, info);
        this.dataLoad = false;
      } else {
        this.commonService.exportDataToExcel(head[0], info, 'Account Closure Status');
        this.dataLoad = false;
      }
    } else {
      this.toast.displayToast('No Data Found');
    }
  }

}
