import xenditClient from "@/services/xendit.service";

export interface CreatePaymentParams {
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail?: string;
  description: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export async function CreateXenditPayment(params: CreatePaymentParams) {
  try {
    // Check if Xendit is configured
    if (!process.env.XENDIT_SECRET_KEY) {
      console.warn("XENDIT_SECRET_KEY not configured, skipping payment creation");
      return {
        success: false,
        invoiceId: null,
        invoiceUrl: null,
        status: "skipped",
      };
    }

    const { Invoice } = xenditClient;
    
    const invoiceData: any = {
      externalId: params.orderId,
      amount: params.amount,
      description: params.description,
      invoiceDuration: 86400, // 24 hours
      customer: {
        givenNames: params.customerName,
        email: params.customerEmail,
      },
      items: params.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      successRedirectUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/orders?payment=success`,
      failureRedirectUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/checkout?payment=failed`,
    };

    // Try different possible method names for xendit-node v7
    let invoice: any;
    const invoiceApi = Invoice as any;
    
    if (typeof invoiceApi.createInvoice === 'function') {
      invoice = await invoiceApi.createInvoice({ data: invoiceData });
    } else if (typeof invoiceApi.create === 'function') {
      invoice = await invoiceApi.create({ data: invoiceData });
    } else {
      // If neither method exists, throw error
      throw new Error("Unable to find Invoice API method. Xendit SDK may have changed.");
    }

    return {
      success: true,
      invoiceId: invoice.id,
      invoiceUrl: invoice.invoiceUrl,
      status: invoice.status,
    };
  } catch (error: any) {
    console.error("Xendit payment creation error:", error);
    // Return a failed response instead of throwing to allow order creation to continue
    return {
      success: false,
      invoiceId: null,
      invoiceUrl: null,
      status: "failed",
      error: error?.message || "Failed to create payment",
    };
  }
}

