import { connectDB } from "@/lib/mongodb";
import Content from "@/models/Content";

// CREATE CONTENT
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const newContent = await Content.create({
      title: body.title || "Untitled",
      originalContent: body.originalContent,

      // TEMP (AI later)
      summary: "Generated summary...",
      insight: "Generated insight...",
      action: "Take action today!",
    });

    return Response.json(newContent);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// GET ALL CONTENT
export async function GET() {
  try {
    await connectDB();

    const data = await Content.find().sort({ createdAt: -1 });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}