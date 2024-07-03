import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { CommonService } from '../../helpers/common.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
    selector: 'app-total-afyp',
    templateUrl: './total-afyp.component.html',
    styleUrls: ['./total-afyp.component.scss'],
})
export class TotalAfypComponent implements OnInit {
    @ViewChild('dognutChart') dognutChart: any;
    @Input() totalAFYPTabData: any;
	@Input() chartData: any;
    public clientCode: any = null;
	public searchTerm: any = null;
    public insuranceBlockTabValue: any = 'life';
    public dognut: any;
    public insuranceBlock: any[] = [
        // { name: 'Life Insurance', value: 'life', changeValue: '(45.33%)', ytd: '45.00 Cr.', mtd: '159', icon: 'equity-circle-icon.svg', page: 'afyp-life-insurance'},
        // { name: 'Health Insurance', value: 'health', changeValue: '(35.33%)', ytd: '45.00 Cr.', mtd: '159', icon: 'red-circle-icon.svg', page: 'afyp-health-insurance'},
        // { name: 'General Insurance', value: 'general', changeValue: '(19.34%)', ytd: '45.00 Cr.', mtd: '159', icon: 'other-circle-icon.svg', page: 'afyp-general-insurance'},
    ];
    public clientBlockSegmentValue: string = "clientName";
    public segmentButtonOption: any[] = [
        // {name: 'Client Code / PAN', value: 'clientCode'},
        {name: 'Name', value: 'clientName'}
    ]

