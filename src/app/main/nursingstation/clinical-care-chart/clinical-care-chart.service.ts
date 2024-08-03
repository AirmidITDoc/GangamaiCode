import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ClinicalCareChartService {

  MyForm:FormGroup;
  PainAssessForm:FormGroup;
  VitalsForm : FormGroup;
  SugarForm:FormGroup;
  OxygenForm:FormGroup;
  ApacheScoreForm:FormGroup;
  InPutOutputForm:FormGroup;

  constructor(
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient
  )
   { this.MyForm = this.createMyForm(),
     this.VitalsForm = this.createVitalsForm(),
     this.SugarForm = this.createSugarForm(),
     this.OxygenForm = this.CreateOxygenForm(),
     this.ApacheScoreForm = this.CreateApachescoreForm(),
     this.InPutOutputForm = this.CreateInputoutForm()
   }

   createMyForm(){
      return this._formbuilder.group({ 
        WardName:[''],
        RegID:['']
       // FromDate:[new Date()],
       // ToDate:[new Date()],
      })
    }
    createVitalsForm(){
      return this._formbuilder.group({
        Temperature:[''],
        Pulse:[''],
        Respiraiton:[''],
        BloodPressure:[''],
        CVP:[''],
        Peep:[''],
        ArterialBloodPressure:[''],
        PressureReading:[''],
        Brady:[''],
        Apnea:[''],
        AbdominalGrith:[''],
        Desaturation:[''],
        PO2:[''],
        Fio2:[''],
        TypeRadio:['0'],
        SuctionType:['0'],
        SaturationWitho2:[''],
        SaturationWithOuto2:[''],
        PFRation:['']
      })
    }
    createSugarForm(){
      return this._formbuilder.group({
        BSL:[''],
        UnirSugar:[''],
        ETTPressure:[''],
        UrineKeotne:[''],
        Bodies:[''],
        Intakemode:[''],
        RepotetoRMO:[''],
        InformedTo:[''],
        InformedBy:[''],
        Injection:[''],
        InjectionDose:[''],
        Tablet:[''],
        TabletDose:[''] 
      })
    }
    CreateOxygenForm(){
      return this._formbuilder.group({
        Tidol:[''],
        SetRange:[''],
        IPAP:[''],
        minuteV:[''],
        RateTotal:[''],
        EPAP:[''],
        Peep:[''],
        PC:[''],
        MV:[''],
        Sup:[''],
        FiO2:[''],
        IE:[''],
        OxygenRate:[''] ,
        SaturationWitho2:[''],
        FlowTrigger:['']
      })
    }
    CreateApachescoreForm(){
      return this._formbuilder.group({
        Pulse:[''],
        Respiraiton:[''],
        TempRectal:[''],
        MeanArterialPressure:[''],
        ArterialPH:[''],
        Oxygenation:[''],
        SerumHCO3:[''],
        WBC:[''],
        Hematocrit:[''],
        SerumCretinine:[''],
        SerumPotassium:[''],
        SerumSodium:[''],
        EYEOpening:['0'] ,
        VerbalResponse:['0'],
        Motarresponse:['0'],
        ChroniPoints:['0'],
        TotalCGS:[''],
        DeathRate:[''],
        TotalApachescore:[''],
        valueA:[''],
        valueB:[''],
        valueC:['']
      })
    }
    CreateInputoutForm(){
      return this._formbuilder.group({
        IV:[''],
        IVQty:[''],
        PreOral:[''],
        PreOralQty:[''],
        PreJT:[''],
        PreJTQty:[''],
        PreRT:[''],
        PreRTQty:[''],
        Otiner:[''],
        OtinerQty:[''],
        PDHD:[''],
        PDHDQty:[''],
        Influsions:[''] ,
        InflusionsQty:[''],
        Boluses:[''],
        BolusesQty:[''],
        Urine:[''],
        UrineQty:[''],
        NGAspiratic:[''],
        NGAspiraticQty:[''],
        Drange:[''],
        DrangeQty:[''],
        Other:[''],
        OtherQty:[''],
        Stool:[''],
        StoolQty:[''],
        PDHDOutput:[''],
        PDHDOutputQty:[''] 

      })
    }

    public getWardList(){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_WardMasterListForCombo",{});
    }
    public getPatientList(param){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_AdmisionList_NursingList",param);
    }
}
