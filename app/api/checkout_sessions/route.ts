import { NextResponse, NextRequest } from "next/server";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: req.headers.get('Order')
            },
            unit_amount: 100 * Number(req.headers.get('Price'))
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${req.headers.get('origin')}/signup`,
      cancel_url: `${req.headers.get('origin')}/?canceled=true`,
      customer_email: req.headers.get('email') || undefined,
    });
    const response = new NextResponse(null, { status: 200 });
    response.headers.set('Location', session.url);
    return response;
  } catch (err: any) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
}