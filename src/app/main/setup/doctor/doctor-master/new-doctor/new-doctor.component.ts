import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { AirmidDropDownComponent } from "app/main/shared/componets/airmid-dropdown/airmid-dropdown.component";
import { ToastrService } from "ngx-toastr";
import { DoctorMaster } from "../doctor-master.component";
import { DoctorMasterService } from "../doctor-master.service";
import { SignatureViewComponent } from "../signature-view/signature-view.component";
import { MatTabChangeEvent } from "@angular/material/tabs";
import Swal from "sweetalert2";
import SignaturePad from "signature_pad";
import { DoctorEducationComponent, EducationDetail } from "../doctor-education/doctor-education.component";
import { DoctorExperienceComponent, ExperienceDetail } from "../doctor-experience/doctor-experience.component";
import { ChargesDetail, DoctorChargesComponent } from "../doctor-charges/doctor-charges.component";
import { DoctorSchduleComponent, SchduleDetail } from "../doctor-schdule/doctor-schdule.component";
import { DoctorLeaveComponent, LeaveDetail } from "../doctor-leave/doctor-leave.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { MatTableDataSource } from "@angular/material/table";
import { DatePipe } from "@angular/common";
import { ConsentModule } from "app/main/nursingstation/consent/consent.module";
import { indexOf } from "lodash";


