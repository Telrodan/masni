import { Injectable } from '@angular/core';

import { Stripe } from '@stripe/stripe-js';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = this.loadStripe();
  }

  private loadStripe(): Promise<Stripe | null> {
    return new Promise((resolve) => {
      if (window.Stripe) {
        resolve(window.Stripe(environment.stripeKey));
      } else {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => {
          resolve(window.Stripe(environment.stripeKey));
        };
        document.body.appendChild(script);
      }
    });
  }

  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }
}
