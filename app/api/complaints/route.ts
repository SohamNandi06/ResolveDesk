import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import { sendNotification } from '@/lib/email';

// GET: Retrieve all complaints (Admin)
export async function GET() {
  await connectDB();
  try {
    const complaints = await Complaint.find({}).sort({ dateSubmitted: -1 });
    return NextResponse.json(complaints);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch complaints' }, { status: 500 });
  }
}

// POST: Create a new complaint (User)
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { title, description, category, priority } = body;

    const newComplaint = await Complaint.create({
      title,
      description,
      category,
      priority,
    });

    // Email Notification to Admin
    await sendNotification(
      process.env.ADMIN_EMAIL!,
      `New Complaint: ${title}`,
      `<p><strong>Category:</strong> ${category}</p>
       <p><strong>Priority:</strong> ${priority}</p>
       <p><strong>Description:</strong> ${description}</p>`
    );

    return NextResponse.json(newComplaint, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit complaint' }, { status: 500 });
  }
}