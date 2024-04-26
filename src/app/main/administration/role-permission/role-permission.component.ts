import { Component, Inject, OnInit, ViewChild, ViewEncapsulation, Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoleTemplateService } from '../role-template-master/role-template.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup } from '@angular/forms';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { ArrayDataSource } from '@angular/cdk/collections';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';

export class FileNode {
    children?: FileNode[];
    title: string;
    url?: any;
    isView?: boolean;
    isAdd?: boolean;
    isEdit?: boolean;
    isDelete?: boolean;
    menuId?: number;
    id?: string;
    translate?: string;
    type?: string;
    icon?: string;
}
export class ExampleFlatNode {
    expandable: boolean;
    level?: number;
}

const FILE_DATA = [
    {
        "id": "1",
        "title": "Setup",
        "translate": "",
        "type": "collapsable",
        "icon": "apps",
        "url": null,
        "isView": true,
        "isAdd": false,
        "isEdit": false,
        "isDelete": false,
        "children": [
            {
                "id": "15",
                "title": "Personal Details",
                "translate": "",
                "type": "collapsable",
                "icon": "apps",
                "url": null,
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": [
                    {
                        "id": "132",
                        "title": "Prefix Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/personaldetail/prefix-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "133",
                        "title": "Gender Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/personaldetail/gender-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "134",
                        "title": "Patient Type Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/personaldetail/patient-type-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "135",
                        "title": "Relationship Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/personaldetail/relationship-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "136",
                        "title": "Marital Status",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/personaldetail/marital-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "137",
                        "title": "Religion Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/personaldetail/religion-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "138",
                        "title": "Country Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/personaldetail/country-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "139",
                        "title": "State Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/personaldetail/state-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "140",
                        "title": "City",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/personaldetail/city-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "141",
                        "title": "Taluka Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/personaldetail/taluka-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "142",
                        "title": "Village Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/personaldetail/village-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "143",
                        "title": "Area Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/personaldetail/area-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "144",
                        "title": "Bank",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/billing/bank-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    }
                ]
            },
            {
                "id": "16",
                "title": "Department",
                "translate": "",
                "type": "collapsable",
                "icon": "apps",
                "url": null,
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": [
                    {
                        "id": "145",
                        "title": "Department Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/department/department-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "146",
                        "title": "Location Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/department/location-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "147",
                        "title": "Ward Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/department/ward-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "148",
                        "title": "Bed Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/department/bed-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "149",
                        "title": "Discharge Type Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/department/dischargetype-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "192",
                        "title": "Discharge Type",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/department/dischargetype-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "195",
                        "title": "ParameterDescriptiveMaster",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/Pathology/paramterDescriptive",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    }
                ]
            },
            {
                "id": "17",
                "title": "Billing",
                "translate": "",
                "type": "collapsable",
                "icon": "apps",
                "url": null,
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": [
                    {
                        "id": "150",
                        "title": "Cash Counter Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/billing/cash-counter-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "151",
                        "title": "Billing Class Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/billing/billing-class-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "152",
                        "title": "Tariff Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/billing/tariff-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "153",
                        "title": "Group Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/billing/group-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "154",
                        "title": "Sub Group Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/billing/sub-group-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "155",
                        "title": "Billing Service Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/billing/service-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "156",
                        "title": "Company Type Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/billing/company-type-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "157",
                        "title": "Company Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/billing/company-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "158",
                        "title": "Sub TPA Company Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/billing/subtpa-company-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "159",
                        "title": "Concession Reason Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/billing/concession-reason-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "160",
                        "title": "Bank Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/billing/bank-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "161",
                        "title": "Credit Reason Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "ListCreditReasonMaster",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    }
                ]
            },
            {
                "id": "18",
                "title": "Doctor Master",
                "translate": "",
                "type": "collapsable",
                "icon": "apps",
                "url": null,
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": [
                    {
                        "id": "162",
                        "title": "Doctor Type Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/doctor/doctortype-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "163",
                        "title": "Doctor Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/doctor/doctor-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    }
                ]
            },
            {
                "id": "19",
                "title": "Prescription",
                "translate": "",
                "type": "collapsable",
                "icon": "apps",
                "url": null,
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": [
                    {
                        "id": "164",
                        "title": "Prescription Class Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/prescription/prescriptionclassmaster",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "165",
                        "title": "Generic Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/prescription/genericmaster",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "166",
                        "title": "Drug Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/prescription/drugmaster",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "167",
                        "title": "Dose Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/prescription/dosemaster",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "168",
                        "title": "Certificate",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/prescription/certificatemaster",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "169",
                        "title": "Instruction Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/prescription/instructionmaster",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    }
                ]
            },
            {
                "id": "20",
                "title": "Pathology Master",
                "translate": "",
                "type": "collapsable",
                "icon": "apps",
                "url": null,
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": [
                    {
                        "id": "170",
                        "title": "Category Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/pathology/categorymaster",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "171",
                        "title": "unitmaster",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/pathology/unitmaster",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "172",
                        "title": "Parameter Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/pathology/parametermaster",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "173",
                        "title": "Template Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/pathology/templatemaster",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "174",
                        "title": "Test Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/pathology/testmaster",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "175",
                        "title": "Parameter Age Wise",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/pathology/paramteragewise",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    }
                ]
            },
            {
                "id": "21",
                "title": "Radiology Master",
                "translate": "",
                "type": "collapsable",
                "icon": "apps",
                "url": null,
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": [
                    {
                        "id": "176",
                        "title": "Category Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/radiology-master/category-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "177",
                        "title": "Radiology Template Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/radiology-master/radiology-template-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "178",
                        "title": "Radiology Test Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/radiology-master/radiology-test-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    }
                ]
            },
            {
                "id": "22",
                "title": "Inventory Master",
                "translate": "",
                "type": "collapsable",
                "icon": "apps",
                "url": null,
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": [
                    {
                        "id": "179",
                        "title": "Currency Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/currency-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "180",
                        "title": "Item Type Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/item-type-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "181",
                        "title": "Item Category Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/item-category-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "182",
                        "title": "UOM Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/uom-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "183",
                        "title": "Item Generic Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/item-generic-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "184",
                        "title": "Item Class Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/item-class-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "185",
                        "title": "Manufanture Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/manufacture-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "186",
                        "title": "Store Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/store-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "187",
                        "title": "Item Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/item-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "188",
                        "title": "Supplier Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/supplier-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "189",
                        "title": "Tax Master",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/tax-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "190",
                        "title": "Mode of Payment",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/mode-of-payment-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "191",
                        "title": "Terms of Payment",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "setup/inventory/terms-of-payment-master",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "197",
                        "title": "IP Refundof Bill",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "ipd/refund/iprefundofbill",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "198",
                        "title": "IP Refund of Advance",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "ipd/refund/iprefundofadvance",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "199",
                        "title": "Browse Refund of Bill",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "ipd/refund/browserefundofbill",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    },
                    {
                        "id": "200",
                        "title": "Browse Refund of Advance",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "ipd/refund/browserefundofadvance",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    }
                ]
            }
        ]
    },
    {
        "id": "2",
        "title": "OPD Patient",
        "translate": "",
        "type": "collapsable",
        "icon": "accessibility_new",
        "url": null,
        "isView": true,
        "isAdd": false,
        "isEdit": false,
        "isDelete": false,
        "children": [
            {
                "id": "23",
                "title": "Registration",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "opd/registration",
                "isView": true,
                "isAdd": true,
                "isEdit": true,
                "isDelete": true,
                "children": null
            },
            {
                "id": "24",
                "title": "Phone Appointment",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "opd/phone-appointment",
                "isView": true,
                "isAdd": false,
                "isEdit": true,
                "isDelete": false,
                "children": null
            },
            {
                "id": "25",
                "title": "Appointment",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "opd/appointment",
                "isView": true,
                "isAdd": true,
                "isEdit": false,
                "isDelete": true,
                "children": null
            },
            {
                "id": "27",
                "title": "Medical Records",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "opd/medicalrecords",
                "isView": true,
                "isAdd": true,
                "isEdit": false,
                "isDelete": true,
                "children": null
            },
            {
                "id": "28",
                "title": "Bill",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "opd/bill",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "29",
                "title": "Browse OPD Bills",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "opd/browse-opd-bills",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "30",
                "title": "Payment",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "opd/payment",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "31",
                "title": "Browse OPD Receipts",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "opd/browse-opd-payment-receipt",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "32",
                "title": "Refund Of Bill (OP)",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "opd/refund",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "33",
                "title": "Browse OPD Refund",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "opd/brows-opd-refund",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "34",
                "title": "Company Settlement",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "opd/companysettlement",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            }
        ]
    },
    {
        "id": "3",
        "title": "IPD Patient",
        "translate": "",
        "type": "collapsable",
        "icon": "airline_seat_recline_extra",
        "url": null,
        "isView": true,
        "isAdd": false,
        "isEdit": false,
        "isDelete": false,
        "children": [
            {
                "id": "35",
                "title": "Admission",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "ipd/admission",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "36",
                "title": "Medical Record",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "ipd/ip-casepaper",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "37",
                "title": "Advance",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "ipd/ipadvance",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "38",
                "title": "Browse IP Advance",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "ipd/ip-advance-browse",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "39",
                "title": "Add Billing",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "ipd/add-billing",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "40",
                "title": "Browse IP Bills",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "ipd/ipd-bill-browse-list",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "41",
                "title": "Settlement",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "ipd/ip-addCharges",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "42",
                "title": "Refund",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "#",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "43",
                "title": "Discharge",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "ipd/discharge",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "44",
                "title": "Discharge Summay",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "ipd/dischargesummary",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "45",
                "title": "Browse IP Payment Receipt",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "#",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "46",
                "title": "Browse IP Receipt",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "ipd/ipd-browse-receipt",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            }
        ]
    },
    {
        "id": "4",
        "title": "Nursing Station",
        "translate": "",
        "type": "collapsable",
        "icon": "People",
        "url": null,
        "isView": true,
        "isAdd": false,
        "isEdit": false,
        "isDelete": false,
        "children": [
            {
                "id": "47",
                "title": "Bed Transfer",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "nursingstation/bedtransfer",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "48",
                "title": "Prescription",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "nursingstation/prescription",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "49",
                "title": "Prescription Return",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "nursingstation/prescriptionreturn",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "50",
                "title": "Request for Lab and Radi Test",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "nursingstation/requestforlabtest",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "51",
                "title": "Dialysis",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "nursingstation/dialysis",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "52",
                "title": "Dialysis SMS",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "nursingstation/dialysissms",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "53",
                "title": "Patient Ref Visit",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "nursingstation/patientrefvisit",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "54",
                "title": "Send  Multiple SMS",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "nursingstation/multiplesms",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "55",
                "title": "Pharmacy Summary",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "nursingstation/pharmacysummary",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "56",
                "title": "Patient Wise Material Consumption",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "nursingstation/patientwisematerialconsumption",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "57",
                "title": "Doctor Note",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "nursingstation/doctornote",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "58",
                "title": "Nursing Note",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "nursingstation/nursingnote",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            }
        ]
    },
    {
        "id": "5",
        "title": "OT Management",
        "translate": "",
        "type": "collapsable",
        "icon": "wc",
        "url": null,
        "isView": true,
        "isAdd": false,
        "isEdit": false,
        "isDelete": false,
        "children": [
            {
                "id": "59",
                "title": "OT Reservation",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "otmanagement/listofreservation",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "60",
                "title": "OT Notes",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "otmanagement/otnotes",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "61",
                "title": "Endoscopy List",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "otmanagement/endoscopylist",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "62",
                "title": "OT Request",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "otmanagement/otrequest",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "63",
                "title": "Cath Lab",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "otmanagement/cathlablist",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            }
        ]
    },
    {
        "id": "7",
        "title": "Inventory",
        "translate": "",
        "type": "collapsable",
        "icon": "list_alt",
        "url": null,
        "isView": true,
        "isAdd": false,
        "isEdit": false,
        "isDelete": false,
        "children": [
            {
                "id": "66",
                "title": "Indent",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "inventory/indent",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "67",
                "title": "Issue To Department",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "inventory/issuetodepartment",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "68",
                "title": "Return From Department",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "inventory/returnfromdepartment",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "69",
                "title": "Material Consumption",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "inventory/materialconsumption",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "70",
                "title": "Current Stock",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "inventory/currentstock",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "71",
                "title": "Item Movemnent",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "inventory/itemmovement",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "72",
                "title": "Stock Adjustment",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "inventory/stockadjustment",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "73",
                "title": "MRP Adjustment",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "inventory/mrpadjustment",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "74",
                "title": "Batch and Exp Date Adjustment",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "inventory/batchandexpdateadjustment",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "75",
                "title": "GST Adjustment",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "inventory/gstadjustment",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "76",
                "title": "Patient Material Consumption",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "inventory/patientmaterialconsumption",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "77",
                "title": "Patient Material Consumption Return",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "inventory/patientmaterialconsumptionreturn",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            }
        ]
    },
    {
        "id": "8",
        "title": "Purchase",
        "translate": "",
        "type": "collapsable",
        "icon": "apps",
        "url": null,
        "isView": true,
        "isAdd": true,
        "isEdit": false,
        "isDelete": false,
        "children": [
            {
                "id": "79",
                "title": "Purchase Order",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "purchase/purchaseorder",
                "isView": true,
                "isAdd": true,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "80",
                "title": "Good Receipt Notes (GRN)",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "purchase/goodreceiptnote",
                "isView": true,
                "isAdd": true,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "81",
                "title": "GRN Return",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "purchase/grnreturn",
                "isView": true,
                "isAdd": true,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "82",
                "title": "GRN Return without GRN",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "purchase/grnreturnwithoutgrn",
                "isView": true,
                "isAdd": true,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "83",
                "title": "Supplier Payment Status",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "purchase/supplierpaymentstatus",
                "isView": true,
                "isAdd": true,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "84",
                "title": "GRN Return Supplier Information",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "purchase/grnreturnsupplierinformation",
                "isView": true,
                "isAdd": true,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "88",
                "title": "Retailer GRN List For Account",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "purchase/ratilergrnlistforaccount",
                "isView": true,
                "isAdd": true,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "89",
                "title": "GRN Return New",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "purchase/grnreturnnew",
                "isView": true,
                "isAdd": true,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "90",
                "title": "Material Consumption",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "purchase/materialconsumption",
                "isView": true,
                "isAdd": true,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "94",
                "title": "Work Order",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "purchase/workorder",
                "isView": true,
                "isAdd": true,
                "isEdit": false,
                "isDelete": false,
                "children": null
            }
        ]
    },
    {
        "id": "9",
        "title": "Pharmacy",
        "translate": "",
        "type": "collapsable",
        "icon": "library_add",
        "url": null,
        "isView": true,
        "isAdd": false,
        "isEdit": false,
        "isDelete": false,
        "children": [
            {
                "id": "96",
                "title": "Sales",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "pharmacy/sales",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "97",
                "title": "Browse Sales Bill",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "pharmacy/browsesalesbill",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "98",
                "title": "Sales Return",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "pharmacy/salesreturn",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "99",
                "title": "IP Sales return",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "pharmacy/ipsalesreturn",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "100",
                "title": "Material Received From MainStore",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "pharmacy/matrialreceivedfrommainstore",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "101",
                "title": "Sales Bill Settlement",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "pharmacy/salesbillsettlement",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "102",
                "title": "Reorder Level Summary",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "pharmacy/reorderlevelsummary",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "103",
                "title": "Item Summary",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "pharmacy/ippharmacyadvancereturn",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "104",
                "title": "Issue Tracker",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "pharmacy/pharmacyclearence",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            }
        ]
    },
    {
        "id": "10",
        "title": "Reports",
        "translate": "",
        "type": "collapsable",
        "icon": "library_books",
        "url": null,
        "isView": true,
        "isAdd": false,
        "isEdit": false,
        "isDelete": false,
        "children": [
            {
                "id": "114",
                "title": "Pharmacy Report",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "reports/pharmacyreport",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            }
        ]
    },
    {
        "id": "11",
        "title": "Administration",
        "translate": "",
        "type": "collapsable",
        "icon": "widgets",
        "url": null,
        "isView": true,
        "isAdd": false,
        "isEdit": false,
        "isDelete": false,
        "children": [
            {
                "id": "115",
                "title": "Role Template Master",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "administration/roletemplatemaster",
                "isView": true,
                "isAdd": true,
                "isEdit": true,
                "isDelete": true,
                "children": null
            },
            {
                "id": "116",
                "title": "Create User",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "administration/createuser",
                "isView": true,
                "isAdd": true,
                "isEdit": true,
                "isDelete": true,
                "children": null
            },
            {
                "id": "118",
                "title": "Cancellation",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "administration/cancellation",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "119",
                "title": "Payment mode changes",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "administration/paymentmodechanges",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "120",
                "title": "payment mode changes for Pharmacy",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "administration/paymentmodechangesforpharmacy",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "121",
                "title": "Doctor share",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "administration/doctorshare",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "122",
                "title": "Discharge Cancel",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "administration/dischargecancel",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "123",
                "title": "Tally Interface",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "setup/tallyinterface",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "124",
                "title": "smsconfigrationtool",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "setup/prescription",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            },
            {
                "id": "125",
                "title": "PharmacyPaymentIPAdvMode",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "administration/pharamacypayipadvmode",
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": null
            }
        ]
    },
    {
        "id": "12",
        "title": "Investigation",
        "translate": "",
        "type": "collapsable",
        "icon": "people",
        "url": null,
        "isView": true,
        "isAdd": false,
        "isEdit": false,
        "isDelete": false,
        "children": [
            {
                "id": "126",
                "title": "Pathology",
                "translate": "",
                "type": "collapsable",
                "icon": "apps",
                "url": null,
                "isView": true,
                "isAdd": false,
                "isEdit": false,
                "isDelete": false,
                "children": [
                    {
                        "id": "130",
                        "title": "Sample collection List",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "pathology/sample-collection-list",
                        "isView": true,
                        "isAdd": true,
                        "isEdit": true,
                        "isDelete": true,
                        "children": null
                    },
                    {
                        "id": "131",
                        "title": "Pathology Result list",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "pathology/pathology-result-list",
                        "isView": true,
                        "isAdd": true,
                        "isEdit": true,
                        "isDelete": true,
                        "children": null
                    },
                    {
                        "id": "196",
                        "title": "Sample Request list",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "pathology/lab-request-list",
                        "isView": true,
                        "isAdd": false,
                        "isEdit": false,
                        "isDelete": false,
                        "children": null
                    }
                ]
            },
            {
                "id": "127",
                "title": "Radiology",
                "translate": "",
                "type": "collapsable",
                "icon": "apps",
                "url": null,
                "isView": true,
                "isAdd": true,
                "isEdit": true,
                "isDelete": true,
                "children": [
                    {
                        "id": "129",
                        "title": "Radiology List",
                        "translate": "",
                        "type": "item",
                        "icon": "apps",
                        "url": "radiology/radiology-order-list",
                        "isView": true,
                        "isAdd": true,
                        "isEdit": true,
                        "isDelete": true,
                        "children": null
                    }
                ]
            }
        ]
    },
    {
        "id": "13",
        "title": "CanteenManagement",
        "translate": "",
        "type": "collapsable",
        "icon": "widgets",
        "url": null,
        "isView": true,
        "isAdd": true,
        "isEdit": true,
        "isDelete": true,
        "children": [
            {
                "id": "128",
                "title": "Canteen Sales",
                "translate": "",
                "type": "item",
                "icon": "apps",
                "url": "CanteenManagement/Canteensales",
                "isView": true,
                "isAdd": true,
                "isEdit": true,
                "isDelete": true,
                "children": null
            }
        ]
    }
];

