import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@microsoft/signalr';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class DietRequestService {

  constructor(public _frombuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller
  
  ) { }

createMyForm() {
        return this._frombuilder.group({
            WardName: [''],
            RegID: [''],
            PatientName: ['']
            // FromDate:[new Date()],
            // ToDate:[new Date()],
        })
    }
  public CanrequestCancle(Param) {
    // return this._httpClient1.PostData("CanteenRequest/CanteenRequestCancel", Param);
  }

   public Requestcancle(employee, loader = true) {

        return this._httpClient.PostData("DietPatientRequest/DietPatientReqHeaderCancel", employee);
    }

      public DetailRequestcancle(employee, loader = true) {

        return this._httpClient.PostData("DietPatientRequest/DietPatReqDetailCanel", employee);
    }

      public RequestAccept(employee, loader = true) {

        return this._httpClient.PostData("DietPatientRequest/DietPatReqDetailAccept", employee);
    }
         public RequestDeliver(employee, loader = true) {

        return this._httpClient.PostData("DietPatientRequest/DietPatReqDetailDelivered", employee);
    }
    public SaveDietReq(Param: any) {
        if (Param.dietReqId) {
            return this._httpClient.PutData("DietPatientRequest/Edit/" + Param.dietReqId, Param);
        } else return this._httpClient.PostData("DietPatientRequest/Insert", Param);
    }
     public getRequestlist(employee) {
        return this._httpClient.PostData("DietPatientRequest/DietPatientRequestHeaderList", employee)
    }
 public getRequestdetaillist(employee) {
        return this._httpClient.PostData("DietPatientRequest/DietPatientRequestDetailsList", employee)
    }

    
}
