import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { AdvanceDataStored } from '../../advance';
import { DatePipe, Time } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AdmissionService } from './admission.service';
import Swal from 'sweetalert2';
import { EditAdmissionComponent } from './edit-admission/edit-admission.component';
import { fuseAnimations } from '@fuse/animations';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { SubCompanyTPAInfoComponent } from './sub-company-tpainfo/sub-company-tpainfo.component';
import { MLCInformationComponent, MlcDetail } from './mlcinformation/mlcinformation.component';
import { AdmissionNewComponent } from './admission-new/admission-new.component';
import { AdmissionViewComponent } from './admission-view/admission-view.component';
import { NewAdmissionComponent } from './new-admission/new-admission.component';
import { RegAdmissionComponent } from '../reg-admission/reg-admission.component';
import { OPIPPatientModel } from '../../ipdsearc-patienth/ipdsearc-patienth.component';
import { MatStepper } from '@angular/material/stepper';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RFC_2822 } from 'moment';
import { MatSelect } from '@angular/material/select';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { IPBillingComponent } from '../../ip-search-list/ip-billing/ip-billing.component';
import { NewRegistrationComponent } from 'app/main/opd/registration/new-registration/new-registration.component';
import { RegistrationService } from 'app/main/opd/registration/registration.service';
import { EditRefraneDoctorComponent } from 'app/main/opd/appointment/edit-refrane-doctor/edit-refrane-doctor.component';
import { EditConsultantDoctorComponent } from 'app/main/opd/appointment/edit-consultant-doctor/edit-consultant-doctor.component';
import { CompanyInformationComponent } from '../../company-information/company-information.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { ThemeService } from 'ng2-charts';
import { AdvanceDetailObj } from '../../ip-search-list/ip-search-list.component';
import { OPIPFeedbackComponent } from '../../Feedback/opip-feedback/opip-feedback.component';
import { ParameterDescriptiveMasterComponent } from 'app/main/setup/department/parameter-descriptive-master/parameter-descriptive-master.component';
import { OperatorComparer } from 'app/core/models/gridRequest';


