import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { PhoneAppointListService } from './phone-appoint-list.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';

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

  hasSelectedContacts: boolean;
  doctorNameCmbList: any = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [
    'PhoneAppId',
    'AppDate',
    'PatientName',
    'Address',
    'MobileNo',
    'DepartmentName',
    'DoctorName',
    'PhAppDate',
    'IsCancelled',
    'action'
  ];

  dataSource = new MatTableDataSource<PhoneAppointmentlist>();
  menuActions: Array<string> = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();

  constructor(
    public _phoneAppointService: PhoneAppointListService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {

    // get Doctor list
    this.getDoctorNameCombobox();

    // get phone appointment list on page load
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
      console.log(this.dataSource.data);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
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

  //get doctor list 
  getDoctorNameCombobox(){
     this._phoneAppointService.getAdmittedDoctorCombo().subscribe(data => {
      this.doctorNameCmbList = data;
      this.filtereddoctor.next(this.doctorNameCmbList.slice());
    });
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