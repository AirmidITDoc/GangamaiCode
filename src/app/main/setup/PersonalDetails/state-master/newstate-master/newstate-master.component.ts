import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { StateMasterService } from '../state-master.service';


@Component({
  selector: 'app-newstate-master',
  templateUrl: './newstate-master.component.html',
  styleUrls: ['./newstate-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewstateMasterComponent implements OnInit {

  registerObj: any;
  vIsDeleted: any;
  vStateId:any;
  vStateName:any;
  vCountryId:any;
  isCountrySelected: boolean = false;
  optionsSearchgroup: any[] = [];
  filteredOptionsCountry: Observable<string[]>;
  CountrycmbList: any = [];

  constructor(
    public _stateService: StateMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewstateMasterComponent>,
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
      this.vStateName = this.registerObj.StateName;
      this.vStateId = this.registerObj.StateId;
      // this.vSexID=this.GenderName;
      if (this.registerObj.Isdeleted == true) {
        this._stateService.myform.get("IsDeleted").setValue(true)
      } else {
        this._stateService.myform.get("IsDeleted").setValue(false)
      }
    }
    this.getCountryNameCombobox();
  }

  getOptionTextCountry(option) {
      return option && option.CountryName ? option.CountryName : '';
    }
  
    getCountryNameCombobox() {
      debugger
      this._stateService.getCountryMasterCombo().subscribe(data => {
        this.CountrycmbList = data;
        this.optionsSearchgroup = this.CountrycmbList.slice();
        this.filteredOptionsCountry = this._stateService.myform.get('CountryId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filtersearchCountry(value) : this.CountrycmbList.slice()),
        );
        if (this.data) {
          debugger
          const DValue = this.CountrycmbList.filter(item => item.CountryName == this.registerObj.CountryName);
          console.log("GenderName:", DValue)
          this._stateService.myform.get('CountryId').setValue(DValue[0]);
          this._stateService.myform.updateValueAndValidity();
          return;
        }
      });
    }
  
    private _filtersearchCountry(value: any): string[] {
  
      if (value) {
        const filterValue = value && value.CountryName ? value.CountryName.toLowerCase() : value.toLowerCase();
        return this.CountrycmbList.filter(option => option.CountryName.toLowerCase().includes(filterValue));
      }
    }
  
    onSave() {
      if (this.vStateName == '' || this.vStateName == null || this.vStateName == undefined) {
        this.toastr.warning('Please Enter StateName  ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this.vCountryId == '' || this.vCountryId == null || this.vCountryId == undefined) {
        this.toastr.warning('Please select Country ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this._stateService.myform.get('CountryId').value) {
        if (!this.CountrycmbList.find(item => item.CountryName == this._stateService.myform.get('CountryId').value.CountryName)) {
          this.toastr.warning('Please select Valid Country Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      }
  
      Swal.fire({
        title: 'Do you want to Save the Country Recode ',
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
  
      if (!this.vStateId) {
  
        var m_dataInsert = {
          "stateMasterInsert": {
            "stateName": this._stateService.myform.get("StateName").value || '',
            "countryId": parseInt(this._stateService.myform.get("CountryId").value.CountryId) || 0,
            "addedBy":this.accountService.currentUserValue.user.id,
            "isDeleted": Boolean(JSON.parse(this._stateService.myform.get("IsDeleted").value) || 0),
          }
        }
        console.log("insertJson:", m_dataInsert);
  
        this._stateService.stateMasterInsert(m_dataInsert).subscribe(response => {
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
          "stateMasterUpdate": {
            "stateId": this.vStateId,
            "stateName": this._stateService.myform.get("StateName").value || '',
            "countryId": parseInt(this._stateService.myform.get("CountryId").value.CountryId) || 0,
            "addedBy":this.accountService.currentUserValue.user.id,
            "isDeleted": Boolean(JSON.parse(this._stateService.myform.get("IsDeleted").value) || 0),
          }
        }
        console.log("UpdateJson:", m_dataUpdate);
  
        this._stateService.stateMasterUpdate(m_dataUpdate).subscribe(response => {
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
      this._stateService.myform.reset({ IsDeleted: true });
      this.dialogRef.close();
    }
    onClear(){
      this._stateService.myform.reset({ IsDeleted: true });
    }

}
