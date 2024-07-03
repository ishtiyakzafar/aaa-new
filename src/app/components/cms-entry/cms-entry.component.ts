import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { ModalController, Platform } from '@ionic/angular';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
    selector: 'app-cms-entry',
    providers: [WireRequestService, ToasterService],
    templateUrl: './cms-entry.component.html',
    styleUrls: ['./cms-entry.component.scss'],
})
export class CmsEntryComponent implements OnInit, OnChanges {
    @Input() passClientId: any;
    @Input() depositAcc: any;
    @Input() bankList: any;
    @Input() equityCmsData: any;
    @Input() isDesktop: any;
    public dataLoad:boolean =  false;
    public dataLoad1:boolean =  false;
    public uniqueName!: string;
    public checkDDNameDisplay: any = null;
    slipNameDisplay: any = null;
    cmsEntry:any = {}
    accNoList: any[] = [];
    pdfImageError: any = null;
    despositFieldErr: any = null;
    clientCodeList:any;
    formSubmit:boolean = false;
    // clientCodeList: any[] = [
    //     { key: 'INVESTOR', productType: "Investor Plan (Online Plus)" },
    //     { key: 'PREMIUMP', productType: "Premium Plan (Dedicated RM)" },
    //     { key: 'SUPERTRD', productType: "Super Trader Plan (Pro Traders)" },
    //     { key: 'IIFLFIT', productType: "Z20 Plan" },
    // ]
    public clientBlockSegmentValue: string = "all";
    public segmentButtonOption: any[] = [
        { name: 'All', value: 'all' },
        { name: 'Approved', value: 'approved' },
        { name: 'Rejected', value: 'rejected' }
    ]

    public depositTypes: any[] = [
        { name: 'Cheque'},
        { name: 'DD Letter'},
    ]

    public clearingTypes: any[] = [
        { name: 'Local'},
        { name: 'Outstation'},
    ]

    public items: any[] = [
        { name: 'Cheque/DD Letter'},
        { name: 'Deposit Slip'},
    ]
    public FileList:any[] = []
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
    fileToUpload: File | null = null;
    equiStatusList:any[] = [];
    bankDetail:any[] = [];
    msgDisplay:String = 'Please Select the Client ID'
    chequeUploadImg:any;
    depositSlipUpload:any;
    resetCmsData:any;
    searchCode:any;
    accName:any;
    clientBankName: any;
    //@Output() onClose = new EventEmitter();


    constructor(private router: Router,private storage: StorageServiceAAA, private wireReqService: WireRequestService, private platform: Platform, public toast: ToasterService) { }
    
    ngOnChanges(changes: SimpleChanges): void {
        if (this.platform.is('desktop') || this.isDesktop) {
            // console.log(this.passClientId);
            if(this.passClientId != null){
                this.bankDetail = [];
                this.cmsEntry.clientBank = null;
                this.accName = null;
                this.clientBankName = null;
                this.initChangeClientId(this.passClientId)
            }
        }
    }

    changeClientId(event: any){
        if (!this.platform.is('desktop')) {
            this.passClientId = event.ClientCode
                this.initChangeClientId(this.passClientId)
        }
    }

    ngOnInit() { 
        if (!this.platform.is('desktop')) {
            this.cmsEntry.clientBank = null;
            this.bankDetail = [];
            this.accName = null;
           // this.clientCodeList = JSON.parse(localStorage.getItem("clientListWireRequest"));
           this.storage.get('setClientCodes').then((clientCodes) => {
			    this.clientCodeList = clientCodes;
		    })
            this.depositAcc = JSON.parse(localStorage.getItem("depositBank") || "{}");
        }
    }
    
    initChangeClientId(clientId: any){
        this.equityCmsData = [];
       
        this.storage.get('userID').then((userID) => {
        this.storage.get('userType').then(type => {
            if (type === 'RM' || type === 'FAN') {
                this.storage.get('bToken').then(token => {
                    this.bankDetailsList(token, clientId);
                    this.getEquityCmsList(token, clientId, userID, type)

                })
            } else {
                this.storage.get('subToken').then(token => {
                    this.bankDetailsList(token, clientId);
                    this.getEquityCmsList(token, clientId, userID, type)
                })
            }
        })
    })

    }

    bankDetailsList(token: any, clientId: any){
         this.dataLoad = true;
		this.bankDetail = [];
        this.accNoList = [];
        this.clientBankName = null;
		var obj =  {"UserCode": clientId,"UserType": "4"}
		this.wireReqService.getProfileDetails(token, obj).subscribe((res: any) => {
            this.dataLoad = false;
			if(res['Head']['ErrorCode'] == 0){
				this.bankDetail = res['Body']['Bank'];
			}
            // console.log(res)	
		})
    }

