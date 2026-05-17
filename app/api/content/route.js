import { connectDB } from "@/lib/mongodb";
import Content from "@/models/Content";

// In-memory store for mock data (persists during dev server lifetime)
let mockDataStore = [
  {
    id: "da131906-4b35-4ec7-9dec-7d9b7cd31495",
    title: "The Future of AI in Business",
    source: "Tech Magazine",
    summary: "Exploring how artificial intelligence is transforming business operations and creating new opportunities.",
    action: "Research AI implementation frameworks",
    priority: "high",
    category: "Technology",
    liked: false,
    completed: false,
    type: "idea"
  },
  {
    id: "cf872e9d-3b1a-4f2c-8e5a-9c4b2d1e7f6a",
    title: "Productivity Tips for Remote Work",
    source: "Work Blog",
    summary: "Best practices for maintaining productivity while working from home.",
    action: "Implement time-blocking technique",
    priority: "medium",
    category: "Productivity",
    liked: false,
    completed: false,
    type: "idea"
  },
  {
    id: "8e7d6f5c-4b3a-2e1d-9f8a-7c6b5a4d3e2f",
    title: "Understanding Cloud Architecture",
    source: "Dev Docs",
    summary: "Complete guide to cloud computing architecture and best practices.",
    action: "Study microservices design patterns",
    priority: "medium",
    category: "Technology",
    liked: false,
    completed: false,
    type: "idea"
  }
];

// CREATE CONTENT
export async function POST(req) {
  try {
    const body = await req.json();

    // Try database first, fallback to mock
    try {
      await connectDB();
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
    } catch (dbError) {
      // Fallback to mock data storage
      const newMock = {
        id: `mock-${Date.now()}`,
        ...body,
        type: body.type || "idea"
      };
      mockDataStore.push(newMock);
      return Response.json(newMock);
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// GET ALL CONTENT (with optional filtering by type)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    // Try to fetch from database, fallback to mock data
    let data = mockDataStore;
    
    try {
      await connectDB();
      let query = {};
      if (type === "ideas") {
        query = { $or: [{ type: "idea" }, { type: { $exists: false } }, { type: null }] };
      } else if (type === "actions") {
        query = { $or: [{ type: "action" }, { type: { $exists: false } }, { type: null }] };
      }
      const dbData = await Content.find(query).sort({ createdAt: -1 });
      if (dbData.length > 0) {
        data = dbData;
      }
    } catch (dbError) {
      // Use mock data if database connection fails
      data = mockDataStore;
    }

    return Response.json(data);
  } catch (error) {
    return Response.json(mockDataStore, { status: 200 });
  }
}

// DELETE CONTENT (and cascade delete related actions)
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    try {
      await connectDB();
      // Try MongoDB first
      let content = await Content.findById(id);
      if (!content) {
        content = await Content.findOne({ id: id });
      }
      if (!content) {
        return Response.json({ error: "Content not found" }, { status: 404 });
      }
      if (content.type === "idea") {
        await Content.deleteMany({ relatedIdeaId: content._id });
      }
      await Content.findByIdAndDelete(content._id);
    } catch (dbError) {
      // Fallback to mock data deletion
      const index = mockDataStore.findIndex(item => item.id === id);
      if (index === -1) {
        return Response.json({ error: "Content not found" }, { status: 404 });
      }
      const deletedItem = mockDataStore[index];
      mockDataStore.splice(index, 1);
      
      // Delete related actions if it's an idea
      if (deletedItem.type === "idea") {
        mockDataStore = mockDataStore.filter(item => item.relatedIdeaId !== id);
      }
    }

    return Response.json({ message: "Content deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE CONTENT (for toggling liked, completed status)
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    try {
      await connectDB();
      const updated = await Content.findByIdAndUpdate(id, body, { new: true });
      return Response.json(updated);
    } catch (dbError) {
      // Fallback to mock data update
      const index = mockDataStore.findIndex(item => item.id === id);
      if (index === -1) {
        return Response.json({ error: "Content not found" }, { status: 404 });
      }
      mockDataStore[index] = { ...mockDataStore[index], ...body };
      return Response.json(mockDataStore[index]);
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
