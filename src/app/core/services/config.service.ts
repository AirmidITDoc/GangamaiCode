import { Injectable } from '@angular/core';
import { ConfigSettingParams, ConfigSettingUserAccessParams } from '../models/config';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    configParams: ConfigSettingParams;
    userAccessParam: ConfigSettingUserAccessParams[];
    constructor() { }

    setCongiParam(configRes: ConfigSettingParams) {
        this.configParams = configRes;
    }

    setCongiParam1(configRes: ConfigSettingUserAccessParams[]) {
        this.userAccessParam = configRes;
    }
    getConfigParam() {
        return this.configParams;
    }

    getConfigParam1() {
        return this.userAccessParam;
    }


}
