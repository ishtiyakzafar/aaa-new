import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
// import { environment } from 'src/environments/environment';    never used

declare var clevertap:any;
declare var jQuery: any;
declare var window: any

@Injectable({
  providedIn: 'root'
})
export class cleverTapService {
  //public gaParams = environment['gaKey'];

  constructor(private router: Router) {
   
  }

  

  public init() {
    this.listenForRouteChanges();

    try {
        var wzrk = document.createElement('script');
        wzrk.type = 'text/javascript';
        wzrk.async = true;
        wzrk.src = ('https:' == document.location.protocol ? 'https://d2r1yp2w7bby2u.cloudfront.net' : 'http://static.clevertap.com') + '/js/a.js?v=0';
        var s = document.getElementsByTagName('script')[0];
        
        // s.parentNode.insertBefore(wzrk, s);        could return null
        s.parentNode?.insertBefore(wzrk, s);

        //this.loadScript();
    } catch (ex) {
      console.error('Error appending of cleverTap');
      console.error(ex);
    }
  }

//   public loadScript() {
//     let body = <HTMLDivElement> document.body;
//     let script = document.createElement('script');
//     script.innerHTML = '';
//     script.src = 'assets/myjs.js';
//     script.async = true;
//     script.defer = true;
//     body.appendChild(script);
// }

  private listenForRouteChanges() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        clevertap.notificationCallback = function(msg: any){
            //raise the notification viewed and clicked events in the callback
            clevertap.raiseNotificationViewed();
            // console.log(JSON.stringify(msg));
           // clevertap.raiseNotificationClicked();            //your custom rendering implementation here
            var $button = jQuery("<button></button>");   //element on whose click you want to raise the notification clicked event
            $button.click(function(){
               clevertap.raiseNotificationClicked();
            });
        };
     
        
      }
      var notificationObj;
      window.parent.clevertap.popupCallback = (notificationData: any) => {
          notificationObj = notificationData;
      };
      this.submit_pressed(notificationObj)
    });
  }

   submit_pressed(notificationObj: undefined) {
      if(event) event.preventDefault();                 // event is deprecated
      window.parent.clevertap.raisePopupNotificationClicked(notificationObj)
    }
    
}