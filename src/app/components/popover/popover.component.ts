import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input() items: any;
  @Input() itemsHistory: any;

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