@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AdmissionComponent implements OnInit {


  currentDate = new Date();
  // reportPrintObj: Admission;
  searchFormGroup: FormGroup;

  screenFromString = 'admission-form';
  selectedAdvanceObj: AdmissionPersonlModel;
  newRegSelected: any = 'registration';

  hasSelectedContacts: boolean;
  SpinLoading: boolean = false;
  isLoadings = false;
  disabled = false;
  isAlive = false;
  isOpen = false;

  filteredOptions: any;
  showtable: boolean = false;
  noOptionFound: boolean = false;
  Regdisplay: boolean = false;

  isLinear = true;
  submitted = false;
  AdList: boolean = false;
  saveflag: boolean = false;
  capturedImage: any;
  registration: any;


  Vtotalcount = 0;
  VNewcount = 0;
  VFollowupcount = 0;
  VBillcount = 0;
  VOPtoIPcount = 0;
  vIsDischarg = 0;
  VAdmissioncount = 0;
  PatientName: any;
  RegId: any;
  RegNo: any = "0";
  DoctorId: any = 0;
  AdmittedPatientList: any;
  msg: any;
  sIsLoading: string = '';
  savedValue: number = null;
  loadID = 0;
  Todate: any;
  ConfigCityId = 2;



  options = [];
  V_SearchRegList: any = [];


  registerObj = new AdmissionPersonlModel({});
  MlcObj = new MlcDetail({})
  bedObj = new Bed({});



  filteredOptionssearchDoctor: Observable<string[]>;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  @Output() sentCountsToParent = new EventEmitter<any>();

  @Input() panelWidth: string | number;
  @ViewChild('admissionFormStepper') admissionFormStepper: MatStepper;
  @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;

  // filter for doctor
  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  @Inject(MAT_DIALOG_DATA) public data: any;

  private _onDestroy = new Subject<void>();

  displayedColumns = [
    // "useraction",
    // "IsMLC",


    "regNo",
    "patientName",
    'admissionTime',

    'doctorname',
    'refDocName',
    'ipdno',
    'patientTypeID',
    'roomName',
    'tariffName',
    'className',
    'companyName',
    'relativeName',
    'buttons'
  ];


  dataSource = new MatTableDataSource<Admission>();
  searchDoctorList: any = [];
  // dataSource1 = new MatTableDataSource<OPIPPatientModel>();

  menuActions: Array<string> = [];
  centered = false;
  unbounded = false;

  // Checking dropdown validation
  vPrefixID: any = 0;
  vMaritalStatusId: any = 0;
  vReligionId: any = 0;
  vAreaId: any = 0;
  vCityId: any = 0;

  vPatientTypeID: any = 0;
  vTariffId: any = 0;
  vDoctorId: any = 0;
  vDoctorID: any = 0;
  vDepartmentid: any = 0;
  vCompanyId: any = 0;
  vSubCompanyId: any = 0;
  vadmittedDoctor1: any = 0;
  vadmittedDoctor2: any = 0;
  vrefDoctorId: any = 0;
  vRoomId: any = 0;
  vBedId: any = 0;
  vClassId: any = 0;
  vRelationshipId: any = 0;


  radius: number;
  color: string;
  filteredDoctor: any;
  dialogRef: any;
  isLoading: string;
  Regflag: boolean = false;

  // new Api
  autocompleteModedeptdoc: string = "ConDoctor";
  optionsSearchDoc: any[] = [];

  constructor(public _AdmissionService: AdmissionService,
    public _registrationService: RegistrationService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    private _fuseSidebarService: FuseSidebarService,
    private accountService: AuthenticationService,
    public datePipe: DatePipe,
    private router: Router,
    private reportDownloadService: ExcelDownloadService,
    private formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored) {

    // this.getRegSearchList();
  }

  ngOnInit(): void {
    this.getAdmittedPatientList_1()

    if (this.data) {

      this.registerObj = this.data.registerObj;
      this.DoctorId = this.data.registerObj.DoctorId;

    }

    this.isAlive = true;


    this.searchFormGroup = this.createSearchForm();

    this.getDoctorList();

  }



  Admissiondetail(data) {
    this.Vtotalcount = 0;
    this.VNewcount = 0;
    this.VFollowupcount = 0;
    this.VBillcount = 0;
    this.vIsDischarg = 0;
    this.VOPtoIPcount = 0;
    console.log(data)
    this.Vtotalcount;

    for (var i = 0; i < data.length; i++) {

      if (data[i].IsOpToIPconv == true) {
        this.VOPtoIPcount = this.VOPtoIPcount + 1;
        console.log(this.VOPtoIPcount)
      } else if (data[i].IsDischarged == 1) {
        this.vIsDischarg = this.vIsDischarg + 1;
      }
      this.Vtotalcount = this.Vtotalcount + 1;
    }

  }

  getOptionTextsearchDoctor(option) {
    return option && option.Doctorname ? option.Doctorname : '';
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
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.optionsSearchDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }

  }

  selectChangedeptdoc(obj: any) {
    console.log(obj);

  }

  getValidationdoctorMessages() {
    return {
      searchDoctorId: [
        { name: "required", Message: "Doctor Name is required" }
      ]
    };
  }

  ngOnDestroys() {
    this.isAlive = false;
  }


  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      // RegId: [{ value: '', disabled: this.isRegSearchDisabled }],
      HospitalId: [0, [Validators.required]]
    });
  }


  getSearchList() {
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%` || '%'
    }
    if (this.searchFormGroup.get('RegId').value.length >= 1) {
      this._AdmissionService.getRegistrationList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        this.V_SearchRegList = this.filteredOptions;
        console.log(this.V_SearchRegList)
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }

  }





  getSelectedObj(obj) {

    this.registerObj = new AdmissionPersonlModel({});

    obj.AgeDay = obj.AgeDay.trim();
    obj.AgeMonth = obj.AgeMonth.trim();
    obj.AgeYear = obj.AgeYear.trim();
    this.registerObj = obj;
    console.log(this.registerObj);

    this.PatientName = obj.PatientName;
    this.RegId = obj.RegId;
    this.RegNo = obj.RegNo;


  }

  AdmittedRegId: any = 0;
  chekAdmittedpatient(obj) {

    this.AdmittedRegId = obj.RegId;

    let Query = "select isnull(RegID,0) as RegID from Admission where RegID =  " + this.AdmittedRegId + " and Admissionid not in(select Admissionid from Discharge) "
    console.log(Query)
    this._AdmissionService.getRegIdDetailforAdmission(Query).subscribe(data => {
      this.registerObj = data[0];
      console.log(this.registerObj);
      if (this.registerObj != undefined) {
        this.AdmittedRegId = 0;
        Swal.fire("selected patient is already admitted!!..")

      } else {
        this.getSelectedObj(obj);
      }
    });

  }


  // onChangeReg(event) {
  //   if (event.value == 'registration') {
  //     this.Regflag = false;
  //     this.personalFormGroup.get('RegId').reset();
  //     this.personalFormGroup.get('RegId').disable();
  //     this.isRegSearchDisabled = true;
  //     this.registerObj = new AdmissionPersonlModel({});
  //     this.personalFormGroup.reset();

  //     this.personalFormGroup = this.createPesonalForm();
  //     this.personalFormGroup.markAllAsTouched();

  //     this.hospitalFormGroup = this.createHospitalForm();
  //     this.hospitalFormGroup.markAllAsTouched();

  //     this.wardFormGroup = this.wardForm();
  //     this.wardFormGroup.markAllAsTouched();

  //     this.otherFormGroup = this.otherForm();
  //     this.otherFormGroup.markAllAsTouched()

  //     this.getPrefixList();
  //     this.getHospitalList();
  //     this.getPrefixList();
  //     this.getPatientTypeList();
  //     this.getTariffList();
  //     this.getAreaList();
  //     this.getMaritalStatusList();
  //     this.getReligionList();
  //     this.getDepartmentList();
  //     this.getRelationshipList();

  //     this.getDoctorList();
  //     this.getDoctor1List();
  //     this.getDoctor2List();
  //     this.getWardList();
  //     this.getCompanyList();
  //     this.getSubTPACompList();
  //     this.getcityList1();


  //     this.Regdisplay = false;
  //     this.showtable = false;

  //   } else {
  //     this.Regdisplay = true;
  //     this.Regflag = true;
  //     this.searchFormGroup.get('RegId').enable();
  //     this.isRegSearchDisabled = false;

  //     this.personalFormGroup = this.createPesonalForm();
  //     this.personalFormGroup.markAllAsTouched();

  //     this.hospitalFormGroup = this.createHospitalForm();
  //     this.hospitalFormGroup.markAllAsTouched();

  //     this.wardFormGroup = this.wardForm();
  //     this.wardFormGroup.markAllAsTouched();

  //     this.otherFormGroup = this.otherForm();
  //     this.otherFormGroup.markAllAsTouched();

  //     this.getPrefixList();
  //     this.getHospitalList();
  //     this.getPrefixList();
  //     this.getPatientTypeList();
  //     this.getTariffList();
  //     this.getAreaList();
  //     this.getMaritalStatusList();
  //     this.getReligionList();
  //     this.getDepartmentList();
  //     this.getRelationshipList();

  //     this.getDoctorList();
  //     this.getDoctor1List();
  //     this.getDoctor2List();
  //     this.getWardList();
  //     this.getCompanyList();
  //     this.getSubTPACompList();
  //     this.getcityList1();

  //        this.showtable = true;
  //   }

  //   const todayDate = new Date();
  //   const dob = new Date(this.currentDate);
  //   const timeDiff = Math.abs(Date.now() - dob.getTime());
  //   this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
  //   this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
  //   this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
  //   this.registerObj.DateofBirth = this.currentDate;
  //   this.personalFormGroup.get('DateOfBirth').setValue(this.currentDate);

  // }

  item1: any;
  item2: any;
  onClick(event: any) {
    this.item1 = "";
    event.stopPropagation();
  }




  onClose() {

    this.searchFormGroup.get('RegId').reset();
    this.searchFormGroup.get('RegId').disable();


  }
  onEdit(row) {

    this.registerObj = row;
    this.getSelectedObj(row);
  }



  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  resultsLength = 0;
  fname = "%"
  lname = "%"
  mname = "%"
  fromdate = "11/11/2022"
  todate = "11/11/2024"
  IPNo = "0"
  Doctor = 0
  searchDoctorId = "0";
  getAdmittedPatientList_1() {
    // this.fname=this._AdmissionService.myFilterform.get("FirstName").value
    // this.lname=this._AdmissionService.myFilterform.get("LastName").value
    // this.mname=this._AdmissionService.myFilterform.get("MiddleName").value
    // this.fromdate=this._AdmissionService.myFilterform.get("start").value
    // this.todate=this._AdmissionService.myFilterform.get("end").value
    // this.RegNo=this._AdmissionService.myFilterform.get("RegNo").value
    // this.DoctorId=this._AdmissionService.myFilterform.get("DoctorId").value
    // this.IPNo=this._AdmissionService.myFilterform.get("IPDNo").value


    var Param = {
      sortField: "AdmissionId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: this.fname, opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: this.lname, opType: OperatorComparer.Contains },
        { fieldName: "Reg_No", fieldValue: this.RegNo, opType: OperatorComparer.Equals },
        { fieldName: "Doctor_Id", fieldValue: this.searchDoctorId, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromdate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.todate, opType: OperatorComparer.Equals },
        { fieldName: "Admtd_Dschrgd_All", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "M_Name", fieldValue: this.lname, opType: OperatorComparer.Contains },
        { fieldName: "IPNo", fieldValue: this.IPNo, opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }

      ],
      "exportType": "JSON"
    }
    console.log(Param);
    this._AdmissionService.getAdmittedPatientListNew(Param).subscribe(data => {
      this.dataSource.data = data.data as Admission[];
      if (this.dataSource.data.length > 0) {
        this.Admissiondetail(this.dataSource.data);
      }
      this.dataSource.sort = this.sort;
      console.log(data)
      this.resultsLength = data.data.length;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }




  getAdmittedPatientListview() {
    // this.sIsLoading = 'loading-data';

    // setTimeout(() => {

    //   this.AdList = true;
    //   this._AdmissionService.getAdmittedPatientListView(

    //     this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
    //     this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
    //     0, 0,0
    //   ).subscribe(res => {
    //     const matDialog = this._matDialog.open(PdfviewerComponent,
    //       {
    //         maxWidth: "85vw",
    //         height: '750px',
    //         width: '100%',
    //         data: {
    //           base64: res["base64"] as string,
    //           title: "Admission List  Viewer"
    //         }
    //       });

    //     matDialog.afterClosed().subscribe(result => {
    //       this.AdList = false;
    //       this.sIsLoading = ' ';
    //     });
    //   });

    // }, 100);

  }



  getAdmittedPatientCasepaperview(AdmissionId, flag) {
    this.sIsLoading = 'loading-data';
    debugger
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



  getAdmittedPatientCasepaperTempview(AdmissionId, flag) {
    this.sIsLoading = 'loading-data';
    debugger
    let AdmissionID
    if (flag) {
      AdmissionID = AdmissionId
    } else {
      AdmissionID = AdmissionId.AdmissionID
    }

    // setTimeout(() => {
    //   this.SpinLoading = true;
    //   this.AdList = true;
    //   this._AdmissionService.getAdmittedPatientCasepaapertemplateView(
    //     AdmissionID
    //   ).subscribe(res => {
    //     const matDialog = this._matDialog.open(PdfviewerComponent,
    //       {
    //         maxWidth: "85vw",
    //         height: '750px',
    //         width: '100%',
    //         data: {
    //           base64: res["base64"] as string,
    //           title: "Admission Paper  Viewer"
    //         }
    //       });

    //     matDialog.afterClosed().subscribe(result => {
    //       this.AdList = false;
    //       this.sIsLoading = ' ';
    //     });
    //   });

    // }, 100);
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


  NewMLc(contact) {

    this.advanceDataStored.storage = new AdmissionPersonlModel(contact);
    this._AdmissionService.populateForm(contact);
    const dialogRef = this._matDialog.open(MLCInformationComponent,
      {
        maxWidth: '85vw',
        height: '600px', width: '100%',
        data: {
          registerObj: contact,
        },
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }


  getMLCdetailview(Id) {
    // this.sIsLoading = 'loading-data';

    setTimeout(() => {

      this._AdmissionService.getMLCDetailView(Id
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "MLC Detail Viewer"
            }
          });

        matDialog.afterClosed().subscribe(result => {
          // this.AdList = false;
          // this.sIsLoading = ' ';
        });
      });

    }, 100);

  }



  getRecord(contact, m): void {

    if (m == "Edit Admission") {
      let Regdata;
      this._AdmissionService.getRegdata(contact.RegID).subscribe(data => {
        Regdata = data as RegInsert[];

      },
        error => {
          this.sIsLoading = '';
        });

      const dialogRef = this._matDialog.open(RegAdmissionComponent,
        {
          maxWidth: '95vw',

          height: '900px', width: '100%',
          data: {
            PatObj: Regdata
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }

    else if (m == "Update TPA Company Information") {


      this.advanceDataStored.storage = new AdmissionPersonlModel(contact);
      this._AdmissionService.populateForm(contact);
      const dialogRef = this._matDialog.open(SubCompanyTPAInfoComponent,
        {
          maxWidth: '85vw',
          height: '600px', width: '100%',
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    } else if (m == "Update Consultant Doctor") {

      var m_data2 = {
        RegId: contact.RegID,
        PatientName: contact.PatientName,
        AdmissionID: contact.AdmissionID,
        OPD_IPD_Id: contact.AdmissionID,
        DoctorId: contact.DoctorId,
        DoctorName: contact.Doctorname,
      };
      this._registrationService.populateFormpersonal(m_data2);
      const dialogRef = this._matDialog.open(EditConsultantDoctorComponent,
        {
          maxWidth: "70vw",
          height: "410px",
          width: "70%",
          data: {
            registerObj: m_data2,
            FormName: "Admission"
          },
        }
      );
      dialogRef.afterClosed().subscribe((result) => {

      });
    } else if (m == "Update Referred Doctor") {

      var m_data3 = {
        RegId: contact.RegID,
        PatientName: contact.PatientName,
        AdmissionID: contact.AdmissionID,
        OPD_IPD_Id: contact.AdmissionID,
        RefDoctorId: contact.RefDocId,
        RefDocName: contact.RefDocName,
        VisitId: contact.VisitId,
      };
      this._registrationService.populateFormpersonal(m_data3);
      const dialogRef = this._matDialog.open(EditRefraneDoctorComponent, {
        maxWidth: "70vw",
        height: "410px",
        width: "70%",
        data: {
          registerObj: m_data3,
          FormName: "Admission"
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed - Insert Action", result);
      });
    }

  }



  EditRegistration(row) {

    this.advanceDataStored.storage = new AdmissionPersonlModel(row);
    console.log(row)
    this._registrationService.populateFormpersonal(row);
    this.registerObj["RegId"] = row.RegID;
    this.registerObj["RegID"] = row.RegID;
    this.registerObj["PrefixID"] = row.PrefixId;
debugger
    const dialogRef = this._matDialog.open(NewRegistrationComponent,
      {
        maxWidth: "90vw",
        height: '450px',
        width: '100%',
        data:row
        //  {
        //   data: row,
        //   Submitflag: true
        // }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      // this.getAdmittedPatientList_1();

    });

  }
  getEditAdmission(row) {

    this.advanceDataStored.storage = new AdmissionPersonlModel(row);
    console.log(row)
    this._registrationService.populateFormpersonal(row);
    this.registerObj["RegId"] = row.RegID;
    this.registerObj["RegID"] = row.RegID;
    const dialogRef = this._matDialog.open(EditAdmissionComponent,
      {
        maxWidth: "90vw",
        height: '650px',
        width: '100%',
        data: {
          registerObj: row,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getAdmittedPatientList_1();

    });

  }

  getEditCompany(row) {

    this.advanceDataStored.storage = new AdmissionPersonlModel(row);
    console.log(row)
    this._registrationService.populateFormpersonal(row);
    this.registerObj["RegId"] = row.RegID;
    this.registerObj["RegID"] = row.RegID;

    const dialogRef = this._matDialog.open(CompanyInformationComponent,
      {
        maxWidth: "70vw",
        height: '740px',
        width: '100%',
        data: {
          registerObj: row,
          Submitflag: true
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getAdmittedPatientList_1();

    });
  }
  dateStyle?: string = 'Date';
  OnChangeDobType(e) {
    this.dateStyle = e.value;
  }


  feedback(contact) {

    this.advanceDataStored.storage = new AdvanceDetailObj(contact);
    this._AdmissionService.populateForm(contact);
    const dialogRef = this._matDialog.open(OPIPFeedbackComponent,
      {
        maxWidth: "95vw",
        maxHeight: "115vh", width: '100%', height: "100%",
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);

    });


  }
}

export class Admission {
  AdmissionID: Number;
  RegID: number;
  AdmissionDate: any;
  RegNo: number;
  AdmissionTime: any;
  PatientTypeID: number;
  HospitalID: number;
  HospitalName: any;
  HospitalAddress: any;

  Phone: number;
  EmailId: any;
  DocNameID: number;
  RefDocNameID: number;
  RefDoctorName: any;
  RoomId: number;
  BedId: number;
  DischargeDate: Date;
  DischargeTime: Time;
  IsDischarged: number;
  IsBillGenerated: number;
  CompanyId: number;
  TariffId: number;
  ClassId: number;
  DepartmentId: number;
  RelativeName: string;
  RelativeAddress: string;
  RelativePhoneNo: string;
  PhoneNo: string;
  RelationshipId: number;
  AdmittedDoctor1: number;
  AdmittedDoctor2: number;
  SubTPAComp: number;
  IsReimbursement: boolean;
  MobileNo: number;
  PrefixID: number;
  PrefixName: string;
  AddedBy: number;
  PatientName: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DoctorId: number;
  DoctorName: string;
  IPDNo: number;
  DOA: any;
  DOT: Time;
  IsMLC: boolean;
  MotherName: string;
  RefDocName: string;
  PatientType: string;
  RegNoWithPrefix: number;
  CompanyName: string;
  AdmittedDoctor1ID: number;
  TariffName: string;
  RelationshipName: string;
  RoomName: string;
  DepartmentName: any;
  BedName: string;
  GenderId: number;
  GenderName: string;
  AdmDateTime: Date;
  ChargesAmount: number;
  AdvanceAmount: number;
  AdmittedPatientBalanceAmount: number;
  Age: number;
  AgeDay: number;
  AgeMonth: number;
  SubCompanyId: any;
  AdmittedDoctorName: any;
  PatientTypeId: any;
  IsOpToIPconv: any;

  /**
* Constructor
*
* @param Admission
*/
  constructor(Admission) {
    {
      this.AdmissionID = Admission.AdmissionID || '';
      this.RegID = Admission.RegID || '';
      this.AdmissionDate = Admission.AdmissionDate || '';
      this.AdmissionTime = Admission.AdmissionTime || '';
      this.PatientTypeID = Admission.PatientTypeID || '';
      this.HospitalID = Admission.HospitalID || '';
      this.EmailId = Admission.EmailId || '';
      this.Phone = Admission.Phone || 0;
      this.DocNameID = Admission.DocNameID || '';
      this.RefDocNameID = Admission.RefDocNameID || '';
      this.DischargeDate = Admission.DischargeDate || '';
      this.DischargeTime = Admission.DischargeTime || '';
      this.IsDischarged = Admission.IsDischarged || '';
      this.IsBillGenerated = Admission.IsBillGenerated || '';
      this.CompanyId = Admission.CompanyId || 0;
      this.ClassId = Admission.ClassId || 0;
      this.DepartmentId = Admission.DepartmentId || 0;
      this.RelativeName = Admission.RelativeName || '';
      this.RelativeAddress = Admission.RelativeAddress || '';
      this.RelativePhoneNo = Admission.RelativePhoneNo || 0;
      this.PhoneNo = Admission.PhoneNo || '';
      this.MobileNo = Admission.MobileNo || '';
      this.RelationshipId = Admission.RelationshipId || '';
      this.AddedBy = Admission.AddedBy || '';
      this.IsMLC = Admission.IsMLC || '';
      this.MotherName = Admission.MotherName || '';
      this.AdmittedDoctor1 = Admission.AdmittedDoctor1 || '';
      this.AdmittedDoctor2 = Admission.AdmittedDoctor2 || '';
      this.SubTPAComp = Admission.SubTPAComp || '';
      this.IsReimbursement = Admission.IsReimbursement || '';
      this.RefDoctorName = Admission.RefDoctorName || '';
      this.PrefixID = Admission.PrefixID || 0;
      this.PrefixName = Admission.PrefixName || '';
      this.PatientName = Admission.PatientName || '';
      this.FirstName = Admission.FirstName || '';
      this.MiddleName = Admission.MiddleName || '';
      this.LastName = Admission.LastName || '';
      this.DoctorId = Admission.DoctorId || '';
      this.DoctorName = Admission.DoctorName || '';
      this.IPDNo = Admission.IPDNo || '';

      this.GenderId = Admission.GenderId || '';
      this.GenderName = Admission.GenderName || '';

      this.DOA = Admission.DOA || '';
      this.DOT = Admission.DOT || '';
      // this.PatientTypeId = Admission.PatientTypeId || '';
      this.PatientType = Admission.PatientType || '';

      this.RefDocName = Admission.RefDocName || '';
      this.RegNoWithPrefix = Admission.RegNoWithPrefix || '';
      this.HospitalName = Admission.HospitalName || '';
      this.DepartmentName = Admission.DepartmentName || '';
      this.AdmittedDoctor1ID = Admission.AdmittedDoctor1ID || '';
      this.AdmittedDoctor1 = Admission.AdmittedDoctor1 || '';
      this.TariffId = Admission.TariffId || '';
      this.TariffName = Admission.TariffName || '';
      this.RoomId = Admission.WardId || '';
      this.RoomName = Admission.RoomName || '';
      this.BedId = Admission.BedId || '';
      this.BedName = Admission.BedName || '';
      this.AdmDateTime = Admission.AdmDateTime || '';
      this.CompanyName = Admission.CompanyName || '';
      this.RelationshipName = Admission.RelationshipName || '';
      this.HospitalAddress = Admission.HospitalAddress || '';
      this.ChargesAmount = Admission.ChargesAmount || '';
      this.AdvanceAmount = Admission.AdvanceAmount || '';
      this.AdmittedPatientBalanceAmount = Admission.AdmittedPatientBalanceAmount || '';
      this.RegNo = Admission.RegNo || '';
      this.Age = Admission.Age || '';
      this.AgeDay = Admission.AgeDay || '';
      this.AgeMonth = Admission.AgeMonth || '';
      this.SubCompanyId = Admission.SubCompanyId || 0;
      this.AdmittedDoctorName = Admission.AdmittedDoctorName || ''
      this.PatientTypeId = Admission.PatientTypeId || ''
      this.IsOpToIPconv = Admission.IsOpToIPconv || 0;
    }
  }
}

export class RegInsert {
  RegId: Number;
  RegDate: Date;
  RegTime: Time;
  PrefixId: number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Address: string;
  City: string;
  CityName: string;
  PinNo: string;
  DateofBirth: Date;
  Age: string;
  GenderId: Number;
  PhoneNo: string;
  MobileNo: string;
  AddedBy: number;
  AgeYear: string;
  AgeMonth: string;
  AgeDay: string;
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

  /**
   * Constructor
   *
   * @param RegInsert
   */

  constructor(RegInsert) {
    {
      this.RegId = RegInsert.RegId || '';
      this.RegDate = RegInsert.RegDate || '';
      this.RegTime = RegInsert.RegTime || '';
      this.PrefixId = RegInsert.PrefixId || '';
      this.FirstName = RegInsert.FirstName || '';
      this.MiddleName = RegInsert.MiddleName || '';
      this.LastName = RegInsert.LastName || '';
      this.Address = RegInsert.Address || '';
      this.City = RegInsert.City || '';
      this.PinNo = RegInsert.PinNo || '';
      this.DateofBirth = RegInsert.DateofBirth || '';
      this.Age = RegInsert.Age || '';
      this.GenderId = RegInsert.GenderId || '';
      this.PhoneNo = RegInsert.PhoneNo || '';
      this.MobileNo = RegInsert.MobileNo || '';
      this.AddedBy = RegInsert.AddedBy || '';
      this.AgeYear = RegInsert.AgeYear || '';
      this.AgeMonth = RegInsert.AgeMonth || '';
      this.AgeDay = RegInsert.AgeDay || '';
      this.CountryId = RegInsert.CountryId || '';
      this.StateId = RegInsert.StateId || '';
      this.CityId = RegInsert.CityId || '';
      this.MaritalStatusId = RegInsert.MaritalStatusId || '';
      this.IsCharity = RegInsert.IsCharity || '';
      this.ReligionId = RegInsert.ReligionId || '';
      this.AreaId = RegInsert.AreaId || '';
      this.VillageId = RegInsert.VillageId || '';
      this.TalukaId = RegInsert.TalukaId || '';
      this.PatientWeight = RegInsert.PatientWeight || '';
      this.AreaName = RegInsert.AreaName || '';
      this.AadharCardNo = RegInsert.AadharCardNo || '';
      this.PanCardNo = RegInsert.PanCardNo || '';
    }
  }
}

export class Bed {
  BedId: Number;
  BedName: string;

  /**
   * Constructor
   *
   * @param Bed
   */
  constructor(Bed) {
    {
      this.BedId = Bed.BedId || '';
      this.BedName = Bed.BedName || '';
    }
  }
}

export class AdmissionPersonlModel {
  AadharCardNo: any;
  Address: any;
  opD_IPD_Type: any;
  Age: Number;
  AgeDay: any;
  AgeMonth: any;
  AgeYear: any;
  AreaId: Number;
  CityName: string;
  CityId: Number;
  CountryId: Number;
  DateofBirth: any;
  Expr1: any;
  FirstName: string;
  GenderId: Number;
  GenderName: string;
  IsCharity: any;
  LastName: String;
  MaritalStatusId: Number;
  MiddleName: string;
  MobileNo: string;
  PanCardNo: any;
  PatientName: string;
  PhoneNo: string;
  PinNo: string;
  PrefixID: number;
  PrefixName: string;
  RDate: any;
  RegDate: any;
  RegId: Number;
  RegNo: Number;
  RegNoWithPrefix: string;
  RegTime: string;
  RegTimeDate: string;
  ReligionId: Number;
  StateId: Number;
  TalukaId: Number;
  TalukaName: string;
  VillageId: Number;
  VillageName: string;
  Departmentid: any;
  currentDate = new Date();
  AdmittedDoctor1ID: any;
  AdmittedDoctor2ID: any;
  RelationshipId: any;
  AdmissionID: any;
  AdmissionDate: Date;
  AdmissionTime: Date;
  RelativeName: String;
  DoctorId: number;
  RelatvieMobileNo: any;
  MaritalStatusName: string;
  IsMLC: any;
  CompanyName: any;
  RelationshipName: string;
  RefDoctorName: string;
  AdmittedDoctor2: any;
  AdmittedDoctor1: any;
  RefDocName: any;
  BedId: any;
  BedName: any;
  IPDNo: any;
  TariffName: any;
  DepartmentName: any;
  RefDoctorId: any;
  VisitId: any;
  CompanyId: any;
  HospitalId: any;
  PatientTypeID: any;
  PatientType: any;
  SubCompanyId: any;
  Aadharcardno: any;
  Pancardno: any;
  RelativePhoneNo: any;
  DepartmentId: any;
  IsOpToIPconv: any;
  ClassName: any;
  IsBillGenerated: any;
  RoomId: any;
  RoomName: any;
  Doctorname: any;
  AdmDateTime: any;
  TariffId: any;
  RefDocNameId: any;
  RefDocNameID: any;
  DocNameID: any;
  RelativeAddress: any;
  IsSeniorCitizen: any;
  RegID: any;
  ClassId: any;
  WardId: any;
  PolicyNo: any;
  MemberNo: any;
  // WardName:any;
  AprovAmount
  CompDOD
  IsPharClearance
  IPNumber
  EstimatedAmount
  ApprovedAmount
  HosApreAmt
  PathApreAmt
  PharApreAmt
  RadiApreAmt
  PharDisc

  ClaimNo: any;
  CompBillNo: any;
  CompBillDate: any;
  CompDiscount: any;
  CompDisDate: any;
  C_BillNo: any;
  C_FinalBillAmt: any;
  C_DisallowedAmt: any;
  HDiscAmt: any;
  C_OutsideInvestAmt: any;
  RecoveredByPatient: any;
  H_ChargeAmt: any;
  H_AdvAmt: any;
  H_BillId: any;
  H_BillDate: any;
  H_BillNo: any;
  H_TotalAmt: any;
  H_DiscAmt: any;
  H_NetAmt: any;
  H_PaidAmt: any;
  H_BalAmt: any;
  DoctorName: any;
  vOPDNo: any;
  TarrifName: any
  OPDNo: any;
  WardName: any;
  Remark: any;
  DetailGiven: any;
  OP_IP_No: any;
  OPD_IPD_ID: any;
  OPD_IPD_Type: any;
  PathReportID: any;
  AdmDocId: any;
  PathResultDr1: any;
  ServiceId: any;
  PathTestID: any;
  Adm_Visit_docId: any;
  TemplateResultInHTML: any;
  /**
* Constructor
*
* @param AdmissionPersonl
*/
  constructor(AdmissionPersonl) {
    {
      this.Departmentid = AdmissionPersonl.Departmentid || 0;
      this.AadharCardNo = AdmissionPersonl.AadharCardNo || '';
      this.opD_IPD_Type = AdmissionPersonl.opD_IPD_Type || 0
      this.Address = AdmissionPersonl.Address || '';
      this.Age = AdmissionPersonl.Age || '';
      this.AgeDay = AdmissionPersonl.AgeDay || '';
      this.AgeMonth = AdmissionPersonl.AgeMonth || '';
      this.AgeYear = AdmissionPersonl.AgeYear || '';
      this.AreaId = AdmissionPersonl.AreaId || '';
      this.CityName = AdmissionPersonl.CityName || '';
      this.CityId = AdmissionPersonl.CityId || 0;
      this.CountryId = AdmissionPersonl.CountryId || '';
      this.DateofBirth = AdmissionPersonl.DateOfBirth || this.currentDate;
      this.Expr1 = AdmissionPersonl.Expr1 || '';
      this.FirstName = AdmissionPersonl.FirstName || '';
      this.GenderId = AdmissionPersonl.GenderId || '';
      this.GenderName = AdmissionPersonl.GenderName || '';
      this.IsCharity = AdmissionPersonl.IsCharity || '';
      this.LastName = AdmissionPersonl.LastName || '';
      this.MaritalStatusId = AdmissionPersonl.MaritalStatusId || '';
      this.MiddleName = AdmissionPersonl.MiddleName || '';
      this.MobileNo = AdmissionPersonl.MobileNo || '';
      this.PanCardNo = AdmissionPersonl.PanCardNo || '';
      this.PatientName = AdmissionPersonl.PatientName || '';
      this.PhoneNo = AdmissionPersonl.PhoneNo || '';
      this.PinNo = AdmissionPersonl.PinNo || '';
      this.PrefixID = AdmissionPersonl.PrefixID || '';
      this.PrefixName = AdmissionPersonl.PrefixName || '';
      this.RDate = AdmissionPersonl.RDate || '';
      this.RegDate = AdmissionPersonl.RegDate || '';
      this.RegId = AdmissionPersonl.RegId || '';
      this.RegNo = AdmissionPersonl.RegNo || '';
      this.RegNoWithPrefix = AdmissionPersonl.RegNoWithPrefix || '';
      this.RegTime = AdmissionPersonl.RegTime || '';
      this.RegTimeDate = AdmissionPersonl.RegTimeDate || '';
      this.ReligionId = AdmissionPersonl.ReligionId || '';
      this.StateId = AdmissionPersonl.StateId || '';
      this.TalukaId = AdmissionPersonl.TalukaId || '';
      this.TalukaName = AdmissionPersonl.TalukaName || '';
      this.VillageId = AdmissionPersonl.VillageId || '';
      this.VillageName = AdmissionPersonl.VillageName || '';
      this.AdmittedDoctor1ID = AdmissionPersonl.AdmittedDoctor1ID || 0;
      this.AdmittedDoctor2ID = AdmissionPersonl.AdmittedDoctor2ID || 0;
      this.RefDocName = AdmissionPersonl.RefDocName || '';
      this.RelationshipId = AdmissionPersonl.RelationshipId || 0;
      this.AdmissionID = AdmissionPersonl.AdmissionID || 0;
      this.AdmissionDate = AdmissionPersonl.AdmissionDate || '';
      this.AdmissionTime = AdmissionPersonl.AdmissionTime || '';
      this.DoctorId = AdmissionPersonl.DoctorId || 0;
      this.RelatvieMobileNo = AdmissionPersonl.RelatvieMobileNo || '';
      this.MaritalStatusName = AdmissionPersonl.MaritalStatusName || '';
      this.IsMLC = AdmissionPersonl.IsMLC || 0;
      this.CompanyName = AdmissionPersonl.CompanyName || '';
      this.RelationshipName = AdmissionPersonl.RelationshipName || '';
      this.RefDoctorName = AdmissionPersonl.RefDoctorName || '';
      this.AdmittedDoctor2 = AdmissionPersonl.AdmittedDoctor2 || 0;
      this.AdmittedDoctor1 = AdmissionPersonl.AdmittedDoctor1 || 0;
      this.BedName = AdmissionPersonl.BedName || '';
      this.IPDNo = AdmissionPersonl.IPDNo || '';
      this.TariffName = AdmissionPersonl.TariffName || '';
      this.DepartmentName = AdmissionPersonl.DepartmentName || '';
      this.RefDoctorId = AdmissionPersonl.RefDoctorId || 0;
      this.VisitId = AdmissionPersonl.VisitId || 0;
      this.HospitalId = AdmissionPersonl.HospitalId || 0;
      this.CompanyId = AdmissionPersonl.CompanyId || 0;
      this.PatientTypeID = AdmissionPersonl.PatientTypeID || 0;
      this.PatientType = AdmissionPersonl.PatientType || '';
      this.SubCompanyId = AdmissionPersonl.SubCompanyId || 0;
      this.Aadharcardno = AdmissionPersonl.Aadharcardno || ''
      this.Pancardno = AdmissionPersonl.Pancardno || '';
      this.RefDocName = AdmissionPersonl.RefDocName || '';
      this.RelativePhoneNo = AdmissionPersonl.RelativePhoneNo || '';
      this.DepartmentId = AdmissionPersonl.DepartmentId || 0;
      this.IsOpToIPconv = AdmissionPersonl.IsOpToIPconv || 0;
      this.RelativeName = AdmissionPersonl.RelativeName || '';
      this.RelativeAddress = AdmissionPersonl.RelativeAddress || ''
      this.ClassName = AdmissionPersonl.ClassName || ''
      this.IsBillGenerated = AdmissionPersonl.IsBillGenerated || 0
      this.RoomName = AdmissionPersonl.RoomName || ''
      this.Doctorname = AdmissionPersonl.Doctorname || ''
      this.DoctorName = AdmissionPersonl.DoctorName || ''
      this.AdmDateTime = AdmissionPersonl.AdmDateTime || ''
      this.TariffId = AdmissionPersonl.TariffId || 0;
      this.RefDocNameId = AdmissionPersonl.RefDocNameId || 0
      this.RefDocNameID = AdmissionPersonl.RefDocNameID || 0
      this.DocNameID = AdmissionPersonl.DocNameID || 0
      this.IsSeniorCitizen = AdmissionPersonl.IsSeniorCitizen || 0
      this.BedId = AdmissionPersonl.BedId || 0;
      this.RegID = AdmissionPersonl.RegID || 0;
      this.ClassId = AdmissionPersonl.ClassId || 0
      this.RoomId = AdmissionPersonl.RoomId || 0;
      this.WardId = AdmissionPersonl.WardId || 0;
      this.PolicyNo = AdmissionPersonl.PolicyNo || '';
      this.MemberNo = AdmissionPersonl.MemberNo || '';

      this.AprovAmount = AdmissionPersonl.AprovAmount || '';
      this.CompDOD = AdmissionPersonl.CompDOD || '';
      this.IsPharClearance = AdmissionPersonl.IsPharClearance || '';
      this.IPNumber = AdmissionPersonl.IPNumber || '';
      this.EstimatedAmount = AdmissionPersonl.EstimatedAmount || '';
      this.ApprovedAmount = AdmissionPersonl.ApprovedAmount || '';
      this.HosApreAmt = AdmissionPersonl.HosApreAmt || '';
      this.PathApreAmt = AdmissionPersonl.PathApreAmt || '';
      this.PharApreAmt = AdmissionPersonl.PharApreAmt || '';
      this.RadiApreAmt = AdmissionPersonl.RadiApreAmt || '';
      this.PharDisc = AdmissionPersonl.HDiscAmt || '';

      this.ClaimNo = AdmissionPersonl.ClaimNo || '';
      this.CompBillNo = AdmissionPersonl.CompBillNo || '';
      this.CompBillDate = AdmissionPersonl.CompBillDate || '';
      this.CompDiscount = AdmissionPersonl.CompDiscount || '';
      this.CompDisDate = AdmissionPersonl.CompDisDate || '';
      this.C_BillNo = AdmissionPersonl.C_BillNo || '';
      this.C_FinalBillAmt = AdmissionPersonl.C_FinalBillAmt || '';
      this.C_DisallowedAmt = AdmissionPersonl.C_DisallowedAmt || '';
      this.HDiscAmt = AdmissionPersonl.HDiscAmt || '';
      this.C_OutsideInvestAmt = AdmissionPersonl.C_OutsideInvestAmt || '';
      this.RecoveredByPatient = AdmissionPersonl.RecoveredByPatient || '';
      this.H_ChargeAmt = AdmissionPersonl.H_ChargeAmt || '';
      this.H_AdvAmt = AdmissionPersonl.H_AdvAmt || '';
      this.H_BillId = AdmissionPersonl.H_BillId || '';
      this.H_BillDate = AdmissionPersonl.H_BillDate || '';
      this.H_BillNo = AdmissionPersonl.H_BillNo || '';
      this.H_TotalAmt = AdmissionPersonl.H_TotalAmt || '';
      this.H_DiscAmt = AdmissionPersonl.H_DiscAmt || '';
      this.H_NetAmt = AdmissionPersonl.H_NetAmt || '';
      this.H_PaidAmt = AdmissionPersonl.H_PaidAmt || '';
      this.H_BalAmt = AdmissionPersonl.H_BalAmt || '';
      this.vOPDNo = AdmissionPersonl.vOPDNo || ''
      this.TarrifName = AdmissionPersonl.TarrifName || ''
      this.WardName = AdmissionPersonl.WardName || ''
      this.OPDNo = AdmissionPersonl.OPDNo || ''
      this.Remark = AdmissionPersonl.Remark || ''
      this.DetailGiven = AdmissionPersonl.DetailGiven || ''
      this.OP_IP_No = AdmissionPersonl.OP_IP_No || ''
      this.OPD_IPD_ID = AdmissionPersonl.OPD_IPD_ID || ''
      this.OPD_IPD_Type = AdmissionPersonl.OPD_IPD_Type || ''
      this.PathReportID = AdmissionPersonl.PathReportID || 0
      this.AdmDocId = AdmissionPersonl.AdmDocId || 0
      this.PathResultDr1 = AdmissionPersonl.PathResultDr1 || 0
      this.ServiceId = AdmissionPersonl.ServiceId || 0;
      this.PathTestID = AdmissionPersonl.PathTestID || 0
      this.Adm_Visit_docId = AdmissionPersonl.Adm_Visit_docId || 0;
      this.TemplateResultInHTML = AdmissionPersonl.TemplateResultInHTML || ''
    }
  }
}

export class Editdetail {
  Departmentid: Number;
  CityId: Number;
  PatientName: string;
  RegNo: any;
  AdmDateTime: string;
  AgeYear: number;
  ClassId: number;
  ClassName: String;
  TariffName: String;
  TariffId: number;
  IsDischarged: boolean;
  opD_IPD_Type: number;
  AdmissionDate: Date;
  OPD_IPD_ID: any;
  /**
  * Constructor
  *
  * @param Editdetail
  */
  constructor(Editdetail) {
    {
      this.Departmentid = Editdetail.Departmentid || '';
      this.CityId = Editdetail.CityId || '';
      this.TariffId = Editdetail.TariffId || '';
      this.AdmissionDate = Editdetail.AdmissionDate || '';
      this.RegNo = Editdetail.RegNo || '';
      this.OPD_IPD_ID = Editdetail.OPD_IPD_ID || '';
      //  this.AgeYear = AdmissionPersonl.AgeYear || '';
      //  this.ClassId = AdmissionPersonl.ClassId || '';
      //  this.ClassName = AdmissionPersonl.ClassName || '';
      //  this.TariffName = AdmissionPersonl.TariffName || '';
      //  this.TariffId = AdmissionPersonl.TariffId || '';
      //  this.IsDischarged =AdmissionPersonl.IsDischarged || 0 ;
      //  this.opD_IPD_Type = AdmissionPersonl.opD_IPD_Type | 0;
    }
  }
}