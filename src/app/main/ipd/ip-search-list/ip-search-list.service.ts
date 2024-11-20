import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class IPSearchListService {

  myFilterform: FormGroup;
  myShowAdvanceForm: FormGroup;
  mySaveForm: FormGroup;
  bsaveForm:FormGroup;
  psaveForm:FormGroup;
  advForm:FormGroup;
  paymentForm: FormGroup;
  myShowDischargeSummaryForm: FormGroup;
  myRefundBillForm:FormGroup;
  myRefundAdvanceForm:FormGroup;
  RefundOfBillFormGroup: FormGroup;
  // IsDischarge:FormGroup;
  // getIPLitPharmsalesDateWise: any;
  

constructor(public _httpClient:HttpClient,
    private _formBuilder: FormBuilder,
    private _loaderService: LoaderService,
    ) {
      this.myFilterform=this.filterForm();
      this.myShowAdvanceForm = this.showAdvanceForm();
      this.paymentForm =this.showPaymentForm();
      this.mySaveForm=this.saveForm();
      this.bsaveForm=this.bedsaveForm();
      this.psaveForm=this.presaveForm();
      this.myRefundBillForm=this.refundBillForm();
      this.myRefundAdvanceForm=this.refundAdvanceForm();
      this.RefundOfBillFormGroup=this.OPrefundForm();
      this.myShowDischargeSummaryForm = this.showDischargeSummaryForm();
     }

  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      IPDNo: '',
      FirstName:['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
      MiddleName:['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
      LastName:['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
      MobileNo: ['', [Validators.pattern("^[0-9]*$"),Validators.minLength(10),Validators.maxLength(10),]],   
      DoctorId: '0',
      DoctorName: '',
      IsDischarge:[0],
      WardId: '0',
      RoomName: '',
      start: [],
      end: [],
      DischargeId:[''],
      
    });
  }

  showAdvanceForm(): FormGroup {
    return this._formBuilder.group({
      AdmissionID:'',
      AdvanceId:'',
      RegNo: '',
      IPDNo: '',
      FirstName:['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      PatientName: '',
      // DOT: '', 
      DOA:'',
      AdmDateTime:'',
      BedId:'',
      BedName :'',
      AdmittedDoctor1:'',
      DOT:'',
      BedNo:'',
      DoctorId: '0',
      DoctorName: '',
      WardId: '0',
      RoomName: '',
      TariffId:'',
      TariffName:'',
      Date:[(new Date()).toISOString()],
      ClassId:'',
      ClassName:'',
      currentDate:'',
      DischargeId:'',
      cashAmt:'',
      AdvanceAmount:['',Validators.pattern("^[0-9]*$")],
      AdvanceUsedAmount:['',Validators.pattern("^[0-9]*$")],
      BalanceAmount:['',Validators.pattern("^[0-9]*$")],
      Amount:['',Validators.required],
      Remark: ''   ,
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
      //AdvanceUsedAmount :	'0',
     // AdvanceId :	'0',
      RefundId :	'0',
      TransactionType :	'0',
      //Remark : '',
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

  showDischargeSummaryForm(): FormGroup {
    return this._formBuilder.group({
      AdmissionId:'',
      RegNo: '',
      IPDNo: '',
      FirstName: '',
      PatientName: '',
      MobileNo: '', 
      DOA:'',
      DOT:'',
      BedNo:'',
      DoctorId: '0',
      DoctorID:'',
      DoctorName: '',
      WardId: '0',
      RoomName: '',
      // DischargesummaryId :'',
      DischargeSummaryId:'', 
      DischargeId :'',
	    History :'',
      Diagnosis :'',
      Investigation :'',
      ClinicalFinding:'',
      OpertiveNotes:'',
      TreatmentGiven:'',
      TreatmentAdvisedAfterDischarge:'',
	    Followupdate:'',
	    Remark:'',
	    DischargeSummaryDate:'',
	    OPDate :'',
	    OPTime :'',
	    DischargeDoctor1 :'',
	    DischargeDoctor2 :'',
	    DischargeDoctor3 :'',
	    DischargeSummaryTime :'',
	    DoctorAssistantName :'',
	    ClaimNumber :'',
	    PreOthNumber:'',
      AddedBy :'',
	    AddedByDate :'',
	    SurgeryProcDone :'',
	    ICD10CODE :'',
	    ClinicalConditionOnAdmisssion:'',
	    OtherConDrOpinions:'',
	    ConditionAtTheTimeOfDischarge :'',
	    PainManagementTechnique	:'',
	    LifeStyle :'',
	    WarningSymptoms	:'',
	    Radiology :'',
	    IsNormalOrDeath :'',
      DoctorName1: '',
    
      DoctorIdOne: '',
      DoctorIdTwo: '',
      template:''
    });
  }

 refundBillForm(): FormGroup {
    return this._formBuilder.group({
      AdmissionId:'',
      RegNo: '',
      PatientName: '',
      DOA:'',
      DOT:'',
      BedNo:'',
      DoctorId: '0',
      DoctorName: '',
      WardId: '0',
      RoomName: '',
      DischargeSummaryId:'', 
      DischargeId :'',
	    History :'',
      Diagnosis :'',
      Investigation :'',
      ClinicalFinding:'',
      OpertiveNotes:'',
      TreatmentGiven:'',
      TreatmentAdvisedAfterDischarge:'',
	    Followupdate:'',
	    Remark:'',
	    DischargeSummaryDate:'',
	    OPDate :'',
	    OPTime :'',
	    DischargeDoctor1 :'',
	    DischargeDoctor2 :'',
	    DischargeDoctor3 :'',
	    DischargeSummaryTime :'',
	    DoctorAssistantName :'',
	    ClaimNumber :'',
	    PreOthNumber:'',
      AddedBy :'',
	    AddedByDate :'',
	    SurgeryProcDone :'',
	    ICD10CODE :'',
	    ClinicalConditionOnAdmisssion:'',
	    OtherConDrOpinions:'',
	    ConditionAtTheTimeOfDischarge :'',
	    PainManagementTechnique	:'',
	    LifeStyle :'',
	    WarningSymptoms	:'',
	    Radiology :'',
	    IsNormalOrDeath :'',
      DoctorName1: '',
      DoctorIdOne: '',
      DoctorIdTwo: ''
    });
  }

  saveForm(): FormGroup{
    return this._formBuilder.group({
     RegNo: '',
     DoctorID:'',
     DocNameID:[''],
     Doctorname:'',
     DischargeTypeId:['',Validators.required],
     DischargeDate:[''],
     DischargeTime:'',
     Modeofdischarge:'',
    // DOT: '' ,
     ModeId:'',
     Comments:['']
    });
  }
  refundAdvanceForm(): FormGroup {
    return this._formBuilder.group({
      AdmissionId:'',
      RegNo: '',
      PatientName: '',
      DOA:'',
      DOT:'',
      BedNo:'',
      DoctorId: '0',
      DoctorName: '',
      WardId: '0',
      RoomName: '',
      DischargeSummaryId:'', 
      DischargeId :'',
	    History :'',
      Diagnosis :'',
      Investigation :'',
      ClinicalFinding:'',
      OpertiveNotes:'',
      TreatmentGiven:'',
      TreatmentAdvisedAfterDischarge:'',
	    Followupdate:'',
	    Remark:'',
	    DischargeSummaryDate:'',
	    OPDate :'',
	    OPTime :'',
	    DischargeDoctor1 :'',
	    DischargeDoctor2 :'',
	    DischargeDoctor3 :'',
	    DischargeSummaryTime :'',
	    DoctorAssistantName :'',
	    ClaimNumber :'',
	    PreOthNumber:'',
      AddedBy :'',
	    AddedByDate :'',
	    SurgeryProcDone :'',
	    ICD10CODE :'',
	    ClinicalConditionOnAdmisssion:'',
	    OtherConDrOpinions:'',
	    ConditionAtTheTimeOfDischarge :'',
	    PainManagementTechnique	:'',
	    LifeStyle :'',
	    WarningSymptoms	:'',
	    Radiology :'',
	    IsNormalOrDeath :'',
      DoctorName1: '',
      DoctorIdOne: '',
      DoctorIdTwo: ''
    });
  }

 

  bedsaveForm(): FormGroup{
    return this._formBuilder.group({
     RegNo: '',
     RoomId: ['',Validators.required],
     RoomName: '',
     BedId:['',Validators.required],
     BedName :'',
     ClassId : ['',Validators.required],
     ClassName:'',
     Remark :'',
    });
  }

  presaveForm(): FormGroup{
    return this._formBuilder.group({
     RegNo: '',
     WardId: ['',Validators.required],
     RoomName: '',
     StoreId:['',Validators.required],
     StoreName :'',
     DrugId : ['',Validators.required],
     DoseId: [''],
     QtyPerDay:[''],
     UnitofMeasurementId:['',Validators.required],
     UnitofMeasurementName :'',
     WardID:'',
     pDate:'',
     PTime:'',
     ClassID:['',Validators.required],
     Remark :'',
     TotalQty:['',Validators.required],
     RoundVisitDate:[(new Date()).toISOString()],
     RoundVisitTime:'',
     DocNameID:'',
    });
  }

  OPrefundForm(): FormGroup {
    return this._formBuilder.group({
      advanceAmt: [Validators.pattern("^[0-9]*$")],
      BillNo: [''],
      NetBillAmount: [Validators.pattern("^[0-9]*$")],
      TotalRefundAmount: [Validators.pattern("^[0-9]*$")],
      RefundBalAmount: [Validators.pattern("^[0-9]*$")],
      BillDate: [''],
      RefundAmount: [Validators.pattern("^[0-9]*$")],
      Remark: [''],
      // AdmissionId: '',
      RegNo: [''],
      PatientName: [''],
      DoctorId: [''],
      serviceName: [''],
      serviceId: [''],
      Price: [Validators.pattern("^[0-9]*$")],
      Qty: [Validators.pattern("^[0-9]*$")],
      totalAmount: [Validators.pattern("^[0-9]*$")],
      BillingClassId: [''],
      price: [Validators.pattern("^[0-9]*$")],
      qty: [Validators.pattern("^[0-9]*$")],
      DoctorName: [''],
    });
  }


  public advanceHeaderInsert(employee)
  {    
    return this._httpClient.post("InPatient/IPAdvance",employee);
  }

  public DischargeInsert(employee,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
  return this._httpClient.post("InPatient/InsertIPDischarge",employee);
  }

  public DischargeUpdate(employee,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("InPatient/UpdateIPDischarge",employee);
  }

  public PrescriptionInsert(employee)
  {    
  return this._httpClient.post("InPatient/InsertIPPrescription",employee);
  }
  
  public BedtransferUpdate(employee,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("InPatient/IPDBedTransfer",employee);
  }
 
  // Dashboard

  public getAccountDashboard()
  {
    return this._httpClient.post("Generic/GetByProc?procName=rptAccountDashboard",{})
  }

  public getAccountOPBillDashChart(params)
  {
    return this._httpClient.post("Generic/GetByProc?procName=d_OP_DepartBillInfo_Chart_Range", params)
  }

  public getAccountIPBillDashChart(params)
  {
    return this._httpClient.post("Generic/GetByProc?procName=d_IP_DepartBillInfo_Chart_Range", params)
  }

  public getOPBillInfoSummryDashboard()
  {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_OPBillInfoSumry_Range",{})
  }
  
  // public getIPBillInfoSummryDashboard()
  // {
  //   return this._httpClient.post("Generic/GetByProc?procName=Rtrv_OPBillInfoSumry_Range",{})
  // }

  public getIPIntriemBILLBrowsePrint(emp)
  {
    return this._httpClient.post("Generic/GetByProc?procName=rptIPDInterimBill",emp)
  }
  public getIPDashboard()
  {
    return this._httpClient.post("Generic/GetByProc?procName=rptIPDashboard",{})
  }
  public getCollSummryDashboard()
  {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ColSumry_Range",{})
  }
  
  public getIPDashChart(params)
  {
    return this._httpClient.post("Generic/GetByProc?procName=rptIP_DepartmentChart_Range", params)
  }

  public getOPDashChart(params)
  {
    return this._httpClient.post("Generic/GetByProc?procName=rptOP_DepartmentChart_Range", params)
  }

 public getCollectionSummaryChart(params){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_CollectionSummary_Range", params)
}

public getInventoryDashboard(){
    return this._httpClient.post("Generic/GetByProc?procName=rptInventoryDashboard",{})
}

public getInvPurchaseOrderDashChart(params){
    return this._httpClient.post("Generic/GetByProc?procName=rptInv_StoreWPurchase_Range", params)
}

public getAdmittedPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Admtd_Ptnt_Dtls", employee)
}  

public getAdmittedPatientList_1(Param,loader = true){ 
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/GetDataSetByProc?procName=m_rtrv_Admtd_Ptnt_Dtls", Param);
}

public getDischargedPatientList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Rtrv_AdmtdWithDischargeDate_Ptnt_Dtls", employee)
}  

public getDischargedPatientList_1(employee) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_rtrv_AdmtdWithDischargeDate_Ptnt_Dtls", employee)
}  

public getDischargePatientList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_rtrv_dischargesimple",{})
}  
  
public getBankMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveBankMasterForCombo", {})
}

