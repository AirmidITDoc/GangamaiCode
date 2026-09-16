import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DocumentFileModel } from 'app/core/models/documentmanagement/document.model';
import { Patient } from 'app/core/models/documentmanagement/patient.model';
import { DocumentmanagementService } from '../documentmanagement.service';
import { PreviewDialogComponent } from '../shared/components/preview-dialog/preview-dialog.component';
import { ZipService } from '../zip.service';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.scss'],
})
export class PatientSearchComponent implements OnInit {
  selectedPatient: Patient | null = null;
  patientDocs: DocumentFileModel[] = [];
  zipping = false;
  searchPatients(): void {
    this._service.searchPatient(this.patientQuery).subscribe((res) => {
      this.patientResults = res;
    });
  }
  pickPatient(p: Patient): void {
    this.selectedPatient = p;
    this.patientResults = [];
    this.patientQuery = '';
    this.fillDocs();
  }
  fillDocs(): void {
    this._service.getPatientFiles(this.selectedPatient.id).subscribe((res) => {
      this.patientDocs = res;
    });
  }

  patientQuery = '';
  patientResults: Patient[] = [];

  constructor(private _service: DocumentmanagementService,
    private zipService: ZipService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const pid = params.get('patientId');
      if (pid) {
      }
    });
  }

  clearSelection(): void {
    this.selectedPatient = null;
    this.patientDocs = [];
  }

  preview(doc: DocumentFileModel): void {
    this.dialog.open(PreviewDialogComponent, { data: doc, maxWidth: '95vw' });
  }

  downloadOne(doc: DocumentFileModel): void {
    this.zipService.downloadSingleDocument(doc);
  }

  async downloadAllZip(): Promise<void> {
    if (!this.selectedPatient || !this.patientDocs.length) return;
    this.zipping = true;
    try {
      await this.zipService.downloadPatientArchive(this.selectedPatient, this.patientDocs);
      this.snackBar.open(`ZIP ready — ${this.patientDocs.length} files packed`, 'Dismiss', { duration: 3000 });
    } finally {
      this.zipping = false;
    }
  }

  get groupedByCategory(): { path: string; docs: DocumentFileModel[] }[] {
    const map = new Map<string, DocumentFileModel[]>();
    for (const d of this.patientDocs) {
      const key = d.categoryName || 'Uncategorized';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return Array.from(map.entries()).map(([path, docs]) => ({ path, docs }));
  }
}