    changeClientBank(event: any){
        this.cmsEntry.clientBank = null;
        this.accNoList.push({accName: event.AccountNo1});
        this.accName = event.AccountNo1;
    }

    changeAccNo(event: any){
        this.accName = event.accName;
    }
    
    getEquityCmsList(token: any, clientId: any, userId: any, type: any){
        this.dataLoad1 = true;
        this.wireReqService.getEquityCms(token, clientId, userId, type).subscribe((res) => {
            this.dataLoad1 = false;
			if(res['Head']['ErrorCode'] == 0){
                if(res['Body']['EquiStatus'].length > 0){
                    this.equityCmsData = res['Body']['EquiStatus'];
                    this.resetCmsData = res['Body']['EquiStatus']
                    // console.log(this.equityCmsData);
                }
                else{
                    this.equityCmsData = [];
                    this.msgDisplay = "No Data Found" 
                }
             
			}
			else{
                this.equityCmsData = [];
                this.msgDisplay = "No Data Found"
			}
        })
	}

  

    goBack() {
        window.history.back();
    }

    submitForm(form: any){
        this.formSubmit = true
       // this.detail();
        // console.log(form);
        // if(form == false){
        //     return;
        // }
        // else
        if(this.checkDDNameDisplay == null){
            this.toast.displayToast('Please Upload Cheque/DD Image');
            return;
        }
        this.dataLoad = true;
        this.storage.get('userID').then((userID) => {
            this.storage.get('userType').then(type => {
                    if (type === 'RM' || type === 'FAN') {
                        this.storage.get('bToken').then(token => {
                            this.cmsFormRequest(token, userID, type)
                        })
                    } else {
                        this.storage.get('subToken').then(token => {
                            this.cmsFormRequest(token, userID, type)
                        })
                    }
            })
            
          })

    }

    cmsFormRequest(token: any, userId: any, userType: any){
        // console.log(this.cmsEntry.depositType)
        let pdfObj = {}
        if(this.cmsEntry.depositType == 'Cheque'){
           
            pdfObj = {
                "ChQImg": this.chequeUploadImg.split(',')[1],
                "ddletter": ""
            }
        }
        else if(this.cmsEntry.depositType == 'DD Letter'){
             pdfObj = {
                "ChQImg":"",
                'ddletter': this.chequeUploadImg.split(',')[1]
            }
        }
        let FormObj = {
            "ProductType": "EQ",
            "UserType": userType == "RM" ? "1" : userType == "FAN" ? "2" : "3",
            "ClientID": this.passClientId,
            "UserID": userId,
            // "ChQImg": "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AQIaAAACBDQAAAQIaAAACBDQAAAQIKABACBAQAMAQICABgCAAAENAAABAhoAAAIENAAABAhoAAAIENAAABAgoAEAIEBAAwBAgIAGAIAAAQ0AAAECGgAAAgQ0AAAECGgAAAgQ0AAAECCgAQAgQEADAECAgAYAgAABDQAAAQIaAAACBDQAAAQIaAAACBDQAAAQIKABACBAQAMAQICABgCAAAENAAABAhoAAAIENAAABAhoAAAIENAAABAgoAEAIEBAAwBAgIAGAIAAAQ0AAAECGgAAAgQ0AAAECGgAAAgQ0AAAECCgAQAgQEADAECAgAYAgAABDQAAAQIaAAACBDQAAAQIaAAACBDQAAAQIKABACBAQAMAQICABgCAAAENAAABAhoAAAIENAAABAhoAAAIENAAABAgoAEAIEBAAwBAgIAGAIAAAQ0AAAECGgAAAgQ0AAAECGgAAAgQ0AAAECCgAQAgQEADAECAgAYAgAABDQAAAQIaAAACBDQAAAQIaAAACBDQAAAQIKABACBAQAMAQICABgCAAAENAAABAhoAAAIENAAABAhoAAAIENAAABAgoAEAIEBAAwBAgIAGAIAAAQ0AAAECGgAAAgQ0AAAECGgAAAgQ0AAAECCgAQAgQEADAECAgAYAgAABDQAAAQIaAAACBDQAAAQIaAAACBDQAAAQIKABACBAQAMAQICABgCAAAENAAABAhoAAAIENAAABAhoAAAIENAAABAgoAEAIEBAAwBAgIAGAIAAAQ0AAAECGgAAAgQ0AAAECGgAAAgQ0AAAECCgAQAgQEADAECAgAYAgAABDQAAAQIaAAACBDQAAAQIaAAACBDQAAAQIKABACBAQAMAQICABgCAAAENAAABAhoAAAIENAAABAhoAAAIENAAABAgoAEAIEBAAwBAgIAGAIAAAQ0AAAECGgAAAgQ0AAAECGgAAAgQ0AAAECCgAQAgQEADAECAgAYAgAABDQAAAQIaAAACBDQAAAQIaAAACBDQAAAQIKABACBAQAMAwG/7++//A3tUU7guIDHoAAAAAElFTkSuQmCC",
            "Depositbank": this.cmsEntry.depositList,
            // "DepositSlip": "",
            // "ddletter": "",
            "Selfdl": "",
            "DepositSlip": this.depositSlipUpload ? this.depositSlipUpload.split(',')[1] : '',
            "clearing": this.cmsEntry.clearingType,
            "Amt": this.cmsEntry.amount,
            "Chqno": this.cmsEntry.chequeDd,
            "DraweeBank": this.clientBankName,
            "acctno": this.accName,
            "instrument": this.cmsEntry.depositType
          }

          let obj = {...FormObj, ...pdfObj}

        //   console.log(obj);
        this.wireReqService.saveEquityCms(token, obj).subscribe((res) => {
            // console.log(res);
            this.dataLoad = false;
           
            if(res['Head']['ErrorCode'] == 0 && res['Body']['Status'] == 'Success'){
                this.toast.displayToast('The Entry has been Added Successfully');
                setTimeout(() => {
                    this.cmsEntry = {
                        depositList: null,
                        clientBank: null,
                        depositType:null,
                    }
                    this.passClientId = ''
                    this.checkDDNameDisplay = null
                    this.slipNameDisplay = null
                    this.formSubmit = false;
                }, 500);
                this.storage.get('userID').then((userID) => {
                this.storage.get('userType').then(type => {
                    if (type === 'RM' || type === 'FAN') {
                        this.storage.get('bToken').then(token => {
                            this.getEquityCmsList(token, this.passClientId, userID, type)
        
                        })
                    } else {
                        this.storage.get('subToken').then(token => {
                            this.getEquityCmsList(token, this.passClientId, userID, type)
                        })
                    }
                    })
                })
                if (!this.platform.is('desktop')) {
                    setTimeout(() => {
                        this.detail()
                    }, 1000);
                    
                }
            }
            else{
                this.toast.displayToast(res['Head']['ErrorDescription']);
            }

        })
    }

