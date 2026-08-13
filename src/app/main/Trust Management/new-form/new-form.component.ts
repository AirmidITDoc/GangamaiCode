
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ConfigService } from 'app/core/services/config.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { element } from 'protractor';

import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { NewMemberService } from '../new-member.service';
import { ImageViewComponent } from 'app/main/opd/appointment-list/image-view/image-view.component';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { set } from 'lodash';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';

@Component({
  selector: 'app-new-form',
  templateUrl: './new-form.component.html',
  styleUrls: ['./new-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewFormComponent {

  personalFormGroup: FormGroup;

  Childrensform: FormGroup
  Relativeform: FormGroup
  Emrgencyform: FormGroup
  Wifeform: FormGroup
  PatientName: any = '';
  MobileNo: any;
  DoctorName: any;
  RegId: any = '';
  IPMedID: any;
  OPDNo: any;
  RegNo: any;
  IPDNo: any;
  Patientdetails: any;
  DoctorNamecheck: boolean = false;
  IPDNocheck: boolean = false;
  OPDNoCheck: boolean = false;

  vupdate: boolean = true;
  OP_IP_Id: any = 0;
  OP_IPType: any = 1;
  HospitalId: any = 0;
  wardId: any = 0;
  bedId: any = 0;

  registerObj: any
  dateTimeObj: any;

  vNoninvasive: any;
  roomName = ''
  bedName = ''
  tariffName = ''
  departmentName = ''
  Patientobj: any;
  vpcpndtprocessId = 0
  registerObj1 = new RegInsert({});
  dateofBirth = new Date()

  isExpanded1 = false;
isExpanded2 = false;
  //
  vName = ''
  vMobileNo = ''
  vAddress = ''

  vRName = ''
  vRelation = ''
  vRMobileNo = ''
  vRAddress = ''
  vEName = ''
  vEMobileNo = ''

  vEAddress = ''

  vmembershipId = 0
  ageYear = 0;
  ageMonth = 0;
  ageDay = 0;
  ageYear1 = 0;
  ageMonth1 = 0;
  ageDay1 = 0;
  CityName = ''

  CPrefix = ''
  RPrefix = ''
  EPrefix = ''

  SaveStatus: boolean = false;
  value = new Date()
  value1 = new Date()
  minDate = new Date();

  DSChildrenList = new MatTableDataSource<Childdetail>();
  DSRelativeList = new MatTableDataSource<Relativedetail>();
  DSEmrgencyList = new MatTableDataSource<Emrgencdetail>();

  DSChildrenListtemp = new MatTableDataSource<Childdetail>();
  DSRelativeListtemp = new MatTableDataSource<Relativedetail>();
  DSEmrgencyListtemp = new MatTableDataSource<Emrgencdetail>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  today = new Date();
  todayPlus5Years = new Date();
  wtodayPlus5Years = new Date();
  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlGender1') ddlGender1: AirmidDropDownComponent;

  displayedColumns: string[] = [
    'Prefix',
    'Name',
    'MobileNo',
    'Address',
    'Action'
  ]

  displayedColumns1: string[] = [
    'Prefix',
    'RName',
    'RMobileNo',
    'Relation',
    'RAddress',
    'Action'
  ]

  displayedColumns2: string[] = [
    'Prefix',
    'EName',
    'EMobileNo',
    'EAddress',
    'Action'
  ]

  BloodGroupNames: string[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  ClinicName: any
  vresultDate = new Date();
  vreceiptdate = new Date();
  vwreceiptdate = new Date();
  vmediclaimenddate = new Date();
  vhusbandFullBodyCheckupDate = new Date();
  vmediclaimstartdate = new Date();
  vwmediclaimstartdate = new Date();
  vwmediclaimenddate = new Date();
  wreceiptDate = new Date();
  vwifeFullBodyCheckupDate = new Date();
  vwifedob = new Date();
  vhusbanddob = new Date();
  vwdeathDate = new Date();
  vhdeathDate = new Date();

  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteModeCompany: string = "Company";
  autocompleteModegender: string = "Gender";
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModerefdoc: string = "RefDoctor";
  autocompleteModerelationship: string = "Relationship";
  autocompleteModeAnyOther: string = "PCPNDTAnyother";
  autocompleteTrustIncomerange: string = "TrustIncomerange";
  autocompleteModeOccupation: string = "TrustOccupation";
  screenFromString = 'Common-form';
  constructor(
    public _NewMemberService: NewMemberService,
    private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<NewFormComponent>,
    public _matDialog: MatDialog,
    private _ActRoute: Router, private _FormvalidationserviceService: FormvalidationserviceService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    public matDialog: MatDialog,
    private commonService: PrintserviceService, private advanceDataStored: AdvanceDataStored,
    private _configue: ConfigService, private accountService: AuthenticationService,
    public toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any

  ) { }


  ngOnInit(): void {
    this.today = new Date();
    debugger
    if ((this.data?.membershipId ?? 0) > 0) {

      this.todayPlus5Years = this.data?.membershipvalidDate
      this.wtodayPlus5Years = this.data?.wmembershipvalidDate

    } else {
      this.todayPlus5Years = new Date(this.today);
      this.wtodayPlus5Years = new Date(this.today);

      this.todayPlus5Years = new Date(
        this.today.getFullYear() + 5, 2, 1);


      this.wtodayPlus5Years = new Date(
        this.today.getFullYear() + 5, 2, 1);

      console.log(this.todayPlus5Years)
      console.log(this.wtodayPlus5Years)
    }


    this.personalFormGroup = this.createFinalProcessForm();
    this.personalFormGroup.patchValue(this.data)
    this.personalFormGroup.markAllAsTouched();

    this.Wifeform = this.Createwifeform()
    this.Childrensform = this.CreateChildrenform();
    this.Relativeform = this.Createrelativeform();
    this.Emrgencyform = this.CreateEmrgencyform();

    if ((this.data?.membershipId ?? 0) > 0) {
      console.log(this.data)

      this.vmembershipId = this.data.membershipId
      this.CityName = this.data.cityName
      this.getOtherdetailsList(this.vmembershipId)

      console.log(this.data.husbandDob)
      console.log(this.data.wifeDob)


      if (this.data.husbandDob != '1900-01-01T00:00:00') {
        this.vhusbanddob = new Date(this.data.husbandDob)

        setTimeout(() => {
          this.registerObj1.husbandDob = new Date(this.data.husbandDob)
          this.onChangeDateofBirth(this.registerObj1.husbandDob)

        }, 500);

      }
      if (this.data.wifeDob != '1900-01-01T00:00:00') {
        this.vwifedob = new Date(this.data.wifeDob)

        setTimeout(() => {
          this.registerObj1.wifeDob = new Date(this.data.wifeDob)
          this.onChangeDateofBirth1(this.registerObj1.wifeDob)

        }, 500);

      }


      this.vmediclaimenddate = this.data.mediclaimenddate
      this.vhusbandFullBodyCheckupDate = this.data.husbandFullBodyCheckupDate
      this.vmediclaimstartdate = this.data.mediclaimstartdate
      this.vwifeFullBodyCheckupDate = this.data.wifeFullBodyCheckupDate
debugger
      this.personalFormGroup.get("hasmediclaim").setValue(this.data.hasMediclaim)

      this.personalFormGroup.get("wifeparentsnativeplace").setValue(this.data.wifeParentsNativePlace)
      this.personalFormGroup.get("mediclaimpolicynumber").setValue(this.data.mediclaimPolicyNumber)
      this.personalFormGroup.get("mediclaimcompany").setValue(this.data.mediclaimCompany)
      this.personalFormGroup.get("wifemedications").setValue(this.data.wifeMedications)
      this.personalFormGroup.get("husbandmedications").setValue(this.data.husbandMedications)
      this.personalFormGroup.get("wifeparentaldetails").setValue(this.data.wifeParentalDetails)

    }
  }

  createFinalProcessForm() {

    return this.formBuilder.group({
      "membershipId": this.vmembershipId,
      "membershipDate": [(new Date()).toISOString()],
      "membershipTime": [(new Date()).toISOString()],
      "membershipNo": ["1"],
      "hprefixId": 0,
      "hgenderId": 0,
      "husbandFirstName": ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z / () ]*$")

      ]],
      "husbandMiddleName": ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z / () ]*$")

      ]],
      "husbandLastName": ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z / () ]*$")

      ]],

      "husbandDob": '1900-01-01',//[(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      "DateOfBirth": '1900-01-01',// [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      "husbandAgeY": [0],
      "husbandAgeM": [0],
      "husbandageD": [0],
      "husbandMobile": ['', [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      "husbandEmail": ['', [Validators.email]],
      "husbandBloodGroupId": [''],// ['', [Validators.required]],
      "husbandAadhaar": ['', [
        Validators.minLength(12),
        Validators.maxLength(12),
        Validators.pattern("^[0-9]*$")
      ]],
      "husbandPan": [''],//, ['', [Validators.required]],
      "husbandOccupationId": [0],//, [Validators.required]],
      "husbandEducation": [''],// ['', [Validators.required]],
      "husbandHobbies": [''],
      "hPhoto": [''],
      "wprefixId": 0,
      "wgenderId": 0,
      "wifeFirstName": ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z / () ]*$")

      ]],
      "wifeMiddleName": ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z / () ]*$")

      ]],
      "wifeLastName": ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z / () ]*$")

      ]],

      "wifeDob": '1900-01-01',// [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      // DateOfBirth1: '1900-01-01',//[(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],


      "wifeAgeY": [0],
      "wifeAgeM": [0],
      "wifeAgeD": [0],

      "wifeMobile": ['', [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      "wifeEmail": ['', [Validators.email]],
      "wifeAadhaar": ['', [
        Validators.minLength(12),
        Validators.maxLength(12),
        Validators.pattern("^[0-9]*$")
      ]],
      "wifePan": [''],

      "wifeOccupationId": [0],// ['', [Validators.required]],
      "wifeEducation": [''],//  ['', [Validators.required]],

      "wifeparentaldetails": [''],
      "wifeBloodGroupId": [''],// ['', [Validators.required]],
      "wifehobbies": [''],

      "wPhoto": [''],

      "cityId": ['', [Validators.required]],
      "cityName": [''],
      "residenceAddress": ['', [Validators.required]],
      "residencetype": [true],
      "nativePlace": [''],
      "wifeparentsnativeplace": [''],
      "husbandmedications": [''],
      "wifemedications": [''],
      "husbandFullBodyCheckupDate": [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      "wifeFullBodyCheckupDate": [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],

      "ayushmanEnrolled": [false],
      "maleFemaleEnrolled": [false],
      "ayushmanSpouseDetails": [''],
      "haayushmanId": "0",
      "waayushmanId": "0",

      "hasmediclaim": [false],
      "mediclaimcompany": [0],
      "mediclaimpolicynumber": [''],
      "mediclaimIssuanceAmt": 0,
      "mediclaimStartDate": [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      "mediclaimEndDate": [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      "monthlyIncomeRange": [0],

      "whasmediclaim": [false],
      "wmediclaimcompany": [0],
      "wmediclaimpolicynumber": [''],
      "wmediclaimIssuanceAmt": 0,
      "wmediclaimStartDate": [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      "wmediclaimEndDate": [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      "wmonthlyIncomeRange": [0],

      "familyDoctorName": ['', [Validators.required]],
      "familyDoctorContact": ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],

      "husbandPreviousMemberId": [''],
      "wifePreviousMemberId": [''],
      "declarationDate": [(new Date()).toISOString()],

      "membershipvalidDate": this.todayPlus5Years,// [(new Date()).toISOString()],
      "receiptDate": [(new Date()).toISOString()],
      "feeReceived": [true],
      "feeAmount": ['1000', [Validators.required]],

      "wmembershipvalidDate": this.wtodayPlus5Years,// [(new Date()).toISOString()],
      "wreceiptDate": [(new Date()).toISOString()],
      "wfeeReceived": [true],
      "wfeeAmount": ['1000', [Validators.required]],


      "hdeathDate": '1900-01-01',
      "wdeathDate": '1900-01-01',


      tMembershipChildren: this.formBuilder.array([]),
      tMembershipRelatives: this.formBuilder.array([]),

      tMembershipEmrgencies: this.formBuilder.array([]),

    });
  }
  Createwifeform(): FormGroup {
    return this._formBuilder.group({
      DateOfBirth: ['1900-01-01', this._FormvalidationserviceService.validDateValidator()],

    });
  }
  CreateChildrenform(): FormGroup {
    return this._formBuilder.group({
      CPrefixId: [0],
      Name: '',
      MobileNo: '',
      Address: '',

    });
  }


  Createrelativeform(): FormGroup {
    return this._formBuilder.group({
      RPrefixId: [0],
      RName: '',
      Relation: [0],
      RMobileNo: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      RAddress: '',

    });
  }

  CreateEmrgencyform(): FormGroup {
    return this._formBuilder.group({
      EPrefixId: [0],
      EName: '',
      EMobileNo: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      EAddress: '',

    });
  }


  Createchildform(item: any): FormGroup {
    console.log(item)

    return this.formBuilder.group({
      "childId": 0,
      "membershipId": 0,// this.vmembershipId,
      "prefixId": [item.PrefixId || 0],
      "prefixName": [item.PrefixName || ''],
      "childName": [item.Name || ''],
      "childMobile": [item.MobileNo || ''],
      "childAddress": [item.Address || ''],
    });
  }

  get ChildArray(): FormArray {
    return this.personalFormGroup.get('tMembershipChildren') as FormArray;
  }

  CreaterelativeDform(item: any): FormGroup {
    console.log(item)

    return this.formBuilder.group({
      "relativeId": 0,
      "membershipId": 0,// this.vmembershipId,
      "prefixId": [item.PrefixId || 0],
      "prefixName": [item.PrefixName || ''],
      "relationId": [item.RelationId || 0],
      "relativeName": [item.RName || ''],
      "relativeMobile": [item.RMobileNo || ''],
      "relativeAddress": [item.RAddress || '']
    });
  }
  get relativeDArray(): FormArray {
    return this.personalFormGroup.get('tMembershipRelatives') as FormArray;
  }


  CreateEmergform(item: any): FormGroup {
    console.log(item)

    return this.formBuilder.group({
      "emrgencyId": 0,
      "membershipId": 0,// this.vmembershipId,
      "prefixId": [item.PrefixId || 0],
      "prefixName": [item.PrefixName || ''],
      "emrgencyName": [item.EName || ''],
      "emrgencyMobile": [item.EMobileNo || ''],
      "emrgencyAddress": [item.Address || '']
    });
  }


  get EmergsArray(): FormArray {
    return this.personalFormGroup.get('tMembershipEmrgencies') as FormArray;
  }
  onChangecity(e) {
    this.CityName = e.cityName

  }
  // HusbanddataValidation() {


  //   if (this.personalFormGroup.get('husbandMobile').value == 0 || this.personalFormGroup.get('husbandMobile').value == '') {
  //     this.toastr.warning('Please select valid husbandMobile ', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });

  //   }

  //   if (this.personalFormGroup.get('husbandAadhaar').value == 0 || this.personalFormGroup.get('husbandAadhaar').value == '') {
  //     this.toastr.warning('Please select valid HusbandAadhaar ', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });

  //   }

  //   if (this.personalFormGroup.get('husbandOccupationId').value == 0 || this.personalFormGroup.get('husbandAadhaar').value == '') {
  //     this.toastr.warning('Please select valid HusbandOccupation ', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });


  //   }

  //   if (this.personalFormGroup.get('nativePlace').value == '') {
  //     this.toastr.warning('Please enter Native Place', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });


  //   }

  //   if (this.personalFormGroup.get('husbandDob').value == '1900-01-01' || this.vhusbanddob == new Date()) {
  //     this.toastr.warning('Please enter husbandDob', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //   }
  // }


  onSave() {

    if (this.personalFormGroup.get("husbandFirstName").value == '' && this.personalFormGroup.get("wifeFirstName").value == '') {
      this.toastr.warning('Please Enter Patient Details', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.personalFormGroup.get("husbandFirstName").value !== '') {
      // if (this.personalFormGroup.get('husbandMobile').value == 0 || this.personalFormGroup.get('husbandMobile').value == '') {
      //   this.toastr.warning('Please select valid husbandMobile ', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   });
      //   return;
      // } else if (this.personalFormGroup.get('husbandAadhaar').value == 0 || this.personalFormGroup.get('husbandAadhaar').value == '') {
      //   this.toastr.warning('Please select valid HusbandAadhaar ', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   });
      //   return;
      // } else if (this.personalFormGroup.get('husbandOccupationId').value == 0 || this.personalFormGroup.get('husbandAadhaar').value == '') {
      //   this.toastr.warning('Please select valid HusbandOccupation ', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   }); return;
      // } else if (this.personalFormGroup.get('nativePlace').value == '') {
      //   this.toastr.warning('Please enter Native Place', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   }); return;
      // } else
        debugger
      if (this.personalFormGroup.get('DateOfBirth').value == '1900-01-01' || this.vhusbanddob == new Date()) {
        this.toastr.warning('Please enter husbandDob', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        }); return;
      }
    }

    if (this.personalFormGroup.get("wifeFirstName").value !== '') {
      // if (this.personalFormGroup.get('wprefixId').value == 0 || this.personalFormGroup.get('wprefixId').value == '') {
      //   this.toastr.warning('Please select valid wprefixId ', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   });
      //   return;
      // } else if (this.personalFormGroup.get('wifeMobile').value == 0 || this.personalFormGroup.get('wifeMobile').value == '') {
      //   this.toastr.warning('Please select valid wife Mobile ', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   });
      //   return;
      // } else if (this.personalFormGroup.get('wifeAadhaar').value == 0 || this.personalFormGroup.get('wifeAadhaar').value == '') {
      //   this.toastr.warning('Please select valid wife Aadhaar ', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   }); return;
      // } else if (this.personalFormGroup.get('wifeOccupationId').value == 0 || this.personalFormGroup.get('wifeOccupationId').value == '') {
      //   this.toastr.warning('Please select valid wife Occupation', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   }); return;
      // } else if (this.personalFormGroup.get('wifeparentsnativeplace').value == '') {
      //   this.toastr.warning('Please enter Native Place', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   }); return;
      // } else 
        debugger
      if (this.Wifeform.get('DateOfBirth').value == '1900-01-01' || this.vhusbanddob == new Date()) {
        this.toastr.warning('Please enter Wife DateOfBirth', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        }); return;
      }
    }
    debugger
    if (this.personalFormGroup.get('cityId').value == 0 || this.personalFormGroup.get('cityId').value == '') {
      this.toastr.warning('Please select valid City Name ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (this.CityName == '') {
      this.toastr.warning('Please select valid City Name ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }


    if (this.personalFormGroup.get("hasmediclaim").value) {
      if (this.personalFormGroup.get('mediclaimpolicynumber').value == 0 || this.personalFormGroup.get('mediclaimpolicynumber').value == '') {
        this.toastr.warning('Please select valid mediclaim policynumber ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else if (this.personalFormGroup.get('mediclaimIssuanceAmt').value == 0 || this.personalFormGroup.get('mediclaimIssuanceAmt').value == '') {
        this.toastr.warning('Please select valid  mediclaim IssuanceAmt ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else if (this.personalFormGroup.get('mediclaimcompany').value == 0 || this.personalFormGroup.get('mediclaimcompany').value == '') {
        this.toastr.warning('Please select valid mediclaim company', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        }); return;
      }
    }

    if (this.personalFormGroup.get("whasmediclaim").value) {
      if (this.personalFormGroup.get('wmediclaimpolicynumber').value == 0 || this.personalFormGroup.get('wmediclaimpolicynumber').value == '') {
        this.toastr.warning('Please select valid mediclaim policynumber for Wife ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else if (this.personalFormGroup.get('wmediclaimIssuanceAmt').value == 0 || this.personalFormGroup.get('wmediclaimIssuanceAmt').value == '') {
        this.toastr.warning('Please select valid  mediclaim IssuanceAmt for Wife ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else if (this.personalFormGroup.get('wmediclaimcompany').value == 0 || this.personalFormGroup.get('wmediclaimcompany').value == '') {
        this.toastr.warning('Please select valid mediclaim company for Wife ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        }); return;
      }
    }

    if (this.personalFormGroup.get("DateOfBirth").value != '1900-01-01') {
      const DateOfBirth1 = this.personalFormGroup.get("DateOfBirth").value
      if (DateOfBirth1) {
        const todayDate = new Date();
        const dob = new Date(DateOfBirth1);
        const timeDiff = Math.abs(Date.now() - dob.getTime());
        this.ageYear = (todayDate.getFullYear() - dob.getFullYear());
        this.ageMonth = (todayDate.getMonth() - dob.getMonth());
        this.ageDay = (todayDate.getDate() - dob.getDate());

        if (this.ageDay < 0) {
          (this.ageMonth)--;
          const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
          this.ageDay += previousMonth.getDate(); // Days in previous month

        }

        if (this.ageMonth < 0) {
          this.ageYear--;
          this.ageMonth += 12;
        }
      }
    }
    debugger
    if (this.Wifeform.get("DateOfBirth").value != '1900-01-01') {
      const DateOfBirth2 = this.Wifeform.get("DateOfBirth").value
      if (DateOfBirth2) {
        const todayDate = new Date();
        const dob = new Date(DateOfBirth2);
        const timeDiff = Math.abs(Date.now() - dob.getTime());
        this.ageYear1 = (todayDate.getFullYear() - dob.getFullYear());
        this.ageMonth1 = (todayDate.getMonth() - dob.getMonth());
        this.ageDay1 = (todayDate.getDate() - dob.getDate());

        if (this.ageDay1 < 0) {
          (this.ageMonth1)--;
          const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
          this.ageDay1 += previousMonth.getDate(); // Days in previous month

        }

        if (this.ageMonth1 < 0) {
          this.ageYear1--;
          this.ageMonth1 += 12;
        }
      }
      this.personalFormGroup.get('wifeAgeY').setValue(this.ageDay1)
      this.personalFormGroup.get('wifeAgeM').setValue(this.ageMonth1)
      this.personalFormGroup.get('wifeAgeD').setValue(this.ageDay1)
    }

    if (this.personalFormGroup.get("ayushmanEnrolled").value !== false) {
      if (this.personalFormGroup.get('ayushmanSpouseDetails').value == 0 || this.personalFormGroup.get('ayushmanSpouseDetails').value == '') {
        this.toastr.warning('Please Enter valid ayushman SpouseDetails', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }


    console.log(this.DSChildrenList.data)
    this.DSChildrenList.data.forEach(item => {
      this.ChildArray.push(this.Createchildform(item));
    });

    this.DSRelativeList.data.forEach(item => {
      this.relativeDArray.push(this.CreaterelativeDform(item));
    });
    console.log(this.DSRelativeList.data)

    console.log(this.DSEmrgencyList.data)
    this.DSEmrgencyList.data.forEach(item => {
      this.EmergsArray.push(this.CreateEmergform(item));
    });


    console.log(this.personalFormGroup.get("DateOfBirth").value)
    console.log(this.Wifeform.get("DateOfBirth").value)

    this.personalFormGroup.get("husbandDob").setValue(this.datePipe.transform(this.personalFormGroup.get("DateOfBirth").value, "yyyy-MM-dd"))
    this.personalFormGroup.get("wifeDob").setValue(this.datePipe.transform(this.Wifeform.get("DateOfBirth").value, "yyyy-MM-dd"))

    if (this.vmembershipId == 0) {
      this.personalFormGroup.get('husbandAgeY').setValue(this.ageYear);
      this.personalFormGroup.get('husbandAgeM').setValue(this.ageMonth);
      this.personalFormGroup.get('husbandageD').setValue(this.ageDay);
      this.personalFormGroup.get("wifeAgeY").setValue((this.ageYear1) || 0)
      this.personalFormGroup.get("wifeAgeM").setValue((this.ageMonth1) || 0)
      this.personalFormGroup.get("wifeAgeD").setValue((this.ageDay1) || 0)
    }
    this.personalFormGroup.get('cityName').setValue(this.CityName)
    this.personalFormGroup.get("hprefixId").setValue(parseInt(this.personalFormGroup.get("hprefixId").value))
    this.personalFormGroup.get("cityId").setValue(parseInt(this.personalFormGroup.get("cityId").value || 0))
    this.personalFormGroup.get("wprefixId").setValue(parseInt(this.personalFormGroup.get("wprefixId").value || 0))
    this.personalFormGroup.get("husbandOccupationId").setValue(parseInt(this.personalFormGroup.get("husbandOccupationId").value || 0))
    this.personalFormGroup.get("wifeOccupationId").setValue(parseInt(this.personalFormGroup.get("wifeOccupationId").value || 0))

    this.personalFormGroup.get("membershipDate").setValue(this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd") || this.data.membershipDate || '1900-01-01')
    this.personalFormGroup.get("membershipTime").setValue(this.datePipe.transform(this.dateTimeObj.date) || this.data.membershipDate || '1900-01-01')

    this.personalFormGroup.get("husbandFullBodyCheckupDate").setValue(this.datePipe.transform(this.personalFormGroup.get("husbandFullBodyCheckupDate").value, "yyyy-MM-dd") || this.data.husbandFullBodyCheckupDate || '1900-01-01')
    this.personalFormGroup.get("wifeFullBodyCheckupDate").setValue(this.datePipe.transform(this.personalFormGroup.get("wifeFullBodyCheckupDate").value, "yyyy-MM-dd") || this.data.wifeFullBodyCheckupDate || '1900-01-01')
    this.personalFormGroup.get("mediclaimStartDate").setValue(this.datePipe.transform(this.personalFormGroup.get("mediclaimStartDate").value, "yyyy-MM-dd") || this.data.mediclaimStartDate || '1900-01-01')
    this.personalFormGroup.get("mediclaimEndDate").setValue(this.datePipe.transform(this.personalFormGroup.get("mediclaimEndDate").value, "yyyy-MM-dd") || this.data.wifeFullBodyCheckupDate || '1900-01-01')
    this.personalFormGroup.get("declarationDate").setValue(this.datePipe.transform(this.personalFormGroup.get("declarationDate").value, "yyyy-MM-dd"))
    this.personalFormGroup.get("receiptDate").setValue(this.datePipe.transform(this.personalFormGroup.get("receiptDate").value, "yyyy-MM-dd"))
    debugger
    console.log(this.personalFormGroup.value)

    // if (this.SaveStatus != true) {
    if (!this.personalFormGroup.invalid) {

      console.log(this.personalFormGroup.value)

      this._NewMemberService.MembershipSave(this.personalFormGroup.value).subscribe(response => {
        console.log(response)
        this.getMembershipview(response)
        this._matDialog.closeAll();

      });
    } else {
      const invalidFields = [];

      if (this.personalFormGroup.invalid) {
        for (const controlName in this.personalFormGroup.controls) {
          if (this.personalFormGroup.controls[controlName].invalid) {
            invalidFields.push(`Membership Save Form: ${controlName}`);
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
    // }

  }

  Clist1: any[] = [];
  RClist1: any[] = [];
  Elist1: any[] = [];
  getOtherdetailsList(param) {

    console.log(param)
    this._NewMemberService.getMemeberbyIdList(param).subscribe(res => {
      console.log(res)
      console.log(res.data)
      if (res) {

        this.DSChildrenList.data = res.tMembershipChildren
        this.DSRelativeList.data = res.tMembershipRelatives
        this.DSEmrgencyList.data = res.tMembershipEmrgencies

        console.log(this.DSChildrenList.data)
        console.log(this.DSRelativeList.data)
        console.log(this.DSEmrgencyList.data)

        if (this.DSChildrenList.data.length > 0) {
          this.DSChildrenList.data.forEach((element) => {


            const newEntry = {
              Prefix: element.prefixId || 0,
              PrefixName: element.prefixName || '',
              Name: element.childName || '',
              MobileNo: element.childMobile || '',
              Address: element.childAddress || '',

            }
            this.Clist1.push(newEntry);

          });

          this.DSChildrenList.data = [...this.Clist1];

        }

        // 

        if (this.DSRelativeList.data.length > 0) {
          this.DSRelativeList.data.forEach((element) => {

            const newEntry = {
              Prefix: element.prefixId || 0,
              PrefixName: element.prefixName || '',
              RelationId: element.relationId || 0,

              RName: element.relativeName || '',
              RMobileNo: element.relativeMobile || '',
              RAddress: element.relativeAddress || '',
              RelationName: element.relativeAddress || '',
            }
            this.RClist1.push(newEntry);

          });

          this.DSRelativeList.data = [...this.RClist1];

        }


        if (this.DSEmrgencyList.data.length > 0) {
          this.DSEmrgencyList.data.forEach((element) => {

            console.log(element)
            const newEntry = {
              Prefix: element.prefixId || 0,
              PrefixName: element.prefixName || '',
              EName: element.emrgencyName || '',
              EMobileNo: element.emrgencyMobile || '',
              Address: element.emrgencyAddress || '',

            }
            this.Elist1.push(newEntry);

          });

          this.DSEmrgencyList.data = [...this.Elist1];

        }
      }
    });

  }


  getRelativeList() {

    const param = {
      "first": 0,
      "rows": 100,
      "sortField": "PcpndprocessDetId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "PCPNDTProcessId",
          "fieldValue": String(this.vpcpndtprocessId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
      ]
    }


    console.log(param)
    this._NewMemberService.getRelativebyIdList(param).subscribe(res => {
      console.log(res.data)

      this.DSRelativeList.data = res.data

      console.log(this.DSRelativeList.data)
    });

  }

  getEmergencList() {

    const param = {
      "first": 0,
      "rows": 100,
      "sortField": "PcpndprocessDetId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "PCPNDTProcessId",
          "fieldValue": String(this.vpcpndtprocessId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
      ]
    }


    console.log(param)
    this._NewMemberService.getEmergencbyIdList(param).subscribe(res => {
      console.log(res.data)

      this.DSEmrgencyList.data = res.data

      console.log(this.DSEmrgencyList.data)
    });

  }
  getMembershipview(Id) {
    setTimeout(() => {

      const param = {
        "searchFields": [
          {
            "fieldName": "MembershipId",
            "fieldValue": String(Id),
            "opType": "Equals"
          },

        ],
        "mode": "TrustMembershipRegistrationForm"
      }


      console.log(param)
      this._NewMemberService.getReportView(param).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Membership Registration Form  Viewer"

            }
          });

        matDialog.afterClosed().subscribe(result => {

        });
      });

    }, 100);

  }

  vSelectedOption: any = '1';
  onChangePatientType(event) {
    if (event.value == '0') {
      this.RegId = '';
      this.OP_IPType = 0

    } else if (event.value == '1') {
      this.RegId = '';
      this.OP_IPType = 1
    }
  }
  genderName = ""
  getSelectedObjOP(obj) {
    this.Patientobj = obj
    console.log(obj);
    this.Patientdetails = obj;
    this.OPDNoCheck = false;
    this.DoctorNamecheck = false;
    this.IPDNocheck = false;
    this.PatientName = obj.firstName + ' ' + obj.lastName;
    this.RegId = obj.regId;
    this.OP_IP_Id = obj.visitId;
    this.OPDNo = obj.opdNo;
    this.HospitalId = obj.hospitalId;
    this.DoctorName = obj.doctorName;
    this.RegNo = obj?.regNo;
    this.genderName = obj?.genderName;


  }

  getSelectedObjRegIP(obj) {
    console.log(obj);

    // this.Patientobj = obj
    let IsDischarged = 0;
    IsDischarged = obj.isDischarged;
    if (IsDischarged == 1) {
      Swal.fire('Selected Patient is already discharged');
      this.RegId = '';
    } else {
      this.Patientdetails = obj;
      this.DoctorNamecheck = true;
      this.IPDNocheck = false;
      this.OPDNoCheck = false;
      this.PatientName = obj.firstName + ' ' + obj.lastName;
      this.RegId = obj.regID;
      this.OP_IP_Id = obj.admissionID;
      this.IPDNo = obj.ipdNo;
      this.DoctorName = obj.doctorName;
      this.tariffName = obj.tariffName;
      this.roomName = obj.roomName;
      this.bedName = obj.bedName;
      this.RegNo = obj?.regNo;
      this.departmentName = obj?.departmentName;
      this.genderName = obj?.genderName;
    }


  }

  relationName = ''
  onChangerelation(value) {
    this.relationName = value.text
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getValidationMessages() {
    return {
      husbandfname: [],
      husbandmname: [],
      husbandlname: [],

      wifename: [],
      wifeparentaldetails: [],

      husbandAgey: [],
      husbandAgeM: [],
      husbandAgeD: [],

      wifeagey: [],
      wifeageM: [],
      wifeageD: [],


      husbandmobile: [],
      husbandemail: [],
      wifemobile: [],
      wifeemail: [],

      residenceaddress: [],
      residencetype: [],
      nativeplace: [],
      wifeparentsnativeplace: [],


      husbandbloodgroup: [],
      wifebloodgroup: [],

      husbandaadhaar: [],
      husbandpan: [],
      wifeaadhaar: [],
      wifepan: [],


      husbandoccupation: [],
      wifeoccupation: [],

      husbandeducation: [],
      wifeeducation: [],

      husbandhobbies: [],
      wifehobbies: [],


      husbandmedications: [],
      wifemedications: [],
      ayushmanmaleenrolled: [],
      maleFemaleEnrolled: [],
      ayushmanspousedetails: [],

      hasmediclaim: [],
      mediclaimcompany: [],
      mediclaimpolicynumber: [],
      mediclaimissuance: [],

      familydoctorname: [],
      familydoctorcontact: [],

      monthlyincomerange: [],

      husbandpreviousmemberid: [],
      wifepreviousmemberid: [],


      membershipnumber: [],
      MobileNo: [],
      Relation: [],
      feeamount: [],
      cityId: [],
      CPrefixId: [],
      RprefixId: [],
      EprefixId: [],
      hprefixId: [],
      wprefixId: [],
      wgenderId: [],
      hgenderId: [],

      wmediclaimcompany: [],
    };
  }

  onClose() {

    this._matDialog.closeAll()
  }
  imagePreview!: string;
  imagePreview1!: string;
  openCamera(type: string, place: string) {
    const dialogRef = this._matDialog.open(ImageViewComponent,
      {
        width: '750px',
        height: '550px',

        data: {
          docData: type == 'camera' ? 'camera' : '',
          type: type == 'camera' ? 'camera' : '',
          place: place
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (place == "photo") {
          this.imagePreview = result.url;
        }
        else {

        }
      }
    });
  }
  openCamera1(type: string, place: string) {
    const dialogRef = this._matDialog.open(ImageViewComponent,
      {
        width: '750px',
        height: '550px',

        data: {
          docData: type == 'camera' ? 'camera' : '',
          type: type == 'camera' ? 'camera' : '',
          place: place
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (place == "photo") {
          this.imagePreview1 = result.url;
        }
        else {

        }
      }
    });
  }



  list1: any[] = [];
  onAdd() {
    if ((this.Childrensform.get("Name").value == "")) {
      this.toastr.warning('Please enter Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }


    if ((this.Childrensform.get("MobileNo").value == "" || this.Childrensform.get("MobileNo").value.length !== 10)) {
      this.toastr.warning('Please enter a valid 10-digit mobile number', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }


    if (this.vmembershipId > 0 && this.DSChildrenList.data.length > 0) {

      const newEntry = {
        PrefixId: this.Childrensform.get('CPrefixId').value || 0,
        PrefixName: this.CPrefix,//
        Name: this.Childrensform.get('Name').value || '',
        MobileNo: this.Childrensform.get('MobileNo').value || '',
        Address: this.Childrensform.get('Address').value || '',

      }
      this.DSChildrenList.data.push(newEntry as any);
      this.DSChildrenList.data = this.DSChildrenList.data
    }
    else {
      const newEntry = {
        PrefixId: this.Childrensform.get('CPrefixId').value || 0,
        PrefixName: this.CPrefix,//
        Name: this.Childrensform.get('Name').value || '',
        MobileNo: this.Childrensform.get('MobileNo').value || '',
        Address: this.Childrensform.get('Address').value || '',

      }
      this.list1.push(newEntry);

      this.DSChildrenList.data = [...this.list1];
    }


    this.Childrensform.get('CPrefixId').reset('');
    this.Childrensform.get('Name').reset('');
    this.Childrensform.get('MobileNo').reset('');
    this.Childrensform.get('Address').reset('');

    const serviceIdElement = document.querySelector(`[name='Name']`) as HTMLElement;
    if (serviceIdElement) {
      serviceIdElement.focus();
    }
  }



  list2: any[] = [];
  onAdd1() {
    if ((this.Relativeform.get("RName").value == "")) {
      this.toastr.warning('Please enter Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if ((this.Relativeform.get("RMobileNo").value == "" || this.Relativeform.get("RMobileNo").value.length !== 10)) {
      this.toastr.warning('Please enter a valid 10-digit mobile number', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (this.vmembershipId > 0 && this.DSRelativeList.data.length > 0) {



      const newEntry1 = {
        PrefixId: this.Relativeform.get('RPrefixId').value || 0,
        PrefixName: this.RPrefix,// this.Relativeform.get('RPrefixId').value || '',
        RName: this.Relativeform.get('RName').value || '',
        RelationId: this.Relativeform.get('Relation').value || '',
        RelationName: this.relationName,// this.Relativeform.get('Relation').value || '',
        RMobileNo: this.Relativeform.get('RMobileNo').value || '',
        RAddress: this.Relativeform.get('RAddress').value || '',
      }
      this.DSRelativeList.data.push(newEntry1 as any);
      this.DSRelativeList.data = this.DSRelativeList.data

    } else {

      const newEntry = {
        PrefixId: this.Relativeform.get('RPrefixId').value || 0,
        PrefixName: this.RPrefix,// this.Relativeform.get('RPrefixId').value || '',
        RName: this.Relativeform.get('RName').value || '',
        RelationId: this.Relativeform.get('Relation').value || '',
        RelationName: this.relationName,// this.Relativeform.get('Relation').value || '',
        RMobileNo: this.Relativeform.get('RMobileNo').value || '',
        RAddress: this.Relativeform.get('RAddress').value || '',

      }
      this.list2.push(newEntry);
      this.DSRelativeList.data = [...this.list2];
    }
    this.Relativeform.get('RPrefixId').reset('');
    this.Relativeform.get('RName').reset('');
    this.Relativeform.get('Relation').reset('');
    this.Relativeform.get('RMobileNo').reset('');
    this.Relativeform.get('RAddress').reset('');
    this.relationName = ''
    const serviceIdElement = document.querySelector(`[name='RName']`) as HTMLElement;
    if (serviceIdElement) {
      serviceIdElement.focus();
    }
  }

  list3: any[] = [];
  onAdd2() {
    if ((this.Emrgencyform.get("EName").value == "")) {
      this.toastr.warning('Please enter Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.Emrgencyform.get("EMobileNo").value == "" || this.Emrgencyform.get("EMobileNo").value.length !== 10)) {
      this.toastr.warning('Please enter a valid 10-digit mobile number', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.DSEmrgencyList.data.length > 0) {
      this.DSEmrgencyList.data.forEach((element) => {
        const newEntry2 = {
          PrefixId: this.Emrgencyform.get('EPrefixId').value || 0,
          PrefixName: this.EPrefix,// this.Emrgencyform.get('EPrefixId').value || '',
          EName: this.Emrgencyform.get('EName').value || '',
          EMobileNo: this.Emrgencyform.get('EMobileNo').value || '',
          Address: this.Emrgencyform.get('EAddress').value || '',
        }
        this.DSEmrgencyList.data.push(newEntry2 as any);
        this.DSEmrgencyList.data = this.DSEmrgencyList.data
      });


    }

    else {

      const newEntry1 = {
        PrefixId: this.Emrgencyform.get('EPrefixId').value || 0,
        PrefixName: this.EPrefix,// this.Emrgencyform.get('EPrefixId').value || '',
        EName: this.Emrgencyform.get('EName').value || '',
        EMobileNo: this.Emrgencyform.get('EMobileNo').value || '',
        Address: this.Emrgencyform.get('EAddress').value || '',

      }

      this.Elist1.push(newEntry1);
      this.DSEmrgencyList.data = [...this.Elist1];
    }
    this.Emrgencyform.get('EPrefixId').reset('');
    this.Emrgencyform.get('EName').reset('');
    this.Emrgencyform.get('EMobileNo').reset('');
    this.Emrgencyform.get('EAddress').reset('');


    const serviceIdElement = document.querySelector(`[name='EName']`) as HTMLElement;
    if (serviceIdElement) {
      serviceIdElement.focus();
    }
  }

  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressCharater(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  childlist: any = [];
  deleteTableRow(event, element) {
    this.childlist = this.DSChildrenList.data;
    const index = this.childlist.indexOf(element);
    if (index >= 0) {
      this.childlist.splice(index, 1);
      this.DSChildrenList.data = [];
      this.DSChildrenList.data = this.childlist;

    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  Rellist: any = [];
  deleteTableRow1(event, element) {
    this.Rellist = this.DSRelativeList.data;
    const index = this.Rellist.indexOf(element);
    if (index >= 0) {
      this.Rellist.splice(index, 1);
      this.DSRelativeList.data = [];
      this.DSRelativeList.data = this.Rellist;

    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  Emgllist: any = [];
  deleteTableRow2(event, element) {
    this.Emgllist = this.DSEmrgencyList.data;
    const index = this.Emgllist.indexOf(element);
    if (index >= 0) {
      this.Emgllist.splice(index, 1);
      this.DSEmrgencyList.data = [];
      this.DSEmrgencyList.data = this.Emgllist;

    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  wMName = ''
  wLName = ''
  HFNameAdd() {
    // this.wMName = this.personalFormGroup.get('husbandFirstName').value
    if (this.personalFormGroup.get("husbandFirstName").value !== '') {


      // this.personalFormGroup.get('hprefixId').reset();
      this.personalFormGroup.get('hprefixId').setValidators([Validators.required]);
      this.personalFormGroup.get('hprefixId').enable();
      // this.personalFormGroup.get('husbandMobile').reset();
      this.personalFormGroup.get('husbandMobile').setValidators([Validators.required]);
      this.personalFormGroup.get('husbandMobile').enable();

      // this.personalFormGroup.get('husbandAadhaar').reset();
      this.personalFormGroup.get('husbandAadhaar').setValidators([Validators.required]);
      this.personalFormGroup.get('husbandAadhaar').enable();
      // this.personalFormGroup.get('husbandOccupationId').reset();
      this.personalFormGroup.get('husbandOccupationId').setValidators([Validators.required]);
      this.personalFormGroup.get('husbandOccupationId').enable();
      // this.personalFormGroup.get('nativePlace').reset();
      this.personalFormGroup.get('nativePlace').setValidators([Validators.required]);
      this.personalFormGroup.get('nativePlace').enable();
      // this.personalFormGroup.get('DateOfBirth').reset();
      this.personalFormGroup.get('DateOfBirth').setValidators([Validators.required]);
      this.personalFormGroup.get('DateOfBirth').enable();

    }
  }

  WNameAdd() {

    if (this.personalFormGroup.get("wifeFirstName").value !== '') {

      this.personalFormGroup.get('wprefixId').setValidators([Validators.required]);
      this.personalFormGroup.get('wprefixId').enable();
      this.personalFormGroup.get('wifeMobile').setValidators([Validators.required]);
      this.personalFormGroup.get('wifeMobile').enable();
      this.personalFormGroup.get('wifeAadhaar').setValidators([Validators.required]);
      this.personalFormGroup.get('wifeAadhaar').enable();
      this.personalFormGroup.get('wifeOccupationId').setValidators([Validators.required]);
      this.personalFormGroup.get('wifeOccupationId').enable();
      this.personalFormGroup.get('wifeparentsnativeplace').setValidators([Validators.required]);
      this.personalFormGroup.get('wifeparentsnativeplace').enable();
      this.Wifeform.get('DateOfBirth').setValidators([Validators.required]);
      this.Wifeform.get('DateOfBirth').enable();
    }
  }

  hasmediclaimAdd() {

    if (this.personalFormGroup.get("hasmediclaim").value) {


      this.personalFormGroup.get('mediclaimpolicynumber').reset();
      this.personalFormGroup.get('mediclaimpolicynumber').setValidators([Validators.required]);
      this.personalFormGroup.get('mediclaimpolicynumber').enable();

      this.personalFormGroup.get('mediclaimIssuanceAmt').reset();
      this.personalFormGroup.get('mediclaimIssuanceAmt').setValidators([Validators.required]);
      this.personalFormGroup.get('mediclaimIssuanceAmt').enable();

      this.personalFormGroup.get('mediclaimcompany').reset();
      this.personalFormGroup.get('mediclaimcompany').setValidators([Validators.required]);
      this.personalFormGroup.get('mediclaimcompany').enable();
    }
  }

  onChangeCPrefix(e) {
    this.CPrefix = e.prefixName
    console.log(e)
  }

  onChangeRPrefix(e) {
    this.RPrefix = e.prefixName
  }
  onChangeEPrefix(e) {
    this.EPrefix = e.prefixName
  }

  onChangePrefix(e) {
    this.ddlGender.SetSelection(e.sexId);
  }

  onChangePrefix1(e) {
    this.ddlGender1.SetSelection(e.sexId);
  }

  onChangeDateofBirth(DateOfBirth: Date) {


    if (DateOfBirth > this.minDate) {
      this.toastr.warning('Enter Proper Birth Date..', 'warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
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

      }

      if (this.ageMonth < 0) {
        this.ageYear--;
        this.ageMonth += 12;
      }


      this.value = DateOfBirth;
      this.dateofBirth = DateOfBirth;
      this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);

      this.personalFormGroup.get('husbandAgeY').setValue(this.ageYear);
      this.personalFormGroup.get('husbandAgeM').setValue(this.ageMonth);
      this.personalFormGroup.get('husbandageD').setValue(this.ageDay);

      if (this.ageYear > 110)
        this.toastr.warning('Please Enter Valid BirthDate..', 'warning !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
    }
  }

  onChangeDateofBirth1(DateOfBirth: Date) {

    if (DateOfBirth > this.minDate) {
      this.toastr.warning('Enter Proper Birth Date..', 'warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      return;
    }
    if (DateOfBirth) {
      const todayDate = new Date();
      const dob = new Date(DateOfBirth);
      const timeDiff = Math.abs(Date.now() - dob.getTime());

      this.ageYear1 = todayDate.getFullYear() - dob.getFullYear();
      this.ageMonth1 = (todayDate.getMonth() - dob.getMonth());
      this.ageDay1 = (todayDate.getDate() - dob.getDate());

      if (this.ageDay1 < 0) {
        this.ageMonth1--;
        const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
        this.ageDay1 += previousMonth.getDate(); // Days in previous month

      }

      if (this.ageMonth1 < 0) {
        this.ageYear1--;
        this.ageMonth1 += 12;
      }


      this.value1 = DateOfBirth;
      this.personalFormGroup.get('wifeDob').setValue(DateOfBirth);
      this.personalFormGroup.get("wifeAgeY").setValue((this.ageYear1) || 0)
      this.personalFormGroup.get("wifeAgeM").setValue((this.ageMonth1) || 0)
      this.personalFormGroup.get("wifeAgeD").setValue((this.ageDay1) || 0)

      if (this.ageYear1 > 110)
        this.toastr.warning('Please Enter Valid BirthDate..', 'warning !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
    }
  }

  allowOnlyAlphabets(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', ' '];

    if (allowedKeys.includes(event.key)) {
      return;
    }
    if (!/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}



export class Childdetail {
  Prefix: any
  Name: any;
  MobileNo: any;
  Address: any;

  childId: any;
  membershipId: any;
  prefixId: any;
  childName: any;
  childMobile: any;
  childAddress: any;
  prefixName: any;

  constructor(Childdetail) {
    this.Name = Childdetail.Name || '';
    this.MobileNo = Childdetail.MobileNo || '';
    this.Address = Childdetail.Address || '';
    this.Prefix = Childdetail.Prefix || '';

    this.childId = Childdetail.childId || '';
    this.membershipId = Childdetail.membershipId || '';
    this.prefixId = Childdetail.prefixId || '';
    this.childName = Childdetail.childName || '';
    this.childMobile = Childdetail.childMobile || '';
    this.childAddress = Childdetail.childAddress || '';
    this.prefixName = Childdetail.prefixName || '';


  }
}



export class Relativedetail {
  Prefix: any
  RName: any;
  Relation: any;
  RMobileNo: any;
  RAddress: any;

  relativeId: any;
  membershipId: any;
  prefixId: any;
  relationId: any;
  relativeName: any;
  relativeMobile: any;
  relativeAddress: any;
  prefixName: any;

  constructor(Relativedetail) {
    this.RName = Relativedetail.RName || '';
    this.Relation = Relativedetail.Relation || '';
    this.RMobileNo = Relativedetail.RMobileNo || '';
    this.RAddress = Relativedetail.RAddress || '';
    this.Prefix = Relativedetail.Prefix || '';

    this.relativeId = Relativedetail.relativeId || '';
    this.membershipId = Relativedetail.membershipId || '';
    this.prefixId = Relativedetail.prefixId || '';
    this.relationId = Relativedetail.relationId || '';
    this.relativeName = Relativedetail.relativeName || '';

    this.relativeMobile = Relativedetail.relativeMobile || '';
    this.relativeAddress = Relativedetail.relativeAddress || '';
    this.prefixName = Relativedetail.prefixName || '';
  }
}


export class Emrgencdetail {
  Prefix: any
  EName: any;
  EMobileNo: any;
  EAddress: any;
  prefixName: any;
  prefixId: any;
  emrgencyName: any;
  emrgencyAddress: any;
  emrgencyMobile: any;
  constructor(Emrgencdetail) {
    this.EName = Emrgencdetail.EName || '';
    this.EMobileNo = Emrgencdetail.EMobileNo || '';
    this.EAddress = Emrgencdetail.EAddress || '';
    this.Prefix = Emrgencdetail.Prefix || '';
    this.prefixId = Emrgencdetail.prefixId || '';
    this.emrgencyName = Emrgencdetail.emrgencyName || '';
    this.emrgencyAddress = Emrgencdetail.emrgencyAddress || '';
    this.emrgencyMobile = Emrgencdetail.emrgencyMobile || '';
    this.prefixName = Emrgencdetail.prefixName || '';
  }
}

