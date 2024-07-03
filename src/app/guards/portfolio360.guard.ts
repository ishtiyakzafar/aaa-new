import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../helpers/authentication.service';
import { NavController} from '@ionic/angular';
import { StorageServiceAAA } from '../helpers/aaa-storage.service';

@Injectable({
	providedIn: 'root'
})
export class Portfolio360AuthGuard implements CanActivate {
	constructor(private router: Router,
		private storage: StorageServiceAAA,
		private authervice: AuthenticationService, private navCtrl: NavController) { }
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		// /* let isLoggedIn;
		// this.authervice.isLoggedIn().subscribe(
		// 	(data) => {
		// 		isLoggedIn = data;
		// 	}
		// );
		const check360Status = 	location.hostname.includes('360');
			if(!check360Status){
				return true
			}
			this.navCtrl.navigateRoot(['/family-portfolio'])
			return false
		}
	
	
}
