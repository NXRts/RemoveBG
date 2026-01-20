import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key not configured" },
        { status: 500 }
      );
    }

    // Convert file to buffer for sending
    const imageBuffer = await image.arrayBuffer();

    // Prepare FormData for Remove.bg API
    const apiFormData = new FormData();
    apiFormData.append("image_file", new Blob([imageBuffer], { type: image.type }));
    apiFormData.append("size", "auto");
    
    // Call Remove.bg API
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Remove.bg API Error:", errorData);
      return NextResponse.json(
        { error: errorData.errors?.[0]?.title || "Failed to remove background" },
        { status: response.status }
      );
    }

    // Get the processed image blob
    const processedImageBlob = await response.blob();
    const processedImageBuffer = await processedImageBlob.arrayBuffer();

    return new NextResponse(processedImageBuffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });

  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Internal server error during processing" },
      { status: 500 }
    );
  }
}


