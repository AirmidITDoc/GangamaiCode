import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';

@Component({
  selector: 'app-policy-info-popover',
  templateUrl: './policy-info-popover.component.html',
  styleUrls: ['./policy-info-popover.component.scss']
})
export class PolicyInfoPopoverComponent implements OnInit {
  @Input() patientData: any;
  
  policyFormGroup: FormGroup;
  policyHistory: any[] = [];
  isLoading: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private _AdmissionService: AdmissionService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.policyFormGroup = this.createPolicyInfoForm();
    if (this.patientData) {
      this.policyFormGroup.patchValue({
        policyNo: this.patientData.policyNo || '',
        approvedAmount: this.patientData.approvedAmount || 0,
        validDate: this.patientData.validDate || new Date()
      });
      this.loadPolicyHistory();
    }
  }

  createPolicyInfoForm() {
    return this.formBuilder.group({
      policyNo: ['', [Validators.required]],
      approvedAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      admissionId: [0],
      validDate: [new Date(), [Validators.required, this._FormvalidationserviceService.validDateValidator()]],
    });
  }

  loadPolicyHistory() {
    // Load policy history for this patient
    const admissionId = this.patientData?.visitId || this.patientData?.admissionId;
    if (admissionId) {
      this.isLoading = true;
      // Since there's no specific API for policy history, we'll show empty table
      // The actual policy info is saved via CompanyInfoUpdate API
      this.policyHistory = [];
      this.isLoading = false;
    }
  }

  onValidDateChange(event: any) {
    const selectedDate = new Date(event.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.toastr.warning('Valid Date cannot be earlier than today.', 'Warning!');
      this.policyFormGroup.get('validDate')?.setValue('');
    }
  }

  onSave() {
    if (this.policyFormGroup.invalid) {
      this.toastr.warning('Please fill all required fields.', 'Warning');
      return;
    }

    const admissionId = this.patientData?.visitId || this.patientData?.admissionId;
    this.policyFormGroup.get('admissionId').setValue(admissionId);

    const formData = { ...this.policyFormGroup.value };
    // Remove validDate from submission as per original component
    delete formData.validDate;

    this._AdmissionService.CompanyInfoUpdate(formData).subscribe(
      (response: any) => {
        // Don't show success toastr if API response already has a message
        if (!response?.message) {
          this.toastr.success('Policy Information saved successfully.', 'Success');
        }
        this.loadPolicyHistory();
        // Reset form after successful save
        this.policyFormGroup.reset({
          policyNo: '',
          approvedAmount: 0,
          validDate: new Date(),
          admissionId: admissionId
        });
      },
      (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Error saving policy information.';
        this.toastr.error(errorMessage, 'Error');
      }
    );
  }
}

