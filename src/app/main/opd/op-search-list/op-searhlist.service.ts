import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OPSearhlistService {
  fieldValidations() {
    throw new Error('Method not implemented.');
  }

  success(arg0: string) {
    throw new Error('Method not implemented.');
  }

  myFilterform: FormGroup;
  casepaperform: FormGroup;
  prescrtionform: FormGroup;
  myRefundBillForm: FormGroup;
  myShowAdvanceForm: FormGroup;
   paymentForm: FormGroup;


  constructor(public _httpClient: HttpClient,
    private _formBuilder: FormBuilder,
    private _loaderService: LoaderService,
  ) {
    this.myFilterform = this.filterForm();
    this.myShowAdvanceForm = this.showAdvanceForm();
    this.paymentForm =this.showPaymentForm();
    this.casepaperform=this.createCasepaperForm();
    
  }

  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      FirstName:['', [
         Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      MiddleName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
     ]],
      LastName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
     ]],
     
      DoctorId: '',
      DoctorName: '',
      IsMark:'',

      AdmDisFlag: 0,
      OP_IP_Type: 0,
      PatientType:0,
      patientstatus:0,
      OPDNo:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }

  createCasepaperForm(): FormGroup{
    return this._formBuilder.group({


  BP:'',
  ConsultantDocName: '',
  BSL: '',
  CasePaperID: '0',
  Complaint: '',
  Diagnosis: '',
  DocName: '',
  Finding: '',
  Height: '',
  Investigations: '',
  PastHistory: '',
  PatientName: '',
  PersonalDetails: '',
  Pluse: '',
  PresentHistory: '',
  RegID: '0',
  SecondDocRef: '0',
  SpO2: '',
  Temp:'',
  VisitDate: '',
  VisitId: '0',
  VisitTime: '',
  Weight: '',
  DrugName:'',
  TotalQty:'',
  HospitalName:'',
  HospitalAddress:'',
  Phone:'',
  IPPreId:'',
  DoseName:'',
  GenderName:'',
  PrecriptionId:'',
  Days:'0',
  Instruction:'',
  TotalDayes:'0',
  AgeYear:'0',
  OPDNo:'',
  _matDialog: '',
    RegNo: '0',
    });
  }

  showAdvanceForm(): FormGroup {
    return this._formBuilder.group({
      AdmissionID: '',
      AdvanceId: '',
      RegNo: '',
      IPDNo: '',
      FirstName: '',
      PatientName: '',
      // DOT: '', 
      DOA: '',
      AdmDateTime: '',
      BedId: '',
      BedName: '',
      AdmittedDoctor1: '',
      DOT: '',
      BedNo: '',
      DoctorId: '0',
      DoctorName: '',
      WardId: '0',
      RoomName: '',
      TariffId: '',
      TariffName: '',
      Date: [(new Date()).toISOString()],
      ClassId: '',
      ClassName: '',
      currentDate: '',

      cashAmt: '',
      AdvanceAmount: ['', Validators.pattern("^[0-9]*$")],
      AdvanceUsedAmount: ['', Validators.pattern("^[0-9]*$")],
      BalanceAmount: ['', Validators.pattern("^[0-9]*$")],
      Amount: ['', Validators.required],
      Remark: '',
      PaymentId: '0',
      BillNo: '0',
      ReceiptNo: '',
      PaymentDate: '',
      PaymentTime: '',
      CashPayAmount: '0',
      ChequePayAmount: '0',
      ChequeNo: '',
      BankName: '',
      ChequeDate: '',
      CardPayAmount: '0',
      CardNo: '',
      CardBankName: '',
      CardDate: '',
      //AdvanceUsedAmount :	'0',
      // AdvanceId :	'0',
      RefundId: '0',
      TransactionType: '0',
      //Remark : '',
      AddBy: '0',
      IsCancelled: ['false'],
      IsCancelledBy: '0',
      IsCancelledDate: '',
      CashCounterId: '0',
      IsSelfORCompany: '0',
      CompanyId: '0',
      NEFTPayAmount: '0',
      NEFTNo: '',
      NEFTBankMaster: '',
      NEFTDate: '',
      PayTMAmount: '0',
      PayTMTranNo: '',
      PayTMDate: '',
  });
  }
  
  showPaymentForm(): FormGroup{
    return this._formBuilder.group({
      PaymentId : '0',
      BillNo : '0',
      ReceiptNo : '',
      PaymentDate	: '',
      PaymentTime : '',
      CashPayAmount :	'0',
      ChequePayAmount : '0',
      ChequeNo : '',
      BankName : '',
      ChequeDate : '',
      CardPayAmount :	'0',
      CardNo : '',
      CardBankName : '',
      CardDate : '',
      AdvanceUsedAmount :	'0',
      AdvanceId :	'0',
      RefundId :	'0',
      TransactionType :	'0',
      Remark : '',
      AddBy:	'0',
      IsCancelled	: ['false'],
      IsCancelledBy : '0',
      IsCancelledDate	: '',
      CashCounterId :	'0',
      IsSelfORCompany	: '0',
      CompanyId : '0',
      NEFTPayAmount :	'0',
      NEFTNo : '',
      NEFTBankMaster : '',
      NEFTDate	:'',
      PayTMAmount	: '0',
      PayTMTranNo : '',
      PayTMDate : '',
    })
  }

  public getAppointmentList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveVisitDetailsList_1", employee)
  }
  //op bill Package details
  public getpackagedetList(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_Retrieve_PackageDetails", employee)
  }

  // Doctor Master Combobox List
  public getDoctorMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }

  // Department Master Combobox List
  public getDepartmentMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Cmb_DepartmentMasterForCombo", {})
  }

  public getchargesList(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + data, {})
  }

  // Get billing Service List 
  public getBillingServiceList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ServicesList", employee)
  }

   // Get CashCounter List 
  public getCashcounterList() {
    return this._httpClient.post("Generic/GetByProc?procName=m_RtrvCashCounterForCombo", {})
  }

  public getIpPatientBillInfo(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=ps_rtv_IPPatientBillInformation", employee)
  }

  public getPreviousBillInfo(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=ps_rtrv_IPPreviousBill_info", employee)
  }
  public CasepaperPrescriptionInsert(employee) {
    return this._httpClient.post("OutPatient/CasePaperPrescriptionSave", employee);
  }

  public InsertIPAddCharges(employee) {
    return this._httpClient.post("InPatient/IPAddChargesInsert", employee);
  }

  public InsertOPAddCharges(employee) {
    return this._httpClient.post("OutPatient/OPDAddCharges", employee);
  }
  public EmailInsert(employee) {
    return this._httpClient.post("OutPatient/EmailNotificationInsert", employee);
  }

  public getClassList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=ps_rtrv_BillingClassName_1", employee)
  }

  
  public getClassCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ClassName", {})
  }
