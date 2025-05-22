import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { PhoneAppointListService } from '../phone-appoint-list.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { PhoneAppointmentlist } from '../phoneappointment.component';

@Component({
  selector: 'app-new-phone-appointment',
  templateUrl: './new-phone-appointment.component.html',
  styleUrls: ['./new-phone-appointment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPhoneAppointmentComponent implements OnInit {

  hasSelectedContacts: boolean;
  ConfigcityList: any = [];
  cityList: any = [];
  PrefixList: any = [];
  _cityList: any = [];
  selectedState = "";
  selectedStateID: any;
  stateList: any = [];
  ReligionList: any = [];
  MaritalStatusList: any = [];
  PatientTypeList: any = [];
  RelationshipList: any = [];
  TariffList: any = [];
  selectedCountry: any;
  selectedCountryID: any;
  countryList: any = [];
  getAppointmentList = [];
  AreaList: any = [];
  GenderList: any = [];
  DepartmentList: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  WardList: any = [];
  BedList: any = [];
  BedClassList: any = [];
  HospitalList: any = [];
  CompanyList: any = [];
  SubTPACompList: any = [];
  selectedGender = "";
  selectedGenderID: any;
  capturedImage: any;
  personalFormGroup: FormGroup;
  hospitalFormGroup: FormGroup;
  registerObj = new PhoneAppointmentlist({});
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
  vMobile:any;
  vAddress:any;
  isDepartmentSelected:boolean=false;
  isDoctorSelected:boolean=false;
  searchFormGroup: FormGroup;
  PatientListfilteredOptions: any;
  vDepartmentid:any='';
  vDoctorId:any='';
  vDepartmentName:any='';
  vDoctorName:any='';
  PatientName: any = "";
  vFirstName: any = "";
  vLastName: any = "";
  vMiddleName:any='';
  isRegIdSelected: boolean = false;
  currentDate = new Date();
  RegNo: any = 0;
  RegDate: any;
  optionsDep: any[] = [];
  optionsDoc: any[] = [];

  filteredOptionsDep: Observable<string[]>;
  filteredOptionsDoc: Observable<string[]>;
  

  displayedColumns = [

    'AppDate',
    'Cnt',

  ];
  dataSource = new MatTableDataSource<PhoneschlistMaster>();
  isChecked = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _phoneAppointListService: PhoneAppointListService,
    public formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewPhoneAppointmentComponent>,
    public datePipe: DatePipe) {
  }


  doctorNameCmbList: any = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  //department filter
  public departmentFilterCtrl: FormControl = new FormControl();
  public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.personalFormGroup = this.createPesonalForm();
    this.searchFormGroup = this.createSearchForm();
    this.getDepartmentList();
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
    this.getPhoneschduleList();
    // this.getSelectedObj1('');
  }
  createSearchForm() {
    return this.formBuilder.group({
      RegId: [''],
      AppointmentDate: [(new Date()).toISOString()]
    });
  } 
  getSearchList() {
    debugger
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%`
    }
    console.log(m_data)
    this._phoneAppointListService.getPatientRegisterListSearch(m_data).subscribe(data => {
      this.PatientListfilteredOptions = data;
      if (this.PatientListfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    }); 
  } 

  //patient infomation
  getSelectedObj1(obj) {
    console.log("djfhfka:",obj)
    this.dataSource.data = [];
    this.registerObj = obj;
    this.vFirstName= obj.FirstName;
    this.vMiddleName= obj.MiddleName;
    this.vLastName=obj.LastName;
    this.RegNo = obj.RegNo;
    this.vAddress = obj.Address;
    this.RegDate = this.datePipe.transform(obj.RegTime, 'dd/MM/yyyy hh:mm a');
    this.vMobile = obj.MobileNo;
    this.vDepartmentid = obj.DepartmentName;
    this.vDoctorId = obj.DoctorName;

    this.getDepartmentList();
  } 
  getOptionText1(option) {
    if (!option)
      return '';
    return option.FirstName + ' ' + option.MiddleName + ' ' + option.LastName + "-" + option.RegNo ;
 
  }

  get f() { return this.personalFormGroup.controls; }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  createPesonalForm() {
    return this.formBuilder.group({
      AppointmentDate: [(new Date()).toISOString()],
      phoneAppId: '',
      AppDate: '',
      AppTime: '',
      seqNo: '',
      FirstName:  ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z ]*$')
      ]],
      MiddleName: ['', [
        Validators.pattern('^[a-zA-Z ]*$')
      ]],
      LastName: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z ]*$')
      ]],
      Address: [''],
      PhAppDate: '',
      PhAppTime: '',
      // DepartmentId: '',
      Departmentid: '',
    

      MobileNo:['', 
        [ 
          Validators.required,
          Validators.pattern("^[0-9]{10}$"),
        ]
      ],
      DoctorId: '',
      DoctorID: '',
      AddedBy: '',
      UpdatedBy: '',
      PhoneAppId: '',
      isCancelled: '',
      isCancelledBy: '',
      isCancelledDate: '',
      regNo: '',
    });
  }

  getOptionTextDep(option) {
    
    return option && option.DepartmentName ? option.DepartmentName : '';
  }

  getOptionTextDoc(option) {
    
    return option && option.Doctorname ? option.Doctorname : '';
    
  }


  private filterDepartment() {
    
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
      this.DepartmentList.filter(bank => bank.DepartmentName.toLowerCase().indexOf(search) > -1)
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

  // OnChangeDoctorList(departmentObj) {
  //   this._phoneAppointListService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(data => { this.DoctorList = data; })
  // }

  private _filterDoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      this.isDoctorSelected = false;
      return this.optionsDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
    // const filterValue = value.toLowerCase();
    // this.isDoctorSelected = false;
    // return this.optionsDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
  }

  DepartmentId:any=0;
  OnChangeDoctorList(departmentObj) {
    debugger
    console.log(departmentObj)
    this.DepartmentId=departmentObj.DepartmentId;
    this.personalFormGroup.get('DoctorId').reset();
    var vdata={
      "Id":this.DepartmentId
    } 

    this.isDepartmentSelected = true;
    this._phoneAppointListService.getDoctorMasterCombo(vdata).subscribe(
      data => {
        this.DoctorList = data;
       
        // this.filteredDoctor.next(this.DoctorList.slice());
        this.optionsDoc = this.DoctorList.slice();
        this.filteredOptionsDoc = this.personalFormGroup.get('DoctorId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
        );
        if(this.registerObj){
          debugger
          const dVaule=this.DoctorList.filter(item=>item.DoctorId == this.registerObj.ConsultantDocId)
          this.personalFormGroup.get('DoctorId').setValue(dVaule[0])
        }
        console.log("doctor ndfkdf:",this.personalFormGroup.get('DoctorId').value)
      })
  }



   private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      // this.isDepartmentSelected = false;
      return this.optionsDep.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }

  }

  getDepartmentList(){
    this._phoneAppointListService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this.personalFormGroup.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      if(this.registerObj){
        
        const DValue = this.DepartmentList.filter(item => item.DepartmentName == this.registerObj.DepartmentName);
        console.log("Departmentid:",DValue)
        this.personalFormGroup.get('Departmentid').setValue(DValue[0]);
        this.personalFormGroup.updateValueAndValidity();
        this.OnChangeDoctorList(DValue[0]);
        return;
      }
      // this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }

onSave(){

  if (this.vFirstName == '' || this.vFirstName == null || this.vFirstName == undefined) {
    this.toastr.warning('Please enter First Name  ', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  } 
  if (this.vLastName == '' || this.vLastName == null || this.vLastName == undefined) {
    this.toastr.warning('Please enter Last Name  ', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  } 
  // if (this.personalFormGroup.get('Address').value == '' || this.personalFormGroup.get('Address').value== null) {
  //   this.toastr.warning('Please enter First Name  ', 'Warning !', {
  //     toastClass: 'tostr-tost custom-toast-warning',
  //   });
  //   return;
  // } 
  if (this.vMobile == '' || this.vMobile == null || this.vMobile == undefined) {
    this.toastr.warning('Please enter MobileNo  ', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  } 
  if (this.vDepartmentid == '' || this.vDepartmentid == null || this.vDepartmentid == undefined) {
    this.toastr.warning('Please select Department  ', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  } 
  if (this.personalFormGroup.get('Departmentid').value) {
    if(!this.DepartmentList.find(item => item.DepartmentName == this.personalFormGroup.get('Departmentid').value.DepartmentName))
   {
    this.toastr.warning('Please select Valid Department Name', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
   }
  } 
  if (this.vDoctorId == '' || this.vDoctorId == null || this.vDoctorId == undefined) {
    this.toastr.warning('Please select Doctor  ', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  } 
  if (this.personalFormGroup.get('DoctorId').value) {
    if(!this.DoctorList.find(item => item.Doctorname == this.personalFormGroup.get('DoctorId').value.Doctorname))
    {
      this.toastr.warning('Please select Valid Doctor Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  } 
  

    Swal.fire({
      title: 'Do you want to Save the Phone Appointment ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!" ,
      cancelButtonText: "No, Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
          this.OnSubmit();
      }
    });
}
  OnSubmit() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 
    
debugger
    
    if(!this.registerObj.PhoneAppId){
    console.log(this.personalFormGroup.get('AppointmentDate').value.Date);
    var m_data = {
      "phoneAppointmentInsert": {
        "phoneAppId": 0,
        "RegNo":this.RegNo,
        "appDate":formattedDate, //this.dateTimeObj.date || '16/12/2023',
        "appTime": formattedTime,// this.datePipe.transform(this.currentDate, 'hh:mm:ss'), //this.dateTimeObj.time,
        "firstName": this.personalFormGroup.get('FirstName').value || '',
        "middleName": this.personalFormGroup.get('MiddleName').value || '',
        "lastName": this.personalFormGroup.get('LastName').value || '',
        "address": this.personalFormGroup.get('Address').value || '',
        "mobileNo": this.personalFormGroup.get('MobileNo').value || '',
        "phAppDate": this.datePipe.transform(this.personalFormGroup.get('AppointmentDate').value, "yyyy-MM-dd 00:00:00.000"),
        "phAppTime": this.datePipe.transform(this.personalFormGroup.get('AppointmentDate').value, "HH:mm:ss"),
        "departmentId": this.personalFormGroup.get('Departmentid').value.DepartmentId || 0,
        "doctorId": this.personalFormGroup.get('DoctorId').value.DoctorId || 0,
        "addedBy": this.accountService.currentUserValue.user.id,
        "UpdatedBy": this.accountService.currentUserValue.user.id,
      }
    }
    console.log(m_data);
    this._phoneAppointListService.PhoneAppointInsert(m_data).subscribe(response => {
      if (response) {
        this.toastr.success('Record Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.onClose()
      }
      else {
        this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  }
  else{
    // var m_Updatedata = {
    //   "phoneAppointmentInsert": {
    //     "phoneAppId": 0,
    //     "RegNo":'',
    //     "appDate":formattedDate, //this.dateTimeObj.date || '16/12/2023',
    //     "appTime": formattedTime,// this.datePipe.transform(this.currentDate, 'hh:mm:ss'), //this.dateTimeObj.time,
    //     "firstName": this.personalFormGroup.get('FirstName').value || '',
    //     "middleName": this.personalFormGroup.get('MiddleName').value || '',
    //     "lastName": this.personalFormGroup.get('LastName').value || '',
    //     "address": this.personalFormGroup.get('Address').value || '',
    //     "mobileNo": this.personalFormGroup.get('MobileNo').value || '',
    //     "phAppDate": this.datePipe.transform(this.personalFormGroup.get('AppointmentDate').value, "yyyy-MM-dd 00:00:00.000"),
    //     "phAppTime": this.datePipe.transform(this.personalFormGroup.get('AppointmentDate').value, "yyyy-MM-dd 00:00:00.000"),
    //     "departmentId": this.personalFormGroup.get('Departmentid').value.DepartmentId || 0,
    //     "doctorId": this.personalFormGroup.get('DoctorId').value.DoctorId || 0,
    //     "addedBy": this.accountService.currentUserValue.user.id,
    //     "UpdatedBy": this.accountService.currentUserValue.user.id,
    //   }
    // }
    // console.log(m_Updatedata);
    // this._phoneAppointListService.PhoneAppointUpdate(m_Updatedata).subscribe(response => {
    //   if (response) {
    //     Swal.fire('Phone Appointment Updated Successfully !', 'Updated !').then((result) => {
    //       if (result.isConfirmed) {
    //         this._matDialog.closeAll();
    //       }
    //     });
    //   } else {
    //     Swal.fire('Error !', 'Phone Appointment not Updated', 'error');
    //   }
    //   this.isLoading = '';
    // });
    
  }
  
}

  onClose() {
    this.personalFormGroup.reset();
    this.dialogRef.close();
  }


  getPhoneschduleList() {
    this.sIsLoading = 'loading-data';
    this._phoneAppointListService.getPhoenappschdulelist().subscribe(Visit => {
      this.dataSource.data = Visit as PhoneschlistMaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    
    this.dateTimeObj = dateTimeObj;
  }

  changec() {
    this.buttonColor = 'red';
    
  }


  @ViewChild('fname') fname: ElementRef;
  @ViewChild('mname') mname: ElementRef;
  @ViewChild('lname') lname: ElementRef;

  @ViewChild('Address') Address: ElementRef;
  @ViewChild('mobile') mobile: ElementRef;
  @ViewChild('dept') dept: ElementRef;
  @ViewChild('docname') docname: ElementRef;

  public onEnterfname(event): void {
    debugger
    if (event.which === 13) {
      this.mname.nativeElement.focus();
    }
  }

  public onEntermname(event): void {
    if (event.which === 13) {
      this.lname.nativeElement.focus();
    }
  }

  public onEnterlname(event): void {
    if (event.which === 13) {
      this.Address.nativeElement.focus();
    }
  }

  public onEnterAddress(event): void {
    if (event.which === 13) {
      this.mobile.nativeElement.focus();
    }
  }

  public onEntermobile(event):void{
if(event.which===13){
this.dept.nativeElement.focus();
}
  }
  public onEnterdept(event,value): void {
   debugger
    if (event.which === 13) {
      if (value == undefined) {
        this.toastr.warning('Please Enter Valid Department.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else {
        this.docname.nativeElement.focus();
      }
    }
  }
  public onEnterdeptdoc(event,value): void {
   
    if (event.which === 13) {
      if (value == undefined) {
        this.toastr.warning('Please Enter Valid Department Dosctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else {
        // this.button.nativeElement.focus();
      }
    }
  }
  


}

export class PhoneschlistMaster {
  AppDate: Date;
  Cnt: string;

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(PhoneschlistMaster) {
    {
      this.AppDate = PhoneschlistMaster.AppDate || '';
      this.Cnt = PhoneschlistMaster.Cnt || '';

    }
  }
}