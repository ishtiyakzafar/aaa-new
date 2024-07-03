import { Component, OnInit, ViewChild, Input, Output, OnChanges, EventEmitter, SimpleChanges, ElementRef } from '@angular/core';
// import { IonSlides } from '@ionic/angular'; 	review
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Platform, ModalController } from '@ionic/angular';
import { CommonService } from '../../helpers/common.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';
import { MessagePopup } from '../message-popup/message-popup.component';

@Component({
	selector: 'app-brokerage-insert-form',
	providers: [WireRequestService],
	templateUrl: './brokerage-insert-form.component.html',
	styleUrls: ['./brokerage-insert-form.component.scss'],
})
export class BrokerageInsertFormComponent implements OnInit, OnChanges {
	@Input() brokerageType: any;
	@Input() passClientId: any;
	@Input() passClientIdValidation: boolean = false;
	@Input() currentBrokAPI: any;
	@Output() passClientIdFieled = new EventEmitter<any>();
	brokerageForm!: FormGroup;
	cashIntradaySecondSideVal: any;
	futureIntradaySecondSideVal: any;
	dataLoad: boolean = true;
	foInputs:boolean = false;
	//@ViewChild('slidesUpdated', { static: false }) sliderUpdated: any; //IonSlides;		review

	@ViewChild('slidesUpdated') sliderUpdated: ElementRef | undefined;


	sliderIndex: any = 0;
	displayMsg = '/- Per Order.';
	sliderUpdatedIndex: number = 0;
	public equityBlockTabValue = 'cash';
    public equityData: any[] = [
        {type: 'Intraday (%)', firstCurrent: '1.5', firstNew: '1.5', secondNew: '1.5', minimumCurrent: '1.5', minimumNew: '1.5'},
        {type: 'Delivery (%)', firstCurrent: '1.5', firstNew: '1.5', secondNew: '1.5', minimumCurrent: '1.5', minimumNew: '1.5'},
        {type: 'T2T (%)', firstCurrent: '1.5', firstNew: '1.5', secondNew: '1.5', minimumCurrent: '1.5', minimumNew: '1.5'}
    ]
    public futuresData: any[] = [
        {type: 'Intraday (%)', firstCurrent: '1.5', firstNew: '1.5', secondNew: '1.5', minimumCurrent: '1.5', minimumNew: '1.5'},
        {type: 'Day brokerage (%)', firstCurrent: '1.5', firstNew: '1.5', secondNew: '1.5', minimumCurrent: '1.5', minimumNew: '1.5'},
    ]
    public optionData: any[] = [
        {type: 'Intraday (%)', typeOption: 'Min: 12, Max: 100', firstCurrent: '1.5', firstNew: '1.5', secondNew: '1.5', minimumCurrent: '1.5', minimumNew: '1.5'},
        {type: 'Day brokerage (%)', typeOption: 'Zero % = Flat (Min: 0, Max: 2.5)', firstCurrent: '1.5', firstNew: '1.5', secondNew: '1.5', minimumCurrent: '1.5', minimumNew: '1.5'},
    ]
    public checkList: any[] = [
        { val: 'Equity', isChecked: true },
        { val: 'F&O', isChecked: false },
    ]
	public requestType: string = "Brokerage Request";
	public requestTypeData: any[] = [
		{ requestType: "Brokerage Request" }
	];

