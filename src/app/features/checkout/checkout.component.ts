import { Component, inject, OnInit, PLATFORM_ID, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { Product } from '../../core/models/product.interface';

interface CartItem {
  count: number;
  price: number;
  product: Product;
  _id: string;
}

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
  isDefault?: boolean;
}

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  checkOut: FormGroup = this.fb.group({
    details: ['', Validators.required],
    phone: ['', Validators.required],
    city: ['', Validators.required],
  });

  addressForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    details: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ['', Validators.required],
  });

  flag = signal<string>('cash');
  cartId = signal<string>('');
  products = signal<CartItem[]>([]);
  totalPrice = signal<number>(0);

  addresses = signal<Address[]>([]);
  showAddressForm = signal<boolean>(false);
  selectedAddressId = signal<string>('');
  isLoadingAddresses = signal<boolean>(false);
  isAddingAddress = signal<boolean>(false);

  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      const selectedId = this.selectedAddressId();
      if (selectedId && this.addresses().length) {
        const address = this.addresses().find((a) => a._id === selectedId);
        if (address) {
          this.checkOut.patchValue({
            details: address.details,
            phone: address.phone,
            city: address.city,
          });
        }
      }
    });
  }

  changeFlag(el: HTMLInputElement): void {
    this.flag.set(el.value);
  }

  submitForm(): void {
    if (this.checkOut.valid) {
      if (this.flag() === 'cash') {
        this.cartService.creatCashOrder(this.cartId(), this.checkOut.value).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.router.navigate(['/orders']);
            }
          },
          error: (err) => console.error('Cash order error:', err),
        });
      } else {
        this.cartService.creatVisaOrder(this.cartId(), this.checkOut.value).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              window.open(res.session.url, '_self');
            }
          },
          error: (err) => console.error('Visa order error:', err),
        });
      }
    }
  }

  ngOnInit(): void {
    this.getCartId();
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getCartData();
      this.getUserAddresses();
    }
  }

  getCartId(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      console.log('Cart ID:', params.get('id'));
      this.cartId.set(params.get('id')!);
    });
  }

  getCartData(): void {
    this.cartService.getCartData().subscribe({
      next: (res) => {
        console.log('API Response:', res);
        if (res && res.data) {
          this.cartService.cartDetails.set(res.data);
          this.products.set(res.data.products);
          this.totalPrice.set(res.data.totalCartPrice);
        }
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.products.set([]);
        this.totalPrice.set(0);
      },
    });
  }

  getUserAddresses(): void {
    this.isLoadingAddresses.set(true);
    this.cartService.getUserAddresses().subscribe({
      next: (res) => {
        console.log('Addresses:', res);
        if (res && res.data) {
          this.addresses.set(res.data);
          if (res.data.length > 0) {
            this.selectedAddressId.set(res.data[0]._id);
          }
        }
        this.isLoadingAddresses.set(false);
      },
      error: (err) => {
        console.error('Error loading addresses:', err);
        this.isLoadingAddresses.set(false);
      },
    });
  }

  addAddress(): void {
    if (this.addressForm.valid) {
      this.isAddingAddress.set(true);
      this.cartService.addAddress(this.addressForm.value).subscribe({
        next: (res) => {
          console.log('Address added:', res);
          if (res && res.data) {
            this.addresses.set([...this.addresses(), res.data]);
            this.selectedAddressId.set(res.data._id);
            this.getUserAddresses();
            this.addressForm.reset();
          }
          this.isAddingAddress.set(false);
        },
        error: (err) => {
          console.error('Error adding address:', err);
          this.isAddingAddress.set(false);
        },
      });
    }
  }

  removeAddress(addressId: string): void {
    this.cartService.removeAddress(addressId).subscribe({
      next: (res) => {
        console.log('Address removed:', res);
        const updatedAddresses = this.addresses().filter((a) => a._id !== addressId);
        this.addresses.set(updatedAddresses);

        if (this.selectedAddressId() === addressId && updatedAddresses.length > 0) {
          this.selectedAddressId.set(updatedAddresses[0]._id);
        } else if (updatedAddresses.length === 0) {
          this.checkOut.reset();
        }
      },
      error: (err) => {
        console.error('Error removing address:', err);
      },
    });
  }

  selectAddress(addressId: string): void {
    this.selectedAddressId.set(addressId);
  }

  toggleAddressForm(): void {
    this.showAddressForm.set(!this.showAddressForm());
    if (!this.showAddressForm()) {
      this.addressForm.reset();
    }
  }
}
