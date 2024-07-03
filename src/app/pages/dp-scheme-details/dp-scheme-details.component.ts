import { Component, Input, OnInit } from '@angular/core';
import { WireRequestService } from '../wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-dp-scheme-details',
  templateUrl: './dp-scheme-details.component.html',
  styleUrls: ['./dp-scheme-details.component.scss'],
})
export class DpSchemeDetailsComponent implements OnInit {

  @Input() clientCode: any;
  loginToken!: string;
  loggedinUserID: any;
  dpSchemeDetails: any = [];
  dataArray: any = [];
  showtable: boolean[] = [];
  showdown: boolean[] = [];
  showup: boolean[] = [];
  dataLoad!: boolean;
  showLoader!: boolean;
  showNoData: boolean = false;
  dematNumber:string[]=[]
  constructor(private wireReqService: WireRequestService, private storage: StorageServiceAAA) { }



  ngOnInit() {
    // this.storage.get('userType').then(
    //   type => {

    //   })
    this.storage.get('bToken').then(token => {


      this.loginToken = token;
    })
    this.storage.get('userID').then(userID => {


      this.loggedinUserID = userID;
      this.showLoader = true;

      this.wireReqService.getDPSchemeCharges(this.clientCode, this.loginToken, this.loggedinUserID)
        .subscribe(res => {
          this.dpSchemeDetails = res;

          if (this.dpSchemeDetails['Body'] != null) {
            this.dataArray = this.dpSchemeDetails['Body']['DPDetails']
            for(var i=0;i< this.dataArray.length;i++){
              this.dematNumber[i]=this.dataArray[i].DematActNo;
              this.dematNumber[i]=this.dematNumber[i].replace(/(\d{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'')
              
            }
          }
          else {
            this.showNoData = true;
          }
          this.showLoader = false;
        })
    })
  }
  toggle(i: any) {
    this.showtable[i] = !this.showtable[i];

  }

}
