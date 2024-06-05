export interface Sender {
  _id: string;
  avatar: string;
  firstname: string;
  email: string;
}

export interface Message {
  _id: string;
  sender: Sender;
  content: string;
  attachments: any[]; // If you have a specific structure for attachments, you can define it instead of using 'any[]'
  chat: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}