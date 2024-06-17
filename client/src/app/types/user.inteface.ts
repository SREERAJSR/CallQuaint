export interface User {
  _id: string;
  avatar: string;
  firstname: string;
  lastname: string;
  gender: string;
  email: string;
  role: 'USER' | 'ADMIN'; // Add other roles if needed
  requests: string[]; // Assuming requests are strings (e.g., request IDs)
  friends: string[]; // Assuming friends are user IDs
  loginType: 'GOOGLE' | 'FACEBOOK' | 'EMAIL'; // Add other login types if needed
  isEmailVerified: boolean;
  channelName: string;
  expireAt: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  requestSent: string[]; // Assuming requestSent are user IDs
  subscription: boolean;
  subscriptionEndDate: Date;
}
