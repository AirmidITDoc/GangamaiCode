import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
// import { AdvanceDetailObj, ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { ConfigService } from 'app/core/services/config.service';
import { ItemNameList } from 'app/main/purchase/purchase-order/purchase-order.component';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { debounce } from 'lodash';
import { PreviousDeptListComponent } from 'app/main/opd/appointment-list/update-reg-patient-info/previous-dept-list/previous-dept-list.component';
import { MatSelectChange } from '@angular/material/select';
import { ApiCaller } from 'app/core/services/apiCaller';
import { PackageDetailsComponent } from 'app/main/opd/appointment-list/appointment-billing/package-details/package-details.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ChargesList, LabPatientList, LabRequest } from '../../lab-patient-reg/lab-patient-reg.component';
import { HomeCollectionService } from '../home-collection.service';

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewCollectionComponent {
  myForm: FormGroup
  ServiceDetform: FormGroup

  screenFromString = 'Common-form';
  registerObj = new LabPatientList({});
  CityName = ""
  vTariffId: any = 1;
  vClassId: any = 1;
  ApiURL: any = '';
  isServiceIdSelected: boolean = false;
  isDoctor: boolean = false;

  autocompleteModepatienttype: string = "PatientType";
  autocompleteModegender: string = "Gender";
  autocompleteModecity: string = "City";
  autocompleteModeDepartment: string = "Department";
  autocompleteModerefdoc: string = "RefDoctor";
  autocompleteModeunit: string = "Hospital";
  autocompleteModeClass: string = "Class";
  autocompleteModetariff: string = "Tariff";
  autocompleteModecompany: string = "Company";
  autocompleteModesubcompany: string = "SubCompany";
  autocompleteModecamp: string = "CampMaster";
  autocompleteModedoctor: string = "ConDoctor";
  autocompleteModeConcession: string = "Concession";
  autocompleteModeLabPatientType: string = "LabPatientType";

  dsLabRequest2 = new MatTableDataSource<LabRequest>();
  public dsPackageList = new MatTableDataSource<ChargesList>();
  filteredOptions: any[] = [];
  prevResults: any[] = [];

  public dstable1 = new MatTableDataSource<ChargesList>();
  dsCopyItemList = new MatTableDataSource<ChargesList>();

  debounceTimers: { [key: string]: any } = {};
  chargeslist: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dateTimeObj: any;

  minDate = new Date();
  selectedPatient: any;
  selectedMobile: any;

  regNo = 0;
  PatientName: any;
  opdNo = "0";
  ageYear: any;
  ageMonth: any;
  ageDays: any;
  ageDay = 0;
  doctorId = 0;
  doctorname = '';
  servicedoctorname: any;
  serivcedoctorId: any;
  companyId = 0;
  companyName = '';
  ExclusionAmt = '';
  InclusionAmt = '';
  ConcessionId = 0;
  ConcessionReason = '';
  departmentname = '';
  IsPathology: any;
  IsRadiology: any;
  vIsPackage: any;
  isCompanySelected: boolean = false;
  isTariffSelect: boolean = false;
  patienttype = 0
  mode: any;
  isExpanded2 = false;
  public chargeList: ChargesList[] = [];
  VlabPatRegId: any;
  savebtn: boolean = true;
  Consessionres: boolean = false;

  displayedServiceColumns: string[] = [
    'ServiceName',
    'price',
    // 'Action'
  ]

  displayedServiceselected: string[] = [
    'Status',
    'ServiceName',
    'DoctorName',
    'Urgent',
    'Price',
    'DiscountPer',
    'DiscountAmount',
    'NetAmount',
    'buttons'
  ]
  public displayedColumnspackage: string[] =
    ['IsCheck', 'ServiceNamePackage', 'ServiceName', 'Price', 'DoctorName'];

  doctorOptions: any[] = [];
  onlineflag: boolean = false;
  abhaForm: FormGroup;
  UnitId: any = this.accountService.currentUserValue.user.unitId;
  vRefDocId: any = 0
  vRefDocName: any = ''
  regflag = false
  SrvcName1: any = "";
  serviceId: any;
  vQty: any;
  chkIsEditable: boolean = true;
  serviceSelct = false
  public isDiscountApplied = false;
  isRowDiscountApplied = false;
  public packageList: ChargesList[] = [];
  PacakgeList: any = [];
  EditedPackageService: any = [];
  OriginalPackageService: any = [];
  TotalPrice: any = 0;

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  @ViewChild('ddlcompanyExec') ddlcompanyExec: AirmidDropDownComponent;

  @ViewChild('serviceInput') serviceInput!: ElementRef<HTMLInputElement>;

  constructor(public _homeColletionService: HomeCollectionService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewCollectionComponent>,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    private hospitalconfigservice: HospitalConfigService,
    public toastrService: ToastrService, public _ConfigService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiCaller: ApiCaller,
  ) { }

  ngOnInit(): void {
    this.myForm = this.CreateMyForm();
    this.myForm.markAllAsTouched();

    this.loadDropdownOptions();

    if (this.data?.homeCollectionId) {
      this._homeColletionService.gethomeCollById(this.data?.homeCollectionId).subscribe((response) => {
        console.log(response)
        this.registerObj = response;
        this.value = response.dateofBirth
        this.regNo = response.labRequestNo
        this.onChangeDateofBirth(response.dateofBirth)
        this.regflag = true
        this.myForm.patchValue({
          firstName: this.registerObj.firstName.trim(),
          middleName: this.registerObj.middleName.trim(),
          LastName: this.registerObj.lastName.trim(),
          MobileNo: this.registerObj.mobileNo.trim(),
          address: this.registerObj.address.trim(),
          // DateOfBirth:this.registerObj.dateofBirth,
        });

      });

      // this.myForm.get('DateOfBirth').setValue(this.registerObj.dateofBirth)
      // this.onChangeDateofBirth(this.registerObj.dateofBirth)
      // this.myForm.patchValue(this.registerObj)
      this.getCollectionList();
    }

    this.getServiceList();
    // console.log(this.hospitalconfigservice.HospitalconfigParams)
    // console.log(this._ConfigService.configParams)

    this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&SrvcName="
  }

  FetchList: any = [];
  getCollectionList() {
    var param = {
      "first": 0,
      "rows": 10,
      "sortField": "HomeCollectionId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "HomeCollectionId",
          "fieldValue": String(this.data.homeCollectionId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }

    this._homeColletionService.getCollectionById(param).subscribe(Menu => {
      this.FetchList = Menu.data as ChargesList[];

      let hasPrevDiscount = false;
      if (Array.isArray(this.FetchList)) {
        this.FetchList.forEach(item => {
          item.serviceId = item.testId;
          item.serviceName = item.serviceName;
          item.price = item.price;
          item.totalAmt = item.totalAmount;
          item.netAmount = item.netAmount;
          item.DiscPer = item.discPer
          item.DiscAmt = item.discAmount

          if (item.DiscAmt > 0 || item.DiscPer > 0) {
            this.isDiscountApplied = true;
            hasPrevDiscount = true;
          }

          this.onSaveEntry(item);

        });
      }
    });

  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  CreateMyForm() {
    {
      return this._formbuilder.group({
        homeCollectionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        middleName: ['', [Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
        genderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
        ageY: ['', [Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
        ageM: ['', [Validators.pattern("^[0-9]*$")]],
        ageD: ['', [Validators.pattern("^[0-9]*$")]],
        mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        address: ['', [Validators.required]],
        patRegId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        remark: [''],
        priority: true, //
        collectionDate: ['', Validators.required],
        collectionTime: ['', Validators.required],
        phlebotomist: 0,
        location: "Pune",
        latitude: "pune", //
        longitude: "pune", //
        radius: "srua", //
        isCancel: false,
        isCancelledBy: 0,
        isCancelledDate: "1900-01-01",
        status: 0,
        tHomeCollectionServiceDetails: this._formbuilder.array([]),

        // extra fields
        ServiceId: [''],
        totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        totalDiscountPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        discountAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        patientName: [''],
        servicedoctorId: [0],
        concessionReasonId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
      })
    }
  }

  createServiceDetForm(item: any): FormGroup {
    return this._formbuilder.group({
      homeDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      homeCollectionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      testId: [item.ServiceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      price: [item.Price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [item.Qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmount: [item.TotalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discPer: [item.DiscPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discAmount: [item.DiscAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      netAmount: [item.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      isCancel: false,
      isCancelledBy: 0,
      isCancelledDate: "1900-01-01"
    });
  }

  get ServicedetailsArray(): FormArray {
    return this.myForm.get('tHomeCollectionServiceDetails') as FormArray;
  }

  getSelectedObj(obj) {
    console.log(obj)
    // this.PatientName = obj.patientName;
    this.PatientName = obj.firstName + ' ' + obj.lastName;
    this.VlabPatRegId = obj.visitId;
    if (this.VlabPatRegId) {
      setTimeout(() => {
        this._homeColletionService.getLabRegistraionMasterById(this.VlabPatRegId).subscribe((response) => {
          console.log(response)
          this.registerObj = response;
          this.value = response.dateofBirth
          this.regNo = response.labRequestNo
          this.onChangeDateofBirth(response.dateofBirth)
          this.regflag = true
          this.myForm.patchValue({
            firstName: this.registerObj.firstName.trim(),
            middleName: this.registerObj.middleName.trim(),
            LastName: this.registerObj.lastName.trim(),
            MobileNo: this.registerObj.mobileNo.trim(),
            address: this.registerObj.address.trim(),
            // DateOfBirth:this.registerObj.dateofBirth,
          });

        });
      }, 100);
    }
  }

  value = new Date()
  onChangeDateofBirth(DateOfBirth: Date) {

    if (DateOfBirth > this.minDate) {
      this.toastrService.warning('Enter Proper Birth Date..', 'warning !', {
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
        // this.ageDay =this.ageDay +1;
      }

      if (this.ageMonth < 0) {
        this.ageYear--;
        this.ageMonth += 12;
      }

      this.value = DateOfBirth;
      this.myForm.get('DateOfBirth').setValue(DateOfBirth);
      if (this.ageYear > 110)
        this.toastrService.warning('Please Enter Valid BirthDate..', 'warning !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
    }
  }

  OnSave() {
    const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
    const formattedTime = formattedDate + this.dateTimeObj.time;

    this.myForm.get('collectionDate').setValue(formattedDate);
    this.myForm.get('collectionTime').setValue(formattedTime);
    this.myForm.get('patRegId').setValue(this.VlabPatRegId ?? 0);

    const overallDiscAmt = +this.myForm.get('discountAmt')?.value || 0; //bottom discount

    const rowDiscApplied = this.dstable1?.data?.some( //row discount
      (row: any) => (+row.DiscAmt || 0) > 0
    ) || false;

    if (overallDiscAmt > 0 || rowDiscApplied) {
      if (!this.myForm.get('concessionReasonId')?.value) {
        this.toastrService.warning('Please select DiscountReason.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    console.log(this.myForm.getRawValue())
    let DateOfBirth1 = this.myForm.get('DateOfBirth')?.value;
    if (DateOfBirth1) {

      const todayDate = new Date();
      const dob = new Date(DateOfBirth1);
      let ageYear = (todayDate.getFullYear() - dob.getFullYear());
      let ageMonth = (todayDate.getMonth() - dob.getMonth());
      let ageDay = (todayDate.getDate() - dob.getDate());

      this.ageYear = ageYear
      this.ageMonth = ageMonth
      this.ageDay = ageDay

      if (ageDay < 0) {
        (ageMonth)--;
        const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
        ageDay += previousMonth.getDate();
      }

      if (ageMonth < 0) {
        ageYear--;
        ageMonth += 12;
      }
      if (
        (!ageYear || ageYear == 0) &&
        (!ageMonth || ageMonth == 0) &&
        (!ageDay || ageDay == 0)
      ) {
        this.toastrService.warning('Please select the birthdate or enter the age of the patient.', 'Warning!', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      this.myForm.get('ageY')?.setValue(String(ageYear), { emitEvent: false });
      this.myForm.get('ageM')?.setValue(String(ageMonth), { emitEvent: false });
      this.myForm.get('ageD')?.setValue(String(ageDay), { emitEvent: false });

    }

    this.myForm.get('ageY')?.setValue(this.myForm.get('ageY')?.value || 0)
    this.myForm.get('ageM')?.setValue(this.myForm.get('ageM')?.value || 0)
    this.myForm.get('ageD')?.setValue(this.myForm.get('ageD')?.value || 0)

    this.ServicedetailsArray.clear();

    const invalidRow = this.dstable1.data.find(item =>
      item.creditedtoDoctor === true && (!item.DoctorId || item.DoctorId === 0)
    );

    if (invalidRow) {
      this.toastrService.warning(
        'Please select Doctor for added service', 'Warning!');
      return;
    }

    let priceflag = this.dstable1.data.filter(row => row.Price == 0);

    if (priceflag.length) {
      this.toastrService.warning('Please Enter Price For Service', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    debugger
    this.dstable1.data.forEach(item => {
      this.ServicedetailsArray.push(this.createServiceDetForm(item as ChargesList));
    });

    const formValue = { ...this.myForm.value };
    const controlsToRemove = ['patientName', 'ServiceId', 'totalAmt', 'totalDiscountPer', 'discountAmt', 'netPayableAmt',
      'concessionReasonId', 'servicedoctorId'];

    controlsToRemove.forEach(key => delete formValue[key]);
    console.log(formValue)

    console.log("1. Form values", formValue)

    if (!this.myForm.invalid) {
      console.log(formValue)
      this._homeColletionService.InsertHomeCollection(formValue).subscribe(response => {
        // this.viewgetOPBillReportPdf(response)
        this._matDialog.closeAll();
        this.savebtn = true
      });
    }
    else {
      const invalidFields = this.collectErrors(this.myForm);
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastrService.warning(`Field "${field}" is invalid.`, 'Warning');
        });
        return;
      }
    }
  }

  collectErrors(formGroup: FormGroup | FormArray, parentKey: string = ''): string[] {
    let errors: string[] = [];
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (control instanceof FormGroup || control instanceof FormArray) {
        // go deeper
        errors = errors.concat(this.collectErrors(control, newKey));
      } else {
        if (control?.invalid) {
          errors.push(newKey);
        }
      }
    });
    return errors;
  }

  ////////////////////////// dd new method start ////////////////////
  private destroy$ = new Subject<void>();
  getdocdetail(event: MatSelectChange, row: any): void {

    const option = this.doctorOptions.find(
      opt => (opt.value ?? opt.Value) === event.value
    );

    if (!option) return;

    row.DoctorId = option.value ?? option.Value;
    row.DoctorName = option.text ?? option.Text;

    this.dstable1.data = [...this.dstable1.data];
  }

  private loadDropdownOptions(): void {
    this.fetchDropdownOptions(this.autocompleteModedoctor)
      .pipe(takeUntil(this.destroy$))
      .subscribe(options => {
        this.doctorOptions = options || [];
      });
  }

  showDoctorDropdown(row: any): boolean {
    return row && row.creditedtoDoctor === true;
  }

  urgentStatus: boolean = false;
  onUrgentToggleChange(event: any, contact: any) {
    this.urgentStatus = event.checked;
    // optionally do recalculation or other logic
    console.log(contact);
  }

  private fetchDropdownOptions(mode: string): Observable<any[]> {
    if (!mode) {
      return of([]);
    }
    return this.apiCaller.GetData(`Dropdown/GetBindDropDown?mode=${mode}`);
  }

  getServiceList() {
    let ServiceName = this.myForm.get("ServiceId").value + "%" || "%";
    let IsPathRad = 3
    // this.myForm.get("IsPathRad").value || "1"
    var param = {
      "first": 0,
      "rows": 10,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ServiceName",
          "fieldValue": ServiceName,
          "opType": "Equals"
        },
        {
          "fieldName": "TariffId",
          "fieldValue": String(this.vTariffId),
          "opType": "Equals"
        },
        {
          "fieldName": "IsPathRad",
          "fieldValue": String(IsPathRad),
          "opType": "Equals"
        },
        {
          "fieldName": "ClassId",
          "fieldValue": String(this.vClassId),
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }

    this._homeColletionService.getserviceList(param).subscribe(Menu => {

      this.dsLabRequest2.data = Menu.data as LabRequest[];
      this.dsLabRequest2.sort = this.sort;
      this.dsLabRequest2.paginator = this.paginator;

    });

  }

  getSelectedserviceObj(obj) {
    console.log(obj)
    this.SrvcName1 = obj.serviceName;
    this.serviceId = obj.serviceId;
    this.vQty = 1;
    this.IsPathology = obj.isPathology;
    this.IsRadiology = obj.isRadiology;
    this.vIsPackage = obj.isPackage;
    this.serviceSelct = true
    this.onSaveEntry(obj);

    // ✅ Clear Service Name
    this.myForm.get('ServiceId')?.reset();

    // ✅ Focus back to input (wait for DOM update)
    setTimeout(() => {
      this.serviceInput?.nativeElement.focus();
    });
  }

  onSaveEntry(row) {
    // debugger
    let doctorid = 0;
    const formValue = this.myForm.value

    const isDuplicate = this.dstable1.data.some(item => item.ServiceId === row.serviceId);
    if (!isDuplicate) {
      this.onAddCharges(row)
    }
    else {
      this.toastrService.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }

  onAddCharges(row): void {
    const isPackage = (row.isPackage ?? row.IsPackage) == 1;

    if (row.isPathology !== undefined || row.IsPathology !== undefined) {
      this.IsPathology = row.isPathology ?? row.IsPathology;
      this.IsRadiology = row.isRadiology ?? row.IsRadiology;
    } else {
      if (this.myForm.get("IsPathRad")?.value == '1') {
        this.IsPathology = true;
        this.IsRadiology = false;
      } else {
        this.IsRadiology = true;
        this.IsPathology = false;
      }
    }

    const totalAmount = row.price * 1;
    // debugger
    let discountAmount = 0;
    let discountPer = 0;

    // 🔐 Apply discount ONLY if this row itself has discount (prev data)
    if (row.DiscAmt > 0 || row.DiscPer > 0) {
      discountAmount = row.DiscAmt || 0;
      discountPer = row.DiscPer || 0;
    }

    const netAmount = totalAmount - discountAmount;

    // debugger
    const newRow = {
      ServiceId: row.serviceId,
      ServiceName: row.serviceName,
      Price: row.price ?? 0,
      Qty: 1,
      TotalAmt: totalAmount || 0,
      // DiscPer: row.DiscPer ?? 0,
      // DiscAmt: row.DiscAmt ?? 0,
      DiscPer: discountPer,
      DiscAmt: discountAmount,
      // DiscAmt: discountAmount || row.DiscAmt,
      NetAmount: netAmount || 0,
      ClassName: 1,//this.className || '-',
      creditedtoDoctor: row.creditedtoDoctor === true,
      DoctorId: row.DoctorId || 0,
      DoctorName: row.DoctorName || '-',
      ChargesAddedName: this.accountService.currentUserValue.userName,
      IsPathology: row.isPathology == 1 ? true : false,
      IsRadiology: row.isRadiology == 1 ? true : false,
      IsPackage: row.isPackage,
      serviceCode: 0,//formValue.serviceName.companyCode, 
      isInclusionExclusion: true,//formValue.serviceName.isInclusionOrExclusion
    };
    if (!this.isDiscountApplied && discountAmount > 0) {
      this.isDiscountApplied = true;
      this.Consessionres = true
    }

    const newCharge = new ChargesList(newRow);
    newCharge.DiscAmt = newCharge.DiscAmt || 0;
    newCharge.DiscPer = newCharge.DiscPer || 0;
    this.chargeList.push(newCharge);
    this.dstable1.data = this.chargeList;

    this.updateCalculation(row);


    if (row.PackageId == undefined) {
      this.getRtevPackageDetList(row)
    }
  }

  getCellCalculation(element) {
    // debugger
    const price = Number(element.Price) || 0;

    // row-level calculation ONLY
    element.TotalAmt = price;
    element.DiscPer = element.DiscPer || 0;
    element.DiscAmt = +(price * element.DiscPer / 100).toFixed(2);
    element.NetAmount = price - element.DiscAmt;

    // update footer separately
    this.updateFooterTotals();
  }

  updateFooterTotals() {

    const totalAmt = this.dstable1.data.reduce(
      (sum, item) => sum + (Number(item.TotalAmt) || 0),
      0
    );

    const discountAmt = this.dstable1.data.reduce(
      (sum, item) => sum + (Number(item.DiscAmt) || 0),
      0
    );

    const netAmt = this.dstable1.data.reduce(
      (sum, item) => sum + (Number(item.NetAmount) || 0),
      0
    );

    this.myForm.patchValue({
      totalAmt: totalAmt,
      discountAmt: discountAmt,
      // totalDiscountPer: discPer,
      netPayableAmt: Math.round(netAmt)
    }, { emitEvent: false });
  }

  updateCalculation(source: 'PER' | 'LIST' = 'LIST') {
    // debugger
    const totalAmt = this.chargeList.reduce(
      (sum, item) => sum + (Number(item.Price) || 0),
      0
    );

    let discountAmt = Number(this.myForm.get('discountAmt')?.value) || 0;
    let discountPer = Number(this.myForm.get('totalDiscountPer')?.value) || 0;

    if (source === 'PER') {
      // Discount % entered
      discountAmt = totalAmt > 0
        ? +(totalAmt * discountPer / 100).toFixed(2)
        : 0;

      this.Consessionres = discountPer > 0;
    }

    const netAmt = totalAmt - discountAmt;

    this.myForm.patchValue({
      totalAmt: totalAmt,
      discountAmt: discountAmt,
      totalDiscountPer: discountPer,
      netPayableAmt: Math.round(netAmt)
    }, { emitEvent: false });
  }

  getRtevPackageDetList(obj) {
    var vdata =
    {
      "first": 0,
      "rows": 10,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "ServiceId", "fieldValue": String(obj.serviceId), "opType": "Equals" }],
      "exportType": "JSON",
      "columns": []
    }
    //console.log(vdata)
    this._homeColletionService.getRtevPackageDetList(vdata).subscribe(data => {
      // debugger
      this.dsPackageList.data = data.data as ChargesList[];
      this.dsPackageList.data.forEach(element => {
        this.PacakgeList.push(
          {
            serviceId: element.packageServiceId,
            serviceName: element.serviceName,
            price: element.price || 0,
            Qty: 1,
            TotalAmt: (element.price * 1) || 0,
            ConcessionPercentage: 0,
            DiscAmt: 0,
            NetAmount: (element.price * 1) || 0,
            isPathology: element.isPathology,
            isRadiology: element.isRadiology,
            packageId: element.packageId,
            PackageServiceId: element.serviceId,
            pacakgeServiceName: element.pacakgeServiceName,
            doctorName: element.doctorName,
            doctorId: element.doctorId
          })
      })
      this.dsPackageList.data = this.PacakgeList
    });
  }

  getPacakgeDetail(contact) {
    const dialogRef = this._matDialog.open(PackageDetailsComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '70%',
        data: {
          Obj: contact,
          PatientDet: this.registerObj,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      if (result) {
        this.dsPackageList.data = result
        console.log(this.dsPackageList.data)
        this.dsPackageList.data.forEach(element => {
          this.PacakgeList = [];
          if (element.BillwiseTotalAmt > 0) {
            this.TotalPrice = element.BillwiseTotalAmt;
            console.log(this.TotalPrice)
          } else {
            this.TotalPrice = parseInt(this.TotalPrice) + parseInt(element.Price);
            console.log(this.TotalPrice)
          }
          this.OriginalPackageService = this.dstable1.data.filter(item => item.ServiceId !== element.PackageServiceId)
          this.EditedPackageService = this.dstable1.data.filter(item => item.ServiceId === element.PackageServiceId)
          console.log(this.OriginalPackageService)
          console.log(this.EditedPackageService)
        });
        let price = 0;
        let TotalAmt = 0;
        let NetAmount = 0;
        this.dsPackageList.data.forEach(element => {
          if (element.BillwiseTotalAmt > 0) {
            price = 0;
            TotalAmt = 0;
            NetAmount = 0;
          } else {
            price = element.Price
            TotalAmt = element.TotalAmt
            NetAmount = element.NetAmount
          }
          this.PacakgeList.push(
            {
              serviceId: element.ServiceId,
              serviceName: element.ServiceName,
              price: price || 0,
              Qty: element.Qty || 1,
              TotalAmt: TotalAmt || 0,
              ConcessionPercentage: element.ConcessionPercentage || 0,
              DiscAmt: element.DiscAmt || 0,
              NetAmount: NetAmount || 0,
              isPathology: element.IsPathology || 0,
              isRadiology: element.IsRadiology || 0,
              packageId: element.PackageId || 0,
              PackageServiceId: element.PackageServiceId || 0,
              pacakgeServiceName: element.PacakgeServiceName || '',
              doctorName: element.DoctorName || '',
              doctorId: element.DoctorId || 0
            });
          this.dsPackageList.data = this.PacakgeList;
        });
        if (this.EditedPackageService.length) {
          this.EditedPackageService.forEach(element => {
            this.OriginalPackageService.push(
              {
                ChargesId: 0,// this.serviceId,
                ServiceId: element.ServiceId,
                ServiceName: element.ServiceName,
                Price: this.TotalPrice || 0,
                Qty: element.Qty || 0,
                TotalAmt: (parseFloat(element.Qty) * parseFloat(this.TotalPrice)) || 0,
                DiscPer: element.DiscPer || 0,
                DiscAmt: element.DiscAmt || 0,
                NetAmount: (parseFloat(element.Qty) * parseFloat(this.TotalPrice)) || 0,
                ClassId: 1,
                DoctorId: element.DoctornewId,
                DoctorName: element.DoctorName,
                ChargesDate: this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
                IsPathology: element.IsPathology,
                IsRadiology: element.IsRadiology,
                IsPackage: element.IsPackage,
                ClassName: element.ClassName,
                ChargesAddedName: this.accountService.currentUserValue.user.id || 1,
              });
            this.dstable1.data = this.OriginalPackageService;
            this.chargeList = this.dstable1.data
          });
        }
        this.TotalPrice = 0;
        // this.getRtevPackageDetList(result);
        // this.onAddCharges(result)
      }
      this.calculateTotalAmount();
    });
  }

  calculateTotalAmount(): void {
    // debugger
    let totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.TotalAmt), 0);
    let totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscAmt), 0);
    let totalDiscountPer = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscPer), 0);
    let totalNet = totalSum - totalDiscount;

    this.myForm.patchValue({
      totalAmt: totalSum,
      totalDiscountPer: Math.round(totalDiscountPer),
      discountAmt: Math.round(totalDiscount),
      netPayableAmt: Math.round(totalNet)
    }, { emitEvent: false });
    if (!this.isDiscountApplied && totalDiscount > 0) {
      this.isDiscountApplied = true;
      this.Consessionres = true
    }

    this.Consessionres = this.chargeList.some(
      charge => (+charge.DiscAmt || 0) > 0
    );
    this.isDiscountApplied = this.Consessionres;
  }

  onDiscountPerChange(row: ChargesList): void {
    // debugger
    if (!row) return;
    let discountPer = +row.DiscPer || 0;
    const totalAmount = (+row.Price || 0) * (+row.Qty || 0);

    if (discountPer < 0 || discountPer > 100) {
      discountPer = 0; // Reset if out of range
      row.DiscPer = 0;
      this.toastrService.error("Enter discount % between 0-100");
    }

    this.Consessionres = true
    if (discountPer == 0) {
      this.Consessionres = false
      this.myForm.get("concessionReasonId").setValue(0)
    }

    row.DiscAmt = parseFloat(((totalAmount * discountPer) / 100).toFixed(2));
    row.TotalAmt = totalAmount;
    row.NetAmount = totalAmount - row.DiscAmt;

    this.calculateTotalAmount();
  }

  onDiscountAmtChange(row: ChargesList): void {
    if (!row) return;
    let discountAmt = +row.DiscAmt || 0;
    const totalAmount = (+row.Price || 0) * (+row.Qty || 0);

    if (discountAmt < 0 || discountAmt > totalAmount) {
      row.DiscAmt = 0;
      discountAmt = 0;
      this.toastrService.error("Discount must be between 0 and the total amount.");
    }

    this.Consessionres = true
    if (discountAmt == 0) {
      this.Consessionres = false
      this.myForm.get("concessionReasonId").setValue(0)
    }
    row.DiscPer = totalAmount ? parseFloat(((discountAmt / totalAmount) * 100).toFixed(2)) : 0;
    row.TotalAmt = totalAmount;
    row.NetAmount = totalAmount - discountAmt;

    this.calculateTotalAmount();
    this.updateCalculation();
  }

  deleteTableRow(element) {
    this.chargeslist = this.dstable1.data;
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dstable1.data = [];
      this.dstable1.data = this.chargeslist;

      if (this.chargeslist.length === 0) {
        this.myForm.patchValue({
          totalAmt: 0,
          totalDiscountPer: 0,
          discountAmt: 0,
          netPayableAmt: 0
        });
        this.isDiscountApplied = false;
      } else {
        this.updateCalculation();
      }
      this.servicedoctorname = ''
      this.serivcedoctorId = 0
    }
    this.toastrService.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  filterResults(results: any[], fields: { firstName: string, lastName: string, mobileNo: string }) {
    const { firstName, lastName, mobileNo } = fields;
    return results.filter(item => {
      return (!firstName || item.firstName?.toLowerCase().includes(firstName.toLowerCase()))
        && (!lastName || item.lastName?.toLowerCase().includes(lastName.toLowerCase()))
        && (!mobileNo || item.mobileNo?.startsWith(mobileNo));
    });
  }

  handleInputChange(changedField: string): void {
    // Get all current field values
    // debugger
    const firstName = this.myForm.get('firstName').value?.trim() || '';
    const lastName = this.myForm.get('lastName').value?.trim() || '';
    const mobileNo = this.myForm.get('mobileNo').value?.trim() || '';

    // If all fields are empty, clear everything
    if (!firstName && !lastName && !mobileNo) {
      this.resetFilteredOptions();
      return;
    }

    // Count how many fields are filled
    const filledFields = [firstName, mobileNo].filter(Boolean).length;

    // If only one field is filled, and it's FirstName or MobileNo, call API
    if (filledFields === 1 && (changedField === 'firstName' || changedField === 'mobileNo')) {
      const keyword = firstName || mobileNo;
      this._homeColletionService.getlabSuggestions(`LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`, keyword).subscribe(results => {
        this.prevResults = results || [];
        // console.log(results)
        this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
      });
      return;
    }

    // If only one field is filled, and it's LastName, just filter prevResults (do not call API)
    if (filledFields === 1 && changedField === 'lastName') {
      this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
      return;
    }

    // If more than one field is filled, filter from prevResults
    if (this.prevResults.length > 0) {
      this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
    } else if (changedField === 'firstName' || changedField === 'mobileNo') {
      // Fallback: if prevResults is empty, call API with the changed field (if allowed)
      const keyword = this.myForm.get(changedField).value?.trim();
      if (keyword) {
        this._homeColletionService.getlabSuggestions(`LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`, keyword).subscribe(results => {
          this.prevResults = results || [];
          this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
        });
      }
    } else {
      // If changedField is LastName and prevResults is empty, do nothing
      this.filteredOptions = [];
    }
  }

  handleInputChangeDebounced(changedField: string): void {
    // Clear any existing timer for this field
    if (this.debounceTimers[changedField]) {
      clearTimeout(this.debounceTimers[changedField]);
    }
    // Set a new timer
    this.debounceTimers[changedField] = setTimeout(() => {
      this.handleInputChange(changedField);
    }, 300); // 300ms debounce
  }

  onSelectPatient(row: any) {
    this.getSelectedObj(row);
    this.resetFilteredOptions();
  }
  resetFilteredOptions() {
    this.filteredOptions = [];
    this.prevResults = [];
  }

  prefixName: any;
  onChangePrefix(e) {
    this.prefixName = e.prefixName
    this.ddlGender.SetSelection(e.sexId);
  }

  selectChangeConcession(event) {
    this.ConcessionId = event.value
    this.ConcessionReason = event.text
  }

  onClose() {
    this.myForm.reset();
    this.dialogRef.close();
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

  Is9_Digit_National_Id: boolean = false;

  getValidationMessages() {
    const maxLen = this.Is9_Digit_National_Id ? 9 : 12;
    const minLen = this.Is9_Digit_National_Id ? 7 : 12;
    return {
      RegId: [],
      firstName: [
        { name: "required", Message: "First Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      middleName: [
        // { name: "required", Message: "Middle Name is required" },
        // { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      lastName: [
        { name: "required", Message: "Last Name is required" },
        // { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      address: [
        { name: "required", Message: "Address is required" },

      ],
      prefixId: [
        { name: "required", Message: "Prefix Name is required" }
      ],
      genderId: [
        { name: "required", Message: "Gender is required" }
      ],
      areaId: [
        { name: "required", Message: "Area Name is required" }
      ],
      cityId: [
        { name: "required", Message: "City Name is required" }
      ],
      religionId: [
        { name: "required", Message: "Religion Name is required" }
      ],
      countryId: [
        { name: "required", Message: "Country Name is required" }
      ],

      stateId: [
        { name: "required", Message: "State Name is required" }
      ],
      mobileNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Mobile No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      phoneNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        // { name: "required", Message: "phoneNo No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      patientTypeId: [
        { name: "required", Message: "Country Name is required" }
      ],
      tariffId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      departmentId: [
        { name: "required", Message: "Department Name is required" }
      ],
      DoctorID: [
        { name: "required", Message: "Doctor Name is required" }
      ],
      refDocId: [
        { name: "required", Message: "Ref Doctor Name is required" }
      ],
      PurposeId: [
        { name: "required", Message: "Purpose Name is required" }
      ],
      companyId: [
        { name: "required", Message: "Company Name is required" }
      ],
      subCompanyId: [
        { name: "required", Message: "SubCompany Name is required" }
      ],
      patientTypeValue: [
        { name: "required", Message: "PatientType is required" }
      ],
      Comments: [
        { name: "pattern", Message: "only char allowed." }
      ],
      ReferByName: [
        { name: "pattern", Message: "only char allowed." }
      ],
      UnitId: [
        { name: "required", Message: "Unit Name is required" }
      ],
      ClassId: [
        { name: "required", Message: "Class Name is required" }
      ],
    };
  }

}
