import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/services/payment.service';
import { SharedService } from 'src/app/services/shared.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { CheckoutPageProviderInterface, IsubscriptionPlans } from 'src/app/types/subscription.interfaces';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  paymentService = inject(PaymentService)
  toast = inject(ToastrService)
  router = inject(Router)
  ngOnInit(): void {
    this.paymentService.getSubscriptionPlans().subscribe({
      next: (response: ApiResponse) => {
        this.subscriptionPlans = response.data.subscriptionPlans
        this.isSubscriberUser = response.data.user
  }
})
  }
  isSubscriberUser:boolean =false
  subscriptionPlans?: IsubscriptionPlans[]
  sharedService = inject(SharedService)
  sendcheckoutProviderInfo(amount: number, planId: string, planname: string, features:string[]) {
    const payload: CheckoutPageProviderInterface = {
      amount: amount,
      subscriptionPlanId: planId,
      planname: planname,
      features:features
    }

    console.log(payload);
    this.sharedService.sendCheckoutInfoProvider(payload)      
      this.router.navigate(['subscriptions/checkout'])

  }
}
