import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
@Component({
  selector: 'app-edit-watchlist-mobile',
  templateUrl: './edit-watchlist-mobile.component.html',
  styleUrls: ['./edit-watchlist-mobile.component.scss'],
})
export class EditWatchlistMobileComponent implements OnInit {
  @Input() editWatchListOption: any;
  @Input() scripLength: any;
  @Input() canAddDelete: any;
  @Input() canRename: any;
  @Input() isDefault: any;

  public addScrip = false;
  public deleteScrip = false;
  public isEditable = false;

  maxLengthMsg = false;
  maxLenthDisplay!:string;

  public watchListName: any = null;

  constructor( public modalController: ModalController, private commonservice: CommonService, public toast: ToasterService) { }

  ngOnInit() {
    this.addScrip = false;
    this.deleteScrip = false;
    this.watchListName = this.editWatchListOption;
  }

  public save() {
    if(this.commonservice.inputRestriction(this.watchListName)){
      this.toast.displayToast("Invalid Characters are not allowed");
      return;
    }
    if(this.watchListName.length >= 25){
      this.maxLengthMsg = true;
       this.maxLenthDisplay = "Watch list name cannot be more than 25 character's!"
      //      setTimeout(function() {
      //     this.maxLengthMsg = false;
      //     // console.log(this.edited);
      // }.bind(this), 4000);
      // review. changed code
      setTimeout(() => {
        this.maxLengthMsg = false;
        // console.log(this.edited);
      }, 4000);
    } else {
      const passData: any = {};
      this.isEditable = false;
      passData['watchListName'] = this.editWatchListOption;
      passData['watchListValue'] = this.watchListName;
      passData['renameWatchList'] = true;
      this.modalController.dismiss({
        dismissed: true,
        passData
      });
    }
  }

  dismiss(add?: any,del?: any,setDefault?: any) {
    const passData: any = {};
    passData['addScrip'] = add;
    passData['deleteScrip'] = del;
    passData['setDefault'] = setDefault;
    passData['watchListName'] = this.watchListName;
    this.modalController.dismiss({
      dismissed: true,
      passData
    });
  }

}
