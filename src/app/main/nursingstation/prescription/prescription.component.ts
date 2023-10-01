import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NursingstationService } from '../nursingstation.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatDialog } from '@angular/material/dialog';
import { NewPrescriptionComponent } from './new-prescription/new-prescription.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
   encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class PrescriptionComponent implements OnInit {

  sIsLoading: string = '';
  searchFormGroup: FormGroup;
  click: boolean = false;
  MouseEvent = true;
  patientName:any;
  OPIPNo:any;

  
  displayedColumns: string[] = [
    //  'checkbox',
    'IPMedID',
    'OP_IP_ID',
    'MedicalRecoredId',
    'ItemName',
    'Qty',
    'action'
  ];
  dataSource = new MatTableDataSource<Prescription>();
  displayedColumns1: string[] = [
    //  'checkbox',

    'ReqDate',
    // 'ReqTime',
    'ServiceName',
    'AddedByName',
    'BillingUser',
    'AddedByDate',
    // 'AddedByTime',
    'IsStatus',
    'PBill',
    'IsTestCompted',
    'action'
  ];
  // dataSource1 = new MatTableDataSource<LabRequestDetail>();
  
  // @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;
  
  constructor( private formBuilder: FormBuilder,
    public _nursingStationService: NursingstationService,
    // private _IpSearchListService: IpSearchListService,
    private _ActRoute: Router,
    // public dialogRef: MatDialogRef<PathologresultEntryComponent>,
    // public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    this.getLabRequestNursingList();
    // this.onEdit();
  }

  createSearchForm() {
    return this.formBuilder.group({
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      IPMedID: ['']
    });
  }

  getLabRequestNursingList() {
   this.sIsLoading = 'loading-data';
   var m_data = {
         "IPMedID":1 // (this.searchFormGroup.get("Reg_No").value) || 0
   }
   console.log(m_data);
   this._nursingStationService.getprescriptionList(m_data).subscribe(Visit => {
     this.dataSource.data = Visit as Prescription[];
     console.log(this.dataSource.data);
    //  this.dataSource.sort = this.sort;
    //  this.dataSource.paginator = this.paginator;

     this.sIsLoading = '';
     this.click = false;
     },
       error => {
         this.sIsLoading = '';
       });
   }


     onEdit(m) {
    //   console.log(m);
    //   this.patientName=m.PatientName;
    //   this.OPIPNo=m.OP_IP_ID;
    // var m_data = {
    //   "RequestId":  m.RequestId
      
    // }
    // console.log(m_data);
    // //  setTimeout(() => {
    // this._nursingStationService.getLabrequestDetailList(m_data).subscribe(Visit => {
    //   this.dataSource1.data = Visit as LabRequestDetail[];
    //   console.log(this.dataSource1.data);
    //   // this.dataSource1.sort = this.sort;
    //   // this.dataSource1.paginator = this.paginator;
    //   this.sIsLoading = '';
    //   // this.click = false;
    // },
    //   error => {
    //     this.sIsLoading = '';
    //   });
    //  }, 50);


    // } 

  }

  NewTestRequest() {
    const dialogRef = this._matDialog.open(NewPrescriptionComponent,
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
  
  onShow(event: MouseEvent) {
    // this.click = false;// !this.click;
    this.click = !this.click;
    // this. showSpinner = true;

    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';

        this.getLabRequestNursingList();
      }

    }, 50);
    this.MouseEvent = true;
    this.click = true;

  }
  getRecord(row) {
    
    console.log(row);
    var m_data = {
      // " Adm_Vit_ID":row. Adm_Vit_ID,
      "PatientName":this.patientName,
      // "RegNoWithPrefix": row.RegNoWithPrefix,
      // "AgeYear":row.AgeYear,
      "IP_OP_Number": this.OPIPNo
      // "Adm_DoctorName":row.Adm_DoctorName,
      // "ClassName":row.ClassName,
      // "TariffName":row.TariffName,
      // "CompanyName":row.CompanyName,
      // "IPNumber":row.IPNumber,
     
  }
    // this._NursingStationService.populateAdmissionForm(m_data);
    console.log(m_data)
    // this.advanceDataStored.storage = new OPIPPatientModel(m_data);
    

      //   const dialogRef = this._matDialog.open(LabrequestnewPathradioComponent, 
      //    {  maxWidth: "70%",
      //    height: '60% !important',
      //    width: '100%',
      //  });
      //  dialogRef.afterClosed().subscribe(result => {
      //    console.log('The dialog was closed - Insert Action', result);
      //   //  this.getRadiologytemplateMasterList();
      // });
    }
   
  
  onClear() {

    this.searchFormGroup.get('start').reset();
    this.searchFormGroup.get('end').reset();
    this.searchFormGroup.get('Reg_No').reset();
    
  }
}



export class Prescription {
  IPMedID: any;
  OP_IP_ID: any;
  MedicalRecoredId: any;
  ItemName: any;
  Qty: any;
  PatientName:any;
  Adm_Vit_ID:any;
  constructor(Prescription) {
    this.IPMedID = Prescription.IPMedID || 0;
    this.OP_IP_ID= Prescription.OP_IP_ID || '';
    this.MedicalRecoredId = Prescription.MedicalRecoredId || '';
    this.ItemName = Prescription.ItemName || 0;
    this.Qty = Prescription.IsOnFileTest || 0;
    this.PatientName=Prescription.PatientName || '',
    this.Adm_Vit_ID=Prescription.Adm_Vit_ID || 0
  }}
 
 

function ViewChild(MatSort: any) {
  throw new Error('Function not implemented.');
}