	clientCodeList: any[] = [];
	public buttonData: any[] = [
		{ name: 'Equity', value: 'cash' },
		{ name: 'Futures', value: 'futures' },
		{ name: 'Options', value: 'options' },
		{ name: 'Special Cases', value: 'special' }
	]
	flatBrokValue:string = "0"
	equityInput:boolean = false;
	isDropDownVisible: boolean = false;
	clientIdLimitErrMsg = "Client ID is required";
	Loadvalue = false;
	submitted = false;
	validation_messages = {
		cashIntradayMps: [
			{ type: 'required', message: 'MPS % is required'},
			{ type: 'min', message: 'MPS % Cannot be less than 0.01'},
			{ type: 'max', message: 'MPS % Cannot be more than 0.25'}
		],
		futureIntradayFirstSide: [
			{ type: 'min', message: ' Future Intra 1st side % Cannot be less than 0.001'},
			{ type: 'max', message: ' Future Intra 1st side % Cannot be more than 2.5'}
		],
		cashIntradayFirstSide: [
			{ type: 'required', message: '1st side(%) is required' },
			{ type: 'min', message: ' 1st side % Cannot be less than 0.001'},
			{ type: 'max', message: ' 1st side % Cannot be more than 2.5'}
		],
		cashDeliveryFirstSide:[
			{ type: 'required', message: '1st side(%) is required' },
			{ type: 'min', message: '1st side % Cannot be less than 0.05' },
			{ type: 'max', message: '1st side % Cannot be more than 100' }
		],
		cashDeliveryMps:[
			{ type: 'required', message: 'MPS % is required' },
			{ type: 'min', message: 'MPS % Cannot be less than 0.01' },
			{ type: 'max', message: 'MPS % Cannot be more than 0.25' }
		],
		cashT2TFirstSide:[
			{ type: 'required', message: '1st Side % is required' },
			{ type: 'min', message: '1st Side % Cannot be less than 0.05' },
			{ type: 'max', message: '1st Side % Cannot be more than 0.75' }
		],
		cashT2TMps:[
			{ type: 'required', message: 'MPS % is required' },
			{ type: 'min', message: 'MPS % Cannot be less than 0.01' },
			{ type: 'max', message: 'MPS % Cannot be more than 0.25' }
		],
		futureIntradayMps:[
			{ type: 'required', message: 'MPS(%) is required' },
			{ type: 'min', message: 'MPS % Cannot be less than 0.01' },
			{ type: 'max', message: 'MPS % Cannot be more than 0.25' }	
		],
		futureDeliveryMps:[
			{ type: 'required', message: 'MPS(%) is required' },
			{ type: 'min', message: 'MPS % Cannot be less than 0.01' },
			{ type: 'max', message: 'MPS % Cannot be more than 0.25' }	
		],
		optionPerLot:[
			{ type: 'required', message: 'Option Per Lot (Rs.) is required' },
			{ type: 'min', message: 'Min 2 Max 100' },
			{ type: 'max', message: 'Min 2 Max 100' },	
			{ type: 'optPerLotValid', message:'Options Per Lot cannot be greater than current options slab.'}
		],
		optionIndex:[
			{ type: 'required', message: 'Option Index (%) is required' },
			{ type: 'min', message: 'Option Index % should be between 0 to 2.5' },
			{ type: 'max', message: 'Option Index % should be between 0 to 2.5' }		
		]
	}
	brokTypeParams:any;
	cashIntra1stSideCurr:any;	
	cashIntra2ndSideCurr:any;
	cashIntraMpsCurr:any;
	cashDel1stCurr:any;
	cashDelMpsCurr:any;
	cashDelT2TCurr:any;
	cashDelT2TMpsCurr:any;
	futureIntra1stCurr:any;
	futureIntraMpsCurr:any;
	dayBrok1stCurr:any;
	dayBrokMpsCurr:any;
	optPerLotCurr:any;
	indexOptCurr:any;
	constructor(private formBuilder: FormBuilder, private storage: StorageServiceAAA, private wireReqService: WireRequestService, public toast: ToasterService, private router: Router, private platform: Platform,
		public commonService: CommonService, private route: ActivatedRoute, private modalController: ModalController) { 
			
		}
	ngOnChanges(changes: SimpleChanges): void {

		// console.log(this.brokerageType);
		this.updateStorage();
		if(this.brokerageType == "Permanent Brokerage"){
			this.brokerageForm.patchValue({
				EquityCheckbox:false,
				foCheckbox:false,
			  })
			
			  
		}
		if(this.brokerageType == "Permanent Brokerage" || this.brokerageType == "Hybrid Brokerage"){
			this.brokerageForm.patchValue({
					acceptTerms:false,
			  })
				this.brokerageForm.get("futureIntradayFirstSide")?.reset();
				this.brokerageForm.get("futureDeliveryFirstSide")?.reset();
				this.brokerageForm.get("futureIntradayMps")?.reset();
				this.brokerageForm.get("futureDeliveryMps")?.reset();
				this.brokerageForm.get("optionPerLot")?.reset();
				this.brokerageForm.get("optionIndex")?.reset();
				this.brokerageForm.get("cashIntradayFirstSide")?.reset();
				this.brokerageForm.get("cashDeliveryFirstSide")?.reset();
				this.brokerageForm.get("cashT2TFirstSide")?.reset();
				this.brokerageForm.get("cashIntradayMps")?.reset();
				this.brokerageForm.get("cashDeliveryMps")?.reset();
				this.brokerageForm.get("cashT2TMps")?.reset();

			  
		}
		
	
		if (this.platform.is('desktop') || this.passClientId) {
			if(this.currentBrokAPI && this.passClientId){
				this.currentHybBrokList(this.passClientId);
			}
		}
	}

	ngOnInit() {	
		this.updateStorage();																										
		// console.log(localStorage.getItem('setClientCode'));
		this.InitResetValue()
		// if(this.brokerageForm.controls && this.brokerageForm.controls['cashDeliveryFirstSide']){
		// 	this.brokerageForm.controls['cashDeliveryFirstSide'].setValue("0.05");
		// }
		if (!this.platform.is('desktop') && !this.passClientId) {
		this.brokerageForm.get('clientID')?.valueChanges.subscribe(val => {
			if(val === undefined || val == null ){
				this.passClientId = val;
				this.clientIdLimitErrMsg = "Client ID is required";
				this.passClientIdValidation = false;
			}
		  });
		
		
		  this.currentHybBrokList(localStorage.getItem('setClientCode'))
		} 

		

		this.noCurrentData();
		
	}