public getConcessionCombo()
{
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ConcessionReasonMasterForCombo", {});
}
  public deleteCharges(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Delete_Addcharges", employee)
  }

  // Admitted Doctor Master Combobox List
  public getAdmittedDoctorCombo(param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorListMasterForCombo",param)
  } 
  public getserviceCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Retrieve_ServiceMasterForCombo", {})
  }

  public InsertOPBilling(employee) : Observable<any> {
    return this._httpClient.post("OutPatient/OPBillWithPaymentCashCounter", employee)
  }

  public InsertOPBillingCredit(employee) : Observable<any> {
    return this._httpClient.post("OutPatient/OPBillingWithCreditCashCounter", employee)
  }
  
  public InsertOPRefundBilling(employee) {
    return this._httpClient.post("OutPatient/OPRefundBill", employee)
  }

  public getRefundBrowsePrint(RefundId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptOPRefundofBillPrint", RefundId)
  } 

  public getVisitedList(employee) {
  //  return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_OpVisitDetailsList",employee)
  return this._httpClient.post("Generic/GetByProc?procName=rtrv_CaseparVisitDetails",employee)
  }

  // OP REFUND SECTIOn 
  public getOPBillListForRefund(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + data, {})
  }

// AllBills
  public getOpRefundOfBilldetList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_OPBill_For_Refund", {employee})
  }
