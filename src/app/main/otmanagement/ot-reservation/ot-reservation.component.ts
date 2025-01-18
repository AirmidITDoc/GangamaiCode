import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ot-reservation',
  templateUrl: './ot-reservation.component.html',
  styleUrls: ['./ot-reservation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OTReservationComponent implements OnInit {

  personalFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  registerObj = new OTReservationDetail({});
  options = [];
  filteredOptions: any;
  noOptionFound: boolean = false;
  selectedHName: any;
  selectedPrefixId: any;
  buttonColor: any;
  isCompanySelected: boolean = false;
  public now: Date = new Date();
  screenFromString = 'admission-form';
  submitted = false;
  minDate: Date;
  hasSelectedContacts: boolean;
  AnesthType: any = ''
  D_data1: any;
  dataArray = {};  
  click: boolean = false;

  displayedColumns = [

    'IsCancelled',
    'OP_IP_Type',
    'UnBooking',
    'OPDateTime',
    'PatientName',
    'SurgeonName1',
    'SurgeonName2',
    'AnathesDrName1',
    'AnathesDrName2',
    'Surgeryname',
    // 'Duration',
    'OTTableName',
    'AnesthType',
    // 'AddedBy',
    'instruction',
    'action'

  ];
  dataSource = new MatTableDataSource<OTReservationDetail>();
  isChecked = true;
  sIsLoading: string = '';
  isLoading = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _OtManagementService: OTManagementServiceService,
    public formBuilder: FormBuilder,

    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
        public toastr: ToastrService,
    // public dialogRef: MatDialogRef<OTReservationComponent>,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    ) {
    // dialogRef.disableClose = true;
  }


  doctorNameCmbList: any = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  //department filter
  public departmentFilterCtrl: FormControl = new FormControl();
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
      // "OTTableID": this.searchFormGroup.get("OTTableID").value || 0
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

    this.sIsLoading = 'loading-data';
    var m_data = {
      "From_Dt": this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      "To_Dt": this.datePipe.transform(this.searchFormGroup.get("end").value, "yyy-MM-dd 00:00:00.000") || '2019-06-18 00:00:00.000',
      // "OTTableID": this.searchFormGroup.get("OTTableID").value || 0
    }
    console.log(m_data);
    this._OtManagementService.getOTReservationlist(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as OTReservationDetail[];
      console.log(this.dataSource.data);
       this.dataSource.sort = this.sort;
       this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
       this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }

  CancleOTBooking(contact) {

      Swal.fire({
        title: 'Do you want to cancel the OT Reservation?',
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Cancel it!"
      }).then((flag) => {
        debugger
        if (flag.isConfirmed) {
          let bookingcancle = {};
          bookingcancle['otBookingID'] = contact.OTBookingID;
          bookingcancle['isCancelled'] = 1;
          bookingcancle['isCancelledBy'] = this.accountService.currentUserValue.user.id;
    
          let submitData = {
            "cancelOTBookingParam": bookingcancle,
          };
  
          console.log("cancelOTBookingRequestParam:",submitData);
    
          this.isLoading = true;
    
          this._OtManagementService.BookingReservationCancle(submitData).subscribe(
            (response) => {
              if (response) {
                this.toastr.success('Record Cancelled Successfully.', 'Cancelled!', {
                  toastClass: 'tostr-tost custom-toast-success',
                });
              } else {
                this.toastr.error('Record Data not Cancelled! Please check API error..', 'Error!', {
                  toastClass: 'tostr-tost custom-toast-error',
                });
              }
              this.getOtreservationList();
    
              this.isLoading = false;
            },
            (error) => {
              
              this.toastr.error('An error occurred while canceling the appointment.', 'Error!', {
                toastClass: 'tostr-tost custom-toast-error',
              });
              this.isLoading = false;
            }
          );
        } else {
          this.getOtreservationList();
        }
      });
    }

  addNewReservationg() {
    const dialogRef = this._matDialog.open(NewReservationComponent,
      {
        maxWidth: "80%",
        height: '95%',
        width: '100%',

      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getOtreservationList();
     });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed - Insert Action', result);
    //   this._OtManagementService.getOTReservationlist(this.D_data1).subscribe(Visit => {
    //     this.dataSource.data = Visit as OTReservationDetail[];
    //     console.log(this.dataSource.data);
    //     this.sIsLoading = '';
    //     //  this.click = false;
    //   },
    //     error => {
    //       this.sIsLoading = '';
    //     });
    // });
    //  if(row) this.dialogRef.close(m_data);
  }

  Otnote(){

  // const dialogRef = this._matDialog.open(OTNoteComponent,
  //     {
  //       maxWidth: "85%",
  //       height: "630px !important ", width: '100%',
  //     });

  //   dialogRef.afterClosed().subscribe(result => {
  //     // console.log('The dialog was closed - Insert Action', result);
  //     });
}

