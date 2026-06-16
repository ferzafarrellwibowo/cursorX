import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assetId = searchParams.get("assetId");

  if (!assetId) {
    return NextResponse.json(
      { error: "Asset ID is required" },
      { status: 400 }
    );
  }

  try {
    const robloxApiUrl = `https://economy.roblox.com/v2/assets/${assetId}/details`;
    const response = await fetch(robloxApiUrl, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Roblox API returned status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching Roblox asset details:", error);
    return NextResponse.json(
      { error: "Failed to fetch asset details from Roblox" },
      { status: 500 }
    );
  }
}
