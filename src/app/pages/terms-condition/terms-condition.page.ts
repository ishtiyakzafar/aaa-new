import { Component, OnInit } from '@angular/core';
import { TermsConditionService } from './terms-condition.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../../helpers/common.service';

@Component({
  selector: 'app-terms-condition',
  providers: [TermsConditionService],
  templateUrl: './terms-condition.page.html',
  styleUrls: ['./terms-condition.page.scss'],
})
export class TermsConditionPage implements OnInit {
  termsCondtionHtml:any;
  public dataLoad: boolean = false;
  constructor(private terConService: TermsConditionService, private sanitizer: DomSanitizer, private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.analyticEvent('Profile_TnC', 'Terms & Conditions');
    this.terConService.getTermsConditionFile().subscribe((res: any) => {
      // console.log(res['body']['Link']);
      if(res['body']['status'] == 0){
        this.termsCondtionHtml = res['body']['Link'];
      }
      else{
        this.termsCondtionHtml = "<p>No Data Found</p>" 
      }
    })
    setTimeout(() => {
			this.dataLoad = true;
		}, 2000);
  }

  public goBack() {
		window.history.back();
  }
  transformYourHtml(htmlTextWithStyle: any) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
}

}
