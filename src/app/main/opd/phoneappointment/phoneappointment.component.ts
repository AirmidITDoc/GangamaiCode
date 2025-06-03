import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { PhoneAppointListService } from './phone-appoint-list.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { NewPhoneAppointmentComponent } from './new-phone-appointment/new-phone-appointment.component';
import { GeturlService } from './geturl.service';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-phoneappointment',
  templateUrl: './phoneappointment.component.html',
  styleUrls: ['./phoneappointment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PhoneappointmentComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  isRateLimitReached = false;
  isLoading1: String = '';
  hasSelectedContacts: boolean;
  doctorNameCmbList: any = [];
  isDoctorSelected:boolean=false;
  filteredOptionsDoctor: Observable<string[]>;
  
  optionsDoctor: any[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [
    // 'PhoneAppId',
    'IsCancelled',
    'RegNo',
    'SeqNo',
    'AppDate', 
    'PatientName',
    'Address',
    'MobileNo',
    'DepartmentName',
    'DoctorName',
    'action'
  ];

  dataSource = new MatTableDataSource<PhoneAppointmentlist>();
  menuActions: Array<string> = [];


  constructor(
    public _phoneAppointService: PhoneAppointListService,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    private router: Router,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public _geturl :GeturlService
  ) { }

  ngOnInit(): void {
    // get Doctor list
    this.getDoctorNameCombobox();
    // get phone appointment list on page load
    this.getPhoneAppointList();
  }
  
  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._phoneAppointService.mysearchform.controls; }

  // clear data from input field 
  onClear() {
    this._phoneAppointService.mysearchform.get('FirstNameSearch').reset();
    this._phoneAppointService.mysearchform.get('LastNameSearch').reset();
    this._phoneAppointService.mysearchform.get('DoctorId').reset();
  }


  private _filterDoctor(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      this.isDoctorSelected = false;
       return this.optionsDoctor.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }
   
  getDoctorNameCombobox() {
    this._phoneAppointService.getAdmittedDoctorCombo().subscribe(data => {
      this.doctorNameCmbList = data;
      this.optionsDoctor = this.doctorNameCmbList.slice();
      this.filteredOptionsDoctor = this._phoneAppointService.mysearchform.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor(value) : this.doctorNameCmbList.slice()),
      );
      
    });
  }

  
  getOptionTextDoctor(option){
    return option && option.Doctorname ? option.Doctorname : '';
  }

  // get phone appointment list on Button click
  getPhoneAppointList() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._phoneAppointService.mysearchform.get("FirstNameSearch").value + '%' || '%',
      "L_Name": this._phoneAppointService.mysearchform.get("LastNameSearch").value + '%' || '%',
      "Doctor_Id": this._phoneAppointService.mysearchform.get("DoctorId").value.DoctorID || 0,
      "From_Dt": this.datePipe.transform(this._phoneAppointService.mysearchform.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._phoneAppointService.mysearchform.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    }
    this._phoneAppointService.getPhoneAppointmentlist(D_data).subscribe(Visit => {
    this.dataSource.data = Visit as PhoneAppointmentlist[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

viewPhoneAppointment(){
    this.router.navigate(['/opd/view-phone-appointment']);
}

newPhoneAppointment(){
    const dialogRef = this._matDialog.open(NewPhoneAppointmentComponent,
      {
        maxWidth: "60vw",
        height: '70%',
        width: '60%',
      });
    dialogRef.afterClosed().subscribe(result => {
       console.log('The dialog was closed - Insert Action', result);
       this.getPhoneAppointList();
    });
  }

CanclePhoneApp(contact) {
  Swal.fire({
    title: 'Do you want to cancel the Phone Appointment?',
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Cancel it!"
  }).then((flag) => {
    if (flag.isConfirmed) {
      let appointmentcancle = {};
      appointmentcancle['phoneAppId'] = contact.PhoneAppId;

      let submitData = {
        "phoneAppointmentCancle": appointmentcancle
      };

      console.log(submitData);

      this.isLoading = true;

      this._phoneAppointService.PhoneAppointCancle(submitData).subscribe(
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
          this.getPhoneAppointList();

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
      this.getPhoneAppointList();
    }
  });
}


}




export class PhoneAppointmentlist {
  PhoneAppId: number;
  PatientName: string;
  AppDate: Date;
  Address: string;
  PhAppDate: Date;
  MobileNo: string;
  DepartmentName: string;
  DepartmentId:any;
  DoctorId:any;
  DoctorName: string;
  IsCancelled: boolean;
  RegNo: any;
  SeqNo:any;
  ConsultantDocId:any;

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(PhoneAppointmentlist) {
    {
      this.PhoneAppId = PhoneAppointmentlist.PhoneAppId || '';
      this.PatientName = PhoneAppointmentlist.PatientName || '';
      this.AppDate = PhoneAppointmentlist.AppDate || '';
      this.Address = PhoneAppointmentlist.Address || '';
      this.PhAppDate = PhoneAppointmentlist.PhAppDate || '';
      this.MobileNo = PhoneAppointmentlist.MobileNo || '';
      this.DepartmentName = PhoneAppointmentlist.DepartmentName || '';
      this.DepartmentId=PhoneAppointmentlist.DepartmentId || 0;
      this.DoctorId=PhoneAppointmentlist.DoctorId || 0;
      this.DoctorName = PhoneAppointmentlist.DoctorName || '';
      this.IsCancelled = PhoneAppointmentlist.IsCancelled || '';
      this.RegNo = PhoneAppointmentlist.RegNo || '';
      this.SeqNo=PhoneAppointmentlist.SeqNo || '';
      this.ConsultantDocId=PhoneAppointmentlist.ConsultantDocId || 0;

    }
  }
}

