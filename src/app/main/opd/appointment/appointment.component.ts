import { Component, Inject, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { RegistrationService } from "../registration/registration.service";
import { DatePipe, Time } from "@angular/common";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AppointmentSreviceService } from "./appointment-srevice.service";
// import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { NewAppointmentComponent } from "./new-appointment/new-appointment.component";
import { fuseAnimations } from "@fuse/animations";
import { NewRegistrationComponent } from "../registration/new-registration/new-registration.component";
import { EditConsultantDoctorComponent } from "./edit-consultant-doctor/edit-consultant-doctor.component";
import { EditRefraneDoctorComponent } from "./edit-refrane-doctor/edit-refrane-doctor.component";
import { EditRegistrationComponent } from "../registration/edit-registration/edit-registration.component";
import { CasepaperVisitDetails } from "../op-search-list/op-casepaper/op-casepaper.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { PatientAppointmentComponent } from "./patient-appointment/patient-appointment.component";
import { ImageViewComponent } from "./image-view/image-view.component";
import { CameraComponent } from "./camera/camera.component";
import { map, startWith, takeUntil } from "rxjs/operators";
import { OPBillingComponent } from "../op-search-list/op-billing/op-billing.component";
import { SearchInforObj } from "../op-search-list/opd-search-list/opd-search-list.component";
import { AdvanceDataStored } from "app/main/ipd/advance";
import { OPIPPatientModel } from "../op-search-list/search-page/search-page.component";
import { MatStepper } from "@angular/material/stepper";
import { AuthenticationService } from "app/core/services/authentication.service";


export class DocData {
    doc: any;
    type: string = '';
  };
  

