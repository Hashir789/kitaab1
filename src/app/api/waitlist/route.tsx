import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!googleScriptUrl) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${googleScriptUrl}?action=count&formType=waitlist`, {
      method: "GET",
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to fetch count from Google Sheets");
    }

    const data = await response.json();
    
    return NextResponse.json(
      { count: data.count || 0 },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error("Waitlist count error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!googleScriptUrl) {
      console.error("GOOGLE_SCRIPT_URL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const pakistanTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
    
    const date = pakistanTime.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    
    const time = pakistanTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const response = await fetch(`${googleScriptUrl}?formType=waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formType: "waitlist", email, date, time }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit to Google Sheets");
    }

    const data = await response.json();
    
    if (!data.success) {
        
      let count = null;
      try {
        const countController = new AbortController();
        const countTimeoutId = setTimeout(() => countController.abort(), 5000);
        
        const countResponse = await fetch(`${googleScriptUrl}?action=count&formType=waitlist`, {
          method: "GET",
          signal: countController.signal,
          cache: 'no-store',
        });
        
        clearTimeout(countTimeoutId);
        
        if (countResponse.ok) {
          const countData = await countResponse.json();
          count = countData.count || 0;
        }
      } catch (error) {
      
      }

      return NextResponse.json(
        { 
          error: data.error || "Email already registered",
          count,
        },
        { status: 400 }
      );
    }

    try {
      const countController = new AbortController();
      const countTimeoutId = setTimeout(() => countController.abort(), 5000);
      
      const countResponse = await fetch(`${googleScriptUrl}?action=count&formType=waitlist`, {
        method: "GET",
        signal: countController.signal,
        cache: 'no-store',
      });
      
      clearTimeout(countTimeoutId);
      
      if (countResponse.ok) {
        const countData = await countResponse.json();
        return NextResponse.json({ 
          success: true, 
          count: countData.count || 0 
        });
      }
    } catch (error) {
      console.error("Failed to fetch updated count:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}