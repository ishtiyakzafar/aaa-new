import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { DateSortingPipe } from '../../helpers/date-sorting.pipe';
import { ToasterService } from '../../helpers/toaster.service';
import { CommonService } from '../../helpers/common.service';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-vas-detailed-report',
  templateUrl: './vas-detailed-report.component.html',
  styleUrls: ['./vas-detailed-report.component.scss'],
})
export class VasDetailedReportComponent implements OnInit {

  dataLoad = false;
  vasReportData: any[] = [];
  clonedArr: any[] = [];
  public order: string = 'StartDate';
  public reverse: boolean = false;
  public ascendingOrder: boolean = true;
  public val: string = 'asc';
  public dateSorting: any = DateSortingPipe;
  searchValue:any;

  constructor(public toast: ToasterService,private commonService: CommonService,private wireReqService: WireRequestService,private storage: StorageServiceAAA) { }

  ngOnInit() {
    this.storage.get('userType').then(type => {
      if (type === 'RM' || type === 'FAN') {
        this.storage.get('bToken').then(token => {
          this.getVASData(token);
        })
      } else {
        this.storage.get('subToken').then(token => {
          this.getVASData(token);
        })
      }
    });
  }
  goBack() {
    window.history.back();
  }
  getVASData(token: any){
    this.commonService.setClevertapEvent('Summaries_vasdetailed', { 'Login ID': localStorage.getItem('userId1') });
    this.commonService.setClevertapEvent('VAS_Report_Clicked', { 'Login ID': localStorage.getItem('userId1') });
    this.dataLoad = true;

    this.wireReqService.getVasDetailedReport(token).subscribe((res: any) => {
      this.dataLoad = false;
        if(res['Head']['ErrorCode'] == 0){
           this.vasReportData = res['Body'];
           this.clonedArr = res['Body'];
        }
      });
  }

  setOrder(value: string){ 	
    this.order = value;
    this.reverse = !this.reverse;
    if (this.reverse) {
      this.ascendingOrder = false;
      this.val = 'desc';
    } else {
      this.ascendingOrder = true;
      this.val = 'asc';
    }
}

formatChange(date: any){
  return moment(date).format('DD/MM/YYYY');
}

downloadReport() {
  this.commonService.setClevertapEvent('Summaries_vasdetailed', { 'Login ID': localStorage.getItem('userId1') });
  this.commonService.setClevertapEvent('VAS_Download_Clicked', { 'Login ID': localStorage.getItem('userId1') });
  if (this.vasReportData.length > 0) {
      let info = [];
      let head = [["ClientCode", "SchemeType", "SchemeName", "TargetSegment", "StartDate", "EndDate", "LastReversalDate", "OfferAmount", "RegAmount", "UtilizedAmount", "IsOver", "IntroducerCode", "IsCanceled", "GroupCode"]];

      for(let i=0; i<this.vasReportData.length;i++){
        info.push([this.vasReportData[i]['ClientCode'], this.vasReportData[i]['SchemeType'], this.vasReportData[i]['SchemeName'], this.vasReportData[i]['TargetSegment'], this.vasReportData[i]['StartDate'],this.vasReportData[i]['EndDate'],this.vasReportData[i]['LastReversalDate'],this.vasReportData[i]['OfferAmount'],this.vasReportData[i]['RegAmount'],this.vasReportData[i]['UtilizedAmount'],this.vasReportData[i]['IsOver'],this.vasReportData[i]['IntroducerCode'],this.vasReportData[i]['IsCanceled'],this.vasReportData[i]['GroupCode']]);
      }
      
      this.commonService.exportDataToExcel(head[0], info, 'VAS Detailed Report');
  } else {
      this.toast.displayToast('No Data Found');
  }
}

public searchText(txt: any) {
  if (txt) {
      this.searchValue = txt.trim();
      this.vasReportData = this.clonedArr.filter((item) => {
          return item.ClientCode.toLowerCase().includes(this.searchValue.toLowerCase()) || item.GroupCode.toLowerCase().includes(this.searchValue.toLowerCase());
      });
  }
  else {
    this.vasReportData = this.clonedArr;
  }
}

}
