import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ToasterService } from '../helpers/toaster.service';
import { StorageServiceAAA } from '../helpers/aaa-storage.service';
import { SessionExpiredComponent } from '../components/session-expired/session-expired.component';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	errorStatus: number = 0;
	constructor(private storage: StorageServiceAAA, private toast: ToasterService, private router: Router, public modalController: ModalController, private navCtrl: NavController) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		const headers: any = {};
		headers['Cache-Control'] = 'no-cache';
		headers['Pragma'] = 'no-cache';
		headers['language_code'] = 'en';
		headers['Content-Type'] = 'application/json';
		headers['clientID'] = localStorage.getItem('userID') ? localStorage.getItem('userID') : 'NA';
		req = req.clone({
			setHeaders: headers,
			// withCredentials: true
		});

		// Handle the request
		return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
			if (event instanceof HttpResponse) {
				//console.log(event);

			}
		},
		(err: any) => {
			// console.log(err);
			if (err.status === 401) {
				this.errorStatus += 1;
				// console.log(this.errorStatus);
				if (this.errorStatus === 1) {
					this.storage.get('userType').then(user => {
						// this.sessionExpired(user);
						this.storage.clear();
						localStorage.clear();
						this.toast.displayToast('Session has Expired Please Login Again');
						this.navCtrl.navigateRoot(['/login']);
						//this.router.navigate[('/login')]
						// this.loading = false;
					})
				}
			}
		}));
	}

	async sessionExpired(user: any) {
		this.modalController.dismiss();
		const modal = await this.modalController.create({
			component: SessionExpiredComponent,
			backdropDismiss: false,
			cssClass: 'forgot-password-popup-mobile session-expired',
			componentProps: {
				userType: user
			}
		});
		// this.storage.clear();
		/* modal.onDidDismiss().then((data) => {
			if (data['data']) {
				console.log(data['data']);

			}
		}) */

		return await modal.present();
	}

}

