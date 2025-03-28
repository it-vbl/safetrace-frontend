import Stripe from 'stripe';

export async function upsertUserSubscription({
  subscriptionId,
  customerId,
  isCreateAction,
}: {
  subscriptionId: string;
  customerId: string;
  isCreateAction?: boolean;
}) {}

const copyBillingDetailsToCustomer = async (userId: string, paymentMethod: Stripe.PaymentMethod) => {};
