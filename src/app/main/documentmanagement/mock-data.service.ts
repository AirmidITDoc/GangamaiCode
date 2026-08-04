import { Injectable } from '@angular/core';
import { Category } from 'app/core/models/documentmanagement/category.model';
import { FileKind, HospitalDocument } from 'app/core/models/documentmanagement/document.model';
import { Patient } from 'app/core/models/documentmanagement/patient.model';
import { BehaviorSubject } from 'rxjs';

let uid = 1000;
export function nextId(prefix: string): string {
  uid += 1;
  return `${prefix}-${uid}`;
}

function cat(name: string, children: Category[] = [], icon = 'folder', color = '#0E7C7B'): Category {
  return { id: nextId('cat'), name, children, icon, color, documentCount: 0 };
}

@Injectable({ providedIn: 'root' })
export class MockDataService {
  /* ------------------------------------------------------------------ */
  /* CATEGORY TREE — supports unlimited nesting                          */
  /* ------------------------------------------------------------------ */
  private readonly seedCategories: Category[] = [
    cat('Administrative', [
      cat('Registration Forms', [], 'assignment_ind'),
      cat('Insurance & Billing', [
        cat('Claim Forms', [], 'request_quote'),
        cat('Pre-Authorization', [], 'fact_check'),
      ], 'account_balance'),
      cat('Consent Forms', [], 'edit_document'),
    ], 'badge', '#12283F'),

    cat('Clinical Records', [
      cat('OPD Notes', [], 'stethoscope'),
      cat('IPD Notes', [], 'bed'),
      cat('Discharge Summary', [], 'summarize'),
      cat('Radiology', [
        cat('CT Scan', [
          cat('Head', [], 'psychology'),
          cat('Chest', [], 'monitor_heart'),
          cat('Abdomen', [], 'health_and_safety'),
        ], 'radiology'),
        cat('MRI', [
          cat('Brain', [], 'psychology'),
          cat('Spine', [], 'accessibility_new'),
        ], 'radiology'),
        cat('X-Ray', [], 'radiology'),
      ], 'radiology'),
      cat('Lab Reports', [
        cat('Hematology', [], 'bloodtype'),
        cat('Biochemistry', [], 'science'),
        cat('Microbiology', [], 'biotech'),
      ], 'biotech'),
      cat('Prescriptions', [], 'medication'),
    ], 'folder_special', '#0E7C7B'),

    cat('Surgical', [
      cat('Pre-Op Assessment', [], 'checklist'),
      cat('Operative Notes', [], 'content_cut'),
      cat('Post-Op Instructions', [], 'healing'),
      cat('Anesthesia Records', [], 'masks'),
    ], 'medical_services', '#7C4A03'),

    cat('Nursing', [
      cat('Vitals Charts', [], 'monitor_heart'),
      cat('Medication Administration', [], 'vaccines'),
    ], 'health_and_safety', '#3A5A7A'),

    cat('Diagnostics', [
      cat('ECG', [], 'ecg'),
      cat('Pathology', [], 'biotech'),
    ], 'analytics', '#5A3A7A'),

    cat('Legal & Compliance', [
      cat('Medico-Legal Cases', [], 'gavel'),
      cat('Death Certificates', [], 'description'),
    ], 'balance', '#7A3A3A'),
  ];

  private categoriesSubject = new BehaviorSubject<Category[]>(this.seedCategories);
  categories$ = this.categoriesSubject.asObservable();

  get categories(): Category[] {
    return this.categoriesSubject.value;
  }

  /** Add a new category / sub-category under the given parent id (null = root level) */
  addCategory(parentId: string | null, name: string, icon = 'folder'): void {
    const newNode = cat(name, [], icon);
    if (!parentId) {
      this.categoriesSubject.next([...this.categories, newNode]);
      return;
    }
    const clone = structuredClone(this.categories);
    const parent = this.findNode(clone, parentId);
    if (parent) {
      parent.children.push(newNode);
    }
    this.categoriesSubject.next(clone);
  }

