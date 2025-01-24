import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { BedMasterService } from '../bed-master.service';

@Component({
  selector: 'app-newbed',
  templateUrl: './newbed.component.html',
  styleUrls: ['./newbed.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewbedComponent implements OnInit {

  registerObj: any;
  vBedName: any;
  vBedId: any;
  vRoomId:any;
  isRoomSelected:boolean=false;  
  optionsSearchRoom: any[] = [];
  filteredOptionsRoom: Observable<string[]>;
  RoomcmbList: any = [];

  constructor(
    public _bedService: BedMasterService,
    public dialogRef: MatDialogRef<NewbedComponent>,
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
      this.vBedName = this.registerObj.BedName;
      this.vRoomId = this.registerObj.RoomId
      this.vBedId = this.registerObj.BedId
      if (this.registerObj.IsActive == true) {
        this._bedService.myform.get("IsDeleted").setValue(true)
      } else {
        this._bedService.myform.get("IsDeleted").setValue(false)
      }
      if (this.registerObj.IsAvailible == true) {
        this._bedService.myform.get("IsAvailable").setValue(true)
      } else {
        this._bedService.myform.get("IsAvailable").setValue(false)
      }
    }
    this.getWardNameCombobox();
  }

  getOptionTextRoom(option) {
    debugger
    return option && option.RoomName ? option.RoomName : '';
  }

  getWardNameCombobox() {
    debugger
    this._bedService.getWardMasterCombo().subscribe(data => {
      this.RoomcmbList = data;
      this.optionsSearchRoom = this.RoomcmbList.slice();
      this.filteredOptionsRoom = this._bedService.myform.get('RoomId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filtersearchlocation(value) : this.RoomcmbList.slice()),
      );
      if (this.data) {
        debugger
        const DValue = this.RoomcmbList.filter(item => item.RoomName == this.registerObj.RoomName);
        console.log("RoomId:", DValue)
        this._bedService.myform.get('RoomId').setValue(DValue[0]);
        this._bedService.myform.updateValueAndValidity();
        return;
      }
    });
  }

  private _filtersearchlocation(value: any): string[] {
    debugger
    if (value) {
      const filterValue = value && value.RoomName ? value.RoomName.toLowerCase() : value.toLowerCase();
      return this.RoomcmbList.filter(option => option.RoomName.toLowerCase().includes(filterValue));
    }
  }
 onSave() {
     if (this.vBedName == '' || this.vBedName == null || this.vBedName == undefined) {
       this.toastr.warning('Please enter Bed Name  ', 'Warning !', {
         toastClass: 'tostr-tost custom-toast-warning',
       });
       return;
     }
 
     if (this.vRoomId == '' || this.vRoomId == null || this.vRoomId == undefined) {
       this.toastr.warning('Please select location ', 'Warning !', {
         toastClass: 'tostr-tost custom-toast-warning',
       });
       return;
     }
     if (this._bedService.myform.get('RoomId').value) {
       if (!this.RoomcmbList.find(item => item.RoomName == this._bedService.myform.get('RoomId').value.RoomName)) {
         this.toastr.warning('Please select Valid Room Name', 'Warning !', {
           toastClass: 'tostr-tost custom-toast-warning',
         });
         return;
       }
     }
 
     Swal.fire({
       title: 'Do you want to Save the Ward Recode ',
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

    if(!this.vBedId){

      var m_dataInsert={
        "bedMasterInsert": {
          "bedName_1": this._bedService.myform.get("BedName").value || '',
          "roomId_2": parseInt(this._bedService.myform.get("RoomId").value.RoomId).toString(),
          "isAvailible_3":Boolean(JSON.parse(this._bedService.myform.get("IsAvailable").value) || 0),
          "isActive_4": Boolean(JSON.parse(this._bedService.myform.get("IsDeleted").value) || 0)
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._bedService.bedMasterInsert(m_dataInsert).subscribe(response =>{
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
    else{
      debugger
      var m_dataUpdate={
          "bedMasterUpdate": {
            "bedID":this.vBedId,
            "bedName": this._bedService.myform.get("BedName").value || '',
            "roomId": parseInt(this._bedService.myform.get("RoomId").value.RoomId).toString(),
            "isAvailable":Boolean(JSON.parse(this._bedService.myform.get("IsAvailable").value) || 0),
            "isDeleted": Boolean(JSON.parse(this._bedService.myform.get("IsDeleted").value) || 0),
            "updatedBy":this._loggedService.currentUserValue.user.id
          }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._bedService.bedMasterUpdate(m_dataUpdate).subscribe(response =>{
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

  onClose(){
    this._bedService.myform.reset({ 
      IsDeleted: true,
      IsAvailable: true
     });
     
    this.dialogRef.close();
  }

}
