import { Injectable } from '@angular/core';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { HospitalDocument } from 'app/core/models/documentmanagement/document.model';
import { Patient } from 'app/core/models/documentmanagement/patient.model';

@Injectable({ providedIn: 'root' })
export class ZipService {
  /**
   * Builds a mock file body for a document so the demo produces a real,
   * openable placeholder file for every record (no backend/file storage exists yet).
   */
  buildPlaceholderContent(doc: HospitalDocument): string {
    return [
      `HOSPITAL DOCUMENT MANAGEMENT — DEMO FILE`,
      `================================================`,
      `Title        : ${doc.title}`,
      `Patient      : ${doc.patientName} (${doc.patientId})`,
      `Category     : ${doc.categoryPath.join(' / ')}`,
      `File type    : ${doc.fileKind.toUpperCase()}`,
      `Uploaded by  : ${doc.uploadedBy}`,
      `Uploaded on  : ${new Date(doc.uploadedOn).toLocaleString()}`,
      `Tags         : ${doc.tags.join(', ') || '—'}`,
      ``,
      `This is a placeholder generated for the UI-only prototype.`,
      `Wire this service up to your document storage API to embed the real file bytes.`,
    ].join('\n');
  }

  async downloadPatientArchive(patient: Patient, docs: HospitalDocument[]): Promise<void> {
    const zip = new JSZip();
    const root = zip.folder(`${patient.name.replace(/\s+/g, '_')}_${patient.id}`);
    const manifestRows = ['Title,Category,FileType,SizeKB,UploadedOn'];

    docs.forEach((doc) => {
      const folderPath = doc.categoryPath.join('/');
      const folder = root?.folder(folderPath);
      folder?.file(doc.fileName + '.txt', this.buildPlaceholderContent(doc));
      manifestRows.push(
        `"${doc.title}","${doc.categoryPath.join(' > ')}",${doc.fileKind},${doc.fileSizeKb},${doc.uploadedOn}`
      );
    });

    root?.file('_manifest.csv', manifestRows.join('\n'));

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${patient.id}_documents.zip`);
  }

  async downloadSingleDocument(doc: HospitalDocument): Promise<void> {
    const blob = new Blob([this.buildPlaceholderContent(doc)], { type: 'text/plain' });
    saveAs(blob, doc.fileName + '.txt');
  }
}
