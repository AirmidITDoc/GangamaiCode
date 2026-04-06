import { Injectable } from '@angular/core';
import { ConfigSettingParams } from '../models/config';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    configParams: ConfigSettingParams;
     configParams1: ConfigSettingParams;
    constructor() { }

    setCongiParam(configRes: ConfigSettingParams) {
        this.configParams = configRes;
    }

    setCongiParam1(configRes: ConfigSettingParams) {
        this.configParams1 = configRes;
    }
    getConfigParam() {
        return this.configParams;
    }

     getConfigParam1() {
        return this.configParams1;
    }

     
}
