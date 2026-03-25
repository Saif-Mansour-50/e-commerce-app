import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../core/auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  isLogged = computed(() => this.authService.isLogged());

  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('freshToken')) {
        this.authService.isLogged.set(true);
      }
    }

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
}
