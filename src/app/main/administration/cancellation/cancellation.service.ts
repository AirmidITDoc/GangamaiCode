import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class CancellationService {
  UserFormGroup: FormGroup;
  AdvanceFormGroup: FormGroup;
  RefOFBillFormGroup: FormGroup;
  RefOFAdvFormGroup: FormGroup;
  constructor(
    public _formBuilder: FormBuilder,
    public _httpClient: HttpClient,
    private _loaderService:LoaderService
  ) { this.UserFormGroup = this.createUserFormGroup();
    this.AdvanceFormGroup = this.createAdvanceFormGroup();
    this.RefOFBillFormGroup = this.createRefBillFormGroup();
    this.RefOFAdvFormGroup = this.createRefAdvFormGroup();
   }

  createUserFormGroup() {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      FirstName: '',
      LastName: '',
      PBillNo: '',
      OP_IP_Type: ['1']

    })
  }
  createAdvanceFormGroup() {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      FirstName: '',
      LastName: '',
      PBillNo: '',  
    })
  }
  createRefBillFormGroup() {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      FirstName: '',
      LastName: '',
      PBillNo: '', 
    })
  }
  createRefAdvFormGroup() {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      FirstName: '',
      LastName: '',
      PBillNo: '', 
    })
  }
  public getIpBillList(param) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseIPDBill", param) 
  }
  public getOPDBillsList(param) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseOPDBill_Pagi", param) 
  }
  public SaveCancelBill(param) {
    return this._httpClient.post("Administration/Billcancellation", param) 
  }
  public getDateTimeChange(m_data ,loader = true) {
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/ExecByQueryStatement?query=" + m_data,{});
}
public getIpdreturnAdvancepaymentreceipt(employee ,loader=true) {
  if(loader){
    this._loaderService.show();
  }
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseIPRefundAdvanceReceipt", employee)
}
public getIpdRefundBillBrowseList(employee,loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPRefundBillList", employee)
} 
public getDateTimeChangeReceipt(m_data,loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/ExecByQueryStatement?query=" + m_data,{});
}
public getIpdAdvanceBrowseList(employee,loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_BrowseIPAdvanceList", employee)
} 
}
