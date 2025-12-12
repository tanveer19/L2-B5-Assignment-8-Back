export interface ICreateCheckoutSession {
  plan: "MONTHLY" | "YEARLY";
}

export interface ISubscriptionDetails {
  id: string;
  userId: string;
  plan: string;
  status: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface IPaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: string;
  plan: string;
  createdAt: Date;
}
