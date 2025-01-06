import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { OTManagementServiceService } from '../ot-management-service.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, Subject } from 'rxjs';
import { NewReservationComponent } from './new-reservation/new-reservation.component';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-ot-reservation',
  templateUrl: './ot-reservation.component.html',
  styleUrls: ['./ot-reservation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OTReservationComponent implements OnInit {

  personalFormGroup: UntypedFormGroup;
  searchFormGroup: UntypedFormGroup;
  registerObj = new OTReservationDetail({});
  options = [];
  filteredOptions: any;
  noOptionFound: boolean = false;
  selectedHName: any;
  selectedPrefixId: any;
  buttonColor: any;
  isCompanySelected: boolean = false;
  public now: Date = new Date();
  isLoading: string = '';
  screenFromString = 'admission-form';
  submitted = false;
  sIsLoading: string = '';
  minDate: Date;
  hasSelectedContacts: boolean;
  AnesthType: any = ''
  D_data1: any;
  dataArray = {};

  displayedColumns = [

    'RegNo',
    'PatientName',
    'OPDate',
    // 'OPTime',
    'Duration',
    // 'OTTableID',
    'OTTableName',
    // 'SurgeonId',
    'SurgeonName',
    'AnathesDrName',
    'AnathesDrName1',
    'Surgeryname',
    'AnesthType',
    'UnBooking',
    // 'IsAddedBy',
    'AddedBy',
    'TranDate',
    'instruction',
    'action'

  ];
  dataSource = new MatTableDataSource<OTReservationDetail>();
  isChecked = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _OtManagementService: OTManagementServiceService,
    public formBuilder: UntypedFormBuilder,

    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    // public dialogRef: MatDialogRef<OTReservationComponent>,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    ) {
    // dialogRef.disableClose = true;
  }


  doctorNameCmbList: any = [];

  public doctorFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  //department filter
  public departmentFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();


  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();

    this.minDate = new Date();


    this.searchFormGroup = this.createSearchForm();
    debugger;
    this.minDate = new Date();
    var D_data = {

      "FromDate": this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "ToDate": this.datePipe.transform(this.searchFormGroup.get("end").value, "yyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "OTTableID": this.searchFormGroup.get("OTTableID").value || 0

    }
    console.log(D_data);
    this.D_data1 = D_data;
    this._OtManagementService.getOTReservationlist(D_data).subscribe(reg => {
      this.dataArray = reg as OTReservationDetail[];
      this.dataSource.data = reg as OTReservationDetail[];
      console.log(this.dataSource.data);
      console.log(this.dataArray);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });


    this.getOtreservationList();
  }


  get f() { return this.personalFormGroup.controls; }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  createSearchForm() {
    return this.formBuilder.group({
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      OTTableID: [''],

    });
  }


  getOtreservationList() {

    debugger
    this.sIsLoading = 'loading-data';
    var m_data = {
      "FromDate": this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "ToDate": this.datePipe.transform(this.searchFormGroup.get("end").value, "yyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "OTTableID": this.searchFormGroup.get("OTTableID").value || 0
    }
    console.log(m_data);
    this._OtManagementService.getOTReservationlist(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as OTReservationDetail[];
      console.log(this.dataSource.data);
      //  this.dataSource.sort = this.sort;
      //  this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      //  this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }



  addNewReservationg() {

    // debugger;

    console.log(this.dataSource.data['OTTableID'])
    //  this.advanceDataStored.storage = new OTReservationDetail(m_data);

    const dialogRef = this._matDialog.open(NewReservationComponent,
      {
        maxWidth: "80%",
        height: '95%',
        width: '100%',

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this._OtManagementService.getOTReservationlist(this.D_data1).subscribe(Visit => {
        this.dataSource.data = Visit as OTReservationDetail[];
        console.log(this.dataSource.data);
        this.sIsLoading = '';
        //  this.click = false;
      },
        error => {
          this.sIsLoading = '';
        });
    });
    //  if(row) this.dialogRef.close(m_data);
  }

  onEdit(contact) {


    if (contact.AnesthType)
      this.AnesthType = contact.AnesthType.trim();

    let PatInforObj = {};
    PatInforObj['OTBookingID'] = contact.OTBookingID,

      PatInforObj['PatientName'] = contact.PatientName,
      PatInforObj['OTTableName'] = contact.OTTableName,

      PatInforObj['OTTableID'] = contact.OTTableID,
      PatInforObj['RegNo'] = contact.RegNo,
      PatInforObj['SurgeonId'] = contact.SurgeonId,
      PatInforObj['SurgeonId1'] = contact.SurgeonId1,
      PatInforObj['SurgeonName'] = contact.SurgeonName,
      PatInforObj['Surgeryname'] = 'Mild one',//contact.Surgeryname,

      PatInforObj['AnathesDrName'] = contact.AnathesDrName,
      PatInforObj['AnathesDrName1'] = contact.AnathesDrName1,
      PatInforObj['AnesthType'] = contact.AnesthType,
      PatInforObj['AnestheticsDr'] = contact.AnestheticsDr,
      PatInforObj['AnestheticsDr1'] = contact.AnestheticsDr1,
      PatInforObj['Duration'] = contact.Duration,
      PatInforObj['OPDate'] = contact.OPDate,
      PatInforObj['OPTime'] = contact.OPTime,
      PatInforObj['OP_IP_ID'] = contact.OP_IP_ID

    PatInforObj['TranDate'] = contact.TranDate,
      PatInforObj['UnBooking'] = contact.UnBooking,
      PatInforObj['Instruction'] = contact.instruction,
      PatInforObj['AddedBy'] = contact.AddedBy,

      console.log(PatInforObj);


    this._OtManagementService.populateFormpersonal(PatInforObj);

    this.advanceDataStored.storage = new OTReservationDetail(PatInforObj);

    const dialogRef = this._matDialog.open(NewReservationComponent,
      {
        maxWidth: "70%",
        height: '80%',
        width: '100%',
        data: {
          PatObj: PatInforObj
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this._OtManagementService.getOTReservationlist(this.D_data1).subscribe(Visit => {
        this.dataSource.data = Visit as OTReservationDetail[];
        console.log(this.dataSource.data);
        this.sIsLoading = '';
        //  this.click = false;
      },
        error => {
          this.sIsLoading = '';
        });
    });
    // if (contact) this.dialogRef.close(PatInforObj);
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  onClear() {
    // this.personalFormGroup.reset();
    // this.dialogRef.close();
  }
  onClose() {
    // this.personalFormGroup.reset();
    // this.dialogRef.close();
  }
  changec() {

    this.buttonColor = 'red';
    // this.buttonColor: ThemePalette = 'primary';
  }
}


export class OTReservationDetail {
  OTBookingID: any;
  OP_IP_ID: any;
  RegNo: number;
  PatientName: string;

  OPDate: Date;
  OPTime: Date;
  Duration: number;
  OTTableID: Number;
  OTTableName: any;
  SurgeonId: number;
  SurgeonId1: number;
  AdmissionID: any;
  SurgeonName: any;
  AnestheticsDr: any;
  AnestheticsDr1: any;
  Surgeryname: any;
  AnesthType: any;
  UnBooking: any;

  IsAddedBy: any;
  AddedBy: any;
  TranDate: Date;
  instruction: any;

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OTReservationDetail) {
    {
      this.OTBookingID = OTReservationDetail.OTBookingID || '';
      this.OP_IP_ID = OTReservationDetail.OP_IP_ID || '';
      this.RegNo = OTReservationDetail.RegNo || '';
      this.PatientName = OTReservationDetail.PatientName || '';
      this.AdmissionID = OTReservationDetail.AdmissionID || 0;
      this.OPDate = OTReservationDetail.OPDate || '';
      this.OPTime = OTReservationDetail.OPTime || '';
      this.Duration = OTReservationDetail.Duration || '';
      this.OTTableID = OTReservationDetail.OTTableID || '';
      this.OTTableName = OTReservationDetail.OTTableName || '';
      this.SurgeonId = OTReservationDetail.SurgeonId || '';
      this.SurgeonId1 = OTReservationDetail.SurgeonId1 || '';
      this.SurgeonName = OTReservationDetail.SurgeonName || '';
      this.AnestheticsDr = OTReservationDetail.AnestheticsDr || '';

      this.AnestheticsDr1 = OTReservationDetail.AnestheticsDr1 || '';
      this.Surgeryname = OTReservationDetail.Surgeryname || '';
      this.AnesthType = OTReservationDetail.AnesthType || '';
      this.UnBooking = OTReservationDetail.UnBooking || '';
      this.IsAddedBy = OTReservationDetail.IsAddedBy || '';
      this.AddedBy = OTReservationDetail.AddedBy || '';
      this.TranDate = OTReservationDetail.TranDate || '';
      this.instruction = OTReservationDetail.instruction || '';

    }
  }
}