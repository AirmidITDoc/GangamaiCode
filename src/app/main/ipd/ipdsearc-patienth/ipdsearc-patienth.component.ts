import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IPSearchListService } from '../ip-search-list/ip-search-list.service';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from '../advance';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditAdmissionComponent } from '../Admission/admission/edit-admission/edit-admission.component';

@Component({
  selector: 'app-ipdsearc-patienth',
  templateUrl: './ipdsearc-patienth.component.html',
  styleUrls: ['./ipdsearc-patienth.component.scss']
})
export class IPDSearcPatienthComponent implements OnInit {


 
  step = 0;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  sIsLoading: string = '';
  setStep(index: number) {
    this.step = index;
  }
  Range: boolean = false;
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
    public _SearchdialogService: IPSearchListService,
    // public _NursingStationService: NursingStationService,
    // public _SearchdialogService: AdmissionService,
    // private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
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
      "OP_IP_Type": 0,
      "F_Name": (this._SearchdialogService.myFilterform.get("FirstName").value).trim() + '%' || '%',
      "L_Name": (this._SearchdialogService.myFilterform.get("LastName").value).trim() + '%' || '%',
      "Reg_No": this._SearchdialogService.myFilterform.get("RegNo").value || 0,
      "From_Dt":this.datePipe.transform(this._SearchdialogService.myFilterform.get("start").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900', 
      "To_Dt":this.datePipe.transform(this._SearchdialogService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
      "AdmDisFlag": 0,
      // "IPNumber": 0
    }

    console.log(m_data);
    this.sIsLoading = 'loading-data';
    this._SearchdialogService.getOPIPPatientList(m_data).subscribe(Visit => {
      console.log(this.dataSource.data);
      this.dataSource.data = Visit as OPIPPatientModel[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = ' ';


    },
      error => {
        this.sIsLoading = '';
      });
    
  
  }

  getOPIPPatientList() {
    debugger;
    this.sIsLoading = 'loading-data';
    this.PatientType = this._SearchdialogService.myFilterform.get("PatientType").value;
    
    console.log(this.PatientType);

    if (this.PatientType !="0") {
      this.Fromdate = this.datePipe.transform(this._SearchdialogService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000");//'01/01/1900';
      this.Todate = this.datePipe.transform(this._SearchdialogService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000");
      this._SearchdialogService.myFilterform.get('start').value.disable;
      this._SearchdialogService.myFilterform.get('end').value.disable;
      // this.Range = true;
      this.OP_IP_Type=1;
    }
    else {
      this.Fromdate = this.datePipe.transform(this._SearchdialogService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000");
      this.Todate = this.datePipe.transform(this._SearchdialogService.myFilterform.get("end").value, "yyyy-MM-dd 00:00:00.000");
    
      this._SearchdialogService.myFilterform.get('start').value.enable;
      this._SearchdialogService.myFilterform.get('end').value.enable;
      // this.Range = false;
      this.OP_IP_Type=0;
    }

    var m_data = {
      "F_Name": (this._SearchdialogService.myFilterform.get("FirstName").value) + '%' || '%',
      "L_Name": (this._SearchdialogService.myFilterform.get("LastName").value) + '%' || '%',
      "Reg_No": this._SearchdialogService.myFilterform.get("RegNo").value || 0,
      "From_Dt":this.datePipe.transform(this._SearchdialogService.myFilterform.get("start").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900', 
      "To_Dt": this.Todate,//this.Todate this.datePipe.transform(this._SearchdialogService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
      "AdmDisFlag": 0,
      "OP_IP_Type": 1,//this.OP_IP_Type,
      "IPNumber": this._SearchdialogService.myFilterform.get("IPDNo").value || 0,
    }
    console.log(m_data);
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._SearchdialogService.getOPIPPatientList(m_data).subscribe(Visit => {
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
    this._SearchdialogService.myFilterform.get('FirstName').reset();
    this._SearchdialogService.myFilterform.get('LastName').reset();
    this._SearchdialogService.myFilterform.get('RegNo').reset();
    this._SearchdialogService.myFilterform.get('IPDNo').reset();

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
    console.log(contact);
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
      PatInforObj['AdmittedDoctor1ID'] = contact.AdmittedDoctor1ID,
      PatInforObj['AdmittedDoctor2ID'] = contact.AdmittedDoctor2ID,

      PatInforObj['CompanyId'] = contact.CompanyId,
      PatInforObj['SubCompanyId'] = contact.SubTpaComId,
      PatInforObj['IsMLC'] = contact.IsMLC,
      PatInforObj['RelativeName'] = contact.RelativeName,
      PatInforObj['RelativeAddress'] = contact.RelativeAddress,
      PatInforObj['RelationshipId'] = contact.RelationshipId,
      PatInforObj['RelatvieMobileNo'] = contact.MobileNo,
      PatInforObj['PatientType'] = contact.PatientType,
      PatInforObj['TariffName'] = contact.TariffName


    console.log(PatInforObj);
    
    this._SearchdialogService.populateForm2(PatInforObj);
    
    const dialogRef = this._matDialog.open(EditAdmissionComponent, 
      {   maxWidth: "85vw",
          height: '550px',
          width: '100%',
           data : {
          registerObj : PatInforObj,
        }
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