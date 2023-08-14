import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OPIPPatientModel } from '../patient-vist/patient-vist.component';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { NursingstationService } from '../nursingstation.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { NewPrescriptionreturnComponent } from './new-prescriptionreturn/new-prescriptionreturn.component';

@Component({
  selector: 'app-prescription-return',
  templateUrl: './prescription-return.component.html',
  styleUrls: ['./prescription-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrescriptionReturnComponent implements OnInit {

 
  sIsLoading: string = '';
  MouseEvent = true;
  click: boolean = false;
  Returnprescription:FormGroup;
  isLoading: string = '';
  selectedAdvanceObj: AdvanceDetailObj;
  screenFromString = 'advance';
  dateTimeObj: any;
  searchFormGroup:FormGroup;
  registerObj = new OPIPPatientModel({});
  PatientName:any ='';
OPIP:any='';
Bedname:any='';
wardname:any='';
classname:any='';
tariffname:any='';
AgeYear:any='';
ipno:any='';
patienttype:any='';
Adm_Vit_ID:any=0;

 dataSource = new MatTableDataSource<Prescriptionreturn>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns: string[] = [
    //  'checkbox',
    'RegNo',
    'PatientName',
    'Vst_Adm_Date',
    // 'Date',
    'OP_IP_ID',
    'OPD_IPD_Type',
    'StoreName',
    // 'IPMedID'
    'action'

  ];
  
  hasSelectedContacts: boolean;
  constructor( private formBuilder: FormBuilder,
    public _NursingStationService: NursingstationService,
    private _ActRoute: Router,
    // public dialogRef: MatDialogRef<PathologresultEntryComponent>,
    // private _IpSearchListService:IpSearchListService,
    private advanceDataStored: AdvanceDataStored,
    // public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,) { }

  ngOnInit(): void {
    //this.getAdmittedPatientList();
    this.Returnprescription = this.createPrescriptionForm();
    this.searchFormGroup=this.createSearchForm();

    // if (this.data) {

    //   this.registerObj1 = this.data.PatObj;
    //   console.log(this.registerObj1);

    //   this.setDropdownObjs1();
    // }

    // if (this.advanceDataStored.storage) {
    //   this.selectedAdvanceObj = this.advanceDataStored.storage;
    //   this.PatientName=this.selectedAdvanceObj.PatientName;
    //   this.OPIP=this.selectedAdvanceObj.IP_OP_Number;
    //   this.AgeYear=this.selectedAdvanceObj.AgeYear;
    //   this.classname=this.selectedAdvanceObj.ClassName;
    //   this.tariffname=this.selectedAdvanceObj.TariffName;
    //   this.ipno=this.selectedAdvanceObj.IPNumber;
    //   this.Bedname=this.selectedAdvanceObj.Bedname;
    //   this.wardname=this.selectedAdvanceObj.WardId;
    // }

    this.Prescriptionfromward();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  createPrescriptionForm() {
    return this.formBuilder.group({
      PresReId : '',
      PresTime: '',
      PresDate : '',
      ToStoreId : '',
   
    });
  }

  createSearchForm() {
    return this.formBuilder.group({
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      Reg_No: [''],
     
    });
  }
     
  onShow(event: MouseEvent) {
    // this.click = false;// !this.click;
    this.click = !this.click;
    // this. showSpinner = true;

    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';

        this.Prescriptionfromward();
      }

    }, 50);
    this.MouseEvent = true;
    this.click = true;

  }

  Prescriptionfromward(){
    // this.sIsLoading = 'loading-data';
    // var m_data = {
    //   "FromDate": '2022-03-24 00:00:00.000',//this.datePipe.transform(this.Returnprescription.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
    //   "ToDate": '2022-03-24 00:00:00.000',// this.datePipe.transform(this.Returnprescription.get("end").value, "yyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
    //   "Reg_No":this.searchFormGroup.get("Reg_No").value || 0
      
    // }
    // setTimeout(() => {
    //   this.sIsLoading = 'loading-data';
    //   this._NursingStationService.getPrescriptionReturnList(m_data).subscribe(Visit => {
    //   this.dataSource.data = Visit as Prescriptionreturn[];
    //   this.dataSource.sort= this.sort;
    //   this.dataSource.paginator=this.paginator;
    //   this.sIsLoading = ' ';
    //   },
    //     error => {
    //       this.sIsLoading = '';
    //     });
    // }, 500);
  
 }

//  searchPatientList() {
//   const dialogRef = this._matDialog.open(IPPatientsearchComponent,
//     {
//       maxWidth: "90%",
//       height: "530px !important ", width: '100%',
//     });

//   dialogRef.afterClosed().subscribe(result => {
//     // console.log('The dialog was closed - Insert Action', result);
//     if (result) {
//       this.registerObj = result as OPIPPatientModel;
//       if (result) {
//         this.PatientName = this.registerObj.PatientName;
//         this.OPIP = this.registerObj.IP_OP_Number;
//         this.AgeYear = this.registerObj.AgeYear;
//         this.classname = this.registerObj.ClassName;
//         this.tariffname = this.registerObj.TariffName;
//         this.ipno = this.registerObj.IPNumber;
//         this.Bedname = this.registerObj.Bedname;
//         this.wardname = this.registerObj.WardId;
//         this.Adm_Vit_ID = this.registerObj.Adm_Vit_ID;
//       }
//     }
//     // console.log(this.registerObj);
//   });
// }



NewPrescriptionreturn() {
  const dialogRef = this._matDialog.open(NewPrescriptionreturnComponent,
    {
      maxWidth: '80%',
      height: '70%',
      width: '100%',
      // height: "100%"
    });
  dialogRef.afterClosed().subscribe(result => {
       // this.getAdmittedPatientList();
  });
}

  getDateTime(dateTimeObj) {
    
    this.dateTimeObj = dateTimeObj;
  }

  onClose() {
    // this.dialogRef.close();
  }
  onSubmit() {

    // this.submitted = true;
    this.isLoading = 'submit';
    
  
  
    if(this.selectedAdvanceObj){
    var m_data = {
      "insertMLCInfo": {
        "PresReId ": 1,//this.MlcInfoFormGroup.get("MLCId").value,
        "ToStoreId ": 1,//this.MlcInfoFormGroup.get("MlcNo").value,
       "PresDate": '01/01/1900',// this.datePipe.transform(this.Returnprescription.get("PresDate").value,"MM-dd-yyyy") || '01/01/1900',
       "PresTime": '01/01/1900',// this.datePipe.transform(this.Returnprescription.get("PresTime").value,"MM-dd-yyyy") || '01/01/1900',
       "OP_IP_Id ": 1,//this.selectedAdvanceObj.AdmissionID,
       "OP_IP_Type ": 1,//this.MlcInfoFormGroup.get("AuthorityName").value || 0,
       "Addedby ": 1,//this.MlcInfoFormGroup.get("ABuckleNo").value || 0,
       "Isdeleted ":0,// this.MlcInfoFormGroup.get("PoliceStation").value,
       
      }
  
    }
      console.log(m_data);
    this._NursingStationService.PrescriptionReturnInsert(m_data).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'PrescriptionReturn Information save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'PrescriptionReturn Information  not saved', 'error');
      }
      this.isLoading = '';
    });
  
  
  }
  else{
    debugger;
    var m_data1 = {
      "insertMLCInfo": {
        "PresReId ": 1,//this.MlcInfoFormGroup.get("MLCId").value,
         "ToStoreId ": 1,//this.MlcInfoFormGroup.get("MlcNo").value,
        "PresDate":  '01/01/1900',//this.datePipe.transform(this.Returnprescription.get("ReportingDate").value,"MM-dd-yyyy") || '01/01/1900',
        "PresTime":  '01/01/1900',//this.datePipe.transform(this.Returnprescription.get("ReportingTime").value,"MM-dd-yyyy") || '01/01/1900',
        "OP_IP_Id ": 1,//this.selectedAdvanceObj.AdmissionID,
        "OP_IP_Type ": 1,//this.MlcInfoFormGroup.get("AuthorityName").value || 0,
        "Addedby ": 1,//this.MlcInfoFormGroup.get("ABuckleNo").value || 0,
        "Isdeleted ":0,// this.MlcInfoFormGroup.get("PoliceStation").value,
        
      }
  
    }
      console.log(m_data1);
    this._NursingStationService.PrescriptionReturnUpdate(m_data1).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'PrescriptionReturn Information Update Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'PrescriptionReturn Information  not Update', 'error');
      }
      this.isLoading = '';
    });
  }
  
  }
  
  onClear(){}

}



export class Prescriptionreturn {
  
  RegNo : number;
  PatientName : any;
  Vst_Adm_Date : Date;
  Date: any;
  OP_IP_ID: number;
  OPD_IPD_Type: any;
  StoreName : any;
  
  constructor(Prescriptionreturn) {
    this.RegNo  = Prescriptionreturn.RegNo  || '0';
    this.PatientName  = Prescriptionreturn.PatientName  || '';
    this.Vst_Adm_Date  = Prescriptionreturn.Vst_Adm_Date  || '';
    this.Date = Prescriptionreturn.Date || '';
    this.OP_IP_ID = Prescriptionreturn.OP_IP_ID || '0';
    this.OPD_IPD_Type = Prescriptionreturn.OPD_IPD_Type || '';
    this.StoreName  = Prescriptionreturn.StoreName  || '';
  
  }

}
