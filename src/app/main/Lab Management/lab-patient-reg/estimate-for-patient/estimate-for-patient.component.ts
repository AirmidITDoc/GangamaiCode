import { DatePipe } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { OperatorComparer, gridModel } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LabPatientList } from '../lab-patient-reg.component';
import { LabPatientRegService } from '../lab-patient-reg.service';

@Component({
    selector: 'app-estimate-for-patient',
    templateUrl: './estimate-for-patient.component.html',
    styleUrls: ['./estimate-for-patient.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class EstimateForPatientComponent {
    estimateform: FormGroup
    myformSearch: FormGroup;
    Is9_Digit_National_Id: boolean = false;
    registerObj = new LabPatientList({});
    ApiURL: any = '';
    myFilterbillform: FormGroup;
    screenFromString = 'ExternalLab-form';
    // All dropdown modes 
    // autocompleteModepatienttype: string = "PatientType";
    autocompleteModegender: string = "Gender";
    autocompleteModecountry: string = "Country";
    // autocompleteModeDepartment: string = "Department";
    autocompleteModerefdoc: string = "RefDoctor";
    autocompleteModeunit: string = "Hospital";

    autocompleteModedoctor: string = "ConDoctor";
    // autocompleteModeConcession: string = "Concession";
    // autocompleteModeLabPatientType: string = "LabPatientType";
    autocompleteModecompany: string = "Company";

    sidebarName = 'patient-sidebar';
    prevResults: any[] = [];
    filteredOptions: any[] = [];
    debounceTimers: { [key: string]: any } = {};
    Patient = '%'
    Mobile = '%'
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    @ViewChild('Edetailgrid') grid1: AirmidTableComponent;
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
        public dialogRef: MatDialogRef<EstimateForPatientComponent>,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private accountService: AuthenticationService,
        public _formbuilder: UntypedFormBuilder, private formBuilder: FormBuilder,
        public _labPatientRegService: LabPatientRegService, public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        debugger
        this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&GroupId=" + 1 + "&SubGroupId=" + 1 + "&SrvcName="
        this.estimateform = this.createEstimatefform()
        this.estimateform.markAllAsTouched();
        // this.myFilterbillform = this.myFilterbillbrowseform();
        this.myformSearch = this.myFilterbillbrowseform()
        this.estimatedetailArray.push(this.createtEstimateDetails());

    }
    myFilterbillbrowseform(): FormGroup {
        return this._formbuilder.group({

            PatientName: ['', [Validators.maxLength(50),
            Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            MobileNo: ['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],

            CompanyId: 0

        });
    }
    createEstimatefform() {
        return this._formbuilder.group({
            estimateId: [0],
            unitId: this.accountService.currentUserValue.user.unitId,
            estimateNo: [""],
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

            prefixId: [0],
            genderId: [0],
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
            discAmount: [item.DiscAmt || 0],
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


    CityName = ""
    onChangecity(e) {
        this.CityName = e.cityName

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
        const inp = String.fromCharCode(event.keyCode);
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
        const doctorid = 0;
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
        const DateOfBirth1 = this.estimateform.get("DateOfBirth").value
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
        debugger
        // const allPricesPositive = this.dstable1.data.every(row => Number(row.Price) > 0);
        // if (!allPricesPositive) {
        //     this.toastr.warning('Please Enter Price Greater >  0.', 'Warning!', {
        //         toastClass: 'tostr-tost custom-toast-warning',
        //     });
        //     return;
        // }

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
            const invalidFields: string[] = [];

            if (this.estimateform.invalid) {

                for (const controlName in this.estimateform.controls) {
                    if (this.estimateform.controls[controlName].invalid) {
                        debugger
                        invalidFields.push(`Estimate Footer: ${controlName}`);
                    }
                }
            }

        }
    }

    viewgetEsimatePBillReportPdf(element) {
        this.commonService.Onprint("EstimateId", element, "EstimatePrint");
    }
    viewgetEsimatePBillReportPdf1(element) {
        debugger
        this.commonService.Onprint("EstimateId", element.estimateId, "EstimatePrint");
    }

    deleteTableRow(event, element) {
        // if (this.key == "Delete") {
        const index = this.chargeList.indexOf(element);
        if (index >= 0) {
            this.chargeList.splice(index, 1);
            this.dstable1.data = [];
            this.dstable1.data = this.chargeList;
        }
        Swal.fire('Success !', ' Row Deleted Successfully', 'success');

        // }
    }
    dateTimeObj: any
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }


    onClose() {
        this.dialogRef.close();
    }
    UnitId: any = this.accountService.currentUserValue.user.unitId;
    // 
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
        const firstName = this.estimateform.get('patientName').value?.trim() || '';
        const lastName = ''//this.estimateform.get('lastName').value?.trim() || '';
        const mobileNo = this.estimateform.get('mobileNo').value?.trim() || '';

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
            this._labPatientRegService.getlabSuggestions(`LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`, keyword).subscribe(results => {
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
            const keyword = this.estimateform.get(changedField).value?.trim();
            if (keyword) {
                this._labPatientRegService.getlabSuggestions(`LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`, keyword).subscribe(results => {
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
    PatientName = ''
    VlabPatRegId = 0
    getSelectedObj(obj) {
        console.log(obj)
        // this.PatientName = obj.patientName;
        this.PatientName = obj.firstName + ' ' + obj.lastName;
        // this.VlabPatRegId = obj.visitId;
        if (this.VlabPatRegId) {
            setTimeout(() => {
                this._labPatientRegService.getLabRegistraionMasterById(this.VlabPatRegId).subscribe((response) => {
                    console.log(response)
                    this.registerObj = response;
                    //   this.value = response.dateofBirth
                    //   this.regNo = response.labRequestNo
                    //   this.onChangeDateofBirth(response.dateofBirth)
                    //   this.regflag = true
                    this.estimateform.patchValue({
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

        // if (this.VlabPatRegId) {
        //   this.showPrevBtn = true
        //   this.getPrevList(obj);
        // }
    }
    //tab

    @ViewChild('EBillGrid', { static: false }) Egrid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    isShowDetailTable: boolean = false;


    allEBillfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
        { fieldName: "PatientName", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "MobileNo", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "CompanyId", fieldValue: "0", opType: OperatorComparer.Contains },

    ];

    allEbillcolumns = [
        { heading: "BillDate", key: "createdDate", sort: true, align: 'left', emptySign: 'NA', width: 110, type: 6 },
        { heading: "EstimateNo", key: "estimateNo", sort: true, align: 'center', emptySign: 'NA', width: 80 },
        { heading: "UHID", key: "patientId", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 230 },

        { heading: "Age", key: "AgeYear", sort: true, align: 'left', emptySign: 'NA', width: 50 },
        { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "CityName", key: "cityName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "EmailId", key: "EmailId", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        { heading: "Total Amount", key: "totalAmount", sort: true, align: 'right', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 }, // It is just example of apply color based on condition
        { heading: "Disc Amount", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "Net Amount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 100 },


        {
            heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }  // Assign ng-template to the column

    ];
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }


    gridConfig: gridModel = {

        apiUrl: "Estimate/EstimateList",
        columnsList: this.allEbillcolumns,
        sortField: "PatientId",
        sortOrder: 0,
        filters: this.allEBillfilters
    }


    onChangeOPBill() {
        debugger
        this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")
        this.Patient = this.myformSearch.get('PatientName').value + "%"
        this.Mobile = this.myformSearch.get('MobileNo').value + "%"
        this.CompanyId = this.myformSearch.get('CompanyId').value


        this.getfilterdataEBill();
    }

    getfilterdataEBill() {
        debugger
        this.gridConfig = {
            apiUrl: "Estimate/EstimateList",
            columnsList: this.allEbillcolumns,
            sortField: "PatientId",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
            { fieldName: "PatientName", fieldValue: this.Patient, opType: OperatorComparer.Contains },
            { fieldName: "MobileNo", fieldValue: this.Mobile, opType: OperatorComparer.Contains },
            { fieldName: "CompanyId", fieldValue: String(this.CompanyId), opType: OperatorComparer.Equals }

            ]
        }
        this.Egrid.gridConfig = this.gridConfig;
        this.Egrid.bindGridData();
    }

    //      gridConfig1: gridModel = new gridModel();
    //    GetDetails1(data: any): void {
    //         debugger

    //         let ID = data.estimateId;

    //         this.gridConfig1 = {
    //             apiUrl: "Estimate/EstimateDetailsList",
    //             columnsList: [

    //                 { heading: "EstimateNo", key: "estimateNo", sort: true, sticky: true, align: 'left', emptySign: 'NA' , width: 100 },

    //                 { heading: "Service Name", key: "serviceName", sort: true, sticky: true, align: 'left', emptySign: 'NA', width: 400 },
    //                 { heading: "Qty", key: "qty", sort: true, sticky: true, align: 'left', emptySign: 'NA', width: 100 },
    //                 { heading: "MRP", key: "Price", sort: true, sticky: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount , width: 100},

    //                 { heading: "Total Amount", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount , width: 100},
    //                 { heading: "Net Amount", key: "netAmount", sort: true, sticky: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
    //                 { heading: "Comments", key: "comments", sort: true, sticky: true, align: 'left', emptySign: 'NA' , width: 100},


    //             ],
    //             sortField: "EstimateId",
    //             sortOrder: 0,
    //             filters: [
    //                 { fieldName: "EstimateId", fieldValue: String(ID), opType: OperatorComparer.Equals }
    //             ]
    //         };
    //         this.isShowDetailTable = true;
    //         this.grid1.gridConfig = this.gridConfig1;
    //         this.grid1.bindGridData();
    //     }
    Clearfilter(event) {
        console.log(event)
        if (event == 'PatientName')
            this.myformSearch.get('PatientName').setValue("")
        else
            if (event == 'MobileNo')
                this.myformSearch.get('MobileNo').setValue("")
        // if (event == 'RegNo')
        //     this.myFilterbillform.get('RegNo').setValue("")
        // if (event == 'PBillNo')
        //     this.myFilterbillform.get('PBillNo').setValue("")

        this.onChangeOPBill();
    }
    CompanyId = 0

    ListView(value) {
        console.log(value)
        if (value.value !== 0)
            this.CompanyId = value.value
        else
            this.CompanyId = 0

        this.onChangeOPBill();
    }
    onClear() {
        this.myformSearch.get('PatientName').setValue("0");
        this.myformSearch.get('MobileNo').setValue("0");
        // this._LabResultListService.myformSearch.get('PatientTypeSearch').setValue("3");
    }

}
