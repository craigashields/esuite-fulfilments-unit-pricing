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

export async function GET(
  req: Request,
  { params: { id } }: Props,
  res: NextResponse<[] | ErrorResponse>
) {
  try {
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
        `${process.env.ESUITE_API_HOST}/api/accounts/${id}/fulfilments`,
        {
          headers: headers,
        }
      )) || {};

    let data;
    try {
      if (response.status === 204) {
        data = {};
      } else {
        data = await response.json();
      }
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
