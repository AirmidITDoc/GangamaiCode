import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { IcdcodeFormService } from '../icdcode-form.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-icdcode-form',
  templateUrl: './icdcode-form.component.html',
  styleUrls: ['./icdcode-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IcdcodeFormComponent implements OnInit {

  vICDCodingId: any;
  vICDCodeName: any;
  vICDCode: any;
  registerObj: any;
  vIsDeleted: any;
  vICDCdeMId: any;
  isGroupSelected: boolean = false;
  GroupcmbList: any = [];
  optionsSearchgroup: any[] = [];
  filteredOptionsGroup: Observable<string[]>;

  constructor(
    public _newCodingService: IcdcodeFormService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<IcdcodeFormComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      debugger
      this.registerObj = this.data.Obj;
      console.log("RegisterObj:", this.registerObj)
      this.vICDCodeName = this.registerObj.ICDCodeName;
      this.vICDCodingId = this.registerObj.ICDCodingId;
      this.vICDCode = this.registerObj.ICDCode;
      this.vICDCdeMId = this.registerObj.MainICDCdeId; //dropdown name
      if (this.registerObj.IsActive == true) {
        this._newCodingService.myCodingForm.get("IsDeleted").setValue(true)
      } else {
        this._newCodingService.myCodingForm.get("IsDeleted").setValue(false)
      }
    }

    this.getGroupNameCombo();
  }

  getOptionTextGroup(option) {
    debugger
    return option && option.ICDCodeName ? option.ICDCodeName : '';
  }

  getGroupNameCombo() {
    debugger
    this._newCodingService.getICDGroupMasterCombo().subscribe(data => {
      this.GroupcmbList = data;
      this.optionsSearchgroup = this.GroupcmbList.slice();
      this.filteredOptionsGroup = this._newCodingService.myCodingForm.get('ICDCdeMId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filtersearchgroup(value) : this.GroupcmbList.slice()),
      );
      if (this.data) {
        debugger
        const DValue = this.GroupcmbList.filter(item => item.ICDCdeMId == this.registerObj.MainICDCdeId);
        console.log("ICDCdeMId:", DValue)
        this._newCodingService.myCodingForm.get('ICDCdeMId').setValue(DValue[0]);
        this._newCodingService.myCodingForm.updateValueAndValidity();
        return;
      }
    });
  }

  private _filtersearchgroup(value: any): string[] {
    debugger
    if (value) {
      const filterValue = value && value.ICDCodeName ? value.ICDCodeName.toLowerCase() : value.toLowerCase();
      return this.GroupcmbList.filter(option => option.ICDCodeName.toLowerCase().includes(filterValue));
    }
  }

  onSave() {
    if (this.vICDCode == '' || this.vICDCode == null || this.vICDCode == undefined) {
      this.toastr.warning('Please enter ICD Code  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vICDCodeName == '' || this.vICDCodeName == null || this.vICDCodeName == undefined) {
      this.toastr.warning('Please enter ICDCode Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vICDCdeMId == '' || this.vICDCdeMId == null || this.vICDCdeMId == undefined) {
      this.toastr.warning('Please select Group ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._newCodingService.myCodingForm.get('ICDCdeMId').value) {
      if (!this.GroupcmbList.find(item => item.ICDCdeMId == this._newCodingService.myCodingForm.get('ICDCdeMId').value.ICDCdeMId)) {
        this.toastr.warning('Please select Valid Group Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    Swal.fire({
      title: 'Do you want to Save the ICD Coding Recode ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!",
      cancelButtonText: "No, Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSubmit();
      }
    });
  }

  onSubmit() {
    debugger
    if (!this.vICDCodingId) {

      var m_dataInsert = {
        "saveMICDCodingMasterParam": {
          "icdCode": this._newCodingService.myCodingForm.get("ICDCode").value || '',
          "icdCodeName": this._newCodingService.myCodingForm.get("ICDCodeName").value || '',
          "mainICDCdeId": parseInt(this._newCodingService.myCodingForm.get("ICDCdeMId").value.ICDCdeMId).toString(),
          "isActive": Boolean(JSON.parse(this._newCodingService.myCodingForm.get("IsDeleted").value) || 0),
          "createdBy": this._loggedService.currentUserValue.user.id,
          "icdCodingId": 0
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._newCodingService.ICDCodingInsert(m_dataInsert).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
    else {
      debugger
      var m_dataUpdate = {
        "updateMICDCodingMasterParam": {
          "icdCodingId": this.vICDCodingId,
          "icdCode": this._newCodingService.myCodingForm.get("ICDCode").value || '',
          "icdCodeName": this._newCodingService.myCodingForm.get("ICDCodeName").value || '',
          "mainICDCdeId": parseInt(this._newCodingService.myCodingForm.get("ICDCdeMId").value.ICDCdeMId),
          "isActive": Boolean(JSON.parse(this._newCodingService.myCodingForm.get("IsDeleted").value)) ? 1 : 0,
          "modifiedBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._newCodingService.ICDCodingUpdate(m_dataUpdate).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }

  onClose() {
    this._newCodingService.myCodingForm.reset({ IsDeleted: true });
    this.dialogRef.close();
  }

}
