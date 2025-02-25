import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class AppointmentBillService {

  constructor(public _httpClient1: ApiCaller, private _formBuilder: UntypedFormBuilder, private _loaderService: LoaderService,
          ) { }


          public getRegistraionById(Id) {
            return this._httpClient1.GetData("OutPatient/" + Id);
        }
        public getVisitById(Id) {
          return this._httpClient1.GetData("VisitDetail/" + Id);
      }
      public getBillingServiceList(employee) {
        return this._httpClient1.PostData("VisitDetail/GetServiceListwithTraiff", employee)
     }
    
public InsertOPBillingCredit(employee) {
  return this._httpClient1.PostData("OPBill/OPCreditBillingInsert",employee)
}
public InsertOPBilling(employee) {
  return this._httpClient1.PostData("OPBill/OPBillingInsert", employee)
}
}
