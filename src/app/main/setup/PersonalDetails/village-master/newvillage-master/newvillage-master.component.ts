import { Observable } from 'rxjs';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { VillageMasterService } from '../village-master.service';


@Component({
  selector: 'app-newvillage-master',
  templateUrl: './newvillage-master.component.html',
  styleUrls: ['./newvillage-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewvillageMasterComponent implements OnInit {

  vVillageId:any
  vTalukaId:any;
  vVillageName:any;
  registerObj: any;
  vIsDeleted: any;
  filteredOptionsTaluka: Observable<string[]>;
  isTalukaSelected: boolean = false;
  TalukaList: any = [];
  stateList: any = [];
  optionsTaluka: any[] = [];

  constructor(
    public _VillageService: VillageMasterService,
    private accountService: AuthenticationService,
     public dialogRef: MatDialogRef<NewvillageMasterComponent>,
     public _matDialog: MatDialog,
     @Inject(MAT_DIALOG_DATA) public data: any,
     public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      debugger
      this.registerObj = this.data.Obj;
      console.log("RegisterObj:", this.registerObj)
      this.vVillageName = this.registerObj.VillageName;
      this.vVillageId = this.registerObj.VillageId;
      if (this.registerObj.IsDeleted == true) {
        this._VillageService.myForm.get("IsDeleted").setValue(true)
      } else {
        this._VillageService.myForm.get("IsDeleted").setValue(false)
      }
      
    }
    this.getTalukaMasterCombo();
  }

  getTalukaMasterCombo() {
    debugger
    this._VillageService.getTalukaMasterCombo().subscribe(data => {
      this.TalukaList = data;
      this.optionsTaluka = this.TalukaList.slice();
      this.filteredOptionsTaluka = this._VillageService.myForm.get('TalukaId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterTaluka(value) : this.TalukaList.slice()),
      );

      if (this.data) {
        debugger
        const CValue = this.TalukaList.filter(item => item.TalukaId == this.registerObj.TalukaId);
        console.log("TalukaId:",CValue)
        this._VillageService.myForm.get('TalukaId').setValue(CValue[0]);
        this._VillageService.myForm.updateValueAndValidity();      
      }
    });
  }

  private _filterTaluka(value: any): string[] {
    if (value) {
      const filterValue = value && value.TalukaName ? value.TalukaName.toLowerCase() : value.toLowerCase();
      return this.TalukaList.filter(option => option.TalukaName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextTaluka(option) {
    return option && option.TalukaName ? option.TalukaName : '';
  }

  onSave() {
    if (this.vVillageName == '' || this.vVillageName == null || this.vVillageName == undefined) {
      this.toastr.warning('Please Enter Village  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
        if (this.vTalukaId == '' || this.vTalukaId == null || this.vTalukaId == undefined) {
          this.toastr.warning('Please Select Taluka  ', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if (this._VillageService.myForm.get('TalukaId').value) {
          if(!this.TalukaList.find(item => item.TalukaId == this._VillageService.myForm.get('TalukaId').value.TalukaId))
          {
            this.toastr.warning('Please select Valid Taluka Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }
        } 
    
        Swal.fire({
          title: 'Do you want to Save the Village Recode ',
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

      onSubmit(){
debugger
if (!this.vVillageId) {
  
  var m_dataInsert = {
    "villageMasterInsert": {
      "villageName": this._VillageService.myForm.get("VillageName").value || '',
      "talukaId":this._VillageService.myForm.get("TalukaId").value.TalukaId,
      "isdeleted": Boolean(JSON.parse(this._VillageService.myForm.get("IsDeleted").value) || 0),
      "addedBy": this.accountService.currentUserValue.user.id,
    }
  }
  console.log("insertJson:", m_dataInsert);

  this._VillageService.villageMasterInsert(m_dataInsert).subscribe(response => {
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
    this.toastr.error('Village Data not saved !, Please check API error..', 'Error !', {
     toastClass: 'tostr-tost custom-toast-error',
   });
 });
}
else {
  debugger
  var m_dataUpdate = {
    "villageMasterUpdate": {
      "villageId": this.vVillageId,
      "villageName": this._VillageService.myForm.get("VillageName").value || '',
      "talukaId":this._VillageService.myForm.get("TalukaId").value.TalukaId,
      "isDeleted": Boolean(JSON.parse(this._VillageService.myForm.get("IsDeleted").value) || 0),
      "updatedBy": this.accountService.currentUserValue.user.id,
    }
  }
  console.log("UpdateJson:", m_dataUpdate);

  this._VillageService.villageMasterUpdate(m_dataUpdate).subscribe(response => {
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
    this.toastr.error('Village Data not saved !, Please check API error..', 'Error !', {
     toastClass: 'tostr-tost custom-toast-error',
   });
 });
}
      }

  onClose() {
    this._VillageService.myForm.reset({ IsDeleted: true });
    this.dialogRef.close();
  }
  onClear(){
    this._VillageService.myForm.reset({ IsDeleted: true });
  }
}
