import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-brokerage-modification',
    templateUrl: './brokerage-modification.page.html',
    styleUrls: ['./brokerage-modification.page.scss'],
})
export class BrokerageModificationPage implements OnInit {
    public requestType: string = "Brokerage Request";
	public requestTypeData: any[] = [
		{ requestType: "Brokerage Request" }
	];
    constructor() { }

    ngOnInit() {
    }

    goBack() {
        window.history.back();
    }


}
