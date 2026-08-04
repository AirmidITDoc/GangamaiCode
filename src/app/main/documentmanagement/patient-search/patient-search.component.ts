import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HospitalDocument } from 'app/core/models/documentmanagement/document.model';
import { MockDataService } from '../mock-data.service';
import { ZipService } from '../zip.service';
import { PreviewDialogComponent } from '../shared/components/preview-dialog/preview-dialog.component';
import { Patient } from 'app/core/models/documentmanagement/patient.model';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.scss'],
})
export class PatientSearchComponent implements OnInit {
  query = '';
  results: Patient[] = [];
  selectedPatient: Patient | null = null;
  patientDocs: HospitalDocument[] = [];
  zipping = false;

  constructor(
    private data: MockDataService,
    private zipService: ZipService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const pid = params.get('patientId');
      if (pid) {
        const p = this.data.getPatient(pid);
        if (p) this.selectPatient(p);
      }
    });
  }

  search(): void {
    this.results = this.data.searchPatients(this.query);
  }

  selectPatient(p: Patient): void {
    this.selectedPatient = p;
    this.patientDocs = this.data.getDocumentsForPatient(p.id);
    this.results = [];
    this.query = '';
  }

  clearSelection(): void {
    this.selectedPatient = null;
    this.patientDocs = [];
  }

  preview(doc: HospitalDocument): void {
    this.dialog.open(PreviewDialogComponent, { data: doc, maxWidth: '95vw' });
  }

  downloadOne(doc: HospitalDocument): void {
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

  get groupedByCategory(): { path: string; docs: HospitalDocument[] }[] {
    const map = new Map<string, HospitalDocument[]>();
    for (const d of this.patientDocs) {
      const key = d.categoryPath.join(' / ');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return Array.from(map.entries()).map(([path, docs]) => ({ path, docs }));
  }
}
