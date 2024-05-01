import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { IPSearchListService } from '../ip-search-list.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AdvanceDataStored } from '../../advance';
import { AdvanceDetailObj } from '../ip-search-list.component';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-discharge-summary',
  templateUrl: './discharge-summary.component.html',
  styleUrls: ['./discharge-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DischargeSummaryComponent implements OnInit {

  DischargesumForm:FormGroup;
  submitted = false;
  msg: any;
  Id: any;
  a: any;
  data: any = [];
  DischargeSummaryId: any;
  isLoading: string = '';
  Doctor3List: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  DischargeSList = new DischargeSummary({});
  screenFromString = 'discharge-summary';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  selectedAdvanceObj: AdvanceDetailObj;
  registerObj = new DischargeSummary({});

 
  filteredOptionDoctor1: Observable<string[]>;
  filteredOptionDoctor2: Observable<string[]>;
  filteredOptionDoctor3: Observable<string[]>;

  optionsDoc1: any[] = [];
  optionsDoc2: any[] = [];
  optionsDoc3: any[] = [];
  
  isdoctor1Selected: boolean = false;
  isdoctor2Selected: boolean = false;
  isdoctor3Selected: boolean = false;

  menuActions: Array<string> = [];
  vAdmissionId:any=0;
  vDischargeId:any=0;

  constructor(public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _ActRoute: Router,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<DischargeSummaryComponent>,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe) {
      dialogRef.disableClose = true;
     }

  ngOnInit(): void {
    this.DischargesumForm=this.showDischargeSummaryForm();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      // this.PatientHeaderObj = this.advanceDataStored.storage;
      this.vAdmissionId=this.selectedAdvanceObj.AdmissionID;
    }


    let AdmissionId = this.DischargesumForm.get("AdmissionId").value

    this.getAdmissionInfo();
    this.getDischargeSummaryData();

    this.getDoctorList1();
    this.getDoctorList2();
    this.getDoctorList3();
    this.getdischargeIdbyadmission();
    
  }
  getdischargeIdbyadmission(){
    let Query = "Select DischargeId from Discharge where  AdmissionID=" + this.selectedAdvanceObj.AdmissionID + " ";
    this._IpSearchListService.getDischargeId(Query).subscribe(data => {
      this.registerObj = data[0];
      console.log(this.registerObj);
      this.vDischargeId=this.registerObj.DischargeId


    });

  }

  // showDischargeSummaryForm(): FormGroup {
  //   return this._formBuilder.group({
  //     AdmissionId:'',
  //     RegNo: '',
  //     IPDNo: '',
  //     FirstName: '',
  //     PatientName: '',
  //     MobileNo: '', 
  //     DOA:'',
  //     DOT:'',
  //     BedNo:'',
  //     DoctorId: '0',
  //     DoctorID:'',
  //     DoctorName: '',
  //     WardId: '0',
  //     RoomName: '',
  //     // DischargesummaryId :'',
  //     DischargeSummaryId:'', 
  //     DischargeId :'',
	//     History :'',
  //     Diagnosis :'',
  //     Investigation :'',
  //     ClinicalFinding:'',
  //     OpertiveNotes:'',
  //     TreatmentGiven:'',
  //     TreatmentAdvisedAfterDischarge:'',
	//     Followupdate:[{ value:new Date() }],
	//     Remark:'',
	//     DischargeSummaryDate:'',
	//     OPDate :'',
	//     OPTime :'',
	//     DischargeDoctor1 :'',
	//     DischargeDoctor2 :'',
	//     DischargeDoctor3 :'',
	//     DischargeSummaryTime :'',
	//     DoctorAssistantName :'',
	//     ClaimNumber :'',
	//     PreOthNumber:'',
  //     AddedBy :'',
	//     AddedByDate :'',
	//     SurgeryProcDone :'',
	//     ICD10CODE :'',
	//     ClinicalConditionOnAdmisssion:'',
	//     OtherConDrOpinions:'',
	//     ConditionAtTheTimeOfDischarge :'',
	//     PainManagementTechnique	:'',
	//     LifeStyle :'',
	//     WarningSymptoms	:'',
	//     Radiology :'',
	//     IsNormalOrDeath :'',
  //     DoctorName1: '',

  //     DoctorIdOne: '',
  //     DoctorIdTwo: ''
  //   });
  // }

  showDischargeSummaryForm(): FormGroup {
    return this._formBuilder.group({
    
 AdmissionId:'',             
 DischargeId:'',
 History:'',            
 Diagnosis:'',
 Investigation:'',
 ClinicalFinding:'',
 OpertiveNotes:'',
 TreatmentGiven:'',
 TreatmentAdvisedAfterDischarge:'',
 Followupdate:'',      
 Remark:'',
 DischargeSummaryDate:'',
 OPDate:'',        
 OPTime:'',
 DischargeDoctor1:'',
 DischargeDoctor2:'',
 DischargeDoctor3:'',
 DischargeSummaryTime:'',
 DoctorAssistantName:'',
 ClaimNumber:'',  
 PreOthNumber:'',
 AddedBy:'',  
 AddedByDate:'',
 UpdatedBy:'',  
 UpdatedByDate:'',
 SurgeryProcDone:'',
 ICD10CODE:'',
 ClinicalConditionOnAdmisssion:'',
 OtherConDrOpinions:'',
 ConditionAtTheTimeOfDischarge:'',
 PainManagementTechnique:'',
 LifeStyle:'',
 WarningSymptoms:'',
 Pathology:'',
 Radiology:'',
 IsNormalOrDeath:'',  
 DischargesummaryId:'',  
    });
  }


  // getDoctorList() {
  //   this._IpSearchListService.getDischaregDoctor1Combo().subscribe(data => {
  //     this.Doctor1List = data;
  //      this.optionsDoc1 = this.Doctor1List.slice();
  //     this.filteredOptionDoctor1 = this.DischargesumForm.get('DischargeDoctor1').valueChanges.pipe(
  //       startWith(''),
  //       map(value => value ? this._filterdoc1(value) : this.Doctor1List.slice()),
  //     );
  //   });
  // }


  getDoctorList1() {
    this._IpSearchListService.getDischaregDoctor1Combo().subscribe(data => {
      this.Doctor1List = data;
       this.optionsDoc1 = this.Doctor1List.slice();
      this.filteredOptionDoctor1 = this.DischargesumForm.get('DischargeDoctor2').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterdoc1(value) : this.Doctor1List.slice()),
      );
    });
  }

  getDoctorList2() {
    this._IpSearchListService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor2List = data;
       this.optionsDoc2 = this.Doctor2List.slice();
      this.filteredOptionDoctor2 = this.DischargesumForm.get('DischargeDoctor2').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterdoc2(value) : this.Doctor2List.slice()),
      );
    });
  }

  getDoctorList3() {
    this._IpSearchListService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor3List = data;
      console.log( this.Doctor3List )
       this.optionsDoc3 = this.Doctor3List.slice();
      this.filteredOptionDoctor3 = this.DischargesumForm.get('DischargeDoctor3').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterdoc3(value) : this.Doctor3List.slice()),
      );
    });
  }

  
  private _filterdoc1(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsDoc1.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }


  private _filterdoc2(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsDoc2.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  private _filterdoc3(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsDoc3.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

   getOptionTextsDoctor1(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextsDoctor2(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextsDoctor3(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }

  lngAdmId: any = [];
  // ============================================================================
  getAdmissionInfo() {
    let Query = "select Isnull(AdmissionId,0) as AdmId from T_DischargeSummary where AdmissionId=" + this.DischargesumForm.get("AdmissionId").value + ""
    this._IpSearchListService.getchargesList(Query).subscribe(data => {
     
      this.lngAdmId = data;
      if (this.lngAdmId.length > 0) {
        this.getDischargeSummaryData();
      }
      else {
        console.log('no-data found');
      }
    },
      (error) => {
        this.isLoading = 'list-loaded';
      });
  }

  getDischargeSummaryData() {
    var m_data2 = {
      "AdmissionId": this.DischargesumForm.get("AdmissionId").value || "0"
    }
    this._IpSearchListService.getDischargeSummary(m_data2).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.DischargeSList = data[0] as DischargeSummary;
      } else {
        this.DischargeSList = new DischargeSummary({});
      }
    });
    console.log( this.DischargeSList);
  }

  onClose() {
    this.DischargesumForm.reset();
    this._matDialog.closeAll();
  }

  onSubmit() {
   debugger;
    this.submitted = true;
    this.isLoading = 'submit';
    // console.log(this.DischargeSList.DischargeSummaryId);
    // if ((this.DischargeSList.DischargeSummaryId != 0) && (this.DischargeSList.DischargeSummaryId !=undefined)) {
    if(this.DischargesumForm.get("AdmissionId").value){
      var m_data = {
        "updateIPDDischargSummary": {
          "DischargesummaryId":this.DischargesumForm.get("DischargesummaryId").value || "0",
          "DischargeId": this.vDischargeId,
          "History": this.DischargesumForm.get("History").value || "",
          "Diagnosis": this.DischargesumForm.get("Diagnosis").value || "",
          "Investigation": this.DischargesumForm.get("Investigation").value || "",
          "ClinicalFinding": this.DischargesumForm.get("ClinicalFinding").value || "",
          "OpertiveNotes": this.DischargesumForm.get("OpertiveNotes").value || "",
          "TreatmentGiven": this.DischargesumForm.get("TreatmentGiven").value || "",
          "TreatmentAdvisedAfterDischarge": this.DischargesumForm.get("TreatmentAdvisedAfterDischarge").value || "",
          "Followupdate": this.DischargesumForm.get("Followupdate").value || "2021-05-24T06:18:37.533Z",
          "Remark": this.DischargesumForm.get("Remark").value || "",
          "OPDate": this.dateTimeObj.date,//this.DischargesumForm.get("OPDate").value || "2021-05-24T06:18:37.533Z",
          "OPTime": this.dateTimeObj.date,// this.DischargesumForm.get("OPTime").value || "2021-05-24T06:18:37.533Z",
          "DischargeDoctor1": this.DischargesumForm.get("DischargeDoctor1").value.DoctorID || 0,
          "DischargeDoctor2": this.DischargesumForm.get("DischargeDoctor2").value.DoctorID || 0,
          "DischargeDoctor3": this.DischargesumForm.get("DischargeDoctor3").value.DoctorID || 0,
          "DischargeSummaryTime":  this.dateTimeObj.time,
          "DoctorAssistantName": this.DischargesumForm.get("DoctorAssistantName").value || "",

          
       
        }
      }
      console.log(m_data);
      setTimeout(() => {
        this._IpSearchListService.updateIPDDischargSummary(m_data).subscribe(response => {
          console.log(response);
          if (response) {
            Swal.fire('Congratulations !', 'Discharge Summary updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
                this.viewgetDischargesummaryPdf(this.vAdmissionId,);
              }
            });
          } else {
            Swal.fire('Error !', 'Discharge Summary not updated', 'error');
          }
          this.isLoading = '';
        });
      }, 500);
    }
    else {
      var m_data1 = {
        "insertIPDDischargSummary": {
          "DischargesummaryId": 0,// this.DischargesumForm.get("DischargesummaryId").value || "0",
          "AdmissionId":this.vAdmissionId,// this.DischargesumForm.get("AdmissionId").value || "0",
          "DischargeId": this.vDischargeId,
          "History": this.DischargesumForm.get("History").value || "",
          "Diagnosis": this.DischargesumForm.get("Diagnosis").value || "",
          "Investigation": this.DischargesumForm.get("Investigation").value || "",
          "ClinicalFinding": this.DischargesumForm.get("ClinicalConditionOnAdmisssion").value || "",
          "OpertiveNotes": this.DischargesumForm.get("OpertiveNotes").value || "",
          "TreatmentGiven": this.DischargesumForm.get("TreatmentGiven").value || "",
          "TreatmentAdvisedAfterDischarge": this.DischargesumForm.get("TreatmentAdvisedAfterDischarge").value || "",
          "Followupdate": this.DischargesumForm.get("Followupdate").value || "2021-05-24T06:18:37.533Z",
          "Remark": this.DischargesumForm.get("Remark").value || "",
          "DischargeSummaryDate":  this.dateTimeObj.date,
          "OPDate": this.dateTimeObj.date,// this.DischargesumForm.get("OPDate").value || "2021-05-24T06:18:37.533Z",
          "OPTime": this.dateTimeObj.time,//this.DischargesumForm.get("OPTime").value || "2021-05-24T06:18:37.533Z",
          "DischargeDoctor1": this.DischargesumForm.get("DischargeDoctor1").value.DoctorID || 0,
          "DischargeDoctor2": this.DischargesumForm.get("DischargeDoctor2").value.DoctorID || 0,
          "DischargeDoctor3": this.DischargesumForm.get("DischargeDoctor3").value.DoctorID || 0,
          "DischargeSummaryTime":  this.dateTimeObj.time,
          "DoctorAssistantName": this.DischargesumForm.get("DoctorAssistantName").value || "",
        
        }
      }
      debugger
      console.log(m_data1)
      setTimeout(() => {
        this._IpSearchListService.insertIPDDischargSummary(m_data1).subscribe(response => {
          console.log(response);
          if (response) {
            Swal.fire('Congratulations !', 'Discharge Summary Save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
                this.viewgetDischargesummaryPdf(this.vAdmissionId,);
              }
            });
          }
          else {
            Swal.fire('Error !', 'Discharge Summary not saved', 'error');
          }
          this.isLoading = '';
        });
      }, 500);

      // this.onClose();
    }//if

  }

  