    // move to detail page
    detail() {
        localStorage.setItem('equityListMobile', JSON.stringify(this.equityCmsData))
        this.router.navigate(['/cms-entry-detail', this.passClientId]);
    }

    segmentChange(event: any) {
        this.equityCmsData = this.resetCmsData;
        // console.log(event);
        if(this.equityCmsData){
            if(event == 'approved'){
                this.equityCmsData = this.equityCmsData.filter(function (el: any) {
                    return el.BranchStatus == "A"
                });
            }
            else if(event == 'rejected'){
                this.equityCmsData = this.equityCmsData.filter(function (el: any) {
                    return el.BranchStatus == "R"
                });
            }
        }
       
    }

    changeDepositType(event: any){
        this.checkDDNameDisplay = null; 
    }

    handleFileInput(files: any){

        // review. removed $event.target.files from html
        files = files.target.files;
        // console.log('1')
        this.checkDDNameDisplay = files[0].name;
            if ((files[0].type).includes("image/jpeg") || (files[0].type).includes("image/jpeg")) {
                if(files[0].size > 1000000){
                    this.pdfImageError = 'Image should be less than 1 MB';
                    this.checkDDNameDisplay = null;
                    return false;
                }
                this.pdfImageError = null;
                const reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onload = () => {
                    // console.log(reader.result);
                    this.chequeUploadImg = reader.result
                   // this.fileTobase64 = reader.result
                };
                
            }
            else{
                this.pdfImageError = 'Only jpeg and jpg files are allowed';
                this.checkDDNameDisplay = null;
                return false;
            }
        return;
    }

    handleFileInput1(files1: any){

        // review removed $event.target.files from html.
        files1 = files1.target.files;
        // console.log(files1)
        this.slipNameDisplay = files1[0].name;
        if ((files1[0].type).includes("image/jpeg") || (files1[0].type).includes("image/jpg") ) {
            if(files1[0].size > 1000000){
                this.despositFieldErr = 'Image should be less than 1 MB';
                this.slipNameDisplay = null;
                return false;
            }
            this.despositFieldErr = null;
            const reader = new FileReader();
            reader.readAsDataURL(files1[0]);
            reader.onload = () => {
                // console.log(reader.result);
                this.depositSlipUpload = reader.result
                
               // this.fileTobase64 = reader.result
            };
            
        }
        else{
            this.despositFieldErr = 'Only jpeg and jpg files are allowed';
            this.slipNameDisplay = null;
            return false;
        }
        return;
    }
}
