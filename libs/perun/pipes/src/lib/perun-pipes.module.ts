import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceTagsToStringPipe } from './resource-tags-to-string.pipe';
import { IsVirtualAttributePipe } from './is-virtual-attribute.pipe';

@NgModule({
  declarations: [
    ResourceTagsToStringPipe,
    IsVirtualAttributePipe
  ],
  exports: [
    ResourceTagsToStringPipe,
    IsVirtualAttributePipe
  ],
  imports: [CommonModule],
})
export class PerunPipesModule {}
