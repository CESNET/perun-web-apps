import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Candidate,
  ExtSource,
  Member,
  MembersManagerService,
  NamespaceRules,
  RichMember,
  UserExtSource,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import {
  ApiRequestConfigurationService,
  NotificatorService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { TABLE_VO_MEMBERS } from '@perun-web-apps/config/table-config';
import { Observable } from 'rxjs';
import { debounceTime, map, switchMap, take } from 'rxjs/operators';
import { CustomValidators, enableFormControl } from '@perun-web-apps/perun/utils';
import { loginAsyncValidator } from '@perun-web-apps/perun/namespace-password-form';
import { MatStepper } from '@angular/material/stepper';

export interface CreateServiceMemberDialogData {
  voId: number;
}

@Component({
  selector: 'app-create-service-member-dialog',
  templateUrl: './create-service-member-dialog.component.html',
  styleUrls: ['./create-service-member-dialog.component.scss'],
})
export class CreateServiceMemberDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper: MatStepper;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  namespaceOptions: string[] = [];
  selectedNamespace: string = null;
  namespaceRules: NamespaceRules[] = [];
  parsedRules: Map<string, { login: string }> = new Map<string, { login: string }>();

  loading: boolean;
  firstSearchDone = false;
  searchCtrl = new FormControl('');
  members: RichMember[] = [];
  selection = new SelectionModel<RichMember>(true, []);
  tableId = TABLE_VO_MEMBERS;
  assignedMembers: RichMember[] = [];
  candidate: Candidate = { beanName: '', id: 0 };
  successMessageMember = '';
  successMessagePwd = '';
  processing = false;

  constructor(
    private dialogRef: MatDialogRef<CreateServiceMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: CreateServiceMemberDialogData,
    private membersManagerService: MembersManagerService,
    private usersManagerService: UsersManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private store: StoreService,
    private apiRequestConfiguration: ApiRequestConfigurationService,
    private _formBuilder: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    translate
      .get('DIALOGS.CREATE_SERVICE_MEMBER.SUCCESS_MEMBER')
      .subscribe((m: string) => (this.successMessageMember = m));
    translate
      .get('DIALOGS.CREATE_SERVICE_MEMBER.SUCCESS_PWD')
      .subscribe((m: string) => (this.successMessagePwd = m));
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
      emailCtrl: [
        '',
        [Validators.required, Validators.pattern('\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(.\\w{2,3})+')],
      ],
      subjectCtrl: [null],
      issuerCtrl: [null],
    });
    this.secondFormGroup = this._formBuilder.group(
      {
        namespaceCtrl: ['Not selected'],
        loginCtrl: [
          '',
          [
            Validators.pattern('^[a-z][a-z0-9_-]+$'),
            Validators.maxLength(15),
            Validators.minLength(2),
          ],
        ],
        passwordCtrl: [
          '',
          Validators.required,
          [loginAsyncValidator(null, this.usersManagerService, this.apiRequestConfiguration)],
        ],
        passwordAgainCtrl: [''],
        generatePasswordCtrl: [true],
      },
      {
        validators: CustomValidators.passwordMatchValidator as ValidatorFn,
      }
    );

    this.namespaceOptions = ['Not selected'];
    this.membersManagerService.getAllNamespacesRules().subscribe((rules) => {
      this.namespaceRules = rules;
      this.parseNamespaceRules();
      this.loading = false;
    });

    this.onNamespaceChanged('Not selected');
    const user = this.store.getPerunPrincipal().user;
    this.membersManagerService.getMembersByUser(user.id).subscribe((members) => {
      let tempMember: RichMember = {} as RichMember;
      for (const member of members) {
        if (member.voId === this.data.voId) {
          tempMember = member as RichMember;
        }
      }
      tempMember['user'] = user;
      this.assignedMembers.push(tempMember);
    });
  }

  existingLoginValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      let namespace: string = (
        this.secondFormGroup.get('namespaceCtrl').value as string
      ).toLowerCase();
      namespace = namespace === 'not selected' ? 'mu' : namespace;
      return control.valueChanges.pipe(
        debounceTime(500),
        take(1),
        switchMap(() =>
          this.usersManagerService
            .isLoginAvailable(namespace, control.value as string)
            .pipe(map((res) => (res ? null : { loginExists: true })))
        )
      );
    };
  }

  onCreate(): void {
    this.processing = true;
    this.candidate['firstName'] = '';
    this.candidate['lastName'] = this.firstFormGroup.get('nameCtrl').value as string;
    this.candidate['attributes'] = {};
    this.candidate['attributes']['urn:perun:member:attribute-def:def:mail'] =
      this.firstFormGroup.get('emailCtrl').value as string;
    const subject = this.firstFormGroup.get('subjectCtrl');
    if (subject?.value as string) {
      this.candidate['userExtSource'] = {} as UserExtSource;
      this.candidate['userExtSource']['login'] = subject.value as string;
      this.candidate['userExtSource']['loa'] = 0;
      this.candidate['userExtSource']['extSource'] = {} as ExtSource;
      this.candidate['userExtSource']['extSource']['name'] = this.firstFormGroup.get('issuerCtrl')
        .value as string;
      this.candidate['userExtSource']['extSource']['type'] =
        'cz.metacentrum.perun.core.impl.ExtSourceX509';
    }

    const namespace = (this.secondFormGroup.get('namespaceCtrl').value as string).toLowerCase();
    const rules = this.parsedRules.get(namespace);
    const namespaceUrn = `urn:perun:user:attribute-def:def:login-namespace:${namespace}`;
    if (
      (this.secondFormGroup.get('namespaceCtrl').value as string) !== 'Not selected' &&
      rules.login === 'disabled'
    ) {
      this.usersManagerService
        .generateAccountForName(namespace, this.firstFormGroup.get('nameCtrl').value as string)
        .subscribe(
          (params) => {
            this.candidate['attributes'][namespaceUrn] = params[namespaceUrn];
            this.createSpecificMember();
          },
          () => (this.processing = false)
        );
    } else {
      if (this.secondFormGroup.get('namespaceCtrl').value !== 'Not selected') {
        this.candidate['attributes'][namespaceUrn] = this.secondFormGroup.get('loginCtrl')
          .value as string;
      }
      this.createSpecificMember();
    }
  }

  createSpecificMember(): void {
    this.membersManagerService
      .createSpecificMember({
        vo: this.data.voId,
        specificUserType: 'SERVICE',
        specificUserOwners: this.assignedMembers.map((m) => m.user),
        candidate: this.candidate,
      })
      .subscribe(
        (member) => {
          this.membersManagerService.validateMemberAsync(member.id).subscribe(
            (mem) => {
              this.notificator.showSuccess(this.successMessageMember);
              if (this.secondFormGroup.get('namespaceCtrl').value !== 'Not selected') {
                this.setPassword(
                  mem,
                  this.secondFormGroup.get('generatePasswordCtrl').value as boolean
                );
              } else {
                this.dialogRef.close(true);
                this.processing = false;
              }
            },
            () => (this.processing = false)
          );
        },
        () => (this.processing = false)
      );
  }

  parseNamespaceRules(): void {
    for (const rule of this.namespaceRules) {
      this.namespaceOptions.push(rule.namespaceName);

      const fieldTypes = { login: 'disabled' };
      this.parseAttributes(fieldTypes, rule.requiredAttributes, 'required');
      this.parseAttributes(fieldTypes, rule.optionalAttributes, 'optional');

      this.parsedRules.set(rule.namespaceName, fieldTypes);
    }
  }

  parseAttributes(field: { login: string }, attributes: string[], type: string): void {
    for (const att of attributes) {
      switch (att) {
        case 'login': {
          field.login = type;
          break;
        }
        default:
          break;
      }
    }
  }

  setPassword(member: Member, generateRandom: boolean): void {
    const namespace: string = (
      this.secondFormGroup.get('namespaceCtrl').value as string
    ).toLowerCase();
    const password: string = this.secondFormGroup.get('passwordCtrl').value as string;
    if (generateRandom) {
      if (this.parsedRules.get(namespace).login === 'disabled') {
        this.validateMember(member.id);
        return; // password already set when account was generated
      }
      this.usersManagerService.reserveRandomPassword(member.userId, namespace).subscribe(
        () => {
          this.usersManagerService.validatePasswordForUser(member.userId, namespace).subscribe(
            () => {
              this.validateMember(member.id, false);
            },
            () => {
              this.processing = false;
              this.dialogRef.close(true);
            }
          );
        },
        () => {
          this.processing = false;
          this.dialogRef.close(true);
        }
      );
    } else {
      this.usersManagerService
        .reservePasswordForUser({ user: member.userId, namespace: namespace, password: password })
        .subscribe(
          () => {
            this.usersManagerService.validatePasswordForUser(member.userId, namespace).subscribe(
              () => {
                this.validateMember(member.id);
              },
              () => {
                this.processing = false;
                this.dialogRef.close(true);
              }
            );
          },
          () => {
            this.processing = false;
            this.dialogRef.close(true);
          }
        );
    }
  }

  validateMember(memberId: number, showNotification = true): void {
    this.membersManagerService.validateMemberAsync(memberId).subscribe(
      () => {
        if (showNotification) {
          this.notificator.showSuccess(this.successMessagePwd);
        }
        this.dialogRef.close(true);
        this.processing = false;
      },
      () => {
        this.processing = false;
        this.dialogRef.close(true);
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSearchByString(): void {
    this.loading = true;
    this.membersManagerService
      .findCompleteRichMembersForVo(this.data.voId, [''], this.searchCtrl.value as string)
      .subscribe((members) => {
        this.members = members.filter((m) => !m.user.specificUser);
        this.firstSearchDone = true;
        this.loading = false;
      });
  }

  addUsers(): void {
    const temp = this.assignedMembers.map((m) => m.id);
    this.selection.selected.forEach((member) => {
      if (!temp.includes(member.id)) {
        this.assignedMembers.push(member);
      }
    });
    this.selection.clear();
  }

  removeUser(member: RichMember): void {
    this.assignedMembers = this.assignedMembers.filter((m) => m.id !== member.id);
  }

  onNamespaceChanged(namespace: string): void {
    this.selectedNamespace = namespace.toLowerCase();
    const login = this.secondFormGroup.get('loginCtrl');
    const password = this.secondFormGroup.get('passwordCtrl');
    const passwordAgain = this.secondFormGroup.get('passwordAgainCtrl');
    const generatePassword = this.secondFormGroup.get('generatePasswordCtrl');
    if (namespace !== 'Not selected') {
      if (this.parsedRules.get(this.selectedNamespace).login === 'disabled') {
        login.disable();
        login.setValue('');
      } else {
        const loginValidators = [
          Validators.required,
          Validators.pattern('^[a-z][a-z0-9_-]+$'),
          Validators.maxLength(15),
          Validators.minLength(2),
        ];
        enableFormControl(login, loginValidators, [this.existingLoginValidator()]);
      }
      enableFormControl(generatePassword, []);
      this.passwordOptionChanged();
    } else {
      login.disable();
      login.setValue('');
      password.disable();
      password.setValue('');
      passwordAgain.disable();
      passwordAgain.setValue('');
      generatePassword.disable();
      if (!generatePassword.dirty) {
        generatePassword.setValue(true);
      }
    }
  }

  passwordOptionChanged(): void {
    const password = this.secondFormGroup.get('passwordCtrl');
    const passwordAgain = this.secondFormGroup.get('passwordAgainCtrl');
    if (this.secondFormGroup.get('generatePasswordCtrl').value) {
      password.disable();
      password.setValue('');
      passwordAgain.disable();
      passwordAgain.setValue('');
    } else {
      enableFormControl(
        password,
        [Validators.required],
        [
          loginAsyncValidator(
            this.selectedNamespace,
            this.usersManagerService,
            this.apiRequestConfiguration
          ),
        ]
      );
      enableFormControl(passwordAgain, []);
    }
  }

  getStepperNextConditions(): boolean {
    switch (this.stepper.selectedIndex) {
      case 0:
        return this.firstFormGroup.invalid || this.firstFormGroup.pending;
      case 1:
        return this.secondFormGroup.invalid || this.secondFormGroup.pending;
      default:
        return false;
    }
  }

  stepperPrevious(): void {
    this.stepper.previous();
  }

  stepperNext(): void {
    this.stepper.next();
  }
}
