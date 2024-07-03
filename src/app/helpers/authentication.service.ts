import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URLS } from '../../config/api.config';
import { CustomEncryption } from '../../config/custom-encrypt';
import {CookieService} from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { StorageServiceAAA } from './aaa-storage.service';



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	// private currentUserSubject: BehaviorSubject<any>;		never used
	// public currentUser: Observable<any>;						never used

	// secret key to encrypt the login credentails
	//   private secretKey: string = SECRET_KEY;

	// observable user details
	// public currentUserSubject: BehaviorSubject<any>;

	// onserveable logged in status
	public loggedInStatus;

	// observeable logged in subscription status
	public subscriptionStatus;

	// logged in user tpe
	// public currentUser: Observable<any>;

	// login api url
	private RMloginUrl = URLS.request3;

	// logout api url
	private logoutUrl = URLS.swarajLogout;
	private gatewaySubscriptionKey = environment['gatewaySubscriptionKey'];

	constructor(
		private http: HttpClient,
		private cipherText: CustomEncryption,
		private storage: StorageServiceAAA,
		private cookieService:CookieService
	) {
		// this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
		this.loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());
		this.subscriptionStatus = new BehaviorSubject<boolean>(this.subs());
		// this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(this.storage.get('currentUser')));
		// this.currentUser = this.currentUserSubject.asObservable();
	}

	ionViewWillEnter() {
		this.loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());
		this.subscriptionStatus = new BehaviorSubject<boolean>(this.subs());
	}

	//   public get currentUserValue(): any {
	//     return this.currentUserSubject.value;
	// }


	/**
	 * if we have token the user is loggedIn
	 * @returns {boolean}
	 */
	private hasToken(): boolean {
		return !!this.storage.get('token');
	}

	private subs(): boolean {
		return !!this.storage.get('subscription');
	}


	/**
	 * if we have token the user is loggedIn
	 * @returns {boolean}
	 */
	private hasSubscription(): boolean {
		return !!this.storage.get('susbcription');
	}



	/**
	*
	* @returns {Observable<T>}
	*/
	public isLoggedIn() {
		this.loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());
		return this.loggedInStatus.asObservable();
	}

	/**
	*
	* @returns {Observable<T>}
	*/
	public isSubscribed() {
		return this.subscriptionStatus.asObservable();
	}

	/**
	 * Login the user then tell all the subscribers about the new status
	 */
	public login(apiURL: any, loginData: any, key: any) {
		// const cipherData = crypto.AES.encrypt(JSON.stringify(loginData), this.secretKey).toString();
		// const cipherData = this.cipherText.aesEncrypt(loginData);
		// const cipherPasswrd = crypto.AES.encrypt(password, this.secretKey).toString();
		key['appID'] = localStorage.getItem('appID') || '';
		return this.http.post<any>(apiURL, loginData, { headers: new HttpHeaders(Object.assign(key)) })
			.pipe(map(user => {
				// login successful if there's a jwt token in the response
				if ((user && user['Body'])) {
					if (+user['Body']['Status'] === 0) {
						this.loggedInStatus.next(true);
						// this.storage.set('token', true);
						// store user details and jwt token in local storage to keep user logged in between page refreshes
						//  localStorage.setItem('currentUser', JSON.stringify(user));
						//  this.currentUserSubject.next(user);
						return user;
					}
				} else if (user && user['body']) {
					if (+user['body']['status'] === 0) {
						this.loggedInStatus.next(true);
						// this.storage.set('token', true);
						return user;
					}
				} else {
					return user;
				}
			}));
	}

	public logout(obj: any, tokenValue: any) {
		this.loggedInStatus.next(false);
		const newToken = {
			'token': tokenValue,
			'Ocp-Apim-Subscription-Key' : this.gatewaySubscriptionKey.tt,
			'appID': localStorage.getItem('appID') || ''
		}
		this.cookieService.deleteAll();
		return this.http.post<any>(`${this.logoutUrl.url}`, obj, { headers: new HttpHeaders(newToken) });
		// remove user from local storage to log user out
		//  localStorage.removeItem('currentUser');
		//  this.currentUserSubject.next(null);
	}
}
