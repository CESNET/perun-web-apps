import { Component } from '@angular/core';
import { NewRegistrarSwitchComponent } from '../new-registrar-switch/new-registrar-switch.component';
import { ApplicationFormPreviewComponent } from '../../../../vos/components/application-form-preview/application-form-preview.component';

@Component({
  selector: 'app-application-form-preview-switch',
  templateUrl: 'application-form-preview-switch.component.html',
  styleUrls: ['application-form-preview-switch.component.scss'],
  imports: [NewRegistrarSwitchComponent],
  standalone: true,
})
export class ApplicationFormPreviewSwitchComponent {
  protected readonly ApplicationFormPreviewComponent = ApplicationFormPreviewComponent;
}