	private updateStorage() {
		if (this.brokerageType == "Permanent Brokerage") {
		  this.brokTypeParams = 'P';
		} else if (this.brokerageType == "Hybrid Brokerage") {
		  this.brokTypeParams = 'H';
		}
	
		localStorage.setItem('brokTypeParams', this.brokTypeParams);
	  }

	InitResetValue(){
		this.brokerageForm = this.formBuilder.group({
			cashIntradayFirstSide: [null, [Validators.required, Validators.min(0.001), Validators.max(2.5)]],
			cashIntradaySecondSide: [null],
			cashIntradayMps: [null, [Validators.required, Validators.min(0.01), Validators.max(0.25)]],
			cashDeliveryFirstSide: [null, [Validators.required, Validators.min(0.05), Validators.max(100)]],
			cashDeliveryMps: [null, [Validators.required, Validators.min(0.01), Validators.max(0.25)]],
			cashT2TFirstSide: [null, [Validators.required, Validators.min(0.05), Validators.max(0.75)]],
			cashT2TMps: [null, [Validators.required, Validators.min(0.01), Validators.max(0.25)]],
			// futureIntradayFirstSide: [null, Validators.min(0)],
			futureIntradayFirstSide: [null, [Validators.min(0.001), Validators.max(2.5)]],
			futureIntradaySecondSide: [null],
			futureIntradayMps: [null, [Validators.required, Validators.min(0.01), Validators.max(0.25)]],
			futureDeliveryFirstSide: [null],
			futureDeliveryMps: [null, [Validators.required, Validators.min(0.01), Validators.max(0.25)]],
			optionPerLot: [null, [Validators.required, Validators.min(2), Validators.max(100),this.optPerLotValidator.bind(this)]],
			optionIndex: ['0.00'],
			acceptTerms: [false],
			clientID: [null],
			EquityCheckbox:[false],
			foCheckbox:[false]

		},
		// { updateOn: 'blur' }
		)
		this.brokerageForm.get('optionIndex')?.disable();
		this.submitted = false;
	}

	noCurrentData(){
		this.cashIntradaySecondSideVal = '-'
		this.futureIntradaySecondSideVal = '-'
		this.cashIntra1stSideCurr = '-'
		this.cashIntra2ndSideCurr = '-'
		this.cashIntraMpsCurr = '-'
		this.cashDel1stCurr = '-'
		this.cashDelMpsCurr = '-'
		this.cashDelT2TCurr = '-'
		this.cashDelT2TMpsCurr = '-'
		this.futureIntra1stCurr = '-'
		this.futureIntraMpsCurr = '-'
		this.dayBrok1stCurr = '-'
		this.dayBrokMpsCurr = "-"
		this.optPerLotCurr = '-'
		this.indexOptCurr = '-'
	}

	onInputChange(event: any){
		this.brokerageForm.controls['cashIntradaySecondSide'].setValue(this.brokerageForm.controls['cashIntradayFirstSide'].value);
	}

	onInputChangeSecond(event: any) {
		this.brokerageForm.controls['futureDeliveryMps'].setValue(this.brokerageForm.controls['futureIntradayMps'].value);
	}

	onInputChangeFirst(event: any){
		this.brokerageForm.controls['futureIntradaySecondSide'].setValue(this.brokerageForm.controls['futureIntradayFirstSide'].value);
		this.brokerageForm.controls['futureDeliveryFirstSide'].setValue(this.brokerageForm.controls['futureIntradayFirstSide'].value);
	}

