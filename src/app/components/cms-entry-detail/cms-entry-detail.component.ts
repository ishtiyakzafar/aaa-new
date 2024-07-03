import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';


@Component({
    selector: 'app-cms-entry-detail',
    providers: [WireRequestService],
    templateUrl: './cms-entry-detail.component.html',
    styleUrls: ['./cms-entry-detail.component.scss'],
})
export class CmsEntryDetailComponent implements OnInit {
    public clientBlockSegmentValue: string = "all";
    public segmentButtonOption: any[] = [
        { name: 'All', value: 'all' },
        { name: 'Approved', value: 'approved' },
        { name: 'Rejected', value: 'rejected' }
    ]
    public datas: any[] = [
        {
            date: 'Jan 06 2021', time: '10:25 pm', clientName: 'Mahesh Ashok Raut', clientId: 'Ananya09', bank: 'Bank Of Baroda', accNum: '0128384962778',
            chequeOrDD: 'FY78983', amt: 50000, depositBank: 'SBI', status: 'Rejected', rejectionReason: '(Rejected due to the insufficient funds in the wallet)'
        },
        {
            date: 'Jan 06 2021', time: '10:25 pm', clientName: 'Mahesh Ashok Raut', clientId: 'Ananya09', bank: 'Bank Of Baroda', accNum: '0128384962778',
            chequeOrDD: 'FY78983', amt: 50000, depositBank: 'Bank of Baroda', status: 'Approved', rejectionReason: ''
        },
        {
            date: 'Jan 06 2021', time: '10:25 pm', clientName: 'Mahesh Ashok Raut', clientId: 'Ananya09', bank: 'Bank Of Baroda', accNum: '0128384962778',
            chequeOrDD: 'FY78983', amt: 50000, depositBank: 'State Bank of Maharashtra', status: 'Approved', rejectionReason: ''
        },
        {
            date: 'Jan 06 2021', time: '10:25 pm', clientName: 'Mahesh Ashok Raut', clientId: 'Ananya09', bank: 'Bank Of Baroda', accNum: '0128384962778',
            chequeOrDD: 'FY78983', amt: 50000, depositBank: 'SBI', status: 'Approved', rejectionReason: ''
        },
        {
            date: 'Jan 06 2021', time: '10:25 pm', clientName: 'Mahesh Ashok Raut', clientId: 'Ananya09', bank: 'Bank Of Baroda', accNum: '0128384962778',
            chequeOrDD: 'FY78983', amt: 50000, depositBank: 'SBI', status: 'Approved', rejectionReason: ''
        },
        {
            date: 'Jan 06 2021', time: '10:25 pm', clientName: 'Mahesh Ashok Raut', clientId: 'Ananya09', bank: 'Bank Of Baroda', accNum: '0128384962778',
            chequeOrDD: 'FY78983', amt: 50000, depositBank: 'SBI', status: 'Approved', rejectionReason: ''
        },
        {
            date: 'Jan 06 2021', time: '10:25 pm', clientName: 'Mahesh Ashok Raut', clientId: 'Ananya09', bank: 'Bank Of Baroda', accNum: '0128384962778',
            chequeOrDD: 'FY78983', amt: 50000, depositBank: 'SBI', status: 'Approved', rejectionReason: ''
        },
        {
            date: 'Jan 06 2021', time: '10:25 pm', clientName: 'Mahesh Ashok Raut', clientId: 'Ananya09', bank: 'Bank Of Baroda', accNum: '0128384962778',
            chequeOrDD: 'FY78983', amt: 50000, depositBank: 'SBI', status: 'Approved', rejectionReason: ''
        },
        {
            date: 'Jan 06 2021', time: '10:25 pm', clientName: 'Mahesh Ashok Raut', clientId: 'Ananya09', bank: 'Bank Of Baroda', accNum: '0128384962778',
            chequeOrDD: 'FY78983', amt: 50000, depositBank: 'SBI', status: 'Approved', rejectionReason: ''
        },
        {
            date: 'Jan 06 2021', time: '10:25 pm', clientName: 'Mahesh Ashok Raut', clientId: 'Ananya09', bank: 'Bank Of Baroda', accNum: '0128384962778',
            chequeOrDD: 'FY78983', amt: 50000, depositBank: 'SBI', status: 'Approved', rejectionReason: ''
        },
    ];
    equityCmsData:any[] = [];
    resetCmsData:any;
    searchCode:any;
    selectedClientCode:any;
    dataLoad:boolean = false;
    constructor(private route: ActivatedRoute, private storage: StorageServiceAAA, private wireReqService: WireRequestService) { }

    ngOnInit() { 
        this.route.params.subscribe((params) => {
            this.selectedClientCode = params["id"];
            this.storage.get('userID').then((userID) => {
                this.storage.get('userType').then(type => {
                    if (type === 'RM' || type === 'FAN') {
                        this.storage.get('bToken').then(token => {
                            this.getEquityCmsList(token, this.selectedClientCode, userID, type)
                        })
                    } else {
                        this.storage.get('subToken').then(token => {
                            this.getEquityCmsList(token, this.selectedClientCode, userID, type)
                        })
                    }
                })
            })
           
        })
        // this.cmsEntryDetails = JSON.parse(localStorage.getItem("equityListMobile"));
        // this.resetCmsData = JSON.parse(localStorage.getItem("equityListMobile"));
        // console.log(this.cmsEntryDetails);
    }

      
    getEquityCmsList(token: any, clientId: any, userId: any, type: any){
        this.dataLoad = false;
        this.wireReqService.getEquityCms(token, clientId, userId, type).subscribe((res) => {
            this.dataLoad = true;
			if(res['Head']['ErrorCode'] == 0){
                if(res['Body']['EquiStatus'].length > 0){
                    this.equityCmsData = res['Body']['EquiStatus'];
                    this.resetCmsData = res['Body']['EquiStatus']
                    // console.log(this.equityCmsData);
                }
                else{
                    this.equityCmsData = [];
                }
             
			}
			else{
                this.equityCmsData = [];
			}
        })
	}

    segmentChange(event: any) {
        this.equityCmsData = this.resetCmsData;
        // console.log(event);
        if(event == 'approved'){
            this.equityCmsData = this.equityCmsData.filter(function (el) {
                return el.BranchStatus == "A"
            });
        }
        else if(event == 'rejected'){
            this.equityCmsData = this.equityCmsData.filter(function (el) {
                return el.BranchStatus == "R"
            });
        }
       
    }

    goBack() {
        window.history.back();
    }

}