// All Refund 
  public getRefundofBillList()
  {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_IPRefundofBill",{})
  }

  public getPrescriptionVisitWiseDetails(VisitId){
    return this._httpClient.post("Generic/GetByProc?procName=Get_PrescriptionDetailsVisitWise",VisitId);
  }

  public getRefundofBill(emp)
  {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_OPBill_For_Refund",emp)
  }
  
  public getDrugCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_M_DrugMaster_Cmb", {})
  }

  populateForm(employee) {
    this.myShowAdvanceForm.patchValue(employee);
    // this.mySaveForm.patchValue(employee);
  }

  public OPInsertAdvanceHeader(employee)
  {
    return this._httpClient.post("OutPatient/OPAdvance",employee)
  }
  public getAdvanceList(employee)
  {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_T_AdvanceList",employee)
  }
  public getBankMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveBankMasterForCombo", {})
  }

  public getHistoryList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_PastHistoryMasterForCombo",{})
  }

  public getDiagnosisList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_ComplaintMasterForCombo",{})
  }

  public getDoseList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_DoseMasterList",{})
  }
  
  public getDrugList(drugValue) {
    return this._httpClient.post("Generic/GetByProc?procName=ps_RtvrDrugName",{"ItemName": drugValue})
  }
  
  public getBillPrint(BillNo) {
    return this._httpClient.post("Generic/GetByProc?procName=rptBillPrint", BillNo)
  } 

  public getPaymentPrint (paymentid){
    return this._httpClient.post("Generic/GetByProc?procName=rptIPDPaymentReceiptPrint", paymentid)
  }
 public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  } 
  public getPaidBillList(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }

  public getCreditBillList(data) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OP_Bill_List_Settlement", data)
  }
  public InsertOPBillingsettlement(emp, loader = true) {
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("OutPatient/OpSettlement", emp);
   }
  public getPaymentBillPrint(BillNo){
    return this._httpClient.post("Generic/GetByProc?procName=rptBillPrint", BillNo)
  }

  // All reports
  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=rptListofRegistration", employee)
  }

  public getRegisteredList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientRegistrationList", employee)
  }

  public getPatientVisitedListSearch(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }

  public getrptAppointmentList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=rptOPAppointmentListReport", employee)
  }

  public getrptOPDeptList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_OPDepartSumry", employee)
  }


  public getOPPatientList(employee) {

    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegistrationList", employee)
  }


  // Casepaper
  //new
  public getcasepaperVisitDetails(visitId) {
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_CaseparVisitDetails",{"VisitId": visitId});
  }
  public getOPDPrecriptionPrint(PrecriptionId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDPrecriptionPrint ", PrecriptionId)
  }
public prescriptionDetails(visistId) {
    return this._httpClient.post("Generic/GetByProc?procName=Get_PrescriptionDetailsVisitWise",{"VisitId": visistId});
  }

  public getComplaintList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_ComplaintMasterForCombo",{});
  }

  public getExaminationList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_ExaminationMasterForCombo",{});
  }

  public onSaveCasepaper(param) {
    return this._httpClient.post("OutPatient/CasePaperPrescriptionSave", param);
  }

  // public getRefundofBillServiceList(employee)
  // {
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IPBill_For_Refund",employee)
  // }

  public getRefundofBillServiceList(employee)
  {
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_OPBill_For_Refund",employee)
  }
  public getRefundofBillDetailList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_OPDRefundAgainstBillList", employee)
  }
  public getRefundofBillOPDList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_OPBillListforRefund",employee)
    }
    
    public InsertOPSettlementPayment (employee){
      // return this._httpClient.post("InPatient/IPBillingCreditInsert", employee)
       return this._httpClient.post("InPatient/IPSettlement", employee)
    }

    public getOPsettlementPrint(employee){
      return this._httpClient.post("Generic/GetByProc?procName=rptOPDPaymentReceiptPrint ", employee)
    }
    
  public getTemplates(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }

  

  public getOpBillReceipt(BillNo){
    return this._httpClient.get("OutPatient/view-Op-BillReceipt?BillNo=" + BillNo);
  }



  getOprefundofbillview(RefundId){
    return this._httpClient.get("OutPatient/view-OPRefundofBill?RefundId="+RefundId)
  }



  public getOpPaymentview(PaymentId){
    return this._httpClient.get("OutPatient/view-OP-PaymentReceipt?PaymentId=" + PaymentId);
  }

  getPaymentArr() {
    return [
      {value: 'cash', viewValue: 'Cash'},
      {value: 'cheque', viewValue: 'Cheque'},
      {value: 'upi', viewValue: 'UPI'},
      {value: 'net banking', viewValue: 'Net Banking'},
      {value: 'card', viewValue: 'Card'} 
    ];
  }
}