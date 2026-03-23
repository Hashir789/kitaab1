import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!googleScriptUrl) {
      return errorResponse("Server configuration error.", 500);
    }

    const formData = await req.formData();

    const payload = {
      name: clean(formData.get("name")),
      email: clean(formData.get("email")).toLowerCase(),
      phone: clean(formData.get("phone")),
      subject: clean(formData.get("subject")),
      message: clean(formData.get("message")),
    };

    if (!payload.name) return errorResponse("Name is required.", 400);
    if (!payload.email) return errorResponse("Email is required.", 400);
    if (!payload.subject) return errorResponse("Subject is required.", 400);
    if (!payload.message) return errorResponse("Message is required.", 400);

    if (!isValidEmail(payload.email)) {
      return errorResponse("Please enter a valid email address.", 400);
    }

    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" })
    );

    const date = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const response = await fetch(`${googleScriptUrl}?formType=contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formType: "contact",
        ...payload,
        phone: formatPhone(payload.phone),
        date,
        time,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to reach Google Script");
    }

    const data = (await safeJson(response)) as
      | { success?: boolean; error?: string }
      | null;

    if (!data?.success) {
      return errorResponse(
        data?.error || "Failed to submit contact form.",
        400
      );
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Contact submission error:", error);
    return errorResponse("Failed to send. Please try again.", 500);
  }
}

function clean(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9]([a-zA-Z0-9.]*[a-zA-Z0-9])?@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,}$/.test(
    email
  );
}

function formatPhone(phone: string): string {
  return phone.startsWith("+") ? `'${phone}` : phone;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}