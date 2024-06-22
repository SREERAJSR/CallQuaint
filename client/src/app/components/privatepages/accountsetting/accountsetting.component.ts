import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { SubscribedUser } from 'src/app/types/subscription.interfaces';

@Component({
  selector: 'app-accountsetting',
  templateUrl: './accountsetting.component.html',
  styleUrls: ['./accountsetting.component.css']
})
export class AccountsettingComponent implements OnInit ,OnDestroy{

    authServices = inject(AuthService);

  currentPlanSubscription?: Subscription;
toaxtr = inject(ToastrService)
  ngOnInit(): void {
    this.currentPlanSubscription =this.authServices.getCurrentSubscriptionDetails().subscribe(
      {
        next: (response: ApiResponse) => {
          const currentSubscription = response.data as SubscribedUser;
          this.subscribed = currentSubscription.subscription
        }
      }
    )
  }

  subscribed:boolean=false

  currentPage?:string='profile'

  setCurrentPage(page: string) {
    this.currentPage =page
  }
  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

   handleMouseOver() {
    if (!this.subscribed) {
      this.toaxtr.show("You are not a premium member  ");
    }
  }

  ngOnDestroy(): void {
    this.currentPlanSubscription?.unsubscribe()
  }
}
