// crypto.service.ts
import { Injectable } from '@angular/core';
import { EncryptionService } from 'app/core/services/encryption.service';
import { permissionCodes, permissionType } from '../model/permission.model';

@Injectable({ providedIn: 'root' }) // Available globally
export class PagePermissionService {
    constructor(private encrService: EncryptionService) { }
    getList(): any[] {
        var permission = JSON.parse(localStorage.getItem("currentUser")).permissions;
        var permissionString = this.encrService.decrypt(permission);
        return JSON.parse(permissionString);
    }
    getPermission(pageCode: permissionCodes, permission: permissionType): boolean {
        if ((pageCode ?? "") != "") {
            var page = this.getList().find(x => x.PageCode == pageCode) as any[];
            if (permission == permissionType.Add)
                return page["IsAdd"] ?? false;
            else if (permission == permissionType.Edit)
                return page["IsEdit"] ?? false;
            else if (permission == permissionType.Delete)
                return page["IsDelete"] ?? false;
            else if (permission == permissionType.View)
                return page["IsView"] ?? false;
            else if (permission == permissionType.Export)
                return page["IsExport"] ?? false;
        }
        else
            return false;
    }
}
