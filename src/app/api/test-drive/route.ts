import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { fullName, email, phone, city, dealership, preferredDate, transmission, consent } = body;

    // Server-side validation
    if (!fullName || !email || !phone || !preferredDate || consent !== true) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields or consent agreement.",
        },
        { status: 400 }
      );
    }

    // Generate unique confirmation ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const bookingReference = `KYLAQ-TD-${randomNum}`;

    // Return successful response
    return NextResponse.json({
      success: true,
      message: "Priority test drive request submitted successfully.",
      bookingReference,
      details: {
        fullName,
        dealership: dealership || "Škoda Experience Center",
        preferredDate,
        transmission,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred while processing test drive booking.",
      },
      { status: 500 }
    );
  }
}