OPreOPrativenote(){

  // const dialogRef = this._matDialog.open(PrepostotnoteComponent,
  //     {
  //       maxWidth: "85%",
  //       height: "530px !important ", width: '100%',
  //     });

  //   dialogRef.afterClosed().subscribe(result => {
  //     // console.log('The dialog was closed - Insert Action', result);
  //     });
}

  onEdit(contact) {

    // if (contact.AnesthType)
    //   this.AnesthType = contact.AnesthType.trim();

    // let PatInforObj = {};
    // PatInforObj['OTBookingID'] = contact.OTBookingID,

    //   PatInforObj['PatientName'] = contact.PatientName,
    //   PatInforObj['OTTableName'] = contact.OTTableName,

    //   PatInforObj['OTTableID'] = contact.OTTableID,
    //   PatInforObj['RegNo'] = contact.RegNo,
    //   PatInforObj['SurgeonId'] = contact.SurgeonId,
    //   PatInforObj['SurgeonId1'] = contact.SurgeonId1,
    //   PatInforObj['SurgeonName'] = contact.SurgeonName,
    //   PatInforObj['Surgeryname'] = contact.Surgeryname,

    //   PatInforObj['AnathesDrName'] = contact.AnathesDrName,
    //   PatInforObj['AnathesDrName1'] = contact.AnathesDrName1,
    //   PatInforObj['AnesthType'] = contact.AnesthType,
    //   PatInforObj['AnestheticsDr'] = contact.AnestheticsDr,
    //   PatInforObj['AnestheticsDr1'] = contact.AnestheticsDr1,
    //   PatInforObj['Duration'] = contact.Duration,
    //   PatInforObj['OPDate'] = contact.OPDate,
    //   PatInforObj['OPTime'] = contact.OPTime,
    //   PatInforObj['OP_IP_ID'] = contact.OP_IP_ID

    // PatInforObj['TranDate'] = contact.TranDate,
    //   PatInforObj['UnBooking'] = contact.UnBooking,
    //   PatInforObj['Instruction'] = contact.instruction,
    //   PatInforObj['AddedBy'] = contact.AddedBy,

    //   console.log(PatInforObj);


    // this._OtManagementService.populateFormpersonal(PatInforObj);

    // this.advanceDataStored.storage = new OTReservationDetail(PatInforObj);

    const dialogRef = this._matDialog.open(NewReservationComponent,
      {
        maxWidth: "70%",
        height: '80%',
        width: '100%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
        this.getOtreservationList();
      // this._OtManagementService.getOTReservationlist(this.D_data1).subscribe(Visit => {
      //   this.dataSource.data = Visit as OTReservationDetail[];
      //   console.log(this.dataSource.data);
      //   this.sIsLoading = '';
      //   //  this.click = false;
      // },
      //   error => {
      //     this.sIsLoading = '';
      //   });
    });
    // if (contact) this.dialogRef.close(PatInforObj);
  }
  

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  onClear() {
    this.searchFormGroup.reset({
      start: new Date(),
      end: new Date(),
    });
    this.getOtreservationList();
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

  OPDate: any;
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
  TranTime:any;
  WardName: any;
  WardId:any;
  OPDNo: any;
  CompanyName: any;
  TariffName: any;
  OP_IP_MobileNo: any;
  DoctorName: any;
  AgeYear:any;
  MobileNo:any;
  Age:any;
  Expr1:any;
  OTBookingId: any;
  FirstName:string;
  MiddleName:string;
  LastName:string;
  RegID:any;
  RoomName: any;
  OTbookingDate: any;
  BedName: any;
  OP_IP_Id: any;
  OP_IP_Type: any;
  SurgeryId: any;
  DoctorId: any;
  DepartmentId: any;
  CategoryId: any;
  RoomId: any;
  BedId: any;
  GenderId: any;
  AdmittingDoctor: any;
  SurgeryCategoryName: any;
  SurgeryType: any;
  DepartmentName: any;
  UpdateBy: any;
  IsCancelled: any;
  GenderName: any;
  OTbookingTime: any;
  IsCancelledBy: any;
  IPDNo:any;
  SiteDescId:any;
  SurgeryCategoryId:any;
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
      this.Expr1 = OTReservationDetail.Expr1 || '';
      this.AnestheticsDr1 = OTReservationDetail.AnestheticsDr1 || '';
      this.Surgeryname = OTReservationDetail.Surgeryname || '';
      this.AnesthType = OTReservationDetail.AnesthType || '';
      this.UnBooking = OTReservationDetail.UnBooking || '';
      this.IsAddedBy = OTReservationDetail.IsAddedBy || '';
      this.AddedBy = OTReservationDetail.AddedBy || '';
      this.TranDate = OTReservationDetail.TranDate || '';
      this.TranTime = OTReservationDetail.TranTime || '';
      this.instruction = OTReservationDetail.instruction || '';
      this.WardName= OTReservationDetail.WardName || '';
      this.WardId= OTReservationDetail.WardId || '';
      this.OPDNo= OTReservationDetail.OPDNo || '';
      this.CompanyName= OTReservationDetail.CompanyName || '';
      this.TariffName= OTReservationDetail.TariffName || '';
      this.OP_IP_MobileNo= OTReservationDetail.OP_IP_MobileNo || '';
      this.DoctorName= OTReservationDetail.DoctorName || '';
      this.AgeYear= OTReservationDetail.AgeYear || '';
      this.MobileNo= OTReservationDetail.MobileNo || '';
      this.Age= OTReservationDetail.Age || '';

    this.RoomName = OTReservationDetail.RoomName || '';
    this.OTbookingDate = OTReservationDetail.OTbookingDate || '';
    this.BedName = OTReservationDetail.BedName || 0;
    this.OP_IP_Id = OTReservationDetail.OP_IP_Id || 0;
    this.OP_IP_Type = OTReservationDetail.OP_IP_Type || '';
    this.DoctorId = OTReservationDetail.DoctorId || 0;
    this.DepartmentId = OTReservationDetail.DepartmentId || '';
    this.CategoryId = OTReservationDetail.CategoryId || '';
    this.RoomId = OTReservationDetail.RoomId || '';
    this.BedId = OTReservationDetail.BedId || 0;
    this.GenderId = OTReservationDetail.GenderId || 0;
    this.AdmittingDoctor = OTReservationDetail.AdmittingDoctor || '';
    this.SurgeryCategoryName = OTReservationDetail.SurgeryCategoryName || '';
    this.SurgeryType = OTReservationDetail.SurgeryType || 0;
    this.UpdateBy = OTReservationDetail.UpdateBy || '';
    this.IsCancelled = OTReservationDetail.IsCancelled || '';
    this.GenderName = OTReservationDetail.GenderName || '';
    this.OTbookingTime = OTReservationDetail.OTbookingTime || 0;
    this.IsCancelledBy = OTReservationDetail.IsCancelledBy || 0;
    this.IPDNo = OTReservationDetail.IPDNo || 0;
    this.FirstName=OTReservationDetail.FirstName || '';
    this.MiddleName=OTReservationDetail.MiddleName || '';
    this.LastName=OTReservationDetail.LastName || '';
    this.RegID=OTReservationDetail.RegID || '';
    this.SiteDescId=OTReservationDetail.SiteDescId || '';
    this.SurgeryCategoryId=OTReservationDetail.SurgeryCategoryId || ''
    }
  }
}