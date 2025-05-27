import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IPReportService {
  userForm:FormGroup;
  constructor( public _formBuilder:UntypedFormBuilder,
    public _httpClient:HttpClient) {this.userForm=this.createUserFormGroup()}

    createUserFormGroup(){
      return this._formBuilder.group({
        startdate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()],
        UserId:'',
        DoctorId:'',
        AdmissionID:'',
        AdvanceDetailID:'',
        RequestId:'',
        PaymentId:'',
        MaterialConsumptionId:'',
        RoomId:'',
        CompanyId:'',
        DischargeTypeId:''
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
  public getCompanyCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCompanyMasterForCombo", {})
  }
  public getWardCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RoomMasterForCombo", {})
  }
public getAdmittedPatientListView(FromDate,ToDate,DoctorId,WardId){
  
  return this._httpClient.get("IPReport/view-IPDAdmissionList?FromDate=" + FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId+"&WardId="+WardId);
}

  public getCurrentAdmittedPatientListView(DoctorId,WardId,CompanyId){
  
  return this._httpClient.get("InPatient/view-Admitted_PatientList?DoctorId=" + DoctorId +"&WardId="+WardId+"&CompanyId="+CompanyId);
}
public getAdmittedPatientListCompanywiseView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-CompanyWiseAdmissionCountDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getCurrAdmitwardwisechargesView(DoctorId, WardId,CompanyId){
  
  return this._httpClient.get("IPReport/view-IPAdmitPatientwardwisechargesReport?DoctorId=" + DoctorId+"&WardId="+WardId+"&CompanyId="+CompanyId+"&WardId="+WardId);
}
  
public getAdmittedPatientListCompanywisesummaryView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-CompanyWiseAdmissionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getAdmittedPatientCasepaaperView(AdmissionId){
  
  return this._httpClient.get("InPatient/view-Admitted_PatientCasepaper?AdmissionId="+AdmissionId);
}

public getDischargedetailView(FromDate,ToDate,DischargeTypeId){
  
  return this._httpClient.get("IPReport/view-IPDDischargeDetails?FromDate=" + FromDate+"&ToDate="+ToDate+"&DischargeTypeId="+DischargeTypeId);
}
public getDischargedetailwithmarkView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-IPDDischargeReportWithMarkStatus?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getDischargedetailwithbillsummaryView(FromDate,ToDate,){
  
  return this._httpClient.get("IPReport/view-IPDDischargeReportWithBillSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getOptoIPconwithserviceavailedView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-OPToIPConvertedListWithServiceAvailed?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getIpcurrAdmitwardwisedischargeView(DoctorId,WardId,CompanyId){
  
  return this._httpClient.get("IPReport/view-IPAdmitPatientwardwisechargesReport?DoctorId=" + DoctorId+ WardId+"&WardId="+"&CompanyId="+CompanyId);
}
public getDischargetypecompanywiseView(FromDate,ToDate,DoctorId,DischargeTypeId){
  
  return this._httpClient.get("IPReport/view-IPDDischargeTypeCompanyWise?FromDate=" + FromDate + "&ToDate="+ToDate+"&DoctorId="+DoctorId + "&DischargeTypeId="+DischargeTypeId);
}



public getDeptwisecountsummaryView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-DepartmentWiseCountSummary?FromDate="+FromDate+"&ToDate="+ToDate);
}
public getRefdocwiseView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-IPDRefDoctorWise?FromDate="+FromDate+"&ToDate="+ToDate);
}

public getDischargetypewisecompanycountView(FromDate,ToDate,DoctorId,DischargeTypeId){
  
  return this._httpClient.get("IPReport/view-IPDDischargeTypeCompanyWiseCount?FromDate=" + FromDate +"&ToDate="+ToDate+"&DoctorId="+DoctorId+"&DischargeTypeId="+DischargeTypeId);
}


public getDischargetypewiseView(DoctorId,FromDate,ToDate,DischargeTypeId){
  
  return this._httpClient.get("IPReport/view-IPDischargeTypeReport?DoctorId="+DoctorId+"&FromDate="+FromDate+"&ToDate="+ToDate+"&DischargeTypeId="+DischargeTypeId);
}
 
public getDischargetypeCombo() {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DischargeTypeForCombo", {})
}

public getCurrRefDoctAdmitlistView(DoctorId){
  
  return this._httpClient.get("IPReport/view-IPCurrentrefadmittedReport?DoctorId=" + DoctorId);
}
public getDoctwisecountsummaryView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-DoctorWiseCountSummary?FromDate="+FromDate+"&ToDate="+ToDate);
}
public getViewAdvanceReceipt(AdvanceDetailID){
 return this._httpClient.get("InPatient/view-IP-AdvanceSummaryReceipt?AdvanceDetailID=" + AdvanceDetailID);
}

public getLabrequestview(RequestId){
  return this._httpClient.get("InPatient/view-IP-Labrequest?RequestId=" + RequestId);
}

  
public getIpPaymentReceiptView(PaymentId){
  
  return this._httpClient.get("InPatient/view-IP-SettlementReceipt?PaymentId=" + PaymentId);
}

