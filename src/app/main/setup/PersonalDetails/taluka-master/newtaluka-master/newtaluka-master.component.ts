import { Observable } from 'rxjs';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { TalukaMasterService } from '../taluka-master.service';

@Component({
  selector: 'app-newtaluka-master',
  templateUrl: './newtaluka-master.component.html',
  styleUrls: ['./newtaluka-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewtalukaMasterComponent implements OnInit {

    vTalukaId:any
    vCityId:any;
    vTalukaName:any;
    registerObj: any;
    vIsDeleted: any;
    filteredOptionsCity: Observable<string[]>;
    isCitySelected: boolean = false;
    cityList: any = [];
    optionsCity: any[] = [];
  constructor(
    public _TalukaService: TalukaMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewtalukaMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      debugger
      this.registerObj = this.data.Obj;
      console.log("RegisterObj:", this.registerObj)
      this.vTalukaName = this.registerObj.TalukaName;
      this.vTalukaId = this.registerObj.TalukaId;
      this.vCityId=this.registerObj.CityId;
      if (this.registerObj.IsDeleted == true) {
        this._TalukaService.myForm.get("IsDeleted").setValue(true)
      } else {
        this._TalukaService.myForm.get("IsDeleted").setValue(false)
      }
      
    }
    this.getcityList1();
  }

  getcityList1() {
    debugger
    this._TalukaService.getCityList().subscribe(data => {
      this.cityList = data;
      this.optionsCity = this.cityList.slice();
      this.filteredOptionsCity = this._TalukaService.myForm.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCity(value) : this.cityList.slice()),
      );

      if (this.data) {
        debugger
        const CValue = this.cityList.filter(item => item.CityId == this.registerObj.CityId);
        console.log("CityId:",CValue)
        this._TalukaService.myForm.get('CityId').setValue(CValue[0]);
        this._TalukaService.myForm.updateValueAndValidity();       
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
    if (this.vTalukaName == '' || this.vTalukaName == null || this.vTalukaName == undefined) {
      this.toastr.warning('Please Enter Taluka Name  ', 'Warning !', {
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
        if (this._TalukaService.myForm.get('CityId').value) {
          if(!this.cityList.find(item => item.CityId == this._TalukaService.myForm.get('CityId').value.CityId))
          {
            this.toastr.warning('Please select Valid City Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }
        } 
    
        Swal.fire({
          title: 'Do you want to Save the Taluka Recode ',
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
    
        if (!this.vTalukaId) {
    
          var m_dataInsert = {
            "talukaMasterInsert": {
              "talukaName": this._TalukaService.myForm.get("TalukaName").value || '',
              "cityId":this._TalukaService.myForm.get("CityId").value.CityId,
              "addedBy": this.accountService.currentUserValue.user.id,
              "isDeleted": Boolean(JSON.parse(this._TalukaService.myForm.get("IsDeleted").value) || 0),
            }
          }
          console.log("insertJson:", m_dataInsert);
    
          this._TalukaService.talukaMasterInsert(m_dataInsert).subscribe(response => {
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
            "talukaMasterUpdate": {
              "talukaId": this.vTalukaId,
              "talukaName": this._TalukaService.myForm.get("TalukaName").value || '',
              "cityId":this._TalukaService.myForm.get("CityId").value.CityId,
              "isDeleted": Boolean(JSON.parse(this._TalukaService.myForm.get("IsDeleted").value) || 0),
              "updatedBy": this.accountService.currentUserValue.user.id,
            }
          }
          console.log("UpdateJson:", m_dataUpdate);
    
          this._TalukaService.talukaMasterUpdate(m_dataUpdate).subscribe(response => {
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
        this._TalukaService.myForm.reset({ IsDeleted: true });
        this.dialogRef.close();
      }
      onClear(){
        this._TalukaService.myForm.reset({ IsDeleted: true });
      }
}
