import {Injectable} from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class StorageServiceAAA {

    constructor(public storage: Storage){
        this.storage.create();
    }

    // async ngOnInit() {
	// 	// If using a custom driver:
	// 	// await this.storage.defineDriver(MyCustomDriver)
	// 	await this.storage.create();
	// }

    public get = (storageValue: any) : Promise<any> => {
        return this.storage.get(storageValue).then((val) => {
            return new Promise((resolve, reject) => {
                resolve(val);
            });
        });
    }

    public set = (storageValueName: any, storageValue: any) => {
        this.storage.set(storageValueName, storageValue);
    }

    public clear = () => {
        this.storage.clear();
    }

    public remove = (storageValueName: any) => {
        this.storage.remove(storageValueName)
    }
}
