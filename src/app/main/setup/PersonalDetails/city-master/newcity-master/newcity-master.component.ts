import { Observable } from 'rxjs';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { CityMasterService } from '../city-master.service';

@Component({
  selector: 'app-newcity-master',
  templateUrl: './newcity-master.component.html',
  styleUrls: ['./newcity-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewcityMasterComponent implements OnInit {

  vId:any
  vCityIds:any;
  vCityName:any;
  registerObj: any;
  vIsDeleted: any;
  filteredOptionsCity: Observable<string[]>;
  isCitySelected: boolean = false;
  cityList: any = [];
  stateList: any = [];
  optionsCity: any[] = [];
  selectedState = "";
  selectedStateID: any;

  constructor(
    public _cityService: CityMasterService,
    private accountService: AuthenticationService,
     public dialogRef: MatDialogRef<NewcityMasterComponent>,
     public _matDialog: MatDialog,
     @Inject(MAT_DIALOG_DATA) public data: any,
     public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      debugger
      this.registerObj = this.data.Obj;
      console.log("RegisterObj:", this.registerObj)
      this.vCityName = this.registerObj.CITYNAME;
      this.vId = this.registerObj.CITYID;
      if (this.registerObj.ISDELETED == true) {
        this._cityService.myform.get("IsDeleted").setValue(true)
      } else {
        this._cityService.myform.get("IsDeleted").setValue(false)
      }
      
    this.onChangeCityList(this.registerObj.CITYID);
    }
    this.getcityList1();
  }

  getcityList1() {
    debugger
    this._cityService.getCityList().subscribe(data => {
      this.cityList = data;
      this.optionsCity = this.cityList.slice();
      this.filteredOptionsCity = this._cityService.myform.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCity(value) : this.cityList.slice()),
      );

      if (this.data) {
        debugger
        const CValue = this.cityList.filter(item => item.CityId == this.registerObj.CITYID);
        console.log("CityId:",CValue)
        this._cityService.myform.get('CityId').setValue(CValue[0]);
        this._cityService.myform.updateValueAndValidity();
        this.onChangeCityList(CValue[0]);        
      }
      if (this.registerObj) {
        debugger
        const CValue = this.cityList.filter(item => item.CityId == this.registerObj.CITYID);
        console.log("CityId:",CValue)
        this._cityService.myform.get('CityId').setValue(CValue[0]);
        this._cityService.myform.updateValueAndValidity();
        this.onChangeCityList(CValue[0]);        
      }
    });
  }

  private _filterCity(value: any): string[] {
    if (value) {
      const filterValue = value && value.CityName ? value.CityName.toLowerCase() : value.toLowerCase();
      return this.optionsCity.filter(option => option.CityName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextCity1(option) {
    return option && option.CityName ? option.CityName : '';
  }

  onChangeCityList(CityObj) {
    debugger
    if (CityObj) {
      this._cityService.getStateList(CityObj.CityId).subscribe((data: any) => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;
        this.selectedStateID = this.stateList[0].StateId;
        this._cityService.myform.get('StateId').setValue(this.stateList[0]);
        this.selectedStateID = this.stateList[0].StateId;
      });      
    }
    else {
      this.selectedState = null;
      this.selectedStateID = null;
    }
  }

  onSave() {
      if (this.vCityIds == '' || this.vCityIds == null || this.vCityIds == undefined) {
        this.toastr.warning('Please Select City  ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this._cityService.myform.get('CityId').value) {
        if(!this.cityList.find(item => item.CityId == this._cityService.myform.get('CityId').value.CityId))
        {
          this.toastr.warning('Please select Valid City Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      } 
  
      Swal.fire({
        title: 'Do you want to Save the City Recode ',
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
  
      if (!this.vId) {
  
        var m_dataInsert = {
          "cityMasterInsert": {
            "cityName": this._cityService.myform.get("CityId").value.CityName || '',
            "stateId":this._cityService.myform.get("StateId").value.StateId,
            "addedBy": this.accountService.currentUserValue.user.id,
            "isDeleted": Boolean(JSON.parse(this._cityService.myform.get("IsDeleted").value) || 0),
          }
        }
        console.log("insertJson:", m_dataInsert);
  
        this._cityService.cityMasterInsert(m_dataInsert).subscribe(response => {
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
          "cityMasterUpdate": {
            "cityId": this.vId,
            "cityName": this._cityService.myform.get("CityId").value.CityName || '',
            "stateId":this._cityService.myform.get("StateId").value.StateId,
            "isDeleted": Boolean(JSON.parse(this._cityService.myform.get("IsDeleted").value) || 0),
            "updatedBy": this.accountService.currentUserValue.user.id,
          }
        }
        console.log("UpdateJson:", m_dataUpdate);
  
        this._cityService.cityMasterUpdate(m_dataUpdate).subscribe(response => {
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
    this._cityService.myform.reset({ IsDeleted: true });
    this.dialogRef.close();
  }
  onClear(){
    this._cityService.myform.reset({ IsDeleted: true });
  }

}
