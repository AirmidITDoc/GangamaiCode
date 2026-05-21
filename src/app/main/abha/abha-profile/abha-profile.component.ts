import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbhaProfile } from '../abha-model';
import { AbhaService } from '../abha.service';

@Component({
  selector: 'app-abha-profile',
  templateUrl: './abha-profile.component.html',
  styleUrls: ['./abha-profile.component.scss'],
})
export class AbhaProfileComponent implements OnInit {
  profile: AbhaProfile | null = null;
  token = '';
  qrSrc: SafeUrl | null = null;
  loadingQr = false;
  downloading = false;

  constructor(
    private abha: AbhaService,
    private snack: MatSnackBar,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = sessionStorage.getItem('abha_token') || '';
    const cached = sessionStorage.getItem('abha_profile');
    if (cached) this.profile = JSON.parse(cached);

    if (!this.token) {
      this.router.navigate(['/abha/verify']);
      return;
    }

    // refresh from API (cached might be stale)
    this.abha.getProfile(this.token).subscribe({
      next: (p) => {
        this.profile = p;
        sessionStorage.setItem('abha_profile', JSON.stringify(p));
      },
      error: () => {
        /* keep cached, silently */
      },
    });

    this.loadQr();
  }

  loadQr() {
    this.loadingQr = true;
    this.abha.getQr(this.token).subscribe({
      next: (r) => {
        this.qrSrc = this.sanitizer.bypassSecurityTrustUrl(
          r.qr.startsWith('data:') ? r.qr : `data:image/png;base64,${r.qr}`
        );
        this.loadingQr = false;
      },
      error: () => {
        this.loadingQr = false;
        this.snack.open('Failed to load QR', 'OK', { duration: 3000 });
      },
    });
  }

  downloadCard() {
    this.downloading = true;
    this.abha.downloadCard(this.token).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ABHA-${this.profile?.ABHANumber || 'card'}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.downloading = false;
      },
      error: () => {
        this.downloading = false;
        this.snack.open('Download failed', 'OK', { duration: 3000 });
      },
    });
  }

  copyAbha() {
    if (!this.profile?.ABHANumber) return;
    navigator.clipboard.writeText(this.profile.ABHANumber);
    this.snack.open('ABHA number copied', 'OK', { duration: 1500 });
  }

  logout() {
    sessionStorage.removeItem('abha_token');
    sessionStorage.removeItem('abha_profile');
    this.router.navigate(['/abha/verify']);
  }

  get fullName(): string {
    if (!this.profile) return '';
    return [this.profile.firstName, this.profile.middleName, this.profile.lastName]
      .filter(Boolean)
      .join(' ');
  }

  get photoSrc(): string | null {
    if (!this.profile?.photo) return null;
    return this.profile.photo.startsWith('data:')
      ? this.profile.photo
      : `data:image/png;base64,${this.profile.photo}`;
  }
}
