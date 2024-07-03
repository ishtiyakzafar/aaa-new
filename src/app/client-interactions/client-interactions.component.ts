import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '../helpers/toaster.service';
import * as moment from 'moment';
import { CommonService } from '../helpers/common.service';
import { InteractionsDetailsModalComponent } from '../interactions-details-modal/interactions-details-modal.component';
import { WireRequestService } from '../pages/wire-requests/wire-requests.service';
import { QueryDetailsModalComponent } from '../query-details-modal/query-details-modal.component';

@Component({
  selector: 'app-client-interactions',
  templateUrl: './client-interactions.component.html',
  styleUrls: ['./client-interactions.component.scss'],
})
export class ClientInteractionsComponent implements OnInit {

  public moment: any = moment;
  public equityBlockTabValue: string = "queries";
  public tableLoader: boolean = false;
  public clientData: any;
  public searchTermInteractions: any = null;
  public searchTermDetails: any = null;
  public ticketData: any;
  public searchText: any;
  public order: string = 'Date';
  public ordeBy: string = 'Created_Time';
  public reverse: boolean = false;
  public reverseOrder: boolean = false;
  public ascending: boolean = true;
  public ascendingOrder: boolean = true;
  public datas: any[] = [];
  public detailData: any=[];
  public interactionData: any=[];
  public queriesData: any = [];
  public interactionsData: any = [];

  constructor(public toast: ToasterService,private route: ActivatedRoute,private modalController: ModalController,private wireReqService: WireRequestService,private commonService: CommonService,) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if(params && params.id) {
          this.ticketData = params.id;
          localStorage.setItem('clientInteractionId',params.id);
        }
        else{
          this.ticketData = localStorage.getItem('clientInteractionId');
        }
      });
    this.apicallToken();
  }

  changeDetailsSearchText(event: any) {
		this.queriesData = this.detailData;
			this.queriesData = this.queriesData.filter((item: any) => {
				return item.Subject.toLowerCase().includes(event.toLowerCase());
			});
	}

  changeInteractionSearchText(event: any) {
		this.interactionsData = this.interactionData;
			this.interactionsData = this.interactionsData.filter((item: any) => {
				return item.Title.toLowerCase().includes(event.toLowerCase());
			});
	}

   setOrder(value: string){ 	
      if (value == 'Date') {
        this.order = value;
        localStorage.setItem('sortValue',value);
        this.reverseOrder = !this.reverseOrder;
        if (this.reverseOrder) {
          this.ascendingOrder = false;
        } else {
          this.ascendingOrder = true;
        }
		  }
    else{
      this.ordeBy = value;
      localStorage.setItem('sortValue',value);
      this.reverse = !this.reverse;
      if (this.reverse) {
        this.ascending = false;
      } else {
        this.ascending = true;
      }
    }
	}

  apicallToken(){
    this.wireReqService.getClientInteractionToken().subscribe((res: any) => {
      this.apiClientDetails(res['access_token'], this.ticketData);
      this.apiClientInteraction(res['access_token'], this.ticketData);
    });
  }

  apiClientDetails(cookievalue: any, ticketData: any){
    this.tableLoader = true;
    this.wireReqService.clientTicketDetails(cookievalue, ticketData).subscribe((res: any) => {
      this.tableLoader = false;
      if(res['Body'] && (res['Body'] != null || res['Body'].length != 0)){
        this.detailData = res['Body'];
        res['Body'].forEach((element: any) => {
          this.queriesData.push({
            Created_Time: element.Created_Time.slice(0,10),
            Closed_Date: element.Closed_Date.slice(0,10),
            Subject: element.Subject,
            Details: element.Details,
            Resolution: element.Resolution,
            Status: element.Status
          })
        })
        this.getStatus(this.queriesData);
      }
      if(res['Head'] && (res['Head']['ResponseCode'] == 1)){
        this.toast.displayToast(res['Head']['Description']);
      }
    });
  }

  apiClientInteraction(cookievalue: any, ticketData: any){
    this.tableLoader = true;
    this.wireReqService.clientInteractionDetails(cookievalue, ticketData).subscribe((res: any) => {
      this.tableLoader = false;
      if(res['Body'] && (res['Body'] != null || res['Body'].length != 0)){
        this.interactionData = res['Body'];
        res['Body'].forEach((element: any) => {
          this.interactionsData.push({
            Date: element.Date.slice(0,10),
            Type_of_Engagement: element.Type_of_Engagement,
            Title: element.Title,
            Description: element.Description
          })
        })
    }
    });
  }

  async displyPopupQueryDetails(obj: any) {
    const modal = this.modalController.create({
        component: QueryDetailsModalComponent,
        componentProps: {clientData: obj},
        cssClass: 'query_details_modal',
      backdropDismiss: true
      });
      return (await modal).present();
    } 
    async displyPopupInteractionsDetails(obj: any) {
      const modal = this.modalController.create({
          component: InteractionsDetailsModalComponent,
          componentProps: {clientData: obj},
          cssClass: 'interactions_details_modal',
        backdropDismiss: true
        });
        return (await modal).present();
      } 
      
      segmentTabChanged(val: any){
        this.equityBlockTabValue = val;
        this.searchTermInteractions = '';
        this.searchTermDetails = '';
        if(this.equityBlockTabValue == 'interactions'){
          //console.log('ctLast5interactions', 'Last5interactions_clicked');
          this.commonService.setClevertapEvent('Last5interactions_clicked', { 'PartnerCode': localStorage.getItem('userId1') });
        }
      }

      typeSearchTextDetails(event: any) {
        if (event != null) {
          this.changeDetailsSearchText(event);
        }
      }

      typeSearchTextInteractions(event: any) {
        if (event != null) {
          this.changeInteractionSearchText(event);
        }
      }

      goBack() {
        window.history.back();
      }

      getStatus(dataObj: any){
        for(let i=0 ; i<dataObj.length ; i++){
          if(dataObj[i].Status == 'Fresh Ticket' || dataObj[i].Status == 'Fresh Ticket -Karvy' || dataObj[i].Status == 'Fresh Ticket by AutoMata' || dataObj[i].Status == 'ReOpened' || dataObj[i].Status == 'Responded' || dataObj[i].Status == 'Responded by AutoMata' || dataObj[i].Status == 'Responded by CRM'){
            dataObj[i].StatusLabel = 'Open';
          }
        else if(dataObj[i].Status == 'Send To RM' || dataObj[i].Status == 'Fresh Ticket by AutoMata' || dataObj[i].Status == 'Send To Department' || dataObj[i].Status == 'Responded by AutoMata' || dataObj[i].Status == 'Responded by CRM' || dataObj[i].Status == 'Responded' || dataObj[i].Status == 'ReOpened' || dataObj[i].Status == 'WIP' || dataObj[i].Status == 'Fresh Ticket -Karvy'){
          dataObj[i].StatusLabel = 'WIP';
        }
        else if(dataObj[i].Status == 'FTR' || dataObj[i].Status == 'Resolved' || dataObj[i].Status == 'Invalid'){
          dataObj[i].StatusLabel = 'Closed';
        }
        else if(dataObj[i].Status == 'Send To Department'){
          dataObj[i].StatusLabel = 'Send To Department';
        }
        else if(dataObj[i].Status == 'Send To RM'){
          dataObj[i].StatusLabel = 'Send To RM';
        }
      };
      }

}
