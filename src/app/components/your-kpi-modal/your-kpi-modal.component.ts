import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormatUnitNumberPipe } from '../../helpers/formatnumberunit.pipe';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-your-kpi-modal',
  providers: [FormatUnitNumberPipe],
  templateUrl: './your-kpi-modal.component.html',
  styleUrls: ['./your-kpi-modal.component.scss'],
})
export class YourKpiModalComponent implements OnInit {
  @Input() datas: any;
  barIncomeRevenue:any = 0;
  barIncometopPerformer:any = 0;
  barNetAUM:any = 0;
  barNetAUMPerformer:any = 0;
  barAcquisition:any = 0;
  barAcquisitionPerformer:any = 0;
  topIRPerformer:boolean = false;
  topNAPerformer:boolean = false;
  topCAPerformer:boolean = false;
  userChannel: any = null;
  filteredData: any;
	externalVariable!: any[];
  topFAPerformer:any;
  barFanAcquisition:any;
  barFanIRAcquisition:any;
  barFanAcquisitionPerformer:any;
  barFanIRAcquisitionPerformer:any;
  topFanIRPerformer:any;
  barCrossSellIRAcquisition:any;
  barCrossSellIRAcquisitionPerformer:any;
  topCrossSellIRPerformer:any;
  barCollectionAcquisition:any;
  barCollectionAcquisitionPerformer:any;
  topCollectionPerformer:any;
  barAccountActivationAcquisition:any;
  barAccountActivationAcquisitionPerformer:any;
  topAccountActivationPerformer:any;
  userType = null;
  isAUMCollectionTragetAchieved: boolean =  false;

  constructor(private modalController: ModalController, private formatUnit: FormatUnitNumberPipe, private storage: StorageServiceAAA,) { }

