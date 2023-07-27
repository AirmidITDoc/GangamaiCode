import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IPSearchListService } from '../ip-search-list/ip-search-list.service';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from '../advance';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditAdmissionComponent } from '../Admission/admission/edit-admission/edit-admission.component';
import { fuseAnimations } from '@fuse/animations';
import { AdmissionService } from '../Admission/admission/admission.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import { AdmissionNewComponent } from '../Admission/admission/admission-new/admission-new.component';

@Component({
  selector: 'app-ipdsearc-patienth',
  templateUrl: './ipdsearc-patienth.component.html',
  styleUrls: ['./ipdsearc-patienth.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPDSearcPatienthComponent implements OnInit {


  step = 0;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  sIsLoading: string = '';
  setStep(index: number) {
    this.step = index;
  }
  Range: boolean = true;
  OP_IP_Type:any;
  PatientType: any = 1;
  Fromdate: any;
  Todate: any;
  msg: any;
  SearchName: string;
  screenFromString = 'OP-billing';
  displayedColumns: string[] = [


    // 'Adm_Vit_ID',
    'PatientName',
    'RegNoWithPrefix',
    'AgeYear',
    'IP_OP_Number',
    'Adm_DoctorName',
    'ClassName',
    'TariffName',
    'CompanyName',
    'IPNumber',

    // 'Adm_Vit_Date',
    // 'Adm_Vit_Time',
    // 'PatientType',
    // 'IPNumber',
    // 'IsDischarged',
    // 'WardId',
    // 'BedId',
    // 'IsPharClearance',
    // 'IPNumber',
    'action'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  // @Input() childName: string [];
  // @Output() parentFunction:EventEmitter<any> = new EventEmitter();

  dataSource = new MatTableDataSource<OPIPPatientModel>();
  isLoading: String = '';

  constructor(
    private _IpSearchListService: IPSearchListService,
    // public _NursingStationService: NursingStationService,
    public _AdmissionService: AdmissionService,
    private accountService: AuthenticationService,
        public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<IPDSearcPatienthComponent>,
  ) { }

  ngOnInit(): void {
    // this.myFilterform=this.filterForm();

    debugger;
    this.sIsLoading = 'loading-data';
      
    var m_data = {
      "OP_IP_Type": 1,
      "F_Name": (this._AdmissionService.myFilterform.get("FirstName").value).trim() + '%' || '%',
      "L_Name": (this._AdmissionService.myFilterform.get("LastName").value).trim() + '%' || '%',
      "Reg_No": this._AdmissionService.myFilterform.get("RegNo").value || 0,
      "From_Dt": this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900', 
      "To_Dt": this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
      "AdmDisFlag": 0,
      "IPNumber": 0
    }

    console.log(m_data);
    this.sIsLoading = 'loading-data';
    this._AdmissionService.getOPIPPatientList(m_data).subscribe(Visit => {
      console.log(this.dataSource.data);
      this.dataSource.data = Visit as OPIPPatientModel[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = ' ';


    },
      error => {
        this.sIsLoading = '';
      });
    
    // if (this.PatientType) {
    //   this._AdmissionService.myFilterform.get('start').value.enable();
    //   this._AdmissionService.myFilterform.get('end').value.enable();
    //   this.Range = false;

    // } else {

    //   this._AdmissionService.myFilterform.get('start').value.updateValueAndValidity();
    //   this._AdmissionService.myFilterform.get('end').value.updateValueAndValidity();
    //   this._AdmissionService.myFilterform.get('PatientType').value.disable();
    //   this.Range = true;

    // }
  }

  getOPIPPatientList() {
    debugger;
    this.sIsLoading = 'loading-data';
    this.PatientType = this._AdmissionService.myFilterform.get("PatientType").value;
    
    console.log(this.PatientType);

    if (this.PatientType !="0") {
      this.Fromdate = '01/01/1900';
      this.Todate = '01/01/1900';
      this._AdmissionService.myFilterform.get('start').value.disable;
      this._AdmissionService.myFilterform.get('end').value.disable;
      this.Range = true;
      this.OP_IP_Type=1;
    }
    else {
      this.Fromdate = this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000");
      this.Todate = this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value, "yyyy-MM-dd 00:00:00.000");
    
      this._AdmissionService.myFilterform.get('start').value.enable;
      this._AdmissionService.myFilterform.get('end').value.enable;
      this.Range = false;
      this.OP_IP_Type=0;
    }

    var m_data = {
      "F_Name": (this._AdmissionService.myFilterform.get("FirstName").value) + '%' || '%',
      "L_Name": (this._AdmissionService.myFilterform.get("LastName").value) + '%' || '%',
      "Reg_No": this._AdmissionService.myFilterform.get("RegNo").value || 0,
      "From_Dt": this.Fromdate,// this.Fromdate this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900', 
      "To_Dt": this.Todate,//this.Todate this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
      "AdmDisFlag": 0,
      "OP_IP_Type": this.OP_IP_Type,
      // "IPNumber": this._AdmissionService.myFilterform.get("IPDNo").value || 0,
    }
    console.log(m_data);
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._AdmissionService.getOPIPPatientList(m_data).subscribe(Visit => {
        console.log(this.dataSource.data);
        this.dataSource.data = Visit as OPIPPatientModel[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.sIsLoading = ' ';

      },
        error => {
          this.sIsLoading = '';
        });
    }, 50);
  }


  onClear() {
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
    this.dialogRef.close();
  }


  onEdit(contact) {
    debugger;
    let PatInforObj = {};
    PatInforObj['PatientName'] = contact.PatientName,

    PatInforObj['AdmissionID'] = contact.AdmissionID,
    PatInforObj['AdmissionDate'] = contact.DOA,
    PatInforObj['HospitalId'] = contact.HospitalID,
    PatInforObj['TariffId'] = contact.TariffId,
    PatInforObj['CityId'] = contact.CityId,
    PatInforObj['PatientTypeID'] = contact.PatientTypeID,

    PatInforObj['Departmentid'] = contact.DepartmentId,
    PatInforObj['DoctorId'] = contact.DocNameID,
    PatInforObj['AdmittedDoctor1ID'] = contact.AdmittedDoctor1ID ,
    PatInforObj['AdmittedDoctor2ID'] = contact.AdmittedDoctor2ID,

    PatInforObj['CompanyId'] = contact.CompanyId,
    PatInforObj['SubCompanyId'] = contact.SubTpaComId,
    PatInforObj['IsMLC'] = contact.IsMLC,
    PatInforObj['RelativeName'] = contact.RelativeName,
    PatInforObj['RelativeAddress'] = contact.RelativeAddress,
    PatInforObj['RelationshipId'] = contact.RelationshipId,
    PatInforObj['RelatvieMobileNo'] = contact.MobileNo,
    PatInforObj['PatientType'] = contact.PatientType,
    PatInforObj ['TariffName'] = contact.TariffName
    

    console.log(PatInforObj);
    // this.advanceDataStored.storage = new Editdetail(PatInforObj);

    this.advanceDataStored.storage = new AdvanceDetailObj(PatInforObj);

    this._AdmissionService.populateForm2(PatInforObj);

   
      const dialogRef = this._matDialog.open(EditAdmissionComponent,
        {
          maxWidth: '85vw',
      
          height: '580px',width: '100%', 
          data: {
            PatObj: PatInforObj 
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this._matDialog.closeAll();
      });
    // if (contact) this.dialogRef.close(PatInforObj);
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
  Adm_Vit_Date: Date;
  Adm_Vit_Time: Date;
  PatientType: any;
  IsDischarged: any;
  WardId: any;
  BedId: any;
  IsPharClearance: any
  Bedname: any;
  TariffId: any;
  ClassId: any;
  OP_IP_ID:any;
RegNo:number;
  /**
* Constructor
*
* @param OPIPPatientModel
*/
  constructor(OPIPPatientModel) {
    {
      this.Adm_Vit_ID = OPIPPatientModel.Adm_Vit_ID || '';
      this.PatientName = OPIPPatientModel.PatientName || '';
      this.RegNoWithPrefix = OPIPPatientModel.RegNoWithPrefix || '';
      this.AgeYear = OPIPPatientModel.AgeYear || 0;
      this.IP_OP_Number = OPIPPatientModel.IP_OP_Number || 0;
      this.Adm_DoctorName = OPIPPatientModel.Adm_DoctorName || 0;
      this.ClassName = OPIPPatientModel.ClassName || '';
      this.TariffName = OPIPPatientModel.TariffName || '';
      this.CompanyName = OPIPPatientModel.CompanyName || '';
      this.IPNumber = OPIPPatientModel.IPNumber || '';

      this.Adm_Vit_Date = OPIPPatientModel.Adm_Vit_Date || '';
      this.Adm_Vit_Time = OPIPPatientModel.Adm_Vit_Time || '';
      this.PatientType = OPIPPatientModel.PatientType || '';
      this.IsDischarged = OPIPPatientModel.IsDischarged || '';
      this.WardId = OPIPPatientModel.WardId || '';
      this.BedId = OPIPPatientModel.BedId || '';
      this.IsPharClearance = OPIPPatientModel.IsPharClearance || '';
      this.RegNo=OPIPPatientModel.RegNo || 0;
      this.Bedname = OPIPPatientModel.Bedname || '';
      this.WardId = OPIPPatientModel.WardId || '';
      this.PatientType = OPIPPatientModel.PatientType || '';
      this.TariffId = OPIPPatientModel.TariffId || 0;
      this.ClassId = OPIPPatientModel.ClassId || 0;
      this.OP_IP_ID = OPIPPatientModel.OP_IP_ID || 0;
    }
  }
}