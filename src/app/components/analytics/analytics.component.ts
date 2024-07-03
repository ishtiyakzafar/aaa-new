import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
	selector: 'app-analytics',
	templateUrl: './analytics.component.html',
	styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit, OnChanges {
	@ViewChild('iframe') iframe!: ElementRef;
	@Input() displayAnalyticsSection: boolean = false;
	holdingData:any[] = []
	constructor(private route: ActivatedRoute) { }
	ngOnChanges(changes: SimpleChanges): void {
		if(this.displayAnalyticsSection){
			this.holdingData = localStorage.getItem('totalHoldings') ? JSON.parse(localStorage.getItem('totalHoldings') || "{}") : "[]";
		}
	}

	ngOnInit() {
		//this.holdingData = JSON.parse(localStorage.getItem('totalHoldings'));
	}

	loadIframe(){
		if(this.holdingData.length > 0){
			// setTimeout(() => {
				const payload = JSON.stringify({
					source: "IIFL",
					data: {
						holdings: this.holdingData,
					},
				});
				
				this.iframe.nativeElement.contentWindow.postMessage(payload, "*");
	
				// this.iframe.nativeElement.setAttribute('src', "https://newsiifl.trendlyne.com/clientapi/irwin/webview/FHZVJwFXDC/portfolio-report/");
			// }, 1000);
		}
	}
	goBack(){
		window.history.back();
	}

}
