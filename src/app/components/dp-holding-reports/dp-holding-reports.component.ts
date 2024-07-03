import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { Platform } from '@ionic/angular';
import { ShareReportService } from '../../pages/share-reports/share-report.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-dp-holding-reports',
  templateUrl: './dp-holding-reports.component.html',
  styleUrl: './dp-holding-reports.component.css',
  providers: [ ShareReportService]
})
export class DpHoldingReportsComponent implements OnInit, OnChanges {
  @Input() dpHoldingObj: any;
  public ascending: boolean = true;
  public dataLoad = false;
  public order:any;
  public isProd = environment['production'];
  reverse: boolean = false;
  public dpHoldingData: any = []
  tokenValue: any;
  private subscription: any;
  @Input() callFromDesktop: boolean = false;
  constructor(
    private storage: StorageServiceAAA,
    private toast: ToasterService,
    public commonService: CommonService,
    private platform: Platform, private shareReportSer: ShareReportService,
    private router: Router
  ) {
    router.events.forEach((event) => {
      this.platform.backButton.subscribeWithPriority(10, () => {
        window.history.back();
      });
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.platform.is('desktop') || this.callFromDesktop) {
      this.getDataFromStorage();
    }
  }
  ngOnInit() {
    if (!this.callFromDesktop) {
      this.dpHoldingObj = this.commonService.getData();
      if (localStorage.getItem('dpHoldingObjData')) {
        this.dpHoldingObj = JSON.parse(localStorage.getItem('dpHoldingObjData') || '{}');
      }
      this.getDataFromStorage();
    }
  }
  public getDataFromStorage() {
    this.dataLoad = true;
    this.storage.get('userType').then(type => {
      if (type === 'RM' || type === 'FAN') {
        this.storage.get('bToken').then(token => {
          this.storage.get('userID').then(ID => {
            this.tokenValue = token
            this.getData(token);
          })
        })
      } else {
        this.storage.get('subToken').then(token => {
          this.storage.get('userID').then(ID => {
            this.tokenValue = token
            this.getData(token);
          })
        })
      }
    })
  }
  public getData(token:any) {
    this.subscription = new Subscription();
    const passObj = {
      "DPID": this.dpHoldingObj.dpId,
      "AsOnDate": this.dpHoldingObj.AsOnDate,
      "DPType": this.dpHoldingObj.DPType
    };
    this.dpHoldingData = [];
    this.subscription.add(
      this.shareReportSer
        .getDPHoldingStatement(token, passObj)
        .subscribe((response:any) => {
          if (response['Head']['ErrorCode'] === 0) {
            this.dataLoad = false;
            const data = response['Body']['DpValue'];
            data.forEach((element:any) => {
              this.dpHoldingData.push({
                "ISIN": element['ISIN'],
                "ISINName": element['ISINName'],
                "Qty": +element['Qty'],
                "HoldingValue": +element['HoldingValue'],
                "ProductType": element['ProductType'],
                "BalanceType": element['BalanceType'],
              })
            })
          } else {
            this.dataLoad = false;
            this.dpHoldingData = [];
            this.toast.displayToast(response['Head']['ErrorDescription'])
          }
        })
    )
  }
  goBack() {
    window.history.back();
  }
  downloadReport(dtype:any) {
    this.subscription = new Subscription();
    this.dataLoad = true;
    let downloadObj = {}
    let type = this.dpHoldingObj.dpId.includes('IN') ? 'NSDL' : 'CDSL';
    if (type === 'CDSL') {
      downloadObj = {
        "rptId": "421",
        "clid": this.dpHoldingObj.dpId,
        "dtfrom": `${this.dpHoldingObj.AsOnDate.split('/')[1]}/${this.dpHoldingObj.AsOnDate.split('/')[0]}/${this.dpHoldingObj.AsOnDate.split('/')[2]}`,
        "dtto": `${this.dpHoldingObj.AsOnDate.split('/')[1]}/${this.dpHoldingObj.AsOnDate.split('/')[0]}/${this.dpHoldingObj.AsOnDate.split('/')[2]}`,
        "SendEmail": "N",
        "CallFrom": "AAA",
        "ReportFormat": dtype,
      }
    } else {
      if (this.dpHoldingObj.AsOnDate === moment().format('DD/MM/YYYY')) {
        downloadObj = {
          "rptId": "457",
          "clientCode": this.dpHoldingObj.dpId.slice(8, this.dpHoldingObj.dpId.length),
          "LoginId": localStorage.getItem('userId1'),
          "SendEmail": "N",
          "CallFrom": "AAA",
          "ReportFormat": dtype,
        }
      } else {
        downloadObj = {
          "rptId": "420",
          "FromClient": this.dpHoldingObj.dpId.slice(8, this.dpHoldingObj.dpId.length),
          "FromDate": `${this.dpHoldingObj.AsOnDate.split('/')[2]}${this.dpHoldingObj.AsOnDate.split('/')[0]}${this.dpHoldingObj.AsOnDate.split('/')[1]}`,
          "SendEmail": "N",
          "CallFrom": "AAA",
          "ReportFormat": dtype,
        }
      }
    }
    this.getDownloadData(this.tokenValue, downloadObj, dtype)
  }
  getDownloadData(token:any, obj:any, dtype:any) {
    this.subscription.add(
      this.shareReportSer
        .sharedDownloadReport(token, obj)
        .subscribe((res) => {
          this.dataLoad = false;
          this.commonService.downLoadReportFun(res, `DP_${this.dpHoldingObj.clientCode}`, dtype.toLowerCase())
        }))
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
}
