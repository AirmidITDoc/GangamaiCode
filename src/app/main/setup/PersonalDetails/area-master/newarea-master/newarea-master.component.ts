import { Observable } from 'rxjs';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { AreaMasterService } from '../area-master.service';

@Component({
  selector: 'app-newarea-master',
  templateUrl: './newarea-master.component.html',
  styleUrls: ['./newarea-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewareaMasterComponent implements OnInit {

  vAreaId:any;
  vCityId:any;
  vAreaName:any;
  registerObj: any;
  vIsDeleted: any;
  filteredOptionsCity: Observable<string[]>;
  isCitySelected: boolean = false;
  cityList: any = [];
  stateList: any = [];
  optionsCity: any[] = [];

  constructor(
    public _AreaService: AreaMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewareaMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      debugger
      this.registerObj = this.data.Obj;
      console.log("RegisterObj:", this.registerObj)
      this.vAreaName = this.registerObj.AreaName;
      this.vAreaId = this.registerObj.AreaId;
      this.vCityId=this.registerObj.TalukaId;
      if (this.registerObj.IsDeleted == true) {
        this._AreaService.myform.get("IsDeleted").setValue(true)
      } else {
        this._AreaService.myform.get("IsDeleted").setValue(false)
      }
    }
    this.getcityList1();
  }

  getcityList1() {
    debugger
    this._AreaService.getCityMasterCombo().subscribe(data => {
      this.cityList = data;
      this.optionsCity = this.cityList.slice();
      this.filteredOptionsCity = this._AreaService.myform.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCity(value) : this.cityList.slice()),
      );

      if (this.data) {
        debugger
        const CValue = this.cityList.filter(item => item.CityId == this.registerObj.CITYID);
        console.log("CityId:",CValue)
        this._AreaService.myform.get('CityId').setValue(CValue[0]);
        this._AreaService.myform.updateValueAndValidity();      
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

    onSave() {
      if (this.vAreaName == '' || this.vAreaName == null || this.vAreaName == undefined) {
        this.toastr.warning('Please Enter Area  ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
        if (this.vCityId == '' || this.vCityId == null || this.vCityId == undefined) {
          this.toastr.warning('Please Select City  ', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if (this._AreaService.myform.get('CityId').value) {
          if(!this.cityList.find(item => item.CityId == this._AreaService.myform.get('CityId').value.CityId))
          {
            this.toastr.warning('Please select Valid City Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }
        } 
    
        Swal.fire({
          title: 'Do you want to Save the Area Recode ',
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
    
        if (!this.vAreaId) {
    
          var m_dataInsert = {
            "areaMasterInsert": {
              "areaName": this._AreaService.myform.get("AreaName").value || '',
              "talukaId":this._AreaService.myform.get("CityId").value.CityId || '',
              "addedBy": this.accountService.currentUserValue.user.id,
              "isDeleted": Boolean(JSON.parse(this._AreaService.myform.get("IsDeleted").value) || 0),
            }
          }
          console.log("insertJson:", m_dataInsert);
    
          this._AreaService.areaMasterInsert(m_dataInsert).subscribe(response => {
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
          },error => {
            this.toastr.error('Area Data not saved !, Please check API error..', 'Error !', {
             toastClass: 'tostr-tost custom-toast-error',
           });
         });
        }
        else {
          debugger
          var m_dataUpdate = {
            "areaMasterUpdate": {
              "areaId": this.vAreaId,
              "areaName": this._AreaService.myform.get("AreaName").value || '',
              "talukaId":this._AreaService.myform.get("CityId").value.CityId || '',
              "isDeleted": Boolean(JSON.parse(this._AreaService.myform.get("IsDeleted").value) || 0),
              "updatedBy": this.accountService.currentUserValue.user.id,
            }
          }
          console.log("UpdateJson:", m_dataUpdate);
    
          this._AreaService.areaMasterUpdate(m_dataUpdate).subscribe(response => {
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
          },error => {
            this.toastr.error('Area Data not saved !, Please check API error..', 'Error !', {
             toastClass: 'tostr-tost custom-toast-error',
           });
         });
        }
      }
  
    onClose() {
      this._AreaService.myform.reset({ IsDeleted: true });
      this.dialogRef.close();
    }
    onClear(){
      this._AreaService.myform.reset({ IsDeleted: true });
    }

}
