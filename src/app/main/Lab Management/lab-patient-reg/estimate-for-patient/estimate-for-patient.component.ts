import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LabPatientRegService } from '../lab-patient-reg.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { LabPatientList } from '../lab-patient-reg.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-estimate-for-patient',
    templateUrl: './estimate-for-patient.component.html',
    styleUrls: ['./estimate-for-patient.component.scss']
})
export class EstimateForPatientComponent {
    myForm: FormGroup
    Is9_Digit_National_Id: boolean = false;
    registerObj = new LabPatientList({});
    ApiURL: any = '';

    // All dropdown modes 
    autocompleteModepatienttype: string = "PatientType";
    autocompleteModegender: string = "Gender";
    autocompleteModecountry: string = "Country";
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


    @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
    @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
    @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
    @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
    @ViewChild('serviceInput') serviceInput!: ElementRef<HTMLInputElement>;
  
    public chargeList: ChargesList[] = [];
    public dstable1 = new MatTableDataSource<ChargesList>();
    
    displayedServiceselected: string[] = [
    'ServiceName',
    'DoctorName',
    'Urgent',
    'Price',
    'DiscountAmount',
    'NetAmount',
    'buttons'
   ]

    constructor(
        public _matDialog: MatDialog, private commonService: PrintserviceService,
        public datePipe: DatePipe,
        public toastrService: ToastrService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private accountService: AuthenticationService,
        public _formbuilder: UntypedFormBuilder,
        public _labPatientRegService: LabPatientRegService,
    ) { }

    ngOnInit(): void {
        this.myForm = this.CreateMyForm();
        this.myForm.markAllAsTouched();

        //this.mode = this.data?.mode || 'add';

        // if (this.data?.row?.labPatientId) {
        //     this._labPatientRegService.getLabRegistraionById(this.data?.row?.labPatientId).subscribe((response) => {
        //         this.registerObj = response;
        //         this.myForm.get('doctorId').setValue(this.registerObj.doctorId);
        //         this.myForm.get('refDocId').setValue(this.registerObj.refDocId);
        //         this.VlabPatRegId = this.registerObj.labPatRegId
        //         console.log("retrive Data:", this.registerObj)
        //         this._labPatientRegService.getLabRegistraionMasterById(this.VlabPatRegId).subscribe((response) => {
        //             this.registerObj = response;
        //             console.log("Master Data:", this.registerObj)
        //             this.myForm.patchValue(this.registerObj)
        //         });
        //     });
        // }

         this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&SrvcName="
    }

