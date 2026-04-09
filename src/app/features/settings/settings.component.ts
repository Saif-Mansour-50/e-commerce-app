import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const rePassword = control.get('rePassword')?.value;

  if (password && rePassword && password !== rePassword) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  isHidden = signal<boolean>(true);
  isHiddenNew = signal<boolean>(true);
  isHiddenConfirm = signal<boolean>(true);

  changePasswordForm: FormGroup = this.fb.group(
    {
      currentPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      rePassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  profile = signal({
    fullName: 'saif',
    email: 'saif@gmail.com',
    phoneNumber: '0123456789',
  });

  accountInfo = signal({
    userId: 'USR-2024-001234',
    role: 'Administrator',
  });

  isSavingProfile = signal<boolean>(false);
  isChangingPassword = signal<boolean>(false);
  profileSaved = signal<boolean>(false);
  passwordChanged = signal<boolean>(false);
  passwordStrength = signal<'weak' | 'medium' | 'strong' | ''>('');
  passwordError = signal<string>('');

  get currentPassword() {
    return this.changePasswordForm.get('currentPassword');
  }
  get password() {
    return this.changePasswordForm.get('password');
  }
  get rePassword() {
    return this.changePasswordForm.get('rePassword');
  }

  validatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength.set('');
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[#?!@$%^&*-]/.test(password)) strength++;

    if (strength <= 2) this.passwordStrength.set('weak');
    else if (strength <= 4) this.passwordStrength.set('medium');
    else this.passwordStrength.set('strong');
  }

  onPasswordChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.password?.setValue(input.value);
    this.validatePasswordStrength(input.value);
  }

  saveProfile(): void {
    this.isSavingProfile.set(true);

    setTimeout(() => {
      console.log('Profile saved:', this.profile());
      this.isSavingProfile.set(false);
      this.profileSaved.set(true);
      setTimeout(() => this.profileSaved.set(false), 3000);
    }, 500);
  }

  changePassword(): void {
    if (this.changePasswordForm.invalid) {
      if (this.changePasswordForm.hasError('passwordMismatch')) {
        this.passwordError.set('New password and confirmation do not match');
      } else if (this.password?.hasError('pattern')) {
        this.passwordError.set(
          'Password must contain uppercase, lowercase, number and special character',
        );
      } else if (this.currentPassword?.hasError('pattern')) {
        this.passwordError.set('Current password must follow the same requirements');
      } else {
        this.passwordError.set('Please check the entered data');
      }
      return;
    }

    this.isChangingPassword.set(true);
    this.passwordError.set('');

    const passwordData = {
      currentPassword: this.changePasswordForm.value.currentPassword,
      password: this.changePasswordForm.value.password,
      rePassword: this.changePasswordForm.value.rePassword,
    };

    this.authService.changeMyPassword(passwordData).subscribe({
      next: (res) => {
        this.isChangingPassword.set(false);
        this.passwordChanged.set(true);

        this.changePasswordForm.reset();
        this.passwordStrength.set('');

        setTimeout(() => this.passwordChanged.set(false), 3000);

        localStorage.setItem('freshToken', res.token);
        console.log(res);
      },
      error: (error) => {
        this.isChangingPassword.set(false);
        this.passwordError.set(
          error.error?.message || 'An error occurred while changing the password',
        );
      },
    });
  }

  cancelPassword(): void {
    this.changePasswordForm.reset();
    this.passwordStrength.set('');
    this.passwordError.set('');
  }
}