public getPaymentPrint (paymentid){
    return this._httpClient.post("Generic/GetByProc?procName=rptIPDPaymentReceiptPrint", paymentid)
}

  //Doctor 1 Combobox List
public getDischaregDoctor1Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_AdmittedDoctorForCombo", {})
}
//Doctor 1 Combobox List
public getDischaregDoctor2Combo() {
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_AdmittedDoctorForCombo", {})
}
//Doctor 1 Combobox List
public getDischaregDoctor3Combo() {
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_AdmittedDoctorForCombo", {})
}

  
  //Dischargedoctor Master Combobox List
   public getDischargedoctorNameCombo() {
     return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_AdmittedDoctorForCombo", {})
   }

  public getPatientTypeCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Cmb_rtrv_PatientTypeMasterForCombo", {})
  }
 
  public getDischargetypeCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DischargeTypeForCombo", {})
  }

   //Ward Combobox List
   public getWardCombo(loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
     return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RoomMasterForCombo", {})
   }//Retrieve_RoomMasterForCombo
  
   
  //Bed Combobox List
  public getBedCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveBedMasterForCombo_Conditional",{"Id":Id})
   }

 //Class Combobox List
 public getClassCombo(Id,loader = true){ 
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ClassName_Conditional", {"Id":Id})
}
//ClassName Combobox List
public getBedClassCombo(Id,loader = true){ 
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ClassName_Conditional", {"Id":Id})
}


 //Store Combobox List
 public getStoreCombo() {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForCombo", {})
}

 //Drug Combobox List
 public getDrugCombo() {
  return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_M_DrugMaster_Cmb", {})
}


