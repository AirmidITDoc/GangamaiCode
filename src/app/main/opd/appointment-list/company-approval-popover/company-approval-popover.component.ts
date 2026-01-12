import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

@Component({
  selector: 'app-company-approval-popover',
  templateUrl: './company-approval-popover.component.html',
  styleUrls: ['./company-approval-popover.component.scss']
})
export class CompanyApprovalPopoverComponent implements OnInit {
  @Input() patientData: any;
  @ViewChild('grid') grid: AirmidTableComponent;
  
  companyApprovalFormGroup: FormGroup;
  AdmissionID: any;
    autocompleteModecompany: string = "Company";
  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private _AdmissionService: AdmissionService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.companyApprovalFormGroup = this.createCompanyApprovalForm();
    if (this.patientData) {
      this.AdmissionID = this.patientData.visitId || this.patientData.admissionId;
      this.companyApprovalFormGroup.patchValue({
        admissionId: this.AdmissionID,
        estimateAmount: this.patientData.estimateAmount || 0,
        approvedAmount: this.patientData.approvedAmount || 0,
        alentry: this.patientData.alentry || '',
        dateApproved: this.patientData.dateApproved || new Date(),
        comments: this.patientData.comments || '',
        companyId: this.patientData.CompanyId || 0
      });
    }
  }

  ngAfterViewInit() {
    if (this.grid) {
      setTimeout(() => {
        this.getfilterdata();
      }, 200);
    }
  }

  createCompanyApprovalForm() {
    return this.formBuilder.group({
      id: [0],
      admissionId: [0],
      estimateAmount: [0, [Validators.required, Validators.min(1)]],
      approvedAmount: [0, [Validators.required, Validators.min(1)]],
      alentry: [''],
      dateApproved: [new Date(), [Validators.required]],
      comments: [''],
      companyId:0
    });
  }

  allColumns = [
    { heading: "Estimate Amt", key: "estimateAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Approved Amt", key: "approvedAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Al Entry", key: "alentry", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Valid Date", key: "dateApproved", sort: true, align: 'left', emptySign: 'NA', type: 6 },
    { heading: "Remark", key: "comments", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, callback: (data: any) => {
            this.OnEdit(data)
          }
        }, {
          action: gridActions.delete, callback: (data: any) => {
            this._AdmissionService.deactivateTheStatus(data.id).subscribe((response: any) => {
              this.getfilterdata();
            });
          }
        }]
    }
  ]

  gridConfig: gridModel = {
    apiUrl: "CompanyTPAApproval/List",
    columnsList: this.allColumns,
    sortField: "Id",
    sortOrder: 0,
    filters: [
      { fieldName: "AdmissionId", fieldValue: "0", opType: OperatorComparer.Contains }
    ]
  }

  getfilterdata() {
    if (!this.grid) {
      console.warn('Grid not initialized yet');
      return;
    }
    
    if (!this.AdmissionID || this.AdmissionID === 0) {
      console.warn('No valid AdmissionID available');
      return;
    }
    
    this.gridConfig = {
      apiUrl: "CompanyTPAApproval/List",
      columnsList: this.allColumns,
      sortField: "Id",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmissionId", fieldValue: String(this.AdmissionID), opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  onDateApprovedChange(event: any) {
    const selectedDate = new Date(event.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      this.toastr.warning('Future date is not allowed! Please select today or past date.', 'Warning!');
      this.companyApprovalFormGroup.get('dateApproved')?.setValue('');
    }
  }

  OnEdit(row: any) {
    this.companyApprovalFormGroup.patchValue(row);
  }

  onSave() {
    // Mark all fields as touched to show validation errors
    Object.keys(this.companyApprovalFormGroup.controls).forEach(key => {
      this.companyApprovalFormGroup.get(key)?.markAsTouched();
    });

    if (this.companyApprovalFormGroup.invalid) {
      this.toastr.warning('Please fill all required fields.', 'Warning');
      console.error('Form validation errors:', this.companyApprovalFormGroup.errors);
      return;
    }

    const currentDate = this.companyApprovalFormGroup.get('dateApproved').value;
    const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    // Create a copy of form data
    const formData = { ...this.companyApprovalFormGroup.value };
    formData.dateApproved = formattedDate;
    formData.admissionId = this.AdmissionID;

    console.log('Saving Company Approval:', formData);

    this._AdmissionService.CompanyApprovalInsert(formData).subscribe(
      (response: any) => {
        console.log('Save response:', response);
        // Don't show success toastr if API response already has a message
        if (!response?.message) {
          this.toastr.success('Company Approval saved successfully.', 'Success');
        }
        setTimeout(() => {
          if (this.grid) {
            this.getfilterdata();
          }
        }, 500);
        this.onClose();
      },
      (error) => {
        console.error('Save error:', error);
        const errorMessage = error?.error?.message || error?.message || 'Error saving company approval.';
        this.toastr.error(errorMessage, 'Error');
      }
    );
  }

    onChangeCompany(value) {
        // this._AdmissionService.getCompanyById(value.value).subscribe((response) => {
        //     this.companyDet = response;
           
        // });
    }

  getValidationMessages() {
        
        return {
            CompanyId: [],
         };
    }

  onClose() {
    this.companyApprovalFormGroup.reset({
      id: 0,
      admissionId: this.AdmissionID,
      estimateAmount: 0,
      approvedAmount: 0,
      alentry: '',
      dateApproved: new Date(),
      comments: '',
      companyId:0
    });
  }

  keyPressAlphanumeric(event: any) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}

