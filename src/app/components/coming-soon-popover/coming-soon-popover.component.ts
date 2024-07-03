import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-coming-soon-popover',
  templateUrl: './coming-soon-popover.component.html',
  styleUrls: ['./coming-soon-popover.component.scss'],
})
export class ComingSoonPopoverComponent implements OnInit {
  @Input() items: any;

  constructor(
    private router: Router,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {}

  public onItemClick(item: any) {
    this.dismiss(item);
  }

  async dismiss(val: any) {
    await this.popoverController.dismiss({
      result: val
    });
  }

}
