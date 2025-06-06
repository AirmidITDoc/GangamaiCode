import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PhoneAppointListService } from '../phone-appoint-list.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { PhoneAppointmentlist } from '../phoneappointment.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-future-appointmentlist',
  templateUrl: './future-appointmentlist.component.html',
  styleUrls: ['./future-appointmentlist.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FutureAppointmentlistComponent implements OnInit {

  
  displayedColumns = [  
    'RegNo', 
    'AppDate', 
    'PatientName',
    'Address',
    'MobileNo',
    'DepartmentName',
    'DoctorName',
    'AddedByName',
  //  'action'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
FutureApptlistForm:FormGroup
isDoctorSelected:boolean=false;
filteredOptionsDoc:Observable<string[]>
doctorNameCmbList:any=[];

dsfutureappointmentlist = new MatTableDataSource<PhoneAppointmentlist>()

  constructor(private _fuseSidebarService: FuseSidebarService,
    public _phoneAppointListService: PhoneAppointListService,
    public formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FutureAppointmentlistComponent>,
    public datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.FutureApptlistForm = this.CreateFuturAppForm();
    this.getDoctorNameCombobox();
     this.getFuturePhoneAppointList()
  }

  CreateFuturAppForm(){
    return this.formBuilder.group({ 
  FirstNameSearch:['', [
           Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastNameSearch:['', [ 
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      DoctorId:'',
      DoctorName:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    })
  } 
  getFuturePhoneAppointList(){
    let Doctorid = 0
    if(this.FutureApptlistForm.get("DoctorId").value)
       Doctorid =  this.FutureApptlistForm.get("DoctorId").value.DoctorId

    debugger
    var vdata={
      "F_Name": this.FutureApptlistForm.get("FirstNameSearch").value + '%' || '%',
      "L_Name": this.FutureApptlistForm.get("LastNameSearch").value + '%' || '%',
      "Doctor_Id":Doctorid,
      "From_Dt": this.datePipe.transform(this.FutureApptlistForm.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this.FutureApptlistForm.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    }
    console.log(vdata)
    this._phoneAppointListService.getFutureAppointmentlist(vdata).subscribe(data=>{
      this.dsfutureappointmentlist.data = data as  PhoneAppointmentlist[]
      //console.log(this.dsfutureappointmentlist.data)
      this.dsfutureappointmentlist.sort = this.sort
      this.dsfutureappointmentlist.paginator = this.paginator
    })
  }


    getDoctorNameCombobox() {
    this._phoneAppointListService.getAdmittedDoctorCombo().subscribe(data => {
      this.doctorNameCmbList = data; 
      this.filteredOptionsDoc = this.FutureApptlistForm.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor(value) : this.doctorNameCmbList.slice()),
      ); 
    });
  }
  private _filterDoctor(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase(); 
       return this.doctorNameCmbList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    } 
  } 
  getOptionTextDoctor(option){
    return option && option.Doctorname ? option.Doctorname : '';
  }
  onClose(){
    this.dsfutureappointmentlist.data = [];
    this.FutureApptlistForm.reset()
    this.dialogRef.close()
  }
}
