import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { CompanyMasterService } from '../company-master.service';

@Component({
  selector: 'app-comptoserv',
  templateUrl: './comptoserv.component.html',
  styleUrls: ['./comptoserv.component.scss'],
  encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class ComptoservComponent implements OnInit {
    
    companyForm: FormGroup;
    autocompleteModetypeName:string="CompanyType";

    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public dialogRef: MatDialogRef<ComptoservComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    
    gridConfig: gridModel = {
        apiUrl: "CompanyTypeMaster/List",
        columnsList: [
            { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CompanyMasterService.deactivateTheStatus(data.companyTypeId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "companyTypeId",
        sortOrder: 0,
        filters: [
            { fieldName: "typeName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    }

    gridConfig1: gridModel = {
        apiUrl: "CompanyTypeMaster/List",
        columnsList: [
            { heading: "ServiceName", key: "typeName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ServicePrice", key: "price", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CompanyMasterService.deactivateTheStatus(data.companyTypeId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "companyTypeId",
        sortOrder: 0,
        filters: [
            { fieldName: "typeName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        // let that = this;
        // const dialogRef = this._matDialog.open(NewCompanyTypeComponent,
        //     {
        //         maxWidth: "45vw",
        //         height: '35%',
        //         width: '70%',
        //         data: row
        //     });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         that.grid.bindGridData();
        //     }
        // });
    }

    ngOnInit(): void {
        this.companyForm = this._CompanyMasterService.createCompanymasterForm();  
        this.companyForm.markAllAsTouched();          
    }

    getServiceList(){

    }

    onSubmit() {  
               
        if(!this.companyForm.invalid)
        {

            console.log("Company Insert:-",this.companyForm.value);

            this._CompanyMasterService.companyMasterSave(this.companyForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
            }, (error) => {
            this.toastr.error(error.message);
            });
        }
        else
        {
            this.toastr.warning('please check form is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
    }

    onClear(val: boolean) {
        this.companyForm.reset();
        this.dialogRef.close(val);
    }

    onClose(){
        this.companyForm.reset();
        this.dialogRef.close();
    }

    getValidationMessages() {
        return {
                companyName: [
                    { name: "required", Message: "Company Name is required" },
                    { name: "maxlength", Message: "Company name should not be greater than 50 char." },
                    { name: "pattern", Message: "Special char not allowed." }
                ],
                traiffId: [
                    { name: "required", Message: "Tariff Name is required" }
                ],
                city: [
                    { name: "required", Message: "City Name is required" }
                ],
                mobileNo:[
                    { name: "required", Message: "Mobile Number is required" },
                    { name: "maxlength", Message: "Number be not be greater than 10 digits" },
                    { name: "pattern", Message: "Only Digits allowed." }
                ],
                phoneNo:[
                    { name: "required", Message: "Phone Number is required" },
                    { name: "maxlength", Message: "Number be not be greater than 10 digits" },
                    { name: "pattern", Message: "Only Digits allowed." }
                ],
                pinNo:[
                    { name: "required", Message: "Pin Code is required" },
                    { name: "maxlength", Message: "Pincode must be greater than 2 digits" },
                    { name: "pattern", Message: "Only Digits allowed." }
                ],
                address:[
                    { name: "required", Message: "Address is required" },
                    { name: "maxlength", Message: "Address must be between 1 and 100 characters." },
                    { name: "pattern", Message: "Secial Char allowed." }
                ],
                compTypeId:[
                    { name: "required", Message: "Company Type Name is required" }
                ],
        };
    }


}
