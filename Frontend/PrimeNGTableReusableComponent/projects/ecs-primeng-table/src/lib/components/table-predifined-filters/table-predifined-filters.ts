import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'ecs-table-predifined-filters',
  imports: [
    SkeletonModule,
    TagModule
  ],
  standalone: true,
  templateUrl: './table-predifined-filters.html'
})
export class TablePredifinedFilters {
  constructor(
    private sanitizer: DomSanitizer
  ) {}
  
  @Input() option: any;
  @Input() col: any;

  /**
   * Converts a blob from the database to a safe URL that can be used to display an image.
   *
   * This function takes a `Blob` object, converts it to a base64 encoded string, and returns a `SafeUrl` 
   * that can be used in an HTML template to display the image securely. The `SafeUrl` ensures that 
   * Angular's security mechanisms are bypassed correctly, preventing potential security risks.
   *
   * @param {Blob} blob - The blob object representing the image data from the database.
   * @returns {SafeUrl} A safe URL that can be used to display the image in an HTML template.
   * 
   * @example
   * // Example usage in a component
   * const imageBlob = new Blob([binaryData], { type: 'image/jpeg' });
   * const imageUrl = this.getBlobIconAsUrl(imageBlob);
   * 
   * // In your HTML template
   * <img [src]="imageUrl" alt="Image">
   */
  getBlobIconAsUrl(blob: Blob): SafeUrl {
    let objectURL = `data:image/jpeg;base64,${blob}`; // Create a base64 encoded string from the blob data
    return this.sanitizer.bypassSecurityTrustUrl(objectURL); // Bypass Angular's security mechanisms to create a SafeUrl
  }
}