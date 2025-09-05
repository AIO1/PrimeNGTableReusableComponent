import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {
    getCurrentTimeString(): string {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        return `_${year}${month}${day}_${hours}${minutes}${seconds}_UTC`;
    }
}