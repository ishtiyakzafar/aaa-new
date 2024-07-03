import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../helpers/common.service';

@Component({
  selector: 'app-faq-details',
  templateUrl: './faq-details.component.html',
  styleUrls: ['./faq-details.component.scss'],
})
export class FaqDetailsComponent implements OnInit {

  public faqTitle: any;
  public faqData: any = [];
  public newFaqData: any = [];

  constructor(private router: Router,private route: ActivatedRoute,private commonService: CommonService) { }

  ngOnInit() {
    this.router.events.forEach((event) => {
    this.route.queryParams.subscribe((params: any) => {
      if(params && params.data){
        this.faqTitle = params.title;
        this.faqData = JSON.parse(params.data);
      }
    });
  });
  }

  ionViewWillEnter() {
    this.newFaqData = [];
    for(let i=0; i< this.faqData.length; i++){
      if(this.faqData[i][this.faqTitle] != undefined){
        this.newFaqData.push(this.faqData[i][this.faqTitle]);
      }
    }
  }

  onFaqClick(data: any){
    this.router.navigate(['/help-search-ques'],{ queryParams: {id: data.id, title: data.title}});
  }

  goBack() {
		window.history.back();
	}

  onBradcrum(){
    this.router.navigate(['/help-support']);
  }

  gotoHelp(){
    this.router.navigate(['/help-faq-root']);
  }

  raiseQueryClick(){
    this.commonService.setClevertapEvent('Raise_Query_Clicked');
    this.router.navigate(['/raise-query']);
  }

}