	currentHybBrokList(clientId?: any){
		this.InitResetValue();
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.getCurrentBrokList(token, clientId)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.getCurrentBrokList(token, clientId)
				})
			}
		})

		if(this.brokerageType == "Permanent Brokerage"){
			this.brokerageForm.patchValue({
				EquityCheckbox:false,
				foCheckbox:false
			  })
		}
		
	}

	getCurrentBrokList(token: any, clientId: any){
		this.dataLoad = false;
		this.wireReqService.getBrokerageCurrentData(token, clientId).subscribe((res: any) => {
			this.dataLoad = true;
			if(res['Head']['ErrorCode'] == 0){
				this.cashIntra1stSideCurr = res['Body']['objHybridBrokerageRequestResBody'][0].CashIdayIst;
				this.cashIntra2ndSideCurr = res['Body']['objHybridBrokerageRequestResBody'][0].CashIdayIInd
				this.cashIntraMpsCurr = res['Body']['objHybridBrokerageRequestResBody'][0].CashIdayMPS
				this.cashDel1stCurr = res['Body']['objHybridBrokerageRequestResBody'][0].CashDelIst
				this.cashDelMpsCurr = res['Body']['objHybridBrokerageRequestResBody'][0].CashDelMPS
				this.cashDelT2TCurr = res['Body']['objHybridBrokerageRequestResBody'][0].CashDelT2T
				this.cashDelT2TMpsCurr = res['Body']['objHybridBrokerageRequestResBody'][0].CashDelT2TMPS

				this.futureIntra1stCurr = res['Body']['objHybridBrokerageRequestResBody'][0].FAOIdayIst
				this.futureIntraMpsCurr = res['Body']['objHybridBrokerageRequestResBody'][0].FAOIdayMps
				this.dayBrok1stCurr = res['Body']['objHybridBrokerageRequestResBody'][0].IstSideFAODayBrk
				this.dayBrokMpsCurr = res['Body']['objHybridBrokerageRequestResBody'][0].FAOBrkMPS
				this.optPerLotCurr = res['Body']['objHybridBrokerageRequestResBody'][0].BrkPerLot
				this.indexOptCurr = res['Body']['objHybridBrokerageRequestResBody'][0].Indexoption
			}
			else{
				this.noCurrentData();
			}
			// console.log(res);
		})
	}

	ionViewWillEnter() {
		if (!this.platform.is('desktop')) {
			this.route.params.subscribe(params => {
				if (params) {
					this.brokTypeParams = params['id'];
		
					
				}
			});
		}
	
		this.equityBlockTabValue = 'cash';
		//this.clientCodeList = JSON.parse(localStorage.getItem("clientListWireRequest"));
		this.storage.get('setClientCodes').then((clientCodes) => {
			this.clientCodeList = clientCodes;
		})
	}

	equityCheckboxClick(event: any){
		// console.log(this.brokerageForm.get('EquityCheckbox').value);
		// console.log(this.brokerageForm.get('foCheckbox').value);
		if(this.brokerageForm.get('EquityCheckbox')?.value || this.brokerageForm.get('foCheckbox')?.value){
			this.flatBrokValue = "20"
		}
		else if(!this.brokerageForm.get('EquityCheckbox')?.value && !this.brokerageForm.get('foCheckbox')?.value){
			this.flatBrokValue = "0"
		}
		 
		if ((!this.brokerageForm.get('EquityCheckbox')?.value && !this.brokerageForm.get('foCheckbox')?.value)) {
			this.displayMsg = '/- Per Order.'
		} else if ((this.brokerageForm.get('EquityCheckbox')?.value && this.brokerageForm.get('foCheckbox')?.value)) {
			this.displayMsg = '/- Per Order.'
		} else if (this.brokerageForm.get('EquityCheckbox')?.value && !this.brokerageForm.get('foCheckbox')?.value) {
			this.displayMsg = '/- Per Order in Cash Segment.'
		} else if (!this.brokerageForm.get('EquityCheckbox')?.value && this.brokerageForm.get('foCheckbox')?.value) {
			this.displayMsg = '/- Per Order in F&O Segment'
		}
		// console.log(this.brokerageForm.get('EquityCheckbox').value)
		// console.log(this.brokerageForm.get('foCheckbox').value)
		// console.log(event);
			if(event == true){
				this.equityInput = true;
				this.brokerageForm.controls['acceptTerms'].disable()
				this.brokerageForm.patchValue({
				cashIntradayFirstSide : "0.00",
				cashIntradaySecondSide : "0.00",
				cashIntradayMps : "0.00",
				cashDeliveryFirstSide: "0.00",
				cashDeliveryMps: "0.00",
				cashT2TFirstSide: "0.00",
				cashT2TMps:"0.00"
			  }) 
			  this.equityFormStatus('0')

			}
			else{
				this.equityInput = false;
				//this.flatBrokValue = "0"
				//this.brokerageForm.controls['cashIntradayFirstSide'].enable()
				this.brokerageForm.patchValue({
					cashIntradayFirstSide : null,
					cashIntradaySecondSide : null,
					cashIntradayMps : null,
					cashDeliveryFirstSide: null,
					cashDeliveryMps: null,
					cashT2TFirstSide: null,
					cashT2TMps:null
				  })
				  this.equityFormStatus('1')
			}
		}

	foCheckboxClick(event: any){
		if(this.brokerageForm.get('EquityCheckbox')?.value || this.brokerageForm.get('foCheckbox')?.value){
			this.flatBrokValue = "20"
		}
		else if(!this.brokerageForm.get('EquityCheckbox')?.value && !this.brokerageForm.get('foCheckbox')?.value){
			this.flatBrokValue = "0"
		}
		if ((!this.brokerageForm.get('EquityCheckbox')?.value && !this.brokerageForm.get('foCheckbox')?.value)) {
			this.displayMsg = '/- Per Order.'
		} else if ((this.brokerageForm.get('EquityCheckbox')?.value && this.brokerageForm.get('foCheckbox')?.value)) {
			this.displayMsg = '/- Per Order.'
		} else if (this.brokerageForm.get('EquityCheckbox')?.value && !this.brokerageForm.get('foCheckbox')?.value) {
			this.displayMsg = '/- Per Order in Cash Segment.'
		} else if (!this.brokerageForm.get('EquityCheckbox')?.value && this.brokerageForm.get('foCheckbox')?.value) {
			this.displayMsg = '/- Per Order in F&O Segment'
		}		 
		if(event == true){
			this.foInputs = true;
			this.flatBrokValue = "20"
			this.brokerageForm.controls['acceptTerms'].disable()
			this.brokerageForm.patchValue({
			futureIntradayFirstSide: "0.00",
			futureIntradaySecondSide: "0.00",
			futureIntradayMps: "0.00",
			futureDeliveryFirstSide: "0.00",
			futureDeliveryMps: "0.00",
			optionPerLot: "0.00",
			optionIndex:"0.00"
		  }) 
		  this.futureOpFormStatus('0')
		}
		else{
			//this.flatBrokValue = "0"
			this.foInputs = false;
			this.brokerageForm.controls['acceptTerms'].enable()
			this.brokerageForm.patchValue({
			futureIntradayFirstSide: null,
			futureIntradaySecondSide: null,
			futureIntradayMps: null,
			futureDeliveryFirstSide: null,
			futureDeliveryMps: null,
			optionPerLot: null,
			optionIndex:null
		  }) 
		  this.futureOpFormStatus('1')
		}
	}

	equityFormStatus(status: any){
		if(status == '0'){
			this.brokerageForm.get('cashIntradayFirstSide')?.disable()
			this.brokerageForm.get('cashIntradaySecondSide')?.disable()
			this.brokerageForm.get('cashIntradayMps')?.disable()
			this.brokerageForm.get('cashDeliveryFirstSide')?.disable()
			this.brokerageForm.get('cashDeliveryMps')?.disable()
			this.brokerageForm.get('cashT2TFirstSide')?.disable()
			this.brokerageForm.get('cashT2TMps')?.disable()

			// To pre-fill current brokerage for Futures and Options if Equity = true
			if(this.brokerageForm.get('EquityCheckbox')?.value && !this.brokerageForm.get('foCheckbox')?.value){
				// this.brokerageForm.get("futureIntradayFirstSide").setValue(this.futureIntra1stCurr);
				// this.brokerageForm.get("futureDeliveryFirstSide").setValue(this.dayBrok1stCurr);
				// this.brokerageForm.get("futureIntradayMps").setValue(this.dayBrok1stCurr);
				// this.brokerageForm.get("futureDeliveryMps").setValue(this.dayBrokMpsCurr);
				// this.brokerageForm.get("optionPerLot").setValue(this.optPerLotCurr);
				// this.brokerageForm.get("optionIndex").setValue(this.indexOptCurr); 
				this.brokerageForm.get('futureDeliveryFirstSide')?.disable();
				this.brokerageForm.get('futureIntradaySecondSide')?.disable();
				this.brokerageForm.get('futureDeliveryMps')?.enable();
				this.brokerageForm.get('optionIndex')?.disable();
				this.brokerageForm.get("futureIntradayFirstSide")?.enable();
				this.brokerageForm.get("futureDeliveryFirstSide")?.enable();
				this.brokerageForm.get("futureIntradayMps")?.enable();
				this.brokerageForm.get("futureDeliveryMps")?.enable();
				this.brokerageForm.get("optionPerLot")?.enable();
				this.brokerageForm.get("optionIndex")?.enable(); 
			}
		}
		else{
			if(this.brokerageForm.get('EquityCheckbox')?.value && !this.brokerageForm.get('foCheckbox')?.value){
			this.brokerageForm.get('cashIntradayFirstSide')?.enable()
			this.brokerageForm.get('cashIntradaySecondSide')?.enable()
			this.brokerageForm.get('cashIntradayMps')?.enable()
			this.brokerageForm.get('cashDeliveryFirstSide')?.enable()
			this.brokerageForm.get('cashDeliveryMps')?.enable()
			this.brokerageForm.get('cashT2TFirstSide')?.enable()	
			this.brokerageForm.get('cashT2TMps')?.enable()

			// To reset current brokerage for Futures and Options if Equity = false
			this.brokerageForm.get("futureIntradayFirstSide")?.setValue(null);
			this.brokerageForm.get("futureDeliveryFirstSide")?.setValue(null);
			this.brokerageForm.get("futureIntradayMps")?.setValue(null);
			this.brokerageForm.get("futureDeliveryMps")?.setValue(null);
			this.brokerageForm.get("optionPerLot")?.setValue(null);
			this.brokerageForm.get("optionIndex")?.setValue(null);
			}			 
			if((!this.brokerageForm.get('EquityCheckbox')?.value && this.brokerageForm.get('foCheckbox')?.value)||(!this.brokerageForm.get('EquityCheckbox')?.value && !this.brokerageForm.get('foCheckbox')?.value)){
				this.brokerageForm.get('cashIntradayFirstSide')?.enable()
				this.brokerageForm.get('cashIntradaySecondSide')?.enable()
				this.brokerageForm.get('cashIntradayMps')?.enable()
				this.brokerageForm.get('cashDeliveryFirstSide')?.enable()
				this.brokerageForm.get('cashDeliveryMps')?.enable()
				this.brokerageForm.get('cashT2TFirstSide')?.enable()	
				this.brokerageForm.get('cashT2TMps')?.enable()
			}
		
		}
	}

	futureOpFormStatus(status: any){
		if(status == '0'){
			this.brokerageForm.get('futureIntradayFirstSide')?.disable()
			this.brokerageForm.get('futureIntradaySecondSide')?.disable()
			this.brokerageForm.get('futureIntradayMps')?.disable()
			this.brokerageForm.get('futureDeliveryFirstSide')?.disable()
			this.brokerageForm.get('futureDeliveryMps')?.disable()
			this.brokerageForm.get('optionPerLot')?.disable()
			this.brokerageForm.get('optionIndex')?.disable()

			// To  pre-fill current brokerage for Equity if F&O = false
			if(!this.brokerageForm.get('EquityCheckbox')?.value && this.brokerageForm.get('foCheckbox')?.value){
				// this.brokerageForm.get("cashIntradayFirstSide").setValue(this.cashIntra1stSideCurr);
				// this.brokerageForm.get("cashDeliveryFirstSide").setValue(this.cashDel1stCurr);
				// this.brokerageForm.get("cashT2TFirstSide").setValue(this.cashDelT2TCurr);
				// this.brokerageForm.get("cashIntradayMps").setValue(this.cashIntraMpsCurr);
				// this.brokerageForm.get("cashDeliveryMps").setValue(this.cashDelMpsCurr);
				// this.brokerageForm.get("cashT2TMps").setValue(this.cashDelT2TMpsCurr); 
				
				
				this.brokerageForm.get("cashIntradayFirstSide")?.enable();
				this.brokerageForm.get("cashDeliveryFirstSide")?.enable();
				this.brokerageForm.get("cashT2TFirstSide")?.enable();
				this.brokerageForm.get("cashIntradayMps")?.enable();
				this.brokerageForm.get("cashDeliveryMps")?.enable();
				this.brokerageForm.get("cashT2TMps")?.enable();
			}
		}
		else{
			if(!this.brokerageForm.get('EquityCheckbox')?.value && this.brokerageForm.get('foCheckbox')?.value){

			this.brokerageForm.get('futureIntradayFirstSide')?.enable()
			this.brokerageForm.get('futureIntradaySecondSide')?.disable()
			this.brokerageForm.get('futureIntradayMps')?.enable()
			this.brokerageForm.get('futureDeliveryFirstSide')?.disable()
			this.brokerageForm.get('futureDeliveryMps')?.enable()
			this.brokerageForm.get('optionPerLot')?.enable()
			this.brokerageForm.get('optionIndex')?.disable()

			// To reset current brokerage for Equity if F&O = false
			this.brokerageForm.get("cashIntradayFirstSide")?.setValue(null);
			this.brokerageForm.get("cashDeliveryFirstSide")?.setValue(null);
			this.brokerageForm.get("cashT2TFirstSide")?.setValue(null);
			this.brokerageForm.get("cashIntradayMps")?.setValue(null);
			this.brokerageForm.get("cashDeliveryMps")?.setValue(null);
			this.brokerageForm.get("cashT2TMps")?.setValue(null);	
			}	
			if((this.brokerageForm.get('EquityCheckbox')?.value && !this.brokerageForm.get('foCheckbox')?.value) || (!this.brokerageForm.get('EquityCheckbox')?.value && !this.brokerageForm.get('foCheckbox')?.value)){
				this.brokerageForm.get('futureIntradayFirstSide')?.enable()
				this.brokerageForm.get('futureIntradaySecondSide')?.disable()
				this.brokerageForm.get('futureIntradayMps')?.enable()
				this.brokerageForm.get('futureDeliveryFirstSide')?.disable()
				this.brokerageForm.get('futureDeliveryMps')?.enable()
				this.brokerageForm.get('optionPerLot')?.enable()
				this.brokerageForm.get('optionIndex')?.disable()
			}	
			 
		}
	}
	
	segmentChange(event: any) {
		if (this.equityBlockTabValue === 'cash') {
			this.sliderUpdatedIndex = 0;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		} else if (this.equityBlockTabValue === 'futures') {
			this.sliderUpdatedIndex = 1;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		} else if (this.equityBlockTabValue === 'options') {
			this.sliderUpdatedIndex = 2;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		} else if (this.equityBlockTabValue === 'special') {
			this.sliderUpdatedIndex = 3;
			this.sliderUpdated?.nativeElement.swiper.slideTo(this.sliderUpdatedIndex);
		}
	}

	submitBrokerge() {
		this.commonService.setClevertapEvent('Brokerage_Modification');
		this.commonService.analyticEvent('Brokerage_Modification', 'Wire Reports');
		this.storage.get('userID').then((userID) => {
		this.storage.get('userType').then(type => {
			if (type === 'RM' || type === 'FAN') {
				this.storage.get('bToken').then(token => {
					this.submitReq(token, userID)
				})
			} else {
				this.storage.get('subToken').then(token => {
					this.submitReq(token, userID)
				})
			}
		})
		})
	}

	submitReq(token: any, userID: any) {
		this.submitted = true;
		if (this.brokerageForm.invalid) {
			// console.log('not validate')
            return;
        }
		this.dataLoad = true;
		// console.log('exist')
		let clientObj = {clientID: this.platform.is('desktop') ? this.passClientId : localStorage.getItem('setClientCode')};
		// console.log(clientObj);
		// console.log(this.cleintIdData);
		let parameters;
		let obj: any;

		//obj = { ...this.brokerageForm.value, ...clientObj };

		if(this.brokerageForm.get('EquityCheckbox')?.value && this.brokerageForm.get('foCheckbox')?.value){
			parameters = {
				"cashDeliveryFirstSide": "0.05",
				"cashIntradayFirstSide": "0.01",
				"cashIntradayMps": "0.00",
				"cashIntradaySecondSide": "0.00",
				"cashDeliveryMps": "0.00",
				"cashT2TFirstSide": "0.00",
				"cashT2TMps": "0.00",
				"CashOrdFlag":"1",
				"FaoOrdFlag":"1",
				"BrkOrdwise":"20",
				"futureDeliveryFirstSide": "0.00",
				"futureDeliveryMps": "0.00",
				"futureIntradayFirstSide": "0.00",
				"futureIntradayMps": "0.00",
				"futureIntradaySecondSide": "0.00",
				"optionIndex": "0.00",
				"optionPerLot": "0.00",
			}
			obj = {...parameters, ...this.brokerageForm.value, ...clientObj }
		}	
		
		else if(this.brokerageForm.get('EquityCheckbox')?.value || this.brokerageForm.get('foCheckbox')?.value){
			if(this.brokerageForm.get('EquityCheckbox')?.value){
				parameters = {
					"cashDeliveryFirstSide": "0.00",
					"cashIntradayFirstSide": "0.00",
					"cashIntradayMps": "0.00",
					"cashIntradaySecondSide": "0.00",
					"cashDeliveryMps": "0.00",
					"cashT2TFirstSide": "0.00",
					"cashT2TMps": "0.00",
					"CashOrdFlag":"1",
					"FaoOrdFlag":"0",
					"BrkOrdwise":"20"
				}
				obj = {...parameters, ...this.brokerageForm.value, ...clientObj }
			}
			else if(this.brokerageForm.get('foCheckbox')?.value){
				parameters = {
					"futureDeliveryFirstSide": "0.00",
					"futureDeliveryMps": "0.00",
					"futureIntradayFirstSide": "0.00",
					"futureIntradayMps": "0.00",
					"futureIntradaySecondSide": "0.00",
					"optionIndex": "0.00",
					"optionPerLot": "0.00",
					"CashOrdFlag":"0",
					"FaoOrdFlag":"1",
					"BrkOrdwise":"20"
				}
				obj = {...parameters, ...this.brokerageForm.value, ...clientObj }
			}
		}
		else{
			parameters = {
				"CashOrdFlag":"0",
				"FaoOrdFlag":"0",
				"BrkOrdwise":"0"
			}
			obj = {...parameters, ...this.brokerageForm.value, ...clientObj }
		}
		if (this.brokerageForm.controls['acceptTerms'].value) {
			obj['cashIntradaySecondSide'] = '0.0';
			obj['futureIntradaySecondSide'] = '0.0';
		}
			
		// if (this.platform.is('desktop')) {
		// 	obj = { ...this.brokerageForm.value, ...clientObj };
		// }
		// else{
		// 	obj = this.brokerageForm.value;
		// }
		// console.log(obj);
		var payload = { "UserCode": this.passClientId, "UserType": "4" };
		this.wireReqService.getProfileDetails(token, payload).subscribe((res: any) => {
			if (res['Head']['ErrorCode'] == 0) {
				let prodMsg = `Client is mapped to ${res['Body']['ProductName']} and brokerage request cannot be placed for the same. If still you want to place request than kindly deactivate existing plan.`;
				let freezMsg = 'Brokerage request cannot be placed for freezed client.';

				if (res['Body'] && (res['Body']['FreezeYN'] && res['Body']['FreezeYN'] === 'Y') && (res['Body']['ProductName'] && res['Body']['ProductName'] === 'IIFLFIT' || res['Body']['ProductName'] === 'IPRIME' || res['Body']['ProductName'] === 'IINVEST' || res['Body']['ProductName'] === 'IVALUE' || res['Body']['ProductName'] === 'iServeP')) {
					this.dataLoad = true;
					this.openPopUp(prodMsg, freezMsg);
				} else if (res['Body'] && res['Body']['ProductName'] && res['Body']['ProductName'] === 'IIFLFIT' || res['Body']['ProductName'] === 'IPRIME' || res['Body']['ProductName'] === 'IINVEST' || res['Body']['ProductName'] === 'IVALUE' || res['Body']['ProductName'] === 'iServeP') {
					this.toast.displayToast(prodMsg);
					this.dataLoad = true;
				} else if (res['Body'] && res['Body']['FreezeYN'] && res['Body']['FreezeYN'] === 'Y') {
					this.toast.displayToast(freezMsg);
					this.dataLoad = true;
				} else {
					this.wireReqService.getBrokerageInsert(token, obj, userID).subscribe((res: any) => {
						setTimeout(() => {
							this.dataLoad = true;
						}, 500);
						if (res['Head']['ErrorCode'] == 0) {
							if (res['Body']['Message'] == 'Success') {
								this.toast.displayToast("Brokerage Request has been Inserted Successfully");
								setTimeout(() => {
									this.brokerageForm.reset()
									this.passClientIdFieled.emit(this.passClientId)
								}, 2000);
							}
							else {
								this.toast.displayToast(res['Body']['Message']);
							}
						}
						else {
							this.toast.displayToast(res['Head']['ErrorDescription']);
						}
					})
				}
			}
		})
	}

	async openPopUp(m1: any, m2: any) {
		let msgList:any = [];
		msgList.push(m1, m2);
		const modal = await this.modalController.create({
			component: MessagePopup,
			componentProps: { msgList },
			cssClass: 'msgpopup'
		});
		return await modal.present();
	}

	// for mobile when slide change get slide index value, and do functionality on base that
	async slideChanged(ev: any) {
		ev.preventDefault();
		ev.stopPropagation();
		this.sliderUpdatedIndex = await this.sliderUpdated?.nativeElement.swiper.activeIndex;

		if (this.sliderUpdatedIndex === 0) {
			this.equityBlockTabValue = 'cash';
		} else if (this.sliderUpdatedIndex === 1) {
			this.equityBlockTabValue = 'futures';
		} else if (this.sliderUpdatedIndex === 2) {
			this.equityBlockTabValue = 'options';
		} else if (this.sliderUpdatedIndex === 3) {
			this.equityBlockTabValue = 'special';
		}
	}

	goBack() {
		window.history.back();
	}

	showDropDown() {
		this.isDropDownVisible = true;
		//this.clientId = '';
	}

	hideDropDown() {
		setTimeout(() => {
			this.isDropDownVisible = false;
		}, 500);
	}

	inputClientId(event: any) {
		// console.log(event);
		if ( event === undefined ||  event == null) {
			this.clientIdLimitErrMsg = "Client ID is required";
			this.passClientIdValidation = false;
		} else {
			this.clientIdLimitErrMsg = "";
			// this.brokerageForm.patchValue({
			// 	clientID : data.ClientCode
			//   }) 
			this.passClientIdValidation = true;
		}
		
   }

   get f() { return this.brokerageForm.controls; }

	displayClientDetails(data: any) {
		this.clientIdLimitErrMsg = "";
		this.brokerageForm.patchValue({
			clientID : data.ClientCode
		  }) 
		this.passClientIdValidation = true;
	}

	/**
	* To not allow user to enter Options Per Lot more than current options per lot.
	* @param control
	* @returns 
	*/
	optPerLotValidator(control: AbstractControl): { [key: string]: boolean } | null {
		if (this.optPerLotCurr === '-' || this.optPerLotCurr <= 2 || this.optPerLotCurr >= 100) return null;
		if (control.value !== undefined && (isNaN(control.value) || control.value < 2 || control.value > this.optPerLotCurr)) {
			return { 'optPerLotValid': true };
		}
		return null;
	}
}