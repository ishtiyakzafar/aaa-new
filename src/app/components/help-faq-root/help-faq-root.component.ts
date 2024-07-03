import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RaiseQueryService } from '../../pages/raise-query/raise-query.service';

@Component({
  selector: 'app-help-faq-root',
  providers:[RaiseQueryService],
  templateUrl: './help-faq-root.component.html',
  styleUrls: ['./help-faq-root.component.scss'],
})
export class HelpFaqRootComponent implements OnInit {
  public listData: any = [];
  public headData: any = [];
  public contentData: any = [];
  public obj1: any = {};
  public showLoader = false;
  constructor(private serviceFile: RaiseQueryService,private router: Router) { }
  ngOnInit() {
    this.getRootCategory();
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
    this.router.navigate(['/raise-query']);
  }
  onFaqClick(res: any){
    let rootData: any;
    for(let i=0;i<this.listData.length;i++){
      if(res == this.listData[i].translations[0]['name']){
        rootData = this.listData[i].children;
        this.router.navigate(['/help-faq-subroot'],{ queryParams: { title: res, data: JSON.stringify(rootData)}});
        break;
      }
    }
  }
  getRootCategory(){
    this.contentData = [];
    this.showLoader = true;
    this.serviceFile.zohoGetCategoreTree().subscribe(res => {
      this.listData = JSON.parse(res.details.output);
      this.listData = this.listData.children;
      const obj: any = {};
      for (const key of this.listData) {
           obj[key.translations[0]['name']] = key.translations[0]['name'];
      }
      for(let i in obj){
        if(i != "FAQ's"){
          this.headData.push(i);
        }
      }
      
      for(var i=0; i<this.listData.length; i++){
        for(var j=0; j<this.headData.length; j++){
        if(this.listData[i].translations[0]['name'] == this.headData[j]){
            this.obj1 = {};
            this.obj1[this.headData[j]] = {
            title: this.listData[i].translations[0]['name'],
            children: this.listData[i]['children'],
            id: this.listData[i]['id']
          }
          this.contentData.push(this.obj1);
        }
      }
      }
      this.showLoader = false;
    });
  }
}