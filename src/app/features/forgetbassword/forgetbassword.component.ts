import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-forgetbassword',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './forgetbassword.component.html',
  styleUrl: './forgetbassword.component.css',
})
export class ForgetbasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  step = signal<number>(1);

  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  code: FormControl = new FormControl('', [Validators.required]);
  password: FormControl = new FormControl('', [Validators.required]);

  submitEmail(e: Event): void {
    e.preventDefault();
    if (this.email.valid) {
      const data = {
        email: this.email.value,
      };

      this.authService.forgotPasswords(data).subscribe({
        next: (res) => {
          console.log(res);
          this.step.set(2);
        },
      });
    }
  }

  submitCode(e: Event) {
    e.preventDefault();

    if (this.code.valid) {
      const data = {
        code: this.code.value,
      };

      this.authService.verifyResetCode(data).subscribe({
        next: (res) => {
          console.log(res);
          this.step.set(3);
        },
      });
    }
  }

  submitPassword(e: Event) {
    e.preventDefault();

    if (this.password.valid) {
      const data = {
        email: this.email.value,
        newPassword: this.password.value,
      };

      this.authService.resetPassword(data).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/login']);
        },
      });
    }
  }

  emailAddress(): void {
    this.step.set(1);
  }
}
