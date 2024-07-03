import { Component, OnInit, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-dpc-working-mobile',
  templateUrl: './dpc-working-mobile.component.html',
  styleUrls: ['./dpc-working-mobile.component.scss'],
})
export class DpcWorkingMobileComponent implements OnInit {
  fileType: any;
  constructor() { }
  @Output() downloadDPC = new EventEmitter;  

  ngOnInit() {
 
  }

  /**
   * on radio button change
   */
   onRadioChange(e:any){
    this.fileType= e.target.value;
   }
  /**
   * on click of download
   */
  downloadReport(value:any){
    this.downloadDPC.emit(value);
  }

}
