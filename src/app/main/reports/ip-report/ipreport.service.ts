import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class IPReportService {
  userForm:FormGroup;
  constructor( public _formBuilder:FormBuilder,
    private _loaderService: LoaderService,
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
        DischargeTypeId:'',
        GroupId:'',
        OPIPType:["2"],
        RegId:[""]
        // Radio:['1']

      })
    }
  public getDataByQuery(emp) {
        return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ReportList",emp)
  }

  public getUserdetailList(data){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_loginManagerUserForCombo",data)
  }

  public getDoctorMaster(param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorListMasterForCombo", param) //m_Rtrv_DoctorListMasterForCombo
  }
  
  public getgroupList(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveGroupMasterForCombo",{})
  }

  public getCompanyCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCompanyMasterForCombo", {})
  }
  public getWardCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RoomMasterForCombo", {})
  }
public getAdmittedPatientListView(FromDate,ToDate,DoctorId,WardId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPDAdmissionList?FromDate=" + FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId+"&WardId="+WardId);
}

  public getCurrentAdmittedPatientListView(FromDate,ToDate,DoctorId,WardId,CompanyId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("IPReport/view-IPDCurrentAdmittedList?FromDate="+FromDate+"&ToDate="+ToDate+ "&DoctorId="+ DoctorId +"&WardId="+WardId+"&CompanyId="+CompanyId);
}
public getAdmittedPatientListCompanywiseView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-CompanyWiseAdmissionCountDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getCurrAdmitwardwisechargesView(FromDate,ToDate,DoctorId, WardId,CompanyId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPDCurrentAdmittedWardWiseCharges?FromDate="+FromDate+"&ToDate="+ToDate+ "&DoctorId="+ DoctorId +"&WardId="+WardId+"&CompanyId="+CompanyId);
}
  
public getAdmittedPatientListCompanywisesummaryView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-CompanyWiseAdmissionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getAdmittedPatientCasepaaperView(AdmissionId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-Admitted_PatientCasepaper?AdmissionId="+AdmissionId);
}

public getDischargedetailView(FromDate,ToDate,DischargeTypeId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPDDischargeDetails?FromDate=" + FromDate+"&ToDate="+ToDate+"&DischargeTypeId="+DischargeTypeId);
}
public getDischargedetailwithmarkView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPDDischargeReportWithMarkStatus?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getDischargedetailwithbillsummaryView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPDDischargeReportWithBillSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getOptoIPconwithserviceavailedView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-OPToIPConvertedListWithServiceAvailed?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getIpcurrAdmitwardwisedischargeView(DoctorId,WardId,CompanyId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPAdmitPatientwardwisechargesReport?DoctorId=" + DoctorId+ WardId+"&WardId="+"&CompanyId="+CompanyId);
}
public getDischargetypecompanywiseView(FromDate,ToDate,DoctorId,DischargeTypeId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPDDischargeTypeCompanyWise?FromDate=" + FromDate + "&ToDate="+ToDate+"&DoctorId="+DoctorId + "&DischargeTypeId="+DischargeTypeId);
}



public getDeptwisecountsummaryView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-DepartmentWiseCountSummary?FromDate="+FromDate+"&ToDate="+ToDate);
}
public getRefdocwiseView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPDRefDoctorWise?FromDate="+FromDate+"&ToDate="+ToDate);
}

public getDischargetypewisecompanycountView(FromDate,ToDate,DoctorId,DischargeTypeId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPDDischargeTypeCompanyWiseCount?FromDate=" + FromDate +"&ToDate="+ToDate+"&DoctorId="+DoctorId+"&DischargeTypeId="+DischargeTypeId);
}


public getDischargetypewiseView(DoctorId,FromDate,ToDate,DischargeTypeId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPDischargeTypeReport?DoctorId="+DoctorId+"&FromDate="+FromDate+"&ToDate="+ToDate+"&DischargeTypeId="+DischargeTypeId);
}
 
public getDischargetypeCombo() {
 
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DischargeTypeForCombo", {})
}

public getCurrRefDoctAdmitlistView(DoctorId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  
  return this._httpClient.get("IPReport/view-IPCurrentrefadmittedReport?DoctorId=" + DoctorId);
}
public getDoctwisecountsummaryView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  
  return this._httpClient.get("IPReport/view-DoctorWiseCountSummary?FromDate="+FromDate+"&ToDate="+ToDate);
}
public getViewAdvanceReceipt(AdvanceDetailID,loader = true){
  if (loader) {
    this._loaderService.show();
}
 return this._httpClient.get("InPatient/view-IP-AdvanceSummaryReceipt?AdvanceDetailID=" + AdvanceDetailID);
}

public getLabrequestview(RequestId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IP-Labrequest?RequestId=" + RequestId);
}

  
public getIpPaymentReceiptView(PaymentId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IP-SettlementReceipt?PaymentId=" + PaymentId);
}

getMaterialconsumptionView(MaterialConsumptionId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-MaterialConsumption?MaterialConsumptionId=" + MaterialConsumptionId);
}
public getMaterialConsumptionReport(MaterialConsumptionId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-MaterialConsumption?MaterialConsumptionId="+MaterialConsumptionId);
}