  ngOnInit() {
    this.checkIfAUMCollectionTragetAchieved();
    this.storage.get('userType').then(type => {
      this.userType = type;
      
    });
    this.userChannel = localStorage.getItem('userChannel');
    //Income Revenue
    let dataIR = this.datas.ir == " " ? 0 : this.datas.ir;
    let dataIRTarget = this.datas.irtarget == " " ? 0 : this.datas.irtarget;
    let dataIRPerformer = this.datas.TPIRscore == " " ? 0 : this.datas.TPIRscore;
    this.barIncomeRevenue = parseInt(dataIR) > parseInt(dataIRTarget) ? 100 : (dataIR/ dataIRTarget)*100;
    this.barIncometopPerformer = parseInt(dataIRPerformer) > parseInt(dataIRTarget) ? 100 : (dataIRPerformer/ dataIRTarget)*100;
    this.topIRPerformer = parseInt(dataIR) > parseInt(dataIRPerformer);
    
    //Net AUM
    let dataNA = this.datas.newcoll == " " ? 0 : this.datas.newcoll;
    let dataNATarget = this.datas.newcolltarget == " " ? 0 : this.datas.newcolltarget;
    let dataNAPerformer = this.datas.TPAUMScore == " " ? 0 : this.datas.TPAUMScore;
    //console.log('NAvalue', dataNA, '2T', dataNATarget, dataNAPerformer);
    //console.log('NAvalue', dataNA >= dataNATarget);
    this.barNetAUM = parseInt(dataNA) >= parseInt(dataNATarget) ? 100 : (dataNA/ dataNATarget)*100;
    this.barNetAUMPerformer = parseInt(dataNAPerformer) >= parseInt(dataNATarget) ? 100 : (dataNAPerformer/ dataNATarget)*100;
    this.topNAPerformer = parseInt(dataNA) > parseInt(dataNAPerformer);
    //Clients Acquisition
    let dataCA = this.datas.newactive == " " ? 0 : this.datas.newactive;
    let dataCATarget = this.datas.newactvtarget == " " ? 0 : this.datas.newactvtarget;
    let dataCAPerformer = this.datas.TPActvscore == " " ? 0 : this.datas.TPActvscore;
    this.barAcquisition = parseInt(dataCA) >= parseInt(dataCATarget) ? 100 : (dataCA/ dataCATarget)*100;
    this.barAcquisitionPerformer = parseInt(dataCAPerformer) >= parseInt(dataCATarget) ? 100 : (dataCAPerformer/ dataCATarget)*100;
    this.topCAPerformer = parseInt(dataCA) > parseInt(dataCAPerformer);

    //Fan Acquisition
    let dataFA = this.datas.FanAcquisitionAchievedScore == " " ? 0 : this.datas.FanAcquisitionAchievedScore;
    let dataFATarget = this.datas.FanAcquisitionTargetScore == " " ? 0 : this.datas.FanAcquisitionTargetScore;
    let dataFAPerformer = this.datas.FanAcquisitionTopPerformerScore == " " ? 0 : this.datas.FanAcquisitionTopPerformerScore;
    this.barFanAcquisition = parseInt(dataFA) >= parseInt(dataFATarget) ? 100 : (dataFA/ dataFATarget)*100;
    this.barFanAcquisitionPerformer = parseInt(dataFAPerformer) >= parseInt(dataFATarget) ? 100 : (dataFAPerformer/ dataFATarget)*100;
    this.topFAPerformer = parseInt(dataFA) >= parseInt(dataFAPerformer);
    // New Fan IR
    let dataFanIR = this.datas.NewFanIRAchievedScore == " " ? 0 : this.datas.NewFanIRAchievedScore;
    let dataFanIRTarget = this.datas.NewFanIRTargetScore == " " ? 0 : this.datas.NewFanIRTargetScore;
    let dataFanIRPerformer = this.datas.NewFanIRTopPerformerScore == " " ? 0 : this.datas.NewFanIRTopPerformerScore;
    this.barFanIRAcquisition = parseInt(dataFanIR) >= parseInt(dataFanIRTarget) ? 100 : (dataFanIR/ dataFanIRTarget)*100;
    this.barFanIRAcquisitionPerformer = parseInt(dataFanIRPerformer) >= parseInt(dataFanIRTarget) ? 100 : (dataFanIRPerformer/ dataFanIRTarget)*100;
    this.topFanIRPerformer = parseInt(dataFanIR) >= parseInt(dataFanIRPerformer);
    //Cross Sell IR
    let dataCrossSellIR = this.datas.CrossSellIRAchievedScore == " " ? 0 : this.datas.CrossSellIRAchievedScore;
    let dataCrossSellIRTarget = this.datas.CrossSellIRTargetScore == " " ? 0 : this.datas.CrossSellIRTargetScore;
    let dataCrossSellIRPerformer = this.datas.CrossSellIRTopPerformerScore == " " ? 0 : this.datas.CrossSellIRTopPerformerScore;
    this.barCrossSellIRAcquisition = parseInt(dataCrossSellIR) >= parseInt(dataCrossSellIRTarget) ? 100 : (dataCrossSellIR/ dataCrossSellIRTarget)*100;
    this.barCrossSellIRAcquisitionPerformer = parseInt(dataCrossSellIRPerformer) >= parseInt(dataCrossSellIRTarget) ? 100 : (dataCrossSellIRPerformer/ dataCrossSellIRTarget)*100;
    this.topCrossSellIRPerformer = parseInt(dataCrossSellIR) >= parseInt(dataCrossSellIRPerformer);
    //AUM Collection
    let dataCollection = this.datas.AUMCollectionAchievedScore == " " ? 0 : this.datas.AUMCollectionAchievedScore;
    let dataCollectionTarget = this.datas.AUMCollectionTargetScore == " " ? 0 : this.datas.AUMCollectionTargetScore;
    let dataCollectionPerformer = this.datas.AUMCollectionTopPerformerScore == " " ? 0 : this.datas.AUMCollectionTopPerformerScore;
    this.barCollectionAcquisition = parseInt(dataCollection) >= parseInt(dataCollectionTarget) ? 100 : (dataCollection/ dataCollectionTarget)*100;
    this.barCollectionAcquisitionPerformer = parseInt(dataCollectionPerformer) >= parseInt(dataCollectionTarget) ? 100 : (dataCollectionPerformer/ dataCollectionTarget)*100;
    this.topCollectionPerformer = parseInt(dataCollection) >= parseInt(dataCollectionPerformer);
    //Account Activation
    let dataAccountActivation = this.datas.AccountActivationAchievedScore == " " ? 0 : this.datas.AccountActivationAchievedScore;
    let dataAccountActivationTarget = this.datas.AccountActivationTargetScore == " " ? 0 : this.datas.AccountActivationTargetScore;
    let dataAccountActivationPerformer = this.datas.AccActivationTopPerformerScore == " " ? 0 : this.datas.AccActivationTopPerformerScore;
    this.barAccountActivationAcquisition = parseInt(dataAccountActivation) >= parseInt(dataAccountActivationTarget) ? 100 : (dataAccountActivation/ dataAccountActivationTarget)*100;
    this.barAccountActivationAcquisitionPerformer = parseInt(dataAccountActivationPerformer) >= parseInt(dataAccountActivationTarget) ? 100 : (dataAccountActivationPerformer/ dataAccountActivationTarget)*100;
    this.topAccountActivationPerformer = parseInt(dataAccountActivation) >= parseInt(dataAccountActivationPerformer);
     
  }



  dismisss(){
    this.modalController.dismiss();
   }
    
   
   checkIfAUMCollectionTragetAchieved = () => {
    
    // if(parseFloat(this.datas.AUMCollectionTargetScore) >= parseFloat(this.datas.AUMCollectionAchievedScore)){
    //   this.isAUMCollectionTragetAchieved = true;
    //   return;
    // }
    // if(parseFloat(this.datas.AUMCollectionTargetScore) < parseFloat(this.datas.AUMCollectionAchievedScore)){
    //   this.isAUMCollectionTragetAchieved = false;
    // }
    this.isAUMCollectionTragetAchieved = parseFloat(this.datas.AUMCollectionTargetScore) >= parseFloat(this.datas.AUMCollectionAchievedScore);
  }

}
