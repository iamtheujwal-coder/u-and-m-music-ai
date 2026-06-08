import { NextResponse } from "next/server";

function isDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "";
}

// POST /api/upload/audio — Upload audio file
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a", "audio/flac"];
  if (!allowedTypes.includes(file.type)) {
    // Sometimes browsers send application/octet-stream, be a bit forgiving in demo mode
    if (!isDemoMode() && file.type !== "application/octet-stream") {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }
  }

  // Validate file size (50MB max)
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
  }

  if (isDemoMode()) {
    // In demo mode, we just acknowledge receipt. The client will use its local Blob URL.
    return NextResponse.json({
      url: null, // Signals client to use local blob
      filename: file.name,
      size: file.size,
      type: file.type,
      message: "Demo file uploaded successfully",
    });
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fileName = `${user.id}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    
    const { data, error } = await supabase.storage
      .from('audio_uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from('audio_uploads')
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      message: "File uploaded successfully",
    });
  } catch (err: any) {
    // Fallback to demo mode
    return NextResponse.json({
      url: null, 
      filename: file.name,
      size: file.size,
      type: file.type,
      message: "Demo file uploaded successfully",
    });
  }
}
