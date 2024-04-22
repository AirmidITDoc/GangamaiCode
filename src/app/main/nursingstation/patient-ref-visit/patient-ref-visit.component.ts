import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { PatientrefvisitService } from './patientrefvisit.service';
import { MatAccordion } from '@angular/material/expansion';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-patient-ref-visit',
  templateUrl: './patient-ref-visit.component.html',
  styleUrls: ['./patient-ref-visit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PatientRefVisitComponent implements OnInit {

  step = 0;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  sIsLoading: string = '';
  setStep(index: number) {
    this.step = index;
  }

  msg:any;
  SearchName : string;
  screenFromString = 'OP-billing';
  displayedColumns: string[] = [
    'Adm_Vit_ID',
    'PatientName',
    'RegNoWithPrefix',
    'AgeYear',
    'IP_OP_Number',
    'Adm_DoctorName',
    'ClassName',
    'TariffName',
    'CompanyName',
    'IPNumber',
    // 'MobileNo',
    // 'AgeYear',
 
    'action'
  ];

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;

  // confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  // @Input() childName: string [];
  // @Output() parentFunction:EventEmitter<any> = new EventEmitter();

  dataSource = new MatTableDataSource<OPIPPatientModel>();
  isLoading: String = '';
  
  constructor(
    // private _IpSearchListService: IpSearchListService,
    public _NursingStationService:PatientrefvisitService,
    public _AdmissionService:AdmissionService,
    private accountService: AuthenticationService,
    // public notification:NotificationServiceService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    // public dialogRef: MatDialogRef<PatientrefvisitComponent>, 
    ) { }

  ngOnInit(): void {
    // this.myFilterform=this.filterForm();

    // debugger;
    this.sIsLoading = 'loading-data';
   
    var m_data = {
      "OP_IP_Type":1,
      "F_Name": (this._AdmissionService.myFilterform.get("FirstName").value).trim() + '%' || '%',
      "L_Name": (this._AdmissionService.myFilterform.get("LastName").value).trim() + '%'  || '%',
      "Reg_No": this._NursingStationService.myFilterform.get("RegNo").value || 0,
      "From_Dt" : this.datePipe.transform(this._NursingStationService.myFilterform.get("start").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900', 
      "To_Dt" :  this.datePipe.transform(this._NursingStationService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
      "AdmDisFlag":0,
      "IPNumber":0
       }
    
       console.log(m_data);
        this.sIsLoading = 'loading-data';
        this._NursingStationService.getOPIPPatientList(m_data).subscribe(Visit=> {
          console.log(this.dataSource.data);
          this.dataSource.data = Visit as OPIPPatientModel[];
          this.dataSource.sort =this.sort;
          this.dataSource.paginator=this.paginator;
        
          this.sIsLoading = ' ';
        
          
        },
          error => {
            this.sIsLoading = '';
          });
    
  }


  


  
  // ngOnChanges(changes: SimpleChanges) {
  //   // changes.prop contains the old and the new value...
  //   // console.log(changes.dataArray.currentValue, 'new arrrrrrr');
  //   this.dataSource.data = changes.dataArray.currentValue as AdmissionPersonlModel[];
  //   this.dataSource.sort =this.sort;
  //   this.dataSource.paginator=this.paginator;
  // }

  getOPIPPatientList()
   {
   // debugger;
    this.sIsLoading = 'loading-data';
   
    var m_data={
      "F_Name": (this._AdmissionService.myFilterform.get("FirstName").value) + '%' || '%',
      "L_Name": (this._AdmissionService.myFilterform.get("LastName").value) + '%'  || '%',
      "Reg_No":this._AdmissionService.myFilterform.get("RegNo").value || 0,
      "From_Dt" :this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900', 
      "To_Dt" :  this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
      "AdmDisFlag":0,
      "OP_IP_Type": this._AdmissionService.myFilterform.get("PatientType").value || 1,
      "IPNumber": this._AdmissionService.myFilterform.get("IPDNo").value || 0,
       }
      console.log(m_data);
      setTimeout(() => {
        this.sIsLoading = 'loading-data';
        this._NursingStationService.getOPIPPatientList(m_data).subscribe(Visit=> {
          console.log(this.dataSource.data);
          this.dataSource.data = Visit as OPIPPatientModel[];
          this.dataSource.sort =this.sort;
          this.dataSource.paginator=this.paginator;
        
          this.sIsLoading = ' ';
        
          
        },
          error => {
            this.sIsLoading = '';
          });
      }, 50);
    }
  

  onClear(){
    this._AdmissionService.myFilterform.get('FirstName').reset();
    this._AdmissionService.myFilterform.get('LastName').reset();
    this._AdmissionService.myFilterform.get('RegNo').reset();
    this._AdmissionService.myFilterform.get('IPDNo').reset();
   
   
    // this._AdmissionService.myFilterform.reset(
    //   {
    //     start: [],
    //     end: []
    //   }
    // );
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
       this.dateTimeObj = dateTimeObj;
  }
  
  onClose() {
    // this._NursingStationService.mySaveForm.reset();
    // this.dialogRef.close();
  }

  
   onEdit(row){
    // debugger;
  //  console.log(row);
   var m_data = {
    "Adm_Vit_ID":row.Adm_Vit_ID,
    "PatientName": row.PatientName.trim(),
    "RegNoWithPrefix": row.RegNoWithPrefix,
    "AgeYear":row.AgeYear,
    "IP_OP_Number":row.IP_OP_Number,
    "Adm_DoctorName":row.Adm_DoctorName,
    "ClassName":row.ClassName,
    "TariffName":row.TariffName,
    "CompanyName":row.CompanyName,
    "IPNumber":row.IPNumber,
   
}
    //  if(row) this.dialogRef.close(m_data);
  }


}


export class OPIPPatientModel {
  Adm_Vit_ID: any;
  PatientName: string;
  RegNoWithPrefix: any;
  AgeYear: any;
  IP_OP_Number: any;
  Adm_DoctorName: string;
  ClassName: any;
  TariffName: any;
  CompanyName: Number;
  IPNumber: any;
  Bedname:any;
  TariffId:any;
  ClassId:any;
  WardId: any;
  PatientType:any;
  
  /**
* Constructor
*
* @param OPIPPatientModel
*/
  constructor(OPIPPatientModel) {
      {
          this.Adm_Vit_ID = OPIPPatientModel.Adm_Vit_ID || 0;
          this.PatientName = OPIPPatientModel.PatientName || '';
          this.RegNoWithPrefix = OPIPPatientModel.RegNoWithPrefix || '';
          this.AgeYear = OPIPPatientModel.AgeYear || 0;
          this.IP_OP_Number = OPIPPatientModel.IP_OP_Number || 0;
          this.Adm_DoctorName = OPIPPatientModel.Adm_DoctorName || 0;
          this.ClassName = OPIPPatientModel.ClassName || '';
          this.TariffName = OPIPPatientModel.TariffName || '';
          this.CompanyName = OPIPPatientModel.CompanyName || '';
          this. IPNumber = OPIPPatientModel. IPNumber || '';
          this.Bedname = OPIPPatientModel.Bedname || '';
          this.WardId = OPIPPatientModel.WardId || '';
          this. PatientType = OPIPPatientModel. PatientType || '';
          this.TariffId = OPIPPatientModel.TariffId || 0;
          this.ClassId = OPIPPatientModel.ClassId || 0;
        
      }
  }
}