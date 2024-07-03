import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import * as moment from 'moment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-epi-shares-status',
  templateUrl: './epi-shares-status.component.html',
  styleUrls: ['./epi-shares-status.component.scss'],
})
export class EpiSharesStatusComponent implements OnInit , OnChanges{
  @Input() epiReqStatusObj: any;
  moment: any = moment;
  dataLoad: boolean = false;
  epiRequestList: any[] = [];
  applyepiReqPage: boolean = false;
  ascending: boolean = true;
	public order: any;
	reverse: boolean = false;
  searchValue!: string;
  epiRequestListList: any = [];
  epiRequestListCopy: any = [];

  constructor(private modalController: ModalController, private router: Router, private storage: StorageServiceAAA, private wireReqService: WireRequestService,		private commonService: CommonService, private platform: Platform, public toast: ToasterService) { }

	ngOnChanges(changes: SimpleChanges): void {
		if (this.epiReqStatusObj.isDesktopCall) {
			this.epiReqStatusObj = this.commonService.getData() ? this.commonService.getData() : this.epiReqStatusObj;
			if (this.epiReqStatusObj) {
				this.InitEpiRequest();
			}
		}
	}

	ngOnInit() {
		this.epiReqStatusObj = this.commonService.getData() ? this.commonService.getData() : this.epiReqStatusObj;
		if (this.platform.is('mobile') && !(this.epiReqStatusObj && this.epiReqStatusObj.isDesktopCall)) {
			if (this.epiReqStatusObj) {
				this.InitEpiRequest();
			}
		}
	}

  InitEpiRequest() {
		this.epiRequestList = [];
		this.dataLoad = true;
		this.storage.get('userID').then((userID) => {

			this.storage.get('userType').then(type => {
				if (type === 'RM' || type === 'FAN') {
					this.storage.get('bToken').then(token => {
						//this.userIdValue = userID;
						//this.tokenValue = token;
						this.epiReqStatusList(token, userID)
					})
				} else {
					this.storage.get('subToken').then(token => {
						//this.userIdValue = userID;
						//this.tokenValue = token;
						this.epiReqStatusList(token, userID)
					})
				}

			})
		})
	}
  epiReqStatusList(token: any, userId: any) {
		this.searchValue = '';
    this.epiRequestList = [];
    this.epiRequestListCopy = [];
		this.wireReqService.getepiReqStatus(token, this.epiReqStatusObj, userId).subscribe((res: any) => {
			if (res['Head']['ErrorCode'] == 0) {
				if (res['Body'].length > 0) {
					this.epiRequestList = res['Body'];
          //console.log(this.epiRequestList)
          this.epiRequestListCopy = res['Body'];
          
				}
				else {
					this.applyepiReqPage = true;
				}
				setTimeout(() => {
					this.dataLoad = false;
				}, 500);

			}
			else {
				this.applyepiReqPage = true;
				setTimeout(() => {
					this.dataLoad = false;
				}, 500);
			}

		})

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

  public searchText(txt: any) {
    if (txt) {
        this.searchValue = txt.trim();
        this.epiRequestList = this.epiRequestListCopy.filter((item: any) => {
            return item.ClientCode.toLowerCase().includes(this.searchValue.toLowerCase());
        });
    }
    else {
      this.epiRequestList = this.epiRequestListCopy;
    }
  }

}
