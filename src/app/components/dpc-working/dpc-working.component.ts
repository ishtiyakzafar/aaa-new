import { Component, OnInit, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-dpc-working',
  templateUrl: './dpc-working.component.html',
  styleUrls: ['./dpc-working.component.scss'],
})
export class DpcWorkingComponent implements OnInit {
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
