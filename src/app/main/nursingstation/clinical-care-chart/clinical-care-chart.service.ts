import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

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
    public _formbuilder: UntypedFormBuilder,
    public _httpClient: HttpClient,
    public _httpClient1: ApiCaller,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) {
    this.MyForm = this.createMyForm()
    // this.VitalsForm = this.createVitalsForm(),
    // this.SugarForm = this.createSugarForm(),
    // this.OxygenForm = this.CreateOxygenForm(),
    // this.ApacheScoreForm = this.CreateApachescoreForm(),
    // this.InPutOutputForm = this.CreateInputoutForm()
  }

  createMyForm() {
    return this._formbuilder.group({
      WardName: [''],
      RegID: [''],
      PatientName: ['']
      // FromDate:[new Date()],
      // ToDate:[new Date()],
    })
  }
  createVitalsForm() {
    return this._formbuilder.group({
      vitalId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      vitalDate: [new Date()],
      vitalTime: [new Date()],
      admissionId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      temperature: ['', [Validators.maxLength(10)]],
      pulse: ['', [Validators.maxLength(10)]],
      respiration: ['', [Validators.maxLength(10)]],
      bloodPresure: ['', [Validators.maxLength(10)]],
      cvp: ['', [Validators.maxLength(10)]],
      peep: ['', [Validators.maxLength(10)]],
      arterialBloodPressure: ['', [Validators.maxLength(10)]],
      papressureReading: ['', [Validators.maxLength(10)]],
      brady: ['', [Validators.maxLength(10)]],
      apnea: ['', [Validators.maxLength(10)]],
      abdominalGrith: ['', [Validators.maxLength(10)]],
      desaturation: ['', [Validators.maxLength(10)]],
      saturationWithO2: ['', [Validators.maxLength(10)]],
      saturationWithoutO2: ['', [Validators.maxLength(10)]],
      po2: ['', [Validators.maxLength(10)]],
      fio2: ['', [Validators.maxLength(10)]],
      pfration: ['', [Validators.maxLength(10)]],
      suctionType: 0
    })
  }
  createSugarForm() {
    return this._formbuilder.group({
      // BSL: [''],
      // UnirSugar: [''],
      // ETTPressure: [''],
      // UrineKeotne: [''],
      // Bodies: [''],
      // Intakemode: [''],
      // RepotetoRMO: [''],
      InformedTo: [''],
      InformedBy: [''],
      Injection: [''],
      InjectionDose: [''],
      Tablet: [''],
      TabletDose: [''],

      id: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      entryDate: [new Date()],
      entryTime:[new Date()],
      admissionId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      bsl: ['', [Validators.maxLength(10)]],
      urineSugar: ['', [Validators.maxLength(10)]],
      ettpressure: ['', [Validators.maxLength(10)]],
      urineKetone: ['', [Validators.maxLength(10)]],
      bodies: ['', [Validators.maxLength(10)]],
      intakeMode: 0,
      reportedToRmo: ['', [Validators.maxLength(10)]],
    })
  }
  CreateOxygenForm() {
    return this._formbuilder.group({
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
  createPainAssesForm() {
    return this._formbuilder.group({
      DailyWeight: [''],
      painAssessmentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      painAssessmentDate: [new Date()],
      painAssessmentTime: [new Date()],
      admissionId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      painAssessementValue: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    })
  }

  public getWardList() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_WardMasterListForCombo", {});
  }
  public getpainAssesmentWeightList(param) {
    return this._httpClient1.PostData("ClinicalCare/NursingWeightList", param);
  }
  public getpainAssesmentList(Param) {
    return this._httpClient1.PostData("ClinicalCare/NursingPainAssessmentList", Param)
  }

  public getReportView(Param) {
    return this._httpClient1.PostData("Report/ViewReport", Param);
  }

  public SavePainAssesment(Param: any) {
    if (Param.painAssessmentId) {
      return this._httpClient1.PutData("ClinicalCare/NursingPainAssessmentInsert/" + Param.painAssessmentId, Param);
    } else return this._httpClient1.PostData("ClinicalCare/NursingPainAssessmentInsert", Param);
  }

  public getRtrvVitallist(param) {
    return this._httpClient1.PostData("ClinicalCare/NursingVitalsList", param)
  }

  public getRtrvSugarlevellist(param) {
    return this._httpClient1.PostData("ClinicalCare/NursingSugarlevelList", param)
  }

  public SaveVitalInfo(Param: any) {
    if (Param.vitalId) {
      return this._httpClient1.PutData("ClinicalCare/NursingVitalUpdate/" + Param.vitalId, Param);
    } else return this._httpClient1.PostData("ClinicalCare/NursingVitalInsert", Param);
  }

  public SaveSugarlevel(Param: any) {
    if (Param.id) {
      return this._httpClient1.PutData("ClinicalCare/NursingSugarLevelUpdate/" + Param.id, Param);
    } else return this._httpClient1.PostData("ClinicalCare/TNursingSugarLevelInsert", Param);
  }
}
