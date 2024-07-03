import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResearchReportsPageRoutingModule } from './research-reports-routing.module';
import { ResearchReportsPage } from './research-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResearchReportsPageRoutingModule
  ],
  declarations: [ResearchReportsPage]
})
export class ResearchReportsPageModule {}
