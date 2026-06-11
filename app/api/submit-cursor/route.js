import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/utils/supabaseServer";
import { createHash } from "crypto";

// Rate limit: 1 request per 60 seconds per IP
const RATE_LIMIT_WINDOW = 60 * 1000;
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

export async function POST(request) {
  try {
    // Check Supabase connection
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database connection unavailable" },
        { status: 503 }
      );
    }

    // Get client IP and hash it for rate limiting
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

    const { asset_id } = body;

    if (!asset_id || typeof asset_id !== "string" || asset_id.trim() === "") {
      return NextResponse.json(
        { error: "Asset ID is required" },
        { status: 400 }
      );
    }

    const sanitizedAssetId = asset_id.trim();

    // 1. Fetch image URL from Roblox Thumbnails API
    const robloxApiUrl = `https://thumbnails.roblox.com/v1/assets?assetIds=${sanitizedAssetId}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`;
    const robloxRes = await fetch(robloxApiUrl);
    const robloxData = await robloxRes.json();

    if (!robloxData.data || robloxData.data.length === 0) {
      return NextResponse.json(
        { error: "Invalid Asset ID or Roblox API unavailable" },
        { status: 400 }
      );
    }

    const imageUrl = robloxData.data[0].imageUrl;
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Could not retrieve image for this Asset ID" },
        { status: 400 }
      );
    }

    // 2. Fetch the actual image and convert to Base64
    const imageRes = await fetch(imageUrl);
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    const dataUri = `data:image/png;base64,${base64Data}`;

    // 3. Insert into cursor_submissions table
    const { data, error } = await supabaseAdmin
      .from("cursor_submissions")
      .insert({
        asset_id: sanitizedAssetId,
        image_base64: dataUri,
        status: "pending",
        ip_hash: ipHash,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error inserting cursor submission:", error);
      return NextResponse.json(
        { error: "Failed to submit cursor. Please try again later." },
        { status: 500 }
      );
    }

    // Update rate limit
    rateLimitMap.set(ipHash, now);

    return NextResponse.json(
      {
        success: true,
        message: "Cursor submitted successfully",
        id: data.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error in submit-cursor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
