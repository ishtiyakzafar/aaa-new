import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, AlertController} from '@ionic/angular';
import { Router } from '@angular/router';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
 import { ToasterService } from '../../../helpers/toaster.service';
import { CommonService } from '../../../helpers/common.service';

declare var cordova: any;

@Component({
    selector: 'app-guest-more-revamp',
    providers: [],
    templateUrl: './guest-more-menu.page.html',
    styleUrls: ['./guest-more-menu.page.scss'],
})
export class GuestMoreRevampPage implements OnInit,OnDestroy {
    userType: any;
    userID: any;
	userIdLength = localStorage.getItem('userId1')?.length;
	
    subMenuOptions1: any = [

        { label: 'Help'}, { label: 'Call For Support' }

    ];

	subMenuOptionsMob1: any = [

        { label: 'Call For Support'}

    ];

     subMenuOptions2: any = [

       { label: 'Help' }, { label: 'Call For Support' }

    ];
    userTypeVal: any = localStorage.getItem('userType');
    menuOptions: any[] = [
      
        {
            icon: 'calculators.svg', name: 'Calculators',
            description: 'Calculate estimated returns for clients with our built in calculators',
            subMenuOptions: [
                { label: 'EMI Calculator'}, { label: 'SIP Calculator' }, { label: 'SIP Revenue' },
                { label: 'Span Margin' }, { label: 'Goal Calculator' }
            ],
			subMenuOptionsMob: [
                { label: 'EMI Calculator' }, { label: 'SIP Calculator' }, { label: 'SIP Revenue' },
                { label: 'Span Margin' }, { label: 'Goal Calculator' }
            ]
        },
        {
            icon: 'research.svg', name: 'Research & Learning',
           subMenuOptions: [
                { label: 'Research Reports' }, { label: 'Morning Mantra' }, { label: 'InvestorQ' },
                { label: 'Moneyversity' },{ label: 'Training Portal' },{ label: 'IIFL Model Portfolios' }
            ],
			subMenuOptionsMob: [
				{ label: 'Research Reports' }, { label: 'Morning Mantra' }, { label: 'InvestorQ' },
                { label: 'Moneyversity' },{ label: 'Training Portal' },{ label: 'IIFL Model Portfolios' }
            ]
        },
        {
            icon: 'utilities.svg', name: 'Utilities',
           subMenuOptions: [
                { label: 'ACE Backoffice' }, { label: 'Lead Dashboard (Zoho CRM)' }, { label: 'My Calendar' }, { label: 'Product Dashboard' }, { label: 'Forms & Formats' }, { label: 'Demat Request Forms' }
            ],
			subMenuOptionsMob: [
				{ label: 'ACE Backoffice' }, { label: 'Lead Dashboard (Zoho CRM)' }, { label: 'My Calendar' }, { label: 'Product Dashboard' }, { label: 'Forms & Formats' }, { label: 'Demat Request Forms' }
            ]
        },
        {
            icon: 'support.svg', name: 'Support & Feedback',
           	subMenuOptions:  this.userTypeVal == 'RM' ? this.subMenuOptions2 : this.subMenuOptions1,
			subMenuOptionsMob: this.subMenuOptions1,
        },
        {
            icon: 'branding.svg', name: 'Branding',
           subMenuOptions: [
                { label: 'Request Branding Material' }, { label: 'Image Branding' }
            ],
			subMenuOptionsMob: [
				{ label: 'Request Branding Material' }, { label: 'Image Branding' }
            ]
        }
    ]
    public isMobile = false;

	
    constructor(private router: Router, 
        public modalController: ModalController,
        public faio: FingerprintAIO, public alertController: AlertController,
        private toast: ToasterService,
        private commonService: CommonService
		) { }

    ngOnInit() {

    }

    goToDashboard() {
		this.router.navigate(['/guest/guest-dashboard']);
	}
    public async callBecomePartnerModal(inputString?: string) {
		this.commonService.becomePartnerModal();
	}

	ngOnDestroy(): void {
		
	}

    goToRequest() {
        // this.router.navigate(['/wire-requests/limit-change']);
    }

    dropClick(index: any, arr: any) {
		// event.preventDefault();
		arr.forEach((element: any, ind: any) => {
			if ((index) !== ind) {
				element['isVisible'] = false;
			} else {
				element['isVisible'] = element['isVisible'] ? false : true;
			}
		});
    }

}
