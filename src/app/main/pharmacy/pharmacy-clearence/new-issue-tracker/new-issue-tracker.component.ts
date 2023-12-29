import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PharmacyClearenceService } from '../pharmacy-clearence.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-issue-tracker',
  templateUrl: './new-issue-tracker.component.html',
  styleUrls: ['./new-issue-tracker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewIssueTrackerComponent implements OnInit {

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

  }
}
