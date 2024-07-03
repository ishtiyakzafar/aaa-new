import { Component, OnInit, Input,Output, EventEmitter} from '@angular/core';
import { CommonService } from '../../helpers/common.service';

@Component({
    selector: 'app-pay-details-search-header',
    templateUrl: './pay-details-search-header.component.html',
    styleUrls: ['./pay-details-search-header.component.scss'],
})
export class PayDetailsSearchHeaderComponent implements OnInit {
    @Input() searchTerm!: string;
    @Input() tableOption: any;
    @Input() searchPlaceholer: any;
    @Output() passSearchText = new EventEmitter<string>();
    @Output() passDropDownData = new EventEmitter<any>();
    monthYearList:any[] = [];

    //public PayoutMonth: any;
   // public searchTerm = null;
    headerObj:any
    constructor(private commonService: CommonService) { }

    ngOnInit() { 
    //    this.monthYearList = this.commonService.last12Month();
    //    if(localStorage.getItem('payDetailMonth') == undefined){
    //     this.PayoutMonth = this.monthYearList[1];
    //    }
    //    else{
    //     this.PayoutMonth = localStorage.getItem('payDetailMonth');
    //    }
       
        this.headerObj = {
            SearchText:this.searchTerm,
            SearchBy:""
         }
    }
    
    changeValue(event: any){
        this.passSearchText.next(event);
    }
   
    // changeSelectOption(event, month){
    //     localStorage.setItem('payDetailMonth', event)
    //    // let localStorageMonth = localStorage.getItem('payDetailMonth')
    //     this.passDropDownData.emit({event, month});
    // }


}
