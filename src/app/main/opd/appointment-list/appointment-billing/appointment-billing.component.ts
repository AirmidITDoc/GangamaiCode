import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { Subscription } from 'rxjs';
import { ChargesList } from '../../OPBilling/new-opbilling/new-opbilling.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-appointment-billing',
    templateUrl: './appointment-billing.component.html',
    styleUrls: ['./appointment-billing.component.scss'],
    animations: fuseAnimations
})
export class AppointmentBillingComponent implements OnInit, OnDestroy {
    public subscription: Array<Subscription> = [];

    // For testing purpose
    public patientDetail: any = {
        "visitId": 226469,
        "regId": 1,
        "patientName": "Mr. Newcs S Malakedakar",
        "prefixId": 1,
        "aadharCardNo": "222222222222",
        "dateofBirth": "1993-02-08T12:23:29.437",
        "address": "A/P:Vijayapur",
        "maritalStatusId": 5,
        "firstName": "Newcs",
        "middleName": "S",
        "lastName": "Malakedakar",
        "visitDate": "2025-01-22T10:28:00",
        "dVisitDate": "22/01/2025",
        "visitTime": " 10:28AM",
        "hospitalId": 1,
        "hospitalName": "JSS SUPER SPECIALITY HOSPITAL",
        "patientTypeId": 1,
        "patientType": "Self",
        "vistDateTime": "22/01/2025  10:28AM",
        "opdNo": "OP-20033",
        "tariffId": 1,
        "tariffName": "Hospital",
        "departmentId": 2,
        "appPurposeId": 0,
        "companyId": 1,
        "companyName": "Haire",
        "phoneAppId": 0,
        "crossConsulFlag": 1,
        "mPbillNo": "0",
        "patientOldNew": 0
    };
    public filteredOptionsService: Array<any> = [];

    public searchForm!: FormGroup;
    public chargeForm!: FormGroup;
    public totalChargeForm!: FormGroup;

    public isServiceSelected = false;
    public isDiscountApplied = false;
    public isDoctor = false;
    public isUpdating = false;

    public displayedColumns: string[] = ['serviceName', 'price', 'qty', 'totalAmount', 'discountPer', 'discountAmount', 'netAmount', 'doctorName', 'className', 'chargesAddedName', 'action'];
    //   public dataSource = new MatTableDataSource<ChargesList>();
    public dataSource = new MatTableDataSource<any>();
    public chargeList: ChargesList[] = [];


    // Total amounts
    constructor(private _matDialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AppointmentBillingComponent>, private formBuilder: FormBuilder, private toastrService: ToastrService) { }

    ngOnInit() {
        this.searchForm = this.createSearchForm();
        this.chargeForm = this.createChargeForm();
        this.totalChargeForm = this.createTotalChargeForm();
        this.dataSource = new MatTableDataSource(this.chargeList);

        this.setupFormListener();
        if (this.data && this.data.patientDetail) {
            this.patientDetail = this.data.patientDetail;
            console.log("DATA : ", this.patientDetail);
        }
    }
    private setupFormListener(): void {
        this.handleChange('price', () => this.calculateTotalCharge());
        this.handleChange('qty', () => this.calculateTotalCharge());
        this.handleChange('discountPer', () => this.updateDiscountAmount());
        this.handleChange('discountAmount', () => this.updateDiscountPercentage());
        this.handleChange('totalDiscountPer', () => this.updateTotalDiscountAmt(), this.totalChargeForm);
    }
    getValidationMessages() {
        return {
            serviceName: [
                { name: "required", Message: "Service Name is required" },
            ],
            cashCounterId: [
                { name: "required", Message: "First Name is required" },

                { name: "pattern", Message: "only Number allowed." }
            ],
            price: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            qty: [
                { name: "required", Message: "Qty required!", },
                { name: "pattern", Message: "only Number allowed.", },
                { name: "min", Message: "Enter valid qty.", }
            ],
            totalAmount: [
                {
                    name: "pattern", Message: "only Number allowed."
                }
            ],
            doctoreId: [
                { name: "pattern", Message: "only Char allowed." }
            ],
            discountPer: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            discountAmount: [{ name: "pattern", Message: "only Number allowed." }],
            netAmount: [{ name: "pattern", Message: "only Number allowed." }],
            concessionId: [{}]
        }
    }
    calculateTotalCharge(row: any = null): void {
        let qty = this.chargeForm.get("qty").value;
        let price = this.chargeForm.get("price").value;
        let total = qty * price;
        if (qty <= 0) return;
        this.chargeForm.patchValue({
            totalAmount: total,
            netAmount: total  // Set net amount initially
        }, { emitEvent: false }); // Prevent infinite loop

        this.updateDiscountAmount();
        this.updateDiscountPercentage();

    }