  renameCategory(id: string, name: string): void {
    const clone = structuredClone(this.categories);
    const node = this.findNode(clone, id);
    if (node) node.name = name;
    this.categoriesSubject.next(clone);
  }

  deleteCategory(id: string): void {
    const clone = structuredClone(this.categories);
    const removeFrom = (list: Category[]): Category[] =>
      list
        .filter((n) => n.id !== id)
        .map((n) => ({ ...n, children: removeFrom(n.children) }));
    this.categoriesSubject.next(removeFrom(clone));
  }

  findNode(list: Category[], id: string): Category | null {
    for (const node of list) {
      if (node.id === id) return node;
      const found = this.findNode(node.children, id);
      if (found) return found;
    }
    return null;
  }

  /** Returns every root-to-leaf path in the tree, useful for pickers / breadcrumbs */
  getAllPaths(): { id: string; path: string[]; icon?: string }[] {
    const out: { id: string; path: string[]; icon?: string }[] = [];
    const walk = (nodes: Category[], trail: string[]) => {
      for (const n of nodes) {
        const newTrail = [...trail, n.name];
        out.push({ id: n.id, path: newTrail, icon: n.icon });
        if (n.children.length) walk(n.children, newTrail);
      }
    };
    walk(this.categories, []);
    return out;
  }

  /* ------------------------------------------------------------------ */
  /* PATIENTS                                                            */
  /* ------------------------------------------------------------------ */
  private readonly seedPatients: Patient[] = [
    { id: 'PMR-10231', name: 'Ananya Sharma', gender: 'Female', age: 34, phone: '+91 98200 11234', lastVisit: '2026-07-18', ward: 'General Medicine', photoInitials: 'AS' },
    { id: 'PMR-10245', name: 'Rohit Verma', gender: 'Male', age: 52, phone: '+91 98220 88123', lastVisit: '2026-07-21', ward: 'Cardiology', photoInitials: 'RV' },
    { id: 'PMR-10298', name: 'Fatima Sheikh', gender: 'Female', age: 27, phone: '+91 90040 55123', lastVisit: '2026-07-24', ward: 'Maternity', photoInitials: 'FS' },
    { id: 'PMR-10312', name: 'Karan Patel', gender: 'Male', age: 8, phone: '+91 99250 44112', lastVisit: '2026-07-11', ward: 'Pediatrics', photoInitials: 'KP' },
    { id: 'PMR-10356', name: 'Meera Iyer', gender: 'Female', age: 61, phone: '+91 98765 22110', lastVisit: '2026-07-27', ward: 'Orthopedics', photoInitials: 'MI' },
    { id: 'PMR-10401', name: 'Suresh Nair', gender: 'Male', age: 45, phone: '+91 97120 66234', lastVisit: '2026-06-30', ward: 'Neurology', photoInitials: 'SN' },
    { id: 'PMR-10420', name: 'Divya Reddy', gender: 'Female', age: 19, phone: '+91 96380 12987', lastVisit: '2026-07-25', ward: 'General Surgery', photoInitials: 'DR' },
    { id: 'PMR-10477', name: 'Imran Qureshi', gender: 'Male', age: 70, phone: '+91 93280 77451', lastVisit: '2026-07-15', ward: 'ICU', photoInitials: 'IQ' },
  ];

  private patientsSubject = new BehaviorSubject<Patient[]>(this.seedPatients);
  patients$ = this.patientsSubject.asObservable();

  get patients(): Patient[] {
    return this.patientsSubject.value;
  }

  searchPatients(term: string): Patient[] {
    const t = term.trim().toLowerCase();
    if (!t) return [];
    return this.patients.filter(
      (p) => p.id.toLowerCase().includes(t) || p.name.toLowerCase().includes(t)
    );
  }

  getPatient(id: string): Patient | undefined {
    return this.patients.find((p) => p.id === id);
  }

