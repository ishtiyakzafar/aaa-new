import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { RaiseQueryService } from '../raise-query/raise-query.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { CommonService } from '../../helpers/common.service';
import { LoginService } from '../login/login.service';
import { ToasterService } from '../../helpers/toaster.service';

@Component({
  selector: 'app-help-support',
  providers:[RaiseQueryService,LoginService],
  templateUrl: './help-support.component.html',
  styleUrls: ['./help-support.component.scss'],
})
export class HelpSupportComponent implements OnInit {

  public searchTerm: any;

  public questionList: any = [];
  public botCategory: any = [];
  public subjectId: any = null;
  public segmentValue: string = 'Self';
  helpSearchField: any;
  afterThirdDrill = false;
  afterSearch: boolean = false;
  categories:any=[];
  buttonText: string = "Raise a Query";
  retryCount:number = 0;

  constructor(private toast: ToasterService,private loginService:LoginService,private storage: StorageServiceAAA,private router: Router,private serviceFile: RaiseQueryService,private commonService: CommonService,) { }

  ngOnInit() { 
    localStorage.setItem('helpType', 'Self');
  }

  ionViewWillEnter() {
		this.botCategory = [];
    this.afterSearch = false;
    this.afterThirdDrill = false;
	}

  goBack() {
		window.history.back();
	}

  changeSearchText(event: any) {
    if (event && !_.isEmpty(event)) {
      this.helpSearchField = '';
      this.afterSearch = true;
      this.afterThirdDrill = false;
      localStorage.setItem('helpBotCategory', 'false');
      localStorage.setItem('SubjectHeadData', '');
      localStorage.setItem('SubSubjectHeadData', '');
      localStorage.setItem('ThirdLevelData', '');
      localStorage.setItem('isSignedDocument', 'false');
      localStorage.setItem('selected_categories', '');
      if (event.length >= 4) {
        this.helpSearchField = event;
      }
      else {
        this.helpSearchField = '';
      }
      this.searchTerm = event;
      this.onSearch(this.searchTerm, 'AllSubjectHead');
    } else {
      this.afterSearch = false;
    }
  }

  onBotClick(data: any){
      this.categories.push(data.NewSubjectHead)
    if (this.categories.length > 3) {
      this.categories = this.categories.slice(-3); 
     }
    localStorage.setItem('selected_categories',JSON.stringify(this.categories))

    if(data.SubjectHead){
      this.searchTerm = data.SubjectHead;
      this.helpSearchField = data.SubjectHead;
      localStorage.setItem('SubjectHeadData',data.SubjectHead);
      this.onSearch(this.searchTerm,'SubSubjectHead');
      this.commonService.setClevertapEvent('Subjecthead_clicked',{'Login ID':localStorage.getItem('userId1'),'Subject Head Name':data.SubjectHead});
    }
    else if(data.SubSubjectHead){
      this.searchTerm = data.SubSubjectHead;
      this.helpSearchField = data.SubSubjectHead;
      localStorage.setItem('SubSubjectHeadData',data.SubSubjectHead);
      this.onSearch(this.searchTerm,'ThirdDrillDown');
      this.commonService.setClevertapEvent('SubSubjecthead_clicked',{'Login ID':localStorage.getItem('userId1'),'Sub Subject Head Name':data.SubSubjectHead});
    }
    else{
      this.searchTerm = data.ThirdLevel;
      this.afterThirdDrill = true;
      if(!localStorage.getItem('ThirdLevelData')){
        data['disable'] = true;
        localStorage.setItem('ThirdLevelData',data.ThirdLevel);
      }
      this.onSearch(this.searchTerm,'ThirdDrillDown',true);
      this.commonService.setClevertapEvent('Thirdlevel_clicked',{'Login ID':localStorage.getItem('userId1'),'Third Level Name':data.ThirdLevel});
    }
    const SubjectHeadData = localStorage.getItem('SubjectHeadData');
    if (SubjectHeadData === 'Signed Document') {
      this.buttonText = "Create Signed Document";
      localStorage.setItem('isSignedDocument', 'true')
      
    }else{
      this.buttonText = "Raise a Query";
      localStorage.setItem('isSignedDocument', 'false')
    }
  }

  onSearch(searchTerm: any,category: any,isBotAPICall?: any){
    this.questionList = [];
    this.botCategory = [];
    let obj = {
      portalId: '',
      searchStr: ''
    };
    obj.portalId = 'edbsn526a59bbdb530d16040551fc51a5efb259617703e270ab441d85842f73f62f57';
    obj.searchStr = searchTerm;
    this.serviceFile.zohoSearch(obj).subscribe(res => {
      res.data.forEach((element: any) => {
        const found = this.questionList.some((el: any) => el.title === element.title);
        if (!found) this.questionList.push( element );
      });

      if (!isBotAPICall) {
        this.botApiCall(category);
      }
    });
  }

  botApiCall(category:any) {
    if (localStorage.getItem('crmToken')) {
      this.getData(category, localStorage.getItem('crmToken'));
    } else {
      this.loginService.getCrmToken().subscribe((res:any) => {
        localStorage.setItem('crmToken', res['Body']['Token']);
        this.getData(category, res['Body']['Token']);
      });
    }
  }

