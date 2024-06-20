import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdmissionService } from '../admission.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel, Editdetail } from '../admission.component';
import { fuseAnimations } from '@fuse/animations';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-admission',
  templateUrl: './edit-admission.component.html',
  styleUrls: ['./edit-admission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditAdmissionComponent implements OnInit {

  hospitalFormGroup: FormGroup;
  otherFormGroup: FormGroup;
  
  dateTimeObj: any;
  isCompanySelected: boolean = false;
  registerObj = new AdmissionPersonlModel({});
  HospitalList: any = [];
  TariffList: any = [];
  DepartmentList: any = [];
  PatientTypeList: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  RelationshipList: any = [];
  CompanyList: any = [];
  SubTPACompList: any = [];
  DepartmentID: any = [];
  RefDoctorList: any = [];
  AdmissionID: any;
  AdmittedDoc1: any;
  DoctorId: any;
  PatientName: any;
  AdmissionDate: any;
  RelativeName: any;
  RelativeAddress: any;
  RelatvieMobileNo: any;
  selectedAdvanceObj: AdvanceDetailObj;
  registerObj1: AdmissionPersonlModel;
  screenFromString = 'admission-form';
  AdmittedDoc2:any;
  searchDoctorList: any = [];
  optionsSearchDoc: any[] = [];


  isAdmittedDoctor1Selected: boolean = false;
  isAdmittedDoctor2Selected: boolean = false;
  isRefDoctorSelected: boolean = false;
  isDoctorSelected: boolean = false;
  isCompanyselected: boolean = false;
  isSubCompanySelected: boolean = false;
  isDepartmentSelected: boolean = false;
  isRelationshipSelected: boolean = false;
  isTariffIdSelected: boolean = false;
  ispatienttypeSelected: boolean = false;


  optionsDep: any[] = [];
  optionsDoc: any[] = [];
  optionsDoc2: any[] = [];
  optionsRefDoc: any[] = [];
  optionsCompany: any[] = [];
  optionsSubCompany: any[] = [];
  optionsRelation: any[] = [];
  optionsRefDoc2: any[] = [];
  optionsPatientType: any[] = [];
  optionsTariff: any[] = [];
  RefoptionsDoc: any[] = [];

  filteredOptionsTarrif: Observable<string[]>;
  filteredOptionsDep: Observable<string[]>;
   filteredOptionsDoc: Observable<string[]>;
  filteredOptionsRefDoc: Observable<string[]>;
  filteredOptionsCompany: Observable<string[]>;
  filteredOptionsSubCompany: Observable<string[]>;
  filteredOptionsRelation: Observable<string[]>;
  filteredOptionsDoc2: Observable<string[]>;
  filteredOptionssearchDoctor: Observable<string[]>;
  filteredOptionsPatientType: Observable<string[]>;
  filteredOptionsRefrenceDoc: Observable<string[]>;


  // filteredOptionsDep: any;


  vRelationshipId: any = 0;
  vDepartmentid: any = 0;
  vCompanyId: any = 0;
  vSubCompanyId: any = 0;
  vadmittedDoctor1: any = 0;
  vadmittedDoctor2: any = 0;
  vrefDoctorId: any = 0;
  vPatientTypeID: any = 0;
  vTariffId: any = 0;
  vDoctorId: any = 0;
  vDoctorID: any = 0;
  patienttype: any = 1;
  CompanyId: any = 0;
  SubCompanyId: any = 0;


  constructor(
    public _AdmissionService: AdmissionService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<EditAdmissionComponent>,
    private router: Router,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored) {
      this.hospitalFormGroup = this.createHospitalForm();
      this.otherFormGroup = this.otherForm();
      this.getDepartmentList();
     }

  ngOnInit(): void {
   
  
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
      
    }
    this.getPatientTypeList();
    this.getTariffList();
    this.getDepartmentList();
    this.getRelationshipList();
    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();
    this.getRefDoctorList();
    this.getCompanyList();
    this.getSubTPACompList();

    if (this.data) {

      this.registerObj1 = this.data.registerObj;
      this.AdmissionID = this.registerObj1.AdmissionID;
      this.PatientName = this.registerObj1.PatientName;
      
      console.log(this.registerObj1);
      this.getDepartmentList();
      this.setDropdownObjs();
    }

    this.filteredOptionsDep = this.hospitalFormGroup.get('Departmentid').valueChanges.pipe(
      startWith(''),
      map(value => this._filterDep(value)),

    );
       
    
  }

  get f() {
    return this.hospitalFormGroup.controls;
  }
  setDropdownObjs() {
debugger;

    this.registerObj1.AdmissionDate=new Date();
    console.log(this.registerObj1)
   
    const toSelect = this.DepartmentList.find(c => c.Departmentid == this.registerObj1.DepartmentId);
    this.hospitalFormGroup.get('Departmentid').setValue(toSelect);

    const toSelectDoc1 = this.DoctorList.find(c => c.DoctorId == this.registerObj1.DoctorId);
    this.hospitalFormGroup.get('DoctorId').setValue(toSelectDoc1);

    // const toSelectDoc2 = this.Doctor1List.find(c => c.DoctorID == this.registerObj1.AdmittedDoctor1ID);
    // this.hospitalFormGroup.get('AdmittedDoctorId1').setValue(toSelectDoc2);

    // const toSelectDoc3 = this.Doctor2List.find(c => c.DoctorID == this.registerObj1.AdmittedDoctor2ID);
    // this.hospitalFormGroup.get('AdmittedDoctor2').setValue(toSelectDoc3);


    // const toSelectRelation = this.RelationshipList.find(c => c.RelationshipId == this.registerObj1.RelationshipId);
    // this.otherFormGroup.get('RelationshipId').setValue(toSelectRelation);


    // const toSelectPatientTypeId = this.PatientTypeList.find(c => c.PatientTypeID == this.registerObj1.PatientTypeID);
    // this.otherFormGroup.get('PatientTypeID').setValue(toSelectPatientTypeId);


    // const toSelectCompanyId = this.CompanyList.find(c => c.CompanyId == this.registerObj1.CompanyId);
    // this.hospitalFormGroup.get('CompanyId').setValue(toSelectCompanyId);

    
    // const toSelectSubCompTpa = this.SubTPACompList.find(c => c.SubCompanyId == this.registerObj1.SubCompanyId);
    // this.hospitalFormGroup.get("SubCompanyId").setValue(toSelectSubCompTpa);

    this.hospitalFormGroup.updateValueAndValidity();

    
    if (this.registerObj.PatientTypeID == 2) {
      this.hospitalFormGroup.get('CompanyId').clearValidators();
      this.hospitalFormGroup.get('SubCompanyId').clearValidators();
      this.hospitalFormGroup.get('CompanyId').updateValueAndValidity();
      this.hospitalFormGroup.get('SubCompanyId').updateValueAndValidity();
      this.isCompanySelected = true;
    } else {
      this.hospitalFormGroup.get('CompanyId').setValidators([Validators.required]);
      // this.VisitFormGroup.get('SubCompanyId').setValidators([Validators.required]);
      this.isCompanySelected = false;
    }
  }

  

  createHospitalForm() {
    return this.formBuilder.group({
      HospitalId:'',
      PatientTypeID:'',
      TariffId: '',
      DoctorId: '',
      DoctorID: '',
      Departmentid: '',
      CompanyId:'',
      SubCompanyId:'',
      admittedDoctor1: '',
      admittedDoctor2:'',
      refDoctorId:'',
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

  // getDepartmentList() {
  //   this._AdmissionService.getDepartmentCombo().subscribe(data => {
  //     this.DepartmentList = data;
  //     this.optionsDep = this.DepartmentList.slice();
  //     this.filteredOptionsDep = this.hospitalFormGroup.get('Departmentid').valueChanges.pipe(
  //       startWith(''),
  //       map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
  //     );

  //   });
  // }
  
  
  

  getDepartmentList() {
    this._AdmissionService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      if (this.data) {
        const ddValue = this.DepartmentList.filter(c => c.Departmentid == this.registerObj1.Departmentid);
        this.hospitalFormGroup.get('Departmentid').setValue(ddValue[0]);
        this.hospitalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterDept(value: any): string[] {
    if (value) {
      const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
      return this.DepartmentList.filter(option => option.departmentName.toLowerCase().includes(filterValue));
    }
  }

 

  OnChangeDoctorList(departmentObj) {
    this.isDepartmentSelected = true;
    this._AdmissionService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
      data => {
        this.DoctorList = data;
        this.optionsDoc = this.DoctorList.slice();
        this.filteredOptionsDoc = this.hospitalFormGroup.get('DoctorId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
        );
      })
  }

  private _filterDoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      this.isDoctorSelected = false;
      return this.optionsDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }

  }
  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
      return this.optionsDep.filter(option => option.departmentName.toLowerCase().includes(filterValue));
    }

  }
  // private _filterDep(value: any): string[] {
  //   if (value) {
  //     const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
  //     return this.DepartmentList.filter(option => option.departmentName.toLowerCase().includes(filterValue));
  //   }
  // }


  getPatientTypeList() {
    this._AdmissionService.getPatientTypeCombo().subscribe(data => {
      this.PatientTypeList = data;
      this.optionsPatientType = this.PatientTypeList.slice();
      this.filteredOptionsPatientType = this.hospitalFormGroup.get('PatientTypeID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterPatientType(value) : this.PatientTypeList.slice()),
      );

    });
    this.hospitalFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
  }

  private _filterPatientType(value: any): string[] {
    if (value) {
      const filterValue = value && value.PatientType ? value.PatientType.toLowerCase() : value.toLowerCase();

      return this.optionsPatientType.filter(option => option.PatientType.toLowerCase().includes(filterValue));

    }

  }
  getTariffList() {
    this._AdmissionService.getTariffCombo().subscribe(data => {
      this.TariffList = data;
      this.optionsTariff = this.TariffList.slice();
      this.filteredOptionsTarrif = this.hospitalFormGroup.get('TariffId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterTariff(value) : this.TariffList.slice()),
      );

    });
    this.hospitalFormGroup.get('TariffId').setValue(this.TariffList[0]);
  }
  private _filterTariff(value: any): string[] {
    if (value) {
      const filterValue = value && value.TariffName ? value.TariffName.toLowerCase() : value.toLowerCase();

      return this.optionsTariff.filter(option => option.TariffName.toLowerCase().includes(filterValue));
    }

  }

  getRelationshipList() {
    this._AdmissionService.getRelationshipCombo().subscribe(data => {
      this.RelationshipList = data;
      this.optionsRelation = this.RelationshipList.slice();
      this.filteredOptionsRelation = this.otherFormGroup.get('RelationshipId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterRelationship(value) : this.RelationshipList.slice()),

      );
    });
  }
  private _filterRelationship(value: any): string[] {
    if (value) {
      const filterValue = value && value.RelationshipName ? value.RelationshipName.toLowerCase() : value.toLowerCase();
      return this.optionsRelation.filter(option => option.RelationshipName.toLowerCase().includes(filterValue));
    }

  }

  getDoctorList() {
    this._AdmissionService.getDoctorMaster().subscribe(data => {
      this.searchDoctorList = data;
      this.optionsSearchDoc = this.searchDoctorList.slice();
      this.filteredOptionssearchDoctor = this._AdmissionService.myFilterform.get('searchDoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSearchdoc(value) : this.searchDoctorList.slice()),
      );
    });
  }

  private _filterSearchdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsSearchDoc.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }
  
  getDoctor1List() {
    this._AdmissionService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      this.optionsRefDoc = this.Doctor1List.slice();
      this.filteredOptionsRefDoc = this.hospitalFormGroup.get('admittedDoctor1').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterRefdoc(value) : this.Doctor1List.slice()),
      );
    });
  }

  private _filterRefdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsRefDoc.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  getDoctor2List() {
    this._AdmissionService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      this.optionsDoc2 = this.Doctor2List.slice();
      this.filteredOptionsDoc2 = this.hospitalFormGroup.get('admittedDoctor2').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterRefdoc2(value) : this.Doctor2List.slice()),
      );

    });
  }

  getRefDoctorList() {
    this._AdmissionService.getDoctorMaster2Combo().subscribe(data => {
      this.RefDoctorList = data;
      this.RefoptionsDoc = this.RefDoctorList.slice();
      this.filteredOptionsRefrenceDoc = this.hospitalFormGroup.get('refDoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterReferdoc(value) : this.RefDoctorList.slice()),
      );

    });
  }
  private _filterReferdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.RefoptionsDoc.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  private _filterRefdoc2(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsRefDoc2.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  getCompanyList() {
    this._AdmissionService.getCompanyCombo().subscribe(data => {
      this.CompanyList = data;
      this.optionsCompany = this.CompanyList.slice();
      this.filteredOptionsCompany = this.hospitalFormGroup.get('CompanyId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCompany(value) : this.CompanyList.slice()),
      );

    });
  }


  private _filterSubCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();
      return this.optionsCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
    }

  }

  private _filterCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();
      return this.optionsCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
    }

  }

  getSubTPACompList() {
    this._AdmissionService.getSubTPACompCombo().subscribe(data => {
      this.SubTPACompList = data;
      this.optionsSubCompany = this.SubTPACompList.slice();
      this.filteredOptionsSubCompany = this.hospitalFormGroup.get('SubCompanyId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSubCompany(value) : this.SubTPACompList.slice()),
      );

    });
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

  getOptionTextDep(option) {
    return option && option.departmentName ? option.departmentName : '';
  }

  getOptionTextRefDoc(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextAdmitDoc1(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }

  
  getOptionTextDoc(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

  getOptionTextDoc2(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextTariff(option) {
    return option && option.TariffName ? option.TariffName : '';
  }

  getOptionTextpatienttype(option) {
    return option && option.PatientType ? option.PatientType : '';
  }

  @ViewChild('admitdoc1') admitdoc1: ElementRef;
  @ViewChild('ptype') ptype: ElementRef;
  @ViewChild('tariff') tariff: ElementRef;
  @ViewChild('dept') dept: ElementRef;
  @ViewChild('deptdoc') deptdoc: ElementRef;
  @ViewChild('refdoc') refdoc: ElementRef;
  @ViewChild('admitdoc2') admitdoc2: ElementRef;
  @ViewChild('admitdoc3') admitdoc3: MatSelect;

  @ViewChild('relativename') relativename: ElementRef;
  @ViewChild('relativeadd') relativeadd: ElementRef;
  @ViewChild('relativemobile') relativemobile: ElementRef;
  @ViewChild('relation') relation: ElementRef;
  
  public onEnterptype(event, value): void {
    if (event.which === 13) {

      if (value == undefined) {
        this.toastr.warning('Please Enter Valid PType.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else {
        this.tariff.nativeElement.focus();

      }
    }
  }


  public onEnterptariff(event, value): void {
    if (event.which === 13) {

      if (value == undefined) {
        this.toastr.warning('Please Enter Valid Tariff.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else {
        this.dept.nativeElement.focus();

      }
    }
  }

  public onEnterdept(event,value): void {
    if (event.which === 13) {
      if (value == undefined) {
        this.toastr.warning('Please Enter Valid Department.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else {
        this.deptdoc.nativeElement.focus();
      }
    }
  }




  public onEnterdeptdoc(event, value): void {
    if (event.which === 13) {
      if (value == undefined) {
        this.toastr.warning('Please Enter Valid Doctor.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else {
        this.admitdoc1.nativeElement.focus();
      }
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

      // this.ward.nativeElement.focus();
      
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

  
  onChangePatient(value) {

    if (value.PatientTypeId !== 1) {
      this.hospitalFormGroup.get('CompanyId').clearValidators();
      this.hospitalFormGroup.get('SubCompanyId').clearValidators();
      this.hospitalFormGroup.get('CompanyId').updateValueAndValidity();
      this.hospitalFormGroup.get('SubCompanyId').updateValueAndValidity();
      this.isCompanySelected = true;
    } else if (value.PatientTypeId == 2) {
      this.hospitalFormGroup.get('CompanyId').reset();
      this.hospitalFormGroup.get('CompanyId').setValidators([Validators.required]);
      this.hospitalFormGroup.get('SubCompanyId').setValidators([Validators.required]);

      this.isCompanySelected = false;
    }

    if (value.PatientTypeId == 2) {
      this.patienttype = 2;
    } else if (value.PatientTypeId !== 2) {
      this.patienttype = 1;
    }
  }

  onReset() {}

  onClose() {
    this.dialogRef.close();
  }

  onNewSave() {
  
    if(!this.TariffList.some(item => item.TariffName ===this.hospitalFormGroup.get('TariffId').value.TariffName)){
      this.toastr.warning('Please Select valid TariffName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
   
    if(!this.DepartmentList.some(item => item.departmentName ===this.hospitalFormGroup.get('Departmentid').value.departmentName)){
      this.toastr.warning('Please Select valid departmentName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(!this.DoctorList.some(item => item.Doctorname ===this.hospitalFormGroup.get('DoctorId').value.Doctorname)){
      this.toastr.warning('Please Select valid Doctorname', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this.hospitalFormGroup.get('admittedDoctor1').value){
      if(!this.Doctor1List.some(item => item.DoctorName ===this.hospitalFormGroup.get('admittedDoctor1').value.DoctorName)){
        this.toastr.warning('Please Select valid AdmitDoctorName11', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if(this.hospitalFormGroup.get('admittedDoctor2').value){
      if(!this.Doctor2List.some(item => item.DoctorName ===this.hospitalFormGroup.get('admittedDoctor2').value.DoctorName)){
        this.toastr.warning('Please Select valid AdmitDoctorName2', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if(this.hospitalFormGroup.get('refDoctorId').value){
      if(!this.Doctor1List.some(item => item.DoctorName ===this.hospitalFormGroup.get('refDoctorId').value.DoctorName)){
        this.toastr.warning('Please Select valid RefDoctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if(this.otherFormGroup.get('RelationshipId').value){
      if(!this.RelationshipList.some(item => item.RelationshipName ===this.otherFormGroup.get('RelationshipId').value.RelationshipName)){
        this.toastr.warning('Please Select valid RelationshipName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if(this.hospitalFormGroup.get('CompanyId').value){
      if(!this.CompanyList.some(item => item.CompanyName ===this.hospitalFormGroup.get('CompanyId').value.CompanyName)){
        this.toastr.warning('Please Select valid CompanyName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if(this.hospitalFormGroup.get('SubCompanyId').value){
      if(!this.SubTPACompList.some(item => item.CompanyName ===this.hospitalFormGroup.get('SubCompanyId').value.CompanyName)){
        this.toastr.warning('Please Select valid SubCompany', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    var m_data = {
      "admissionNewUpdate": {
        "AdmissionId": this.AdmissionID,// this.hospitalFormGroup.get('AdmissionId').value || 0,
        "AdmissionDate": this.dateTimeObj.date,// this.hospitalFormGroup.get('AdmissionDate').value || "2021-03-31",
        "AdmissionTime": this.dateTimeObj.time,//this.personalFormGroup.get('AppTime').value || "2021-03-31",
         "PatientTypeId": this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeId || 0,
         "HospitalId":0,
        "CompanyId":this.hospitalFormGroup.get('CompanyId').value.CompanyId || 0,
        "TariffId": this.hospitalFormGroup.get('TariffId').value.TariffId || 0,
        "DepartmentId": this.hospitalFormGroup.get('Departmentid').value.Departmentid || 0,
        "AdmittedNameID": this.hospitalFormGroup.get('admittedDoctor1').value.DoctorId  || 0,
        "RelativeName": this.otherFormGroup.get('RelativeName').value || "",
        "RelativeAddress": this.otherFormGroup.get('RelativeAddress').value || "",
        "RelativePhoneNo": this.otherFormGroup.get('RelatvieMobileNo').value || "",
        "RelationshipId": this.otherFormGroup.get('RelationshipId').value.RelationshipId || 0,
        "IsMLC" : this.otherFormGroup.get('IsMLC').value || 0,
        "MotherName" :'',// this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId || 0,
        "AdmittedDoctor1": this.hospitalFormGroup.get('admittedDoctor1').value.DoctorID || 0,
        "AdmittedDoctor2": this.hospitalFormGroup.get('admittedDoctor2').value.DoctorID || 0,
        "RefByTypeId" :0,// this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId || 0,
        "RefByName" :0,// this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId || 0,
        "isUpdatedBy" :  this.accountService.currentUserValue.user.id,
        "SubTpaComId" : this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId || 0,
        "isOpToIPConv":0
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



  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }



  //   triggerClick() {
  //     let el: HTMLElement = this.myButton.nativeElement as HTMLElement;
  //     setTimeout(()=> el.click(), 5000);
  // }


}
// exec update_Admission_new 10,'','',1,1,1,1,1,'','','',1,1,'',1,1,1,1,1,1