  /* ------------------------------------------------------------------ */
  /* DOCUMENTS                                                           */
  /* ------------------------------------------------------------------ */
  private buildDoc(
    title: string,
    fileKind: FileKind,
    categoryPath: string[],
    patientId: string,
    sizeKb: number,
    daysAgo: number,
    tags: string[] = [],
    thumbnailColor = '#0E7C7B'
  ): HospitalDocument {
    const patient = this.seedPatients.find((p) => p.id === patientId)!;
    const paths = this.getAllPaths();
    const match = paths.find((p) => p.path.join('>') === categoryPath.join('>'));
    const ext: Record<FileKind, string> = {
      pdf: 'pdf', image: 'jpg', doc: 'docx', xls: 'xlsx', text: 'txt', other: 'dat',
    };
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return {
      id: nextId('doc'),
      title,
      fileName: `${title.replace(/\s+/g, '_')}.${ext[fileKind]}`,
      fileKind,
      fileSizeKb: sizeKb,
      categoryPath,
      categoryId: match?.id ?? '',
      patientId,
      patientName: patient?.name ?? 'Unknown',
      uploadedBy: 'Front Desk — S. Kulkarni',
      uploadedOn: d.toISOString(),
      tags,
      thumbnailColor,
    };
  }

  private readonly seedDocuments: HospitalDocument[] = [
    this.buildDoc('Aadhaar Card Copy', 'image', ['Administrative', 'Registration Forms'], 'PMR-10231', 812, 40, ['identity']),
    this.buildDoc('Insurance Policy Card', 'image', ['Administrative', 'Insurance & Billing', 'Claim Forms'], 'PMR-10231', 640, 39, ['insurance']),
    this.buildDoc('OPD Consultation Note', 'pdf', ['Clinical Records', 'OPD Notes'], 'PMR-10231', 210, 38, ['consult']),
    this.buildDoc('CT Head Plain Report', 'pdf', ['Clinical Records', 'Radiology', 'CT Scan', 'Head'], 'PMR-10231', 1340, 20, ['radiology', 'ct']),
    this.buildDoc('CBC Blood Test Report', 'pdf', ['Clinical Records', 'Lab Reports', 'Hematology'], 'PMR-10231', 180, 18, ['lab']),
    this.buildDoc('Prescription 18-Jul', 'image', ['Clinical Records', 'Prescriptions'], 'PMR-10231', 320, 11, ['rx']),

    this.buildDoc('ECG Strip Reading', 'image', ['Diagnostics', 'ECG'], 'PMR-10245', 540, 15, ['cardiac'], '#7C4A03'),
    this.buildDoc('Angiography Consent Form', 'pdf', ['Administrative', 'Consent Forms'], 'PMR-10245', 260, 14, ['consent'], '#7C4A03'),
    this.buildDoc('Cardiology OPD Note', 'pdf', ['Clinical Records', 'OPD Notes'], 'PMR-10245', 190, 14, ['consult'], '#7C4A03'),
    this.buildDoc('Lipid Profile Report', 'xls', ['Clinical Records', 'Lab Reports', 'Biochemistry'], 'PMR-10245', 95, 10, ['lab'], '#7C4A03'),
    this.buildDoc('Discharge Summary — Cath Lab', 'doc', ['Clinical Records', 'Discharge Summary'], 'PMR-10245', 145, 6, ['discharge'], '#7C4A03'),

    this.buildDoc('Antenatal Card', 'pdf', ['Clinical Records', 'OPD Notes'], 'PMR-10298', 205, 33, ['anc'], '#B23A6B'),
    this.buildDoc('Ultrasound — Obstetric', 'image', ['Clinical Records', 'Radiology', 'X-Ray'], 'PMR-10298', 980, 25, ['usg'], '#B23A6B'),
    this.buildDoc('Maternity Consent Form', 'pdf', ['Administrative', 'Consent Forms'], 'PMR-10298', 240, 9, ['consent'], '#B23A6B'),
    this.buildDoc('Hemoglobin Report', 'pdf', ['Clinical Records', 'Lab Reports', 'Hematology'], 'PMR-10298', 110, 5, ['lab'], '#B23A6B'),

    this.buildDoc('Pediatric Growth Chart', 'xls', ['Nursing', 'Vitals Charts'], 'PMR-10312', 88, 30, ['growth'], '#3A5A7A'),
    this.buildDoc('Vaccination Record', 'pdf', ['Administrative', 'Registration Forms'], 'PMR-10312', 150, 28, ['immunization'], '#3A5A7A'),
    this.buildDoc('Pediatric OPD Note', 'pdf', ['Clinical Records', 'OPD Notes'], 'PMR-10312', 175, 11, ['consult'], '#3A5A7A'),

    this.buildDoc('Knee X-Ray — Lateral', 'image', ['Clinical Records', 'Radiology', 'X-Ray'], 'PMR-10356', 860, 22, ['ortho'], '#5A3A7A'),
    this.buildDoc('Pre-Op Assessment Form', 'pdf', ['Surgical', 'Pre-Op Assessment'], 'PMR-10356', 230, 20, ['surgery'], '#5A3A7A'),
    this.buildDoc('Operative Note — TKR', 'doc', ['Surgical', 'Operative Notes'], 'PMR-10356', 165, 18, ['surgery'], '#5A3A7A'),
    this.buildDoc('Anesthesia Chart', 'pdf', ['Surgical', 'Anesthesia Records'], 'PMR-10356', 140, 18, ['anesthesia'], '#5A3A7A'),
    this.buildDoc('Post-Op Physiotherapy Plan', 'pdf', ['Surgical', 'Post-Op Instructions'], 'PMR-10356', 120, 2, ['physio'], '#5A3A7A'),

    this.buildDoc('MRI Brain Report', 'pdf', ['Clinical Records', 'Radiology', 'MRI', 'Brain'], 'PMR-10401', 1520, 45, ['radiology', 'mri'], '#12283F'),
    this.buildDoc('Neurology Consult Note', 'pdf', ['Clinical Records', 'OPD Notes'], 'PMR-10401', 200, 45, ['consult'], '#12283F'),
    this.buildDoc('EEG Report', 'pdf', ['Diagnostics', 'Pathology'], 'PMR-10401', 310, 30, ['eeg'], '#12283F'),

    this.buildDoc('Pre-Surgery Blood Panel', 'xls', ['Clinical Records', 'Lab Reports', 'Biochemistry'], 'PMR-10420', 100, 4, ['lab'], '#0E7C7B'),
    this.buildDoc('Appendectomy Operative Note', 'doc', ['Surgical', 'Operative Notes'], 'PMR-10420', 155, 3, ['surgery'], '#0E7C7B'),

    this.buildDoc('ICU Nursing Chart', 'xls', ['Nursing', 'Vitals Charts'], 'PMR-10477', 132, 8, ['icu'], '#7A3A3A'),
    this.buildDoc('Medico-Legal Case Report', 'pdf', ['Legal & Compliance', 'Medico-Legal Cases'], 'PMR-10477', 260, 6, ['mlc'], '#7A3A3A'),
    this.buildDoc('Sputum Culture Report', 'pdf', ['Clinical Records', 'Lab Reports', 'Microbiology'], 'PMR-10477', 175, 5, ['micro'], '#7A3A3A'),
  ];

  private documentsSubject = new BehaviorSubject<HospitalDocument[]>(this.seedDocuments);
  documents$ = this.documentsSubject.asObservable();

  get documents(): HospitalDocument[] {
    return this.documentsSubject.value;
  }

  addDocument(doc: HospitalDocument): void {
    this.documentsSubject.next([doc, ...this.documents]);
  }

  deleteDocument(id: string): void {
    this.documentsSubject.next(this.documents.filter((d) => d.id !== id));
  }

  getDocumentsForPatient(patientId: string): HospitalDocument[] {
    return this.documents.filter((d) => d.patientId === patientId);
  }
}
