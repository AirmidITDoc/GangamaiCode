import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewBedtransferComponent } from './new-bedtransfer/new-bedtransfer.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-bed-transfer',
  templateUrl: './bed-transfer.component.html',
  styleUrls: ['./bed-transfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BedTransferComponent implements OnInit {

  constructor( public _matDialog: MatDialog,) { }

  ngOnInit(): void {
  }



  bedTransfer() {
    const dialogRef = this._matDialog.open(NewBedtransferComponent,
      {
        maxWidth: "95vw",
        // maxHeight: "95vh", 
        height: '490px',
       // width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed - Insert Action', result);
      
    });
  }
}