@Component({
    selector: 'app-role-permission',
    templateUrl: './role-permission.component.html',
    styleUrls: ['./role-permission.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RolePermissionComponent implements OnInit {

    displayedColumns: string[] = ['name', 'count'];

    private transformer = (node: FileNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            title: node.title,
            url: node.url,
            isView: node.isView,
            isAdd: node.isAdd,
            isEdit: node.isEdit,
            isDelete: node.isDelete,
            menuId: node.id,
            id: node.id,
            translate: node.translate,
            type: node.type,
            icon: node.icon,
            level: level,
            children: node.children
        };
    };

    // ------------------------------------------------------------------------------------------------
    // Added by nikunj
    public treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);

    public treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);

    public dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

    // ------------------------------------------------------------------------------------------------


    nestedTreeControl: NestedTreeControl<FileNode>;
    nestedDataSource: FileNode[];
    // displayedColumns: string[] = [
    //     "Id",
    //     "LinkName", "IsView",
    //     "IsAdd", "IsEdit", "IsDelete"
    // ];

    isLoading: String = '';
    sIsLoading: string = "";

    dsPermissionList = new MatTableDataSource<MenuMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _RoleService: RoleTemplateService,
        public toastr: ToastrService, public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<RolePermissionComponent>,
    ) {
        // Added by nikunj
        //this.dataSource.data = FILE_DATA;
        // ---------------------------------------------------------------------------
        // this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
        //this.nestedDataSource = TREE_DATA;
        this._RoleService.getmenus(this.data.RoleId).subscribe((Menu) => {
            this.dataSource.data = Menu as FileNode[];
        });
    }

    hasNestedChild = (_: number, nodeData: FileNode) => nodeData.children;

    private _getChildren = (node: FileNode) => observableOf(node.children);

    ngOnInit(): void {
        if (this.data) {
            this.getPermissionList(this.data.RoleId);
            // setTimeout(() => {
            //     this.nestedTreeControl.expandAll();
            // }, 2000);
        }
    }
    getPermissionList(RoleId: number) {
        this._RoleService.getPermissionList(RoleId).subscribe((Menu) => {
            this.dsPermissionList = new MatTableDataSource<MenuMaster>(Menu as MenuMaster[]);
            this.dsPermissionList.sort = this.sort;
            this.dsPermissionList.paginator = this.paginator;
        });
    }
    updatePermission(obj, type, $event) {
        let proptype = "";
        if (type == 'view') proptype = "isView";
        else if (type == 'add') proptype = "isAdd";
        else if (type == 'edit') proptype = "isEdit";
        else if (type == 'delete') proptype = "isDelete";
        const descendants = this.treeControl.getDescendants(obj);
        for (let i = 0; i < descendants.length; i++) {
            //this.chkunchk(obj.children[i], type, proptype, $event);
            descendants[i][proptype] = $event.checked;
            if ((descendants[i].children ?? []).length > 0) {
                for (let j = 0; j < descendants[i].children.length; j++) {
                    descendants[i].children[j][proptype] = $event.checked;
                }
            }
        }
    }


    onClose() {
        this.dialogRef.close();
    }
    onSubmit() {
        this._RoleService.savePermission(this.dsPermissionList.data).subscribe((Menu) => {
            this.toastr.success('Permission updated Successfully.', 'updated !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
        });
    }

}
export class MenuMaster {
    menuId: number;
    linkName: string;
    parent: string;
    roleId: number;
    isView: boolean;
    isAdd: boolean;
    isEdit: boolean;
    isDelete: boolean;
    /**
     * Constructor
     *
     * @param PrefixMaster
     */
    constructor(MenuMaster) {
        {
            this.menuId = MenuMaster.menuId || 0;
            this.linkName = MenuMaster.linkName || "";
            this.parent = MenuMaster.parent || "";
            this.roleId = MenuMaster.roleId || 0;
            this.isView = MenuMaster.isView || false;
            this.isAdd = MenuMaster.isAdd || false;
            this.isEdit = MenuMaster.isEdit || false;
            this.isDelete = MenuMaster.isDelete || false;

        }
    }

}