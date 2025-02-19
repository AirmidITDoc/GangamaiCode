import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class ClinicalCareChartService {

  MyForm: FormGroup;
  PainAssessForm: FormGroup;
  VitalsForm: FormGroup;
  SugarForm: FormGroup;
  OxygenForm: FormGroup;
  ApacheScoreForm: FormGroup;
  InPutOutputForm: FormGroup;

  constructor(
    public _formbuilder: FormBuilder,
    public _httpClient: HttpClient,
    private _loaderService: LoaderService
  ) {
    this.MyForm = this.createMyForm(),
      this.VitalsForm = this.createVitalsForm(),
      this.SugarForm = this.createSugarForm(),
      this.OxygenForm = this.CreateOxygenForm(),
      this.ApacheScoreForm = this.CreateApachescoreForm(),
      this.InPutOutputForm = this.CreateInputoutForm(),
      this.PainAssessForm = this.createPainAssesForm()
  }

  createMyForm() {
    return this._formbuilder.group({
      WardName: [''],
      PatientNameSearch: ['']
      // FromDate:[new Date()],
      // ToDate:[new Date()],
    })
  }
  createPainAssesForm() {
    return this._formbuilder.group({
      DailyWeight: [''],
      //PatientNameSearch:['']
      // FromDate:[new Date()],
      // ToDate:[new Date()],
    })
  }
  createVitalsForm() {
    return this._formbuilder.group({
      VitalId:[''],
      Temperature: [''],
      Pulse: [''],
      Respiraiton: [''],
      BloodPressure: [''],
      CVP: [''],
      Peep: [''],
      ArterialBloodPressure: [''],
      PressureReading: [''],
      Brady: [''],
      Apnea: [''],
      AbdominalGrith: [''],
      Desaturation: [''],
      PO2: [''],
      Fio2: [''],
      TypeRadio: ['0'],
      SuctionType: ['0'],
      SaturationWitho2: [''],
      SaturationWithOuto2: [''],
      PFRation: ['']
    })
  }
  createSugarForm() {
    return this._formbuilder.group({
      SugarlevelId:[''],
      BSL: [''],
      UnirSugar: [''],
      ETTPressure: [''],
      UrineKeotne: [''],
      Bodies: [''],
      Intakemode: [''],
      RepotetoRMO: [''],
      InformedTo: [''],
      InformedBy: [''],
      Injection: [''],
      InjectionDose: [''],
      Tablet: [''],
      TabletDose: ['']
    })
  }
  CreateOxygenForm() {
    return this._formbuilder.group({
      OxygenId:[''],
      Tidol: [''],
      SetRange: [''],
      IPAP: [''],
      minuteV: [''],
      RateTotal: [''],
      EPAP: [''],
      Peep: [''],
      PC: [''],
      MV: [''],
      Sup: [''],
      FiO2: [''],
      IE: [''],
      OxygenRate: [''],
      SaturationWitho2: [''],
      FlowTrigger: ['']
    })
  }
  CreateApachescoreForm() {
    return this._formbuilder.group({
      Pulse: [''],
      Respiraiton: [''],
      TempRectal: [''],
      MeanArterialPressure: [''],
      ArterialPH: [''],
      Oxygenation: [''],
      SerumHCO3: [''],
      WBC: [''],
      Hematocrit: [''],
      SerumCretinine: [''],
      SerumPotassium: [''],
      SerumSodium: [''],
      EYEOpening: ['0'],
      VerbalResponse: ['0'],
      Motarresponse: ['0'],
      ChroniPoints: ['0'],
      TotalCGS: [''],
      DeathRate: [''],
      TotalApachescore: [''],
      valueA: [''],
      valueB: [''],
      valueC: ['']
    })
  }
  CreateInputoutForm() {
    return this._formbuilder.group({
      IV: [''],
      IVQty: [''],
      PreOral: [''],
      PreOralQty: [''],
      PreJT: [''],
      PreJTQty: [''],
      PreRT: [''],
      PreRTQty: [''],
      Otiner: [''],
      OtinerQty: [''],
      PDHD: [''],
      PDHDQty: [''],
      Influsions: [''],
      InflusionsQty: [''],
      Boluses: [''],
      BolusesQty: [''],
      Urine: [''],
      UrineQty: [''],
      NGAspiratic: [''],
      NGAspiraticQty: [''],
      Drange: [''],
      DrangeQty: [''],
      Other: [''],
      OtherQty: [''],
      Stool: [''],
      StoolQty: [''],
      PDHDOutput: [''],
      PDHDOutputQty: ['']

    })
  }

  public getWardList() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_WardMasterListForCombo", {});
  }
  public getPatientList(param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_AdmisionList_NursingList", param);
  }
  public getLabTestList(param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrive_IP_PathologyList", param);
  }
  public PathPrintResultentryInsert(employee) {
    return this._httpClient.post("Pathology/PathPrintResultentryInsert", employee);
  }
  public getPathTestReport(OP_IP_Type, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.get("Pathology/view-PathReportMultiple?OP_IP_Type=" + OP_IP_Type);
  }
  public getPathologyTempReport(PathReportId, OP_IP_Type, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.get("Pathology/view-PathTemplate?PathReportId=" + PathReportId + "&OP_IP_Type=" + OP_IP_Type);
  }
  public getRequesttList(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_LabRequest_Nursing", Param)
  }
  public getRequestdetList(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_NursingLabRequestDetails", Param)
  }
  public getPrecriptionlistmain(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PrescriptionListFromWard", Param)
  }

  public getPrecriptiondetlist(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IP_Prescriptio_Det", Param)
  }
  public getpainAssesmentList(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_NursingPainAssessment", Param)
  }
  public getpainAssesmentWeightList(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_NursingWeight", Param)
  }
  // Save PainAssesment
  public SavePainAssesment(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Nursing/SaveNursingPainAssessment", Param)
  }
  public getIpPrescriptionview(OP_IP_ID, PatientType, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.get("InPatient/view-IP_Prescription?OP_IP_ID=" + OP_IP_ID + "&PatientType=" + PatientType);
  }
  // save vital
  public SaveVitalInfo(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Nursing/SaveNursingVitals", Param)
  }
  public UpdateVitalInfo(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Nursing/UpdateNursingVitals", Param)
  }
  public getRtrvVitallist(param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_NursingVitals", param)
  }
  // save sugar level
  public SaveSugarlevel(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Nursing/SaveNursingSugarLevel", Param)
  }
  public UpdateSugarlevel(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Nursing/UpdateNursingSugarLevel", Param)
  }
  public getRtrvSugarlevellist(param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_NursingSugarlevel", param)
  }
  // save Oxygen ventilator
  public SaveOxygenVentilator(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Nursing/SaveNursingOrygenVentilator", Param)
  }
  public UpdateOxygenVentilator(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Nursing/UpdateNursingOrygenVentilator", Param)
  }
  public getRtrvOxygenlist(param, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_NursingOxygenVentilator", param)
  }












  VitalpopulateForm(param) {
    this.VitalsForm.patchValue(param);
  }
  SugarlevelpopulateForm(param) {
    this.SugarForm.patchValue(param);
  }
  OxygenpopulateForm(param) {
    this.OxygenForm.patchValue(param);
  }
}
