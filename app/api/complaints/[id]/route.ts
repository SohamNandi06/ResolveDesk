import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import { sendNotification } from '@/lib/email';
import { generateStatusUpdateEmail } from '@/lib/templates'; // <--- Import this

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const { status } = await req.json();
    
    const complaint = await Complaint.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!complaint) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    //Generate email
    const emailHtml = generateStatusUpdateEmail({
      title: complaint.title,
      status: status
    });

    // Send Email
    await sendNotification(
      process.env.ADMIN_EMAIL!,
      `Status Update: ${complaint.title}`,
      emailHtml 
    );

    return NextResponse.json(complaint);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    await Complaint.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}