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

  constructor(
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient
  )
   { this.MyForm = this.createMyForm(),
     this.VitalsForm = this.createVitalsForm(),
     this.SugarForm = this.createSugarForm(),
     this.OxygenForm = this.CreateOxygenForm()
   }

   createMyForm(){
      return this._formbuilder.group({
        Floor:[''],
        Ward:[''],
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
}
