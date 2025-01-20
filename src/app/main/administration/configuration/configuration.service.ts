import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  configFormGroup: FormGroup;

  constructor(
    private _httpClient: HttpClient,
    private _formBuilder: FormBuilder,
    public loaderService: LoaderService) {
    this.configFormGroup = this.createconfigForm();
    // this.myformSearch=this.createSearchForm();
  }

  createconfigForm() {
    return this._formBuilder.group({
      Charges: 0,
      PopPayBill: 0,
      GenerateOPBill: 0,
      PrintAdm: 0,
      PrintOPDVisit: 0,
      PrintReg: 0,
      FirstName: 0,
      MiddleName: 0,
      LastName: 0,
      PhoneNo: 0,
      Address: 0,
      City: 0,
      Age: 0,
      ClassEdit: 0,
      OPD_Billing_Counter: '',

      ConfigId: '',
      PrintRegAfterReg: '',
      PDPrefix: '',
      OTCharges: '',
      PrintOPDCaseAfterVisit: '',
      PrintIPDAfterAdm: '',
      PopOPBillAfterVisit: '',
      PopPayAfterOPBill: '',
      GenerateOPBillInCashOption: '',
      MandatoryFirstName: '',
      MandatoryMiddleName: '',
      MandatoryLastName: '',
      MandatoryAddress: '',
      MandatoryCity: '',
      MandatoryAge: '',
      MandatoryPhoneNo: '',
      CashCounterId: '',
      OPBillCounter: '',
      OPReceiptCounter: '',
      OPRefundOfBillCounter: '',
      IPAdvanceCounter: '',
      IPBillCounter: '',
      IPReceiptCounter: '',
      IPRefundBillCounter: '',
      IPRefofAdvCounter: '',
      RegPrefix: '',
      RegNo: '',
      IPPrefix: '',
      IPNo: '',
      OPPrefix: '',
      OPNo: '',
      PathDepartment: '',
      IsPathologistDr: '',
      OPD_Billing_CounterId: '',
      OPD_Receipt_CounterId: '',
      OPD_Refund_Bill_CounterId: '',
      OPD_Advance_CounterId: '',
      OPD_Refund_Advance_CounterId: '',
      IPD_Advance_CounterId: '',
      IPD_Billing_CounterId: '',
      IPD_Receipt_CounterId: '',
      IPD_Refund_of_Bill_CounterId: '',
      IPD_Refund_of_Advance_CounterId: '',
      PatientTypeSelf: '',
      ClassForEdit: '',
      PatientTypeId: '',
      PharmacySales_CounterId: '',
      PharmacySalesReturn_CounterId: '',
      PharmacyReceipt_CounterId: '',
      ChkPharmacyDue: '',
      G_IsPharmacyPaperSetting: '',
      PharmacyPrintName: '',
      G_PharmacyPaperName: '',
      G_IsOPPaperSetting: '',
      G_PharmacyPrintName: '',
      G_OPPaperName: '',
      DepartmentId: '',
      DoctorId: '',
      G_IsIPPaperSetting: '',
      G_IPPaperName: '',
      G_OPPrintName: '',
      IsOPSaleDisPer: '',
      OPSaleDisPer: '',
      IsIPSaleDisPer: '',
      IPSaleDisPer: '',
      PatientTypeID: '',
    });
  }

  public ConfigUpdate(employee, loader = true) {
    if (loader) {
      this.loaderService.show();
    }
    return this._httpClient.put("OutPatient/UpdateConfigSetting", employee);
  }
  public ConfigSettingParamList(loader = true) {
    // if (loader) {
    //   this.loaderService.show();
    // }
    return this._httpClient.post(`Generic/GetByProc?procName=SS_ConfigSettingParam`, {})
  };
  public SchedulerParamList(loader = true) {
    if (loader) {
      this.loaderService.show();
    }
    return this._httpClient.post(`Generic/GetByProc?procName=ss_get_schedulerList`, {})
  };
  

}
