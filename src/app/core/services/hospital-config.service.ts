import { Injectable } from '@angular/core';
import { HospitalConfigSettingParams } from '../models/config';

@Injectable({
    providedIn: 'root'
})
export class HospitalConfigService {

    HospitalconfigParams: HospitalConfigSettingParams;
    constructor() { }

    setCongiParam(configRes: HospitalConfigSettingParams) {
        this.HospitalconfigParams = configRes;
    }

    getConfigParam() {
        return this.HospitalconfigParams;
    }
}
