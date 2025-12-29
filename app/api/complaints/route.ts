import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Complaint from '@/models/Complaint';
import User from '@/models/Users';
import { sendNotification } from '@/lib/email';
import { generateNewComplaintEmail, generateConfirmationEmail } from '@/lib/templates';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

// --- 1. GET Function (Fetching Complaints for Admin Table) ---
export async function GET() {
  await connectDB();
  try {
    const complaints = await Complaint.find({}).sort({ dateSubmitted: -1 });
    return NextResponse.json(complaints);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch complaints' }, { status: 500 });
  }
}

// --- 2. POST Function (Submitting new Complaint) ---
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { title, description, category, priority } = body;

    // A. Get User Data from Token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    let userName = 'Anonymous';
    let userEmail = null;

    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        userName = payload.name as string || 'Anonymous';
        
        if (payload.id) {
            const user = await User.findById(payload.id);
            if (user) userEmail = user.email;
        }

      } catch (err) {
        console.log("Token invalid or expired");
      }
    }

    // B. Save Complaint
    const newComplaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      userName,
    });

    // C. Email 1: Notify ALL Admins in the Database
    const adminEmailHtml = generateNewComplaintEmail({
      title,
      description,
      category,
      priority
    });

    // Find everyone with role="admin"
    const adminUsers = await User.find({ role: 'admin' });
    
    // Extract their emails
    const adminEmails = adminUsers.map(user => user.email);
    
    // Add the fallback from .env just in case DB lookup fails or is empty
    if (process.env.ADMIN_EMAIL && !adminEmails.includes(process.env.ADMIN_EMAIL)) {
        adminEmails.push(process.env.ADMIN_EMAIL);
    }

    if (adminEmails.length > 0) {
        console.log(`📧 Sending notifications to ${adminEmails.length} admins:`, adminEmails);
        
        // Send to all admins in parallel
        await Promise.all(adminEmails.map(email => 
            sendNotification(
                email,
                `New Ticket from ${userName}: ${title}`,
                adminEmailHtml
            )
        ));
    } else {
        console.warn("⚠️ No admin emails found to notify!");
    }

    // D. Email 2: Notify User (Confirmation)
    if (userEmail) {
      const userEmailHtml = generateConfirmationEmail(userName, title);
      
      await sendNotification(
        userEmail,
        `Ticket Received: ${title}`,
        userEmailHtml
      );
    }

    return NextResponse.json(newComplaint, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit complaint' }, { status: 500 });
  }
}