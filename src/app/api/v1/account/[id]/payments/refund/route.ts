import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ErrorResponse = {
  err: string;
};

type Props = {
  params: {
    id: string;
  };
};

export async function POST(
  req: Request,
  { params: { id } }: Props,
  res: NextResponse<[] | ErrorResponse>
) {
  try {
    const body = await req.json();

    if (!body) {
      return new NextResponse(
        JSON.stringify({
          err: "Please provide request body",
        }),
        {
          status: 400,
          statusText: "Bad Request",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!id) {
      return new NextResponse(
        JSON.stringify({
          err: "Please enter a valid Id",
        }),
        {
          status: 400,
          statusText: "Bad Request",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const {
      paymentReference,
      paymentLine,
      fulfilmentReference,
      unitPrice,
      reason,
    } = body;

    if (!paymentReference || !paymentLine || !unitPrice) {
      return new NextResponse(
        JSON.stringify({
          err: "Please provide all request data",
        }),
        {
          status: 400,
          statusText: "Bad Request",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const esuiteReq = {
      amount: unitPrice,
      reason: reason,
      reasonCode: reason,
      refundAsServiceCredits: true,
      itemReference: paymentLine,
      sendEmailReceiptToCustomer: true,
    };
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("X-ClientId", `${process.env.ESUITE_API_CLIENT}` || "");
    headers.append(
      "X-ClientPassword",
      `${process.env.ESUITE_API_PASSWORD}` || ""
    );
    headers.append("X-Version", `${process.env.ESUITE_API_VERSION}` || "");

    const response =
      (await fetch(
        `${process.env.ESUITE_API_HOST}/api/accounts/${id}/payments/${paymentReference}/refund`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(esuiteReq),
        }
      )) || {};

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
    }

    if (!response.ok) {
      return new NextResponse(JSON.stringify(data), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // add url to each object.
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Server Error", {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
