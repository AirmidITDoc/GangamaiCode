import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class OPReportsService {
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
        VisitId:'',
        PaymentId:'',
        RefundId:'',
        DoctorID:'',
        ServiceId:'',
        DepartmentId:'',
        GroupId:'',
        CashCounterID:'',
        OPIPType:["1"],
        SupplierName:'',
        StoreId:'',
        StoreId1:'',
        NonMoveday:'',
        ItemId:'',
        Id:'',
        Month :'',
        Year:'',
        Day:'',
        IsNarcotic:[0],
        ish1Drug:[0],
        isScheduleH:[0],
        IsHighRisk:[0],
        IsScheduleX:[0],
        ReportType:[1]
        // Radio:['1']

      })
    }
  public getDataByQuery(emp) {
        return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ReportList",emp)
  }

  public getUserdetailList(data){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_loginManagerallUserForCombo",data)
  }

  public getDoctorList(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo",{})
  }
 
  public getOpPaymentview(PaymentId,loader = true){
    return this._httpClient.get("OutPatient/view-OP-PaymentReceipt?PaymentId=" + PaymentId);
  }

  
  public getRegisteredPatientCasepaaperView(VisitId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OutPatient/view-PatientAppointment?VisitId=" + VisitId);
  }

  public getDocwisevisitsummaryView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-OPDoctorWiseVisitCountSummary?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  
