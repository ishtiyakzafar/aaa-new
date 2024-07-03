import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RaiseQueryService } from '../../pages/raise-query/raise-query.service';
import { CommonService } from '../../helpers/common.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-help-search-ques',
  providers:[RaiseQueryService],
  templateUrl: './help-search-ques.component.html',
  styleUrls: ['./help-search-ques.component.scss'],
})
export class HelpSearchQuesComponent implements OnInit {

  public searchTitle: any;
  public apiData: any;
  public showLoader = false;

  constructor(private route: ActivatedRoute,private commonService: CommonService,private serviceFile: RaiseQueryService,private router: Router,public modalController: ModalController) { }

  ngOnInit() {
    let id;
    this.route.queryParams.subscribe((params: any) => {
      this.showLoader = true;
      if(params && params.id && params.title) {
        id = params.id;
        this.searchTitle = params.title;
        localStorage.setItem('quesId',params.id);
        localStorage.setItem('quesTitle',params.title);
      }
      else{
        id = localStorage.getItem('quesId');
        this.searchTitle = localStorage.getItem('quesTitle');
      }
      this.serviceFile.zohoGetDeskArticle(id).subscribe(res => {
        this.apiData = JSON.parse(res.details.output).answer;
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(this.apiData, 'text/html');
        this.apiData = htmlDoc.getElementsByTagName('body')[0].outerHTML;
        this.showLoader = false;
      });
    });
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
    localStorage.setItem('searchTerm','');
    this.commonService.setClevertapEvent('Raise_Query_Clicked');
    localStorage.setItem('helpBotCategory','false');
    this.router.navigate(['/raise-query']);
  }

  goHome(){
    this.modalController.dismiss();
    this.router.navigate(['/help-support']);
  }

}
