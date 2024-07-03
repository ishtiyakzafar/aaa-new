import { Component, OnInit, Input } from '@angular/core';
import { DeleteScripService } from './delete-scrip.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
	selector: 'app-delete-scrip',
	providers: [DeleteScripService],
	templateUrl: './delete-scrip.component.html',
	styleUrls: ['./delete-scrip.component.scss'],
})
export class DeleteScripComponent implements OnInit {
	@Input() data: any;
	@Input() MWname: any;

	public subscription: any;

	format = 'dd/MM/yy';
	formattedDate: any;

	constructor(
		private storage: StorageServiceAAA,
		private router: Router,
		private delScripService: DeleteScripService,
		private toast: ToasterService
	) { }

	ngOnInit() {
	}

	getDate(val: any) {
		let sliceddate = val.slice(6, 19);
		let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		// let date = new Date(sliceddate * 1000);
		// let date1 = date.getDate();


		let utcSeconds = sliceddate / 1000;
		let date1 = new Date(0); // The 0 there is the key, which sets the date to the epoch
		date1.setUTCSeconds(utcSeconds);

		let date = date1.getDate();
		let month = months[date1.getMonth()];
		let year = date1.getFullYear();


		return this.formattedDate = date + ' ' + month;
		// let sliceddate = val.slice(6, 19);
		// let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		// let date = new Date(sliceddate * 1000);

		// let date1 = date.getDate();

		// let month = months[date.getMonth()];

		// return this.formattedDate = date1 + ' ' + month;
	}

	public removeScrip(exch: any, exchType: any, code: any, action: any) {
		this.storage.get('userID').then((token) => {
			const params = {
				MWname: this.MWname,
				Clientcode: token,
				ClientLoginType: 0,
				'Data': [{
					Exch: exch,
					ExchType: exchType,
					ScripCode: code,
					Action: action
				}]
			};

			this.subscription = new Subscription();
			this.subscription.add(this.delScripService.
				deleteScrip(params).
				subscribe((response: any) => {
					if (!response['Insert_Status']) {
						this.data = this.data.filter((ele: any) => {
							if (ele['ScripCode'] !== code) {
								return ele;
							}
						});
						this.toast.displayToast(response['Message']);
					} else {
						this.toast.displayToast(response['Message']);
					}
				}))
		})
	}

	refresh(): void {
		this.router.navigate(['/markets']);
		// window.location.reload();
	}

}
