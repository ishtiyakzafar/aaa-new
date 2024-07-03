import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CallSupportModelComponent } from '../call-support-model/call-support-model.component';
import { RaiseQueryService } from '../../pages/raise-query/raise-query.service';
import moment from 'moment';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-account-activation-model',
  providers:[RaiseQueryService],
  templateUrl: './account-activation-model.component.html',
  styleUrls: ['./account-activation-model.component.scss'],
})
export class AccountActivationModelComponent implements OnInit {

  @Input() dataObj: any;
  public userName: any = localStorage.getItem('userName');
  public userId: any = localStorage.getItem('userId1');
  public moment: any = moment;
  public link: any;
  descriptionText: any = '';
  public filename: any = [];
  public attachmentName: any = [];
  public myFiles:any = [];
  public uploadImg: any;
  public imgArr: any = [];
  public maxImgSize: any = /*10485760*/ 20971520;
  public imgError: any;
  constructor(private modalController: ModalController, private storage: StorageServiceAAA, public commonService: CommonService, private serviceFile: RaiseQueryService, public toast: ToasterService) { }

  ngOnInit() {
    // console.log(this.dataObj);
  // this.link = this.linkify(this.dataObj.Resolution);
  // console.log(this.link, this.link.length);
  }
 
//   linkify(text) {
//     var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
//     return text.replace(urlRegex, function(url) {
//       // console.log('<a href="' + url + '">' + url + '</a>');
//       // this.stringHtml = '<a href="' + url + '">' + url + '</a>';
//       // var htmlStr = '<a href="' + url + '">' + url + '</a>';
//       //   return htmlStr;

//       // var parser = new DOMParser();
//       // var doc = parser.parseFromString(url, 'text/html');

//       // console.log(url, typeof url);
//       return url;
//       // console.log(this.stringHtml);
//         // this.stringToHTML('<a href="' + url + '">' + url + '</a>');
//     });
//     // this.stringToHTML(this.stringHtml);
// }

  // stringToHTML(str) {
  //   str = this.linkify(str);
  //   console.log(str);
  //   var parser = new DOMParser();
  //   var doc = parser.parseFromString(str, 'text/html');
  //   // console.log(str);
  //   // console.log(doc.body.innerHTML);
  //   return doc.body.firstElementChild;
  // };

  async displayActivationModel(){
    const modal = this.modalController.create({
			component: CallSupportModelComponent,
			componentProps: {dataObj: this.dataObj},
			cssClass: 'superstars backdrop-bg',
      backdropDismiss: true
		});
    this.modalController.dismiss();
		return (await modal).present();
  }

  dismiss(){
    this.modalController.dismiss();
  }

  attachmentDown(url: any){
    // this.commonService.downLoadReportFun(url);
    window.open(url.DownLoad_URL, '_blank');
  }

  /**
   * On click of submit/close ticket.
   * @param action 
   */
  updateTicket(action: any) {
    let data = {
      "Token": this.dataObj.token,
      "ObjectName": "Ticket",
      "Parameters": {
        "Ticket_Number": this.dataObj.TicketID,
        "Status": action,
        "Discussion": action === 'Resolved' ? '' : this.descriptionText
      },
      "Attachment": this.imgArr ? this.imgArr : null,
      "AttachmentName": this.attachmentName ? this.attachmentName : null
    }
    this.serviceFile.updateTicket(data).subscribe((res: any) => {
      if (res && res.Body && res.Body.data && res.Body.data[0].status === 'success') {
        this.myFiles = [];
        this.imgArr = [];
        this.attachmentName = [];
        this.toast.displayToast(res.Body.data[0].message);
      } else {
        this.toast.displayToast(res.Head.Description);
      }
      this.dismiss();
    },
      (err: any) => {
        this.toast.displayToast(err.error.Message);
        this.modalController.dismiss();
      });
  }

  handleFileInput(event: any){
    for (var i = 0; i < event.target.files.length; i++) {
        if((event.target.files[i].type === 'application/pdf' || event.target.files[i].type === 'image/jpeg' || event.target.files[i].type === 'video/mp4' || event.target.files[i].type === 'audio/mpeg' || event.target.files[i].type === 'image/png' || (event.target.files[i].type).includes("text/csv") || (event.target.files[i].type).includes("application/vnd.ms-excel") || (event.target.files[i].type).includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) && !this.attachmentName.includes(event.target.files[i].name)){
          // if(event.target.files[i].size <= this.maxImgSize){
          if(event.target.files[i].name.length>25){
            var split = event.target.files[i].name.split('.');
            var file = split[0];
            var extension = split[1];
            file = file.substring(0, 25);
            this.filename[i] = file + '...' + extension;
          }
          // this.maxImgSize = this.maxImgSize - event.target.files[i].size;
          this.myFiles.push(event.target.files[i]);
          this.attachmentName.push(event.target.files[i].name);
          const reader = new FileReader();
                  reader.readAsDataURL(event.target.files[i]);
                  reader.onload = () => {
                      this.uploadImg = reader.result;
                      this.uploadImg = this.uploadImg.split('64,')[1];
                      this.imgArr.push(this.uploadImg);
                  };
                  this.imgError = '';
        // }
        // else{
        //   this.imgError = 'File size is greater than 20 MB';
        // }
      }
      else{
        if(this.attachmentName.includes(event.target.files[i].name)){
          this.imgError = '';
        }
        else{
          this.imgError = 'File format is Invalid';
        }
      }
    }
  }

  removeFile(value: any){
    let fileSize = this.myFiles[value].size;
    this.myFiles.splice(value, 1);
    // this.maxImgSize = this.maxImgSize + fileSize;
    this.imgArr.splice(value, 1);
    this.attachmentName.splice(value, 1);
    if(this.myFiles.length == 0){
      this.imgError = '';
    }
  }

}
