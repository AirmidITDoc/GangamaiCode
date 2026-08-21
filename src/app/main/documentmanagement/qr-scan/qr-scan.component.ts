import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as QRCode from 'qrcode';
import { MockDataService } from '../mock-data.service';
import { ZipService } from '../zip.service';
import { Patient } from 'app/core/models/documentmanagement/patient.model';

type ScanState = 'idle' | 'camera' | 'found' | 'not-found';

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.component.html',
  styleUrls: ['./qr-scan.component.scss'],
})
export class QrScanComponent implements OnDestroy {
  @ViewChild('readerEl') readerEl?: ElementRef<HTMLDivElement>;

  state: ScanState = 'idle';
  cameraError = '';
  foundPatient: Patient | null = null;
  lastRawValue = '';
  zipping = false;

  samplePatients: Patient[] = [];
  sampleQrUrls: Record<string, string> = {};

  private html5Qr: any = null;

  constructor(
    private data: MockDataService,
    private zipService: ZipService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.samplePatients = this.data.patients.slice(0, 4);
    this.samplePatients.forEach((p) => {
      QRCode.toDataURL(p.id, { margin: 1, width: 160, color: { dark: '#12283F', light: '#ffffff' } }).then(
        (url) => (this.sampleQrUrls[p.id] = url)
      );
    });
  }

  async startCamera(): Promise<void> {
    this.cameraError = '';
    this.state = 'camera';
    // Wait a tick so the #readerEl div is in the DOM before html5-qrcode attaches to it.
    await new Promise((r) => setTimeout(r, 0));
    try {
      // const { Html5Qrcode } = await import('html5-qrcode');
      // this.html5Qr = new Html5Qrcode('qr-reader');
      // const cameras = await Html5Qrcode.getCameras();
      // if (!cameras.length) throw new Error('No camera found on this device.');
      // await this.html5Qr.start(
      //   cameras[0].id,
      //   { fps: 10, qrbox: 240 },
      //   (decodedText: string) => this.handleDecoded(decodedText),
      //   () => {
      //     /* per-frame scan miss — ignore, this fires continuously */
      //   }
      // );
    } catch (err: any) {
      this.cameraError =
        err?.message ?? 'Could not access the camera. Check browser permissions or use image upload instead.';
      this.state = 'idle';
    }
  }

  async stopCamera(): Promise<void> {
    if (this.html5Qr) {
      try {
        await this.html5Qr.stop();
        this.html5Qr.clear();
      } catch {
        /* already stopped */
      }
    }
    if (this.state === 'camera') this.state = 'idle';
  }

  async onFileSelected(evt: Event): Promise<void> {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      // const { Html5Qrcode } = await import('html5-qrcode');
      const scannerId = 'qr-file-scratch';
      let scratch = document.getElementById(scannerId);
      if (!scratch) {
        scratch = document.createElement('div');
        scratch.id = scannerId;
        scratch.style.display = 'none';
        document.body.appendChild(scratch);
      }
      // const scanner = new Html5Qrcode(scannerId);
      // const text = await scanner.scanFile(file, false);
      // this.handleDecoded(text);
    } catch (err) {
      this.snackBar.open('Could not read a QR code from that image.', 'Dismiss', { duration: 3000 });
    }
  }

  simulateScan(): void {
    const random = this.data.patients[Math.floor(Math.random() * this.data.patients.length)];
    this.handleDecoded(random.id.toString());
  }

  scanSample(id: string): void {
    this.handleDecoded(id);
  }

  private handleDecoded(rawText: string): void {
    this.lastRawValue = rawText;
    const cleaned = rawText.replace(/^PATIENT[:=]/i, '').trim();
    const patient = this.data.getPatient(cleaned) ?? this.data.searchPatients(cleaned)[0] ?? null;
    void this.stopCamera();
    if (patient) {
      this.foundPatient = patient;
      this.state = 'found';
    } else {
      this.foundPatient = null;
      this.state = 'not-found';
    }
  }

  reset(): void {
    this.state = 'idle';
    this.foundPatient = null;
    this.lastRawValue = '';
    this.cameraError = '';
  }

  goToPatientRecord(): void {
    if (!this.foundPatient) return;
    this.router.navigate(['/patient-search'], { queryParams: { patientId: this.foundPatient.id } });
  }

  async quickDownloadZip(): Promise<void> {
    if (!this.foundPatient) return;
    this.zipping = true;
    try {
      const docs = this.data.getDocumentsForPatient(this.foundPatient.id.toString());
      await this.zipService.downloadPatientArchive(this.foundPatient, docs);
      this.snackBar.open(`ZIP ready — ${docs.length} files packed`, 'Dismiss', { duration: 3000 });
    } finally {
      this.zipping = false;
    }
  }

  ngOnDestroy(): void {
    void this.stopCamera();
  }
}
