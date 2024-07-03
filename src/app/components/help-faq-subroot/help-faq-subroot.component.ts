import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RaiseQueryService } from '../../pages/raise-query/raise-query.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-help-faq-subroot',
  providers:[RaiseQueryService],
  templateUrl: './help-faq-subroot.component.html',
  styleUrls: ['./help-faq-subroot.component.scss'],
})
export class HelpFaqSubrootComponent implements OnInit {
  public listData: any = [];
  public headData: any = [];
  public contentData: any = [];
  public obj1: any = {};
  public subRootData: any;
  public dataObj: any= {};
  constructor(private serviceFile: RaiseQueryService,private router: Router,private route: ActivatedRoute,public toast: ToasterService) { }
  ngOnInit() {
    this.router.events.forEach((event) => {
      this.route.queryParams.subscribe((params: any) => {
        if(params && params.data){
          this.listData = JSON.parse(params.data);
          this.onSubrootInit();
        }
      });
    });
  }
  onSubrootInit(){
    this.contentData = [];
    this.headData = [];
    const obj: any = {};
    for (const key of this.listData) {
         obj[key.name] = key.name;
    }
    for(let i in obj){
      this.headData.push(i);
    }
    for(var i=0; i<this.listData.length; i++){
      for(var j=0; j<this.headData.length; j++){
      if(this.listData[i]['name'] == this.headData[j]){
          this.obj1 = {};
          this.obj1[this.headData[j]] = {
          title: this.listData[i]['name'],
          children: this.listData[i]['children'],
          id: this.listData[i]['id']
        }
        this.contentData.push(this.obj1);
      }
    }
    }
  }
  goBack() {
		window.history.back();
	}
  onBradcrum(){
    this.router.navigate(['/help-support']);
  }
  getListArticle(rootCategoryId: any,name: any){
    this.contentData = [];
    this.dataObj = {
      portalId: '',
      from: 1,
      limit: 100,
      categoryId: rootCategoryId
    };
    this.dataObj.portalId = 'edbsn526a59bbdb530d16040551fc51a5efb259617703e270ab441d85842f73f62f57';
    this.serviceFile.zohoListArticle(this.dataObj).subscribe(res => {
      this.listData = res.data;
      const obj: any = {};
      for (const key of this.listData) {
           obj[key.category.name] = key.category.name;
      }
      // for(let i in obj){
      //   this.headData.push(i);
      // }
      
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
      this.router.navigate(['/faq-details'],{ queryParams: { title: name, data: JSON.stringify(this.contentData)}});
    },
    err => {
      this.toast.displayToast(err.error.message);
    });
  }
  raiseQueryClick(){
    this.router.navigate(['/raise-query']);
  }
  gotoHelp(){
    this.router.navigate(['/help-faq-root']);
  }
  onFaqClick(res: any){
    let rootData: any;
    for(let i=0;i<this.listData.length;i++){
      if(res == this.listData[i].name){
        rootData = this.listData[i].id;
        this.getListArticle(rootData,this.listData[i].name);
        break;
      }
    }
  }
  
}