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
  public getBillingServiceList(param) {
    return this._httpClient1.PostData("VisitDetail/GetServiceListwithTraiff", param)
  }

  public InsertOPBillingCredit(param) {
    return this._httpClient1.PostData("OPBill/OPCreditBillingInsert", param)
  }
  public InsertOPBilling(param) {
    return this._httpClient1.PostData("OPBill/OPBillingInsert", param)
  }
    public getRtevPackageDetList(param) {
        return this._httpClient1.PostData("BillingService/PackageDetailList", param);
    }
        public getRtevIPPackageDetList(param) {
        return this._httpClient1.PostData("IPBill/IpPackageDetailsList", param);
    }
       public UpdatePacakgeDet(param,chargesId) { 
        return this._httpClient1.PutData("IPBill/UpdateAddcharges/" + chargesId, param);
    }
           public InsertIPAddCharges(param) {
        return this._httpClient1.PostData("IPBill/InsertIPDPackageBill", param);
    }
      public AddchargesDelete(m_data, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient1.PostData("IPBill/IPAddchargesdelete" , m_data);
  }  
}
