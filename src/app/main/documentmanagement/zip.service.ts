import { Injectable } from '@angular/core';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DocumentFileModel } from 'app/core/models/documentmanagement/document.model';
import { Patient } from 'app/core/models/documentmanagement/patient.model';

@Injectable({ providedIn: 'root' })
export class ZipService {
  /**
   * Builds a mock file body for a document so the demo produces a real,
   * openable placeholder file for every record (no backend/file storage exists yet).
   */
  buildPlaceholderContent(doc: DocumentFileModel): string {
    return [
      `HOSPITAL DOCUMENT MANAGEMENT — DEMO FILE`,
      `================================================`,
      `Title        : ${doc.orgFileName}`,
      `Patient      : ${doc.savedFileName} (${doc.admissionId})`,
      `Tags         : ${doc.fileTags.split(',').join(', ') || '—'}`,
      ``,
      `This is a placeholder generated for the UI-only prototype.`,
      `Wire this service up to your document storage API to embed the real file bytes.`,
    ].join('\n');
  }

  async downloadPatientArchive(patient: Patient, docs: DocumentFileModel[]): Promise<void> {
    const zip = new JSZip();
    const root = zip.folder(`${patient.firstName.replace(/\s+/g, '_')}_${patient.id}`);
    const manifestRows = ['Title,Category,FileType,SizeKB,UploadedOn'];

    docs.forEach((doc) => {
      const folderPath = doc.docCatId.toString();
      const folder = root?.folder(folderPath);
      folder?.file(doc.orgFileName + '.txt', this.buildPlaceholderContent(doc));
      manifestRows.push(
        `"${doc.orgFileName}","${doc.docCatId}"`
      );
    });

    root?.file('_manifest.csv', manifestRows.join('\n'));

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${patient.id}_documents.zip`);
  }

  async downloadSingleDocument(doc: DocumentFileModel): Promise<void> {
    const blob = new Blob([this.buildPlaceholderContent(doc)], { type: 'text/plain' });
    saveAs(blob, doc.orgFileName + '.txt');
  }
}
