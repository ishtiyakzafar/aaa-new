import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { DateService } from './services/date.service';
import { DatePipe } from '@angular/common';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { CommonService } from './helpers/common.service';
import { NgChartsModule } from 'ng2-charts';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HTTP } from '@ionic-native/http/ngx';
import { Network } from '@ionic-native/network/ngx';
import { CalendarModule } from 'ion2-calendar';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
// import { DaterangepickerModule } from 'angular-2-daterangepicker';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// import { NgSelectModule } from '@ng-select/ng-select';
import { CleverTap } from '@ionic-native/clevertap/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AppLoaderComponent } from './app-loader/app-loader.component';
import { IonicRouteStrategy, provideIonicAngular, IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Drivers } from '@ionic/storage';
import { StorageServiceAAA } from './helpers/aaa-storage.service';
import { PayDetailsService } from './pages/pay-details/pay-details.service';
import { TotalClientService } from './components/total-clients/total-clients.service';


@NgModule({
	declarations: [AppComponent, AppLoaderComponent],
	// entryComponents: [],
	imports: [BrowserModule, IonicModule.forRoot({
        mode: 'md'
    }),
        AppRoutingModule, HttpClientModule,
		IonicStorageModule.forRoot(),
		// DaterangepickerModule,
		// CalendarModule,		review
		NgChartsModule,
		IonicStorageModule.forRoot({
            driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage]
        }),
		// NgSelectModule
	],
	providers: [
		StatusBar,
		Title,
		SplashScreen,
		HttpClientModule,
		HTTP,
		DatePipe,
		Network,
		StorageServiceAAA,
        PayDetailsService,
		CommonService,
		FirebaseX,
		InAppBrowser,
		FingerprintAIO,
		CleverTap,
		FileTransfer,
		FileTransferObject,
		FileOpener,
		File,
		TotalClientService,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
