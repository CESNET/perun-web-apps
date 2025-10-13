import { Pipe, PipeTransform } from '@angular/core';
import { Application } from '@perun-web-apps/perun/openapi';
import { UserFullNamePipe } from './user-full-name.pipe';

@Pipe({
  standalone: true,
  name: 'appCreatedByName',
})
export class AppCreatedByNamePipe implements PipeTransform {
  constructor(private userFullNamePipe: UserFullNamePipe) {}

  transform(application: Application): string {
    if (!application.user) {
      return application.createdBy.slice(
        application.createdBy.lastIndexOf('=') + 1,
        application.createdBy.length,
      );
    }
    const fullName = this.userFullNamePipe.transform(application.user);
    if (fullName.trim() === '') {
      return application.createdBy.slice(
        application.createdBy.lastIndexOf('=') + 1,
        application.createdBy.length,
      );
    }
    return fullName;
  }
}
