import { Directive,ElementRef,Input, HostListener } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl, ValidatorFn } from '@angular/forms';
import { Platform, ModalController } from '@ionic/angular';


@Directive({
  selector: '[customValidate][formControlName],[customValidate][formControl],[customValidate][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: InputRestrictionDirective, multi: true}]
})
export class InputRestrictionDirective implements Validator {

  @Input()
  customValidate: any;
  inputElement: ElementRef;
  validator: ValidatorFn | undefined;
	static validate: ValidatorFn;

    constructor(el: ElementRef, private platform: Platform) {
      this.inputElement = el;
     // this.validator = this.emailValidator();
  }

      @HostListener('keypress', ['$event']) onKeyPress(event: any) {
        if (this.platform.is('desktop')) {
            this.restrictChar(event);
        }
            
    }

    restrictChar(event: any) {
          const e = <KeyboardEvent>event;
          let k;
          k = event.keyCode;  // k = event.charCode;  (Both can be used)
          if (k != 60 && k != 62 && k != 47 && k != 59 ) {
              return;
          }
          e.preventDefault();
      }

  validate(c: FormControl): {[key: string]: any} {    // previous code below
    if (!this.platform.is('desktop')) {
      let v = c.value;
      if (v != null && v !== '') {
    
        return (v.includes('<') || v.includes('>') || v.includes(';') || v.includes('/'))? {"customValidate": true} : {"customValidate": null};
      }
    }
    return {"customValidate": null};
      
  }
  
  // validate(c: FormControl): {[key: string]: any} {
  //   if (!this.platform.is('desktop')) {
  //     let v = c.value;
  //     if (v != null && v !== '') {
    
  //       return (v.includes('<') || v.includes('>') || v.includes(';') || v.includes('/'))? {"customValidate": true} : null;
  //     }
  //   }
  // }

} 