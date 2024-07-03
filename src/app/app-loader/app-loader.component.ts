import { Component, OnInit } from "@angular/core";
import { AppLoaderService } from "./app-loader.service";

@Component({
    selector: "app-loader",
    templateUrl: "app-loader.component.html",
    styleUrls: ["app-loader.component.scss"]
})

export class AppLoaderComponent implements OnInit{
    show: boolean = false;

    constructor(private _appLoaderService: AppLoaderService)
    {}
    ngOnInit(): void {
        this._appLoaderService.loadState.subscribe(res => {
            this.show = res;
        });
    }

}