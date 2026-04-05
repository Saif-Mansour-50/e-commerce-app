import { SettingsComponent } from './features/settings/settings.component';
import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((c) => c.HomeComponent),
    title: 'home page',
  },
  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.component').then((c) => c.ShopComponent),
    title: 'shop page',
  },

  {
    path: 'brands',
    loadComponent: () =>
      import('./features/brands/brands.component').then((c) => c.BrandsComponent),
    title: 'brands page',
  },
  {
    path: 'brandDetails/:id/:slug',
    loadComponent: () =>
      import('./features/brand-details/brand-details.component').then(
        (c) => c.BrandDetailsComponent,
      ),
    title: 'brands spacific ',
  },
  {
    path: 'electronics',
    loadComponent: () =>
      import('./features/electronics/electronics.component').then((c) => c.ElectronicsComponent),
    title: 'Electronics',
  },
  {
    path: 'women-fashion',
    loadComponent: () =>
      import('./features/women-fashion/women-fashion.component').then(
        (c) => c.WomenFashionComponent,
      ),
    title: "Women's Fashion",
  },
  {
    path: 'men-fashion',
    loadComponent: () =>
      import('./features/men-fashion/men-fashion.component').then((c) => c.MenFashionComponent),
    title: "Men's Fashion",
  },
  {
    path: 'beauty-health',
    loadComponent: () =>
      import('./features/beauty-health/beauty-health.component').then(
        (c) => c.BeautyHealthComponent,
      ),
    title: 'Beauty & Health',
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then((c) => c.SettingsComponent),
    title: 'Beauty & Health',
  },

  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/wishlist/wishlist.component').then((c) => c.WishlistComponent),
    title: 'wishlist page',
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then((c) => c.CartComponent),
    title: 'cart page',
  },
  {
    path: 'details/:id/:slug',
    loadComponent: () =>
      import('./features/details/details.component').then((c) => c.DetailsComponent),
    title: 'details page',
  },
  {
    path: 'checkout/:id',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((c) => c.CheckoutComponent),
    title: 'checkout page',
    canActivate: [authGuard],
  },
  {
    path: 'allorders',
    loadComponent: () =>
      import('./features/orders/orders.component').then((c) => c.OrdersComponent),
    title: 'orders page',
  },
  {
    path: 'allCategories',
    loadComponent: () =>
      import('./features/all-categories/all-categories.component').then(
        (c) => c.AllCategoriesComponent,
      ),
    title: 'orders page',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((c) => c.LoginComponent),
    title: 'login page',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then((c) => c.RegisterComponent),
    title: 'register page',
  },
  {
    path: 'forget',
    loadComponent: () =>
      import('./features/forgetbassword/forgetbassword.component').then(
        (m) => m.ForgetbasswordComponent,
      ),
    title: 'forget password page',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/notfound/notfound.component').then((c) => c.NotfoundComponent),
    title: 'page not found',
  },
];
