import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import { OPIPPatientModel } from 'app/main/nursingstation/patient-vist/patient-vist.component';
import { MrdService } from '../../mrd.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-certificate',
  templateUrl: './new-certificate.component.html',
  styleUrls: ['./new-certificate.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewCertificateComponent implements OnInit {

  public tools: object = {
    type: 'MultiRow',
    items: ['Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'CreateTable', '|',
      'CreateLink', 'Image', '|',
      'Indent', 'Outdent', '|',
      'ClearFormat', '|', 'FullScreen',
      // 'SourceCode',
    ]
  };

  public iframe: object = { enable: true };
  public height: number = 410;
  hasSelectedContacts: boolean;

  DepartmentList: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  createMrdcertificate: FormGroup;

  // registerObj1 = new DischargePatientDetail({});
  options = [];
  filteredOptions: any;
  noOptionFound: boolean = false;
  selectedHName: any;
  buttonColor: any;
  registerObj = new OPIPPatientModel({});
  public now: Date = new Date();
  isLoading: string = '';
  screenFromString = 'admission-form';
  submitted = false;
  sIsLoading: string = '';
  minDate: Date;
  Today:Date =new Date();

  PatientName: any = '';
  OPIP: any = '';
  Bedname: any = '';
  wardname: any = '';
  classname: any = '';
  tariffname: any = '';
  AgeYear: any = '';
  ipno: any = '';
  patienttype: any = '';
  Adm_Vit_ID: any = 0;
  Injuries: any;

  // dataSource = new MatTableDataSource<PhoneschlistMaster>();
  isChecked = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _MrdService: MrdService,
    public formBuilder: FormBuilder,
    // public _PhoneAppointListService :MrdService,
    public _matDialog: MatDialog,
    // public _AdmissionService: AdmissionService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewCertificateComponent>,
    public datePipe: DatePipe) {
    dialogRef.disableClose = true;
  }


  doctorNameCmbList: any = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  //department filter
  public departmentFilterCtrl: FormControl = new FormControl();
  public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();


  ngOnInit(): void {
    this.createMrdcertificate = this.createMrdcertificateForm();
    this.getDepartmentList();
    this.getDoctorList();
    this.minDate = new Date();

    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();
      });

    this.departmentFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDepartment();
      });

  }


  // get f() { return this.personalFormGroup.controls; }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();

    this.getDepartmentList();
  }


  createMrdcertificateForm() {

   
    return this.formBuilder.group({
      // AppointmentDate:[(new Date()).toISOString()],
      CertificateNo: '',
      CertificateDate: [(new Date()).toISOString()],
      CertificateTime: [(new Date()).toISOString()],
      DateofDeath: [(new Date()).toISOString()],
      // TimeofDeath: [{ value: this.registerObj.Adm_Vit_Date }],
      CauseofDeath: ['', Validators.required],
      PlaceOfDeath: ['', Validators.required],
      ResponsiblePersonName: [''],
      SMCNo: ['', Validators.required],
      Diagnsis: '',
      Departmentid:'',
      DoctorId:'',
      DOA: [(new Date()).toISOString()],
    });
  }



  private filterDepartment() {
    // debugger;
    if (!this.DepartmentList) {
      return;
    }
    // get the search keyword
    let search = this.departmentFilterCtrl.value;
    if (!search) {
      this.filteredDepartment.next(this.DepartmentList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDepartment.next(
      this.DepartmentList.filter(bank => bank.departmentName.toLowerCase().indexOf(search) > -1)
    );
  }

  // doctorone filter code  
  private filterDoctor() {

    if (!this.DoctorList) {
      return;
    }
    // get the search keyword
    let search = this.doctorFilterCtrl.value;
    if (!search) {
      this.filteredDoctor.next(this.DoctorList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctor.next(
      this.DoctorList.filter(bank => bank.Doctorname.toLowerCase().indexOf(search) > -1)
    );
  }

  OnChangeDoctorList(departmentObj) {
    console.log(departmentObj);
    this._MrdService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(data => { this.DoctorList = data; })
 console.log(this.DoctorList);
  }

  getDoctorList() {
    this._MrdService.getDoctorMaster().subscribe(
      data => { 
        this.DoctorList = data; 
        console.log(data)
      // data => {
      //   this.DoctorList = data;
        this.filteredDoctor.next(this.DoctorList.slice());
      })
  }
  getDepartmentList() {
    this._MrdService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }

  searchPatientList() {
    debugger;
    // const dialogRef = this._matDialog.open(IPPatientsearchComponent,
    //   {
    //     maxWidth: "90%",
    //     height: "530px !important ", width: '100%',
    //   });

    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log('The dialog was closed - Insert Action', result);
    //   if (result) {
    //     this.registerObj = result as OPIPPatientModel;
    //     if (result) {
    //       this.PatientName = this.registerObj.PatientName;
    //       this.OPIP = this.registerObj.IP_OP_Number;
    //       this.AgeYear = this.registerObj.AgeYear;
    //       this.classname = this.registerObj.ClassName;
    //       this.tariffname = this.registerObj.TariffName;
    //       this.ipno = this.registerObj.IPNumber;
    //       this.Bedname = this.registerObj.Bedname;
    //       this.wardname = this.registerObj.WardId;
    //       this.Adm_Vit_ID = this.registerObj.Adm_Vit_ID;
    //     }
    //   }
    //   // console.log(this.registerObj);
    // });
  }

  onSubmit() {
    debugger;
    let MLCId = 0//this.registerObj1.OTCathLabBokingID;
    this.isLoading = 'submit';

    console.log()
    // if (this.Adm_Vit_ID) {

      if (!MLCId) {
        var m_data = {
          "certificateDelete":{
            "certificateId":0
          },
          "certificateInsert": {
            "certificateNo": 0,
            "opD_IPD_Id": this.Adm_Vit_ID || 0,
            "certificateDate": this.dateTimeObj.date,
            "certificateTime": this.dateTimeObj.time,
            "opD_IPD_Type":1,
            "dateofDeath": this.dateTimeObj.date,// this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
            "timeofDeath": this.dateTimeObj.time, // this.datePipe.transform(this._OtManagementService.otreservationFormGroup.get("OPDate").value,"yyyy-MM-dd 00:00:00.000"),
            "causeofDeath": this.createMrdcertificate.get('CauseofDeath').value || '',
            "placeOfDeath": this.createMrdcertificate.get('PlaceOfDeath').value || '',
            "responsiblePersonName": this.createMrdcertificate.get('ResponsiblePersonName').value || '',
            "smcNo": this.createMrdcertificate.get('SMCNo').value || '',
            "diagnsis": this.createMrdcertificate.get('Diagnsis').value || '',
            "addedBy": this.accountService.currentUserValue.user.id


          }
        }
        console.log(m_data);
        this._MrdService.DeathcertificateInsert(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Certificate  Data  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'Certificate Data  not saved', 'error');
          }

        });
      }
    
    // }
  }

  

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    this.dialogRef.close();
   }
}


export class PhoneschlistMaster {
  AppDate: Date;
  Cnt: string;
  // AppDate: Date;
  // Cnt: string;

  // AppDate: Date;
  // Cnt: string;

  // AppDate: Date;
  // Cnt: string;


  /**
   * Constructor
   *
   * @param contact
   */
  constructor(PhoneschlistMaster) {
    {
      this.AppDate = PhoneschlistMaster.AppDate || '';
      this.Cnt = PhoneschlistMaster.Cnt || '';
      this.AppDate = PhoneschlistMaster.AppDate || '';
      this.Cnt = PhoneschlistMaster.Cnt || '';
      this.AppDate = PhoneschlistMaster.AppDate || '';
      this.Cnt = PhoneschlistMaster.Cnt || '';
      this.AppDate = PhoneschlistMaster.AppDate || '';
      this.Cnt = PhoneschlistMaster.Cnt || '';

    }
  }
}