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
    'AppDate',
    'PatientName',
    'Address',
    'MobileNo',
    'DepartmentName',
    'DoctorName',
    'PhAppDate',
    'action'
  ];

  dataSource = new MatTableDataSource<PhoneAppointmentlist>();
  menuActions: Array<string> = [];


  constructor(
    public _phoneAppointService: PhoneAppointListService,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
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
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
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
    return option && option.DoctorName ? option.DoctorName : '';
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

newPhoneAppointment(){
  const dialogRef = this._matDialog.open(NewPhoneAppointmentComponent,
    {
      maxWidth: "85vw",
      height: '65%',
      width: '70%',
    });
  dialogRef.afterClosed().subscribe(result => {
     console.log('The dialog was closed - Insert Action', result);
     this.getPhoneAppointList();
  });
}

CanclePhoneApp(contact){
  
    Swal.fire({
      title: 'Do you want to Cancle Appointment',
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'OK',

    }).then((flag) => {


      if (flag.isConfirmed) {
        let appointmentcancle={};
        appointmentcancle['phoneAppId'] =  contact.PhoneAppId;
       
        let submitData = {
          "phoneAppointmentCancle": appointmentcancle
        
        };
        console.log(submitData);
        this._phoneAppointService.PhoneAppointCancle(submitData).subscribe(response => {
          if (response) {
            Swal.fire('Appointment cancelled !', 'Phone Appointment cancelled Successfully!', 'success').then((result) => {
              
            });
          } else {
            Swal.fire('Error !', 'Appointment cancelled data not saved', 'error');
          }
          this.isLoading1 = '';
        });
      }
    });
    this.getPhoneAppointList();
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
  DoctorName: string;
  IsCancelled: boolean;

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
      this.DoctorName = PhoneAppointmentlist.DoctorName || '';
      this.IsCancelled = PhoneAppointmentlist.IsCancelled || '';

    }
  }
}