//UMO Combobox List
public getUMOCombo() {
  return this._httpClient.post("Generic/GetByProc?procName=ps_M_UnitofMeasurementMasterCombo", {})
}

public insertIPDDischargSummary(employee)
{    
  return this._httpClient.post("InPatient/InsertIPDischargeSummary",employee);
}

public updateIPDDischargSummary(employee)
{    
  return this._httpClient.post("InPatient/UpdateIPDischargeSummary",employee);
}
 // Search Window Option

 // Admitted Doctor Master Combobox List
  public getAdmittedDoctorCombo(param,loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorListMasterForCombo",param)
  } 

  //Ward Master Combobox List
  public getWardNameCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_WardClassMasterForCombo", {})
  }
  public getAdvanceList(employee)
  {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_T_AdvanceList",employee)
  }
  // Rtrv_IPRefundAdvanceDetails
  public getRefundofAdvanceList(employee)
  {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_RefundOfAdvance",employee)
  }
  public getReturndetails(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPRefundDetails",employee)
  }

  public getAdvReturndetails(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_RefundOfAdvance",employee)
  }
  public getrefundAdvanceReceiptPrint(RefundId){
    return this._httpClient.post("Generic/GetByProc?procName=rptIPRefundofAdvancePrint", RefundId)

  }
  public getAdvanceBrowsePrint(AdvanceDetailID) {
    return this._httpClient.post("Generic/GetByProc?procName=rptIPDAdvancePrint", AdvanceDetailID)
  }  
  public getRefundofBillList(employee)
  {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IPBill_For_Refund",employee)
  }

  public getRefundofBillServiceList(employee)
  {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IPBill_For_Refund",employee)
  }

  public getRefundofBillIPDList(employee){
  return this._httpClient.post("Generic/GetByProc?procName=m_IPBillListforRefund",employee)
  }

     // Get CashCounter List 
     public getCashcounterList( loader = true) {
      if (loader) {
        this._loaderService.show();
    } 
      return this._httpClient.post("Generic/GetByProc?procName=m_RtrvCashCounterForCombo", {})
    }
  // public getRefundofBillOPDList(employee){
  //   return this._httpClient.post("Generic/GetByProc?procName=RtrvRefundOfBillOPDList",employee)
  //   }

  public InsertAdvanceHeader(employee,loader = true){ 
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("InPatient/IPAdvance",employee)
  }
  public InsertAdvanceHeaderUpdate(employee,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
  return this._httpClient.post("InPatient/IPAdvanceUpdate",employee) 

  }

  public insertIPRefundOfAdvance(employee,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("InPatient/InsertIPRefundofAdvance",employee)
  }
  public insertIPRefundOfBill(employee,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("InPatient/InsertIPRefundofBill",employee)
  }

  
  populateForm1(employee) {
    this.myShowDischargeSummaryForm.patchValue(employee);
        
  }
  populateForm2(employee) {
    this.myRefundAdvanceForm.patchValue(employee);
        
  }
  
  
  // Insert add Charges 
  public InsertIPAddCharges(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("InPatient/AddIPCharges", employee);
  }

    // Insert compnay add Charges 
    public InsertCompanyAddCharges(employee, loader = true) {
      if (loader) {
        this._loaderService.show();
    } 
      return this._httpClient.post("InPatient/ComAddCharges", employee);
    }

  
  public Addchargescancle(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("InPatient/DeleteIPCharges", employee);
  }

