export interface AdminLoginPayload {
    email: string,
    password:string
}

export interface IsubscriptionPlanRequestBody{
    planname:string,
    plantype: string,
    amount: number,
    features: string[] | [],
  planduration: number,
    plandurationunit: 'days' | 'weeks' | 'months' | 'years';
    
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

export interface LastSubscribedUser {
  _id: string;
  avatar: string;
  firstname: string;
  email: string;
  subscriptionEndDate: string;
  subscriptionId?: string;
  subscriptionDetails?: SubscriptionDetails;
}

export interface DashboardData {
  totalUsers: number;
  successOrdersCount: number;
  currentSubscribersCount: number;
  randomCallsCount: number;
  salesByMonth: number[];
  normalUsers: number;
  last5subscribedUsers: LastSubscribedUser[];
}



export interface UserManagement {
    index?:number
  _id: string;
  avatar: string;
  firstname: string;
  lastname: string;
  email: string;
    subscription: boolean;
    isBlocked:boolean
}


export interface OrderDetail {
    index?:number
    _id: string;
    email: string;
    fullname: string;
    mobile: string;
    planId: string;
    paymentmethod: string;
    userId: string;
    amount: number;
    paymentStatus: string;
    receipt?: string;
    orderId: string;
    createdAt: string;
    updatedAt: string;
    paymentId?: string;
}

export interface SalesReport {
    _id: string | null;
    totalSales: number;
    count: number;
    details: OrderDetail[];
}
