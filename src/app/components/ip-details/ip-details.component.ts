import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { isEmpty } from 'lodash';

@Component({
    selector: 'app-ipdetails',
    templateUrl: './ip-details.component.html',
    styleUrls: ['./ip-details.component.scss'],
})
export class IPDetailsComponent implements OnInit {
    @Input() datas: any;
    reason: any = '';
    staticIp: any;
    address: any;
    public partnerList: any[] = [];
    partnerId: any;
    tokenValue: any;
    partnerData: any;
    noPId = false;
    isDisableIP = true;
    fileError: any;
    fileTitle: any;
    isUpload = false;
    public filename: any = [];
    public selectedFile: any;
    constructor(private modalController: ModalController, private commonService: CommonService, private toast: ToasterService, private storageService: StorageServiceAAA) { }

    ngOnInit() {
        this.storageService.get('userType').then(type => {
            if (type === 'RM' || type === 'FAN') {
                this.storageService.get('bToken').then(token => {
                    this.tokenValue = token
                    this.getPartnerList(token);
                })
            } else {
                this.storageService.get('subToken').then(token => {
                    this.tokenValue = token
                    this.getPartnerList(token);
                })
            }
        })
    }

    getPartnerList(token?: any) {
        let data = {
            "LoginID": localStorage.getItem('userId1'),
            "Partnercode": this.partnerId ? this.partnerId : '',
            "FLag": this.partnerId ? 'Detailed' : 'Summary'
        }
        this.commonService.getPartnerDetails(token ? token : this.tokenValue, data)
            .subscribe((res: any) => {
                if (res && res.Body) {
                    if (token) {
                        this.partnerList = res.Body;
                    } else {
                        this.staticIp = res.Body[0].IPAddress;
                        this.address = res.Body[0].Address;
                    }
                } else {
                    this.toast.displayToast(res.Head.ErrorDescription);
                }
            },
                (err: { error: { Message: any; }; }) => {
                    this.toast.displayToast(err.error.Message);
                });
    }

    onChangeEvent(event: any) {
        this.noPId = false;
        this.getPartnerList();
    }

    onSubmitClick() {
        if (!this.partnerId) {
            this.noPId = true;
            return;
        }
        if (this.staticIp.trim() === '' || isEmpty(this.staticIp) || this.staticIp === undefined) {
            return;
        }
        let dataToSend = {
            "LoginID": localStorage.getItem('userId1'),
            "Partnercode": this.partnerId,
            "Reason": this.reason,
            "IPAddress": this.staticIp,
            "PDFData": this.selectedFile ? this.selectedFile : '',
        };
        if (this.fileError) {
            this.toast.displayToast(this.fileError);
            return;
        }
        this.commonService.editIPDetails(this.tokenValue, dataToSend)
            .subscribe((res: any) => {
                if (res && res.Body) {
                    this.toast.displayToast(res.Body.Msg);
                    this.dismiss();
                } else {
                    this.toast.displayToast(res.Head.ErrorDescription);
                    this.dismiss();
                }
            },
                (err: { error: { Message: any; }; }) => {
                    this.toast.displayToast(err.error.Message);
                    this.dismiss();
                });
    }

    dismiss() {
        this.modalController.dismiss();
    }

    uploadPdf(event: any) {
        let file = event.target.files[0];
        this.fileTitle = file.name;
        if ((file.type).includes("application/pdf")) {
            this.isUpload = true;
            if (file.name.length > 25) {
                var split = file.name.split('.');
                var extension = split[1];
                let fn = split[0].substring(0, 25);
                this.filename = fn + '...' + extension;
                this.fileTitle = this.filename;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.selectedFile = reader.result;
                this.selectedFile = this.selectedFile.split('64,')[1];
            };
            this.fileError = null;
        }
        else {
            this.fileError = 'Only pdf file is allowed';
            this.toast.displayToast(this.fileError);
        }
    }
    removeFile() {
        this.fileTitle = null;
        this.selectedFile = null;
        this.isUpload = false;
        this.fileError = null;
    }
    onisDisableIPClick() {
        this.isDisableIP = false;
    }
}
