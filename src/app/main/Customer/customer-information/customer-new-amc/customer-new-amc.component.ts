import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CustomerInformationService } from '../customer-information.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-customer-new-amc',
  templateUrl: './customer-new-amc.component.html',
  styleUrls: ['./customer-new-amc.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CustomerNewAMCComponent implements OnInit {

 dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;
  vCustomerId: any;
  vAmount: any;
  vDescription: any;
  isCustomerIdSelected: boolean = false;
  registerObj: any;
  filteredOptions: Observable<string[]>;
  CustomerList: any = [];
  AMCId: any
  filteredOptionsCutomer: any;
  noOptionFound: any;
  vSupplierId: any;
  vCustomerName: any; 
  NewAMCForm:FormGroup
  vDuration:any;
  vAMCStartDate:any;
  isDate: boolean;

  constructor(
        public _CustomerInfo: CustomerInformationService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        private elementRef: ElementRef,
        public dialogRef: MatDialogRef<CustomerNewAMCComponent>,
        private _loggedService: AuthenticationService,
        private _formbuilder : FormBuilder
  ) { }

    /////////////////// new code ///////////////////////

    ngOnInit(): void {
      this.NewAMCForm = this.createAMCform();
    
      this.getCustomerSearch();
    
      if (this.data) {
        console.log(this.data);
        if (this.data.FormName == 0) {
          this.registerObj = this.data.Obj;
          console.log(this.registerObj);
          this.AMCId = this.registerObj.TranId;
          this.vAmount = this.registerObj.Amount;
          this.vDescription = this.registerObj.Comments;
          this.vDuration = this.registerObj.AMCDuration;
          this.vAMCStartDate = this.registerObj.AMCStartDate;
          this.isDate = this.data.isDate;
          this.getCustomerSearch();
    
          // when data is editing
          this.NewAMCForm.patchValue({
            Duration: this.vDuration,
            startdate: this.vAMCStartDate,
            enddate: new Date().toISOString()
          });
        }
        else if (this.data.FormName == 1) {
          this.registerObj = this.data.Obj;
          console.log('new', this.registerObj);
          this.getCustomerSearch();
        }
      }
    
      // Subscribe to form value changes to handle duration and startdate
      this.NewAMCForm.valueChanges.subscribe((formValues) => {
        debugger
        const { Duration, startdate } = formValues;
    
        if (Duration && startdate) {
          const startDate = new Date(startdate);
          const durationDays = parseInt(Duration, 10);
    
          // Ensure valid duration and start date
          if (!isNaN(durationDays) && startDate instanceof Date) {
            const endDate = this.calculateEndDate(startDate, durationDays);
    
            // Update the end date field without triggering additional events
            this.NewAMCForm.patchValue({
              enddate: endDate
            }, { emitEvent: false });
          }
        }
      });
    
      // Watch for changes to the 'Duration' and 'startdate' fields using ngModel
      this.NewAMCForm.get('Duration')?.valueChanges.subscribe((durationValue) => {
        const startDateValue = this.NewAMCForm.get('startdate')?.value;
        if (startDateValue && durationValue) {
          this.updateEndDate(startDateValue, durationValue);
        }
      });
    
      this.NewAMCForm.get('startdate')?.valueChanges.subscribe((startDateValue) => {
        const durationValue = this.NewAMCForm.get('Duration')?.value;
        if (startDateValue && durationValue) {
          this.updateEndDate(startDateValue, durationValue);
        }
      });
    }
    
    // method to calculate the enddate based on startdate and duration
    calculateEndDate(startDate: string | Date, durationMonths: number): string {
      const start = new Date(startDate);
      start.setMonth(start.getMonth() + durationMonths); // Add duration months to the start date
      return start.toISOString().substring(0, 10); // Return the end date formatted as YYYY-MM-DD
    }
    
    // method to update enddate when duration or startdate changes
    updateEndDate(startDate: string, duration: number): void {
      const endDate = this.calculateEndDate(startDate, duration);
    
      // Update enddate form control
      this.NewAMCForm.patchValue({
        enddate: endDate
      }, { emitEvent: false }); // Prevent infinite loop of value changes
    }
        
    ///////////////////// code end /////////////////

  createAMCform(){
    return this._formbuilder.group({
      CustomerId:[''],
      Amount:[''],
      Duration:[''], 
      Description:[''],
      startdate: [(new Date()).toISOString()],
      // startdate: [(this.registerObj?.AMCStartDate) ? new Date(this.registerObj.AMCStartDate) : null],
      enddate: [(new Date()).toISOString()],
    })
  }
  PopulateForm(param){
    this.NewAMCForm.patchValue(param)
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  focusNext(nextElementId: string): void {
    const nextElement = this.elementRef.nativeElement.querySelector(`#${nextElementId}`);
    if (nextElement) {
      nextElement.focus();
    }
  }
  getCustomerSearch() {
    var m_data = {
      'CustomerName': this.NewAMCForm.get('CustomerId').value || "%"
    }
    console.log(m_data)
    this._CustomerInfo.getCustomerSearchCombo(m_data).subscribe(data => {
      this.CustomerList = data;
      console.log(this.CustomerList)
      this.filteredOptions = this.NewAMCForm.get('CustomerId').valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      ); 
      if (this.data) {
        const Customerselected = this.CustomerList.find(c => c.CustomerId == this.registerObj.CustomerId);
        this.NewAMCForm.get('CustomerId').setValue(Customerselected);
        console.log(Customerselected)
      }
    });
  }
  private _filter(value: any): string[] {
    if (value) {
      const filterValue = value && value.CustomerName ? value.CustomerName.toLowerCase() : value.toLowerCase();
      return this.CustomerList.filter(option => option.CustomerName.toLowerCase().includes(filterValue));
    }
  }
  getOptionText(option) {
    return option && option.CustomerName ? option.CustomerName : '';
  }
 onSubmit() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if ((this.vCustomerId == '' || this.vCustomerId == null || this.vCustomerId == undefined)) {
      this.toastr.warning('Please enter a CustomerId', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vAmount == '' || this.vAmount == null || this.vAmount == undefined)) {
      this.toastr.warning('Please enter a Amount', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if ((this.vDuration == '' || this.vDuration == null || this.vDuration == undefined)) {
      this.toastr.warning('Please enter a Duration', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (!this.AMCId) {
      let amcSaveParamsObj = {};
      amcSaveParamsObj['customerId'] = this.NewAMCForm.get('CustomerId').value.CustomerId || 0;
      amcSaveParamsObj['amcDuration'] = this.NewAMCForm.get('Duration').value || '';
      amcSaveParamsObj['amcAmount'] = this.NewAMCForm.get('Amount').value || 0;
      amcSaveParamsObj['createdBy'] = this._loggedService.currentUserValue.user.id || 0;
      amcSaveParamsObj['comments'] =  this.NewAMCForm.get('Description').value || '';

      let submitData = {
        "amcSaveParams": amcSaveParamsObj,
      };
      console.log(submitData);
      this._CustomerInfo.SaveCustomerAmc(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onReset()
        }
        else {
          this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    } else { 
      let customerAmcUpdateObj = {};
      customerAmcUpdateObj['amcId'] = this.registerObj.TranId;
      customerAmcUpdateObj['customerId'] = this.NewAMCForm.get('CustomerId').value.CustomerId || 0;
      // customerAmcUpdateObj['amcStartDate'] = formattedDate;
      // customerAmcUpdateObj['amcEndDate'] = formattedDate;
      customerAmcUpdateObj['amcStartDate'] = this.NewAMCForm.get('startdate')?.value || null;
      customerAmcUpdateObj['amcEndDate'] = this.NewAMCForm.get('enddate')?.value || null;
      customerAmcUpdateObj['amcDuration'] = this.NewAMCForm.get('Duration').value || 0;
      customerAmcUpdateObj['amcAmount'] = this.NewAMCForm.get('Amount').value || 0;
      customerAmcUpdateObj['comments'] = this._loggedService.currentUserValue.user.id || 0; 
      customerAmcUpdateObj['modifiedBy'] = this._loggedService.currentUserValue.user.id || 0; 


      let submitData = {
        "customerAmcUpdate": customerAmcUpdateObj,
      };
      console.log(submitData);
      this._CustomerInfo.UpdateCustomerAmc(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onReset()
        }
        else {
          this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }
  }
  onReset() {
    this.NewAMCForm.reset();
    this.onClose();
  }
  onClose() {
    this.dialogRef.close();
  } 
}
