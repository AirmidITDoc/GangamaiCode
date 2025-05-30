import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  mysearchform: FormGroup;
  mypreretunForm: FormGroup;
  myForm: FormGroup;
  ItemForm: FormGroup;

  constructor(
    public _httpClient:HttpClient, public _httpClient1:ApiCaller,
    private _formBuilder: UntypedFormBuilder,  
    private _loggedService: AuthenticationService,    
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { 
    this.mysearchform= this.SearchFilterFrom();
    this.myForm = this.createMyForm();
    this.ItemForm = this.createItemForm();
    this.mypreretunForm=this.PrescriptionReturnFilterForm();
  }

  SearchFilterFrom(): FormGroup{
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      PrescriptionStatus:['Pending'],
      RegNo:''
    })  
  }

   createMyForm() {
      return this._formBuilder.group({
        RegId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        PatientName: ['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
        WardName: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator]],
        StoreId: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        RegID: [0, [Validators.required,this._FormvalidationserviceService.onlyNumberValidator]],
        Op_ip_id: ['1'],
        AdmissionID: 0
      })
    }

    // insert by form 
    createPrescForm() {
      return this._formBuilder.group({
        medicalRecoredId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        admissionId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        roundVisitDate: [(new Date()).toISOString().split('T')[0]],
        roundVisitTime: [(new Date()).toISOString()],
        inHouseFlag: true,
        tIpPrescriptions: "",
      })
    }

//     createPrescForm(_fb: FormBuilder): FormGroup {
//   return _fb.group({
//     medicalRecoredId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
//     admissionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
//     roundVisitDate: [(new Date()).toISOString().split('T')[0]],
//     roundVisitTime: [(new Date()).toISOString()],
//     inHouseFlag: [true],
//     tIpPrescriptions: _fb.array([
//       _fb.group({     
//         ippreId: [0],
//         ipmedId: [0],
//         opIpId: [0],
//         opdIpdType: [1],
//         pdate: [(new Date()).toISOString()],
//         ptime: [(new Date()).toISOString()],
//         classId:[],
//         genericId:[1],
//         drugId:[],
//         doseId:[0],
//         days:[0],
//         qtyPerDay:[0],
//         totalQty:[0],
//         remark:[''],
//         isClosed:[false],
//         isAddBy:[this._loggedService.currentUserValue.userId],
//         storeId:[0],
//         wardID:[0]
//       })
//     ])
//   });
// }


    createItemForm() {
      return this._formBuilder.group({
        ItemId: ['', [Validators.required, this.validateSelectedItem.bind(this)]],
        ItemName: '',
        DoseId: 0,
        Day: [''],
        Qty: ['',[Validators.required,Validators.pattern("^[0-9]*$")]],
        Instruction: ['',[Validators.maxLength(200)]]
      })
    }

  PrescriptionReturnFilterForm():FormGroup{
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo:'',
      PrescriptionStatus:['Pending']
    })
  }

  validateSelectedItem(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && typeof control.value !== 'object') {
      return { invalidItem: true };
    }
    return null;
  }
  
// new dropdown
public getRegistraionById(Id) {
  return this._httpClient1.GetData("OutPatient/" + Id);
}
  public getPrintPrecriptionlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=rptIPDPrecriptionPrint",Param)
  }

  public getPrecriptionlistmain(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PrescriptionListFromWard",Param)
  }

  public getPrecriptiondetlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IP_Prescriptio_Det",Param)
  }

  public getItemlist(Param){//m_Rtrv_IPDrugName,Retrieve_ItemName_BalanceQty
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty",Param)
  }

  public getPharmacyStoreList(){
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_PharStoreList",{});
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

  public getWardList(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveRoomMasterForCombo",{});
  }

  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientRegistrationList", employee)
  }

  public getAdmittedpatientlist(id){
    return this._httpClient1.GetData("Admission/" + id);
  }
  public presciptionSave(employee) {
    return this._httpClient1.PostData("Prescription/InsertPrescription", employee);
  }
   
  public getDoseList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_DoseMasterList", {})
  }

  public getIpPrescriptionview(OP_IP_ID,PatientType){
    return this._httpClient.get("InPatient/view-IP_Prescription?OP_IP_ID=" + OP_IP_ID+"&PatientType="+PatientType);
  }


  public getPriscriptionretList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IPPrescriptionReturnListFromWard",Param)
  }

  public getPreiscriptionretdetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IPPrescReturnItemDet",Param)
  }

  public getBatchList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemNameBatchPOP_IPPresRet",Param)
  }

  public getIpPrescriptionreturnview(PresReId){
    return this._httpClient.get("InPatient/view-IP_PrescriptionReturn?PresReId=" + PresReId);
  }
  // public getItemlist(Param){
  //   return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPDrugName",Param)
  // }

  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("PhoneApp", m_data);
  }

  public getReportView(Param) {
    return this._httpClient1.PostData("Report/ViewReport", Param);
  }

}
