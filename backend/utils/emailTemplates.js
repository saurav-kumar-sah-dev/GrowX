export const applicationConfirmationEmail = ({ userName, jobTitle, companyName, jobLocation, jobType }) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);padding:40px 32px;text-align:center;">
      <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <span style="font-size:28px;">🚀</span>
      </div>
      <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:800;letter-spacing:-0.5px;">Application Submitted!</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:15px;">Your application is on its way</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 32px;">
      <p style="color:#374151;font-size:16px;margin:0 0 8px;">Hi <strong>${userName}</strong> 👋</p>
      <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 28px;">
        Great news! Your application has been successfully submitted. Here's a summary of what you applied for:
      </p>

      <!-- Job Card -->
      <div style="background:linear-gradient(135deg,#f5f3ff,#eff6ff);border:1px solid #e0e7ff;border-radius:16px;padding:24px;margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:44px;height:44px;background:linear-gradient(135deg,#7c3aed,#2563eb);border-radius:12px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:20px;">💼</span>
          </div>
          <div>
            <p style="margin:0;font-size:18px;font-weight:800;color:#1e1b4b;">${jobTitle}</p>
            <p style="margin:2px 0 0;font-size:14px;color:#6b7280;">${companyName}</p>
          </div>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <span style="background:#ede9fe;color:#7c3aed;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;">📍 ${jobLocation || 'Not specified'}</span>
          <span style="background:#dbeafe;color:#2563eb;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;">🏷️ ${jobType || 'Full-time'}</span>
          <span style="background:#d1fae5;color:#059669;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;">✅ Applied</span>
        </div>
      </div>

      <!-- Steps -->
      <p style="color:#374151;font-size:15px;font-weight:700;margin:0 0 16px;">What happens next?</p>
      <div style="space-y:12px;">
        ${[
          ['🔍', 'Application Review', 'The hiring team will review your profile and resume.'],
          ['📞', 'Initial Screening', 'If shortlisted, you\'ll be contacted for a screening call.'],
          ['🎯', 'Interview Process', 'Proceed through the interview rounds.'],
          ['🎉', 'Offer & Onboarding', 'Receive your offer and join the team!'],
        ].map(([icon, title, desc], i) => `
          <div style="display:flex;gap:14px;align-items:flex-start;padding:12px 0;border-bottom:1px solid #f3f4f6;">
            <div style="width:36px;height:36px;background:#f5f3ff;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;">${icon}</div>
            <div>
              <p style="margin:0;font-size:14px;font-weight:700;color:#1f2937;">${i + 1}. ${title}</p>
              <p style="margin:2px 0 0;font-size:13px;color:#9ca3af;">${desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9;">
      <p style="margin:0;font-size:13px;color:#9ca3af;">© 2024 <strong style="color:#7c3aed;">GrowX</strong> · Your Career Growth Platform</p>
      <p style="margin:4px 0 0;font-size:12px;color:#d1d5db;">This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

export const statusUpdateEmail = ({ userName, jobTitle, companyName, status }) => {
  const statusConfig = {
    accepted: { emoji: '🎉', color: '#059669', bg: '#d1fae5', label: 'Accepted', message: 'Congratulations! Your application has been accepted. The hiring team will reach out to you shortly with next steps.' },
    rejected: { emoji: '😔', color: '#dc2626', bg: '#fee2e2', label: 'Not Selected', message: 'Thank you for your interest. Unfortunately, you were not selected for this role. Don\'t give up — keep applying!' },
    pending:  { emoji: '⏳', color: '#d97706', bg: '#fef3c7', label: 'Under Review', message: 'Your application is currently under review. We\'ll notify you as soon as there\'s an update.' },
  };
  const cfg = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);padding:40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">${cfg.emoji}</div>
      <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:800;">Application Update</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:15px;">${jobTitle} at ${companyName}</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 32px;">
      <p style="color:#374151;font-size:16px;margin:0 0 20px;">Hi <strong>${userName}</strong> 👋</p>

      <!-- Status Badge -->
      <div style="background:${cfg.bg};border:1px solid ${cfg.color}33;border-radius:16px;padding:20px 24px;margin-bottom:24px;text-align:center;">
        <p style="margin:0;font-size:13px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Application Status</p>
        <p style="margin:8px 0 0;font-size:28px;font-weight:900;color:${cfg.color};">${cfg.label}</p>
      </div>

      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 28px;">${cfg.message}</p>

      <!-- Job Info -->
      <div style="background:#f8fafc;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Position Details</p>
        <p style="margin:0;font-size:16px;font-weight:800;color:#1f2937;">💼 ${jobTitle}</p>
        <p style="margin:4px 0 0;font-size:14px;color:#6b7280;">🏢 ${companyName}</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9;">
      <p style="margin:0;font-size:13px;color:#9ca3af;">© 2024 <strong style="color:#7c3aed;">GrowX</strong> · Your Career Growth Platform</p>
      <p style="margin:4px 0 0;font-size:12px;color:#d1d5db;">This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;
};
