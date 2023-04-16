import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ProductTypeFormComponent } from './product-type-form/product-type-form.component';
import { GroupMasterService } from './product-type-master.service';

@Component({
  selector: 'app-product-type-master',
  templateUrl: './product-type-master.component.html',
  styleUrls: ['./product-type-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class ProductTypeMasterComponent implements OnInit {

  dialogRef: any;
  hasSelectedContacts: boolean;
  searchInput: FormControl;
  

  constructor(
    private _matDialog: MatDialog,
    private _contactsService: GroupMasterService,
    private _fuseSidebarService: FuseSidebarService
  ) {
      // Set the defaults
      this.searchInput = new FormControl('');

   }

  ngOnInit(): void {
  }

  newContact(): void {
    this.dialogRef = this._matDialog.open(ProductTypeFormComponent, {
      maxWidth: "100vw",
      maxHeight: "100vh",
      height: "40%",
      width: "40%",

        // panelClass: 'contact-form-dialog',
        data: {
            action: 'new'
        }
    });

    this.dialogRef.afterClosed()
        .subscribe((response: FormGroup) => {
            if (!response) {
                return;
            }

            // this._contactsService.updateContact(response.getRawValue());
        });
}
toggleSidebar(name): void {
  this._fuseSidebarService.getSidebar(name).toggleOpen();
}

}
