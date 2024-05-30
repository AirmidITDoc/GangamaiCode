import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OPReportsService {
  userForm:FormGroup;
  constructor( public _formBuilder:FormBuilder,
    public _httpClient:HttpClient) {this.userForm=this.createUserFormGroup()}

    createUserFormGroup(){
      return this._formBuilder.group({
        startdate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()],
        UserId:'',
        DoctorId:'',
        
        VisitId:'',
       PaymentId:'',
        RefundId:'',
        DoctorID:''
        // Radio:['1']

      })
    }
  public getDataByQuery(emp) {
        return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ReportList",emp)
  }

  public getUserdetailList(data){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_loginManagerUserForCombo",data)
  }

  public getDoctorList(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo",{})
  }
 
  public getOpPaymentview(PaymentId){
    return this._httpClient.get("OutPatient/view-OP-PaymentReceipt?PaymentId=" + PaymentId);
  }
  public getAppointmentReport(VisitId){
    return this._httpClient.get("OutPatient/view-PatientAppointment?VisitId=" + VisitId);
  }
  
  public getRegisteredPatientCasepaaperView(VisitId){
  
    return this._httpClient.get("OutPatient/view-PatientAppointment?VisitId=" + VisitId);
  }

  

  public getDoctorwisevisistView(VisitId){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo",+ VisitId)
  }
 
  public getdepartmentwisecountsummView(PaymentId){
    return this._httpClient.get("OutPatient/view-OP-PaymentReceipt?PaymentId=" + PaymentId);
  }
  public getDocwisevisitsummaryView(VisitId){
    return this._httpClient.get("OutPatient/view-PatientAppointment?VisitId=" + VisitId);
  }
  
  public getAppointmentlistwithserviceavailedView(VisitId){
  
    return this._httpClient.get("OutPatient/view-PatientAppointment?VisitId=" + VisitId);
  }
  public getDocwisenewoldpatientView(VisitId){
  
    return this._httpClient.get("OutPatient/view-PatientAppointment?VisitId=" + VisitId);
  }

  public getDeptwiseopdcollsummaryView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentWiseOpdCountSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }

  

  // OPD MIS 
  
  public getdaywiseopdcountdetailReport(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DayWiseOpdCountDetails?FromDate=" + FromDate+"&ToDate="+ToDate);
  }


  public getdaywiseopdcountsummaryReport(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DayWiseOpdCountSummry?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getDeptwiseopdcountView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentWiseOpdCountSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getDeptwiseopdcountsummaryView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentWiseOpdCountSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getDeptservicegroupcollsummaryView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }


  //common
  public getdocwisepatinetcountReport(FromDate,ToDate,DosctorID){
  
    return this._httpClient.get("CommanReport/view-DoctorWisePatientCountReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&DosctorID"+DosctorID);
  }

  
  public getRefdocwisepatientcountReport(FromDate,ToDate){
  
    return this._httpClient.get("CommanReport/view-ReferenceDoctorWisePatientCountReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
 



  public getConcessionreportView(FromDate,ToDate){
  
    return this._httpClient.get("CommanReport/view-ConcessionReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getDailycollectionView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getDailycollsummaryView(FromDate,ToDate){
  
    return this._httpClient.get("CommanReport/view-DailyCollectionSummaryReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getgroupwisecollView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getgroupwisesummaryView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getgroupwiserevenusummaryView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getCreditreportView(FromDate,ToDate){
  
    return this._httpClient.get("CommanReport/view-CreditReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  
  public getPatientledgerView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getservicewisereportwithoutbillView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getServicewisereportwithbillView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getServicewisereportView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }

  public getBillsummarywithtcsView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }

  public getRefbypatientView(FromDate,ToDate){
  
    return this._httpClient.get("CommanReport/view-RefByPatientList?FromDate=" + FromDate+"&ToDate="+ToDate);
  }

 
  public getCanclechargesView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getDocDeptwisemonthcollectionView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getIpcompanywisebillView(FromDate,ToDate){
  
    return this._httpClient.get("CommanReport/view-IPCompanyWiseBillReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getCompanywisecreditbillView(FromDate,ToDate){
  
    return this._httpClient.get("CommanReport/view-IPCompanyWiseCreditReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getIdischargebillgenependingView(FromDate,ToDate){
  
    return this._httpClient.get("CommanReport/view-IPDischargeBillGenerationPendingReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getIpbillgenepaymentdueView(FromDate,ToDate){
  
    return this._httpClient.get("CommanReport/view-IPBillGenerationPaymentDueReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getBillgenefor2lakhamtView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getCollectionsummaryView(FromDate,ToDate){
  
    return this._httpClient.get("CommanReport/view-CollectionSummaryReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getBillgeneforopdipdView(FromDate,ToDate){
  
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }

  
  }