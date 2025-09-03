import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@perun-web-apps/perun/services';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';

@NgModule({
  imports: [CommonModule, AuthCallbackComponent],
  providers: [AuthService],
  exports: [AuthCallbackComponent],
})
export class CoreModule {}
