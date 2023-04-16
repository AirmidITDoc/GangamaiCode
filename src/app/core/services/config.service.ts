import { Injectable } from '@angular/core';
import { ConfigSettingParams } from '../models/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  configParams: ConfigSettingParams;
  constructor() { }
  
  setCongiParam(configRes: ConfigSettingParams) {
    this.configParams = configRes;
  }

  getConfigParam() {
   
    return this.configParams;
  }
}
