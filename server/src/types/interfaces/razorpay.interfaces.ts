export interface IRazorPayConfig{
    amount: number,
    currency: string,
    receipt:string
}

export interface IRazorpaycreateOrderRequestBody {
    email:string,
    amount: number,
    fullname: string,
    mobile: string,
    paymentmethod: 'razorpay' | 'stripe' | 'paypal',
    planId:string
}

export enum paymentmethodsEnum{
    RAZORPAY = 'razorpay',
    STRIPE = 'stripe',
    PAYPAL ='paypal'
}
export interface RazorpayOrderSuccessReqbody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  status_code: number;
}

export const paymentMethodsObjectEnums = Object.values(paymentmethodsEnum)