//opReports
  public getRegistrationlistReport(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-RegistrationReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }

  public getAppointmentListReport(Doctor_Id,FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-AppointmentListReport?Doctor_Id=" + Doctor_Id+"&FromDate="+FromDate+"&ToDate="+ToDate);
  }
  
  public getDoctorwisevisitView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DoctorWiseVisitReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getRefDoctorwisevisitView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-RefDoctorWiseReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getdepartmentwisecountsummView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DepartmentWisecountSummury?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  public getDocwisevisitCountsummaryView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DoctorWiseOpdCountSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getAppointmentlistwithserviceavailedView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-OPAppoinmentListWithServiseAvailed?FromDate="+FromDate+"&ToDate="+ToDate);
  }

  
  public getCrossConsultationreportView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-CrossConsultationReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }


  public getDocwisenopdcollsummarytView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DoctorWiseOpdCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }


 public getDocwisenewoldpatientView(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
return this._httpClient.get("OPReport/view-OPDoctorWiseNewOldPatientReport?FromDate="+FromDate+"&ToDate="+ToDate);
 }

  // OPD MIS 
  
  public getdaywiseopdcountdetailReport(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DayWiseOpdCountDetails?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getdaywiseopdcountsummaryReport(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DayWiseOpdCountSummry?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  


  public getDeptwiseopdcountView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DepartmentWiseOPDCount?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getDeptwiseopdcountsummaryView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DepartmentWiseOpdCountSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
 
  public getDrwiseopdcountdetailView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DrWiseOPDCountDetail?FromDate=" + FromDate+"&ToDate="+ToDate);
  }

  public getDocwisenopdcolldetailtView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DrWiseOPDCollectionDetails?FromDate=" + FromDate+"&ToDate="+ToDate);
  }

  public getDoctorwisenopdcollsummarytView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DoctorWiseOpdCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }

  public getDeptwiseopdcolldetailView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DepartmentWiseOPDCollectionDetails?FromDate=" + FromDate+"&ToDate="+ToDate);
  }

  public getDeptwiseopdcollsummaryView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DepartmentWiseOpdCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }

  public getDeptservicegroupcollsummaryView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getDeptservicegroupcolldetailView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionDetails?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  //common
  public getdocwisepatinetcountReport(FromDate,ToDate,DosctorID,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-DoctorWisePatientCountReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&DosctorID"+DosctorID);
  }

  
  public getRefdocwisepatientcountReport(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-ReferenceDoctorWisePatientCountReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
 
  public getDepartmentCombo() {
 
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})

  }


  public getConcessionreportView(FromDate,ToDate,OP_IP_Type,DoctorID,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-ConcessionReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&OP_IP_Type="+OP_IP_Type+"&DoctorID="+DoctorID);
  }
  

  public getOpPatientledgerView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-OPPatientLedger?FromDate=" + FromDate+"&ToDate="+ToDate);
  }

  public getIpPatientledgerView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-IPPatientLedger?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getCommonDailycollectionView(FromDate,ToDate,AddedById,DoctorId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-CommanDailyCollectionReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById+"&DoctorId="+DoctorId);
  }
  public getDailycollectionView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getDailycollsummaryView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-DailyCollectionSummaryReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  public getgroupwisecollView(FromDate,ToDate,GroupId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-GroupwisecollectionReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&GroupId="+GroupId);
  }
  
  public getgroupwisescollummaryView(FromDate,ToDate,GroupId,loader = true){
    if (loader) {
      this._loaderService.show();
  }debugger
    return this._httpClient.get("CommanReport/view-GroupwiseSummaryReport?FromDate="+FromDate+"&ToDate="+ToDate+"&GroupId="+GroupId);
  }
  
  public getgroupwiserevenusummaryView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-GroupwiseRevenueSummary?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  public getservicewisereportwithoutbillView(ServiceId,FromDate,ToDate,DoctorId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-ServiceWiseReportWithoutBill?ServiceId="+ServiceId+"&FromDate=" + FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId);
  }
  
  
  public getCreditreportView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-CreditReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
  
  public getPatientledgerView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  
 
  
  public getServicewisereportwithbillView(ServiceId,FromDate,ToDate,DoctorId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-ServicewiseReportwithbill?ServiceId="+ServiceId+"&FromDate=" + FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId);
  }

  public getServicewisereportView(ServiceId,FromDate,ToDate,DoctorId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-ServiceWiseReport?ServiceId="+ServiceId+"&FromDate=" + FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId);
  }


  
  public getBillsummarywithtcsView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-BillSummaryWithTCS?FromDate=" + FromDate+"&ToDate="+ToDate);
  }

  public getRefbypatientView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-RefByPatientList?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getdoctorvisitadmingroupwiseView(FromDate,ToDate,DoctorId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-DoctorVisitAdmittedWiseGroupReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId);
  }


  public getBillsummaryopdipdView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("IPReport/view-OPIPBILLSummaryReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getCanclechargesView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-Canclechargeslist?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getDocDeptwisemonthcollectionView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-DepartmentServiceGroupWiseCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  getDoctorDeptwisemonthlycollectionView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-DoctorAndDepartmentWiseMonthlyCollectionReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
 


  public getIpcompanywisebillView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-IPCompanyWiseBillReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getCompanywisecreditbillView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-IPCompanyWiseCreditReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getIdischargebillgenependingView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-IPDischargeBillGenerationPendingReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getIpbillgenepaymentdueView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-IPBillGenerationPaymentDueReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getBillgenefor2lakhamtView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-BillSummaryReportfor2LakhAmount?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getCollectionsummaryView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-CollectionSummaryReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getBillgeneforopdipdView(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("IPReport/view-OPIPBILLSummaryReport?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getOpDailyCollection(FromDate,ToDate,AddedById,doctorId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-OPDailyCollectionReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById+"&DoctorId="+doctorId);
  }

  public getcashcounterwisedailycollectionView(FromDate,ToDate,OP_IP_Type,CashCounterId,UserId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-CashCounterWiseDailyCollection?FromDate=" + FromDate+"&ToDate="+ToDate+"&OP_IP_Type="+OP_IP_Type+"&CashCounterId="+CashCounterId+"&UserId="+UserId);
  }
  
  public getcashcounterwisedailycollectionsummaryView(FromDate,ToDate,OP_IP_Type,CashCounterId,UserId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("CommanReport/view-ViewCashCounterWiseDailyCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate+"&OP_IP_Type="+OP_IP_Type+"&CashCounterId="+CashCounterId+"&UserId="+UserId);
  }
  // OPBilling
  public getOpDailyCollectionuserwise(FromDate,ToDate,AddedById,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-OPDailyCollectionReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById);
  }

  public getOpDailyCollectionsummary(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-OPCollectionSummary?FromDate=" + FromDate+"&ToDate="+ToDate);
  }
  public getOpBilldetail(FromDate,ToDate,AddedById,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-BillReportSummary?FromDate="+FromDate+"&ToDate="+ToDate+"&AddedById="+AddedById);
  }
  public getOPBillSummary(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-BillReportSummarySummary?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  public getOPcreditlist(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-OpPatientCreditList?FromDate="+FromDate+"&ToDate="+ToDate);
  }

  public getOPcreditbalancelist(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-OPDBillBalanceReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }

  public getOpRefundofbillview(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OPReport/view-OPDRefundOfBill?FromDate="+FromDate+"&ToDate="+ToDate);
  }


  
  public getDoctorMaster(loader = true) {
   
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }



  // OPMIS




  //Inventory

  public getItemlist(Param){//m_Rtrv_IPDrugName,Retrieve_ItemName_BalanceQty
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_Item_Name",Param)
  }

  public getCurrentstockReport(ItemName,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryTransaction/view-InvCurrentStock?ItemName="+ItemName+"&ItemName="+StoreId);
  }
  public getCurrentstockdatewiseReport(InsertDate,StoreId,FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryTransaction/view-CurrentStockDateWise?InsertDate="+InsertDate+"&StoreId="+StoreId+"&FromDate="+FromDate+"&ToDate="+ToDate);
  }
  public getItemExpiryReport(ExpMonth,ExpYear,StoreID,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryTransaction/view-ExpiryItemList?ExpMonth="+ExpMonth+"&ExpYear="+ExpYear+"&StoreID="+StoreID);
  }
  // Inventory
  public getItemlistReport(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-ItemList?FromDate="+FromDate+"&ToDate="+ToDate);
  }

  
  public getSupplierlistReport(SupplierName,StoreID,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-SupplierList?SupplierName="+SupplierName+"&StoreID="+StoreID);
  }
  public getIndentlistReport(FromDate,ToDate,FromStoreId,ToStoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-IndentReport?FromDate="+FromDate+"&ToDate="+ToDate+"&FromStoreId="+FromStoreId+"&ToStoreId="+ToStoreId);
  }
  
 public getMonthlypurchaseGRNReport(FromDate,ToDate,loader = true){
  if (loader) {
    this._loaderService.show();
}
    return this._httpClient.get("InventoryReports/view-MonthlyPurchaseGRNReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }

  public getGRNReportlist(FromDate,ToDate,StoreId,SupplierID,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-GRNReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId+"&SupplierID="+SupplierID);
  }


  

  
  public getGRNReportsummarylist(FromDate,ToDate,StoreId,SupplierID,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-GRNReportSummary?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId+"&SupplierID="+SupplierID);
  }

  
  public getGRNReportNABH(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-GRNReportNΑΒΗ?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  public getNonmovinglistReport(FromDate,ToDate,NonMovingDay,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-NonMovingItemList?FromDate="+FromDate+"&ToDate="+ToDate+"&NonMovingDay="+NonMovingDay+"&StoreId="+StoreId);
  }
  public getNonmovingitemwithoutbatchlistReport(FromDate,ToDate,NonMovingDay,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-NonMovingItemWithoutBatchList?FromDate="+FromDate+"&ToDate="+ToDate+"&NonMovingDay="+NonMovingDay+"&StoreId="+StoreId);
  }
  
  
  public getItemcountlistview(FromDate,ToDate,ItemId,ToStoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-ItemCount?FromDate="+FromDate+"&ToDate="+ToDate+"&ItemId="+ItemId+"&ToStoreId="+ToStoreId);
  }
  public getLastpurchasewiseconsumptionview(FromDate,ToDate,ItemId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-LastPurchaseRateWiseConsumtion?FromDate="+FromDate+"&ToDate="+ToDate+"&ItemId="+ItemId);
  }
  public getGRNReturnReport(FromDate,ToDate,StoreId,SupplierID,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-GRNReturnReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId+"&SupplierID="+SupplierID);
  }
  
  public getGRNwiseprodqtyReport(FromDate,ToDate,StoreId,SupplierID,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-GRNWiseProductQtyReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId+"&SupplierID="+SupplierID);
  }
  

  public getGRNpurchaseReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-GRNPurchaseReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }

  
  public getSupplierwiseGRNReport(StoreId,SupplierID,FromDate,ToDate,loader = true){
    debugger
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-SupplierWiseGRNList?StoreId="+StoreId +"&SupplierID="+SupplierID + "&FromDate="+FromDate +"&ToDate="+ToDate);
  }

  public getIssuetodeptlistReport(FromDate,ToDate,FromStoreId,ToStoreId,ItemId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-IssueToDepartment?FromDate="+FromDate+"&ToDate="+ToDate + "&FromStoreId="+FromStoreId +"&ToStoreId="+ToStoreId+"&ItemId="+ItemId);
  }
  
  public getIssuetodeptitemwiseReport(FromDate,ToDate,FromStoreId,ToStoreId,ItemId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-IssueToDepartmentItemWise?FromDate="+FromDate+"&ToDate="+ToDate + "&FromStoreId="+FromStoreId +"&ToStoreId="+ToStoreId+"&ItemId="+ItemId);
  }
  

 public getReturnfromdeptlistReport(FromDate,ToDate,FromStoreId,ToStoreId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InventoryReports/view-ReturnFromDepartment?FromDate="+FromDate+"&ToDate="+ToDate + "&FromStoreId="+FromStoreId +"&ToStoreId="+ToStoreId);
 }


public getPurchaseorderview(FromDate,ToDate,SupplierID,ToStoreId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InventoryReports/view-PurchaseOrder?FromDate="+FromDate+"&ToDate="+ToDate + "&SupplierID="+SupplierID +"&ToStoreId="+ToStoreId);
}
  public getIndentwiseReport(IndentId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryTransaction/view-IndentWise?IndentId="+IndentId);
  }
  public getMaterialConsumptionlistReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-MaterialConsumption?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  public getMaterialConsumptionReport(MaterialConsumptionId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InPatient/view-MaterialConsumption?MaterialConsumptionId="+MaterialConsumptionId);
  }
  public getItemExpirylistReport(ExpMonth,ExpYear,StoreID,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-ItemExpiryReport?ExpMonth="+ExpMonth +"&ExpYear="+ExpYear + "&StoreID="+StoreID);
  }
  
  public getIssuetodeptReport(IssueId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryTransaction/view-IssuetoDeptIssuewise?IssueId="+IssueId);
  }
  public getMaterialconsumptionmonthsummaryReport(FromDate,ToDate,ToStoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-MaterialConsumptionMonthlySummary?FromDate="+FromDate+"&ToDate="+ToDate + "&ToStoreId="+ToStoreId );
  }
  
  public getCurrentstocklistReport(StoreId,IsNarcotic,ish1Drug,isScheduleH,IsHighRisk,IsScheduleX,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-CurrentStockReport?StoreId="+StoreId+"&IsNarcotic="+IsNarcotic+"&ish1Drug="+ish1Drug+"&isScheduleH="+isScheduleH+"&IsHighRisk="+IsHighRisk+"&IsScheduleX="+IsScheduleX);
  }
  

  public getReturnfromdeptReport(IssueId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-ReturnFromDepartment?IssueId="+IssueId);
  }
  public getGRNreportview(GRNID,loader = true) {
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("Pharmacy/view-GRNReport?GRNID=" + GRNID);
  }

  public getItemwisepurchaseview(FromDate,ToDate,SupplierID,ToStoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-PurchaseOrder?FromDate="+FromDate+"&ToDate="+ToDate+"&SupplierID="+SupplierID+"&ToStoreId="+ToStoreId);
  }
  
  public getItemwisesupplierlistview(StoreId,SupplierID,ItemId,FromDate,Todate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-ItemWiseSupplierList?StoreId="+StoreId+"&SupplierID="+SupplierID+"&ItemId="+ItemId+"&FromDate="+FromDate+"&Todate="+Todate);
  }
  public getStockadjustmentview(FromDate,ToDate,ToStoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-StockAdjustmentReport?FromDate="+FromDate+"&ToDate="+ToDate+"&ToStoreId="+ToStoreId);
  }

  
  public getIssuetodeptmonthlysummaryview(FromDate,ToDate,FromStoreId,ToStoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-IssueToDepartmentMonthlySummary?FromDate="+FromDate+"&ToDate="+ToDate+"&FromStoreId="+FromStoreId+"&ToStoreId="+ToStoreId);
  }


  public getBillingServiceList(loader = true) {
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ServiceMasterForCombo", {})
  }

  
  
  public getSupplierwisedebitcardnoteview(FromDate,ToDate,SupplierId,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-SupplierWiseDebitCreditNote?FromDate="+FromDate+"&ToDate="+ToDate+"&SupplierId="+SupplierId+"&StoreId="+StoreId);
  }

  public getCashcounterList() {
    return this._httpClient.post("Generic/GetByProc?procName=m_RtrvCashCounterForCombo", {})
  }
  
  public getpurchasewisesummaryview(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("InventoryReports/view-PurchaseWiseGRNSummary?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  getStoreList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{})
  }

  public getSupplierList(param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list", param);
  }

  public getgroupList(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveGroupMasterForCombo",{})
  }


  public getBrowseOPBillsummaryList(data,loader = true){
    if (loader) {
      this._loaderService.show();
  }
  
    return this._httpClient.post("Generic/GetByProc?procName=rptBillDetails",data)
  
  }


  public getBrowseOPcreditBillsummaryList(data,loader = true){
    if (loader) {
      this._loaderService.show();
  }
  
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDCreditBills",data)
  
  } 
  public getDoctorwisePatientCount(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=RptDoctorWisePatientCount",data) 
  }
  public getRefDoctorwisePatientCount(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=RptReferenceDoctorWisePatientCount",data) 
  }
  public getConssesionReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptIP_OP_ConcessionReport",data) 
  }
  public getDailyCollectionReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptIP_OP_Comman_DailyCollectionReport",data) 
  }
  public getDailyCollectionSummaryReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptCollectionSummary",data) 
  }
  public getGroupIwiseCollectionSummaryReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptGrupWisePeport",data) 
  }
  public getGroupIwiseSummaryReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptGrupWiseSummaryPeport",data) 
  }
  public getGroupWiseRevenuSummaryReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptGrpSumary",data) 
  }
  public getCreditReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptOP_IP_CreditBills",data) 
  }
  public getPatientLedgerOPReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptOPPatientLedger",data) 
  }
  public getPatientLedgerIPReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptIPPatientLedger",data) 
  }
  public getServiceWiseWithoutBillReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptServiceWiseReport_Detail",data) 
  }
  public getServiceWiseWithBillReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptIPServiceWiseBillList",data) 
  }
  public getServiceWiseReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptServiceWisePatAmt",data) 
  }
  public getBillSummaryWithTCSReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptBillwithTCS",data) 
  }
  public getRefByPatientReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptRefByAdmittedPatientList",data) 
  }
  public getCancelChargesReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptCancelChargesList",data) 
  }
  public getDocDepWiseMonthlyReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptDoctorAndDepartmentWiseCollection",data) 
  }
  public getDoctorWiisegroupReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptDoctorWiseGroupWise",data) 
  }
  public getIPCompanyWiseBillReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_IPCompanyWiseBillInfo",data) 
  }
  public getIPCompanyWiseCreditlReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_IPCompanyWiseCreditReport",data) 
  }
  public getIPDischargebillgenerationReport(loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=IPPatientDischargeBillGenerationPending",{}) 
  }
  public getIPBillGenerationPayDueReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptBillGeneratePatientPaymentDue",data) 
  }
  public getCollectionSummaryReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDCollectionReport",data) 
  }
  public getBillSummarytwoLakhReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptIPbillsumry2lakh",data) 
  }
  public getBillSummaryOPD_IPDReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptOP_IP_BillSummaryReport",data) 
  }
  public getCashCounterWiseDailyCollReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptCashCounterWiseDailyCollection",data) 
  }
  public getRegisterationList(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptListofRegistration",data) 
  }
  public geAppointmentList(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptOPAppointmentListReport",data) 
  }
  public getDoctorWiseVisitList(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptDoctorWiseVisitDetails",data) 
  }
  public getRefDocWiseList(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptReferenceDoctor",data) 
  }
  public getDepartmentWiseList(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_OPDepartSumry",data) 
  }
  public getDocWiseCountList(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_OPDocSumry",data) 
  }
  public getAppoinListWithServList(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptAppointListWithService",data) 
  }
  public getCrossConsultList(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptOPCrossConsultationReport",data) 
  }
  public getDocWiseNewOldPatientList(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDocWiseNewOldPatient_web",data) 
  }
  public getOPBIllReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptBillDateWise",data) 
  }
  public getOPBIllSummaryReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptBillDetails",data) 
  }
  public getOPRefBillReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDRefundOfBill",data) 
  }
  public getOPDailyCollectionSummaryReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDCollectionReport",data) 
  }
  public getOPBIllBalReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDCreditBills",data) 
  }
  public getOPDailyCollectionReport(data,loader = true){
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDailyCollectionReport",data) 
  }
  }