// Insert nursing req add Charges 
  public InsertIPLabReqCharges(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("InPatient/LabRequestCharges",employee)
  }
  // public InsertIPBilling(employee)
  // {
  //   return this._httpClient.post("InPatient/IPBillingInsert",employee)
  // }
  public InsertIPBilling(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("InPatient/IPBillingInsertCashCounter",employee)
  }
  // public InsertIPBillingCredit(employee)
  // {
  //   return this._httpClient.post("InPatient/IPBillingCreditInsert",employee)
  // }
  public InsertIPBillingCredit(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("InPatient/IPBillingCreditInsertCashCounter",employee)
  }
  public InsertIPDraftBilling(e, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("InPatient/InsertIPDraftBill",e)
  }
  public InsertInterim (employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("InPatient/IPInterimBillInsertWithCashCounter",employee)
  }
  public BillDiscountAfter(employee)
  {    
    return this._httpClient.post("InPatient/BillDiscountAfter",employee);
  }
  public getClassList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ClassName_Conditional",employee)
  }

  public deleteCharges(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Delete_Addcharges",employee)
  }

  public getIpPatientBillInfo(employee){
    return this._httpClient.post("Generic/GetByProc?procName=ps_rtv_IPPatientBillInformation",employee)
  }

  public getPreviousBillInfo(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IPPreviousBill_info",employee)
  }

  public getIpdAdvanceSummaryPrint(employee){
    return this._httpClient.post("Generic/GetByProc?procName=RptIPDAdvanceBillsummary",employee)
  }

  getPatientVisitedListSearch(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientRegistrationList",employee)
  }

  public getAdmittedPatientDetailList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch", employee)
  }

  fieldValidations() {
    return [
      {
        key: 'cash_controller',
        // validation: [{ 'type': 'required' }, { 'type': 'pattern', value: /^[a-zA-Z]+$/ }]
        validation: []
      },
    ];
  }
  

  public CompanyDoctorList() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorListMaster" , {});  
  }
  public UpdateCompayService(data) {
    return this._httpClient.post("Generic/ExecByQueryStatement?query="+data, {});
  }
  public getAdvanceId(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }
  public getPharmacyAmt(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }
  public getCompanyPhAmt(m_data) {
    return this._httpClient.post("Generic/ExecByQueryStatement?query=" + m_data,{});
}
  public getCheckBalanceAmt(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }

  public getDischargeId(data){
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }
  public getchargesList(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }
  public getBillheaderList(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }

  public getchargesList1(data) {
    
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathRadRequestList",data)
  }

  // Get billing Service List 
  public getBillingServiceList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ServicesList",employee)
    // ps_Rtrv_BillingServicesList Rtrv_ServList
  }

  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }
  public getIPRefundBILLBrowsePrint(RefundId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptIPRefundofBillPrint", RefundId)
  }    

 public getseletclassMasterCombo(Params){
  return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_BillingClassName", Params)
  }
  
  populateForm(employee) {
    this.myShowAdvanceForm.patchValue(employee);
    this.mySaveForm.patchValue(employee);

  }
  public getConcessionCombo()
  {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ConcessionReasonMasterForCombo", {});
  }
  
  public getDischargeSummary(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_T_DischargeSummary",employee)
  }
  public getPrescriptionList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IP_Prescription_Discharge",employee)
  }
  
  public getDepartmentCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Cmb_rtrv_DocDepartmentMasterForCombo", {})
  }
  //Doctor Master Combobox List
  public getDoctorMasterCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Cmb_rtrv_DoctorWithDepartMasterForCombo_Conditional", {"Id":Id})
  }
  //Doctor 1 Combobox List
  public getDoctorMaster1Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_AdmittedDoctorForCombo", {})
  }
  //Doctor 2 Combobox List
  public getDoctorMaster2Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_AdmittedDoctorForCombo", {})
  }
  public getserviceCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Retrieve_ServiceMasterForCombo", {})
  }

  public InsertIPRefundBilling(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("InPatient/InsertIPRefundofBill", employee)
  }
  public getAdvcanceDetails(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }
  public getPreRefundofBill(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }
  public getPreRefundofAdvance(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }

  // public xyz()
  // {
  //   return this._httpClient.post("Generic/GetByProc?procName=rptBarChartValues",{})
  // }

  public depWiseCount(x) {
    
    return this._httpClient.post("Generic/GetByProc?procName=D_IPDepartment_WiseCount",x)
  }

  public monthWiseCount(x) {
    
    return this._httpClient.post("Generic/GetByProc?procName=D_IPDepart_MonthlyWiseCount",x)
  }
  
  public getIPLitDateWise(x)
  {
    return this._httpClient.post("Generic/GetByProc?procName=Dash_IPAdm_LitDateWise",x)
  }
  
  public getDateWiseDepCount(params)
  {
    return this._httpClient.post("Generic/GetByProc?procName=Dash_DateWiseDeptCnt",params)
  }
  
  
  public getIPLitPharmsalesDateWise(x)
  {
      
    return this._httpClient.post("Generic/GetByProc?procName=Dash_Phar_SalesDateWise",x)
  }


  public getIPLitPharmsalesMedicalDateWise(x)
  {
    return this._httpClient.post("Generic/GetByProc?procName=Dash_Phar_SalesMedicalDateWise",x)
  }
  public getIPLitDateWise1(x)
  {
        
     return this._httpClient.post("Generic/GetByProc?procName=Dash_OPIP_BILLDATEWISE",x)
  }

  public getBedStatusList()
  {
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_BedStatus",{})
  }

  public getIPDoctorWiseBedStatusList()
  {
    return this._httpClient.post("Generic/GetByProc?procName=IPDoctorWiseBedStatus",{})
  }

  public getIPBILLBrowsePrint(BillNo) {
    return this._httpClient.post("Generic/GetByProc?procName=rptIPDFinalBill", BillNo)
  }  

 public getIPDraftBILLBrowsePrint(BillNo){
  return this._httpClient.post("Generic/GetByProc?procName=rptIPDDraftBillPrintSummary", BillNo)
 }

 public getIPsettlementPrint(PaymentId){
  return this._httpClient.post("Generic/GetByProc?procName=rptIPDPaymentReceiptPrint", PaymentId)
 }
 public InsertOpSettlementPayment (employee){
  // return this._httpClient.post("InPatient/IPBillingCreditInsert", employee)
   return this._httpClient.post("OutPatient/OpSettlement", employee)
}
public InsertIPSettlementPayment (employee){
  // return this._httpClient.post("InPatient/IPBillingCreditInsert", employee)
   return this._httpClient.post("InPatient/IPSettlement", employee)
}

