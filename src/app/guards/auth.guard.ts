import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../helpers/authentication.service';
import { StorageServiceAAA } from '../helpers/aaa-storage.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard {
	constructor(private router: Router,
		private storage: StorageServiceAAA,
		private authervice: AuthenticationService) { }
	canActivate(
		next: ActivatedRouteSnapshot,
		// state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		state: RouterStateSnapshot): boolean {

		/* let isLoggedIn;
		this.authervice.isLoggedIn().subscribe(
			(data) => {
				isLoggedIn = data;
			}
		);

		this.storage.get('token').then(token => {
			if (token) {
				this.storage.get('subscription').then(value => {
					if (value) {
						if (state.url !== '/subscription') {
							this.router.navigate(['/subscription']);
							return false;
						} else {
							this.router.navigate([state.url]);
							return true;
						}
					}
					// return true;
				}, err => {
					this.router.navigate([state.url]);
				})
			}
		})

		if (isLoggedIn) {
			// authorised so return true
			return true;
		}
		// not logged in so redirect to login page with the return url
		this.router.navigate([state.url]);
		// this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
		return false; */
		let isLoggedIn;
		this.authervice.isLoggedIn().subscribe(
			(data) => {
			isLoggedIn = data;
			}
		);
		if (isLoggedIn) {
		// authorised so return true
		return true;
		}
		// not logged in so redirect to login page with the return url
		this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
		return false;
	}
}

export const AuthGuardService: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
	return inject(AuthGuard).canActivate(next, state);
}
