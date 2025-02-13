import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ChargesList } from '../../OPBilling/new-opbilling/new-opbilling.component';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from '../../registration/registration.component';
import { AppointmentlistService } from '../appointmentlist.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-appointment-billing',
    templateUrl: './appointment-billing.component.html',
    styleUrls: ['./appointment-billing.component.scss'],
    animations: fuseAnimations
})
export class AppointmentBillingComponent implements OnInit, OnDestroy {
    public subscription: Array<Subscription> = [];
    // For testing purpose
//   /  public serviceNames: string[] = ['Blood Test', 'X-Ray', 'MRI Scan', 'CT Scan', 'Ultrasound', 'ECG', 'Physical Therapy', 'General Checkup', 'Dental Cleaning'];

   //new
   ServiceList: any = [];
   CreditedtoDoctor: any;
 IsPathology: any;
 IsRadiology: any;
 isLoading: String = '';
 vIsPackage: any;
 vPrice = '0';
 vQty: any;
 vChargeTotalAmount: any = 0;
 vDoctor: any;
 SrvcName1: any = ""
 vCahrgeNetAmount: any;
 serviceId: any;
 VchargeDiscPer: any;
 vchargeDisAmount: any;
 DoctornewId: any;
 ChargesDoctorname: any;
 vClassName: any;
 filteredOptionsService: any;
 vFinalConcessionAmt:any;
 FinalNetAmt:any;
 vFinalconcessionDiscPer:any;
 vFinalTotalAmt:any;
 patientDetail = new RegInsert({});
 patientDetail1 = new RegInsert({});
RegId=0
Consessionres: boolean = false;
autocompleteModeCashcounter: string = "CashCounter";
autocompleteModedeptdoc: string = "ConDoctor";
autocompleteModeService: string = "Service";
autocompleteModeConcession: string = "Concession";
public dataSource = new MatTableDataSource<any>();
    // public filteredOptionsService: Array<any> = [];

    public searchForm!: FormGroup;
    public chargeForm!: FormGroup;
    public totalChargeForm!: FormGroup;

    public isServiceSelected = false;
    public isDiscountApplied = false;
    public isDoctor = false;
    public isUpdating = false;

    public displayedChargeColumns: string[] = ['ServiceName', 'Price', 'Qty', 'TotalAmount', 'DiscountPer', 'DiscountAmount', 'NetAmount', 'DoctorName', 'ClassName', 'ChargesAddedName', 'Action'];
    public displayedPackageColumns: string[] = ['PackageName', 'ServiceName', 'Price', 'Qty', 'TotalAmount', 'DiscountPer', 'DiscountAmount', 'NetAmount', 'DoctorName', 'ClassName', 'ChargesAddedName', 'Action'];
    public displayedPrescriptionColumns = ['ServiceName', 'Qty', 'Price', 'TotalAmt'];
    //   public dataSource = new MatTableDataSource<ChargesList>();
    public dsChargeList = new MatTableDataSource<ChargesList>();
    public dsPackageList = new MatTableDataSource<ChargesList>();
    public dsServiceList = new MatTableDataSource<ChargesList>();
    public chargeList: ChargesList[] = [];
    public packageList: ChargesList[] = [];
    public serviceList: ChargesList[] = [];

    // public filteredServices: string[] = [];
    // public filteredServices$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(this.serviceNames);




    // Total amounts
    constructor(private _matDialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, 
    public _AppointmentlistService: AppointmentlistService,private dialogRef: MatDialogRef<AppointmentBillingComponent>, private formBuilder: FormBuilder, private toastrService: ToastrService) { }

