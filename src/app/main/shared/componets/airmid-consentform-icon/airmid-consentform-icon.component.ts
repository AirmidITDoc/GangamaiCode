import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiCaller } from 'app/core/services/apiCaller';
import { fuseAnimations } from '@fuse/animations';
import { BaseFormControlComponent } from '../base-form-control-component';
import { AirmidConsentformComponent } from '../airmid-consentform/airmid-consentform.component';

@Component({
  selector: 'app-airmid-consentform-icon',
  templateUrl: './airmid-consentform-icon.component.html',
  styleUrls: ['./airmid-consentform-icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AirmidConsentformIconComponent {
  @Output() onCloseDialog = new EventEmitter<any>();
  @Input() Id: number = 0;
  @Input() refId: number = 0;
  @Input() opipId: number = 0;
  @Input() opipType: number = 0;
  @Input() title: string = '';
  @Input() patientName: string = '';
  @Input() labelType: string = '';

  constructor(public _matDialog: MatDialog, el: ElementRef) { }

  get computedTitle(): string {
    return this.patientName ? `${this.patientName} ${this.title}` : this.title;
  }


  onFiles() {
    const dialogRef = this._matDialog.open(
      AirmidConsentformComponent,
      {
        maxWidth: "90vw",
        maxHeight: '85%',
        width: '70%',
        data: { refId: this.refId, opipId: this.opipId, opipType: this.opipType, Id: this.Id,title: this.computedTitle,labelType:this.labelType }
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      this.onCloseDialog.emit(result);
    });
  }
}
