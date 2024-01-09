import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PharmacyClearenceService } from '../pharmacy-clearence.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IssueTrackerList } from '../pharmacy-clearence.component';

@Component({
  selector: 'app-new-issue-tracker',
  templateUrl: './new-issue-tracker.component.html',
  styleUrls: ['./new-issue-tracker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewIssueTrackerComponent implements OnInit {
  registerObj = new IssueTrackerList({});
  IssueStatusList = [
    {  IssueStatusId: 1, name: "Working" },
    {  IssueStatusId: 2, name: "Open" },
    {  IssueStatusId: 3, name: "Close" },
  ];
   
  
  constructor(
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewIssueTrackerComponent>,
    public toastr : ToastrService,
    public _IssueTracker: PharmacyClearenceService,

  ) { }

  ngOnInit(): void {
    this.registerObj = this.data.Obj;
  }
  onClose() {
    this.dialogRef.close();
  }
  OnReset(){
    this._IssueTracker.userFormGroup.reset();
  }

  selectedImages: File[] = [];

  handleFileInput(files: FileList) {
    const file = files.item(0);
    this.selectedImages.push(file);
  }
 

  Onsave(){
    let IssueTrackerInsertObj = {};
    IssueTrackerInsertObj['IssueSummary'] = this._IssueTracker.userFormGroup.get('IssueSummary').value || '';
    IssueTrackerInsertObj['IssueDescription'] =  this._IssueTracker.userFormGroup.get('IssueDescription').value || '';
    IssueTrackerInsertObj['IssueStatus'] =  this._IssueTracker.userFormGroup.get('IssueStatus').value || '';
    IssueTrackerInsertObj['ImageName'] =  this._IssueTracker.userFormGroup.get('ImageName').value || '';
    IssueTrackerInsertObj['ImagePath'] =  this._IssueTracker.userFormGroup.get('ImagePath').value || '';
    IssueTrackerInsertObj['ImageUpload'] = this._IssueTracker.userFormGroup.get('ImageUpload').value || '';
    IssueTrackerInsertObj['IssueRaised'] = this._IssueTracker.userFormGroup.get('IssueRaised').value || '';
    IssueTrackerInsertObj['IssueAssigned'] =  this._IssueTracker.userFormGroup.get('IssueAssigned').value || '';
  

  let submitData = {
    "IssueTrackerInsertObj": IssueTrackerInsertObj,
  };
  console.log(submitData);
  this._IssueTracker.InsertIssueTracker(submitData).subscribe(response => {
    if (response) {
      this.toastr.success('Record Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      }); this._matDialog.closeAll();
     
     } 
     else {
      this.toastr.error('New Issue Tracker Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
     }
    
   },error => {
    this.toastr.error('New Issue Tracker Data not saved !, Please check API error..', 'Error !', {
     toastClass: 'tostr-tost custom-toast-error',
   });
 });
}

OnEdit(){
  let IssueTrackerUpdateObj = {};
  IssueTrackerUpdateObj['IssueSummary'] = this._IssueTracker.userFormGroup.get('IssueSummary').value || '';
  IssueTrackerUpdateObj['IssueDescription'] =  this._IssueTracker.userFormGroup.get('IssueDescription').value || '';
  IssueTrackerUpdateObj['IssueStatus'] =  this._IssueTracker.userFormGroup.get('IssueStatus').value || '';
  IssueTrackerUpdateObj['ImageName'] =  this._IssueTracker.userFormGroup.get('ImageName').value || '';
  IssueTrackerUpdateObj['ImagePath'] =  this._IssueTracker.userFormGroup.get('ImagePath').value || '';
  IssueTrackerUpdateObj['ImageUpload'] = this._IssueTracker.userFormGroup.get('ImageUpload').value || '';
  IssueTrackerUpdateObj['IssueRaised'] = this._IssueTracker.userFormGroup.get('IssueRaised').value || '';
  IssueTrackerUpdateObj['IssueAssigned'] =  this._IssueTracker.userFormGroup.get('IssueAssigned').value || '';


let submitData = {
  "IssueTrackerUpdateObj": IssueTrackerUpdateObj,
};
console.log(submitData);
this._IssueTracker.UpdateIssueTracker(submitData).subscribe(response => {
  if (response) {
    this.toastr.success('Record Saved Successfully.', 'Updated !', {
      toastClass: 'tostr-tost custom-toast-success',
    }); this._matDialog.closeAll();
   
   } 
   else {
    this.toastr.error('New Issue Tracker Data not Updated !, Please check API error..', 'Error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
   }
  
 },error => {
  this.toastr.error('New Issue Tracker Data not Updated !, Please check API error..', 'Error !', {
   toastClass: 'tostr-tost custom-toast-error',
 });
});
}


@ViewChild('ImageName') ImageName: ElementRef;
@ViewChild('ImagePath') ImagePath: ElementRef;
@ViewChild('ImageUpload') ImageUpload: ElementRef;
@ViewChild('IssueStatus') IssueStatus: ElementRef;
@ViewChild('IssueRaised') IssueRaised: ElementRef;
@ViewChild('IssueAssigned') IssueAssigned: ElementRef;
@ViewChild('IssueSummary') IssueSummary: ElementRef;
@ViewChild('IssueDescription') IssueDescription: ElementRef;

public onEnterImageName(event): void {
  if (event.which === 13) {
    this.ImagePath.nativeElement.focus();
  }
}
public onEnterImagePath(event): void {
  if (event.which === 13) {
    this.IssueStatus.nativeElement.focus();
  }
}
public onEnterIssueStatus(event): void {
  if (event.which === 13) {
    this.IssueRaised.nativeElement.focus();
  }
}

public onEnterIssueRaised(event): void {
  if (event.which === 13) {
    this.IssueAssigned.nativeElement.focus();
  }
}
public onEnterIssueAssigned(event): void {
  if (event.which === 13) {
    this.IssueSummary.nativeElement.focus();
  }
}
public onEnterIssueSummary(event): void {
  if (event.which === 13) {
    this.IssueDescription.nativeElement.focus();
  }
}
public onEnterIssueDescription(event): void {
  if (event.which === 13) {
    //this.IssueDescription.nativeElement.focus();
  
  }
}
}