    public showChart = false;
    chartNewLabels: string[] = [
        'Life Insurance',
        'Health Insurance',
        'General Insurance'
    ];
	chartNewData: any[] = [
		{ data: [], backgroundColor: ['#FCC103', '#F9327A', '#35BAE9'], borderWidth: 0 }
	];
    chartNewOptions: any = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        }
        
    }
    constructor(private router: Router,
		private storage: StorageServiceAAA,
		private commonService: CommonService) { }

    ngOnInit() {
        this.commonService.eventObservable.subscribe((obj: any) => {
            // console.log(obj, 'event obj');
            
			if (obj && obj['event'] === 'totalAFYPEvent') {
				// this.clientCode = obj['data']['clientCode'];
                const params: any = {
					code: obj['data']['clientCode'],
					data: obj['data']['value'],
				}
				if (obj['data']['chartData']) params['chartData'];
				this.setData(params);
			}
		})
		const event: any = {
			detail: {
				value: 'totalAfypLifeEvent',
				clientCode: this.clientCode
			}
		}
		this.commonService.setData(event);
		this.insuranceBlock = this.totalAFYPTabData;

        setTimeout(() => {
            let sum = 0;
			const response = this.chartData;
			for (const key in response) {
				if (Object.prototype.hasOwnProperty.call(response, key)) {
					sum = sum + (+response[key]);
				}
			}
            if (sum !== 0) {
                this.showChart = true;

                this.chartNewData[0].data = [ +(((+this.chartData['LifeInsuranceYTD'] + (+this.chartData['LifeInsuranceMTD'])) * 100) / sum).toFixed(2), +(((+this.chartData['HealthInsuranceYTD'] + (+this.chartData['HealthInsuranceMTD'])) * 100) / sum).toFixed(2), +(((+this.chartData['GeneralInsuranceMTD'] + (+this.chartData['GeneralInsuranceYTD'])) * 100) / sum).toFixed(2)];
                // this.dognut = new Chart(this.dognutChart.nativeElement, {
                //     type: 'doughnut',
                //     data: {
                //         labels: [
                //             'Life Insurance',
                //             'Health Insurance',
                //             'General Insurance'
                //         ],
                //         datasets: [{
                //             data: [ +(((+this.chartData['LifeInsuranceYTD'] + (+this.chartData['LifeInsuranceMTD'])) * 100) / sum).toFixed(2), +(((+this.chartData['HealthInsuranceYTD'] + (+this.chartData['HealthInsuranceMTD'])) * 100) / sum).toFixed(2), +(((+this.chartData['GeneralInsuranceMTD'] + (+this.chartData['GeneralInsuranceYTD'])) * 100) / sum).toFixed(2)],
                //             backgroundColor: ['#FCC103', '#F9327A', '#35BAE9'], // array should have same number of elements as number of dataset
                //             // borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
                //             borderWidth: 0
                //         }],
    
                //     },
                //     options: {
                //         responsive: true,
                //         plugins: {
                //             legend: {
                //                 display: false
                //             }
                //         }
                        
                //     }
                // });
            }
        }, 1500);
    }

    public setData(obj: any) {
		this.clientCode = obj['clientCode'];
		this.totalAFYPTabData = [];
		this.totalAFYPTabData = obj['data'];
		this.insuranceBlock = this.totalAFYPTabData;
		this.chartData = obj['chartData'];

		let sum = 0;
        const response = this.chartData;
        for (const key in response) {
            if (Object.prototype.hasOwnProperty.call(response, key)) {
                sum = sum + (+response[key]);
            }
        }
        if (sum !== 0) {
            this.showChart = true;

            this.chartNewData[0].data = [ +(((+this.chartData['LifeInsuranceYTD'] + (+this.chartData['LifeInsuranceMTD'])) * 100) / sum).toFixed(2), +(((+this.chartData['HealthInsuranceYTD'] + (+this.chartData['HealthInsuranceMTD'])) * 100) / sum).toFixed(2), +(((+this.chartData['GeneralInsuranceMTD'] + (+this.chartData['GeneralInsuranceYTD'])) * 100) / sum).toFixed(2)];
            // this.dognut = new Chart(this.dognutChart.nativeElement, {
            //     type: 'doughnut',
            //     data: {
            //         labels: [
            //             'Life Insurance',
            //             'Health Insurance',
            //             'General Insurance'
            //         ],
            //         datasets: [{
            //             data: [ +(((+this.chartData['LifeInsuranceYTD'] + (+this.chartData['LifeInsuranceMTD'])) * 100) / sum).toFixed(2), +(((+this.chartData['HealthInsuranceYTD'] + (+this.chartData['HealthInsuranceMTD'])) * 100) / sum).toFixed(2), +(((+this.chartData['GeneralInsuranceMTD'] + (+this.chartData['GeneralInsuranceYTD'])) * 100) / sum).toFixed(2)],
            //             backgroundColor: ['#FCC103', '#F9327A', '#35BAE9'], // array should have same number of elements as number of dataset
            //             // borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            //             borderWidth: 0
            //         }],
    
            //     },
            //     options: {
            //         responsive: true,
            //         plugins: {
            //             legend: {
            //                 display: false
            //             }
            //         }
            //     }
            // });
        }
			
	}

	ngOnChanges() {
		const newData = this.totalAFYPTabData;
		this.totalAFYPTabData = newData;
		const params = {
			code: this.clientCode,
			data: this.totalAFYPTabData,
			chartData: this.chartData
		}
		this.setData(params);
	}

    public searchText(event: any) {
        event.preventDefault();
		const obj = {
			SearchText: this.searchTerm,
			SearchBy: this.clientBlockSegmentValue,
			page: 1
		}
        this.commonService.setEvent(this.insuranceBlockTabValue+'SearchText', obj);
		// if (this.searchTerm.length > 2) {
		// 	return;
		// } else {
		// 	this.commonService.setEvent(this.insuranceBlockTabValue+'SearchText', obj);
		// }
	}

	public onSegmentChanged(event: any) {
		this.searchTerm = null;
		this.storage.get('empCode').then(code => {
			const obj: any = {
				clientCode: code,
				value: event['detail']['value']
			}
			this.commonService.setData(obj);
		})
        // console.log(this.insuranceBlockTabValue);
        
	}

    goToPage(page: any) {
        if (page) {
            this.router.navigate(['/' + page]);
        } else {
            return;
        }
    }

}
