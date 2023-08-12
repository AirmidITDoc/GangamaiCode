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
import Swal from 'sweetalert2';
import { AdmissionPersonlModel, RegInsert } from '../Admission/admission/admission.component';

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
  OP_IP_Type: any;
  PatientType: any = 1;
  Fromdate: any;
  Todate: any;
  msg: any;
  SearchName: string;
  filteredOptions: any;
  noOptionFound: boolean = false;
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
    public dialog: MatDialogRef<IPDSearcPatienthComponent>
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

    // this.getSearchList();

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

    if (this.PatientType != "0") {
      this.Fromdate = '01/01/1900';
      this.Todate = '01/01/1900';
      this._AdmissionService.myFilterform.get('start').value.disable;
      this._AdmissionService.myFilterform.get('end').value.disable;
      this.Range = true;
      this.OP_IP_Type = 1;
    }
    else {
      this.Fromdate = this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000");
      this.Todate = this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value, "yyyy-MM-dd 00:00:00.000");

      this._AdmissionService.myFilterform.get('start').value.enable;
      this._AdmissionService.myFilterform.get('end').value.enable;
      this.Range = false;
      this.OP_IP_Type = 0;
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






  getSearchList() {
    var m_data = {
      "F_Name": `${this._AdmissionService.myFilterform.get('RegId').value}%`,
      "L_Name": '%',
      "Reg_No": '0',
      "From_Dt": '01/01/1900',
      "To_Dt": '01/01/1900',
      "MobileNo": '%'
    }
    if (this._AdmissionService.myFilterform.get('RegId').value.length >= 1) {
      this._AdmissionService.getRegistrationList(m_data).subscribe(resData => {
        // debugger;

        this.filteredOptions = resData;
        console.log(resData);
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }

      });
    }

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
    this.dialog.close();
  }


  onEdit(contact) {
    debugger;
    console.log(contact)
    var m_data = {
      "RegNo":contact.RegNo,
      "RegId":contact.RegId,
      "PrefixID":contact.PrefixID,
      "PrefixName":contact.PrefixName,
      "FirstName":contact.FirstName,
      "MiddleName":contact.MiddleName,
      "LastName":contact.LastName,
      "PatientName":contact.PatientName,
      "DateofBirth":contact.DateofBirth,
      "MaritalStatusId":contact.MaritalStatusId,
      "AadharCardNo":contact.AadharCardNo,
      "Age":contact.Age,
      "AgeDay":contact.AgeDay,
      "AgeMonth":contact.AgeMonth,
      "AgeYear":contact.AgeYear,
      "Address":contact.Address,
      "AreaId":contact.AreaId,
      "City":contact.City,
      "CityId":contact.CityId,
      "StateId":contact.StateId,
      "CountryId":contact.CountryId,
      "PhoneNo":contact.PhoneNo,
      "MobileNo":contact.MobileNo,
      "GenderId":contact.GenderId,
      "GenderName":contact.GenderName,
      "ReligionId":contact.ReligionId,
      "IsCharity":0,
      "PinNo":contact.PinNo,
      "RegDate":contact.RegDate,
      "RegNoWithPrefix":contact.RegNoWithPrefix,
      "ClassId":0,
      "RoomId":0,
      "BedId":0
    }

    console.log(m_data);
    // this._AdmissionService.populateFormpersonal(m_data);
    this.advanceDataStored.storage = new AdmissionPersonlModel(m_data);
    
    const dialogRef = this._matDialog.open(AdmissionNewComponent,
      {
        maxWidth: "90vw",
        // maxHeight: "95vh", 
        height: '780px',
        width: '100%',
        data: {
          PatObj: m_data 
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      // Swal.fire('Close');
      console.log('The dialog was closed - Insert Action', result);
      this.dialog.close();
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
  OP_IP_ID: any;
  RegNo: number;
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
      this.RegNo = OPIPPatientModel.RegNo || 0;
      this.Bedname = OPIPPatientModel.Bedname || '';
      this.WardId = OPIPPatientModel.WardId || '';
      this.PatientType = OPIPPatientModel.PatientType || '';
      this.TariffId = OPIPPatientModel.TariffId || 0;
      this.ClassId = OPIPPatientModel.ClassId || 0;
      this.OP_IP_ID = OPIPPatientModel.OP_IP_ID || 0;
    }
  }
}