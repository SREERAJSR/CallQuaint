import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { SubscribedUser } from 'src/app/types/subscription.interfaces';

@Component({
  selector: 'app-premiumcard',
  templateUrl: './premiumcard.component.html',
  styleUrls: ['./premiumcard.component.css']
})
export class PremiumcardComponent implements OnInit,OnDestroy{
  authServices = inject(AuthService);

  currentPlanSubscription?: Subscription;

  ngOnInit(): void {
    this.currentPlanSubscription =this.authServices.getCurrentSubscriptionDetails().subscribe(
      {
        next: (response: ApiResponse) => {
          const currentSubscription = response.data as SubscribedUser;
          this.planDetails = currentSubscription;
        }
      }
    )
  }

  planDetails?: SubscribedUser;

ngOnDestroy(): void {
  this.currentPlanSubscription?.unsubscribe()
}
  
}
