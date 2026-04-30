export * from './formModules.service';
import { FormModulesService } from './formModules.service';
export * from './forms.service';
import { FormsService } from './forms.service';
export * from './idmMessages.service';
import { IdmMessagesService } from './idmMessages.service';
export * from './submissions.service';
import { SubmissionsService } from './submissions.service';
export * from './utilityMethods.service';
import { UtilityMethodsService } from './utilityMethods.service';
export const APIS = [
  FormModulesService,
  FormsService,
  IdmMessagesService,
  SubmissionsService,
  UtilityMethodsService,
];
