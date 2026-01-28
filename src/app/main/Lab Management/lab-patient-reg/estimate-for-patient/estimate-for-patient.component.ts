import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-estimate-for-patient',
    templateUrl: './estimate-for-patient.component.html',
    styleUrls: ['./estimate-for-patient.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class EstimateForPatientComponent {
    estimateform: FormGroup
    // estimateform: FormGroup
    Is9_Digit_National_Id: boolean = false;
    registerObj = new LabPatientList({});
    ApiURL: any = '';

    // All dropdown modes 
    // autocompleteModepatienttype: string = "PatientType";
    autocompleteModegender: string = "Gender";
    autocompleteModecountry: string = "Country";
    // autocompleteModeDepartment: string = "Department";
    autocompleteModerefdoc: string = "RefDoctor";
    autocompleteModeunit: string = "Hospital";
    // autocompleteModeClass: string = "Class";
    // autocompleteModetariff: string = "Tariff";
    // autocompleteModecompany: string = "Company";
    // autocompleteModesubcompany: string = "SubCompany";
    // autocompleteModecamp: string = "CampMaster";
    autocompleteModedoctor: string = "ConDoctor";
    // autocompleteModeConcession: string = "Concession";
    // autocompleteModeLabPatientType: string = "LabPatientType";
    autocompleteModecompany: string = "Company";

    @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
    @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
    @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
    @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
    @ViewChild('serviceInput') serviceInput!: ElementRef<HTMLInputElement>;

    public chargeList: ChargesList[] = [];
    public dstable1 = new MatTableDataSource<ChargesList>();

    displayedServiceselected: string[] = [
        'ServiceName',
        // 'DoctorName',
        // 'Urgent',
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
        public _formbuilder: UntypedFormBuilder, private formBuilder: FormBuilder,
        public _labPatientRegService: LabPatientRegService, public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        // this.estimateform = this.CreateMyForm();
        this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&SrvcName="
        this.estimateform = this.createEstimatefform()
        this.estimateform.markAllAsTouched();

        this.estimatedetailArray.push(this.createtEstimateDetails());

    }

    createEstimatefform() {
        return this._formbuilder.group({
            estimateId: [0],
            unitId: this.accountService.currentUserValue.user.unitId,
            estimateNo: "",
            patientId: [0],
            patientName: ['', [Validators.required, Validators.maxLength(150)]],
            mobileNo: ['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            emailId: '',
            ageYear: [this.ageYear, [Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
            cityId: [0, [Validators.required]],

            doctorId: [0],
            companyId: [0],
            comments: "",
            totalAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            discAmount: [0],
            netAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            tEstimateDetails: this.formBuilder.array([]),

            prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            genderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            totalDiscountPer: 0,
            ServiceId: 0
        })
    }


    createtEstimateDetails(item: any = {}): FormGroup {
        console.log(item)
        return this.formBuilder.group({
            estimateDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            estimateId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [item.ServiceId || 0],
            price: [item.Price || 0, [this._FormvalidationserviceService.notEmptyOrZeroValidator]],
            qty: [item.Qty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            totalAmount: [item.TotalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            discAmount: [item.DiscAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            netAmount: [item.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        });
    }


    get estimatedetailArray(): FormArray {
        return this.estimateform.get('tEstimateDetails') as FormArray;
    }

    getCellCalculation(element) {

       debugger
        element.TotalAmt = element.Price
      
        const netAmt = element.TotalAmt - element.DiscAmt;

        // element.DiscAmt = discountAmt | 0,
        element.NetAmount = netAmt,
            this.updateCalculation()
    }
    getValidationMessages() {
        // const maxLen = this.Is9_Digit_National_Id ? 9 : 12;
        // const minLen = this.Is9_Digit_National_Id ? 7 : 12;
        return {
            RegId: [],
            firstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],

            cityId: [
                { name: "required", Message: "City Name is required" }
            ],

            mobileNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "Mobile No is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 10 digits not allowed." }

            ],

            DoctorID: [
                { name: "required", Message: "Doctor Name is required" }
            ],
            refDocId: [
                { name: "required", Message: "Ref Doctor Name is required" }
            ],

            Comments: [
                { name: "pattern", Message: "only char allowed." }
            ],
            ReferByName: [
                { name: "pattern", Message: "only char allowed." }
            ],

            EmailId: [
                { name: "required", Message: "Class Name is required" }
            ],
            UnitId: [],
            companyId: []
        };
    }

    onChangeCompany(e) {

    }

    // prefixName: any;
    // onChangePrefix(e) {
    //     this.prefixName = e.prefixName
    //     this.ddlGender.SetSelection(e.sexId);
    // }
    CityName = ""
    onChangecity(e) {
        this.CityName = e.cityName
        // this.registerObj.stateId = e.stateId
        // this._labPatientRegService.getstateId(e.stateId).subscribe((Response) => {
        //     this.ddlState.SetSelection(Response.stateId)
        //     this.ddlCountry.SetSelection(Response.countryId);
        // });
    }
    updateCalculation() {

        const total = this.chargeList.reduce((sum, item) => sum + (parseFloat(item.Price.toString()) || 0), 0);
        const discPer = Number(this.estimateform.get('totalDiscountPer')?.value) || 0;
        // this.estimateform.get('discountAmt').value
        const discountAmt = (total * discPer) / 100;
        const netAmt = Math.round(total - discountAmt);

        this.estimateform.patchValue({
            totalAmount: total,
            discAmount: discountAmt,
            netAmount: netAmt
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
        this.estimateform.get('ServiceId')?.reset();

        // ✅ Focus back to input (wait for DOM update)
        setTimeout(() => {
            this.serviceInput?.nativeElement.focus();
        });
    }

    onSaveEntry(row) {
        let doctorid = 0;
        const formValue = this.estimateform.value
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

        // if (this.estimateform.get("IsPathRad").value == '1')
        //     this.IsPathology = true
        // else
        //     this.IsRadiology = true

        const formValue = this.estimateform.value;

        const totalAmount = row.price * 1;
        const discountAmount = formValue.discAmount;//(totalAmount * formValue.discountPer) / 100;
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

    onDiscountAmtChange(row: ChargesList): void {
        if (!row) return;
        let discountAmt = +row.DiscAmt || 0;
        const totalAmount = (+row.Price || 0) * (+row.Qty || 0);

        if (discountAmt < 0 || discountAmt > totalAmount) {
            row.DiscAmt = 0;
            discountAmt = 0;
            this.toastrService.error("Discount must be between 0 and the total amount.");
        }

        row.DiscPer = totalAmount ? parseFloat(((discountAmt / totalAmount) * 100).toFixed(2)) : 0;
        row.TotalAmt = totalAmount;
        row.NetAmount = totalAmount - discountAmt;

        this.updateCalculation();
    }
    ageYear = 0
    ageMonth = 0
    ageDay = 0
    onSave() {

        debugger
        this.estimateform.get('ServiceId').setValue(0)
        let DateOfBirth1 = this.estimateform.get("DateOfBirth").value
        if (DateOfBirth1) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth1);
            // const timeDiff = Math.abs(Date.now() - dob.getTime());
            this.ageYear = (todayDate.getFullYear() - dob.getFullYear());

        }
        if (!this.ageYear || this.ageYear == 0) {
            this.toastr.warning('Please select the birthdate or enter the age of the patient.', 'Warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        this.estimateform.get('ageYear').setValue(this.ageYear)

        this.estimatedetailArray.clear();
        this.dstable1.data.forEach(item => {
            this.estimatedetailArray.push(this.createtEstimateDetails(item));
        });

        console.log(this.estimateform.value)


        if (!this.estimateform.invalid) {
        this.estimateform.removeControl('prefixId')
        this.estimateform.removeControl('genderId')
        this.estimateform.removeControl('DateOfBirth')
        this.estimateform.removeControl('ServiceId')
        this.estimateform.removeControl('totalDiscountPer')


        console.log(this.estimateform.value)

        this._labPatientRegService.InsertEstimate(this.estimateform.value).subscribe(response => {
            this.viewgetEsimatePBillReportPdf(response)
            this._matDialog.closeAll()
        });


        } else {
            let invalidFields: string[] = [];

            if (this.estimateform.invalid) {
                for (const controlName in this.estimateform.controls) {
                    if (this.estimateform.controls[controlName].invalid) {
                        invalidFields.push(`Estimate Footer: ${controlName}`);
                    }
                }
            }

        }
    }

      viewgetEsimatePBillReportPdf(element) {
    this.commonService.Onprint("EstimateId", element, "EstimatePrint");
  }

    deleteTableRow(event, element) {
        // if (this.key == "Delete") {
        let index = this.chargeList.indexOf(element);
        if (index >= 0) {
            this.chargeList.splice(index, 1);
            this.dstable1.data = [];
            this.dstable1.data = this.chargeList;
        }
        Swal.fire('Success !', ' Row Deleted Successfully', 'success');

        // }
    }

    onClose() {

    }
}
