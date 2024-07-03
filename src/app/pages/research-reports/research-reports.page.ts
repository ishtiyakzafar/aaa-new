import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../helpers/common.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { investObj, researchReport } from '../../../environments/environment';

declare var cordova: any;


@Component({
	selector: 'app-research-reports',
	templateUrl: './research-reports.page.html',
	styleUrls: ['./research-reports.page.scss'],
})
export class ResearchReportsPage implements OnInit {

	constructor(private commonService: CommonService, private router:Router,
		private platform: Platform) { }

	ngOnInit() {
		this.commonService.analyticEvent('More_Research_Report', 'Research Report');
	}
	public goBack() {
		window.history.back();
	}
	openLink(links: any) {
		var url;
		if (links == 'iiflBuzz') {
			url = investObj['iiflBuzz']['url'];
			this.commonService.setClevertapEvent('IIFL Buzz');
		} else if (links == 'ipo') {
			url = "https://www.indiainfoline.com/market-research-reports/ipo-reports";
			this.commonService.setClevertapEvent('Research_IPO');
		} else if (links == 'topNews') {
			url = "https://www.indiainfoline.com/top-share-market-news/1";
			this.commonService.setClevertapEvent('Research_TopNews');
		} else if (links == 'mutualFundNews') {
			url = "https://www.indiainfoline.com/news-listing/personalfinance-mutual-funds";
			this.commonService.setClevertapEvent('Research_MFNews');
		} else if (links == 'blogs') {
			url = "https://www.indiainfoline.com/blog";
			this.commonService.setClevertapEvent('Research_Blogs');
		}

		if (this.commonService.isApp() && this.platform.is('ios')) {
			var ref = cordova.InAppBrowser.open(url, '_blank');

			ref.addEventListener('loadstart', this.loadstartCallback);
			ref.addEventListener('loadstop', this.loadstopCallback);
			ref.addEventListener('loaderror', this.loaderrorCallback);
			ref.addEventListener('exit', this.exitCallback);
		} else {
			window.open(url, '_blank');
		}
	}

	goToDashboard() {
        this.router.navigate(['/dashboard']);
    }
    goToNotification() {
        this.router.navigate(['/notification']);
	}

    goToSearch() {
        //this.router.navigate(['/add-script']);
		this.router.navigate(['/dashboard-clients']);
	}

	public mantra() {
		const url = researchReport['morningMantra']['url'];

		if (this.commonService.isApp() && this.platform.is('ios')) {
			var ref = cordova.InAppBrowser.open(url, '_blank');

			ref.addEventListener('loadstart', this.loadstartCallback);
			ref.addEventListener('loadstop', this.loadstopCallback);
			ref.addEventListener('loaderror', this.loaderrorCallback);
			ref.addEventListener('exit', this.exitCallback);
		} else {
			window.open(url, '_blank');
		}
	}

	public loadstartCallback(event: any) {
		console.log('Loading started: ' + event.url)
	}

	public loadstopCallback(event: any) {
		console.log('Loading finished: ' + event.url)
	}

	public loaderrorCallback(error: any) {
		console.log('Loading error: ' + error.message)
	}

	public exitCallback() {
		console.log('Browser is closed...')
	}
}