viewgetDischargesummaryPdf(AdmId) {

  this._IpSearchListService.getIpDischargesummaryReceipt(
    AdmId
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Discharge SummaryViewer"
        }
      });
  });
}
 

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

}



export class DischargeSummary{
  AdmissionId:any;            
  DischargeId:any;
  History:any;       
  Diagnosis:any;
  Investigation:any;
  ClinicalFinding:any;
  OpertiveNotes:any;
  TreatmentGiven:any;
  TreatmentAdvisedAfterDischarge:any;
  Followupdate:any;      
  Remark:any;
  DischargeSummaryDate:any;
  OPDate:any;        
  OPTime:any;
  DischargeDoctor1:any;
  DischargeDoctor2:any;
  DischargeDoctor3:any;
  DischargeSummaryTime:any;
  DoctorAssistantName:any;
  ClaimNumber:any;  
  PreOthNumber:any;
  AddedBy:any;  
  AddedByDate:any;
  UpdatedBy:any; 
  UpdatedByDate:any;
  SurgeryProcDone:any;
  ICD10CODE:any;
  ClinicalConditionOnAdmisssion:any;
  OtherConDrOpinions:any;
  ConditionAtTheTimeOfDischarge:any;
  PainManagementTechnique:any;
  LifeStyle:any;
  WarningSymptoms:any;
  Radiology:any;
  IsNormalOrDeath:any;  
  DischargesummaryId:any;  
  Pathology:any;
  constructor(DischargeSummary){
    this.DischargesummaryId=DischargeSummary.DischargesummaryId || 0,
    this.AdmissionId=DischargeSummary.AdmissionId || 0,
    this.DischargeId=DischargeSummary.DischargeId || 0,
    this.History=DischargeSummary.History || 0,
    this.Diagnosis=DischargeSummary.Diagnosis || 0,
    this.Investigation=DischargeSummary.Investigation || 0,
    this.ClinicalFinding=DischargeSummary.ClinicalFinding || 0,
    this.OpertiveNotes=DischargeSummary.OpertiveNotes || 0,
    this.TreatmentGiven=DischargeSummary.TreatmentGiven || 0,
    this.TreatmentAdvisedAfterDischarge=DischargeSummary.TreatmentAdvisedAfterDischarge || 0,
    this.Followupdate=DischargeSummary.Followupdate || new Date(),
    this.Remark=DischargeSummary.Remark || 0,
    this.DischargeSummaryDate=DischargeSummary.DischargeSummaryDate || 0,
    this.OPDate=DischargeSummary.OPDate || 0,
    this.OPTime=DischargeSummary.OPTime || 0,
    this.DischargeDoctor1=DischargeSummary.DischargeDoctor1 || 0,
    this.DischargeDoctor2=DischargeSummary.DischargeDoctor2 || 0,
    this.DischargeDoctor3=DischargeSummary.DischargeDoctor3 || 0,
    this.DischargeSummaryTime=DischargeSummary.DischargeSummaryTime || 0,
    this.DoctorAssistantName=DischargeSummary.DoctorAssistantName || 0
    this.Pathology=DischargeSummary.Pathology || '';
  }
}
