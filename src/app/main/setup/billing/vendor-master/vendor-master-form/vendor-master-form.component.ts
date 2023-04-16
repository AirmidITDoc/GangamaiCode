import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceMaster } from '../vendor-master.model';

@Component({
  selector: 'app-vendor-master-form',
  templateUrl: './vendor-master-form.component.html',
  styleUrls: ['./vendor-master-form.component.scss']
})

export class VendorMasterFormComponent {
  action: string;
  contact: ServiceMaster;
  contactForm: FormGroup;
  dialogTitle: string;
  displayedColumns: string[] = ['classname', 'classrate'];
  dataSource = [{ classname: 'Name1', classrate: "rate1" },
  { classname: 'Name2', classrate: "rate2" },
  { classname: 'Name3', classrate: "rate3" },
  { classname: 'Name5', classrate: "rate5" }];
  /**
   * Constructor
   *
   * @param {MatDialogRef<ServiceMasterFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
      public matDialogRef: MatDialogRef<VendorMasterFormComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      private _formBuilder: FormBuilder
  ) {
      // Set the defaults
      this.action = _data.action;

      if (this.action === 'edit') {
          this.dialogTitle = 'Edit Vendor Master';
          this.contact = _data.contact;
      }
      else {
          this.dialogTitle = 'New Vendor Master';
          this.contact = new ServiceMaster({});
      }

      this.contactForm = this.createContactForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create contact form
   *
   * @returns {FormGroup}
   */
  createContactForm(): FormGroup {
      return this._formBuilder.group({
          // name: [this.contact.name],
          // lastName: [this.contact.lastName],
          // avatar: [this.contact.avatar],
          // nickname: [this.contact.nickname],
          // company: [this.contact.company],
          // jobTitle: [this.contact.jobTitle],
          // email: [this.contact.email],
          // phone: [this.contact.phone],
          // address: [this.contact.address],
          // birthday: [this.contact.birthday],
          // notes: [this.contact.notes]
      });
  }
}
