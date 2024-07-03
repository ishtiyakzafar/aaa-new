import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-watchlist-desktop',
  templateUrl: './edit-watchlist-desktop.component.html',
  styleUrls: ['./edit-watchlist-desktop.component.scss'],
})
export class EditWatchlistDesktopComponent implements OnInit {
  @Input() editWatchListOption: any;
  @Input() scripLength: any;
  @Input() canAddDelete: any;
  @Input() canRename: any;
  @Input() isDefault: any;

  public addScrip = false;
  public deleteScrip = false;
  public isEditable = false;
  maxLenthDisplay!:string;

  public watchListName: any = null;
  maxLengthMsg: boolean = false;

  constructor( public modalController: ModalController) { }

  ngOnInit() {
    this.addScrip = false;
    this.deleteScrip = false;
    this.watchListName = this.editWatchListOption;
  }

  public save() {
    if(this.watchListName.length >= 25){
      this.maxLengthMsg = true;
       this.maxLenthDisplay = "Watch list name cannot be more than 25 character's!";
      // review. changed code. 
       //      setTimeout(function() {
      //     this.maxLengthMsg = false;
      //     // console.log(this.edited);
      // }.bind(this), 4000);

      setTimeout(() => {
        this.maxLengthMsg = false;
        // console.log(this.edited);
    }, 4000);
    }
    else{
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
