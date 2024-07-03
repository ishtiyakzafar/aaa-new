import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'no-portfolio-data',
  templateUrl: './no-portfolio-data.component.html',
  styleUrls: ['./no-portfolio-data.component.scss'],
})

export class NoPortfolioDataComponent implements OnInit {
  displayMsg:string = "No Portfolio Data Found";
  constructor(
    private route: ActivatedRoute, private locationSt: LocationStrategy
  ) {
      // history.pushState(null, null, window.location.href);  
      history.pushState(null, '', window.location.href);  
      this.locationSt.onPopState(() => {
        // history.pushState(null, null, window.location.href);
        history.pushState(null, '', window.location.href);
    });
   }

  ngOnInit() {
    localStorage.removeItem('clientLoginId');
    localStorage.removeItem('tokenData');

    this.route.queryParams.subscribe((params:any) => {
      console.log(params);
         if(params.Authorization === "N"){
          this.displayMsg = "Invalid Authorization Please login and try again"
         }
    })
  }

}
