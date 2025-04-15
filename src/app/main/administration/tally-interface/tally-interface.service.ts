import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class TallyInterfaceService {

  tallyForm:FormGroup
  constructor(
    public _frombuilder:FormBuilder,
    public _httpClient:HttpClient,
    public _LoaderService:LoaderService
  ) 
  {this.tallyForm = this.CreaterTallyForm() }

  CreaterTallyForm(){
  return this._frombuilder.group({
    startdate: [(new Date()).toISOString()],
    enddate: [(new Date()).toISOString()],
    startdateIP: [(new Date()).toISOString()],
    enddateIP: [(new Date()).toISOString()],
    startdateAdv: [(new Date()).toISOString()],
    enddateAdv: [(new Date()).toISOString()],
  })
  }
  public getOpbilllist(emp, loader = true){
    if(loader){
      this._LoaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Tally_OPBillList_CashCounter", emp)
  }
  public getOpRefundist(emp, loader = true){
    if(loader){
      this._LoaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Tally_OPRefundBillList_CashCounter", emp)
  }
  public getAdvancelist(emp, loader = true){
    if(loader){
      this._LoaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_tally_IPAdv_PatientWise_Payment", emp)
  }
  public getAdvanceReflist(emp, loader = true){
    if(loader){
      this._LoaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_tally_IPAdvRefund_PatientWise_Payment", emp)
  }
  public getipBIlllist(emp, loader = true){
    if(loader){
      this._LoaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_tally_IP_BillList_PatientWise", emp)
  }
  public getippaymentwiselist(emp, loader = true){
    if(loader){
      this._LoaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_tally_IP_BillList_PatientWise_Payment", emp)
  }
  public getipbillcashcounterlist(emp, loader = true){
    if(loader){
      this._LoaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_tally_IP_BillList_CashCounter", emp)
  }
  public getipbillRefundlist(emp, loader = true){
    if(loader){
      this._LoaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_tally_IPBillRefund_BillList_PatientWise_Payment", emp)
  }
}
