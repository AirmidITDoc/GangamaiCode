import { Injectable } from '@angular/core';
import { DashConfigSettingParams } from '../models/config';
import { ApiCaller } from './apiCaller';
import { AuthenticationService } from './authentication.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardserviceService {

  DashboardconfigParams: DashConfigSettingParams;
  constructor(private http: ApiCaller, private accountService: AuthenticationService,) { }

  setCongiParam(configRes: DashConfigSettingParams) {
    
    this.DashboardconfigParams = configRes;
  }

  getConfigParam() {
debugger
    return this.DashboardconfigParams;
  }
  // UserAcessConfigSetting: any = [];


    public get DashValue(): DashConfigSettingParams {
      debugger
        return this.DashboardconfigParams
    }

  
  // UserAccConfigSettingParam() {
  //   const Params =
  //   {
  //     "searchFields": [{
  //       "fieldName": "LoginId",
  //       "fieldValue": String(this.accountService.currentUserValue.userId),
  //       "opType": "Equals"
  //     }],
  //     "mode": "LoginWiseAccessConfigList"  //SystemConfigList
  //   }


  //   this.http.PostData("Common", Params).subscribe(data1 => {
  //     if (data1) {
  //       debugger
  //       this.DashboardconfigParams = data1;
  //       console.log(this.DashboardconfigParams)
  //     return this.DashboardconfigParams;
  //     }
  //   })

  // }
// UserAccConfigSettingParam(): Observable<any> {
//   const Params = {
//     searchFields: [{
//       fieldName: "LoginId",
//       fieldValue: String(this.accountService.currentUserValue.userId),
//       opType: "Equals"
//     }],
//     mode: "LoginWiseAccessConfigList"
//   };

//   // return this.http.PostData("Common", Params);
//   const data = await this.http.PostData("Common", Params).toPromise();
//   return data;
// }


async UserAccConfigSettingParam1(): Promise<any> {
  const Params = {
    searchFields: [{
      fieldName: "LoginId",
      fieldValue: String(this.accountService.currentUserValue.userId),
      opType: "Equals"
    }],
    mode: "LoginWiseAccessConfigList"
  };

  const data = await this.http.PostData("Common", Params).toPromise();
  debugger
  this.DashboardconfigParams = data;

  return data;
}
}