@Component({
    selector: "app-appointment",
    templateUrl: "./appointment.component.html",
    styleUrls: ["./appointment.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AppointmentComponent implements OnInit {
    msg: any;
    sIsLoading: string = "";
    // isLoading = true;
    isRateLimitReached = false;
    hasSelectedContacts: boolean;
    currentDate = new Date();
    subscriptions: Subscription[] = [];
    reportPrintObj: CasepaperVisitDetails;
    printTemplate: any;
    TempKeys: any[] = [];
    reportPrintObjList: CasepaperVisitDetails[] = [];
    subscriptionArr: Subscription[] = [];
    isLoadingStr: string = '';
    isLoading: String = '';

    VisitID: any;

    showtable: boolean = false;

    showReg: boolean = false;
  
    registerObj = new RegInsert({});
    registerObj1 = new RegInsert({});
    name = new FormControl('');
    FirstName = new FormControl('');
    AreaId = new FormControl('');
    submitted = false;
    year = 10;
    month = 5;
    day = 30;
    VisitTime: String;
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    DateofBirth: Date;
    HospitalList: any = [];
    PatientTypeList: any = [];
    TariffList: any = [];
    AreaList: any = [];
    MaritalStatusList: any = [];
    PrefixList: any = [];
    RelationshipList: any = [];
    ReligionList: any = [];
    DepartmentList: any = [];
    CompanyList: any = [];
    SubTPACompList: any = [];
    GenderList: any = [];
    PurposeList: any = [];
    DoctorList: any = [];
    Doctor1List: any = [];
    Doctor2List: any = [];
    WardList: any = [];
    BedList: any = [];
    BedClassList: any = [];
    ConfigCityId = 2;
    ConfigcityList: any = [];
    _cityList: any = [];
    cityList: any = [];
    stateList: any = [];
    countryList: any = [];
    ClassList: any = [];
    selectedState = "";
    selectedStateID: any;
    selectedCountry: any;
    selectedCountryID: any;
    selectedHName: any;
    seelctedHospID: any;
    selectedGender = "";
    selectedGenderID: any;
    capturedImage: any;
    isLinear = true;
    VisitFormGroup: FormGroup;
    searchFormGroup: FormGroup;
    registration: any;
    isRegSearchDisabled: boolean = true;
    Regdisplay: boolean = false;
    newRegSelected: any = 'registration';
    dataArray = {};
    HospitalList1: any = [];
    Patientnewold: any = 1;
  
  
    IsPathRad: any;
    PatientName: any = '';
    RegId: any = 0;
    OPIP: any = '';
    Bedname: any = '';
    wardname: any = '';
    classname: any = '';
    tariffname: any = '';
    ipno: any = '';
    patienttype: any = '';
    Adm_Vit_ID: any = 0;
  
    OTTableID: any;
    AnestheticsDr: any;
    OTTableName: any;
    RegAppoint = 0;
  
    isLoadings = false;
    isOpen = false;
    loadID = 0;
    savedValue: number = null;
   
    // Image upload
    docData;
    docType;
    docViewType: any;
    sStatus: any = '';
    // public errors: WebcamInitError[] = [];
  
    private trigger: Subject<any> = new Subject();
    // public webcamImage!: WebcamImage;
    private nextWebcam: Subject<any> = new Subject();
    sysImage = '';
  
    // upload document
    doclist: any = [];
    Filename:any;
    noOptionFound: boolean = false;
  
    RegNo:any=0;
  // Document Upload
    personalFormGroup:FormGroup;
    title = 'file-upload';
    images: any[] = [];
    docsArray: DocData[] = [];
    filteredOptions: any;
    showOptions: boolean = false;

    doctorNameCmbList:any=[];

    optionsDoctor: any[] = [];

    filteredOptionsDoctor: Observable<string[]>;
    isDoctorSelected:boolean = false;


  @ViewChild('attachments') attachment: any;

  imageForm = new FormGroup({
    imageFile: new FormControl('', [Validators.required]),
    imgFileSource: new FormControl('', [Validators.required])
  });

  docsForm = new FormGroup({
    docFile: new FormControl('', [Validators.required]),
    docFileSource: new FormControl('', [Validators.required])
  });

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
   
   
    displayedColumns = [
        "PatientOldNew",
        "MPbillNo",
        "Bill",
        "RegNoWithPrefix",
        "PatientName",
        "DVisitDate",
        "VisitTime",
        "OPDNo",
        "Doctorname",
        "RefDocName",
        "PatientType",
        // 'HospitalName',
        "action",
    ];
    
    dataSource = new MatTableDataSource<VisitMaster>();
    menuActions: Array<string> = [];
    //datePipe: any;
    
    displayedColumns1 = [

        'DocumentName',
        'DocumentPath',
        'buttons'
    ];
    
    dataSource1 = new MatTableDataSource<DocumentUpload>();
    
      filterReligion: any;
      filterMaritalstatus: any;
      filterArea: any;
      filterCompany: any;
      filterHospital: any;

    constructor(
        public _AppointmentSreviceService: AppointmentSreviceService,
        public _opappointmentService: AppointmentSreviceService,
        private accountService: AuthenticationService,
        public _registerService: RegistrationService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private _ActRoute: Router,
        
        private _fuseSidebarService: FuseSidebarService,
        public _registrationService: RegistrationService,
        public matDialog: MatDialog,

        private advanceDataStored: AdvanceDataStored,

    ){ 
      this.getVisitList();
    }
    
    ngOnInit(): void {

        this.personalFormGroup = this.createPesonalForm();
        this.personalFormGroup = this.createPesonalForm();
        this.personalFormGroup.markAllAsTouched();
        this.VisitFormGroup = this.createVisitdetailForm();
        this.VisitFormGroup.markAllAsTouched();
        this.searchFormGroup = this.createSearchForm();
        this.searchFormGroup.markAllAsTouched();

        if (this._ActRoute.url == "/opd/appointment") {
            // this.menuActions.push('One');
            // this.menuActions.push("CasePaper Print");
            this.menuActions.push("Update Registration");
            this.menuActions.push("Update Consultant Doctor");
            this.menuActions.push("Update Referred Doctor");
            this.menuActions.push("Upload Documents");
            this.menuActions.push("Capture Photo");
            this.menuActions.push("Generate Patient Barcode");
            // this.registerObj = this.data.registerObj;
        }

        this.getVisitList();
        this.getDoctorNameCombobox();
        
        this.getHospitalList1();
        this.getHospitalList();

        this.getPrefixList();
        this.getPatientTypeList();
        this.getTariffList();
        this.getAreaList();
        this.getMaritalStatusList();
        this.getReligionList();
        this.getcityList1();
        this.getCompanyList();
        this.getSubTPACompList();
        this.getDepartmentList();
        this.getDoctor1List();
        this.getDoctor2List();
        this.getPurposeList();
        
        this.religionFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterReligion();
        });
  
      this.maritalstatusFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterMaritalstatus();
        });
  
      this.areaFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterArea();
        });
  
      this.companyFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterCompany();
        });
  
      this.hospitalFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterHospital();
        });
  
      this.FirstName.markAsTouched();
      this.AreaId.markAsTouched();
  
    }
    getDoctor1List() {
      this._opappointmentService.getDoctorMaster1Combo().subscribe(data => {
        this.Doctor1List = data;
        this.optionsRefDoc = this.Doctor1List.slice();
        this.filteredOptionsRefDoc = this.VisitFormGroup.get('RefDocId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterRefdoc(value) : this.Doctor1List.slice()),
        );
        // this.filteredDepartment.next(this.DepartmentList.slice());
      });
    }
  
    DocSelectdelete() {
    
      this.VisitFormGroup.get('RefDocId').setValue(null);
  
      this.getDoctor1List();
    }

  
    getDoctor2List() {
      this._opappointmentService.getDoctorMaster2Combo().subscribe(data => { this.Doctor2List = data; })
    }


  getOptionTextPrefix(option){
    return option && option.PrefixName ? option.PrefixName : '';
  }


  getOptionTextDep(option) {
    
    return option && option.departmentName ? option.departmentName : '';
  }

  getOptionTextCity(option) {
    return option && option.CityName ? option.CityName : '';
    
  }

  getOptionTextDoc(option) {
    
    return option && option.Doctorname ? option.Doctorname : '';
    
  }

  getOptionTextRefDoc(option){
    
    return option && option.DoctorName ? option.DoctorName : '';
    
  }

  getOptionTextRelation(option){
    
    return option && option.DoctorName ? option.DoctorName : '';
    
  }
  getOptionTextPurpose(option){

    return option && option.PurposeName ? option.PurposeName : '';
  }

 
  private _filterPrex(value: any): string[] {
    if (value) {
      const filterValue = value && value.PrefixName ? value.PrefixName.toLowerCase() : value.toLowerCase();
       return this.optionsPrefix.filter(option => option.PrefixName.toLowerCase().includes(filterValue));
    }

  }

  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
      // this.isDepartmentSelected = false;
      return this.optionsDep.filter(option => option.departmentName.toLowerCase().includes(filterValue));
    }

  }

  private _filterCity(value: any): string[] {
    if (value) {
      const filterValue = value && value.CityName ? value.CityName.toLowerCase() : value.toLowerCase();
      // this.isDepartmentSelected = false;
      return this.optionsCity.filter(option => option.CityName.toLowerCase().includes(filterValue));
    }

  }

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

  private _filterRefdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      // this.isDepartmentSelected = false;
      return this.optionsRefDoc.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  private _filterPurpose(value: any): string[] {
    if (value) {
      const filterValue = value && value.PurposeName ? value.PurposeName.toLowerCase() : value.toLowerCase();
      // this.isDepartmentSelected = false;
      return this.optionsPurpose.filter(option => option.PurposeName.toLowerCase().includes(filterValue));
    }

  }

    createPesonalForm() {

        return this.formBuilder.group({
          RegId: '',
          PrefixId: '',
          PrefixID: '',
          FirstName: ['', [
            Validators.required,
            Validators.pattern("^[a-zA-Z._ -]+$"),
          ]],
          MiddleName: ['', [
    
            // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
          ]],
          LastName: ['', [
            Validators.required,
            // Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
          ]],
          GenderId: '',
          Address: '',
          DateOfBirth: [{ value: this.registerObj.DateofBirth }],
          AgeYear: ['', [
            Validators.required,
            Validators.pattern("^[0-9]*$")]],
          AgeMonth: ['', Validators.pattern("[0-9]+")],
          AgeDay: ['', Validators.pattern("[0-9]+")],
          // PhoneNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{15}$")]] , 
          PhoneNo: ['', [
            Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
            Validators.minLength(10),
            Validators.maxLength(10),
          ]],
          MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
          Validators.minLength(10),
          Validators.maxLength(10),]],
          AadharCardNo: [''],
          PanCardNo: '',
          MaritalStatusId: '',
          ReligionId: '',
          AreaId: '',
          CityId: '',
          StateId: '',
          CountryId: ''
    
        });
    
    }
    
  createVisitdetailForm() {
    return this.formBuilder.group({
      HospitalID: '',
      UnitId: '',
      PatientTypeID: '',
      PatientTypeId: '',
      PatientType: '',
      TariffId: '',
      CompanyId: '',
      SubCompanyId: '',
      DoctorId: '',
      DoctorID: '',
      DepartmentId: '',
      Departmentid: '',
      DoctorIdOne: '',
      DoctorIdTwo: '',
      VisitId: '',
      PrefixId: '',
      RegNoWithPrefix: '',
      PatientName: '',
      VisitDate: '',
      VisitTime: '',
      HospitalId: '',
      HospitalName: '',
      OPDNo: '',
      TariffName: '',
      ConsultantDocId: '',
      RefDocId: '',
      Doctorname: '',
      RefDocName: '',
      ClassId: '',
      PurposeId: ''
    });
  }

  onChangeReg(event) {
    if (event.value == 'registration') {
      this.registerObj = new RegInsert({});
      this.personalFormGroup.reset();
      this.personalFormGroup.get('RegId').reset();
      this.searchFormGroup.get('RegId').disable();
      // this.isRegSearchDisabled = false;

      this.personalFormGroup = this.createPesonalForm();
      this.personalFormGroup.markAllAsTouched();
      this.VisitFormGroup = this.createVisitdetailForm();
      this.VisitFormGroup.markAllAsTouched();
      // this.Regdisplay = false;
      // this.showtable = false;


    } else {
      this.isRegSearchDisabled = false;
      this.personalFormGroup.get('RegId').enable();
      this.personalFormGroup.reset();
      this.Patientnewold = 2;

      this.personalFormGroup = this.createPesonalForm();
      this.personalFormGroup.markAllAsTouched();
      this.VisitFormGroup = this.createVisitdetailForm();
      this.VisitFormGroup.markAllAsTouched();
      // this.searchRegList();
    }

    this.getHospitalList1();
    this.getHospitalList();
    this.getTariffList();
    this.getPatientTypeList();
    this.getPrefixList();
    this.getDepartmentList();
    this.getcityList1();
  }

  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      regRadio1: ['registration1'],
      // RegId: [{ value: '', disabled: this.isRegSearchDisabled },]
      // [Validators.required]]
      RegId:['']
    });
  }

  getHospitalList() {
    this._opappointmentService.getHospitalCombo().subscribe(data => {
      this.HospitalList = data;
      this.filteredHospital.next(this.HospitalList.slice());
      this.VisitFormGroup.get('HospitalID').setValue(this.HospitalList[0]);
    })
  }

 
  getPrefixList() {
    this._registerService.getPrefixCombo().subscribe(data => {
      this.PrefixList = data;
      this.optionsPrefix = this.PrefixList.slice();
      this.filteredOptionsPrefix = this.personalFormGroup.get('PrefixID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterPrex(value) : this.PrefixList.slice()),
      );
      
    });
  }

  
  getcityList1() {
    
    this._opappointmentService.getCityList().subscribe(data => {
      this.cityList = data;
      this.optionsCity = this.cityList.slice();
      this.filteredOptionsCity = this.personalFormGroup.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCity(value) : this.cityList.slice()),
      );
      
    });
    
  }

  getPurposeList() {
    this._opappointmentService.getPurposeList().subscribe(data => {
      this.PurposeList = data;
      console.log(data)
      this.optionsPurpose = this.PurposeList.slice();
      this.filteredOptionsPurpose= this.VisitFormGroup.get('PurposeId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterPurpose(value) : this.PurposeList.slice()),
      );
    });
  }

  getPatientTypeList() {
    this._opappointmentService.getPatientTypeCombo().subscribe(data => {
      this.PatientTypeList = data;
      this.VisitFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
    })
  }

  onChangePatient(value) {
    console.log(value);

    if (value.PatientTypeId == 2) {
      this.VisitFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
      this.VisitFormGroup.get('CompanyId').clearValidators();
      this.VisitFormGroup.get('SubCompanyId').clearValidators();
      this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
      this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
      this.isCompanySelected = true;
    } else {
      this.VisitFormGroup.get('CompanyId').setValidators([Validators.required]);
      // this.VisitFormGroup.get('CompanyId').setValue(this.CompanyList[0]);
      this._opappointmentService.getCompanyCombo();
      this.isCompanySelected = false;
    }

  }

  onEdit(row) {
    console.log(row);

    this.registerObj = row;
    this.getSelectedObj(row);
  }

  getClassList() {
    this._opappointmentService.getClassMasterCombo().subscribe(data => { this.ClassList = data; })
  }

  getTariffList() {
    this._opappointmentService.getTariffCombo().subscribe(data => {
      this.TariffList = data;
      this.VisitFormGroup.get('TariffId').setValue(this.TariffList[0]);
    })
  }

  getAreaList() {
    this._opappointmentService.getAreaCombo().subscribe(data => {
      this.AreaList = data;
      this.filteredArea.next(this.AreaList.slice());
      if (this.registerObj) {

        const toSelectArea = this.AreaList.find(c => c.AreaId == this.registerObj.AreaId);
        this.personalFormGroup.get('AreaId').setValue(toSelectArea);

      }
    });
  }

  getMaritalStatusList() {
    this._opappointmentService.getMaritalStatusCombo().subscribe(data => {
      this.MaritalStatusList = data;
      this.filteredMaritalstatus.next(this.MaritalStatusList.slice());
      if (this.registerObj) {
        const toSelectMarital = this.MaritalStatusList.find(c => c.MaritalStatusId == this.registerObj.MaritalStatusId);
        this.personalFormGroup.get('MaritalStatusId').setValue(toSelectMarital);

      }
    });
  }

  getReligionList() {
    this._opappointmentService.getReligionCombo().subscribe(data => {
      this.ReligionList = data;
      this.filteredReligion.next(this.ReligionList.slice());
      if (this.registerObj) {

        const toSelectReligion = this.ReligionList.find(c => c.ReligionId == this.registerObj.ReligionId);
        this.personalFormGroup.get('ReligionId').setValue(toSelectReligion);

      }
    });
  }

  getCompanyList() {
    this._opappointmentService.getCompanyCombo().subscribe(data => {
      this.CompanyList = data;
      this.filteredCompany.next(this.CompanyList.slice());
    });
  }
  getDepartmentList() {
    this._opappointmentService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this.VisitFormGroup.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      // this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }

  
  onChangeStateList(CityId) {
    // if (CityId > 0) {
    //   if (this.registerObj.StateId != 0) {
    //     CityId = this.registerObj.CityId
    //   }
      this._opappointmentService.getStateList(CityId).subscribe(data => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;
        //  this._AdmissionService.myFilterform.get('StateId').setValue(this.selectedState);
      });
    // }
  }



  onChangeCountryList(StateId) {
    if (StateId > 0) {
      // if (this.registerObj.StateId! = 0) {
      //   StateId = this.registerObj.StateId
      // }
      this._opappointmentService.getCountryList(StateId).subscribe(data => {
        this.countryList = data;
        this.selectedCountry = this.countryList[0].CountryName;
        this.personalFormGroup.get('CountryId').setValue(this.countryList[0]);
        this.personalFormGroup.updateValueAndValidity();
      });
    }
  }

  onChangeDateofBirth(DateOfBirth) {
    if (DateOfBirth) {
      const todayDate = new Date();
      const dob = new Date(DateOfBirth);
      const timeDiff = Math.abs(Date.now() - dob.getTime());
      this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
      this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
      this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
      this.registerObj.DateofBirth = DateOfBirth;
      this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);
    }

  }
    // VisitList

    getVisitList() {
        this.sIsLoading = "loading-data";
        var D_data = {
            F_Name:this._AppointmentSreviceService.myFilterform.get("FirstName").value.trim() + "%" || "%",
            L_Name:this._AppointmentSreviceService.myFilterform.get("LastName").value.trim() + "%" || "%",
            Reg_No:this._AppointmentSreviceService.myFilterform.get("RegNo").value || 0,
            Doctor_Id:this._AppointmentSreviceService.myFilterform.get("DoctorId").value.DoctorID || 0,
            From_Dt: this.datePipe.transform( this._AppointmentSreviceService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000" ) || "01/01/1900",
            To_Dt:this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || "01/01/1900",
            IsMark:this._AppointmentSreviceService.myFilterform.get("IsMark").value || 0,
        };
        setTimeout(() => {
            this.isLoadingStr = 'loading';
            this._AppointmentSreviceService.getAppointmentList(D_data).subscribe(
                    (Visit) => {
                        this.dataSource.data = Visit as VisitMaster[];
                        this.dataSource.sort = this.sort;
                        this.dataSource.paginator = this.paginator;
                        this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
                    },
                    (error) => {
                        this.isLoading = 'list-loaded';
                    }
                );
        }, 1000);

        this.sIsLoading = 'loading-data';
        var D_data = {
          "F_Name": this._opappointmentService.myFilterform.get("FirstName").value.trim() + '%' || '%',
          "L_Name": this._opappointmentService.myFilterform.get("LastName").value.trim() + '%' || '%',
          "Reg_No": this._opappointmentService.myFilterform.get("RegNo").value || 0,
          "Doctor_Id": this._opappointmentService.myFilterform.get("DoctorId").value || 0,
          "From_Dt": this.datePipe.transform(this._opappointmentService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
          "To_Dt": this.datePipe.transform(this._opappointmentService.myFilterform.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
          "IsMark": this._opappointmentService.myFilterform.get("IsMark").value || 0,
    
        }
        console.log(D_data);
        this._opappointmentService.getAppointmentList(D_data).subscribe(Visit => {
          this.dataArray = Visit;
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

    onClear() {
        this._AppointmentSreviceService.myFilterform.reset({
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
        });
        this._opappointmentService.mySaveForm.reset({ IsDeleted: 'false' });
    this._opappointmentService.initializeFormGroup();
    }

    
  private _filterDoctor(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
       return this.optionsDoctor.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  //religion filter
  public religionFilterCtrl: FormControl = new FormControl();
  public filteredReligion: ReplaySubject<any> = new ReplaySubject<any>(1);

  //maritalstatus filter
  public maritalstatusFilterCtrl: FormControl = new FormControl();
  public filteredMaritalstatus: ReplaySubject<any> = new ReplaySubject<any>(1);

  //area filter
  public areaFilterCtrl: FormControl = new FormControl();
  public filteredArea: ReplaySubject<any> = new ReplaySubject<any>(1);

  // //purpose filter
  // public purposeFilterCtrl: FormControl = new FormControl();
  // public filteredPurpose: ReplaySubject<any> = new ReplaySubject<any>(1);

  //company filter
  public companyFilterCtrl: FormControl = new FormControl();
  public filteredCompany: ReplaySubject<any> = new ReplaySubject<any>(1);

  //hospital filter
  public hospitalFilterCtrl: FormControl = new FormControl();
  public filteredHospital: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctorone filter
  public doctoroneFilterCtrl: FormControl = new FormControl();
  public filteredDoctorone: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctorone filter
  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  options = [];
  PatientListfilteredOptions: any;
  @ViewChild('appointmentFormStepper') appointmentFormStepper: MatStepper;
  @Input() panelWidth: string | number;
  selectedPrefixId: any;

  isCompanySelected: boolean = false;
  public now: Date = new Date();
  screenFromString = 'admission-form';
  // dataSource = new MatTableDataSource<VisitMaster>();

  visitObj = new VisitMaster({});

  editor: string;

  isPrefixSelected: boolean = false;
  isDepartmentSelected: boolean = false;
  isCitySelected: boolean = false;
  isRegIdSelected: boolean = false;
  isRefDoctorSelected: boolean = false;
  isPurposeSelected:boolean = false;

  optionsPrefix: any[] = [];
  optionsDep: any[] = [];
  optionsCity: any[] = [];
  optionsDoc: any[] = [];
  optionsRefDoc: any[] = [];
  optionsPurpose:any[] = [];

  filteredOptionsDep: Observable<string[]>;
 
  filteredOptionsDoc: Observable<string[]>;
  filteredOptionsRefDoc: Observable<string[]>;
  filteredOptionsPrefix: Observable<string[]>;
  filteredOptionsCity: Observable<string[]>;
  filteredOptionsPurpose: Observable<string[]>;

  getDoctorNameCombobox() {
    this._AppointmentSreviceService.getDoctorMasterComboA().subscribe(data => {
      this.doctorNameCmbList = data;
      this.optionsDoctor = this.doctorNameCmbList.slice();
      this.filteredOptionsDoctor = this._AppointmentSreviceService.myFilterform.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor(value) : this.doctorNameCmbList.slice()),
      );
      
    });
  }

  
  getOptionTextDoctor(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
    getSearchList() {
        debugger
      
        var m_data={
          "Keyword":`${this.searchFormGroup.get('RegId').value}%`
        }
        if (this.searchFormGroup.get('RegId').value.length >= 1) {
          this._AppointmentSreviceService.getRegistrationList(m_data).subscribe(resData => {
            this.filteredOptions = resData;
            console.log(resData)
            if (this.filteredOptions.length == 0) {
              this.noOptionFound = true;
            } else {
              this.noOptionFound = false;
            }
    
          });
        }
    
      }


    getOptionText(option) {
        if (!option) return '';
        return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
      }
    

    getSelectedObj(obj) {
        ;
        // console.log('obj==', obj);
        let a, b, c;
    
        a = obj.AgeDay.trim();;
        b = obj.AgeMonth.trim();
        c = obj.AgeYear.trim();
        console.log(a, b, c);
        obj.AgeDay = a;
        obj.AgeMonth = b;
        obj.AgeYear = c;
        this.registerObj = obj;
        this.PatientName=obj.FirstName +" "+ obj.MiddleName +" "+ obj.LastName;
        this.RegId=obj.RegId;
        // console.log( this.registerObj )
    this.setDropdownObjs();
      }

      setDropdownObjs() {
        debugger
        const toSelect = this.PrefixList.find(c => c.PrefixID == this.registerObj.PrefixID);
        this.personalFormGroup.get('PrefixID').setValue(toSelect);
    
        const toSelectMarital = this.MaritalStatusList.find(c => c.MaritalStatusId == this.registerObj.MaritalStatusId);
        this.personalFormGroup.get('MaritalStatusId').setValue(toSelectMarital);
    
        const toSelectReligion = this.ReligionList.find(c => c.ReligionId == this.registerObj.ReligionId);
        this.personalFormGroup.get('ReligionId').setValue(toSelectReligion);
    
        const toSelectArea = this.AreaList.find(c => c.AreaId == this.registerObj.AreaId);
        this.personalFormGroup.get('AreaId').setValue(toSelectArea);
    
        const toSelectCity = this.cityList.find(c => c.CityId == this.registerObj.CityId);
        this.personalFormGroup.get('CityId').setValue(toSelectCity);
    
        this.onChangeGenderList(this.personalFormGroup.get('PrefixID').value);
        this.onChangeCityList(this.personalFormGroup.get('CityId').value);
        this.personalFormGroup.updateValueAndValidity();
      }
    
      onChangeGenderList(prefixObj) {
        if (prefixObj) {
          this._opappointmentService.getGenderCombo(prefixObj.PrefixID).subscribe(data => {
            this.GenderList = data;
            this.personalFormGroup.get('GenderId').setValue(this.GenderList[0]);
            // this.selectedGender = this.GenderList[0];
            this.selectedGenderID = this.GenderList[0].GenderId;
          });
        }
      }
    
      onChangeCityList(CityObj) {
    
        debugger
        if (CityObj) {
          this._opappointmentService.getStateList(CityObj.CityId).subscribe((data: any) => {
               this.stateList = data;
            this.selectedState = this.stateList[0].StateName;
         
            // const stateListObj = this.stateList.find(s => s.StateId == this.selectedStateID);
            this.personalFormGroup.get('StateId').setValue(this.stateList[0]);
            this.selectedStateID = this.stateList[0].StateId;
            this.onChangeCountryList(this.selectedStateID);
            
          });
        
        }
      }
      
    getRecord(contact, m): void {
        debugger;
        // this.VisitID = contact.VisitId;
        if (m == "CasePaper Print") {
            this.getPrint(contact);
        }
        if (m == "Update Registration") {
            console.log(contact);
            var D_data = {
                RegId: contact.RegId//8//TESTING APPointment edit contact.RegId,
            };
            console.log(D_data)
            this._AppointmentSreviceService
                .getregisterListByRegId(D_data)
                .subscribe(
                    (reg) => {
                        this.dataArray = reg;
                        console.log(this.dataArray);
                        var m_data = {
                            RegNo: this.dataArray[0].RegNo,
                            RegId: this.dataArray[0].RegId,
                            PrefixID: this.dataArray[0].PrefixId,
                            PrefixName: this.dataArray[0].PrefixName,
                            FirstName: this.dataArray[0].FirstName,
                            MiddleName: this.dataArray[0].MiddleName,
                            LastName: this.dataArray[0].LastName,
                            PatientName: this.dataArray[0].PatientName,
                            DateofBirth: this.dataArray[0].DateofBirth,
                            MaritalStatusId: this.dataArray[0].MaritalStatusId,
                            AadharCardNo: this.dataArray[0].AadharCardNo || 0,
                            Age: this.dataArray[0].Age.trim(),
                            AgeDay: this.dataArray[0].AgeDay,
                            AgeMonth: this.dataArray[0].AgeMonth,
                            AgeYear: this.dataArray[0].AgeYear,
                            Address: this.dataArray[0].Address,
                            AreaId: this.dataArray[0].AreaId,
                            City: this.dataArray[0].City,
                            CityId: this.dataArray[0].CityId,
                            StateId: this.dataArray[0].StateId,
                            CountryId: this.dataArray[0].CountryId,
                            PhoneNo: this.dataArray[0].PhoneNo,
                            MobileNo: this.dataArray[0].MobileNo,
                            GenderId: this.dataArray[0].GenderId,
                            GenderName: this.dataArray[0].GenderName,
                            ReligionId: this.dataArray[0].ReligionId,
                            IsCharity: 0,
                            PinNo: this.dataArray[0].PinNo,
                            RegDate: this.dataArray[0].RegDate,
                            RegNoWithPrefix: this.dataArray[0].RegNoWithPrefix,
                            RegTime: this.dataArray[0].RegTime,
                        };
                        this._registrationService.populateFormpersonal(m_data);
                        const dialogRef = this._matDialog.open(NewAppointmentComponent,
                            {
                                maxWidth: "85vw",
                                height: "550px",
                                width: "100%",
                                data: {
                                    registerObj: m_data,
                                },
                            }
                        );
                        dialogRef.afterClosed().subscribe((result) => {
                            console.log(
                                "The dialog was closed - Insert Action",
                                result
                            );
                            this.getVisitList();
                        });
                    },
                    (error) => {
                        this.sIsLoading = "";
                    }
                );
        } else if (m == "Update Consultant Doctor") {
            var m_data2 = {
                RegId: contact.RegId,
                PatientName: contact.PatientName,
                VisitId: contact.VisitId,
                OPD_IPD_Id: contact.OPD_IPD_Id,
                DoctorId: contact.DoctorId,
                DoctorName: contact.Doctorname,
            };
            this._registrationService.populateFormpersonal(m_data2);
            const dialogRef = this._matDialog.open(
                EditConsultantDoctorComponent,
                {
                    maxWidth: "70vw",
                    height: "410px",
                    width: "70%",
                    data: {
                        registerObj: m_data2,
                    },
                }
            );
            dialogRef.afterClosed().subscribe((result) => {
                console.log("The dialog was closed - Insert Action", result);
            });
        } else if (m == "Update Referred Doctor") {
            var m_data3 = {
                RegId: contact.RegId,
                PatientName: contact.PatientName,
                VisitId: contact.VisitId,
                OPD_IPD_Id: contact.OPD_IPD_Id,
                RefDoctorId: contact.RefDocId,
                RefDocName: contact.RefDocName,
            };
            this._registrationService.populateFormpersonal(m_data3);
            const dialogRef = this._matDialog.open(EditRefraneDoctorComponent, {
                maxWidth: "70vw",
                height: "410px",
                width: "70%",
                data: {
                    registerObj: m_data3,
                },
            });
            dialogRef.afterClosed().subscribe((result) => {
                console.log("The dialog was closed - Insert Action", result);
            });
        }
        //   else if (m == "Refund of Bill") {
        //     console.log(" This is for refund of Bill pop : " + m);
        //   }
        //   else if (m == "Case Paper") {
        //     console.log("Case Paper : " + m);
        //   }
        //   //   const act?ionType: string = response[0];
        //   //   this.selectedID =  contact.VisitId
        //   //   this._ActRoute.navigate(['opd/appointment/op_bill'])
        //   //   this._ActRoute.navigate(['opd/appointment/op_bill'], {queryParams:{id:this.selectedID}})
    }

    newappointment() {
        const dialogRef = this._matDialog.open(NewAppointmentComponent, {
            maxWidth: "110vw",
            height: "850px",
            width: "100%",
            
        });
        dialogRef.afterClosed().subscribe((result) => {
            
            this.getVisitList();
        });
    }
    feedback() {
        const dialogRef = this._matDialog.open(FeedbackComponent, {
            maxWidth: "80vw",
            height: "90%",
            width: "100%",
            
        });
    }

    PatientAppointment() {
        const dialogRef = this._matDialog.open(PatientAppointmentComponent,
            {
                maxWidth: "95vw",
                maxHeight: "95vh", width: '100%', height: "100%"
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            
        });
    }

    // field validation
    get f() {
        return this._AppointmentSreviceService.myFilterform.controls;
    }
    selectRow(row) {
        this.selectRow = row;
    }

    getTemplate() {
        let query =
            "select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=12";
        this._AppointmentSreviceService
            .getTemplate(query)
            .subscribe((resData: any) => {
                this.printTemplate = resData[0].TempDesign;
                this.TempKeys = resData[0].TempKeys;
                //console.log(this.printTemplate);
                console.log(this.TempKeys);
                let keysArray1 = this.TempKeys;

                console.log(keysArray1);
                let keysArray =[
                    'HospitalName','HospitalAddress','Phone','EmailId',
                    "RegNo",
                    "PrecriptionId",
                    "PatientName",
                    "OPDNo",
                    "Diagnosis",
                    "PatientName",
                    "Weight",
                    "Pluse",
                    "BP",
                    "BSL",
                    "DoseName",
                    "Days",
                    "GenderName",
                    "AgeYear",
                    "DrugName",
                    "ConsultantDocName",
                    "RefDocName",
                    "SecondRefDoctorName",
                    "MobileNo",
                    "Address",
                    "VisitDate",
                    "PreviousVisitDate"
                ]; // resData[0].TempKeys;

                console.log(keysArray);
                debugger;
                for (let i = 0; i < keysArray.length; i++) {
                    let reString = "{{" + keysArray[i] + "}}";
                    let re = new RegExp(reString, "g");
                    this.printTemplate = this.printTemplate.replace(
                        re,
                        this.reportPrintObj[keysArray[i]]
                    );
                }

                this.printTemplate = this.printTemplate.replace("StrPrintDate",this.transform2(this.currentDate.toString()));
                this.printTemplate = this.printTemplate.replace('StrVisitDate', this.transform2(this.reportPrintObj.VisitDate));
                this.printTemplate = this.printTemplate.replace('StrPreviousVisitDate', this.transform2(this.reportPrintObj.PreviousVisitDate));
                this.printTemplate = this.printTemplate.replace(/{{.*}}/g, "");
                setTimeout(() => {
                    this.print();
                }, 1000);
            });
    }

    transform1(value: string) {
        var datePipe = new DatePipe("en-US");
        value = datePipe.transform(value, "dd/MM/yyyy hh:mm a");
        return value;
    }

    transform2(value: string) {
        var datePipe = new DatePipe("en-US");
        value = datePipe.transform(new Date(), "dd/MM/yyyy h:mm a");
        return value;
    }

    getPrint(contact) {
        var D_data = {
            VisitId: contact.VisitId || 0,
        };
     
        let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
        this.subscriptionArr.push(
            this._AppointmentSreviceService
                .getOPDPrecriptionPrint(D_data)
                .subscribe((res) => {
                    this.reportPrintObjList = res as CasepaperVisitDetails[];
                    console.log(this.reportPrintObjList )
                    this.reportPrintObj = res[0] as CasepaperVisitDetails;
                    this.getTemplate();
                })
        );
    }

    // PRINT
    print() {
        // HospitalName, HospitalAddress, AdvanceNo, PatientName
        let popupWin, printContents;
        // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;

        popupWin = window.open(
            "",
            "_blank",
            "top=0,left=0,height=800px !important,width=auto,width=2200px !important"
        );
        // popupWin.document.open();
        popupWin.document.write(` <html>
    <head><style type="text/css">`);
        popupWin.document.write(`
      </style>
          <title></title>
      </head>
    `);
        popupWin.document
            .write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
    </html>`);
        popupWin.document.close();
    }


// Image Upload

b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    const Url = URL.createObjectURL(blob);
    // return this.safe.transform(Url);
  }

  public getSnapshot(): void {
    // this.trigger.next(void 0);
  }
  // public captureImg(webcamImage: WebcamImage): void {
  //   this.webcamImage = webcamImage;
  //   this.sysImage = webcamImage!.imageAsDataUrl;
  //   console.info('got webcam image', this.sysImage);
  // }
  // public get invokeObservable(): Observable<any> {
  //   return this.trigger.asObservable();
  // }
  // public get nextWebcamObservable(): Observable<any> {
  //   return this.nextWebcam.asObservable();
  // }
  // public handleInitError(error: WebcamInitError): void {
  //   this.errors.push(error);
  // }

  onUpload() {
    // this.dialogRef.close({url: this.sysImage});
  }

  
 

  submitAppointForm() {

    if (this.searchFormGroup.get('regRadio').value == "registration") {

      this.isLoading = 'submit';
      let submissionObj = {};
      let registrationSave = {};
      let visitSave = {};
      let tokenNumberWithDoctorWiseInsert = {};

      registrationSave['regId'] = 0;
      registrationSave['regDate'] = this.dateTimeObj.date //this.registerObj.RegDate;
      registrationSave['regTime'] = this.dateTimeObj.time;
      registrationSave['prefixId'] = this.personalFormGroup.get('PrefixID').value.PrefixID;
      registrationSave['firstName'] = this.registerObj.FirstName;
      registrationSave['middleName'] = this.registerObj.MiddleName;
      registrationSave['lastName'] = this.registerObj.LastName;
      registrationSave['address'] = this.registerObj.Address;
      registrationSave['City'] = this.personalFormGroup.get('CityId').value.CityName;
      registrationSave['pinNo'] = '';
      registrationSave['dateOfBirth'] = this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"), //this.personalFormGroup.get('DateofBirth').value.DateofBirth;
        registrationSave['age'] = this.registerObj.AgeYear;//this.registerObj.Age;
      registrationSave['genderID'] = this.personalFormGroup.get('GenderId').value.GenderId;
      registrationSave['phoneNo'] = this.personalFormGroup.get('PhoneNo').value || 0;
      registrationSave['mobileNo'] = this.registerObj.MobileNo;
      registrationSave['addedBy'] = this.accountService.currentUserValue.user.id;
      // registrationSave['RegNo'] = 0;//this.registerObj.RegId;
      registrationSave['ageYear'] = this.registerObj.AgeYear;
      registrationSave['ageMonth'] = this.registerObj.AgeMonth;
      registrationSave['ageDay'] = this.registerObj.AgeDay;
      registrationSave['countryId'] = this.personalFormGroup.get('CountryId').value.CountryId;
      registrationSave['stateId'] = this.personalFormGroup.get('StateId').value.StateId;
      registrationSave['cityId'] = this.personalFormGroup.get('CityId').value.CityId;
      registrationSave['maritalStatusId'] = this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId : 0;
      registrationSave['isCharity'] = false;
      registrationSave['religionId'] = this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.ReligionId : 0;
      registrationSave['areaId'] = this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0;
      // registrationSave['Aadharcardno'] =this.registerObj.AadharCardNo; // this.personalFormGroup.get('Aadharcardno').value || '';
      // registrationSave['Pancardno'] =this.registerObj.PanCardNo;// this.personalFormGroup.get('Pancardno').value || '';
      registrationSave['isSeniorCitizen'] = true; //this.personalFormGroup.get('isSeniorCitizen').value ? this.personalFormGroup.get('VillageId').value.VillageId : 0; //this.registerObj.VillageId;

      submissionObj['registrationSave'] = registrationSave;

      visitSave['VisitId'] = 0;
      visitSave['RegID'] = 0;
      visitSave['VisitDate'] = this.dateTimeObj.date;
      visitSave['VisitTime'] = this.dateTimeObj.time;

      visitSave['UnitId'] = this.VisitFormGroup.get('HospitalId').value.HospitalId ? this.VisitFormGroup.get('HospitalId').value.HospitalId : 0;
      visitSave['PatientTypeId'] = this.VisitFormGroup.get('PatientTypeID').value.PatientTypeId || 0;//.PatientTypeID;//? this.VisitFormGroup.get('PatientTypeID').value.PatientTypeID : 0;
      visitSave['ConsultantDocId'] = this.VisitFormGroup.get('DoctorID').value.DoctorId || 0;//? this.VisitFormGroup.get('DoctorId').value.DoctorId : 0;
      visitSave['RefDocId'] = this.VisitFormGroup.get('RefDocId').value.DoctorId || 0;// ? this.VisitFormGroup.get('DoctorIdOne').value.DoctorIdOne : 0;

      visitSave['TariffId'] = this.VisitFormGroup.get('TariffId').value.TariffId ? this.VisitFormGroup.get('TariffId').value.TariffId : 0;
      visitSave['CompanyId'] = this.VisitFormGroup.get('CompanyId').value.CompanyId ? this.VisitFormGroup.get('CompanyId').value.CompanyId : 0;
      visitSave['AddedBy'] = this.accountService.currentUserValue.user.id;
      visitSave['updatedBy'] = 0,//this.VisitFormGroup.get('RelationshipId').value.RelationshipId ? this.VisitFormGroup.get('RelationshipId').value.RelationshipId : 0;
        visitSave['IsCancelled'] = 0;
      visitSave['IsCancelledBy'] = 0;
      visitSave['IsCancelledDate'] = this.dateTimeObj.date;

      visitSave['ClassId'] = 1; // this.VisitFormGroup.get('ClassId').value.ClassId ? this.VisitFormGroup.get('ClassId').value.ClassId : 0;
      visitSave['DepartmentId'] = this.VisitFormGroup.get('Departmentid').value.Departmentid;//? this.VisitFormGroup.get('DepartmentId').value.DepartmentId : 0;
      console.log(this.Patientnewold);
      visitSave['PatientOldNew'] = this.Patientnewold;
      visitSave['FirstFollowupVisit'] = 0,// this.VisitFormGroup.get('RelativeAddress').value ? this.VisitFormGroup.get('RelativeAddress').value : '';
        visitSave['appPurposeId'] = this.VisitFormGroup.get('PurposeId').value.PurposeId;// ? this.VisitFormGroup.get('RelativeAddress').value : '';
      visitSave['FollowupDate'] = this.dateTimeObj.date;// this.personalFormGroup.get('PhoneNo').value ? this.personalFormGroup.get('PhoneNo').value : '';
      //  visitSave['IsMark'] = 0,// this.VisitFormGroup.get('RelatvieMobileNo').value ? this.personalFormGroup.get('MobileNo').value : '';



      submissionObj['visitSave'] = visitSave;

      tokenNumberWithDoctorWiseInsert['patVisitID'] = 0;
      submissionObj['tokenNumberWithDoctorWiseSave'] = tokenNumberWithDoctorWiseInsert;
      console.log(submissionObj);
      this._opappointmentService.appointregInsert(submissionObj).subscribe(response => {
        console.log(response);
        if (response) {
          Swal.fire('Congratulations !', 'New Appoinment save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
              // ;
              this.getVisitList();
            }

          });
        } else {
          Swal.fire('Error !', 'Appoinment not saved', 'error');
        }
        this.isLoading = '';

      });
    }
    else {

      this.isLoading = 'submit';
      let submissionObj = {};
      let registrationUpdate = {};
      let visitUpdate = {};

      let tokenNumberWithDoctorWiseUpdate = {};

      registrationUpdate['regId'] = this.registerObj.RegId;
      registrationUpdate['prefixId'] = this.personalFormGroup.get('PrefixID').value.PrefixID;
      registrationUpdate['firstName'] = this.registerObj.FirstName;
      registrationUpdate['middleName'] = this.registerObj.MiddleName;
      registrationUpdate['lastName'] = this.registerObj.LastName;
      registrationUpdate['address'] = this.registerObj.Address;
      registrationUpdate['City'] = this.personalFormGroup.get('CityId').value.CityName;
      registrationUpdate['pinNo'] = '';
      registrationUpdate['dateOfBirth'] = this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"); //this.personalFormGroup.get('DateofBirth').value.DateofBirth;
      registrationUpdate['age'] = this.registerObj.AgeYear;//this.registerObj.Age;
      registrationUpdate['genderID'] = this.personalFormGroup.get('GenderId').value.GenderId;
      registrationUpdate['phoneNo'] = this.personalFormGroup.get('PhoneNo').value || 0;
      registrationUpdate['mobileNo'] = this.registerObj.MobileNo;
      registrationUpdate['updatedBy'] = this.accountService.currentUserValue.user.id;
      registrationUpdate['ageYear'] = this.registerObj.AgeYear;
      registrationUpdate['ageMonth'] = this.registerObj.AgeMonth;
      registrationUpdate['ageDay'] = this.registerObj.AgeDay;
      registrationUpdate['countryId'] = this.personalFormGroup.get('CountryId').value.CountryId;
      registrationUpdate['stateId'] = this.personalFormGroup.get('StateId').value.StateId;
      registrationUpdate['cityId'] = this.personalFormGroup.get('CityId').value.CityId;
      registrationUpdate['maritalStatusId'] = this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId : 0;
      registrationUpdate['isCharity'] = false;

      submissionObj['registrationUpdate'] = registrationUpdate;
      // visit detail
      visitUpdate['VisitId'] = 0;
      visitUpdate['RegID'] = this.registerObj.RegId;
      visitUpdate['VisitDate'] = this.dateTimeObj.date;
      visitUpdate['VisitTime'] = this.dateTimeObj.time;

      visitUpdate['UnitId'] = this.VisitFormGroup.get('HospitalId').value.HospitalId ? this.VisitFormGroup.get('HospitalId').value.HospitalId : 0;
      visitUpdate['PatientTypeId'] = this.VisitFormGroup.get('PatientTypeID').value.PatientTypeId || 0;//.PatientTypeID;//? this.VisitFormGroup.get('PatientTypeID').value.PatientTypeID : 0;
      visitUpdate['ConsultantDocId'] = this.VisitFormGroup.get('DoctorID').value.DoctorId || 0;//? this.VisitFormGroup.get('DoctorId').value.DoctorId : 0;
      visitUpdate['RefDocId'] = this.VisitFormGroup.get('DoctorIdOne').value.DoctorId;// ? this.VisitFormGroup.get('DoctorIdOne').value.DoctorIdOne : 0;

      visitUpdate['TariffId'] = this.VisitFormGroup.get('TariffId').value.TariffId ? this.VisitFormGroup.get('TariffId').value.TariffId : 0;
      visitUpdate['CompanyId'] = this.VisitFormGroup.get('CompanyId').value.CompanyId ? this.VisitFormGroup.get('CompanyId').value.CompanyId : 0;
      visitUpdate['AddedBy'] = this.accountService.currentUserValue.user.id;
      visitUpdate['updatedBy'] = 0,//this.VisitFormGroup.get('RelationshipId').value.RelationshipId ? this.VisitFormGroup.get('RelationshipId').value.RelationshipId : 0;
        visitUpdate['IsCancelled'] = 0;
      visitUpdate['IsCancelledBy'] = 0;
      visitUpdate['IsCancelledDate'] = this.dateTimeObj.date;

      visitUpdate['ClassId'] = 1; // this.VisitFormGroup.get('ClassId').value.ClassId ? this.VisitFormGroup.get('ClassId').value.ClassId : 0;
      visitUpdate['DepartmentId'] = this.VisitFormGroup.get('DoctorID').value.DepartmentId;//? this.VisitFormGroup.get('DepartmentId').value.DepartmentId : 0;
      ;
      console.log(this.Patientnewold);

      visitUpdate['PatientOldNew'] = this.Patientnewold;
      visitUpdate['FirstFollowupVisit'] = 0,// this.VisitFormGroup.get('RelativeAddress').value ? this.VisitFormGroup.get('RelativeAddress').value : '';
        visitUpdate['appPurposeId'] = this.VisitFormGroup.get('PurposeId').value.PurposeId;// ? this.VisitFormGroup.get('RelativeAddress').value : '';
      visitUpdate['FollowupDate'] = this.dateTimeObj.date;// this.personalFormGroup.get('PhoneNo').value ? this.personalFormGroup.get('PhoneNo').value : '';

      submissionObj['visitUpdate'] = visitUpdate;


      tokenNumberWithDoctorWiseUpdate['patVisitID'] = 0;
      submissionObj['tokenNumberWithDoctorWiseUpdate'] = tokenNumberWithDoctorWiseUpdate;

      console.log(submissionObj);
      this._opappointmentService.appointregupdate(submissionObj).subscribe(response => {
        // console.log(response);
        if (response) {
          Swal.fire('Congratulations !', 'Registered Appoinment Saved Successfully  !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
            }
            this.getVisitList();
          });
        } else {
          Swal.fire('Error !', 'Appointment not Updated', 'error');
        }
        this.isLoading = '';
      });

    }
  }
  //Image Upload
  imgArr: string[] = [];
  onImageFileChange(events: any) {
    if (events.target.files && events.target.files[0]) {
      let filesAmount = events.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        this.imgArr.push(events.target.files[i].name);
        reader['fileName'] = events.target.files[i].name;
        reader.onload = (event: any) => {
          this.images.push({url: event.target.result, name: reader['fileName']});
          this.imageForm.patchValue({
            imgFileSource: this.images
          });
        }
        reader.readAsDataURL(events.target.files[i]);
      }
      this.attachment.nativeElement.value = '';
    }
  }

  onDocFileChange(event: any) {
    debugger
    let files = event.target.files;
    let type: string;
    if (files && files[0]) {
      let filesAmount = files.length;
      for (let i = 0; i < filesAmount; i++) {
        let file = files[i];
        console.log(file)
        if (file) {
          let pdf = (/\.(pdf)$/i);
          type = file.name.toLowerCase();
          if (pdf.exec(type)) {
            type = "pdf";
          }
          this.Filename=file.name.toLowerCase();
          type=file.type
          this.onAddDocument(this.Filename,type);
        }
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.docsArray.push({ doc: event.target.result, type: type });
          this.docsForm.patchValue({
            docFileSource: this.docsArray
          });
        }
        reader.readAsDataURL(event.target.files[i]);
      }
      // this.attachment.nativeElement.value = '';

      this.Filename=this.docsForm.get('docFileSource')?.value
      console.log(this.Filename)
    }
  }
  
  getHospitalList1() {
    this._opappointmentService.getHospitalCombo().subscribe(data => {
      this.HospitalList1 = data;
      this.VisitFormGroup.get('HospitalId').setValue(this.HospitalList1[0]);
    })
  }
  nextClicked(formGroupName) {
    if (formGroupName.invalid) {
      const controls = formGroupName.controls;
      Object.keys(controls).forEach(controlsName => {
        const controlField = formGroupName.get(controlsName);
        if (controlField && controlField.invalid) {
          //  Swal.fire('Error !', controlsName, 'error');
          controlField.markAsTouched({ onlySelf: true });
        }
      });
      return;
    }
    if (formGroupName == this.VisitFormGroup) {
      if (!this.isDepartmentSelected) {
        return;
      }
      this.submitAppointForm();
      return;
    }
    this.appointmentFormStepper.next();
  }
  getSubTPACompList() {
    this._opappointmentService.getSubTPACompCombo().subscribe(data => { this.SubTPACompList = data; })
  }
  onDoctorOneChange(value) {
    console.log(this.VisitFormGroup.get('DoctorIdOne').value.reset(''));
  }

  backClicked() {
    this.appointmentFormStepper.previous();
  }

  onClose() {

    //this._opappointmentService.mySaveForm.reset();

  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  get showNameEditor() {
    return this.editor === 'name';
  }
  removeImage(url: string) {
    let index = this.images.indexOf(url);
    this.images.splice(index, 1);
  }

  removeDoc(ele: DocData) {
    let index = this.docsArray.indexOf(ele);
    this.docsArray.splice(index, 1);
  }

  onViewImage(ele: any, type: string) {
    debugger
    let fileType;
    if (ele) {
        console.log(ele);
      const dialogRef = this.matDialog.open(ImageViewComponent,
        {
          width: '900px',
          height: '900px',
          data: {
            docData: type == 'img' ? ele : ele.doc,
            type: type == 'img' ? "image" : ele.type
          }
        }
      );
      dialogRef.afterClosed().subscribe(result => {

      });
    }
  }

  onSubmitImgFiles() {
    let imgFiles = this.imageForm.get('imgFileSource')?.value;
    if(imgFiles && imgFiles.length > 0) {
      imgFiles.forEach((element, index) => {
        element.name = this.imgArr[index];
      });
    }
    console.log(this.imageForm.get('imgFileSource')?.value);
  }

  onSubmitDocFiles() {
    console.log(this.docsForm.get('docFileSource')?.value);
  
   
      var m_data = {
          feedbackInsert: {
              PatientName: this.PatientName,
              RegNo:this.RegId,
              DocumentName: this.docsForm.get('docFileSource')?.value,
              // ReceptionEnquiry:
              //     this.feedbackFormGroup.get("recpRadio").value,
              // SignBoards: this.feedbackFormGroup.get("signRadio").value,
              // StaffBehaviour:
              //     this.feedbackFormGroup.get("staffBehvRadio").value,
              // ClinicalStaff:
              //     this.feedbackFormGroup.get("clinicalStaffRadio").value,
              // DoctorsTreatment:
              //     this.feedbackFormGroup.get("docTreatRadio").value,
              // Cleanliness: this.feedbackFormGroup.get("cleanRadio").value,
              // Radiology:
              //     this.feedbackFormGroup.get("radiologyRadio").value,
              // Pathology:
              //     this.feedbackFormGroup.get("pathologyRadio").value,
              // Security: this.feedbackFormGroup.get("securityRadio").value,
              // Parking: this.feedbackFormGroup.get("parkRadio").value,
              // Pharmacy: this.feedbackFormGroup.get("pharmaRadio").value,
              // Physiotherapy:
              //     this.feedbackFormGroup.get("physioRadio").value,
              // Canteen: this.feedbackFormGroup.get("canteenRadio").value,
              // SpeechTherapy:
              //     this.feedbackFormGroup.get("speechRadio").value,
              // Dietation: this.feedbackFormGroup.get("dietRadio").value,
              // comment: this.feedbackFormGroup
              //     .get("commentText")
              //     .value.trim(),
          },
      };
      console.log(m_data);
      this._AppointmentSreviceService.documentuploadInsert(m_data).subscribe((data) => {
          if(data){
            Swal.fire("Document uploaded Successfully  ! ");
          }
        
      });

  }

//   CameraComponent

  openCamera(type: string) {
    let fileType;
    const dialogRef = this.matDialog.open(ImageViewComponent,
      {
        width: '800px',
        height: '550px',
        data: {
          docData: type == 'camera' ? 'camera' : '',
          type: type == 'camera' ? 'camera' : ''
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.imgArr.push(result.name);
        this.images.push(result);
      }
    });
  }



  onAddDocument(name,type) {
debugger

    this.isLoading = 'save';
    // if (this.SrvcName && (parseInt(this.b_price) != 0) && this.b_qty) {
    
      this.dataSource1.data = [];
      this.doclist.push(
        {
          DocumentName:name,// this.imageForm.get('imgFileSource')?.value,
          DocumentPath:type// this.imageForm.get('imgFileSource')?.value,
         
        });
      this.isLoading = '';
      this.dataSource1.data = this.doclist;
      
    }
   
  // }


  deleteTableRow(element) {
    let index = this.doclist.indexOf(element);
    if (index >= 0) {
      this.doclist.splice(index, 1);
      this.dataSource1.data = [];
      this.dataSource1.data = this.doclist;
    }
    Swal.fire('Success !', 'Document Row Deleted Successfully', 'success');
  }


  Billpayment(contact){
    let xx = {
      RegNo: contact.RegId,
      // RegId: contact.RegId,
      AdmissionID: contact.VisitId,
      PatientName: contact.PatientName,
      Doctorname: contact.Doctorname,
      AdmDateTime: contact.AdmDateTime,
      AgeYear: contact.AgeYear,
      ClassId: contact.ClassId,
      ClassName: contact.ClassName,
      TariffName: contact.TariffName,
      TariffId: contact.TariffId
    };
    this.advanceDataStored.storage = new SearchInforObj(xx);

     const dialogRef = this._matDialog.open(OPBillingComponent,
        {
          maxWidth: "90%",
        
          height: '695px !important',
          // data: {
          //   advanceObj: PatientHeaderObj,
          //   FromName: "OP-Bill"
          // }
        });

    dialogRef.afterClosed().subscribe(result => {

       });
  
}

}

export class DocumentUpload {
  DocumentName: any;
  DocumentPath: string;
 
  constructor(DocumentUpload) {
    {
      this.DocumentName = DocumentUpload.DocumentName || '';
      this.DocumentPath = DocumentUpload.DocumentPath || '';
     
    }
  }
}

export class VisitMaster {
    VisitId: Number;
    PrefixId: number;
    RegNoWithPrefix: number;
    PatientName: string;
    VisitDate: Date;
    VisitTime: Time;
    HospitalID: number;
    HospitalName: string;
    PatientTypeID: number;
    PatientTypeId: number;
    PatientType: string;
    CompanyId: number;
    OPDNo: string;
    TariffId: number;
    TariffName: string;
    ConsultantDocId: number;
    RefDocId: number;
    Doctorname: string;
    RefDocName: string;
    DepartmentId: number;
    appPurposeId: number;
    patientOldNew: Boolean;
    isMark: boolean;
    isXray: boolean;
    AddedBy: number;
    MPbillNo: number;
    RegNo: any;
    /**
     * Constructor
     *
     * @param VisitMaster
     */
    constructor(VisitMaster) {
        {
            this.VisitId = VisitMaster.VisitId || "";
            (this.PrefixId = VisitMaster.PrefixId || ""),
                (this.RegNoWithPrefix = VisitMaster.RegNoWithPrefix || "");
            this.PatientName = VisitMaster.PatientName || "";
            this.VisitDate = VisitMaster.VisitDate || "";
            this.VisitTime = VisitMaster.VisitTime || "";
            this.HospitalID = VisitMaster.HospitalID || "";
            this.HospitalName = VisitMaster.HospitalName || "";
            this.PatientTypeID = VisitMaster.PatientTypeID || "";
            this.PatientTypeId = VisitMaster.PatientTypeId || "";
            this.PatientType = VisitMaster.PatientType || "";
            this.CompanyId = VisitMaster.CompanyId || "";
            this.TariffId = VisitMaster.TariffId || "";
            this.OPDNo = VisitMaster.OPDNo || "";
            this.ConsultantDocId = VisitMaster.ConsultantDocId || "";
            this.Doctorname = VisitMaster.Doctorname || "";
            this.RefDocId = VisitMaster.VisitTime || "";
            this.RefDocName = VisitMaster.RefDocName || "";
            this.DepartmentId = VisitMaster.DepartmentId || "";
            this.patientOldNew = VisitMaster.patientOldNew || "";
            this.isXray = VisitMaster.isXray || "";
            this.AddedBy = VisitMaster.AddedBy || "";
            this.MPbillNo = VisitMaster.MPbillNo || "";
            this.RegNo = VisitMaster.RegNo || "";
        }
    }
}

export class RegInsert {
    RegId: Number;
    RegDate: Date;
    RegTime: Time;
    PrefixId: number;
    PrefixID: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Address: string;
    City: string;
    PinNo: string;
    RegNo: string;
    DateofBirth: Date;
    Age: any;
    GenderId: Number;
    PhoneNo: string;
    MobileNo: string;
    AddedBy: number;
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    CountryId: number;
    StateId: number;
    CityId: number;
    MaritalStatusId: number;
    IsCharity: Boolean;
    ReligionId: number;
    AreaId: number;
    VillageId: number;
    TalukaId: number;
    PatientWeight: number;
    AreaName: string;
    AadharCardNo: string;
    PanCardNo: string;
    currentDate = new Date();
    /**
     * Constructor
     *
     * @param RegInsert
     */

    constructor(RegInsert) {
        {
            this.RegId = RegInsert.RegId || "";
            this.RegDate = RegInsert.RegDate || "";
            this.RegTime = RegInsert.RegTime || "";
            this.PrefixId = RegInsert.PrefixId || "";
            this.PrefixID = RegInsert.PrefixID || "";
            this.FirstName = RegInsert.FirstName || "";
            this.MiddleName = RegInsert.MiddleName || "";
            this.LastName = RegInsert.LastName || "";
            this.Address = RegInsert.Address || "";
            this.City = RegInsert.City || "";
            this.PinNo = RegInsert.PinNo || "";
            this.DateofBirth = RegInsert.DateofBirth || this.currentDate;
            this.Age = RegInsert.Age || "";
            this.GenderId = RegInsert.GenderId || "";
            this.PhoneNo = RegInsert.PhoneNo || "";
            this.MobileNo = RegInsert.MobileNo || "";
            this.AddedBy = RegInsert.AddedBy || "";
            this.AgeYear = RegInsert.AgeYear || "";
            this.AgeMonth = RegInsert.AgeMonth || "";
            this.AgeDay = RegInsert.AgeDay || "";
            this.CountryId = RegInsert.CountryId || "";
            this.StateId = RegInsert.StateId || "";
            this.CityId = RegInsert.CityId || "";
            this.MaritalStatusId = RegInsert.MaritalStatusId || "";
            this.IsCharity = RegInsert.IsCharity || "";
            this.ReligionId = RegInsert.ReligionId || "";
            this.AreaId = RegInsert.AreaId || "";
            this.VillageId = RegInsert.VillageId || "";
            this.TalukaId = RegInsert.TalukaId || "";
            this.PatientWeight = RegInsert.PatientWeight || "";
            this.AreaName = RegInsert.AreaName || "";
            this.AadharCardNo = RegInsert.AadharCardNo || "";
            this.PanCardNo = RegInsert.PanCardNo || "";
        }
    }
}

export class AdvanceDetailObj {
    RegNo: Number;
    RegId: number;
    AdmissionID: Number;
    PatientName: string;
    Doctorname: string;
    DoctorName: string;
    AdmDateTime: string;
    AgeYear: number;
    ClassId: number;
    TariffName: String;
    TariffId: number;
    opD_IPD_Type: number;
    VisitId: number;
    storage: any;
    IPDNo: any;
    RefDoctorId: any;
    DoctorId: any;
    OPD_IPD_ID: any;
    RefDocName: any;
    WardName: any;
    BedName: any;
    /**
     * Constructor
     *
     * @param AdvanceDetailObj
     */
    constructor(AdvanceDetailObj) {
        {
            this.RegNo = AdvanceDetailObj.RegNo || "";
            this.RegId = AdvanceDetailObj.RegId || "";
            this.VisitId = AdvanceDetailObj.VisitId || "";
            this.AdmissionID = AdvanceDetailObj.AdmissionID || "";
            this.PatientName = AdvanceDetailObj.PatientName || "";
            this.Doctorname = AdvanceDetailObj.Doctorname || "";
            this.DoctorName = AdvanceDetailObj.DoctorName || "";
            this.AdmDateTime = AdvanceDetailObj.AdmDateTime || "";
            this.AgeYear = AdvanceDetailObj.AgeYear || "";
            this.ClassId = AdvanceDetailObj.ClassId || "";
            this.TariffName = AdvanceDetailObj.TariffName || "";
            this.TariffId = AdvanceDetailObj.TariffId || "";
            this.opD_IPD_Type = AdvanceDetailObj.opD_IPD_Type || 0;
            this.IPDNo = AdvanceDetailObj.IPDNo || "";
            this.RefDoctorId = AdvanceDetailObj.RefDoctorId || 0;
            this.DoctorId = AdvanceDetailObj.DoctorId || 0;
            this.OPD_IPD_ID = AdvanceDetailObj.OPD_IPD_ID || 0;
            this.RefDocName = AdvanceDetailObj.RefDocName || "";
            this.WardName = AdvanceDetailObj.WardName || "";
            this.BedName = AdvanceDetailObj.BedName || "";
        }
    }
}
