import { connectDB } from "@/lib/mongodb";
import Content from "@/models/Content";

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

export async function POST(request) {
  // Fallback: allow POST for DELETE operations
  return DELETE(request);
}
