interface ComplaintDetails {
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  id?: string;
}

const styles = {
  container: `background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px 0;`,
  card: `background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #e5e7eb;`,
  header: `background-color: #4f46e5; padding: 30px; text-align: center;`,
  headerText: `color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;`,
  body: `padding: 40px 30px; color: #374151; line-height: 1.6;`,
  label: `font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; display: block;`,
  value: `font-size: 16px; color: #111827; font-weight: 500; margin-bottom: 20px; display: block;`,
  divider: `border-top: 1px solid #e5e7eb; margin: 25px 0;`,
  footer: `background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;`,
  
  // FIXED: Replaced 'any' with 'Record<string, string>'
  statusBadge: (status: string) => {
    const colors: Record<string, string> = {
      'Resolved': '#059669', // Green
      'In Progress': '#2563eb', // Blue
      'Pending': '#d97706', // Orange
    };
    
    // Fallback to gray if status doesn't match
    const color = colors[status] || '#6b7280';
    
    return `display: inline-block; padding: 6px 12px; background-color: ${color}; color: #ffffff; border-radius: 9999px; font-size: 14px; font-weight: 600;`;
  }
};

// 1. Template for New Complaint (Sent to Admin)
export const generateNewComplaintEmail = (data: ComplaintDetails) => {
  return `
    <div style="${styles.container}">
      <div style="${styles.card}">
        <div style="${styles.header}">
          <h1 style="${styles.headerText}">New Ticket Received</h1>
        </div>
        <div style="${styles.body}">
          <p style="margin-top: 0;">Hello Admin,</p>
          <p>A new complaint has been submitted to the portal. Here are the details:</p>
          
          <div style="${styles.divider}"></div>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" valign="top">
                <span style="${styles.label}">Category</span>
                <span style="${styles.value}">${data.category}</span>
              </td>
              <td width="50%" valign="top">
                <span style="${styles.label}">Priority</span>
                <span style="color: ${data.priority === 'High' ? '#dc2626' : '#111827'}; font-weight: 700; font-size: 16px;">${data.priority}</span>
              </td>
            </tr>
          </table>

          <span style="${styles.label}">Issue Title</span>
          <span style="${styles.value}">${data.title}</span>

          <span style="${styles.label}">Description</span>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; color: #4b5563;">
            ${data.description}
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Open Admin Portal</a>
          </div>
        </div>
        <div style="${styles.footer}">
          &copy; ${new Date().getFullYear()} ComplaintBox System. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

// 2. Template for Status Update (Sent to Admin/User)
export const generateStatusUpdateEmail = (data: ComplaintDetails) => {
  return `
    <div style="${styles.container}">
      <div style="${styles.card}">
        <div style="${styles.header}">
          <h1 style="${styles.headerText}">Status Updated</h1>
        </div>
        <div style="${styles.body}">
          <p style="margin-top: 0;">The status of the following ticket has been changed.</p>
          
          <div style="${styles.divider}"></div>

          <div style="text-align: center; margin-bottom: 25px;">
            <span style="${styles.label}">New Status</span>
            <span style="${styles.statusBadge(data.status || 'Pending')}">${data.status}</span>
          </div>

          <span style="${styles.label}">Ticket Title</span>
          <span style="${styles.value}">${data.title}</span>

          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            This is an automated notification. You can view the full details in the dashboard.
          </p>
        </div>
        <div style="${styles.footer}">
          &copy; ${new Date().getFullYear()} ComplaintBox System.
        </div>
      </div>
    </div>
  `;
};

export const generateConfirmationEmail = (userName: string, ticketTitle: string) => {
  return `
    <div style="${styles.container}">
      <div style="${styles.card}">
        <div style="${styles.header}">
          <h1 style="${styles.headerText}">Complaint Received</h1>
        </div>
        <div style="${styles.body}">
          <p style="margin-top: 0;">Hello ${userName},</p>
          <p>We have received your complaint: <strong>"${ticketTitle}"</strong>.</p>
          
          <p>Our team has been notified and will review it shortly. You can track the status of your ticket by logging into your dashboard.</p>
          
          <div style="${styles.divider}"></div>

          <p style="color: #6b7280; font-size: 14px;">
            Thank you for helping us improve our services.
          </p>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">View Dashboard</a>
          </div>
        </div>
        <div style="${styles.footer}">
          &copy; ${new Date().getFullYear()} ComplaintBox System.
        </div>
      </div>
    </div>
  `;
};