    // Trigger when discount percentage change
    updateDiscountAmount(row: any = null): void {
        if (this.isUpdating) return; // Stop recursion
        this.isUpdating = true;

        const perControl = this.chargeForm.get("discountPer");
        if (!perControl.valid) {
            this.chargeForm.get("discountAmount").setValue(0);
            this.chargeForm.get("discountPer").setValue(0);
            this.isUpdating = false;
            this.toastrService.error("Enter discount % between 0-100");
            return;
        }
        let percentage = perControl.value;
        let totalAmount = this.chargeForm.get("totalAmount").value;

        // let discountAmount = this.getFixedDecimal(totalAmount * percentage / 100);
        // let netAmount = this.getFixedDecimal(totalAmount - discountAmount);
        let discountAmount = parseFloat((totalAmount * percentage / 100).toFixed(2));
        let netAmount = parseFloat((totalAmount - discountAmount).toFixed(2));

        this.chargeForm.patchValue({
            discountAmount: discountAmount,
            netAmount: netAmount
        }, { emitEvent: false }); // Prevent infinite loop

        this.isUpdating = false; // Reset flag
    }

    // Trigger when discount amount change
    updateDiscountPercentage(): void {
        if (this.isUpdating) return;
        this.isUpdating = true;

        let discountAmount = this.chargeForm.get("discountAmount").value;
        let totalAmount = this.chargeForm.get("totalAmount").value;

        if (discountAmount > totalAmount) {
            this.chargeForm.get("discountAmount").setValue(0);
            this.chargeForm.get("discountPer").setValue(0);
            this.isUpdating = false;
            this.toastrService.error("Discount must be between 0 and the total amount.");
            return;
        }

        // let percent = this.getFixedDecimal(totalAmount ? (discountAmount / totalAmount) * 100 : 0);
        // let netAmount = this.getFixedDecimal(totalAmount - discountAmount);

        let percent = Number(totalAmount ? ((discountAmount / totalAmount) * 100).toFixed(2) : "0.00");
        let netAmount = Number((totalAmount - discountAmount).toFixed(2));
        this.chargeForm.patchValue({
            discountPer: percent,
            netAmount: netAmount
        }, { emitEvent: false }); // Prevent infinite loop

        this.isUpdating = false; // Reset flag
    }
    handleChange(key: string, callback: () => void, form: FormGroup = this.chargeForm) {
        this.subscription.push(form.get(key).valueChanges.subscribe(value => {
            callback();
        }));
    }
    getFixedDecimal(value: number) {
        return Number(value.toFixed(2));
    }

    // Form creation Pending section
    createSearchForm() {
        return this.formBuilder.group({
            regId: [''],
            cashCounterId: ['']
        });
    }

    createChargeFormArray() {
        return this.formBuilder.group({
            rows: this.formBuilder.array([this.createChargeForm()])
        });
    }
    // Create a FormGroup for each row in the FormArray
    createChargeForm() {
        return this.formBuilder.group({
            serviceName: ['Default service name for testing..', Validators.required],
            price: [100, [Validators.required]],
            qty: [0, [Validators.required, Validators.min(1)]],
            totalAmount: [0,],
            discountPer: [0, [Validators.min(0), Validators.max(100)]],
            discountAmount: [0, [Validators.required]],
            netAmount: [0, [Validators.min(0)]]
        });
    }
    createTotalChargeForm() {
        // This all total amounts are calclated based on total data...
        return this.formBuilder.group({
            totalAmount: [0],
            totalDiscountPer: [0, [Validators.min(0), Validators.max(100)]],
            totalDiscountAmount: [0, [Validators.required]],
            totalNetAmount: [0, [Validators.min(0)]],
            paymentType: ['CashPay']
        });
    }

