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
      type: body.type || "idea",
      priority: body.priority || "medium",
      source: body.source || "Added content",
      category: body.category || "General",
      summary: body.summary || "Generated summary...",
      insight: body.insight || "Generated insight...",
      action: body.action || "Take action today!",
      relatedIdeaId: body.relatedIdeaId || null,
    });

    return Response.json(newContent);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// GET ALL CONTENT (with optional filtering by type)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let query = {};
    if (type === "ideas") {
      // Show all items as ideas (treat as ideas if no type specified)
      query = { $or: [{ type: "idea" }, { type: { $exists: false } }, { type: null }] };
    } else if (type === "actions") {
      // Show all items as actions (treat as ideas/actions if no type specified)
      query = { $or: [{ type: "action" }, { type: { $exists: false } }, { type: null }] };
    }

    const data = await Content.find(query).sort({ createdAt: -1 });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE CONTENT (and cascade delete related actions)
export async function DELETE(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    // Try to find and delete by ID (could be MongoDB _id or UUID)
    let content = await Content.findById(id);
    
    if (!content) {
      // Try finding by the id field if it's not a MongoDB ObjectId
      content = await Content.findOne({ id: id });
    }
    
    if (!content) {
      return Response.json({ error: "Content not found" }, { status: 404 });
    }

    // If it's an idea, delete all related actions
    if (content.type === "idea") {
      await Content.deleteMany({ relatedIdeaId: content._id });
    }

    // Delete the content itself
    await Content.findByIdAndDelete(content._id);

    return Response.json({ message: "Content deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE CONTENT (for toggling liked, completed status)
export async function PATCH(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = await Content.findByIdAndUpdate(id, body, { new: true });

    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
