import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';
import * as _ from 'lodash';
import { WireRequestService } from '../../pages/wire-requests/wire-requests.service';
import { DashBoardService } from '../../pages/dashboard/dashboard.service';
import { ToasterService } from '../../helpers/toaster.service';
import { StorageServiceAAA } from '../../helpers/aaa-storage.service';

@Component({
  selector: 'app-leads-status-modal',
  providers: [DashBoardService, WireRequestService],
  templateUrl: './leads-status-modal.component.html',
  styleUrls: ['./leads-status-modal.component.scss'],
})
export class LeadsStatusModalComponent implements OnInit {
  chartData: any = undefined;
  dataLoad: boolean = false;
  isEmptyRes: boolean = false;
  meetConInPercnt: any;
  clientInPercnt: any;
  constructor(private modalController: ModalController, private wireReqService: WireRequestService, private storage: StorageServiceAAA, private dashBoardService: DashBoardService, private toast: ToasterService) { }

  ngOnInit() {
    this.getToken();
  }

  createChart(leadsGenerated: any, meetingConducted: any, convertedClients: any) {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx: any = canvas.getContext('2d');
    var sky_bg = ctx.createLinearGradient(0, 0, 0, 180);
    sky_bg.addColorStop(0, '#7CC8D3');
    sky_bg.addColorStop(1, '#C0E3E8');

    var blue_bg = ctx.createLinearGradient(0, 0, 0, 180);
    blue_bg.addColorStop(0, '#7C94D3');
    blue_bg.addColorStop(1, '#96C1E9');

    var orange_bg = ctx.createLinearGradient(0, 0, 0, 180);
    orange_bg.addColorStop(0, '#F37921');
    orange_bg.addColorStop(1, '#F7C190');

    // review. commented
    var myBarChart = new Chart(ctx, {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Leads generated', 'Meeting conducted', 'Converted leads'],
        datasets: [
          {
            data: [leadsGenerated, meetingConducted, convertedClients],
            borderSkipped: "left",
            barThickness: 20,
            backgroundColor: [sky_bg, blue_bg, orange_bg],
          },
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        plugins: {
          legend: {
            display: false,
            position: 'bottom'
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              maxTicksLimit: 50,
            },
          },
        }
      }
    });


  }

  dismisss() {
    this.modalController.dismiss();
  }
  getToken() {
    this.wireReqService.getClientInteractionToken().subscribe((res: any) => {
      this.getChartData(res['access_token']);
    });
  }

  getChartData(token: any) {
    this.dashBoardService.getLeadStatsChartData(token, localStorage.getItem('userId1')).subscribe((res: any) => {
      if (res['Head']['ResponseCode'] == 0 && res['Body']) {
        this.chartData = res['Body'];
        this.meetConInPercnt = _.isEmpty(this.chartData.Total_Meetings_Count) || _.isEmpty(this.chartData.Total_Leads_Count) ? 0 : Math.round(parseInt(this.chartData.Total_Meetings_Count) / parseInt(this.chartData.Total_Leads_Count) * 100);
        this.clientInPercnt = _.isEmpty(this.chartData.Total_Converted_Count) || _.isEmpty(this.chartData.Total_Leads_Count) ? 0 : Math.round(parseInt(this.chartData.Total_Converted_Count) / parseInt(this.chartData.Total_Leads_Count) * 100);
        this.createChart(this.chartData.Total_Leads_Count, this.chartData.Total_Meetings_Count, this.chartData.Total_Converted_Count);
      } else {
        this.toast.displayToast(res['Head']['Description']);
      }
      this.dataLoad = true;
    })
  }
}