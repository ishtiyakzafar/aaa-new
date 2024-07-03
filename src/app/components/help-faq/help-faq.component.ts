import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { groupBy } from 'rxjs/operators';
import { RaiseQueryService } from '../../pages/raise-query/raise-query.service';

@Component({
  selector: 'app-help-faq',
  providers:[RaiseQueryService],
  templateUrl: './help-faq.component.html',
  styleUrls: ['./help-faq.component.scss'],
})
export class HelpFaqComponent implements OnInit {

  public listData: any = [];
  public headData: any = [];
  public contentData: any = [];
  public obj1: any = {};

  constructor(private serviceFile: RaiseQueryService,private router: Router) { }

  ngOnInit() {
    this.getListArticle();
  }

  goBack() {
		window.history.back();
	}

  raiseQueryClick(){
    this.router.navigate(['/raise-query']);
  }

  getListArticle(){
    this.contentData = [];
    let rootCategoryId = localStorage.getItem('rootDataId');
    let obj = {
      portalId: '',
      from: 1,
      limit: 100,
      categoryId: rootCategoryId
    };
    obj.portalId = 'edbsn526a59bbdb530d16040551fc51a5efb259617703e270ab441d85842f73f62f57';
    this.serviceFile.zohoListArticle(obj).subscribe(res => {
      this.listData = res.data;
      const obj: any = {};
      for (const key of this.listData) {
           obj[key.category.name] = key.category.name;
      }
      for(let i in obj){
        this.headData.push(i);
      }
      
      for(var i=0; i<this.listData.length; i++){
        for(var j=0; j<this.headData.length; j++){
        if(this.listData[i]['category']['name'] == this.headData[j]){
            this.obj1 = {};
            this.obj1[this.headData[j]] = {
            title: this.listData[i]['title'],
            id: this.listData[i]['id']
          }
          this.contentData.push(this.obj1);
        }
      }
      }
     this.onFaqClick(this.headData[0]);
    });
  }

  onFaqClick(res: any){
    this.router.navigate(['/faq-details'],{ queryParams: { title: res, data: JSON.stringify(this.contentData)}});
  }

  onBradcrum(){
    this.router.navigate(['/help-support']);
  }

}