    ngOnInit() {
        this.searchForm = this.createSearchForm();
        this.chargeForm = this.createChargeForm();
        this.totalChargeForm = this.createTotalChargeForm();

        this.dsChargeList = new MatTableDataSource(this.chargeList);
        this.dsPackageList = new MatTableDataSource(this.packageList);
        this.dsServiceList = new MatTableDataSource(this.serviceList);

        this.setupFormListener();
        if (this.data && this.data.patientDetail) {
            this.patientDetail = this.data.patientDetail;
            console.log("DATA : ", this.patientDetail);
        }
    }
    private setupFormListener(): void {
        this.handleChange('serviceName', () => this.filterServiceName());
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

    filterServiceName(): void {
        const serviceNameValue = this.chargeForm.get('serviceName')?.value || '';
        const filterValue = serviceNameValue.toLowerCase();

        // const filteredList = this.serviceNames.filter(service =>
        //     service.toLowerCase().includes(filterValue)
        //   );
      
        //   this.filteredServices$.next(filteredList);
        //   console.log("Service Change", { filteredServices: filteredList, filterValue });
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
            serviceName: ['', Validators.required],
            price: [0, [Validators.required]],
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
                ServiceName: formValue.serviceName.serviceName,
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
            this.dsChargeList.data = this.chargeList;
            this.calculateTotalAmount();

            // Reset form with initial values
            this.resetForm();
        }
    }
    deleteCharge(index: number) {
        this.chargeList.splice(index, 1);
        this.dsChargeList.data = this.chargeList;
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
            price: 0,
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

      //service list 
      getServiceListCombobox() {
        debugger
        let sname = this.chargeForm.get('serviceName').value + '%' || '%'
        var m_data = {
    
          "first": 0,
          "rows": 100,
          "sortField": "ServiceId",
          "sortOrder": 0,
          "filters": [
            { "fieldName": "ServiceName", "fieldValue": sname, "opType": "StartsWith" },
            { "fieldName": "TariffId", "fieldValue": "0", "opType": "Equals" },
            { "fieldName": "GroupId", "fieldValue": "0", "opType": "Equals" },
            { "fieldName": "Start", "fieldValue": "0", "opType": "Equals" },
            { "fieldName": "Length", "fieldValue": "30", "opType": "Equals" }
          ],
          "exportType": "JSON"
        }
    
        console.log(m_data)
    
        this._AppointmentlistService.getBillingServiceList(m_data).subscribe(data => {
          this.filteredOptionsService = data.data;
          this.ServiceList = data.data;
    
        //   if (this.filteredOptionsService.length == 0) {
        //     this.noOptionFound = true;
        //   } else {
        //     this.noOptionFound = false;
        //   }
        });
    
    
      }
      
      getSelectedserviceObj(obj) {
        if (this.dataSource.data.length > 0) {
          this.dataSource.data.forEach((element) => {
            if (obj.serviceId == element.serviceId) {
    
              Swal.fire('Selected Item already added in the list ');
    
            //   this.onClearServiceAddList();
            }
    
          });
        } else {
          console.log(obj)
    
          this.SrvcName1 = obj.serviceName;
          this.vPrice = obj.price;
          this.vQty = 1;
          this.vChargeTotalAmount = obj.price;
          this.vCahrgeNetAmount = obj.price;
          this.serviceId = obj.serviceId;
          this.IsPathology = obj.isPathology;
          this.IsRadiology = obj.isRadiology;
          this.vIsPackage = obj.IsPackage;
          this.CreditedtoDoctor = obj.creditedtoDoctor;
        //   if (this.CreditedtoDoctor == true) {
        //     this.isDoctor = true;
        //     this.registeredForm.get('DoctorID').reset();
        //     this.registeredForm.get('DoctorID').setValidators([Validators.required]);
        //     this.registeredForm.get('DoctorID').enable();
    
        //   } else {
        //     this.isDoctor = false;
        //     this.registeredForm.get('DoctorID').reset();
        //     this.registeredForm.get('DoctorID').clearValidators();
        //     this.registeredForm.get('DoctorID').updateValueAndValidity();
        //     this.registeredForm.get('DoctorID').disable();
        //   }
        }
    
    
      }
    
    getOptionText(option) {
    
        return option && option.serviceName ? option.serviceName : '';
      }

      //reglist
      getSelectedObj(obj) {
       if ((obj.value ?? 0) > 0) {
            console.log(this.data)
            setTimeout(() => {
                this._AppointmentlistService.getRegistraionById(obj.value).subscribe((response) => {
                    this.patientDetail = response;
                    console.log(this.patientDetail)
                });

            }, 500);

            // setTimeout(() => {
            //     this._AppointmentlistService.getVisitById(obj.value).subscribe((response) => {
            //         this.patientDetail1 = response;
            //         console.log(this.patientDetail1)
            //     });

            // }, 500);
        }

    }

    onScroll(){
        // this.nextPage$.next();
    }
    
}
