import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-bedtransfer',
  templateUrl: './new-bedtransfer.component.html',
  styleUrls: ['./new-bedtransfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewBedtransferComponent implements OnInit {

  constructor(  private dialogRef: MatDialogRef<NewBedtransferComponent>,) { }

  ngOnInit(): void {
  }
  onClose() {
    // this._IpSearchListService.myRefundAdvanceForm.reset();
    // this._matDialog.closeAll();

    this.dialogRef.close();
  }
}
