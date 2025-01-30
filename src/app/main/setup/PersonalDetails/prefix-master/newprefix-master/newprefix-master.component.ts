import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { PrefixMasterService } from '../prefix-master.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-newprefix-master',
  templateUrl: './newprefix-master.component.html',
  styleUrls: ['./newprefix-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewprefixMasterComponent implements OnInit {

  registerObj: any;
  vIsDeleted: any;
  vPrefixName: any;
  vPrefixID: any;
  vSexID: any;
  isGenderSelected: boolean = false;
  optionsSearchgroup: any[] = [];
  filteredOptionsGender: Observable<string[]>;
  GendercmbList: any = [];

  constructor(
    public _PrefixService: PrefixMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewprefixMasterComponent>,
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
      this.vPrefixName = this.registerObj.PrefixName;
      this.vPrefixID = this.registerObj.PrefixID;
      // this.vSexID=this.GenderName;
      if (this.registerObj.IsActive == true) {
        this._PrefixService.myform.get("IsDeleted").setValue(true)
      } else {
        this._PrefixService.myform.get("IsDeleted").setValue(false)
      }
    }
    this.getGenderNameCombo();
  }

  getOptionTextGen(option) {

    return option && option.GenderName ? option.GenderName : '';
  }

  getGenderNameCombo() {
    debugger
    this._PrefixService.getGenderMasterCombo().subscribe(data => {
      this.GendercmbList = data;
      this.optionsSearchgroup = this.GendercmbList.slice();
      this.filteredOptionsGender = this._PrefixService.myform.get('SexID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filtersearchlocation(value) : this.GendercmbList.slice()),
      );
      if (this.data) {
        debugger
        const DValue = this.GendercmbList.filter(item => item.GenderName == this.registerObj.GenderName);
        console.log("GenderName:", DValue)
        this._PrefixService.myform.get('SexID').setValue(DValue[0]);
        this._PrefixService.myform.updateValueAndValidity();
        return;
      }
    });
  }

  private _filtersearchlocation(value: any): string[] {

    if (value) {
      const filterValue = value && value.GenderName ? value.GenderName.toLowerCase() : value.toLowerCase();
      return this.GendercmbList.filter(option => option.GenderName.toLowerCase().includes(filterValue));
    }
  }

  onSave() {
    if (this.vPrefixName == '' || this.vPrefixName == null || this.vPrefixName == undefined) {
      this.toastr.warning('Please Enter PrefixName  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vSexID == '' || this.vSexID == null || this.vSexID == undefined) {
      this.toastr.warning('Please select Gender ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._PrefixService.myform.get('SexID').value) {
      if (!this.GendercmbList.find(item => item.GenderName == this._PrefixService.myform.get('SexID').value.GenderName)) {
        this.toastr.warning('Please select Valid Gender Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    Swal.fire({
      title: 'Do you want to Save the Prefix Recode ',
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

    if (!this.vPrefixID) {

      var m_dataInsert = {
        "prefixMasterInsert": {
          "prefixName": this._PrefixService.myform.get("PrefixName").value || '',
          "sexID": parseInt(this._PrefixService.myform.get("SexID").value.GenderId) || 0,
          "isActive": Boolean(JSON.parse(this._PrefixService.myform.get("IsDeleted").value) || 0),
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._PrefixService.insertPrefixMaster(m_dataInsert).subscribe(response => {
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
        "prefixMasterUpdate": {
          "prefixID": this.vPrefixID,
          "prefixName": this._PrefixService.myform.get("PrefixName").value || '',
          "sexID": parseInt(this._PrefixService.myform.get("SexID").value.GenderId) || 0,
          "isActive": Boolean(JSON.parse(this._PrefixService.myform.get("IsDeleted").value) || 0),
        }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._PrefixService.updatePrefixMaster(m_dataUpdate).subscribe(response => {
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
    this._PrefixService.myform.reset({ IsDeleted: true });
    this.dialogRef.close();
  }
  onClear(){
    this._PrefixService.myform.reset({ IsDeleted: true });
  }

}
