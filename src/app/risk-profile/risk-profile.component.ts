import { Component, Input,  OnInit, ViewChild } from '@angular/core';
import { WireRequestService } from '../pages/wire-requests/wire-requests.service';
import { ActivatedRoute } from '@angular/router';
import {IonContent, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../helpers/common.service';
import { StorageServiceAAA } from '../helpers/aaa-storage.service';


@Component({
  selector: 'app-risk-profile',
  providers: [WireRequestService],
  templateUrl: './risk-profile.component.html',
  styleUrls: ['./risk-profile.component.scss']
})
export class RiskProfileComponent implements OnInit{
  @ViewChild(IonContent) content: IonContent | undefined;
  @Input() clientID: any;
  public ticketData: any;
  public ticketScore: any = "0";
  clientScore: any;
  clientCap: any;
  clientCode:any;
  clientRiskProfile:any;
  dataLoad:boolean = false;
  visible:boolean = false;
  checkboxValues1: string = "0";
  checkboxValues2: string = "0";
  checkboxValues3: string = "0";
  checkboxValues4: string = "0";
  checkboxValues5: string = "0";
  childVisible : Boolean = false; 
  riskProfileForm: FormGroup;
  expectedAUMOption=[
    {
      id:1,
      title:'Total AUM',
      value:'11 L - 1 Cr',
    },
    {
      id:2,
      title:'Total AUM',
      value:'1 Cr - 2 Cr',
    },
    {
      id:3,
      title:'Total AUM',
      value:'2 Cr - 5 Cr',
    },
    {
      id:4,
      title:'Total AUM',
      value:'5 Cr Above',
    },
  ]
  questions = [
    {
      id: 'q1',
      text: 'Current and Total AUM of Client ?',
      options: [
        { value: '1', id:'q1-1', label: '11 Lakhs to 1 Cr', name:'expectedAumValue' },
        { value: '2', id:'q1-2', label: '1 Cr to 2 Cr', name:'expectedAumValue' },
        { value: '3', id:'q1-3', label: '2 Cr to 5 Cr', name:'expectedAumValue' },
        { value: '4', id:'q1-4', label: '> 5 Cr', name:'expectedAumValue' },        
      ]
    },
    {
      id: 'q2',
      text: 'I am currently _____________________',
      options: [
        { value: '1', id:'q2-1', label: 'Single', name:'professionValue' },
        { value: '2', id:'q2-2', label: 'Married without children', name:'professionValue' },
        { value: '3', id:'q2-3', label: 'Married with young children', name:'professionValue' },
        { value: '4', id:'q2-4', label: 'Married with a mature family in peak earning years', name:'professionValue' },
        { value: '5', id:'q2-5', label: 'Preparing for retirement', name:'professionValue' },
        
      ]
    },
    {
      id: 'q3',
      text: 'My age is _____________________',
      options: [
        { value: '1', id:'q3-1', label: '20-30 Years', name:'ageValue' },
        { value: '2', id:'q3-2', label: '31-40 Years', name:'ageValue' },
        { value: '3', id:'q3-3', label: '41-50 Years', name:'ageValue' },
        { value: '4', id:'q3-4', label: '51-60 Years', name:'ageValue' },
        { value: '5', id:'q3-5', label: 'Above 60 Years', name:'ageValue' },
        
      ]
    },
    {
      id: 'q4',
      text: 'I am _______________________________',
      options: [
        { value: '1', id:'q4-1', label: 'Not familiar and feel uncomfortable with the complexity of various investment products', name:'financialValue' },
        { value: '2', id:'q4-2', label: 'Not familiar when it comes to investment', name:'financialValue' },
        { value: '3', id:'q4-3', label: 'Somewhat familiar but don’t fully understand investments terms and products', name:'financialValue' },
        { value: '4', id:'q4-4', label: 'Fairly familiar and understand the various investment products along with factors which influence investment performance', name:'financialValue' },
        { value: '5', id:'q4-5', label: 'familiar and regularly use research and other investment information to make decision', name:'financialValue' },
        
      ]
    },
    {
      id: 'q5',
      text: 'What is your present investment pattern?',
      options: [
        { value: '1', id:'q5-1', label: 'Only In Fixed Income Such As FD, PPF, ETC', name:'investmentValue' },
        { value: '2', id:'q5-2', label: 'Mainly In Fixed Income And A Portion In Debt Mf & Hybrid Mf', name:'investmentValue' },
        { value: '3', id:'q5-3', label: 'Mainly Equity Mutual Funds', name:'investmentValue' },
        { value: '4', id:'q5-4', label: 'Mainly In Direct Equity', name:'investmentValue' },
        { value: '5', id:'q5-5', label: 'Have Invested In PMS & AIF & Small Cap Stocks', name:'investmentValue' },
        
      ]
    },
    {
      id: 'q6',
      text: 'I want to invest for ____________ time horizon',
      options: [
        { value: '1', id:'q6-1', label: 'Less than 1 year', name:'investTimeValue' },
        { value: '2', id:'q6-2', label: '1 -2 yrs', name:'investTimeValue' },
        { value: '3', id:'q6-3', label: '2-5 yrs', name:'investTimeValue' },
        { value: '4', id:'q6-4', label: '5-10 yrs', name:'investTimeValue' },
        { value: '5', id:'q6-5', label: '> 10 yrs', name:'investTimeValue' },
        ]
    },
    {
      id: 'q7',
      text: 'How would you prefer to invest your money to meet  your future investment objectives?',
      options: [
        { value: '1', id:'q7-1', label: 'FD & Bonds', name:'futureinvestValue' },
        { value: '2', id:'q7-2', label: 'Equity Shares, Mutual Funds & Alternatives', name:'futureinvestValue' },
        { value: '3', id:'q7-3', label: 'Real Estate', name:'futureinvestValue' },
        { value: '4', id:'q7-4', label: 'Commodities- E.g. Gold/Silver', name:'futureinvestValue' },
        { value: '5', id:'q7-5', label: 'Blended Portfolio Mix - Combination of Equities,Debt, Real Estate & Commodities', name:'futureinvestValue' },
        ]
    },
    {
      id: 'q8',
      text: 'Three hypothetical funds are available with the highest one-year gain and losses on an investment of INR 1Lac. Given the potential gain/loss, which fund would you prefer to invest in?',
      options: [
        { value: '1', id:'q8-1', label: 'Fund A - Highest gain: 6,000, Highest Loss: -1,600', name:'fundValue' },
        { value: '3', id:'q8-2', label: 'Fund B - Highest gain: 19,000, Highest Loss: -10,000', name:'fundValue' },
        { value: '5', id:'q8-3', label: 'Fund C - Highest gain: 40,200, Highest Loss: -36,000Real Estate', name:'fundValue' }
        ]
    },
    {
      id: 'q9',
      text: 'If my investment make 20% losses next year I will most likely',
      options: [
        { value: '1', id:'q9-1', label: 'Sell All Investments And Put The Proceeds In Fixed Deposit', name:'myInvestValue' },
        { value: '2', id:'q9-2', label: 'Sell Some Investments And Continue With The Rest', name:'myInvestValue' },
        { value: '3', id:'q9-3', label: 'Do Nothing', name:'myInvestValue' },
        { value: '4', id:'q9-4', label: 'Take Advantage Of The Correction And Invest Some More Money', name:'myInvestValue' },
        { value: '5', id:'q9-5', label: 'Invest Very Aggressively', name:'myInvestValue' },
        ]
    },
    {
      id: 'q10',
      text: 'My current and future income is ___________________',
      options: [
        { value: '1', id:'q10-1', label: 'Not Secure', name:'futureIncomeValue' },
        { value: '2', id:'q10-2', label: 'Somewhat Secure', name:'futureIncomeValue' },
        { value: '3', id:'q10-3', label: 'Secure', name:'futureIncomeValue' },
        { value: '4', id:'q10-4', label: 'Fairly Secure', name:'futureIncomeValue' },
        { value: '5', id:'q10-5', label: 'Very Secure', name:'futureIncomeValue' },
        ]
    }
    
    // Add more questions as needed
  ];

  checkboxOptions = [
    {
      id: 'q-1',
      text: 'I am willing to invest in _______________________',
      options: [
        { id:'inv11', value: '1', label: 'Debt MF, FD, GSEC, NCD, debt AIF' },
        { id:'inv12', value: '2', label: 'Equity MF' },
        { id:'inv13', value: '3', label: 'Equity Stocks' },
        { id:'inv14', value: '4', label: 'PMS' },
        { id:'inv15', value: '5', label: 'AIF Equity' }
        ]
    },
    
   
  ];
  currentQuestion: number = 0;
  isCurrentQuestionAnswered:boolean = false;
  isLastQuestion = false;
  isbtnVisible = true;
  buttonText = 'Start Assessment';
  cateoriesText = 'Lets know each other better';
  cateoriesImg = 'assets/svg/risk_assessment_icon1.svg';
  meterClass?: string;
  riskValue?:string;
  riskImg?:string;
  riskText?:string;
  riskPdf:any;
  riskExcel:any;
  allRisk?:string;
  expectedAum:any;
  selectedCategory?:number;
  selectedProfile:any;
  selectedAum:any;
  riskProfileScores = [
    {
      isActive:true,
      id:"Very Conservative",
      class:"very_conservative",
      imgSrc:"assets/svg/very_conservative_score.svg",
      iconImg:"assets/svg/very_conservative_icon.svg",
      links: [
        {
          id: 1,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/very-conservative-1-to-4.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/very-conservative-1-to-4.xlsx"
        },
        {
          id: 2,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/very-conservative-1-to-4.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/very-conservative-1-to-4.xlsx"
        },
        {
          id: 3,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/very-conservative-1-to-4.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/very-conservative-1-to-4.xlsx"
        },
        {
          id: 4,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/very-conservative-1-to-4.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/very-conservative-1-to-4.xlsx"
        },
      ],
      text:"You are generally comfortable with achieving a minimum level of return potential on your investment coupled with minimal risks. Capital values of products that are potentially suitable for you can fluctuate and may fall below your original investment. In normal market conditions fluctuation is expected to be minimal (although this is not guaranteed), and you are comfortable with this level of fluctuation. Products that are potentially suitable for you are likely to produce returns that are based on prevailing interest rates which may or may not keep pace with inflation.",
      expectedAUMOption:[
        {
          id:1,
          title:'Total AUM',
          value:'11 L - 1 Cr',
          checked:false,
        },
        {
          id:2,
          title:'Total AUM',
          value:'1 Cr - 2 Cr',
          checked:false,
        },
        {
          id:3,
          title:'Total AUM',
          value:'2 Cr - 5 Cr',
          checked:false,
        },
        {
          id:4,
          title:'Total AUM',
          value:'5 Cr Above',
          checked:false,
        },
      ],
    },
    {
      isActive:true,
      id:"Conservative",
      class:"conservative",
      imgSrc:"assets/svg/conservative_score.svg",
      iconImg:"assets/svg/conservative_icon.svg",
      links: [
        {
          id: 1,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/conservative-1-to-4.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/conservative-1-to-4.xlsx"
        },
        {
          id: 2,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/conservative-1-to-4.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/conservative-1-to-4.xlsx"
        },
        {
          id: 3,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/conservative-1-to-4.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/conservative-1-to-4.xlsx"
        },
        {
          id: 4,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/conservative-1-to-4.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/conservative-1-to-4.xlsx"
        },
      ],
      text:"You are generally comfortable with achieving a low level of return potential on your investment coupled with a low level of risk. Capital values of products that are potentially suitable for you can fluctuate and may fall below your original investment. In normal market conditions fluctuation is expected to be low (although this is not guaranteed), and you are comfortable with this level of fluctuation.",
      expectedAUMOption:[
        {
          id:1,
          title:'Total AUM',
          value:'11 L - 1 Cr',
          checked:false,
        },
        {
          id:2,
          title:'Total AUM',
          value:'1 Cr - 2 Cr',
          checked:false,
        },
        {
          id:3,
          title:'Total AUM',
          value:'2 Cr - 5 Cr',
          checked:false,
        },
        {
          id:4,
          title:'Total AUM',
          value:'5 Cr Above',
          checked:false,
        },
      ],
    },
    {
      isActive:true,
      id:"Moderate",
      class:"moderate",
      imgSrc:"assets/svg/moderate_score.svg",
      iconImg:"assets/svg/moderate_icon.svg",
      links: [
        {
          id: 1,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/moderate-1-n-2.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/moderate-1-n-2.xlsx"
        },
        {
          id: 2,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/moderate-1-n-2.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/moderate-1-n-2.xlsx"
        },
        {
          id: 3,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/moderate-3-n-4.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/moderate-3-n-4.xlsx"
        },
        {
          id: 4,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/moderate-3-n-4.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/moderate-3-n-4.xlsx"
        },
      ],
      text:"You are generally comfortable with achieving a moderate level of return potential on your investment coupled with a moderate level of risk. Capital values can fluctuate and may fall below your original investment. Fluctuation is expected to be higher than products that are suitable for investors in lower risk tolerance categories, but not as much as for higher risk tolerance categories.",
      expectedAUMOption:[
        {
          id:1,
          title:'Total AUM',
          value:'11 L - 1 Cr',
          checked:false,
        },
        {
          id:2,
          title:'Total AUM',
          value:'1 Cr - 2 Cr',
          checked:false,
        },
        {
          id:3,
          title:'Total AUM',
          value:'2 Cr - 5 Cr',
          checked:false,
        },
        {
          id:4,
          title:'Total AUM',
          value:'5 Cr Above',
          checked:false,
        },
      ],
    },
    {
      isActive:true,
      id:"Aggressive",
      class:"aggressive",
      imgSrc:"assets/svg/aggressive_score.svg",
      iconImg:"assets/svg/aggressive_icon.svg",
      links: [
        {
          id: 1,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/aggressive-1.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/aggressive-1.xlsx"
        },
        {
          id: 2,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/aggressive-2-n-3.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/aggressive-2-n-3.xlsx"
        },
        {
          id: 3,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/aggressive-2-n-3.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/aggressive-2-n-3.xlsx"
        },
        {
          id: 4,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/aggressive-4.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/aggressive-4.xlsx"
        },
      ],
 
      text:"You are generally comfortable with achieving a high level of return potential on your investment coupled with high level of risk. Capital values can fluctuate significantly and may fall quite substantially below your original investment. You understand the risk/reward equation, and are comfortable with this level of fluctuation.",
      expectedAUMOption:[
        {
          id:1,
          title:'Total AUM',
          value:'11 L - 1 Cr',
          checked:false,
        },
        {
          id:2,
          title:'Total AUM',
          value:'1 Cr - 2 Cr',
          checked:false,
        },
        {
          id:3,
          title:'Total AUM',
          value:'2 Cr - 5 Cr',
          checked:false,
        },
        {
          id:4,
          title:'Total AUM',
          value:'5 Cr Above',
          checked:false,
        },
      ],
    },
    {
      isActive:true,
      id:"Very Aggressive",
      class:"very_aggressive",
      links: [
        {
          id: 1,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/very-aggressive-1.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/very-aggressive-1.xlsx"
        },
        {
          id: 2,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/very-aggressive-2.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/very-aggressive-2.xlsx"
        },
        {
          id: 3,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/very-aggressive-3.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/very-aggressive-3.xlsx"
        },
        {
          id: 4,
          pdf: "https://images.indiainfoline.com/AAA_banner/pdf/very-aggressive-4.pdf",
          excel: "https://images.indiainfoline.com/AAA_banner/xlsx/very-aggressive-4.xlsx"
        },
      ],
      imgSrc:"assets/svg/very_aggressive_score.svg",
      iconImg:"assets/svg/very_aggressive_icon.svg",
      text:"You are generally comfortable with maximizing your return potential on investment coupled with maximized risk. Capital values can fluctuate widely and may fall substantially below your original investment. You understand the risk/reward equation, and are comfortable with this level of fluctuation.",
      expectedAUMOption:[
        {
          id:1,
          title:'Total AUM',
          value:'11 L - 1 Cr',
          checked:false,
        },
        {
          id:2,
          title:'Total AUM',
          value:'1 Cr - 2 Cr',
          checked:false,
        },
        {
          id:3,
          title:'Total AUM',
          value:'2 Cr - 5 Cr',
          checked:false,
        },
        {
          id:4,
          title:'Total AUM',
          value:'5 Cr Above',
          checked:false,
        },
      ],
    }

  ]

  constructor(private formBuilder: FormBuilder, private wireReqService: WireRequestService,private route: ActivatedRoute,private storage: StorageServiceAAA,private commonService: CommonService,) {
    this.riskProfileForm = this.formBuilder.group({
      expectedAumValue: ['', Validators.required],
      professionValue: ['', Validators.required],
      ageValue:['', Validators.required],
      financialValue:['', Validators.required],
      investmentValue:['', Validators.required],
      investTimeValue:['', Validators.required],
      futureinvestValue:['', Validators.required],
      fundValue:['', Validators.required],
      myInvestValue:['', Validators.required],
      futureIncomeValue:['', Validators.required],
      inv11: [false],
      inv12: [false],
      inv13: [false],
      inv14: [false],
      inv15: [false]

      
    }, { validators: this.checkboxesValidator });

    this.questions.forEach((question, index) => {
      this.riskProfileForm.addControl(index.toString(), this.formBuilder.control(''));
    });

   }


   ngOnInit() {
   
    this.route.queryParams.subscribe((params: any) => {
      if(params && params.id) {
        this.ticketData = params.id;
        if(this.ticketData !== undefined) {
          //console.log('this.ticketData',this.ticketScore)
          document.getElementById('skipbtn')?.classList.add('d-none');
         
        }
        else{
          document.getElementById('skipbtn')?.classList.remove('d-none');
        }
      }

     })
    

  

}
   checkboxesValidator(formGroup: FormGroup) {
    const checked = Object.values(formGroup.value).some(value => value === true);
     return checked ? null : { required: true };
    
  }

  previousQuestion() {
    //this.checkRadioSelection();
    this.checkCateories();
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.checkRadioSelection();
    }
    
  }

  nextQuestion() {
    //this.checkRadioSelection();
    this.toggleButtonText();
    this.checkCateories();
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.checkRadioSelection();
    }
    else if(this.currentQuestion === this.questions.length - 1){
        this.isLastQuestion = !this.isLastQuestion;
    }
  }

  toggleButtonText() {
    if (this.buttonText === 'Start Assessment') {
      this.buttonText = 'Next';
      document.getElementById('skipbtn')?.classList.add('d-none');
      document.getElementById('previousbtn')?.classList.remove('d-none');
    } 
  }

  // checkAnswered() {
  //   this.checkRadioSelection()
  // }

  checkRadioSelection() {
    let option = this.questions[this.currentQuestion].options[0].name;
    const selectedValue = this.riskProfileForm.get(option)?.value;
    if (selectedValue != null && selectedValue !=undefined && selectedValue != "") {
      this.isCurrentQuestionAnswered = true;
      //console.log('A radio option is selected:', selectedValue);
    } else {
      this.isCurrentQuestionAnswered = false;
      //console.log('No radio option is selected.');
    }
  }


  checkCateories(){
    if (this.currentQuestion === 2 || this.currentQuestion === 3) {
      this.cateoriesText = 'Measure Your Money Know-How';
      this.cateoriesImg = 'assets/svg/financial_literacy.svg'
    }
    else if(this.currentQuestion >= 4 && this.currentQuestion <= 7){
      this.cateoriesText = 'Understanding Your Comfort Zone';
      this.cateoriesImg = 'assets/svg/risk_appetite.svg'
    }
    else if(this.currentQuestion === 8){
      this.cateoriesText = "Let's Personalize It Together";
      this.cateoriesImg = 'assets/svg/product_preferance.svg'
    }
    else{
      this.cateoriesText = 'Lets know each other better';
      this.cateoriesImg = 'assets/svg/risk_assessment_icon1.svg'
    }
  }
  
  

  submit() {
    if (this.riskProfileForm.valid) {
      this.commonService.setClevertapEvent('RiskProfile_Submit');
      // Proceed with further processing
      document.getElementById('dvError')?.classList.add('d-none');
      const selectedValues = Object.keys(this.riskProfileForm.value)
      .filter(key => this.riskProfileForm.value[key] === true);

    //console.log('Selected options:', selectedValues, this.riskProfileForm.value.inv11);
    
    if(this.riskProfileForm.value.inv11 == true){
      this.checkboxValues1 = '1'
      
     }
     if(this.riskProfileForm.value.inv12 == true){
      this.checkboxValues2 = '2'
      
     }
     if(this.riskProfileForm.value.inv13 == true){
      this.checkboxValues3 = '3';
      
     }
      if(this.riskProfileForm.value.inv14 == true){
      this.checkboxValues4 = '4'
      
     }
      if(this.riskProfileForm.value.inv15 == true){
      this.checkboxValues5 = '5'
    
     }

    
      
      
      let checkboxTotal = parseFloat(this.checkboxValues1) + parseFloat(this.checkboxValues2) + parseFloat(this.checkboxValues3) + parseFloat(this.checkboxValues4) + parseFloat(this.checkboxValues5); 
      //console.log('checkboxTotal', checkboxTotal);
      let result: any;
      if(this.ticketScore !== "0"){
        result = this.ticketScore;
      }
      else{
        result = parseFloat(this.riskProfileForm.value.professionValue) + parseFloat(this.riskProfileForm.value.ageValue) + parseFloat(this.riskProfileForm.value.financialValue) + parseFloat(this.riskProfileForm.value.investmentValue) + parseFloat(this.riskProfileForm.value.investTimeValue) + parseFloat(this.riskProfileForm.value.futureinvestValue) + parseFloat(this.riskProfileForm.value.fundValue) + parseFloat(this.riskProfileForm.value.myInvestValue)+ parseFloat(this.riskProfileForm.value.futureIncomeValue) + checkboxTotal;
      }
      
      let resultCat = 0;
      
      
      
      // console.log("result", result)

      this.selectedAum = this.riskProfileForm.value.expectedAumValue;
      this.riskProfileScores = this.riskProfileScores.map((item) => ({ ...item, expectedAUMOption: item.expectedAUMOption.map((item) => item.id == this.selectedAum ? { ...item, checked: true } : item) }));

      if(result <= 15){
     
        this.meterClass = "meterActive0";
        this.expectedAum = this.riskProfileScores[0].expectedAUMOption;
        this.riskValue = this.riskProfileScores[0].id;
        this.riskImg = this.riskProfileScores[0].imgSrc;
        this.riskText = this.riskProfileScores[0].text;
        this.riskPdf = this.riskProfileScores[0].links[this.selectedAum-1].pdf;
        this.riskExcel = this.riskProfileScores[0].links[this.selectedAum-1].excel;
        this.allRisk = this.riskProfileScores[0].class;
        resultCat = 1;
      }
      else if(result >= 16 && result <= 25){
      
          this.meterClass = "meterActive1";
          this.expectedAum = this.riskProfileScores[1].expectedAUMOption;          
          this.riskValue = this.riskProfileScores[1].id;
          this.riskImg = this.riskProfileScores[1].imgSrc;
          this.riskText = this.riskProfileScores[1].text;
          this.riskPdf = this.riskProfileScores[1].links[this.selectedAum-1].pdf;
          this.riskExcel = this.riskProfileScores[1].links[this.selectedAum-1].excel;
          this.allRisk = this.riskProfileScores[1].class;
        resultCat = 2;
      }
      else if(result >= 26 && result <= 35){
          this.meterClass = "meterActive2";
          this.expectedAum = this.riskProfileScores[2].expectedAUMOption;         
          this.riskValue = this.riskProfileScores[2].id;
          this.riskImg = this.riskProfileScores[2].imgSrc;
          this.riskText = this.riskProfileScores[2].text;
          this.riskPdf = this.riskProfileScores[2].links[this.selectedAum-1].pdf;
          this.riskExcel = this.riskProfileScores[2].links[this.selectedAum-1].excel;
          this.allRisk = this.riskProfileScores[2].class;
        resultCat = 3;
      }
      else if(result >= 36 && result <= 45){
        
          this.meterClass = "meterActive3";
          this.expectedAum = this.riskProfileScores[3].expectedAUMOption;
          this.riskValue = this.riskProfileScores[3].id;
          this.riskImg = this.riskProfileScores[3].imgSrc;
          this.riskText = this.riskProfileScores[3].text;
          this.riskPdf = this.riskProfileScores[3].links[this.selectedAum-1].pdf;
          this.riskExcel = this.riskProfileScores[3].links[this.selectedAum-1].excel;
          this.allRisk = this.riskProfileScores[3].class;
        resultCat = 4;
      }
      else if(result >= 46){
       
          this.meterClass = "meterActive4";
          this.expectedAum = this.riskProfileScores[4].expectedAUMOption;
          this.riskValue = this.riskProfileScores[4].id;
          this.riskImg = this.riskProfileScores[4].imgSrc;
          this.riskText = this.riskProfileScores[4].text;
          this.riskPdf = this.riskProfileScores[4].links[this.selectedAum-1].pdf;
          this.riskExcel = this.riskProfileScores[4].links[this.selectedAum-1].excel;
          this.allRisk = this.riskProfileScores[4].class;
          resultCat = 5;
      }
      
      this.route.queryParams.subscribe((params: any) => {
        if(params && params.id) {
          this.ticketData = params.id;
          if(this.ticketData !== undefined) {
            this.storage.get('userType').then(type => {
              if (type === 'RM' || type === 'FAN') {
                this.storage.get('bToken').then(token => {
                  this.clientProfileScore(token,result,resultCat)
                })
              } else {
                this.storage.get('subToken').then(token => {
                  this.clientProfileScore(token,result,resultCat)
                })
              }
        
            })
          }
          
        }
  
       })
         
         
      this.goNextForm('risk_profile_score');
      setTimeout(() => {  
        document.querySelector('.all_report')?.classList.remove('d-none');
    }, 1000);
    
    } else {
      // Handle validation errors
      //console.log("Please select an option.");
      document.getElementById('dvError')?.classList.remove('d-none');
    }
  }

  resetInput(){
    this.riskProfileScores = this.riskProfileScores.map((item) => ({ ...item, expectedAUMOption: item.expectedAUMOption.map((ele) => ({ ...ele, checked: false })) }));
    this.riskProfileForm.reset();
    this.goNextForm('question_main_grid');
    document.querySelector('.risk_profile_question')?.classList.remove('d-none');
    this.isLastQuestion = false;
    this.currentQuestion = 0;
    //this.goNextForm('risk_profile_question'); 

  }
  goShowAll(){
    document.querySelector('.all_report')?.classList.remove('d-none');
   
  }

  goSkip(){
    this.riskProfileScores = this.riskProfileScores.map((item) => ({ ...item, isActive: false }))
    document.querySelector('.all_report')?.classList.remove('d-none');
    document.querySelector('.risk_profile_question_main_box')?.classList.add('d-none');
  }
  goBack() {
		window.history.back();
	}
 
  onclick()
  {
    this.visible = !this.visible
  }

  
  goNextForm(selectedForm: any){
    document.querySelectorAll('.sectionPanel').forEach(function(item,i){
      document.querySelectorAll('.sectionPanel')[i].classList.add('d-none');
    })
    document.querySelector('.'+selectedForm)?.classList.remove('d-none');



   
   
  }
  clientProfileScore(token: any,riskScore: any,riskCategory: any){
    let clientId = this.ticketData;
    
     //console.log('clientId', clientId);
    this.storage.get('userID').then((userID) => {
      //console.log('clientProfileCap', token);
      this.wireReqService.getProfileScore(token,userID,clientId,riskScore,riskCategory,this.selectedAum)
      .subscribe((res: any) => {
        this.dataLoad = true
        if(res['Head']['ErrorCode'] == 0){
          this.clientScore = res['Body'];
          //console.log('ProfileScoreData', this.clientScore);
        }
        else{this.dataLoad = false} 

      });
    })
   
  }

  selectCategory(id: any, type: any) {
    this.selectedCategory = id;
    this.selectedAum = id;
    this.selectedProfile = type;
    const index = this.riskProfileScores.findIndex((item) => item.id === type);
    this.riskProfileScores[index].expectedAUMOption = this.riskProfileScores[index].expectedAUMOption.map((item) => item.id === id ? { ...item, checked: true } : { ...item, checked: false })
    this.riskProfileScores = this.riskProfileScores.map((item) => item.id == type ? { ...item, isActive: true } : item);
  }

  selectTopCategory(id: any, type: any) {
    this.expectedAum = this.expectedAum.map((item: any) => item.id === id ? { ...item, checked: true } : { ...item, checked: false });
    const data = this.riskProfileScores.find((item)=>item.id == type);
    this.riskPdf = data?.links[id-1].pdf;
    this.riskExcel = data?.links[id-1].excel;
  }

  generateLink(data: any, type: any) {
    this.commonService.setClevertapEvent('FinancialPlanning_Download', { 'Login ID': localStorage.getItem('userId1') });
    if (data.expectedAUMOption.find((item: any) => item.checked == true)) {
      this.selectedAum = data.expectedAUMOption.find((item: any) => item.checked == true).id;

      if (type == 'pdf') {
        window.open(data.links[this.selectedAum - 1].pdf, '_blank');
      } else {
        window.open(data.links[this.selectedAum - 1].excel, '_blank');
      }
    }
  }

  report_download(){
    this.commonService.setClevertapEvent('FinancialPlanning_Download', { 'Login ID': localStorage.getItem('userId1') });
  }
}
