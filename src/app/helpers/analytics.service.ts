import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { environment } from '../../environments/environment';

declare var gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  public gaParams = environment['gaKey'];

  constructor(private router: Router) {
  }

  public event(eventName: string, params: {}) {
    gtag('event', eventName, params);
  }

  public init() {
    this.listenForRouteChanges();

    try {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=' + this.gaParams;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '` + this.gaParams + `', {'send_page_view': false});
      `;
      document.head.appendChild(script2);
    } catch (ex) {
      console.error('Error appending google analytics');
      console.error(ex);
    }
  }

  private listenForRouteChanges() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', this.gaParams, {
          'page_path': event.urlAfterRedirects
        });
       // console.log('Sending Google Analytics hit for route', event.urlAfterRedirects);
      }
    });
  }
}