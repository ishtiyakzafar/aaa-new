import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
// import { environment } from 'src/environments/environment';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UpdateVersionService {
	isLoading: boolean = false;


	public currentAppVersion: any = environment['app_version'];

	setCurrentTime:any;
	dayTimeDiff:any;
	dailyResetTime:any;

	fireBaseArray:any[] = []
	// fireBaseArray = [
	// 	{"latestVersion":28,
	// 	"versions":
	// 	[
	// 		{"version":1,"forceUpgrade":true,"validTime":0},
	// 		{"version":2,"forceUpgrade":false,"validTime":4}]}]
	constructor(public loadingController: LoadingController, public alertController: AlertController) { }

	checkVersionUpdate(jsonArray: any) {
		this.fireBaseArray = jsonArray;
		// console.log(this.fireBaseArray);
			// if no json  for firebase //
		if (this.fireBaseArray && this.fireBaseArray.length > 0 )  {
			
			// compare firebase latest version with existing current version //
			if (this.fireBaseArray[0].latestVersion > this.currentAppVersion) {
				// console.log(this.fireBaseArray[0].versions);
				// get the versions array from json //
				const arrayValue = this.fireBaseArray[0].versions
				// check for the existing version object//
				for (let i = 0; i < arrayValue.length; i++) {
					// find if current version object equal to current version //
					if (arrayValue[i].version == this.currentAppVersion) {
						// check for forceUpgrade if true //
						if (arrayValue[i].forceUpgrade == true) {
							// if true than  set the time in local storage first time should not refresh //
							if (localStorage.getItem('setUpdate') == undefined) {
								localStorage.setItem('storeCurrentDate', new Date().getTime().toString()); 
							}
							// find the valid days in object and assign to calculateDays //
							this.calculatePendingDays(arrayValue[i].validTime);
						}
						else{
							localStorage.removeItem('setUpdate');
							localStorage.removeItem('storeCurrentDate');
							localStorage.removeItem('dailyResetTime')
							setTimeout(() => {
								localStorage.setItem('dailyResetTime', "0")
							}, 200);
						}
					}
					else {
						console.log('will not update')
					}
				}
			}
		}
		else{
			console.log('no array Found')
		}

	}

	calculatePendingDays(timeDuration: any) {
		var timeDiff;
		// let previousTime = parseInt(localStorage.getItem('storeCurrentDate'));
		let previousTime = parseInt(localStorage.getItem('storeCurrentDate') || '0');

		let noDays = timeDuration;

		localStorage.setItem('setUpdate', 'not_updated')

		let currentTime = new Date().getTime();
		// console.log("currentTime",currentTime);
		// time diffrence b/w current time and stored time //
		timeDiff = (Math.abs(currentTime - previousTime)) / 1000;
		// convert the millisecond in day by dividing to 86400 //
		let dayDiff = Math.floor(timeDiff/86400); 
		
		if(localStorage.getItem('dailyResetTime') == undefined || localStorage.getItem('dailyResetTime') == null){
			 localStorage.setItem('dailyResetTime', dayDiff.toString())	
			this.dailyResetTime = localStorage.getItem('dailyResetTime');
		}
		else{
			this.dailyResetTime = localStorage.getItem('dailyResetTime');
			// console.log(this.dailyResetTime);
		}

		// console.log(this.dailyResetTime);
		// console.log('dayDiff',dayDiff);

		if(this.dailyResetTime == dayDiff){
			localStorage.setItem('setDayValue', 'true');	
		}
		if (dayDiff >= 0) {
			if (noDays > dayDiff) {
				// calculate the remaining days for update //
				// console.log("Total Days Left" + (noDays - dayDiff))
				// set the day Value every Day within valid Time //
				if (localStorage.getItem('setDayValue') == "true")  {
					this.validConfirmUpdate(noDays, dayDiff)
				}
			}
			// if the day is more than validate days
			else {
				this.EmergencyUpdate()
			}
		}
		else{
			console.log('unable to calculate day diff')
		}
	}

	async validConfirmUpdate(totalDays: any, diffDays: any) {
		// Increase the count for popup open next day //
		this.dailyResetTime = parseInt(this.dailyResetTime) + 1;
		localStorage.setItem('dailyResetTime', this.dailyResetTime)
		localStorage.setItem('setDayValue', 'false');
		this.dailyResetTime = localStorage.getItem('dailyResetTime');

		const alert = await this.alertController.create({
			cssClass: 'my-custom-alertclass',
			header: 'App Update',
			message: `You have ${totalDays - diffDays} days to update the App.`,
			backdropDismiss: false, 
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: (blah) => {

					}
				}, {
					text: 'update',
					handler: () => {
						//localStorage.removeItem('setUpdate');
						//localStorage.removeItem('storeCurrentDate');
						
						//localStorage.setItem('dailyResetTime', "0");
						window.open("https://play.google.com/store/apps/details?id=com.iifl.iiflaaa");
						//console.log('will go to playstore link');

						//navigator['app'].exitApp();

					}
				}
			]
		});

		await alert.present();
	}


	async EmergencyUpdate() {
		const alert = await this.alertController.create({
			cssClass: 'my-custom-class',
			header: 'App Update',
			message: "The current version has expired. Please update with the latest version",
			backdropDismiss: false, 
			buttons: [
				{
					text: 'Update',
					role: 'Update',
					cssClass: 'secondary',
					handler: (blah) => {

						//localStorage.setItem('displayUpdatePopup', "true")
						//localStorage.removeItem('setUpdate');
						//localStorage.removeItem('storeCurrentDate');
						
						window.open("https://play.google.com/store/apps/details?id=com.iifl.iiflaaa");
						this.checkVersionUpdate(this.fireBaseArray);
					}
				}
			]
		});

		await alert.present();
	}


}