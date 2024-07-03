import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'ledger-popover',
  templateUrl: './ledger-popover.component.html',
  styleUrls: ['./ledger-popover.component.scss'],
})
export class LedgerPopoverComponent implements OnInit {
  @Input() items: any;

  constructor(
    private router: Router,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {}

  public onItemClick() {
    this.popoverController.dismiss();
  }

  async dismiss(val: any) {
    await this.popoverController.dismiss({
      result: val
    });
  }

}
