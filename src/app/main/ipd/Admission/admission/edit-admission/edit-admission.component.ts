///
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdmissionService } from '../admission.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe, Time } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { RegistrationService } from 'app/main/opd/registration/registration.service';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AdmissionPersonlModel } from '../admission.component';
import { Console } from 'console';


@Component({
  selector: 'app-edit-admission',
  templateUrl: './edit-admission.component.html',
  styleUrls: ['./edit-admission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditAdmissionComponent implements OnInit {
  currentDate = new Date();

  searchFormGroup: FormGroup;
  hospitalFormGroup: FormGroup;
  otherFormGroup: FormGroup;

  subscriptionArr: Subscription[] = [];
  screenFromString = 'admission-form';

  hasSelectedContacts: boolean;
  disabled = false;
  isAlive = false;
  isOpen = false;
  isLoadings = false;
  SpinLoading: boolean = false;


  isCompanySelected: boolean = false;
  isCompanyselected: boolean = false;
  isSubCompanySelected: boolean = false;
  isDepartmentSelected: boolean = false;
  isAdmittedDoctor1Selected: boolean = false;
  isAdmittedDoctor2Selected: boolean = false;
  isRefDoctorSelected: boolean = false;
  isDoctorSelected: boolean = false;
  isRelationshipSelected: boolean = false;
  isSearchdoctorSelected: boolean = false;

  selectedAdvanceObj: AdmissionPersonlModel;
  registerObj = new AdmissionPersonlModel({});
  registerObj1 = new AdmissionPersonlModel({});

  submitted = false;
  HospitalList: any = [];
  PatientTypeList: any = [];
  TariffList: any = [];
  RelationshipList: any = [];
  DepartmentList: any = [];
  CompanyList: any = [];
  SubTPACompList: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  RefDoctorList: any = [];
  Todate: any;
  searchDoctorList: any = [];
  doctorNameCmbList: any = [];
  RefoptionsDoc: any[] = [];
  optionsAdDoc1: any[] = [];
  optionsAdDoc2: any[] = [];
  optionsPatientType: any[] = [];
  optionsTariff: any[] = [];
  optionsRefDoc: any[] = [];


  newRegSelected: any = 'registration';
  DoctorId: any = 0;
  registration: any;


  isRegSearchDisabled: boolean = true;
  AdList: boolean = false;
  filteredOptions: any;
  showtable: boolean = false;
  noOptionFound: boolean = false;
  Regdisplay: boolean = false;
  ispatienttypeSelected: boolean = false;
  isTariffIdSelected: boolean = false;
  IsMLC: boolean = false;
  Regflag: boolean = false;

  filteredOptionsDep: any;
  filteredOptionsDoc: any;
  // filteredOptionsDoc1: any;

  filteredOptionsDoc1: Observable<string[]>;
  filteredOptionsRefDoc: any;
  filteredOptionsDoc2: any;
  filteredOptionsRelation: any;
  filteredOptionsCompany: any;
  filteredOptionsSubCompany: any;
  filteredOptionssearchDoctor: any;
  filteredOptionsRegSearch: any;
  filteredOptionsPatientType: any;
  filteredOptionsTarrif: any;
  filteredOptionsRefrenceDoc: any;



  vRelativeName: any;
  vRelativeAddress: any;
  vRelatvieMobileNo: any;
  vRelationshipId: any;
  vadmittedDoctor1: any = 0;
  vadmittedDoctor2: any = 0;
  vrefDoctorId: any = 0;
  msg: any;
  sIsLoading: string = '';
  loadID = 0;
  savedValue: number = null;
  AdmissionID: any;
  filteredDoctor: any;
  isLoading: string;

  filteredOptionsDoctorname: Observable<string[]>;



  @Output() sentCountsToParent = new EventEmitter<any>();

  @Input() panelWidth: string | number;
  @ViewChild('admissionFormStepper') admissionFormStepper: MatStepper;
  @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;


  

  constructor(public _AdmissionService: AdmissionService,
    public _registrationService: RegistrationService,
    public _matDialog: MatDialog,
    private dialogRef: MatDialogRef<EditAdmissionComponent>,
    private _ActRoute: Router,
    private _fuseSidebarService: FuseSidebarService,
    private accountService: AuthenticationService,
    public datePipe: DatePipe,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reportDownloadService: ExcelDownloadService,
    private formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored) {
      this.hospitalFormGroup = this.createHospitalForm();

      this.otherFormGroup = this.otherForm();
  
    this.getPtypeCombo();
    this.getTariffCombo();
    this.getDepartmentList();
    this.getDoctorList();
    this.getRelationshipList();

    this.getDoctor1List();
    this.getDoctor2List();

    this.getCompanyList();
    this.getSubTPACompList();
    this.getRefDoctorList();
    

    if (this.advanceDataStored.storage) {
      debugger
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.registerObj1 = this.advanceDataStored.storage;
      this.IsMLC = this.registerObj1.IsMLC
      this.AdmissionID = this.registerObj1.AdmissionID;
      console.log(this.registerObj1);
     
     if (this.registerObj1.CompanyId > 0)
        this.isCompanySelected = true
    }
    if (this.registerObj1.RelatvieMobileNo)
      this.registerObj1.RelatvieMobileNo = this.registerObj1.RelatvieMobileNo.trim();
  }

  ngOnInit(): void {

    if (this.advanceDataStored.storage) {
      this.vRelativeName = this.registerObj1.RelativeName
      this.vRelativeAddress = this.registerObj1.RelativeAddress
      
      this.setDropdownObjs();
      
    }

    this.isAlive = true;


    this.filteredOptionsPatientType = this.hospitalFormGroup.get('PatientTypeID').valueChanges.pipe(
      startWith(''),
      map(value => this._filterPtype(value)),

    );

    this.filteredOptionsTarrif = this.hospitalFormGroup.get('TariffId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterTariffId(value)),

    );


    this.filteredOptionsDep = this.hospitalFormGroup.get('Departmentid').valueChanges.pipe(
      startWith(''),
      map(value => this._filterdept(value)),

    );

    this.filteredOptionsDoc = this.hospitalFormGroup.get('DoctorId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterDoctorId(value)),

    );
  

    this.filteredOptionsDoc1 = this.hospitalFormGroup.get('admittedDoctor1').valueChanges.pipe(
      startWith(''),
      map(value => this._filteradmittedDoctor1(value)),

    );

    this.filteredOptionsDoc2 = this.hospitalFormGroup.get('admittedDoctor2').valueChanges.pipe(
      startWith(''),
      map(value => this._filteradmittedDoctor2(value)),

    );

    this.filteredOptionsRefrenceDoc = this.hospitalFormGroup.get('refDoctorId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterrefDoctorId(value)),

    );

    this.filteredOptionsRelation = this.otherFormGroup.get('RelationshipId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterRelationshipId(value)),

    );

    this.filteredOptionsCompany = this.hospitalFormGroup.get('CompanyId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterCompany(value)),

    );

    this.filteredOptionsSubCompany = this.hospitalFormGroup.get('SubCompanyId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterSubCompany(value)),

    );

  }


  CheckMe() {
    debugger
    if (this.IsMLC)
      return true;
    else
      return false;
  }

  ngOnDestroys() {
    this.isAlive = false;
  }

  createHospitalForm() {
    return this.formBuilder.group({
      HospitalId: '',
      PatientTypeID: '',
      TariffId: '',
      DoctorId: '',
      DoctorID: '',
      Departmentid: '',
      CompanyId: '',
      SubCompanyId: '',
      admittedDoctor1: '',
      admittedDoctor2: '',
      refDoctorId: '',
    });
  }


  otherForm() {
    return this.formBuilder.group({
      RelativeName: '',
      RelativeAddress: '',
      RelatvieMobileNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      RelationshipId: '',
      IsMLC: [false],
      OPIPChange: [false],
      IsCharity: [false],
      IsSenior: [false],
      Citizen: [false],
      Emergancy: [false]
    });
  }


  // private _filteradmittedDoctor1(value: any): string[] {
  //   if (value) {
  //     const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
  //     return this.DoctorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
  //   }
  // }

  private _filteradmittedDoctor1(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.optionsAdDoc1.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    
    }

  }


  private _filteradmittedDoctor11(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.DoctorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }

  }

  private _filterrefDoctorId(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.RefDoctorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }



  private _filterRelationshipId(value: any): string[] {
    if (value) {
      const filterValue = value && value.RelationshipName ? value.RelationshipName.toLowerCase() : value.toLowerCase();
      return this.RelationshipList.filter(option => option.RelationshipName.toLowerCase().includes(filterValue));
    }
  }


  private _filterSubCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();
      return this.SubTPACompList.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
    }
  }


  private _filterCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();
      return this.CompanyList.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
    }
  }

  getCompanyList() {
    this._AdmissionService.getCompanyCombo().subscribe(data => {
      this.CompanyList = data;
      if (this.registerObj1) {
        const ddValue = this.CompanyList.filter(c => c.CompanyId == this.registerObj1.CompanyId);
        this.hospitalFormGroup.get('CompanyId').setValue(ddValue[0]);
        this.hospitalFormGroup.updateValueAndValidity();
        return;
      }

    });
  }



  getSubTPACompList() {
    this._AdmissionService.getSubTPACompCombo().subscribe(data => {
      this.SubTPACompList = data;
      if (this.registerObj1) {
        const ddValue = this.SubTPACompList.filter(c => c.CompanyId == this.registerObj1.SubCompanyId);
        this.hospitalFormGroup.get('SubCompanyId').setValue(ddValue[0]);
        this.hospitalFormGroup.updateValueAndValidity();
        return;
      }

    });
  }



  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
  }


  // DocNameID
  setDropdownObjs() {
    debugger
    const toSelect = this.DepartmentList.find(c => c.DepartmentId == this.registerObj1.DepartmentId);
    this.hospitalFormGroup.get('Departmentid').setValue(toSelect);
  
    const toSelect11 = this.DoctorList.find(c => c.DoctorId == this.registerObj1.DocNameID);
    this.hospitalFormGroup.get('DoctorId').setValue(toSelect11);
    debugger
    const toSelect1 = this.Doctor1List.find(c => c.DoctorId == this.registerObj1.AdmittedDoctor1ID);
    this.hospitalFormGroup.get('admittedDoctor1').setValue(toSelect1);

    const toSelect2 = this.Doctor2List.find(c => c.DoctorId == this.registerObj1.AdmittedDoctor2ID);
    this.hospitalFormGroup.get('admittedDoctor2').setValue(toSelect2);

    const toSelect3 = this.RefDoctorList.find(c => c.DoctorId == this.registerObj1.RefDoctorId);
    this.hospitalFormGroup.get('refDoctorId').setValue(toSelect3);

    const toSelect4 = this.CompanyList.find(c => c.CompanyId == this.registerObj1.CompanyId);
    this.hospitalFormGroup.get('CompanyId').setValue(toSelect4);

    const toSelect5 = this.SubTPACompList.find(c => c.CompanyId == this.registerObj1.SubCompanyId);
    this.hospitalFormGroup.get('SubCompanyId').setValue(toSelect5);


    const toSelect7 = this.RelationshipList.find(c => c.RelationshipId == this.registerObj1.RelationshipId);
    this.otherFormGroup.get('RelationshipId').setValue(toSelect7);


    // this.OnChangeDoctorList(this.registerObj1)
    
    this.hospitalFormGroup.updateValueAndValidity();
  }



  getOptionTextDep(option) {
    return option && option.DepartmentName ? option.DepartmentName : '';
  }

  getOptionTextRefDoc(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }
  getOptionTextAdDoc1(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }


  getOptionTextDoc(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }



  getOptionTextDoc2(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }


  getOptionTextRelationship(option) {

    return option && option.RelationshipName ? option.RelationshipName : '';
  }

  getOptionTextCompany(option) {
    return option && option.CompanyName ? option.CompanyName : '';
  }

  getOptionTextSubCompany(option) {

    return option && option.CompanyName ? option.CompanyName : '';
  }


  item1: any;
  item2: any;
  onClick(event: any) {
    this.item1 = "";
    event.stopPropagation();
  }



  getRelationshipList() {
    this._AdmissionService.getRelationshipCombo().subscribe(data => {
      this.RelationshipList = data;
      if (this.registerObj1) {
        const ddValue = this.RelationshipList.filter(c => c.RelationshipId == this.registerObj1.RelationshipId);
        this.otherFormGroup.get('RelationshipId').setValue(ddValue[0]);
        this.otherFormGroup.updateValueAndValidity();
        return;
      }
    });
  }



  getOptionTextpatienttype(option) {
    return option && option.PatientType ? option.PatientType : '';
  }

  getOptionTextTariff(option) {
    return option && option.TariffName ? option.TariffName : '';
  }



  getDepartmentList() {
    debugger
    this._AdmissionService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      if (this.registerObj1) {
        const ddValue = this.DepartmentList.filter(c => c.DepartmentId == this.registerObj1.DepartmentId);
        this.hospitalFormGroup.get('Departmentid').setValue(ddValue[0]);
        this.hospitalFormGroup.updateValueAndValidity();
        return;
      }
    });


  }

  private _filterdept(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      return this.DepartmentList.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }
  }

  getOptionTextsearchDoctor(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }



  getDoctorList() {
    debugger

    this._AdmissionService.getDoctorMasterNew().subscribe(data => {
      this.DoctorList = data;
      console.log(this.DoctorList)
      if (this.data) {
        const ddValue = this.DoctorList.filter(c => c.DoctorId == this.registerObj1.DocNameID);
        this.hospitalFormGroup.get('DoctorId').setValue(ddValue[0]);
        this.hospitalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }


  // getDoctor1List() {
  //   this._AdmissionService.getDoctorMaster1Combo().subscribe(data => {
  //     this.Doctor1List = data;
  //     if (this.registerObj1) {
  //       const ddValue = this.Doctor1List.filter(c => c.DoctorId == this.registerObj1.AdmittedDoctor1ID);
  //       this.hospitalFormGroup.get('admittedDoctor1').setValue(ddValue[0]);
  //       this.hospitalFormGroup.updateValueAndValidity();
  //       return;
  //     }
  //   });
  // }


  getDoctor1List() {
    this._AdmissionService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      this.optionsAdDoc1 = this.Doctor1List.slice();
      this.filteredOptionsDoc1 = this.hospitalFormGroup.get('admittedDoctor1').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filteradmittedDoctor1(value) : this.Doctor1List.slice()),
      );
    });
   
  }
  
  

  getDoctor2List() {
    this._AdmissionService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      if (this.registerObj1) {
        const ddValue = this.Doctor2List.filter(c => c.DoctorId == this.registerObj1.AdmittedDoctor2ID);
        this.hospitalFormGroup.get('admittedDoctor2').setValue(ddValue[0]);
        this.hospitalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }

  getRefDoctorList() {
    debugger
    this._AdmissionService.getDoctorMaster2Combo().subscribe(data => {
      this.RefDoctorList = data;
      console.log(this.RefDoctorList);
      if (this.registerObj1) {
        const ddValue = this.RefDoctorList.filter(c => c.DoctorId == this.registerObj1.RefDocNameId);
        this.hospitalFormGroup.get('refDoctorId').setValue(ddValue[0]);
        this.hospitalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }


  private _filterDoctorId(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.DoctorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }



  private _filteradmittedDoctor2(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.Doctor2List.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }



  private _filterRefdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.RefDoctorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }
  //new code

  private _filterPtype(value: any): string[] {
    if (value) {
      const filterValue = value && value.PatientType ? value.PatientType.toLowerCase() : value.toLowerCase();
      return this.PatientTypeList.filter(option => option.PatientType.toLowerCase().includes(filterValue));
    }
  }

  getPtypeCombo() {
    this._AdmissionService.getPatientTypeCombo().subscribe(data => {
      this.PatientTypeList = data;
      if (this.registerObj1) {
        const ddValue = this.PatientTypeList.filter(c => c.PatientTypeId == this.registerObj1.PatientTypeID);
        this.hospitalFormGroup.get('PatientTypeID').setValue(ddValue[0]);
        this.hospitalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }

  getptypeCombo() {
    this._AdmissionService.getPatientTypeCombo().subscribe(data => {
      this.PatientTypeList = data;
      this.optionsPatientType = this.PatientTypeList.slice();
      this.filteredOptionsPatientType = this.hospitalFormGroup.get('PatientTypeID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterPtype(value) : this.PatientTypeList.slice()),
      );
    });
  }






  private _filterTariffId(value: any): string[] {
    if (value) {
      const filterValue = value && value.TariffName ? value.TariffName.toLowerCase() : value.toLowerCase();
      return this.TariffList.filter(option => option.TariffName.toLowerCase().includes(filterValue));
    }
  }

  getTariffCombo() {
    this._AdmissionService.getTariffCombo().subscribe(data => {
      this.TariffList = data;
      if (this.registerObj1) {
        const ddValue = this.TariffList.filter(c => c.TariffId == this.registerObj1.TariffId);
        this.hospitalFormGroup.get('TariffId').setValue(ddValue[0]);
        this.hospitalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }


  OnChangeDoctorList(departmentObj) {
    debugger
  
    this.hospitalFormGroup.get('DoctorId').reset();
    this.isDepartmentSelected = true;
    this._AdmissionService.getDoctorMasterCombo(departmentObj.DepartmentId).subscribe(
      data => {
        this.DoctorList = data;
     
        return;
      });
      this.filteredOptionsDoc = this.hospitalFormGroup.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => this._filterDoctorId(value)),
  
      );
  
  }


  onChangePatient(value) {
    if (value.PatientTypeId != 2) {
      this.isCompanySelected = false;
      this.hospitalFormGroup.get('CompanyId').clearValidators();
      this.hospitalFormGroup.get('SubCompanyId').clearValidators();
      this.hospitalFormGroup.get('CompanyId').updateValueAndValidity();
      this.hospitalFormGroup.get('SubCompanyId').updateValueAndValidity();

      this.patienttype = 1;

    }
    if (value.PatientTypeId == 2) {
      this.isCompanySelected = true;
      this.hospitalFormGroup.get('CompanyId').reset();
      this.hospitalFormGroup.get('CompanyId').setValidators([Validators.required]);
      this.hospitalFormGroup.get('SubCompanyId').setValidators([Validators.required]);
      this.patienttype = 2;

    }

    // if (value.PatientTypeId == 2) {
    //   this.patienttype = 2;
    // } else if (value.PatientTypeId !== 2) {
    //   this.patienttype = 1;
    // }
  }

  onReset() {
    this.hospitalFormGroup.reset();


    this.hospitalFormGroup = this.createHospitalForm();
    this.hospitalFormGroup.markAllAsTouched();


    this.otherFormGroup = this.otherForm();
    this.otherFormGroup.markAllAsTouched()

    this.getTariffCombo();
    this.getPtypeCombo();
    this.getDepartmentList();
    // this.getRelationshipList();

    // this.getDoctorList();
    // this.getDoctor1List();
    // this.getDoctor2List();

    // this.getCompanyList();
    // this.getSubTPACompList();

    this.isCompanySelected = false;
    this.hospitalFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
    this.hospitalFormGroup.get('CompanyId').clearValidators();
    this.hospitalFormGroup.get('SubCompanyId').clearValidators();
    this.hospitalFormGroup.get('CompanyId').updateValueAndValidity();
    this.hospitalFormGroup.get('SubCompanyId').updateValueAndValidity();


  }



  patienttype: any = 1;
  CompanyId: any = 0;
  SubCompanyId: any = 0;

  onNewSave() {

    if (!this.TariffList.some(item => item.TariffName === this.hospitalFormGroup.get('TariffId').value.TariffName)) {
      this.toastr.warning('Please Select valid TariffName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (!this.DepartmentList.some(item => item.departmentName === this.hospitalFormGroup.get('Departmentid').value.departmentName)) {
      this.toastr.warning('Please Select valid departmentName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.DoctorList.some(item => item.Doctorname === this.hospitalFormGroup.get('DoctorId').value.Doctorname)) {
      this.toastr.warning('Please Select valid Doctorname', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.hospitalFormGroup.get('admittedDoctor1').value) {
      if (!this.Doctor1List.some(item => item.Doctorname === this.hospitalFormGroup.get('admittedDoctor1').value.Doctorname)) {
        this.toastr.warning('Please Select valid AdmitDoctorName11', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.hospitalFormGroup.get('admittedDoctor2').value) {
      if (!this.Doctor2List.some(item => item.Doctorname === this.hospitalFormGroup.get('admittedDoctor2').value.Doctorname)) {
        this.toastr.warning('Please Select valid AdmitDoctorName2', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.hospitalFormGroup.get('refDoctorId').value) {
      if (!this.Doctor1List.some(item => item.Doctorname === this.hospitalFormGroup.get('refDoctorId').value.Doctorname)) {
        this.toastr.warning('Please Select valid RefDoctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.otherFormGroup.get('RelationshipId').value) {
      if (!this.RelationshipList.some(item => item.RelationshipName === this.otherFormGroup.get('RelationshipId').value.RelationshipName)) {
        this.toastr.warning('Please Select valid RelationshipName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.hospitalFormGroup.get('CompanyId').value) {
      if (!this.CompanyList.some(item => item.CompanyName === this.hospitalFormGroup.get('CompanyId').value.CompanyName)) {
        this.toastr.warning('Please Select valid CompanyName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.hospitalFormGroup.get('SubCompanyId').value) {
      if (!this.SubTPACompList.some(item => item.CompanyName === this.hospitalFormGroup.get('SubCompanyId').value.CompanyName)) {
        this.toastr.warning('Please Select valid SubCompany', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    } debugger
    if (this.otherFormGroup.get('RelationshipId').value) {
      this.vRelationshipId = this.otherFormGroup.get('RelationshipId').value.RelationshipId;

    }
    if (this.hospitalFormGroup.get('admittedDoctor1').value) {
      this.vadmittedDoctor1 = this.hospitalFormGroup.get('admittedDoctor1').value.DoctorId;
      console.log(this.vadmittedDoctor1)

    }
    if (this.hospitalFormGroup.get('admittedDoctor2').value) {
      this.vadmittedDoctor2 = this.hospitalFormGroup.get('admittedDoctor2').value.DoctorId;
      console.log(this.vadmittedDoctor2)
    } if (this.hospitalFormGroup.get('refDoctorId').value) {
      this.vrefDoctorId = this.hospitalFormGroup.get('refDoctorId').value.DocNameId;
      console.log(this.vrefDoctorId)
    }

    if (this.patienttype != 2) {
      this.CompanyId = 0;
      this.SubCompanyId = 0;
    } else if (this.patienttype == 2) {

      this.CompanyId = this.hospitalFormGroup.get('CompanyId').value.CompanyId;
      this.SubCompanyId = this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId;

      if ((this.CompanyId == 0 || this.CompanyId == undefined || this.SubCompanyId == 0)) {
        this.toastr.warning('Please select Company.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    debugger
    var m_data = {
      "admissionNewUpdate": {
        "AdmissionId": this.AdmissionID,// this.hospitalFormGroup.get('AdmissionId').value || 0,
        "AdmissionDate": this.dateTimeObj.date,// this.hospitalFormGroup.get('AdmissionDate').value || "2021-03-31",
        "AdmissionTime": this.dateTimeObj.time,//this.personalFormGroup.get('AppTime').value || "2021-03-31",
        "PatientTypeId": this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeId || 0,
        "HospitalId": this.registerObj1.HospitalId || 1,
        "CompanyId": this.CompanyId, //this.hospitalFormGroup.get('CompanyId').value.CompanyId || 0,
        "TariffId": this.hospitalFormGroup.get('TariffId').value.TariffId || 0,
        "DepartmentId": this.hospitalFormGroup.get('Departmentid').value.DepartmentId || 0,
        "AdmittedNameID": this.hospitalFormGroup.get('DoctorId').value.DoctorId || 0,
        "RelativeName": this.otherFormGroup.get('RelativeName').value || "",
        "RelativeAddress": this.otherFormGroup.get('RelativeAddress').value || "",
        "RelativePhoneNo": this.otherFormGroup.get('RelatvieMobileNo').value || "",
        "RelationshipId": this.vRelationshipId,// this.otherFormGroup.get('RelationshipId').value.RelationshipId || 0,
        "IsMLC": this.otherFormGroup.get('IsMLC').value || 0,
        "MotherName": '',// this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId || 0,
        "AdmittedDoctor1": this.vadmittedDoctor1,//this.hospitalFormGroup.get('admittedDoctor1').value.DoctorID || 0,
        "AdmittedDoctor2": this.vadmittedDoctor2,// this.hospitalFormGroup.get('admittedDoctor2').value.DoctorID || 0,
        "RefByTypeId": 0,// this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId || 0,
        "RefByName": 0,// this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId || 0,
        "isUpdatedBy": this.accountService.currentUserValue.userId,
        "SubTpaComId": this.SubCompanyId,// this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId || 0,
        "isOpToIPConv": 0
      }

    }
    console.log(m_data)

    this._AdmissionService.AdmissionUpdate(m_data).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'Admission Data Updated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();

          }
        });
      } else {
        Swal.fire('Error !', 'Admission Data  not Updated', 'error');
      }
      // this.isLoading = '';

    });

  }

  Close() {
    this.dialogRef.close();
  }
  onClose() {

    this.searchFormGroup.get('RegId').reset();
    this.searchFormGroup.get('RegId').disable();


    this.isCompanySelected = false;
    this.hospitalFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
    this.hospitalFormGroup.get('CompanyId').clearValidators();
    this.hospitalFormGroup.get('SubCompanyId').clearValidators();
    this.hospitalFormGroup.get('CompanyId').updateValueAndValidity();
    this.hospitalFormGroup.get('SubCompanyId').updateValueAndValidity();
    this.patienttype = 1;

  }



  onDoctorOneChange(value) {

  }



  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }



  getAdmittedPatientCasepaperview(AdmissionId, flag) {
    this.sIsLoading = 'loading-data';

    let AdmissionID
    if (flag) {
      AdmissionID = AdmissionId
    } else {
      AdmissionID = AdmissionId.AdmissionID
    }

    setTimeout(() => {
      this.SpinLoading = true;
      this.AdList = true;
      this._AdmissionService.getAdmittedPatientCasepaaperView(
        AdmissionID
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Admission Paper  Viewer"
            }
          });

        matDialog.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = ' ';
        });
      });

    }, 100);
}



  onClear() {
    this._AdmissionService.myFilterform.reset(
      {
        start: [],
        end: []
      }
    );
  }

  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._AdmissionService.myFilterform.controls; }



  @ViewChild('admitdoc1') admitdoc1: ElementRef;
  @ViewChild('ptype') ptype: ElementRef;
  @ViewChild('tariff') tariff: ElementRef;
  // @ViewChild('ptype') ptype: MatSelect;
  // @ViewChild('tariff') tariff: MatSelect;
  @ViewChild('dept') dept: ElementRef;
  @ViewChild('deptdoc') deptdoc: ElementRef;
  @ViewChild('refdoc') refdoc: ElementRef;
  @ViewChild('admitdoc2') admitdoc2: ElementRef;
  @ViewChild('admitdoc3') admitdoc3: MatSelect;


  @ViewChild('ward') ward: ElementRef;

  @ViewChild('relativename') relativename: ElementRef;
  @ViewChild('relativeadd') relativeadd: ElementRef;
  @ViewChild('relativemobile') relativemobile: ElementRef;
  @ViewChild('relation') relation: ElementRef;
  @ViewChild('regno') regno: ElementRef;



  add: boolean = false;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;



  public onEnterptype(event): void {
    if (event.which === 13) {

      // if (value == undefined) {
      //   this.toastr.warning('Please Enter Valid PType.', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   });
      //   return;
      // } else {
      this.tariff.nativeElement.focus();

      // }
    }
  }


  public onEnterptariff(event): void {
    if (event.which === 13) {

      // if (value == undefined) {
      //   this.toastr.warning('Please Enter Valid Tariff.', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   });
      //   return;
      // } else {
      this.dept.nativeElement.focus();

      // }
    }
  }

  public onEnterdept(event): void {
    if (event.which === 13) {
           this.deptdoc.nativeElement.focus();
     
    }
  }




  public onEnterdeptdoc(event): void {
    if (event.which === 13) {
     
      this.admitdoc1.nativeElement.focus();
     
    }

  }


  public onEnteradmitdoc1(event): void {
    if (event.which === 13) {

      this.admitdoc2.nativeElement.focus();

    }
  }
  public onEnteradmitdoc2(event): void {
    if (event.which === 13) {

      this.refdoc.nativeElement.focus();

    }
  }
  public onEnterrefdoc(event): void {
    if (event.which === 13) {

      this.ward.nativeElement.focus();

    }
  }

  public onEnterclass(event): void {
    if (event.which === 13) {

      this.relativename.nativeElement.focus();
    }
  }
  public onEnterrelativename(event): void {
    if (event.which === 13) {

      this.relativeadd.nativeElement.focus();
    }
  }

  public onEnterrelativeadd(event): void {
    if (event.which === 13) {

      this.relativemobile.nativeElement.focus();
    }
  }

  public onEnterrelativemobile(event): void {
    if (event.which === 13) {
      this.relation.nativeElement.focus();

    }
  }

  public onEnterrelationship(event): void {
    if (event.which === 13) {

      // this.registration.nativeElement.focus();
    }
  }






}