getMaterialconsumptionView(MaterialConsumptionId){
  
  return this._httpClient.get("InPatient/view-MaterialConsumption?MaterialConsumptionId=" + MaterialConsumptionId);
}
public getMaterialConsumptionReport(MaterialConsumptionId){
  return this._httpClient.get("InPatient/view-MaterialConsumption?MaterialConsumptionId="+MaterialConsumptionId);
}

public getDischargetypewiseReport(DoctorId,FromDate,ToDate,DischargeTypeId){
  return this._httpClient.get("InPatient/view-MaterialConsumption?DoctorId="+DoctorId+"&FromDate="+FromDate+"&ToDate="+ToDate+"&DischargeTypeId="+DischargeTypeId);
}



//IPMIS
public getDatewiseAdmissioncountView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-DateWiseAdmissionCount?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getMonthwiseAdmissioncountView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-MonthWiseAdmissionCount?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getdatedrwiseAdmissioncountView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-DateWiseDoctorWiseAdmissionCountDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getdatedrwiseAdmissioncountsummaryView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-DateWiseDoctorWiseAdmissionCountSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getdatedrwisedeptwiseAdmissioncountdetailView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-DateWiseDepartmentWiseAdmissionCountDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getdatedrwisedeptwiseAdmissioncountsummaryView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-DateWiseDepartmentWiseAdmissionCountSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getdoctorwisecolldetailView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-DrWiseCollectionDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getDoctorwisecollsummaryView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-DrWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getDeptwisecolldetailView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-DepartmentWiseCollectionDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getDeptwisecollsummaryView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-DepartmentWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getCompanywiseAdmissioncountView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-CompanyWiseAdmissionCountDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getCompanywiseAdmissioncountsummaryView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-CompanyWiseAdmissionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getCompanywisebilldetailView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-CompanyWiseBillDetailReport?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getCompanywisebillsummaryView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-CompanyWiseBillSummaryReport?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getCompanywisecreditView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-CompanyWiseCreditReportDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getCompanywisecreditsummaryView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-CompanyWiseCreditReportSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}

// IPBilling

public getIPDailyCollection(FromDate,ToDate,AddedById){
  return this._httpClient.get("IPReport/view-IPDailyCollectionReport?FromDate=" +  FromDate + "&ToDate=" + ToDate+"&AddedById="+AddedById);
}

public getOPIPCommanCollectionSummary(FromDate,ToDate,AddedById,DoctorId){
  return this._httpClient.get("IPReport/view-CommanDailyCollectionReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById+"&DoctorId="+DoctorId);
}


public getOPIPBillSummary(FromDate,ToDate){
  return this._httpClient.get("IPReport/view-OPIPBILLSummaryReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}


public getCreditReceipt(FromDate,ToDate){
  return this._httpClient.get("IPReport/view-IPCreditReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}

public getViewAdvanceReport(FromDate,ToDate){
  return this._httpClient.get("IPReport/view-IPDAdvanceReport?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getIpBillReport(FromDate,ToDate,AddedById,){
  return this._httpClient.get("IPReport/view-BillReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById);
}


public getIPBillSummary(FromDate,ToDate){
  return this._httpClient.get("IPReport/view-BillSummaryReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}

public getRefundofbillview(FromDate,ToDate){
  return this._httpClient.get("IPReport/view-RefundofBillReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}

public getIPDischargeBillgeneratependingview(FromDate,ToDate){
  return this._httpClient.get("view-IPDischargeAndBillGenerationPendingReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}

public getIpbillgenepaymentdueView(FromDate,ToDate){
  
  return this._httpClient.get("IPReport/view-IPBillGenerationPaymentDueReport?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getIdischargebillgenependingView(FromDate,ToDate){
  
  return this._httpClient.get("CommanReport/view-IPDischargeBillGenerationPendingReport?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getBillgeneratepaymentdueview(FromDate,ToDate){
  return this._httpClient.get("IPReport/view-IPCreditReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}

public getRefundofAdvanceview(FromDate,ToDate){
  return this._httpClient.get("IPReport/view-RefundofAdvanceReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}

// /doc share


public getDoctorShareReportView(FromDate,ToDate,DoctorId){
  
  return this._httpClient.get("DoctorShareReports/view-DoctorShareReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId);
}

public getDoctorSharesummaryReportView(FromDate,ToDate,DoctorId){
  
  return this._httpClient.get("DoctorShareReports/viewDoctorWiseSummaryReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId);
}
public getConDoctorSharesReportView(FromDate,ToDate,DoctorId){
  return this._httpClient.get("DoctorShareReports/ViewConDoctorShareDetails?FromDate="+FromDate + "&ToDate="+ToDate+"&DoctorId="+DoctorId);
}

public getDoctorShareListWithChargesview(FromDate,ToDate,DoctorId){
  return this._httpClient.get("DoctorShareReports/ViewDoctorShareListWithCharges?FromDate=" + FromDate + "&ToDate="+ToDate+"&DoctorId="+DoctorId);
}
}