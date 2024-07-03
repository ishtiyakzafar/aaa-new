import { Component, OnInit } from '@angular/core';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-manage-custom-mapping',
  providers: [DashBoardService],
  templateUrl: './manage-custom-mapping.html',
  styleUrls: ['./manage-custom-mapping.scss'],
})
export class ManageCustomMappingPage implements OnInit {

  private subscription: any;
  token: any;
  userType: any;
  userID: any;
  mappingType: string = 'Area';
  isClientSelected: boolean = false;
  clientList: any = [];
  loading!: boolean;
  selectedClient: any = [];
  clientData: any = [];


  constructor(
    private dashBoardService: DashBoardService, public toast: ToasterService, private router: Router
  ) { }

  ngOnInit() {
    this.fetchClientMappingData();
    if (localStorage.getItem('userType') == 'RM') {
      this.fetchClientMappingData();
    } else {
      this.router.navigate(['dashboard']);
    }
  }


  fetchClientMappingData() {
    if (this.selectedClient.length == 0) {
      this.loading = true;
    }

    this.subscription = new Subscription();

    let token = localStorage.getItem('brokerageToken');
    let userId1 = localStorage.getItem('userId1');

    this.subscription.add(
      this.dashBoardService.fetchWireMappedCode(this.mappingType, token, userId1)
        .subscribe((res: any) => {
          if (res['Head']['ErrorCode'] == 0) {
            let data = [];
            for (const item of res['Body']) {
              data.push({
                isChecked: false,
                clientCode: this.mappingType === 'Area' ? item.ParentCode : item.ChildCode,
                clientName: this.mappingType === 'Area' ? item.ParentName : item.ChildName,
                MakerId: item.MakerId,
                MakerDate: item.MakerDate,
                MapId: item.MapId,
              })
            }
            this.clientList = data;
            this.clientData = data;
            this.loading = false;
            this.selectedClient = [];
          } else {
            this.selectedClient = [];
            this.clientList = [];
            this.clientData = [];
            this.loading = false;
          }
        }, ({ error }) => this.loading = false)
    )
  }


  goBack() {
    window.history.back();
  }

  toggleMapping(value: any) {
    this.subscription = this.subscription.unsubscribe();  // cancle api request while changing tab
    this.selectedClient = [];
    this.mappingType = value;
    this.fetchClientMappingData();
  }

  selectClient(val: any) {
    if (!val.isChecked) {
      this.selectedClient = [...this.selectedClient, val];
    } else {
      this.selectedClient = this.selectedClient.filter((item: any) => item.clientCode !== val.clientCode)
    }
  }


  handleRemoveAccess() {
    let token = localStorage.getItem('brokerageToken');
    let userId1 = localStorage.getItem('userId1');

    let data = []

    for (const item of this.selectedClient) {
      data.push({
        "ParentCode": this.mappingType === 'Area' ? item.clientCode : userId1,
        "ChildCode": this.mappingType === 'Area' ? userId1 : item.clientCode,
        "MapId": item.MapId
      })
    }

    this.dashBoardService.deleteClientAccess(data, token)
      .subscribe((res: any) => {
        if (res['Head']['ErrorCode'] == 0) {
          this.fetchClientMappingData();
        } else {
          this.toast.displayToast(res['Head']['ErrorDescription']);
        }
      })
  }


  handleSearch(e: any) {
    let search = e.target.value;
    this.clientData = this.clientList.filter((item: any) =>
      item.clientCode.toLowerCase().includes(search.toLowerCase()) ||
      item.clientName.toLowerCase().includes(search.toLowerCase())
    )
  }

  ngOnDestroy() {
    this.subscription = this.subscription.unsubscribe();
  }

}