public getPaidBillList(data) {
  return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
}

public getCreditBillList(data) {
  return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
}


public getLabRequestList(employee){
   
  return this._httpClient.post("Generic/GetByProc?procName=Rtrv_LabRequest_Nursing",employee)
}

public getLabrequestDetailList(employee)
{
 return this._httpClient.post("Generic/GetByProc?procName=Rtrv_NursingLabRequestDetails",employee)
}

public getpatientlist(employee){
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PatientlistDepartmentwise",employee)
}

public getOPIPPatientList(employee){
  
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_OPIPPatientList",employee)
}

public getServicelistpathradio(employee){
  return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathRadServiceList",employee) 

}

public PathResultentryInsert(employee){
  return this._httpClient.post("InPatient/IPPathOrRadiRequest", employee)
}


public getOTRequestList(employee){
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseOTlist", employee)
}

public getPrescriptionReturnList(employee){
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PrescriptionListFromWard", employee)
}

public getRefundofBillDetailList(employee){
  return this._httpClient.post("Generic/GetByProc?procName=RtrvIPDRefundAgainstBill_List", employee)
}

 
public getprescriptionList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IP_Prescriptio_Det", employee)
   
}

public getIpFinalBillReceipt(BillNo){
  return this._httpClient.get("InPatient/view-IP-BillReceipt?BillNo=" + BillNo);
}

