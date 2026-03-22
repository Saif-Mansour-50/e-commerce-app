import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerForm: FormGroup = this.formBuilder.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      rePassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    },
    { validators: [this.confirmPassword] },
  );

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    if (rePassword !== password && rePassword !== '') {
      group.get('rePassword')?.setErrors({ mismatch: true });

      return { mismatch: true };
    }

    return null;
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.authService.signup(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message === 'success') {
            this.router.navigate(['/login']);
          }
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
