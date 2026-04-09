import {
  Component,
  computed,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../core/auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { User } from '../../core/models/user.interface';
import { ProductsService } from '../../core/services/products.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);
  protected readonly productsService = inject(ProductsService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  isLogged = computed(() => this.authService.isLogged());

  count = computed(() => this.cartService.cartCount());
  wishlistCount = computed(() => this.cartService.wishlistCount());

  currentUser = signal<User | null>(null);
  searchValue = signal<string>('');

  userName = computed(() => this.currentUser()?.name || 'Guest');
  userEmail = computed(() => this.currentUser()?.email || '');
  userRole = computed(() => this.currentUser()?.role || 'user');

  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getCartCount();
      if (localStorage.getItem('freshToken')) {
        this.authService.isLogged.set(true);
      }
      this.loadUserFromStorage();
      this.getwishlistCount();
    }

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  loadUserFromStorage(): void {
    const userData = localStorage.getItem('freshUser');
    if (userData) {
      try {
        const user = JSON.parse(userData) as User;
        this.currentUser.set(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.currentUser.set(null);
      }
    } else {
      this.currentUser.set(null);
    }
  }
  logOut() {
    this.authService.singOut();
  }

  getCartCount(): void {
    this.cartService.getCartData().subscribe({
      next: (res) => {
        this.cartService.cartDetails.set(res.data);
      },
    });
  }

  getwishlistCount(): void {
    this.productsService.getProductToWishList().subscribe({
      next: (res) => {
        this.cartService.wishlistCount.set(res.data.length);
      },
    });
  }

  onSearch() {
    const keyword = this.searchInput.nativeElement.value.trim();
    if (keyword) {
      this.router.navigate(['/search'], {
        queryParams: { keyword: keyword },
      });
    } else {
      this.router.navigate(['/search']);
    }
  }

  onEnter(event: Event) {
    event.preventDefault();
    this.onSearch();
  }
}
