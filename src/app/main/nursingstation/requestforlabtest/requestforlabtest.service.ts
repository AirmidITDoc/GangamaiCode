import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RequestforlabtestService {
  myFormGroup: any;
  

  constructor(
    public _httpClient:HttpClient,public _httpClient1:ApiCaller,
    private _FormBuilder:UntypedFormBuilder,
    private handler: HttpBackend
  ) { this.mySearchForm = this.SearchFilterForm();
    this.myFormGroup = this.createBedForm();
  }

  mySearchForm:FormGroup;

  SearchFilterForm():FormGroup{
    return this._FormBuilder.group({
      startdate :[(new Date()).toISOString()],
      enddate :[(new Date()).toISOString()],
      RegNo :''
    })

  }

  createBedForm(): FormGroup {
        return this._FormBuilder.group({
            requestId: [0],
            reqDate: "2025-10-03",
            reqTime: "10:45:00AM",
            opIpId: [""],
            opIpType: [""],
            isAddedBy: [""],
            isCancelled: true,
            isCancelledBy: 0,
            isCancelledDate: "2025-10-03",
            isCancelledTime:"2025-10-03",
            isType: [0],
            isOnFileTest: true,
            tDlabRequests: [
                {
                    reqDetId: [0],
                    requestId: [""],
                    serviceId: [""],
                    price: [""],
                    isStatus: true,
                    addedBillingId: 0,
                    addedByDate: "2025-10-03",
                    addedByTime: "10:45:00AM",
                    charId: 0,
                    isTestCompted: true,
                    isOnFileTest: true,
                }
            ]
        });
    }

    public getserviceList(param) {
        return this._httpClient1.PostData("BillingService/BillingList",param);
    }

    // new dropdown
    public getRegistraionById(Id) {
    return this._httpClient1.GetData("OutPatient/" + Id);
    }
    public getPrintRequesttList(Param){
        return this._httpClient.post("Generic/GetByProc?procName=rptLabRequestList",Param)
    }

    public getRequesttList(Param){
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_LabRequest_Nursing",Param)
    }//Rtrv_LabRequest_Nursing

    public getRequestdetList(Param){
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_NursingLabRequestDetails",Param)
    }
    
    public getAdmittedPatientList(employee) {
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch", employee)
    }

    public getAdmittedpatientlist(id){
        
        return this._httpClient1.GetData("Admission/" + id);
    }

    public getPatientVisitedListSearch(employee) {//m_Rtrv_PatientVisitedListSearch
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
    }
    
    public getServiceListDetails(Param){
        return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathRadServiceList",Param);
    }

    public getRegistrationList(Param){
        return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatientRegistrationList",Param);
    }

    public Canclerequest(query){
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
    }




    public sendPaymentDetails(emp){
        return this._httpClient.post("PaymentGetway/OnlinePayment",emp);
    }

    public getPaymentStatus(emp){
        return this._httpClient.post("PaymentGetway/OnlinePaymentStatus",emp);
    }

    public cancelPayment(emp){
        return this._httpClient.post("PaymentGetway/OnlinePaymentCancel",emp);
    }
    
    public getLabrequestview(RequestId){
        return this._httpClient.get("InPatient/view-IP-Labrequest?RequestId=" + RequestId);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient1.PostData("PhoneApp", m_data);
    }

    // demo list
    public getAllList(param) {
        return this._httpClient1.PostData("ParameterMaster/MPathParameterList",param);
    }
    public LabRequestSave(employee) {
    return this._httpClient1.PostData("IPPrescription/LabRequestInsert", employee);
    }
}


 