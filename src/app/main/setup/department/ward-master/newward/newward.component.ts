import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { WardMasterService } from '../ward-master.service';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-newward',
  templateUrl: './newward.component.html',
  styleUrls: ['./newward.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewwardComponent implements OnInit {

  registerObj: any;
  vRoomName: any;
  vRoomId: any;
  vClassId: any
  vLocationid: any;
  isLocationSelected: boolean = false;
  isClassSelected: boolean = false;
  optionsSearchgroup: any[] = [];
  optionsSearchClass: any[] = [];
  filteredOptionsLocation: Observable<string[]>;
  filteredOptionsClass: Observable<string[]>;
  LocationcmbList: any = [];

  ClasscmbList: any = [];

  constructor(
    public _wardService: WardMasterService,
    public dialogRef: MatDialogRef<NewwardComponent>,
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
      this.vRoomName = this.registerObj.WardName;
      this.vRoomId = this.registerObj.WardId
      this.vLocationid = this.registerObj.LocationName;
      this.vClassId = this.registerObj.ClassName
      if (this.registerObj.IsActive == true) {
        this._wardService.myform.get("IsDeleted").setValue(true)
      } else {
        this._wardService.myform.get("IsDeleted").setValue(false)
      }
      if (this.registerObj.IsAvailible == true) {
        this._wardService.myform.get("IsAvailable").setValue(true)
      } else {
        this._wardService.myform.get("IsAvailable").setValue(false)
      }
    }

    this.getLocationNameCombo();
    this.getClassNameCombobox();

  }

  getOptionTextLoc(option) {
    debugger
    return option && option.LocationName ? option.LocationName : '';
  }

  getLocationNameCombo() {
    debugger
    this._wardService.getLocationMasterCombo().subscribe(data => {
      this.LocationcmbList = data;
      this.optionsSearchgroup = this.LocationcmbList.slice();
      this.filteredOptionsLocation = this._wardService.myform.get('LocationId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filtersearchlocation(value) : this.LocationcmbList.slice()),
      );
      if (this.data) {
        debugger
        const DValue = this.LocationcmbList.filter(item => item.LocationName == this.registerObj.LocationName);
        console.log("LocationName:", DValue)
        this._wardService.myform.get('LocationId').setValue(DValue[0]);
        this._wardService.myform.updateValueAndValidity();
        return;
      }
    });
  }

  private _filtersearchlocation(value: any): string[] {
    debugger
    if (value) {
      const filterValue = value && value.LocationName ? value.LocationName.toLowerCase() : value.toLowerCase();
      return this.LocationcmbList.filter(option => option.LocationName.toLowerCase().includes(filterValue));
    }
  }
  // class dropdown
  getOptionTextClass(option) {
    debugger
    return option && option.ClassName ? option.ClassName : '';
  }

  getClassNameCombobox() {
    debugger
    this._wardService.getClassMasterCombo().subscribe(data => {
      this.ClasscmbList = data;
      this.optionsSearchClass = this.ClasscmbList.slice();
      this.filteredOptionsClass = this._wardService.myform.get('ClassId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filtersearchclass(value) : this.ClasscmbList.slice()),
      );
      if (this.data) {
        debugger
        const DValue = this.ClasscmbList.filter(item => item.ClassName == this.registerObj.ClassName);
        console.log("ClassId:", DValue)
        this._wardService.myform.get('ClassId').setValue(DValue[0]);
        this._wardService.myform.updateValueAndValidity();
        return;
      }
    });
  }

  private _filtersearchclass(value: any): string[] {
    debugger
    if (value) {
      const filterValue = value && value.ClassName ? value.ClassName.toLowerCase() : value.toLowerCase();
      return this.ClasscmbList.filter(option => option.ClassName.toLowerCase().includes(filterValue));
    }
  }

  onSave() {
    if (this.vRoomName == '' || this.vRoomName == null || this.vRoomName == undefined) {
      this.toastr.warning('Please enter Room Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (this.vLocationid == '' || this.vLocationid == null || this.vLocationid == undefined) {
      this.toastr.warning('Please select location ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._wardService.myform.get('LocationId').value) {
      if (!this.LocationcmbList.find(item => item.LocationName == this._wardService.myform.get('LocationId').value.LocationName)) {
        this.toastr.warning('Please select Valid Location Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.vClassId == '' || this.vClassId == null || this.vClassId == undefined) {
      this.toastr.warning('Please select Class ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._wardService.myform.get('ClassId').value) {
      if (!this.ClasscmbList.find(item => item.ClassName == this._wardService.myform.get('ClassId').value.ClassName)) {
        this.toastr.warning('Please select Valid Class Name', 'Warning !', {
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
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 

    if(!this.vRoomId){

      var m_dataInsert={
        "wardMasterInsert": {
          "roomName_1": this._wardService.myform.get("RoomName").value || '',
          "roomType_2":0,
          "locationId_3": parseInt(this._wardService.myform.get("LocationId").value.LocationId).toString(),
          "isAvailible_4":Boolean(JSON.parse(this._wardService.myform.get("IsAvailable").value) || 0),
          "isActive_5": Boolean(JSON.parse(this._wardService.myform.get("IsDeleted").value) || 0),
          "classId": parseInt(this._wardService.myform.get("ClassId").value.ClassId).toString()
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._wardService.wardMasterInsert(m_dataInsert).subscribe(response =>{
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
          "wardMasterUpdate": {
            "roomId_1":this.vRoomId,
            "roomName_2": this._wardService.myform.get("RoomName").value || '',
            "roomType_3":0,
            "locationId_4": parseInt(this._wardService.myform.get("LocationId").value.LocationId),
            // "isAvailible_4":Boolean(JSON.parse(this._wardService.myform.get("IsAvailable").value) || 0),
            "isActive_5": Boolean(JSON.parse(this._wardService.myform.get("IsDeleted").value) || 0),
            "classID": parseInt(this._wardService.myform.get("ClassId").value.ClassId)
          }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._wardService.wardMasterUpdate(m_dataUpdate).subscribe(response =>{
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
    this._wardService.myform.reset({
      IsDeleted: true,
      IsAvailable: true
    });
    this.dialogRef.close();
  }

}
