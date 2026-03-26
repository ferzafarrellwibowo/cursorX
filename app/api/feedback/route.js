import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabaseServer";
import { createHash } from "crypto";

// Rate limit: 1 request per 30 seconds per IP
const RATE_LIMIT_WINDOW = 30 * 1000; // 30 seconds in ms
const rateLimitMap = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

function hashIP(ip) {
  return createHash("sha256").update(ip || "unknown").digest("hex").slice(0, 16);
}

function getClientIP(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || realIP || "unknown";
}

function validateFeedback(data) {
  const errors = [];

  // Check if text exists
  if (!data.text || typeof data.text !== "string") {
    errors.push("Text is required and must be a string");
    return { valid: false, errors };
  }

  // Trim and check length
  const trimmedText = data.text.trim();
  if (trimmedText.length === 0) {
    errors.push("Text cannot be empty");
  }
  if (trimmedText.length > 500) {
    errors.push("Text must be 500 characters or less");
  }

  // Validate type
  const validTypes = ["feedback", "report", "bug"];
  const type = data.type || "feedback";
  if (!validTypes.includes(type)) {
    errors.push("Invalid feedback type");
  }

  // Validate cursor_id if provided
  if (data.cursor_id && typeof data.cursor_id !== "string") {
    errors.push("cursor_id must be a string");
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      text: trimmedText,
      type,
      cursor_id: data.cursor_id || null,
    },
  };
}

export async function POST(request) {
  try {
    // Check Supabase connection
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database connection unavailable" },
        { status: 503 }
      );
    }

    // Get client IP and hash it
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);

    // Rate limiting check
    const lastRequest = rateLimitMap.get(ipHash);
    const now = Date.now();

    if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW) {
      const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - lastRequest)) / 1000);
      return NextResponse.json(
        { error: `Please wait ${waitTime} seconds before submitting again` },
        { status: 429 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validateFeedback(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    // Insert into database using query builder (NO raw SQL)
    const { data, error } = await supabaseAdmin
      .from("feedback")
      .insert({
        text: validation.sanitized.text,
        type: validation.sanitized.type,
        cursor_id: validation.sanitized.cursor_id,
        ip_hash: ipHash,
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to submit feedback" },
        { status: 500 }
      );
    }

    // Update rate limit
    rateLimitMap.set(ipHash, now);

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully",
        id: data.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Disable other methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