    CreateMyForm() {
        const maxLen = this.Is9_Digit_National_Id ? 9 : 12;
        return this._formbuilder.group({
            labPatientId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            regDate: [new Date()],
            regTime: [],
            unitId: this.accountService.currentUserValue.user.unitId,
            prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            firstName: ['', [Validators.required, Validators.maxLength(50)]],
            middleName: ['', [Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
            genderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            ageYear: ['', [Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
            ageMonth: ['', [Validators.pattern("^[0-9]*$")]],
            ageDay: ['', [Validators.pattern("^[0-9]*$")]],
            address: ['', [Validators.maxLength(100), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            cityId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            stateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            countryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            patientTypeId: [1],
            tariffId: [1],//this.hospitalconfigservice.HospitalconfigParams?.IPD_Billing_CounterId], // need to ask sir what value to pass
            classId: [1],// [this.hospitalconfigservice.HospitalconfigParams?.IPD_Billing_CounterId],
            departmentId: [0],
            doctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            refDocId: [0],
            companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            subCompanyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            campId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            adharCardNo: [0, [
                Validators.minLength(12),  //     Validators.minLength(12),
                Validators.maxLength(12), //     Validators.maxLength(12),
                Validators.pattern("^[0-9]*$"),
                this._FormvalidationserviceService.onlyNumberValidator()
            ]],
            patientTypValId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            Comments: ['', [Validators.maxLength(255), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            ReferByName: ['', [Validators.maxLength(255), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            // extra fields
            mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            regId: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            IsPathRad: ['1'],
            ServiceId: [''],
            totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            totalDiscountPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            discountAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            paymentType: ['CashPay'],
            patientName: [''],
            createdBy: this.accountService.currentUserValue.userId,
            LabPatRegId: 0,
            servicedoctorId: [0],
            concessionReasonId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
        })
    }
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
            adharCardNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "Aadhaar / National ID is required" },
                { name: "minLength", Message: `Minimum ${minLen} digits required.` },
                { name: "maxLength", Message: `More than ${maxLen} digits not allowed.` }
            ],
            MaritalStatusId: [
                { Message: "Mstatus Name is required" }
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
            emgDrivingLicenceNo: [
                { name: "pattern", Message: "e.g., MH14-20210001234" },
                { name: "minLength", Message: "16 digit required." },
                { name: "maxLength", Message: "More than 16 digits not allowed." }
            ],
            medTourismPassportNo: [
                { name: "pattern", Message: "e.g., A1234567" },
                { name: "minLength", Message: "8 digit required." },
                { name: "maxLength", Message: "More than 8 digits not allowed." }
            ],
            medTourismNationalityId: [
                { name: "pattern", Message: "Only alphanumeric, 10 to 15 characters" },
                { name: "minLength", Message: "Minimum 10 characters required." },
                { name: "maxLength", Message: "Maximum 15 characters allowed." }
            ],
            UnitId: [
                { name: "required", Message: "Unit Name is required" }
            ],
            ClassId: [
                { name: "required", Message: "Class Name is required" }
            ],
        };
    }

     prefixName: any;
  onChangePrefix(e) {
    this.prefixName = e.prefixName
    this.ddlGender.SetSelection(e.sexId);
  }
   CityName = ""
     onChangecity(e) {
    this.CityName = e.cityName
    this.registerObj.stateId = e.stateId
    this._labPatientRegService.getstateId(e.stateId).subscribe((Response) => {
      this.ddlState.SetSelection(Response.stateId)
      this.ddlCountry.SetSelection(Response.countryId);
    });
  }
   updateCalculation() {

    const total = this.chargeList.reduce((sum, item) => sum + (parseFloat(item.Price.toString()) || 0), 0);
    const discPer = Number(this.myForm.get('totalDiscountPer')?.value) || 0;
    // this.myForm.get('discountAmt').value
    const discountAmt = (total * discPer) / 100;
    const netAmt = Math.round(total - discountAmt);

    this.myForm.patchValue({
      totalAmt: total,
      discountAmt: discountAmt,
      netPayableAmt: netAmt
    });
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
    SrvcName1: any = "";
    serviceId: any;
    vQty: any;
    chkIsEditable: boolean = true;
    serviceSelct = false
    IsPathology: any;
    IsRadiology: any;
    vIsPackage: any;
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
  
      if (this.myForm.get("IsPathRad").value == '1')
        this.IsPathology = true
      else
        this.IsRadiology = true
  
      const formValue = this.myForm.value;
  
      const totalAmount = row.price * 1;
      const discountAmount = formValue.discountAmt;//(totalAmount * formValue.discountPer) / 100;
      const netAmount = totalAmount - discountAmount;
  
      const newRow = {
        ServiceId: row.serviceId,
        ServiceName: row.serviceName,
        Price: row.price ?? 0,
        Qty: 1,
        TotalAmt: totalAmount || 0,
        DiscPer: 0,
        DiscAmt: discountAmount || 0,
        NetAmount: netAmount || 0,
        ClassName: 1,//this.className || '-',
        creditedtoDoctor: row.creditedtoDoctor === true,
        DoctorId: row.DoctorId || 0,
        DoctorName: row.DoctorName || '-',
        ChargesAddedName: this.accountService.currentUserValue.userName,
        IsPathology: row.isPathology,
        IsRadiology: row.isRadiology,
        IsPackage: 0,
        serviceCode: 0,//formValue.serviceName.companyCode, 
        isInclusionExclusion: 1,//formValue.serviceName.isInclusionOrExclusion
      };
  
      const newCharge = new ChargesList(newRow);
      newCharge.DiscAmt = newCharge.DiscAmt || 0;
      newCharge.DiscPer = newCharge.DiscPer || 0;
      this.chargeList.push(newCharge);
      this.dstable1.data = this.chargeList;
      this.updateCalculation();
  
    }

    onSave(){
        
    }
    onClose(){

    }
}