getIpFinalBillReceiptgroupwise(BillNo,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IP-BillReceiptgroupwise?BillNo=" + BillNo)
 }


public getIpDraftBillServicewiseReceipt(AdmissionID,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IP-DraftBillReceipt?AdmissionID=" + AdmissionID);
}

public getIpDraftBillclasswise(AdmissionID,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IP-DraftBillNew?AdmissionID=" + AdmissionID);
}





public getCompanyFInalBill(DRNo,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IP-IPCompanyFinalBill?AdmissionID=" + DRNo);
}
public getCompanyFInalBillWithSR(DRNo,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IPCompanyFinalBillWithSR?AdmissionID=" + DRNo);
}


public getIpInterimBillReceipt(BillNo){
  return this._httpClient.get("InPatient/view-IP-InterimBillReceipt?BillNo=" + BillNo);
}

public getpreviousbilldetail(Id){
  return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IPPreviousBill_info",Id);
}

public getAdvancedetail(Id){
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPAdvanceDetails",Id);
}

public getRefundofAdvanceview(RefundId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IP-ReturnOfAdvanceReceipt?RefundId=" + RefundId);
}

public getRefundofbillview(RefundId,loader = true){
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.get("InPatient/view-IP-ReturnOfBillReceipt?RefundId=" + RefundId);
}
public getPreBillDetList(param){
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPBillInfo",param);
}

