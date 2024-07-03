import { Component, OnInit } from '@angular/core';
import { MarketService } from '../../pages/markets/markets.service';

@Component({
  selector: 'app-indices-markets',
  providers: [MarketService],
  templateUrl: './indices-markets.component.html',
  styleUrls: ['./indices-markets.component.scss'],
})
export class IndicesMarketsComponent implements OnInit {
    public dataLoad: boolean = false;
    public skeletonHight:any [] = [
        {}, {}, {}, {}, {}, {}, {}
    ]
    globalMarketList:any[] = [];
    public datas: any[] = [
        { scrip: 'Hang Seng', ltp: '16,324.00', change: '80.20(5.69%)', ltpColor: 5 },
        { scrip: 'Nasdaq', ltp: '16,324.00', change: '80.20(5.69%)', ltpColor: 0 },
        { scrip: 'DJIA', ltp: '16,324.00', change: '80.20(5.69%)', ltpColor: -5 },
        { scrip: 'S&P500', ltp: '16,324.00', change: '80.20(5.69%)', ltpColor: 5 },
        { scrip: 'Nikkei 225', ltp: '16,324.00', change: '80.20(5.69%)', ltpColor: 0 },
    ];
    constructor(private marService: MarketService) { }

    ngOnInit() {
        this.marService.getMarketIndices().subscribe((res: any) => {
            this.globalMarketList = res['data'].indices;
            // console.log(this.globalMarketList);
        })
        setTimeout(() => {
            this.dataLoad = true;
        }, 1000);
     }

}