  getData(category:any,hTokenVal:any){
    this.serviceFile.helpSubjectCategory(this.helpSearchField,category,hTokenVal).subscribe({
      next: (res:any)=> { 
        this.retryCount = 0;
        this.botCategory = [];
        if(res['Body'] == null){
          this.helpSearchField = '';
          this.botApiCall(category);
        }
        if(res['Body'] && res['Body']['Table']){
        res['Body']['Table'].forEach((element: any) => {
          if(element.SubjectHead == 'Activation And Modification'){
            this.botCategory.push({SubjectHead: "Activation And Modification",NewSubjectHead: "Activation",disable: false},{SubjectHead: "Activation And Modification",
            NewSubjectHead: "Modification",disable: false});
          }
          else if(element.SubjectHead == 'Back Office'){
            this.botCategory.push({SubjectHead: "Back Office",NewSubjectHead: "Back Office",disable: false},{SubjectHead: "Back Office",
            NewSubjectHead: "BO",disable: false});
          }
          else if(element.SubjectHead == 'L2 App Support'){
            this.botCategory.push({SubjectHead: "L2 App Support",NewSubjectHead: "Technology",disable: false});
          }
          else{
            if(category == 'AllSubjectHead'){
              this.botCategory.push({SubjectHead: element.SubjectHead,NewSubjectHead: element.SubjectHead,disable: false});
            }
            else if(category == 'SubSubjectHead'){
              this.botCategory.push({SubSubjectHead: element.SubSubjectHead,NewSubjectHead: element.SubSubjectHead,disable: false});
            }
            else{
              this.botCategory.push({ThirdLevel: element.ThirdLevel,NewSubjectHead: element.ThirdLevel,disable: false});
            }
          }
        })
        }
      },
      error: (err: any) => {
        this.retryCount+=1;
        if(err.status === 429 && this.retryCount<3){
          if (localStorage.getItem('crmToken')) {
            this.getData(category, localStorage.getItem('crmToken'));
          } else {
            this.loginService.getCrmToken().subscribe((res:any) => {
              localStorage.setItem('crmToken', res['Body']['Token']);
              this.getData(category, res['Body']['Token']);
            });
          }
        }
        if(this.retryCount == 3 || err.status !== 429){
          this.retryCount = 0;
          this.toast.displayToast(err.message);
        }
       }
  });
  }

  faqHandle(){
    let contentData: any = [];
    let listData: any = [];
    let headData: any = [];
    let obj1: any = {};
    let name: any = '';
    let dataObj: any = {
      portalId: 'edbsn526a59bbdb530d16040551fc51a5efb259617703e270ab441d85842f73f62f57',
      from: 1,
      limit: 100,
      categoryId: '82853001801822470'
    };

    this.storage.get('userType').then(type => {
      // dataObj.categoryId = '82853001801822470';
      name = 'Partner FAQ';
      if (type === 'RM') {
            dataObj.categoryId = '82853001801793906';
            name = 'RM FAQ';
      }
      this.serviceFile.zohoListArticle(dataObj).subscribe(res => {
        listData = res.data;
        const obj: any= {};
        for (const key of listData) {
             obj[key.category.name] = key.category.name;
        }
        for(let i in obj){
          headData.push(i);
        }
        for(var i=0; i<listData.length; i++){
          for(var j=0; j<headData.length; j++){
          if(listData[i]['category']['name'] == headData[j]){
              obj1 = {};
              obj1[headData[j]] = {
              title: listData[i]['title'],
              id: listData[i]['id']
            }
            contentData.push(obj1);
          }
        }
        }
        this.router.navigate(['/faq-details'],{ queryParams: { title: name, data: JSON.stringify(contentData)}});
      });
    });
  }

  faqClick(){
    this.searchTerm = '';
    this.questionList = [];
    this.commonService.setClevertapEvent('FAQs_Clicked');
    this.router.navigate(['/help-faq-root']);
  }

  ticketClick(){
    this.searchTerm = '';
    this.questionList = [];
    this.commonService.setClevertapEvent('Tickets_Clicked');
    this.router.navigate(['/help-partner-query']);
  }

  raiseQueryClick(){

    localStorage.setItem('searchTerm',this.searchTerm);
		this.commonService.setClevertapEvent('Raise_query_Clicked', { 'Login ID': localStorage.getItem('userId1') });
    this.searchTerm = '';
    this.questionList = [];
    this.botCategory = [];
    this.afterSearch = false;
    this.afterThirdDrill = false;
    this.categories = [];
    // this.commonService.setClevertapEvent('SearchFAQ_clicked',);
    this.commonService.setClevertapEvent('RaiseQuery_Search_Clicked',{'Login ID':localStorage.getItem('userId1')});
    localStorage.setItem('helpBotCategory','true');
    this.router.navigate(['/raise-query']);
  }

  inputSearch(event: any) {
    // console.log('inputSearch=',event);
	}

  onQuesClick(event: any,res: any){
    this.searchTerm = '';
    this.questionList = [];
    this.router.navigate(['/help-search-ques'],{ queryParams: {id: res.id, title: res.title}});
    this.commonService.setClevertapEvent('SearchFAQ_clicked',{'Login ID':localStorage.getItem('userId1')});
  }

  mapSegmentChanged(event: any){
    this.searchTerm = '';
    this.questionList = [];
    this.segmentValue = event;
    this.afterThirdDrill = false;
    localStorage.setItem('helpType', event);
  }

  searchText(){}

}
