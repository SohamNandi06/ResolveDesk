import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import { sendNotification } from '@/lib/email';

// PATCH: Update status (Admin)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const { status } = await req.json();
    const complaint = await Complaint.findByIdAndUpdate(
      params.id, 
      { status }, 
      { new: true }
    );

    if (!complaint) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Email Notification to Admin confirming update
    await sendNotification(
      process.env.ADMIN_EMAIL!,
      `Status Updated: ${complaint.title}`,
      `<p>The status of complaint "<strong>${complaint.title}</strong>" has been updated to <strong>${status}</strong>.</p>`
    );

    return NextResponse.json(complaint);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE: Delete complaint (Admin)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    await Complaint.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}