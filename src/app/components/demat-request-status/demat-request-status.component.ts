import { Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import * as moment from "moment";
import { Platform } from "@ionic/angular";
import { ToasterService } from "../../helpers/toaster.service";
import { WireRequestService } from "../../pages/wire-requests/wire-requests.service";
import { CommonService } from "../../helpers/common.service";
import { StorageServiceAAA } from "../../helpers/aaa-storage.service";

@Component({
    selector: "app-demat-request-status",
    templateUrl: "./demat-request-status.component.html",
    styleUrls: ["./demat-request-status.component.scss"],
})
export class DematRequestStatusComponent implements OnChanges, OnInit {
    @Input() dpType!: string;
    public ascending!: boolean;
    public dataLoad = true;
    public order: any;
    reverse: boolean = false;
    searchValue!: string;
    dematRequestStatus: any = [];
    dematRequestStatusCopy: any = [];
    public moment: any = moment;
    searchCode: any;

    constructor(
        private storage: StorageServiceAAA,
        private platform: Platform,
        private toast: ToasterService,
        private wireReqService: WireRequestService,
        public commonService: CommonService
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('dematDpType') && !this.platform.is('desktop')) {
            this.dpType = JSON.parse(localStorage.getItem('dematDpType') || '{}')
            this.getDematRequestStatus();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('fellooo')
        if (this.platform.is('desktop') || (this.dpType)) {
            this.getDematRequestStatus();
        }
    }

    getDematRequestStatus = () => {
        this.dataLoad = true;
        this.searchValue = '';
        this.storage.get('userID').then((userId) => {
            this.storage.get('userType').then(type => {
                if (type === 'RM' || type === 'FAN') {
                    this.storage.get('bToken').then(token => {
                        this.fetchDematRequestStatus(token, userId);
                    })
                } else {
                    this.storage.get('subToken').then(token => {
                        this.fetchDematRequestStatus(token, userId);
                    });
                }
            })
        });
    }


    dropClick(id: any, arr: any) {
        arr.forEach((element: any, ind: any) => {
            if (id !== element.DRFNo) {
                element["isVisible"] = false;
            } else {
                element["isVisible"] = element["isVisible"] ? false : true;
            }
        });
    }

    public searchText(txt: any) {
        if (txt) {
            this.searchValue = txt.trim();
            this.dematRequestStatus = this.dematRequestStatusCopy.filter((item: any) => {
                return (
                    item.ClientCode.toLowerCase().includes(
                        this.searchValue.toLowerCase()
                    ) || item.DRFNo.includes(this.searchValue)
                );
            });
        } else {
            this.dematRequestStatus = this.dematRequestStatusCopy;
        }
    }

    fetchDematRequestStatus = (token: any, userId: any) => {
        this.commonService.setClevertapEvent('DRFStatus_Clicked', { 'Login ID': localStorage.getItem('userId1') });
        this.dematRequestStatus = [];
        this.wireReqService.getDematRequestStatus(token, userId).subscribe(
            (res: any) => {
                if (res["Head"]["ErrorCode"] == 0) {
                    if (res["Body"].length > 0) {
                        this.dematRequestStatus = res["Body"];
                        this.dematRequestStatusCopy = res['Body'];
                        if (this.dpType !== 'ALL') {
                            this.dematRequestStatus = res['Body'].filter((item: any) => item.DPType == this.dpType);
                            this.dematRequestStatusCopy = res['Body'].filter((item: any) => item.DPType == this.dpType);
                        }
                    }
                } else {
                    this.toast.displayToast(res["Head"]["ErrorDescription"]);
                }
                this.dataLoad = false;
            },
            (error: any) => {
                this.dataLoad = false;
                this.toast.displayToast("Unable to fetch Demat Request Status");
            }
        );
    };

    onExcelDownload() {
        this.commonService.setClevertapEvent('DRFStatus_Download', { 'Login ID': localStorage.getItem('userId1') });
        if (this.dematRequestStatus && this.dematRequestStatus.length > 0) {
            this.dataLoad = true;
            let info: any = [];
            let head: any = [
                [
                    "DRF No",
                    "DP Type",
                    "Client Code",
                    "Group Code",
                    "Demat a/c Number",
                    "ISIN",
                    "DRF Status",
                    "ISIN Name",
                    "Qty",
                    "DRN",
                    "DRN Generation Date",
                    "DRN Confirmed Date",
                    "DRF Rejected Date",
                    "DRF Rejected Reason",
                    "DP Remark",
                ],
            ];

            this.dematRequestStatus.forEach((e: any) => {
                info.push([
                    e.DRFNo,
                    e.DPType,
                    e.ClientCode,
                    e.GroupCode,
                    e.DematActNo,
                    e.ISIN,
                    e.DRFStatus,
                    e.ISINName,
                    e.Qty,
                    e.DRN ? e.DRN : "-",
                    e.DRNGenerationDate,
                    e.DRNConfirmationDate,
                    e.DRFRejectDate,
                    e.DRFRejectedReason,
                    e.DPRemark,
                ]);
            });
            this.commonService.exportDataToExcel(
                head[0],
                info,
                "Demat Request Status"
            );
            this.dataLoad = false;
        } else {
            this.toast.displayToast("No Data Found");
        }
    }
    goBack() {
        window.history.back();
    }
}