    onAddCharges(): void {
        if (this.chargeForm.valid) {
            const formValue = this.chargeForm.value;
            // Calculate total amount, discount amount, and net amount
            const totalAmount = formValue.price * formValue.qty;
            const discountAmount = (totalAmount * formValue.discountPer) / 100;
            const netAmount = totalAmount - discountAmount;

            // Create a new row of data
            const newRow = {
                ServiceName: formValue.serviceName,
                Price: formValue.price,
                Qty: formValue.qty,
                TotalAmt: totalAmount,
                DiscPer: formValue.discountPer || 0,
                DiscAmt: discountAmount || 0,
                NetAmount: netAmount,
                DoctorName: formValue.doctorName || '-',
                ClassName: formValue.className || '-',
                ChargesAddedName: formValue.chargesAddedName || '-'
            };
            if (!this.isDiscountApplied && discountAmount > 0) {
                this.isDiscountApplied = true;
            }
            const newCharge = new ChargesList(newRow);
            newCharge.DiscAmt = newCharge.DiscAmt || 0;
            newCharge.DiscPer = newCharge.DiscPer || 0;
            this.chargeList.push(newCharge);
            this.dataSource.data = this.chargeList;
            this.calculateTotalAmount();

            // Reset form with initial values
            this.resetForm();
        }
    }
    deleteCharge(index: number) {
        this.chargeList.splice(index, 1);
        this.dataSource.data = this.chargeList;
        this.calculateTotalAmount();
        if (!this.chargeList.length) {
            this.isDiscountApplied = false;
        }
    }

    getAmount(key: string): number {
        const control = this.totalChargeForm.get(key);
        return control ? control.value : 0;
    }

    // Calculation of total amount.
    calculateTotalAmount(): void {
        let totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.TotalAmt), 0);
        let totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscAmt), 0);
        let totalNet = totalSum - totalDiscount;

        this.totalChargeForm.patchValue({
            totalAmount: totalSum,
            totalDiscountAmount: totalDiscount,
            totalNetAmount: totalNet
        }, { emitEvent: false });
    }
    onPriceOrQtyChange(row: ChargesList = null): void {
        if (!row) return;
        const totalAmount = (+row.Price || 0) * (+row.Qty || 0);

        // If discount percentage exists, recalculate discount amount
        if (row.DiscPer) {
            row.DiscAmt = parseFloat(((totalAmount * row.DiscPer) / 100).toFixed(2));
        }
        row.TotalAmt = totalAmount;
        row.NetAmount = totalAmount - row.DiscAmt;

        this.calculateTotalAmount();
    }
    onDiscountPerChange(row: ChargesList): void {
        if (!row) return;
        let discountPer = +row.DiscPer || 0;
        const totalAmount = (+row.Price || 0) * (+row.Qty || 0);

        if (discountPer < 0 || discountPer > 100) {
            discountPer = 0; // Reset if out of range
            row.DiscPer = 0;
            this.toastrService.error("Enter discount % between 0-100");
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
        row.DiscPer = totalAmount ? parseFloat(((discountAmt / totalAmount) * 100).toFixed(2)) : 0;
        row.TotalAmt = totalAmount;
        row.NetAmount = totalAmount - discountAmt;

        this.calculateTotalAmount();
    }
    updateTotalDiscountAmt(): void {
        const discountControl = this.totalChargeForm.get("totalDiscountPer");
        if (discountControl.valid && !this.isDiscountApplied) {
            const totalAmount = +this.totalChargeForm.get("totalAmount").value;
            const discountPer = +discountControl.value;
            const discountAmount = (totalAmount * discountPer) / 100;
            const netAmount = totalAmount - discountAmount;
            this.totalChargeForm.patchValue({
                totalDiscountAmount: discountAmount,
                totalNetAmount: netAmount
            }, { emitEvent: false });
        }
    }
    resetForm(): void {
        this.chargeForm.reset({
            serviceName: 'Default service name for testing',
            price: 100,
            qty: 0,
            totalAmount: 0,
            discountPer: 0,
            discountAmount: 0,
            netAmount: 0
        });
    }
    onSubmit(): void {
        if (this.totalChargeForm.valid && this.chargeList.length > 0) {
            console.log("FORM: ", { chargeList: this.chargeList, paymentDetail: this.totalChargeForm.value });
            // Pending task
        }
    }
    ngOnDestroy(): void {
        if (this.subscription.length > 0) {
            this.subscription.forEach(s => s.unsubscribe());
        }
    }
}
