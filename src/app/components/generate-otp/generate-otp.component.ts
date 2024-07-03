import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';

@Component({
  selector: 'app-generate-otp',
  templateUrl: './generate-otp.component.html',
  styleUrls: ['./generate-otp.component.scss'],
})
export class GenerateOtpComponent implements OnInit {
  @Input() title: any;
  @Input() value: any;
  disableBtn:boolean = false;
  emailMobileno:any;
  inputError:string= "";
  displayErr:boolean = true;
  displayGenerateOtpScreen:boolean = true;
  displayEnterOtpScreen:boolean = false;
  otpData: any[] = [
    {}, {}, {}, {}, {}, {}
  ]
  intialFocus:number = 0;
  

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    // console.log(this.title);
  }

  async dismiss() {
		await this.modalController.dismiss();
  }

  changeInput(event: any){

    if(event.toString().length > 0){
      if(this.title == 'Email'){
        const emailRegx = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
        // console.log(event.toString().length)
        if(emailRegx.test(event)){
          this.displayErr = false;
          // console.log('valid');        
        }
        else{
          this.displayErr = true;
          this.inputError = "Enter Valid Email";
        }
      }
      else if(this.title == 'Mobile Number'){
        const MobileValidRegx = /^(\+\d{1,3}[- ]?)?\d{10}$/
        // console.log(event.toString().length);
        if(MobileValidRegx.test(event)){
          this.displayErr = false;
        }
        else{
          this.displayErr = true;
          this.inputError ='Enter Valid Mobile No'
        }
      }
    }
    else{
      this.displayErr = true;
      this.inputError ='Enter a Valid Input'
    }
    
   
  }

  // mobilenoChangeDet(event){
  //   if(this.mobileno == null || this.mobileno.toString().length > 10 || this.mobileno.toString().length < 10){
  //     this.displayErr = true;
  //       if(this.mobileno == null){
  //         this.inputError = "Mobile No is required"
  //       }
  //       else{
  //         this.inputError = "Mobile No is not valid"
  //       }
  //   } 
  // }

  onOtpChanged(event: any){
    // console.log(event)
  }

  onotpFieldCompleted(event: any){
   
  }

//   let str = "Hello, your OTP to verify your login in IIFL AAA is: 503728 , For security reasons, please do not share it with anyone. Team IIFL - IIFLSL"


// let getOTP = (str) => {
//   let match = str.match(/\b\d{6}\b/)
//   return match && match[0]
// }

// console.log(getOTP(str))
  
  generateOTP(){
    if(this.displayErr){
      return;
    }
    else{
      this.displayGenerateOtpScreen = false;
      this.displayEnterOtpScreen = true;
    }
    // if(this.mobileno == null || this.mobileno.toString().length > 10 || this.mobileno.toString().length < 10){
    //   this.displayErr = true;
    //     if(this.mobileno == null){
    //       this.inputError = "Mobile No is required"
    //     }
    //     else{
    //       this.inputError = "Mobile No is not valid"
    //     }
    //     setTimeout(() => {
    //       this.displayErr = false
    //     }, 1000);
    // } 
    // else{
  
    // }
  }


  
}