public getDischargetypewiseReport(DoctorId,FromDate,ToDate,DischargeTypeId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-MaterialConsumption?DoctorId="+DoctorId+"&FromDate="+FromDate+"&ToDate="+ToDate+"&DischargeTypeId="+DischargeTypeId);
}



//IPMIS
public getDatewiseAdmissioncountView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-DateWiseAdmissionCount?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getMonthwiseAdmissioncountView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-MonthWiseAdmissionCount?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getdatedrwiseAdmissioncountView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-DateWiseDoctorWiseAdmissionCountDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getdatedrwiseAdmissioncountsummaryView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-DateWiseDoctorWiseAdmissionCountSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getdatedrwisedeptwiseAdmissioncountdetailView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-DateWiseDepartmentWiseAdmissionCountDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getdatedrwisedeptwiseAdmissioncountsummaryView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-DateWiseDepartmentWiseAdmissionCountSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getdoctorwisecolldetailView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-DrWiseCollectionDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getDoctorwisecollsummaryView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-DrWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getDeptwisecolldetailView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-DepartmentWiseCollectionDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getDeptwisecollsummaryView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-DepartmentWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getCompanywiseAdmissioncountView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-CompanyWiseAdmissionCountDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getCompanywiseAdmissioncountsummaryView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-CompanyWiseAdmissionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getCompanywisebilldetailView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-CompanyWiseBillDetailReport?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getCompanywisebillsummaryView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-CompanyWiseBillSummaryReport?FromDate=" + FromDate+"&ToDate="+ToDate);
}


public getCompanywisecreditView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-CompanyWiseCreditReportDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getCompanywisecreditsummaryView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-CompanyWiseCreditReportSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
}

// IPBilling

public getIPDailyCollection(FromDate,ToDate,AddedById,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPDailyCollectionReport?FromDate=" +  FromDate + "&ToDate=" + ToDate+"&AddedById="+AddedById);
}

public getOPIPCommanCollectionSummary(FromDate,ToDate,AddedById,DoctorId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-CommanDailyCollectionReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById+"&DoctorId="+DoctorId);
}


public getOPIPBillSummary(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-OPIPBILLSummaryReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}


public getCreditReceipt(FromDate,ToDate,RegId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPCreditReport?FromDate=" + FromDate + "&ToDate="+ToDate+ "&RegId="+RegId);
}

public getViewAdvanceReport(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPDAdvanceReport?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getIpBillReport(FromDate,ToDate,AddedById,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-BillReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById);
}


public getIPBillSummary(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-BillSummaryReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}

public getBrowseIPDBillsummaryList(data,loader = true){
  if (loader) {
    this._loaderService.show();
}

  return this._httpClient.post("Generic/GetByProc?procName=rptIPDBillDateWise",data)

}
public getDischargetypewiseData(data,loader = true){
  if (loader) {
    this._loaderService.show();
} 
  return this._httpClient.post("Generic/GetByProc?procName=rptDischargeTypeReport",data) 
}


public getRefundofbillview(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-RefundofBillReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}

public getIPDischargeBillgeneratependingview(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("view-IPDischargeAndBillGenerationPendingReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}

public getIpbillgenepaymentdueView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPBillGenerationPaymentDueReport?FromDate=" + FromDate+"&ToDate="+ToDate);
}

public getIdischargebillgenependingView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("CommanReport/view-IPDischargeBillGenerationPendingReport?FromDate=" + FromDate+"&ToDate="+ToDate);
}
public getBillgeneratepaymentdueview(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-IPCreditReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}

public getRefundofAdvanceview(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("IPReport/view-RefundofAdvanceReport?FromDate=" + FromDate + "&ToDate="+ToDate);
}

// /doc share


public getDoctorShareReportView(Doctor_Id, GroupId, From_Dt, To_Dt, OP_IP_Type,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("DoctorShareReports/view-DoctorShareReport?Doctor_Id=" + Doctor_Id+"&GroupId="+GroupId+"&From_Dt="+From_Dt+"&To_Dt="+To_Dt+"&OP_IP_Type="+OP_IP_Type);
}

public getDoctorSharesummaryReportView(Doctor_Id, GroupId, From_Dt, To_Dt, OP_IP_Type,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("DoctorShareReports/viewDoctorWiseSummaryReport?Doctor_Id=" + Doctor_Id+"&GroupId="+GroupId+"&From_Dt="+From_Dt+"&To_Dt="+To_Dt+"&OP_IP_Type="+OP_IP_Type);
}
public getConDoctorSharesReportView(FromDate,ToDate,DoctorId,OPD_IPD_Type,loader = true){
  debugger
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("DoctorShareReports/ViewConDoctorShareDetails?FromDate=" + FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId+"&OPD_IPD_Type="+OPD_IPD_Type);
  
}

  public getDoctorShareListWithChargesview(Doctor_Id, GroupId, From_Dt, To_Dt, OP_IP_Type, loader = true) {
    debugger
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.get("DoctorShareReports/ViewDoctorShareListWithCharges?Doctor_Id=" + Doctor_Id + "&GroupId=" + GroupId + "&FromDate=" + From_Dt + "&Todate=" + To_Dt + "&OP_IP_Type=" + OP_IP_Type);
  }

  public getAdmittedPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch", employee)
  }

  getPatientVisitedListSearch(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientRegistrationList",employee)
  }
}