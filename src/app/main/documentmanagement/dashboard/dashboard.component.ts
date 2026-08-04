import { Component } from '@angular/core';
import { MockDataService } from '../mock-data.service';

interface ModuleTile {
  title: string;
  description: string;
  icon: string;
  route: string;
  accent: string;
  stat: string;
  statLabel: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  totalDocuments: number;
  totalPatients: number;
  totalCategories: number;
  recentDocs;

  tiles: ModuleTile[];

  constructor(private data: MockDataService) {
    this.totalDocuments = this.data.documents.length;
    this.totalPatients = this.data.patients.length;
    this.totalCategories = this.data.getAllPaths().length;
    this.recentDocs = [...this.data.documents]
      .sort((a, b) => +new Date(b.uploadedOn) - +new Date(a.uploadedOn))
      .slice(0, 6);

    this.tiles = [
      {
        title: 'Category Manager',
        description: 'Build unlimited category / sub-category levels for organizing every record type.',
        icon: 'account_tree',
        route: '/categories',
        accent: '#12283F',
        stat: `${this.totalCategories}`,
        statLabel: 'categories & sub-levels',
      },
      {
        title: 'Upload Document',
        description: 'Attach a file to a patient through the live category hierarchy picker.',
        icon: 'upload_file',
        route: '/upload',
        accent: '#0E7C7B',
        stat: '4-step',
        statLabel: 'guided wizard',
      },
      {
        title: 'Document Library',
        description: 'Browse, filter and preview every uploaded document by type.',
        icon: 'folder_copy',
        route: '/documents',
        accent: '#7C4A03',
        stat: `${this.totalDocuments}`,
        statLabel: 'documents on file',
      },
      {
        title: 'Patient Search',
        description: 'Find a patient by ID or name and download their entire file as one ZIP.',
        icon: 'person_search',
        route: '/patient-search',
        accent: '#3A5A7A',
        stat: `${this.totalPatients}`,
        statLabel: 'patients indexed',
      },
      {
        title: 'QR Scan & Download',
        description: 'Scan a patient wristband / folder QR code to pull up records instantly.',
        icon: 'qr_code_scanner',
        route: '/qr-scan',
        accent: '#5A3A7A',
        stat: 'Camera',
        statLabel: 'or image upload',
      },
    ];
  }
}
