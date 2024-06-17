import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { escape } from 'lodash';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { emailValidator, lowerCaseValidator } from 'src/app/custom-validators/auth-validators';
import { PaymentService } from 'src/app/services/payment.service';
import { SharedService } from 'src/app/services/shared.service';
import { WindowRefService } from 'src/app/services/window-ref.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { CheckoutPageProviderInterface, ICreateOrderRequestBody, RazorpayOrderSuccessResponse, SubscriptionCreateOrderResponse, paymentmethodsEnum } from 'src/app/types/subscription.interfaces';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  formbuilder = inject(FormBuilder);
  orderUserDetailsForm: FormGroup
  sharedServices = inject(SharedService)
  toastr = inject(ToastrService)
  paymentService = inject(PaymentService)
  windowRef = inject(WindowRefService)
  router = inject(Router)

  constructor() {
     
    this.orderUserDetailsForm = this.formbuilder.group({
      paymentmethod: ['razorpay', [Validators.required]],
      fullname: ['', [Validators.required]],
      email: ["", [Validators.required, Validators.email, emailValidator(), lowerCaseValidator()]],
      mobile: ['', [Validators.min(10), Validators.pattern(/^\d{10}$/), Validators.required]]
    })

    
    
  }

  ngOnInit(): void {



    this.checkoutInfoProviderSubscription = this.sharedServices.checkoutInfoProvider$.subscribe({
      next: (info: CheckoutPageProviderInterface | null) => {
        console.log(info, 'checkout ');
        if (info) {
          this.amount = info.amount,
            this.planId = info.subscriptionPlanId
          this.planname = info.planname
          this.features = info.features
        }
      }
    })
  }
  amount: number = 0;
  planId?: string
  planname: string = 'select a plan'
  features: string[] = []
  createOrderSubscription?: Subscription
  orderSucessSubscription?: Subscription
  orderFailedSubscription?: Subscription
  checkoutInfoProviderSubscription?: Subscription
  makePayment() {
    const values = this.orderUserDetailsForm.value as ICreateOrderRequestBody
    console.log(this.orderUserDetailsForm.value);
    if (this.orderUserDetailsForm.valid) {
      const payload: ICreateOrderRequestBody = {
        amount: this.amount,
        fullname: values.fullname,
        mobile: values.mobile,
        paymentmethod: values.paymentmethod,
        planId: this.planId!,
        email: values.email
      }
      this.createOrderSubscription = this.paymentService.createOrder(payload).subscribe({
        next: (response: ApiResponse) => {
          const createOrderedInfo = response.data.newOrder as SubscriptionCreateOrderResponse
          const key_id = response.data.keyId as string
          console.log(createOrderedInfo);
          if (createOrderedInfo.paymentmethod === paymentmethodsEnum.RAZORPAY) {
            this.paywithRazor(createOrderedInfo, key_id)
          }
        }
      })
    } else {
      this.toastr.error("please fill every field to make payment")
    }
  }

  paywithRazor(val: SubscriptionCreateOrderResponse, keyId: string) {
    const options: any = {
      key: keyId,
      amount: val.amount * 100,
      currency: 'INR',
      name: val.fullname,
      description: "",
      image: '',
      prefills: {
        name: val.fullname,
        email: val.email,
        phone: val.mobile
      },
      order_id: val.orderId,
      modal: {
        escape: false
      },
      notes: {},
      theme: '#0c238a',
      
    }
    options.handler = ((response: RazorpayOrderSuccessResponse, error: any) => {
      options.response = response;
      if (error) {
        this.toastr.error(error)
        this.orderFailedSubscription = this.paymentService.orderFailed(val.orderId).subscribe()
      }
      if (response.status_code === 200) {
        this.orderSucessSubscription = this.paymentService.orderSuccess(response).subscribe((response) => {
          if (response.statusCode === 200) {
            this.toastr.success('You are now a premium member')
            this.router.navigate(['/home'])
            this.amount = 0;
            this.features = []
            this.planId = ''
          }
        })
      }

    })
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
      this.orderFailedSubscription = this.paymentService.orderFailed(val.orderId).subscribe({
        next: (response: ApiResponse) => {
          if (response.statusCode === 200) {
            this.toastr.error('Transcation failed,try again!!');
          }
        }
      })

    });
    const rzp = new this.windowRef.nativeWindow.Razorpay(options)
    rzp.open()
  }



  ngOnDestroy(): void {
    this.checkoutInfoProviderSubscription?.unsubscribe();
    this.orderSucessSubscription?.unsubscribe();
    this.orderFailedSubscription?.unsubscribe();
  }
  paymentRequest :google.payments.api.PaymentDataRequest = {

 apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD']
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example',
            gatewayMerchantId: 'exampleGatewayMerchantId'
          }
        }
      }
    ],
    merchantInfo: {
      merchantId: '12345678901234567890',
      merchantName: 'Demo Merchant'

    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: this.amount.toString(),
      currencyCode: 'INR',
      countryCode: 'IN'
    },
    emailRequired: true,
  }

  buttonWidth = 240;

  makeGpayPayment(event: any) {
    console.log(event.detail);
    const values = this.orderUserDetailsForm.value as ICreateOrderRequestBody
    console.log(this.orderUserDetailsForm.value);
    if (this.orderUserDetailsForm.valid) {
      const payload: ICreateOrderRequestBody = {
        amount: this.amount,
        fullname: values.fullname,
        mobile: values.mobile,
        paymentmethod: values.paymentmethod,
        planId: this.planId!,
        email: event.detail.email
      }
      this.paymentService.gpayOrderSucess(payload).subscribe({
        next: (response: ApiResponse) => {
          if (response.statusCode === 200) {
           
            this.router.navigate(['/home'])
            this.amount = 0;
            this.features = []
            this.planId = ''
                    this.toastr.success('You are now a premium member')
          }
        }
      })
  
    }
  }
}

