
export interface IsubscriptionPlans{
  _id:string,
    planname:string,
    plantype: string,
    amount: number,
    features: string[] | [],
  planduration: number,
    plandurationunit: 'days' | 'weeks' | 'months' | 'years';
    
}


export interface CheckoutPageProviderInterface{
    subscriptionPlanId: string,
  amount: number,
  planname: string
  features:string[]
}


export interface ICreateOrderRequestBody {
    amount: number,
    fullname: string,
  mobile: string,
   email:string,
    paymentmethod: 'razorpay' | 'gpay',
    planId:string
}
export interface GpayOrderSucessReqBody{
     amount: number,
    fullname: string,
  mobile: string,
   email:string,
    paymentmethod: 'razorpay' | 'gpay',
    planId:string
}
export interface SubscriptionCreateOrderResponse {
  amount: number;
  fullname: string;
  mobile: string;
  orderId: string;
  orderStatus: string;
  paymentmethod:string
  planId: string;
  receipt: string;
  userId: string;
  __v: number;
  _id: string;
  email:string
}



export enum paymentmethodsEnum{
  RAZORPAY = 'razorpay',
  GPAY ='gpay'
}

export interface RazorpayOrderSuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  status_code: number;
}




export interface SubscriptionDetails {
  _id: string;
  planname: string;
  plantype: string;
  amount: number;
  features: string[];
  planduration: number;
  plandurationunit: string;
  __v: number;
}

export interface SubscribedUser {
  _id: string;
  avatar: string;
  firstname: string;
  email: string;
  subscription: boolean;
  subscriptionEndDate: string;
  subscriptionId: string;
  subscriptionDetails: SubscriptionDetails;
}