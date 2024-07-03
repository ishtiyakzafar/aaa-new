import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// setTimeout(() => {
//   var clevertap = { event:[], profile:[], account:[], onUserLogin:[], notifications:[], privacy:[] };
//   clevertap.account.push({"id": environment.clevertap_Key});
// },0);

if (environment.production) {
  enableProdMode();
}
// if (window) {
//   window.console.log = function() {};
// }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