@Component({
  selector: "app-new-doctor",
  templateUrl: "./new-doctor.component.html",
  styleUrls: ["./new-doctor.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewDoctorComponent implements OnInit, AfterViewChecked {
  selectedTabIndex = 0;
  myForm: FormGroup
  createleaveForm: FormGroup
  ageYear = 0;
  ageMonth = 0;
  ageDay = 0;

  //Signature
  signatureForm: FormGroup;
  // pagesList = ['Discharge Summary', 'Consent Form', 'Prescription'];
  uploadedFile: File | null = null;

  //attachment
  attachments: any[] = [];
  signpage: any[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;



  autocompleteModepage: string = "DoctorSignPage";
  displayedColumnsEdu = [

    // 'qualificationId',
    'qualificationName',
    'passingYear',
    'instituteName',
    // 'institutionNameId',
    'cityName',
    'countryName',
    'action'
  ];

  displayedColumnsExp = [
    'hospitalName',
    'designation',
    'startDate',
    'endDate',
    'action'
  ];

  displayedColumnssch = [
    'scheduleDays',
    'startTime',
    'endTime',
    'slot',
    'action'
  ];



  displayedColumnscharges = [
    // 'serviceId',
    'serviceName',
    'tariffName',
    'className',
    'days',
    'price',
    'action'

  ];

  displayedColumnsleave = [
    'leaveType',
    'leaveOptionName',
    'startDate',
    'endDate',
    'reason',
    'action'

  ];

  displayedColumnsSignImg = [
    'page',
    'DocumentName',
    'action'

  ];

  displayedColumnsdocatt = [
    'DocumentName',
    // 'page',
    'action'

  ];


  dataSourceeducation = new MatTableDataSource<EducationDetail>();
  dataSourceeexperience = new MatTableDataSource<ExperienceDetail>();
  dataSourceSchdule = new MatTableDataSource<SchduleDetail>();
  dataSourcedrcharges = new MatTableDataSource<ChargesDetail>();
  dataSourcedrleave = new MatTableDataSource<LeaveDetail>();
  dataSourcedrsign = new MatTableDataSource<SignDetail>();
  AttachDataSource = new MatTableDataSource<any>();


  public chargeschList: SchduleDetail[] = [];
  public chargechargesList: ChargesDetail[] = [];
  public chargeexpList: ExperienceDetail[] = [];
  public chargeeduList: EducationDetail[] = [];
  public chargeleaveList: LeaveDetail[] = [];
  public chargesignList: SignDetail[] = [];



  @ViewChild('ddlDepartment') ddlDepartment: AirmidDropDownComponent;
  @ViewChild('ddlsignpage') ddlsignpage: AirmidDropDownComponent;
  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;

  registerObj = new DoctorMaster({});
  signature: any;
  visConsultant = true;
  visRefDoc = false;
  autocompleteModeprefix: string = "Prefix";
  autocompleteModegender: string = "Gender";
  autocompleteModecity: string = "City";
  autocompleteModedoctorty: string = "DoctorType";
  autocompleteSignpage: string = "DoctorSignPage";


  sanitizeImagePreview: any;
  constructor(
    public _doctorService: DoctorMasterService, private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private _FormvalidationserviceService: FormvalidationserviceService,
    public matDialog: MatDialog, private accountService: AuthenticationService,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<NewDoctorComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,
    public datePipe: DatePipe,
    private _formBuilder: UntypedFormBuilder
  ) { }
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  onChangePrefix(e) {
    this.ddlGender.SetSelection(e.sexId);
  }
  onViewSignature() {
    const dialogRef = this.matDialog.open(SignatureViewComponent,
      {
        width: '900px',
        height: '500px',
        data: {

        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.sanitizeImagePreview = result;
      this.signature = this.sanitizeImagePreview;
      this.myForm.value.signature = this.sanitizeImagePreview;
    });
  }
  toggleSelectAll() {

  }
  doctorId = 0
  ngOnInit(): void {
    this.myForm = this.createdDoctormasterForm();
    this.myForm.markAllAsTouched();
    this.signatureForm = this.createSignatureForm();

    if ((this.data?.doctorId ?? 0) > 0) {
      this.doctorId = this.data?.doctorId
      this._doctorService.getDoctorById(this.data.doctorId).subscribe((response) => {
        this.registerObj = response;
        console.log(this.registerObj)
        this.ddlDepartment.SetSelection(this.registerObj.mDoctorDepartmentDets);
        if (this.registerObj.signature) {
          this._doctorService.getSignature(this.registerObj.signature).subscribe(data => {
            this.sanitizeImagePreview = data;
            this.myForm.value.signature = data;
          });
        }
        this.myForm.controls["MahRegDate"].setValue(this.registerObj.mahRegDate);
        this.myForm.controls["RegDate"].setValue(this.registerObj.regDate);
        this.myForm.controls["DateOfBirth"].setValue(this.registerObj.dateofBirth);

        this.onChangeDateofBirth(this.registerObj.dateofBirth);
      }, (error) => {
        this.toastr.error(error.message);
      });

      this.getdrschduleList()
      this.getDrExperienceList()
      this.getDrEducationList()
      this.getDrchargesList()
      this.getDrleaveList()
      this.getSignpagelist();
    }
    else {
      this.myForm.reset();
      this.myForm.get('IsActive').setValue(true);
      this.myForm.get('IsConsultant').setValue(true);
    }

    this.EducationDetailsArray.push(this.createQualificationDetail());
    this.ExperienceDetailsArray.push(this.createExperience());
    this.SchduleDetailsArray.push(this.createSchdule());
    this.ChargesDetailsArray.push(this.createExperience());
    this.leaveDetailsArray.push(this.createLeave());
    this.signatureDetailsArray.push(this.createsignature());


  }
  createdDoctormasterForm(): FormGroup {
    return this._formBuilder.group({
      DoctorId: [0],
      PrefixID: ["", Validators.required],
      // PrefixName: [""],
      FirstName: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      MiddleName: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      LastName: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      DateOfBirth: [{ value: new Date() }],
      Address: ["", Validators.required],
      City: ["", Validators.required],
      pin: ["", this._FormvalidationserviceService.allowEmptyStringValidatorOnly()],
      mobile: [
        "",
        [
          , this._FormvalidationserviceService.allowEmptyStringValidatorOnly(),
          Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      Phone: [
        "",
        [
          Validators.required,
          Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      GenderId: ["", Validators.required],
      // GenderName: [""],
      Education: ["",
        [
          Validators.required,
          // Validators.pattern("^[A-Za-z/() / [ ] ]*$")
        ]
      ],
      IsConsultant: [true],
      IsRefDoc: [false],
      IsInHouseDoctor: [false],
      IsOnCallDoctor: [false],
      IsActive: [true],
      DoctorTypeId: ["", Validators.required],
      ageYear: ['', [
        Validators.maxLength(3),
        Validators.pattern("^[0-9]*$")]],
      ageMonth: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly(),
      Validators.pattern("^[0-9]*$")]],
      ageDay: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly(),
      Validators.pattern("^[0-9]*$")]],
      PassportNo: ["", this._FormvalidationserviceService.allowEmptyStringValidatorOnly()],
      esino: [
        "",
        [
          Validators.required,
          // Validators.pattern("'^[a-zA-Z0-9]*$'"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      RegNo: [
        "",
        [
          Validators.required,
          //    Validators.pattern("'^[a-zA-Z0-9]*$'"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      RegDate: [{ value: new Date() }],
      MahRegNo: [
        "",
        [
          Validators.required,
          //    Validators.pattern("'^[a-zA-Z0-9]*$'"),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      MahRegDate: [{ value: new Date() }],
      RefDocHospitalName: [
        "",
        [
          Validators.required
        ]
      ],

      MDoctorDepartmentDets: ["", Validators.required],
      Pancardno: ["", Validators.required],
      AadharCardNo: ["",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(12),
          Validators.maxLength(12),
        ]
      ],
      signature: "",
      // createdBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      // createdDate: [this.datePipe.transform(new Date(), "yyyy-MM-dd")],
      mDoctorExperienceDetails: this.formBuilder.array([]),
      mDoctorQualificationDetails: this.formBuilder.array([]),
      mDoctorScheduleDetails: this.formBuilder.array([]),
      mDoctorChargesDetails: this.formBuilder.array([]),
      mDoctorLeaveDetails: this.formBuilder.array([]),
      mDoctorSignPageDetails: this.formBuilder.array([])
    });
  }
  //Education
  EducationForm: FormGroup

  // 2. Education
  createQualificationDetail(item: any = {}): FormGroup {

    return this.formBuilder.group({
      docQualfiId: [item.docQualfiId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [item.doctorId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      qualificationId: [parseInt(item.qualificationId)],
      passingYear: [this.datePipe.transform(item.passingYear, 'yyyy')],
      institutionNameId: [parseInt(item.institutionNameId), [this._FormvalidationserviceService.onlyNumberValidator()]],
      cityId: [parseInt(item.cityId), [this._FormvalidationserviceService.onlyNumberValidator()]],
      countryId: [parseInt(item.countryId), [this._FormvalidationserviceService.onlyNumberValidator()]],

    });
  }

  // Experience
  createExperience(item: any = {}): FormGroup {
    return this.formBuilder.group({
      docExpId: [item.docExpId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [item.doctorId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      hospitalName: [item.hospitalName],
      designation: [item.designation],
      startDate: [this.datePipe.transform(item.startDate, 'yyyy-MM-dd')],
      endDate: [this.datePipe.transform(item.endDate, 'yyyy-MM-dd')],

    });
  }


  // Schdule
  createSchdule(item: any = {}): FormGroup {
    return this.formBuilder.group({
      docSchedId: [item.docSchedId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [item.doctorId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      scheduleDays: [item.scheduleDays || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      startTime: [item.startTime],// [this.datePipe.transform(item.startTime, 'HH:mm:ss')],//item.startTime,//
      endTime: [item.endTime],// [this.datePipe.transform(item.endTime, 'HH:mm:ss')],//item.endTime,// 
      slot: [parseInt(item.slot), [this._FormvalidationserviceService.onlyNumberValidator()]],

    });
  }


  // Charges
  createChargesDetail(item: any = {}): FormGroup {
    return this.formBuilder.group({
      docChargeId: [item.docChargeId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [item.doctorId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId: [parseInt(item.serviceId), [this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId: [parseInt(item.tariffId), [this._FormvalidationserviceService.onlyNumberValidator()]],
      classId: [parseInt(item.classId), [this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item.price, [this._FormvalidationserviceService.onlyNumberValidator()]],
      days: [parseInt(item.days), [this._FormvalidationserviceService.onlyNumberValidator()]],

    });
  }

  // Leave
  createLeave(item: any = {}): FormGroup {

    return this.formBuilder.group({
      docLeaveId: [item.docLeaveId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [item.doctorId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      leaveTypeId: [parseInt(item.leaveTypeId), [this._FormvalidationserviceService.onlyNumberValidator()]],
      startDate: [item.startDate],
      endDate: [item.endDate],
      leaveOption: [parseInt(item.leaveOption), [this._FormvalidationserviceService.onlyNumberValidator()]],
      reason: [item.reason, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
    });
  }

  // Signature
  createsignature(item: any = {}): FormGroup {

    console.log(item)
    return this.formBuilder.group({
      docSignId: [item.docSignId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [item.doctorId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      pageId: [parseInt(item.pageId), [this._FormvalidationserviceService.onlyNumberValidator()]],
      // page: ['']
    });
  }


  createSignatureForm() {
    return this.formBuilder.group({
      docSignId: [''],
      doctorId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      pageId: [[], [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      // signature: [''],
      page: [''],
      pagetest: []
    });
  }


  // FormArray Getters
  get EducationDetailsArray(): FormArray {
    return this.myForm.get('mDoctorQualificationDetails') as FormArray;
  }

  get ExperienceDetailsArray(): FormArray {
    return this.myForm.get('mDoctorExperienceDetails') as FormArray;
  }

  get SchduleDetailsArray(): FormArray {
    return this.myForm.get('mDoctorScheduleDetails') as FormArray;
  }
  // FormArray Getters
  get ChargesDetailsArray(): FormArray {
    return this.myForm.get('mDoctorChargesDetails') as FormArray;
  }

  get leaveDetailsArray(): FormArray {
    return this.myForm.get('mDoctorLeaveDetails') as FormArray;
  }
  get signatureDetailsArray(): FormArray {
    return this.myForm.get('mDoctorSignPageDetails') as FormArray;
  }



  removeDepartment(item) {
    let removedIndex = this.myForm.value.MDoctorDepartmentDets.findIndex(x => x.departmentId == item.departmentId);
    this.myForm.value.MDoctorDepartmentDets.splice(removedIndex, 1);
    this.ddlDepartment.SetSelection(this.myForm.value.MDoctorDepartmentDets.map(x => x.departmentId));
  }

  removesignpage(item) {
    let removedIndex = this.signatureForm.value.pageId.findIndex(x => x.value == item.value);
    this.signatureForm.value.pageId.splice(removedIndex, 1);
    this.ddlsignpage.SetSelection(this.signatureForm.value.pageId.map(x => x.value));
  }


  onSubmit() {


    console.log(this.myForm.value)
    // Qualification detail assign to array
    this.EducationDetailsArray.clear();
    if (this.dataSourceeducation.data.length > 0) {
      this.dataSourceeducation.data.forEach(item => {
        this.EducationDetailsArray.push(this.createQualificationDetail(item));
      });
    }

    // Experience table detail assign to array
    this.ExperienceDetailsArray.clear();
    if (this.dataSourceeexperience.data.length > 0) {
      this.dataSourceeexperience.data.forEach(item => {
        console.log(item)
        this.ExperienceDetailsArray.push(this.createExperience(item));
      });
    }

    // Schdule table detail assign to array
    this.SchduleDetailsArray.clear();
    if (this.dataSourceSchdule.data.length > 0) {
      this.dataSourceSchdule.data.forEach(item => {
        console.log(item)
        this.SchduleDetailsArray.push(this.createSchdule(item));
      });
    }

    // Charges table detail assign to array
    this.ChargesDetailsArray.clear();
    if (this.dataSourcedrcharges.data.length > 0) {
      this.dataSourcedrcharges.data.forEach(item => {
        console.log(item)
        this.ChargesDetailsArray.push(this.createChargesDetail(item));
      });
    }

    // leave table detail assign to array
    this.leaveDetailsArray.clear();
    if (this.dataSourcedrleave.data.length > 0) {
      this.dataSourcedrleave.data.forEach(item => {
        console.log(item)
        this.leaveDetailsArray.push(this.createLeave(item));
      });
    }

    debugger
    //sign detail
    let charge = []
    console.log(this.signatureForm.value)
    charge = this.signpage
    if (charge.length > 0) {
      if (this.dataSourcedrsign.data.length > 0) {
        this.chargesignList = []
        this.chargesignList = this.dataSourcedrsign.data
      }
      if (charge.length > 0) {
        charge.forEach(item => {
          console.log(item)
          const newRow = {
            docSignId: 0,
            doctorId: this.doctorId,
            pageId: item
          }
          this.chargesignList.push(newRow);
          this.dataSourcedrsign.data = this.chargesignList
          console.log(this.chargesignList)
        });
      }
    }

    this.signatureDetailsArray.clear();
    if (this.dataSourcedrsign.data.length > 0) {
      this.dataSourcedrsign.data.forEach(item => {
        console.log(item)
        this.signatureDetailsArray.push(this.createsignature(item));
      });
    }


console.log(this.myForm.value)

    if (!this.myForm.invalid) {
      // if(this.doctorId >0 && this.registerObj)
      //   this.myForm.get("mDoctorDepartmentDets").setValue(this.ddlDepartment)
      

      let data = this.myForm.value;
      data.IsConsultant = true
      data.IsRefDoc = false
      data.IsInHouseDoctor = false
      data.IsOnCallDoctor = false
      data.IsActive = true

      data.RegDate = this.registerObj.regDate;
      data.MahRegDate = this.registerObj.mahRegDate;
      data.signature = this.signature;
      data.ageYear = String(this.ageYear)
console.log(this.myForm.value)

if(this.doctorId > 0){
   data.MDoctorDepartmentDets.Remove
  data.signature = this.registerObj.signature
  //  data.mDoctorDepartmentDets = this.registerObj.mDoctorDepartmentDets
      console.log(data)
}


      this._doctorService.doctortMasterInsert(data).subscribe((response) => {
        this.onClose();
      });
    } else {
      let invalidFields = [];

      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`DoctorForm : ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }

    }

    // this.myForm.reset();
    // this.myForm.patchValue(this.createdDoctormasterForm().value);
  }
  pagetestId = 0
  onChangeSignpage2(event) {
    // this.pagetestId = event[0].value
    // this.signatureForm.get("pagetest").setValue(this.pagetestId)
    // console.log(this.signatureForm.get("pagetest").value)

    if (event.length > 0) {
      this.signpage = [];
      event.forEach(item => {
        this.signpage.push(item.value)
      })

    }
    console.log(this.signpage)

  }


  // onChangeSignpage1(event) {

  //   this.signpage.push(event)
  //   console.log(this.signpage)
  // }

  //   onChangeSignpage(selectedItems: any[]) {
  //   console.log('Selected pages:', selectedItems);
  //   this.signatureForm.get('pageId')?.setValue(selectedItems);
  //   this.ddlsignpage.SetSelection(selectedItems)
  // }
  // addCheiflist: any[] = [];
  // onChangeSignpage(selectedChips: string[]) {

  //   console.log(selectedChips)
  //   this.addCheiflist = selectedChips;
  //   this.signatureForm.get('pageId')?.setValue(selectedChips);
  // }


  onTabChange(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index;
  }
  onClear(val: boolean) {
    this.myForm.reset();
  }
  onClose() {
    this.myForm.reset();
    this.dialogRef.close();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getValidationMessages() {
    return {
      PrefixID: [
        { name: "required", Message: "Prefix Name is required" }
      ],
      FirstName: [
        { name: "required", Message: "First Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      MiddleName: [
        { name: "required", Message: "Middle Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      LastName: [
        { name: "required", Message: "Last Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      Address: [
        { name: "required", Message: "Address is required" }
      ],
      Phone: [
        { name: "required", Message: "Phone no is required" },
        { name: "pattern", Message: "Enter valid numbers" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }
      ],
      GenderId: [
        { name: "required", Message: "Gender is required" }
      ],
      Education: [
        { name: "required", Message: "Education is required" },
        { name: "pattern", Message: "only char allowed." }
      ],
      esino: [
        { name: "required", Message: "ESINO is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 15 digits not allowed." }
      ],
      RegNo: [
        { name: "required", Message: "RegNo is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 15 digits not allowed." }
      ],
      mahRegNo: [
        { name: "required", Message: "mahRegNo is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 15 digits not allowed." }
      ],
      RefDocHospitalName: [
        { name: "required", Message: "RefDoc Hospital Name is required" }
      ],
      Pancardno: [
        { name: "required", Message: "Pancard No is required" }
      ],
      AadharCardNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "AadharCard No is required" },
        { name: "minLength", Message: "12 digit required." },
        { name: "maxLength", Message: "More than 12 digits not allowed." }
      ],
      City: [
        { name: "required", Message: "City is required" }
      ],
      DoctorTypeId: [
        { name: "required", Message: "Doctor Type is required" }
      ],
      Departmentid: [
        { name: "required", Message: "Department is required" }
      ]
    };
  }

  ///Schdule code
  startTime: string = '09:00'; // default 9:00 AM
  endTime: string = '00:00';  // default 12:00 AM
  timeSlots: string[] = [];
  screenFromString = 'Common-form';
  updateTimeSlots(): void {
    this.timeSlots = []; // Clear previous

    const [startH, startM] = this.startTime.split(':').map(Number);
    const [endH, endM] = this.endTime.split(':').map(Number);

    const start = new Date();
    start.setHours(startH, startM, 0, 0);

    const end = new Date();
    end.setHours(endH, endM, 0, 0);

    // If end time is midnight (00:00), move to next day
    if (endH === 0 && endM === 0) {
      end.setDate(end.getDate() + 1);
    }

    while (start < end) {
      const hours = start.getHours();
      const minutes = start.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hr12 = hours % 12 === 0 ? 12 : hours % 12;
      const minStr = minutes.toString().padStart(2, '0');
      const timeStr = `${hr12}:${minStr} ${ampm}`;
      this.timeSlots.push(timeStr);
      start.setMinutes(start.getMinutes() + 15);
    }
  }


  initFilterOptions() {
    // this.appointmentGroups.forEach(group => {
    //   group.rows.forEach(row => {
    //     row.filteredServices = this.allServices;
    //   });
    // });
  }


  i = 0

  getdrschduleList() {
    var data = {
      "first": 0,
      "rows": 10,
      "sortField": "DocSchedId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "DoctorId",
          "fieldValue": String(this.data.doctorId),//"50362",
          "opType": "13"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }
    this._doctorService.getSchduleList(data).subscribe((data: any) => {
      console.log(data)

      // data.data.forEach(item => {

      //   data.data[this.i]["startTime"] = this.datePipe.transform(item.startTime, 'HH:mm:ss')
      //   data.data[this.i]["endTime"] = this.datePipe.transform(item.endTime, 'HH:mm:ss')
      //   this.i=+1
      // });

      if (this.dataSourceSchdule.data.length > 0) {
        this.chargeschList = []
        this.chargeschList = this.dataSourceSchdule.data
      }
      console.log(data.data)
      this.chargeschList.push(data.data);
      this.dataSourceSchdule.data = data.data as SchduleDetail[]


    });
  }
  getDrExperienceList() {

    var data = {
      "first": 0,
      "rows": 10,
      "sortField": "DocExpId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "DoctorId",
          "fieldValue": String(this.data.doctorId),//"50362",
          "opType": "13"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]

    }
    this._doctorService.getexperienceList(data).subscribe((data: any) => {
      console.log(data.data)

      if (this.dataSourceeexperience.data.length > 0) {
        this.chargeexpList = []
        this.chargeexpList = this.dataSourceeexperience.data
      }
      this.chargeexpList.push(data.data);
      this.dataSourceeexperience.data = data.data as ExperienceDetail[]


    });
  }

  getDrEducationList() {

    var m_data = {
      "first": 0,
      "rows": 10,
      "sortField": "DocQualfiId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "DoctorId",
          "fieldValue": String(this.data.doctorId),//"50362",
          "opType": "13"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }
    this._doctorService.getEducationList(m_data).subscribe(response => {
      console.log(response)
      if (this.dataSourceeducation.data.length > 0) {
        this.chargeeduList = []
        this.chargeeduList = this.dataSourceeducation.data
      }
      this.chargeeduList.push(response.data);
      this.dataSourceeducation.data = response.data as EducationDetail[]

    });
  }
  getDrchargesList() {
    var data = {
      "first": 0,
      "rows": 10,
      "sortField": "DocChargeId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "DoctorId",
          "fieldValue": String(this.data.doctorId),//"50362",
          "opType": "13"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]

    }
    this._doctorService.getChargesList(data).subscribe((data: any) => {
      console.log(data)
      if (data !== undefined) {
        if (this.dataSourcedrcharges.data.length > 0) {
          this.chargechargesList = []
          this.chargechargesList = this.dataSourcedrcharges.data
        }
        this.chargechargesList.push(data.data);
        this.dataSourcedrcharges.data = data.data as ChargesDetail[]
      }
    });
  }
  getDrleaveList() {
    var data = {
      "first": 0,
      "rows": 10,
      "sortField": "DoctorId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "DoctorId",
          "fieldValue": String(this.data.doctorId),//"50362",
          "opType": "13"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]

    }
    this._doctorService.getleaveList(data).subscribe((data: any) => {
      console.log(data)
      const allData = data.data as LeaveDetail[];
      if (data !== undefined) {
        if (this.dataSourcedrleave.data.length > 0) {
          this.chargeleaveList = []
          this.chargeleaveList = this.dataSourcedrleave.data
        }
        this.chargeleaveList.push(data.data);
        this.dataSourcedrleave.data = data.data as LeaveDetail[]

        console.log(this.chargeleaveList)
      }
    });

  }


  onCancel() {
    // reset logic
  }
  //Education detail
  onAddEducation(element) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    this.chargeeduList = []

    const dialogRef = this.matDialog.open(DoctorEducationComponent,
      {
        maxWidth: "55vw",
        height: '55vh',
        width: '100%',
        data: element
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result !== undefined) {

        if (this.dataSourceeducation.data.length > 0) {
          this.chargeeduList = this.dataSourceeducation.data
        }
        this.chargeeduList.push(result);
        this.dataSourceeducation.data = this.chargeeduList;
      }

    });

  }


  onAddExperience() {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button
    this.chargeexpList = []
    let that = this;
    const dialogRef = this.matDialog.open(DoctorExperienceComponent,
      {
        maxWidth: "55vw",
        height: '55vh',
        width: '100%',
        // data: element
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log(result)

        const payload = result;
        delete payload.YearsExp;
        delete payload.DaysExp;
        delete payload.MonthExp;

        if (this.dataSourceeexperience.data.length > 0) {
          this.chargeexpList = this.dataSourceeexperience.data
        }
        this.chargeexpList.push(payload);
        this.dataSourceeexperience.data = this.chargeexpList;
      }
    });

  }

  onAddSchdule() {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this.matDialog.open(DoctorSchduleComponent,
      {
        maxWidth: "55vw",
        height: '55vh',
        width: '100%'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)

      let charge = []
      charge = result.scheduleDays


      if (result !== undefined) {

        if (this.dataSourceSchdule.data.length > 0) {
          this.chargeschList = []
          this.chargeschList = this.dataSourceSchdule.data
        }
        if (charge.length > 0) {
          charge.forEach(item => {
            const newRow = {
              docSchedId: 0,
              scheduleDays: item,
              startTime: result.startTime,
              endTime: result.endTime,
              slot: result.slot
            }
            this.chargeschList.push(newRow);
            this.dataSourceSchdule.data = this.chargeschList
            console.log(this.chargeschList)
          });
        }
        else {
          this.chargeschList.push(result);
          this.dataSourceSchdule.data = this.chargeschList;
        }
      }


    });
    // console.log(this.dataSourceSchdule.data)
  }

  pageId: any;
  page: any;
  getSelectedqpageObj(obj) {
    console.log(obj)
    this.pageId = obj.value;
    this.page = obj.text;

  }


  onAddImage() {
    console.log(this.signatureForm.value)

    this.signatureForm.get("signature").setValue(this.signature)
    this.signatureForm.get("pageId").setValue(this.pageId)
    this.signatureForm.get("page").setValue(this.page)


    if (!this.signatureForm.invalid) {

      if (this.dataSourcedrsign.data.length > 0) {
        this.chargesignList = []
        this.chargesignList = this.dataSourcedrsign.data
      }
      this.chargesignList.push(this.signatureForm.value);
      this.dataSourcedrsign.data = this.chargesignList;
    }
    console.log(this.dataSourcedrsign.data)
  }


  onAddCharges() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();
    this.chargechargesList = []
    let that = this;
    const dialogRef = this.matDialog.open(DoctorChargesComponent,
      {
        maxWidth: "65vw",
        height: '55vh',
        width: '100%',
        // data: element
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.dataSourcedrcharges.data.length > 0) {
          this.chargechargesList = this.dataSourcedrcharges.data
          this.chargechargesList = this.dataSourcedrcharges.data
        }
        this.chargechargesList.push(result);
        this.dataSourcedrcharges.data = this.chargechargesList;

      }
    });

  }

  onAddLeave() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    let that = this;
    const dialogRef = this.matDialog.open(DoctorLeaveComponent,
      {
        maxWidth: "65vw",
        height: '55vh',
        width: '100%',
        // data: element
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result !== undefined) {
        if (this.dataSourcedrleave.data.length > 0) {
          this.chargeleaveList = this.dataSourcedrleave.data
        }
        this.chargeleaveList.push(result);
        this.dataSourcedrleave.data = this.chargeleaveList;
        console.log(this.dataSourcedrleave.data)
      }
    });

  }
  addpagelist: any = [];
  selectChangeExamination(selectedChips: string[]) {
    // this.addpagelist = selectedChips;
    // this.myForm.get('pageId')?.setValue(this.addpagelist);
  }
  signpagelist: any[] = [];
  tempsignidlist: any[] = [];

  getSignpagelist() {
    debugger
    var data = {
      "first": 0,
      "rows": 10,
      "sortField": "DoctorId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "DoctorId",
          "fieldValue": String(this.doctorId),//"50362",
          "opType": "13"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]

    }
   
    this._doctorService.getsignpageById(data).subscribe(data => {
      console.log(data.data)
            this.signpagelist = data?.data || [];
      this.signpagelist.forEach(item => {
        const newRow = {
          value: item.pageId,
          text:item.name

        }
        this.tempsignidlist.push(newRow)
      });
      console.log(this.tempsignidlist)
      if(this.tempsignidlist.length >0){
        this.tempsignidlist.forEach(item =>{
        this.signpage.push(item.value)
        })
      }
      // this.signpage= this.tempsignidlist

        setTimeout(() => {
      this.signatureForm.get("pageId").setValue(this.tempsignidlist)
      }, 2500)
    });
  }
  
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile!);
  }

  uploadAttachments() {
    if (this.selectedFile) {
      this.attachments.push({ name: this.selectedFile.name, file: this.selectedFile });

      console.log(this.attachments)
      this.AttachDataSource.data = this.attachments
      this.selectedFile = null;
      this.previewUrl = null;
    }
    // this.clearFile();
  }

  view(file: any) {
    window.open(URL.createObjectURL(file.file), '_blank');
  }
  images: any[] = [];
  Filename: any;

  deleteImage(element) {
    let index = this.images.indexOf(element);
    if (index >= 0) {
      this.images.splice(index, 1);
      this.dataSourcedrsign.data = this.images;
    }

    this.Filename = element.name;

  }

  deletedocattachment(element) {
    let index = this.images.indexOf(element);
    if (index >= 0) {
      this.images.splice(index, 1);
      this.imgDataSource.data = this.images;
    }

    this.Filename = element.name;

  }



  download(file: any) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file.file);
    link.download = file.name;
    link.click();
  }

  delete(file: any) {
    this.attachments = this.attachments.filter(f => f !== file);
  }

  imgDataSource = new MatTableDataSource<any>();
  onSubmitImgFiles() {
    // let data: PatientDocument[] = [];
    // for (let i = 0; i < this.imgDataSource.data.length; i++) {
    //     if (this.imgDataSource.data[i].name.endsWith('.pdf')) {
    //         let file = new File([this.dataURItoBlob(this.imgDataSource.data[i].url)], this.imgDataSource.data[i].name, {
    //             type: "'application/pdf'"
    //         });
    //         data.push({
    //             Id: "0", OPD_IPD_ID: this.VisitId, OPD_IPD_Type: 0, DocFile: file, FileName: this.imgDataSource.data[i].name
    //         });
    //     }
    //     else {
    //         let file = new File([this.dataURItoBlob(this.imgDataSource.data[i].url)], this.imgDataSource.data[i].name, {
    //             type: "'image/" + this.imgDataSource.data[i].name.split('.')[this.imgDataSource.data[i].name.split('.').length - 1] + "'"
    //         });
    //         data.push({
    //             Id: "0", OPD_IPD_ID: this.VisitId, OPD_IPD_Type: 0, DocFile: file, FileName: this.imgDataSource.data[i].name
    //         });
    //     }
    // }
    // const formData = new FormData();
    // let finalData = { Files: data };
    // this.CreateFormData(finalData, formData);
    // this._AppointmentSreviceService.documentuploadInsert(formData).subscribe((data) => {
    //     if (data) {
    //         Swal.fire("Images uploaded Successfully  ! ");
    //     }
    // });
  }

  minDate = new Date();
  value = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  onChangeDateofBirth(DateOfBirth: Date) {

    if (DateOfBirth > this.minDate) {
      Swal.fire("Enter Proper Birth Date.. ")
      return;
    }
    if (DateOfBirth) {
      const todayDate = new Date();
      const dob = new Date(DateOfBirth);
      const timeDiff = Math.abs(Date.now() - dob.getTime());

      this.ageYear = todayDate.getFullYear() - dob.getFullYear();
      this.ageMonth = (todayDate.getMonth() - dob.getMonth());
      this.ageDay = (todayDate.getDate() - dob.getDate());

      if (this.ageDay < 0) {
        this.ageMonth--;
        const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
        this.ageDay += previousMonth.getDate(); // Days in previous month
        // this.ageDay =this.ageDay +1;
      }

      if (this.ageMonth < 0) {
        this.ageYear--;
        this.ageMonth += 12;
      }
      // this.value = DateOfBirth;
      // this.myForm.get('DateOfBirth').setValue(DateOfBirth);
      this.myForm.get("ageYear").setValue(this.ageYear)
      if (this.ageYear > 110)
        Swal.fire("Please Enter Valid BirthDate..")
    }
  }

  birthdate: Date | null = null;


  calculateBirthdate(): void {

    const age = this.myForm.get("ageYear").value// this.myForm.get("ageYear")?.value;

    if (age && age > 0) {
      const today = new Date();
      const birthYear = today.getFullYear() - age;
      this.birthdate = new Date(birthYear, today.getMonth(), today.getDate());
      this.value = this.datePipe.transform(new Date(birthYear, today.getMonth(), today.getDate()), "yyyy-MM-dd");
      this.myForm.get("DateOfBirth").setValue(this.value)
      // Swal.fire("Date",String(this.birthdate))
    } else {
      // this.birthdate = null;
    }
  }

  Ondeletequalification(index: number) {
    this.chargeeduList.splice(index, 1);
    this.dataSourceeducation.data = this.chargeeduList;

  }

  Ondeleteexperience(index: number) {
    this.chargeexpList.splice(index, 1);
    this.dataSourceeexperience.data = this.chargeexpList;

  }

  Ondeleteschdule(index: number) {

    this.chargeschList.splice(index, 1);
    this.dataSourceSchdule.data = this.chargeschList;

  }

  Ondeletecharges(index: number) {

    this.chargechargesList.splice(index, 1);
    this.dataSourcedrcharges.data = this.chargechargesList;

  }

  Ondeleteleave(index: number) {

    this.chargeleaveList.splice(index, 1);
    this.dataSourcedrleave.data = this.chargeleaveList;

  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressAlpha(event) {
    const charCode = event.which ? event.which : event.keyCode;
    return (charCode >= 65 && charCode <= 90) ||  // A-Z
      (charCode >= 97 && charCode <= 122) || (charCode == 32) || (charCode == 40) || (charCode == 41);   // a-z
  }
}



export class DepartmenttList {
  DeptId: number;
  DeptName: number;


  constructor(DepartmenttList) {
    this.DeptId = DepartmenttList.DeptId || '';
    this.DeptName = DepartmenttList.DeptName || '';
  }
}


export class SignDetail {
  docSignId: any;
  doctorId: any;
  pageId: any;
  // DocumentName: any;
  // page: any;


  constructor(SignDetail) {
    this.docSignId = SignDetail.docSignId || 0;
    this.doctorId = SignDetail.doctorId || 0;
    this.pageId = SignDetail.pageId || 0;
    // this.DocumentName = SignDetail.DocumentName || '';
    // this.page = SignDetail.page || '';

  }
}

export class PatientDocument {
  Id: string;
  OPD_IPD_ID: Number;
  OPD_IPD_Type: Number;
  FileName: string;
  DocFile: File;
  constructor(PatientDocument) {
    {
      this.Id = PatientDocument.Id || "";
      this.OPD_IPD_ID = PatientDocument.OPD_IPD_ID || 0;
      this.OPD_IPD_Type = PatientDocument.opD_IPD_Type || 0;
      this.FileName = PatientDocument.Filename || "";
      this.DocFile = PatientDocument.DocFile || null;
    }
  }
}