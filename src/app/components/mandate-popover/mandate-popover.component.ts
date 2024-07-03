import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-mandate-popover',
  templateUrl: './mandate-popover.component.html',
  styleUrls: ['./mandate-popover.component.scss'],
})
export class MandatePopoverComponent implements OnInit {

  @Input() items: any;

  constructor(
    private router: Router,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    console.log(this.items);
  }

  public onItemClick(item: any) {
    this.dismiss(item);
  }

  async dismiss(val: any) {
    await this.popoverController.dismiss({
      result: val
    });
  }

}
