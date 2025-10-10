import { Pipe, PipeTransform } from '@angular/core';
import { Sponsor, User } from '@perun-web-apps/perun/openapi';

@Pipe({
  standalone: true,
  name: 'selectedSponsor',
})
export class SelectedSponsorPipe implements PipeTransform {
  transform(sponsors: Sponsor[], selectedSponsor: User): Sponsor {
    return sponsors.find((sponsor) => sponsor.user.id === selectedSponsor.id);
  }
}