getIpDischargeReceipt(AdmId){
  return this._httpClient.get("InPatient/view-DischargeCheckOutReceipt?AdmId=" + AdmId)
 }

 getIpDischargesummaryReceipt(AdmissionID){
  return this._httpClient.get("InPatient/view-DischargSummary?AdmissionID=" + AdmissionID)
 }

 getIpDischargesummaryTempReceipt(AdmissionID){
  return this._httpClient.get("InPatient/view-DischargSummaryTemplate?AdmissionID=" + AdmissionID)
 }


 getViewAdvancestatementReceipt(AdmissionID){
  return this._httpClient.get("InPatient/view-IP-AdvanceSummaryReceipt?AdmissionID=" + AdmissionID)
 }

 
 public InsertWhatsappAdvance(emp,loader = true) {
  if (loader) {
    this._loaderService.show();
} 
  return this._httpClient.post("WhatsappE1mail/WhatsappSalesSave", emp);
}
 public getViewAdvanceReceipt(AdvanceDetailID,loader = true){
  if (loader) {
    this._loaderService.show();
} 
  return this._httpClient.get("InPatient/view-IP-AdvanceReceipt?AdvanceDetailID=" + AdvanceDetailID);
}
public getModenameListCombo(){
  return this._httpClient.post("Generic/GetByProc?procName=Rtrvm_modeOfDischarge",{});
}
public getItemlist(Param){//m_Rtrv_IPDrugName,Retrieve_ItemName_BalanceQty
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty",Param)
}
public getDoseList() {
  return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_DoseMasterList", {})
}
  //IP bill Package details
  public getpackagedetList(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_Retrieve_PackageDetails", employee)
  }
}

// Set NODE_OPTIONS="--max-old-space-size=8192"
  