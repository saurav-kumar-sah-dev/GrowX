import Internship from "../models/internship.model.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS?.replace(/\s/g, '') || '' 
  },
});

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "internship_resumes" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

const sendConfirmationEmail = async (to, data) => {
  const year  = new Date().getFullYear();
  const date  = new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const rows  = [
    ['👤', 'Full Name',  data.fullName],
    ['📧', 'Email',      data.email],
    ['📱', 'Phone',      data.phone],
    ['🎓', 'College',    data.college],
    ['📚', 'Course',     data.course],
    ['📅', 'Year',       data.year],
    ['💼', 'Category',   data.category],
    ['⚡', 'Experience', data.experience],
    ['⏱', 'Duration',   data.duration],
    ['📍', 'Location',   data.city && data.state ? `${data.city}, ${data.state}` : data.city || data.state],
  ].filter(([,,v]) => v);

  const steps = [
    { icon:'✅', num:'01', title:'Application Received',  desc:'Your application is safely stored in our system.',        dot:'#D4A853', bar:'rgba(212,168,83,0.2)' },
    { icon:'🔍', num:'02', title:'Profile Under Review',  desc:'Our team reviews your profile within 1–2 business days.', dot:'#E8C17A', bar:'rgba(232,193,122,0.2)' },
    { icon:'📞', num:'03', title:'Interview & Selection', desc:'Shortlisted candidates will be contacted for an interview.',dot:'#C8884A', bar:'rgba(200,136,74,0.2)' },
    { icon:'🎉', num:'04', title:'Onboarding',            desc:'Selected interns receive their official offer letter.',    dot:'#34D399', bar:'rgba(52,211,153,0.2)' },
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Application Confirmed – GrowX</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A0F;padding:48px 16px;">
<tr><td align="center">

  <!-- Card -->
  <table width="600" cellpadding="0" cellspacing="0" border="0"
    style="max-width:600px;width:100%;background:#121218;border-radius:24px;overflow:hidden;
           box-shadow:0 32px 80px rgba(0,0,0,0.5);border:1px solid rgba(212,168,83,0.15);">

    <!-- ═══ HERO HEADER ═══ -->
    <tr>
      <td style="background:linear-gradient(135deg,#1A1A24 0%,#121218 40%,#0A0A0F 100%);
                 padding:0;position:relative;overflow:hidden;">

        <!-- top accent line -->
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="height:4px;background:linear-gradient(90deg,#D4A853,#C8884A,#E8C17A,#B8923F);"></td>
        </tr></table>

        <!-- hero content -->
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="padding:48px 48px 40px;text-align:center;">

            <!-- logo badge -->
            <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:28px;">
              <tr><td style="background:rgba(212,168,83,0.1);border:1px solid rgba(212,168,83,0.3);
                            border-radius:16px;padding:12px 24px;">
                <span style="font-size:22px;font-weight:900;color:#F5F0E6;letter-spacing:-0.5px;">Grow<span style="color:#D4A853;">X</span></span>
              </td></tr>
            </table>

            <!-- rocket icon -->
            <div style="font-size:56px;line-height:1;margin-bottom:20px;">🚀</div>

            <h1 style="margin:0 0 12px;font-size:32px;font-weight:900;color:#F5F0E6;
                       letter-spacing:-1px;line-height:1.2;">Application Confirmed!</h1>
            <p style="margin:0 0 24px;font-size:16px;color:#A8A099;line-height:1.6;">
              Your journey to <strong style="color:#D4A853;">${data.category}</strong> starts here.
            </p>

            <!-- status pill -->
            <table cellpadding="0" cellspacing="0" align="center">
              <tr><td style="background:linear-gradient(135deg,#D4A853,#C8884A);border-radius:50px;
                            padding:10px 28px;">
                <span style="font-size:13px;font-weight:700;color:#0A0A0F;letter-spacing:0.5px;">✓ &nbsp;UNDER REVIEW</span>
              </td></tr>
            </table>

            <p style="margin:20px 0 0;font-size:12px;color:#D4A853;">${date}</p>
          </td>
        </tr></table>
      </td>
    </tr>

    <!-- ═══ GREETING ═══ -->
    <tr>
      <td style="padding:40px 48px 0;">
        <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:#F5F0E6;">Hi ${data.fullName} 👋</p>
        <p style="margin:0;font-size:15px;color:#A8A099;line-height:1.8;">
          Congratulations on taking the first step! We've successfully received your application for the
          <strong style="color:#D4A853;"> ${data.category}</strong> internship program at GrowX.
          Our team will carefully review your profile and get back to you soon.
        </p>
      </td>
    </tr>

    <!-- ═══ DIVIDER ═══ -->
    <tr><td style="padding:32px 48px 0;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(212,168,83,0.3),transparent);"></td>
      </tr></table>
    </td></tr>

    <!-- ═══ APPLICATION SUMMARY ═══ -->
    <tr>
      <td style="padding:32px 48px 0;">

        <!-- section label -->
        <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr>
            <td style="background:linear-gradient(135deg,rgba(212,168,83,0.15),rgba(200,136,74,0.15));border:1px solid rgba(212,168,83,0.3);border-radius:8px;
                       padding:6px 14px;">
              <span style="font-size:11px;font-weight:700;color:#D4A853;text-transform:uppercase;
                           letter-spacing:1.5px;">📋 Application Summary</span>
            </td>
          </tr>
        </table>

        <!-- summary table -->
        <table width="100%" cellpadding="0" cellspacing="0"
          style="border:1px solid rgba(212,168,83,0.15);border-radius:16px;overflow:hidden;">
          ${rows.map(([emoji, label, value], i) => `
          <tr style="background:${i % 2 === 0 ? 'rgba(26,26,36,0.5)' : '#121218'};">
            <td style="padding:14px 20px;width:44%;border-bottom:1px solid rgba(212,168,83,0.1);">
              <span style="font-size:14px;">${emoji}</span>
              <span style="font-size:13px;font-weight:600;color:#A8A099;margin-left:8px;">${label}</span>
            </td>
            <td style="padding:14px 20px;border-bottom:1px solid rgba(212,168,83,0.1);">
              <span style="font-size:13px;font-weight:700;color:#F5F0E6;">${value}</span>
            </td>
          </tr>`).join('')}
        </table>
      </td>
    </tr>

    <!-- ═══ DIVIDER ═══ -->
    <tr><td style="padding:32px 48px 0;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(212,168,83,0.3),transparent);"></td>
      </tr></table>
    </td></tr>

    <!-- ═══ WHAT'S NEXT TIMELINE ═══ -->
    <tr>
      <td style="padding:32px 48px 0;">

        <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td style="background:linear-gradient(135deg,rgba(212,168,83,0.2),rgba(200,136,74,0.2));border:1px solid rgba(212,168,83,0.3);border-radius:8px;
                       padding:6px 14px;">
              <span style="font-size:11px;font-weight:700;color:#D4A853;text-transform:uppercase;
                           letter-spacing:1.5px;">🗺 What Happens Next?</span>
            </td>
          </tr>
        </table>

        ${steps.map((s, i) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:${i < steps.length-1 ? '4px' : '0'};">
          <tr>
            <!-- step number dot -->
            <td width="56" valign="top" style="padding-top:2px;">
              <table cellpadding="0" cellspacing="0">
                <tr><td align="center">
                  <div style="width:40px;height:40px;border-radius:50%;background:${s.bar};
                              display:inline-block;text-align:center;line-height:40px;
                              font-size:18px;border:2px solid ${s.dot};">${s.icon}</div>
                </td></tr>
                ${i < steps.length-1 ? `<tr><td align="center">
                  <div style="width:2px;height:28px;background:${s.bar};margin:4px auto;"></div>
                </td></tr>` : ''}
              </table>
            </td>
            <!-- step content -->
            <td style="padding:8px 0 ${i < steps.length-1 ? '0' : '0'} 16px;vertical-align:top;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:${i===0 ? 'rgba(212,168,83,0.08)' : 'rgba(26,26,36,0.5)'};
                       border:1px solid rgba(212,168,83,0.2);border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:800;color:${s.dot};
                               text-transform:uppercase;letter-spacing:0.5px;">
                      ${s.num} — ${s.title}${i===0 ? ' &nbsp;<span style="background:#34D399;color:#0A0A0F;font-size:10px;padding:2px 8px;border-radius:20px;font-weight:700;">DONE</span>' : ''}
                    </p>
                    <p style="margin:0;font-size:13px;color:#A8A099;line-height:1.5;">${s.desc}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`).join('')}
      </td>
    </tr>

    <!-- ═══ TIPS BANNER ═══ -->
    <tr>
      <td style="padding:32px 48px 0;">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:linear-gradient(135deg,rgba(212,168,83,0.1),rgba(200,136,74,0.1));border:1px solid rgba(212,168,83,0.3);
                 border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:#D4A853;
                         text-transform:uppercase;letter-spacing:0.5px;">💡 Pro Tips While You Wait</p>
              <table cellpadding="0" cellspacing="0">
                ${[
                  'Keep your LinkedIn profile updated and professional.',
                  'Work on a small project related to your chosen category.',
                  'Prepare for common interview questions in your domain.',
                  'Check your email regularly — we may reach out anytime!',
                ].map(tip => `<tr><td style="padding:3px 0;font-size:13px;color:#A8A099;line-height:1.5;">
                  <span style="color:#D4A853;font-weight:700;">→</span> &nbsp;${tip}
                </td></tr>`).join('')}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ═══ CTA BUTTON ═══ -->
    <tr>
      <td style="padding:32px 48px 0;text-align:center;">
        <table cellpadding="0" cellspacing="0" align="center">
          <tr>
            <td style="background:linear-gradient(135deg,#D4A853,#C8884A);border-radius:14px;
                       box-shadow:0 8px 24px rgba(212,168,83,0.3);">
              <a href="https://growx.onrender.com" target="_blank"
                style="display:inline-block;padding:16px 40px;font-size:15px;font-weight:800;
                       color:#0A0A0F;text-decoration:none;letter-spacing:0.3px;">
                🌐 &nbsp;Visit GrowX Platform
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:13px;color:#A8A099;">Explore more opportunities while you wait</p>
      </td>
    </tr>

    <!-- ═══ CONTACT ═══ -->
    <tr>
      <td style="padding:32px 48px 0;">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:rgba(26,26,36,0.8);border:1px solid rgba(212,168,83,0.15);border-radius:16px;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:800;color:#D4A853;
                         text-transform:uppercase;letter-spacing:0.5px;">📬 Need Help?</p>
              <p style="margin:0;font-size:13px;color:#A8A099;line-height:1.7;">
                Have questions about your application? Reach out to us at
                <a href="mailto:${process.env.MAIL_USER}"
                  style="color:#D4A853;font-weight:700;text-decoration:none;">
                  ${process.env.MAIL_USER}
                </a>.
                We typically respond within 24 hours.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ═══ FOOTER ═══ -->
    <tr>
      <td style="padding:32px 48px 40px;">

        <!-- divider -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr>
          <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(212,168,83,0.3),transparent);"></td>
        </tr></table>

        <!-- footer content -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;">
              <!-- logo -->
              <p style="margin:0 0 12px;font-size:20px;font-weight:900;color:#F5F0E6;">
                Grow<span style="color:#D4A853;">X</span>
              </p>
              <!-- tagline -->
              <p style="margin:0 0 16px;font-size:13px;color:#A8A099;">Empowering the next generation of tech talent</p>
              <!-- bottom accent -->
              <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:16px;">
                <tr>
                  <td style="height:3px;width:60px;background:linear-gradient(90deg,#D4A853,#C8884A);border-radius:2px;"></td>
                </tr>
              </table>
              <p style="margin:0 0 4px;font-size:12px;color:#A8A099;">
                © ${year} GrowX · All rights reserved
              </p>
              <p style="margin:0;font-size:11px;color:#6b7280;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- bottom accent line -->
    <tr>
      <td style="height:5px;background:linear-gradient(90deg,#D4A853,#C8884A,#E8C17A,#B8923F);"></td>
    </tr>

  </table>
  <!-- end card -->

</td></tr>
</table>
<!-- end outer -->

</body>
</html>`;

  await transporter.sendMail({
    from: `"GrowX Internship" <${process.env.MAIL_USER}>`,
    to,
    subject: `🚀 Application Confirmed — ${data.category} Internship | GrowX`,
    html,
  });
};

export const applyInternship = async (req, res) => {
  try {
    const {
      fullName, email, phone, gender,
      college, course, year, city, state,
      category, experience, duration,
      linkedin, github, portfolio, message,
    } = req.body;

    if (!fullName || !email || !phone || !category) {
      return res.status(400).json({ success: false, message: "fullName, email, phone and category are required" });
    }

    const existing = await Internship.findOne({ email, category });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already applied for this category" });
    }

    let resumeUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      resumeUrl = result.secure_url;
    }

    const application = await Internship.create({
      applicant: req.id,
      fullName, email, phone, gender,
      college, course, year, city, state,
      category, experience, duration,
      linkedin, github, portfolio,
      resume: resumeUrl,
      message,
    });

    // Send confirmation email (non-blocking)
    sendConfirmationEmail(email, { fullName, email, phone, college, course, year, city, state, category, experience, duration })
      .catch(err => console.error("Email send failed:", err.message));

    res.status(201).json({ success: true, message: "Application submitted successfully!", data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllInternships = async (req, res) => {
  try {
    const applications = await Internship.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendStatusEmail = async (to, data, status) => {
  const year = new Date().getFullYear();
  const isAccepted = status === 'accepted';

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;padding:48px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0"
  style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,0.5);">

  <!-- top rainbow bar -->
  <tr><td style="height:5px;background:linear-gradient(90deg,${isAccepted ? '#22c55e,#16a34a,#4ade80,#86efac,#22c55e' : '#ef4444,#dc2626,#f87171,#fca5a5,#ef4444'});"></td></tr>

  <!-- HERO -->
  <tr><td style="background:linear-gradient(135deg,${isAccepted ? '#052e16 0%,#14532d 40%,#166534 70%,#15803d 100%' : '#450a0a 0%,#7f1d1d 40%,#991b1b 70%,#b91c1c 100%'});padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:48px 48px 40px;text-align:center;">
      <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:24px;">
        <tr><td style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:16px;padding:10px 22px;">
          <span style="font-size:20px;font-weight:900;color:#fff;letter-spacing:-0.5px;">Grow<span style="color:${isAccepted ? '#86efac' : '#fca5a5'};">X</span></span>
        </td></tr>
      </table>
      <div style="font-size:60px;line-height:1;margin-bottom:20px;">${isAccepted ? '🎉' : '😔'}</div>
      <h1 style="margin:0 0 12px;font-size:30px;font-weight:900;color:#fff;letter-spacing:-1px;line-height:1.2;">
        ${isAccepted ? 'Congratulations! You\'re Selected!' : 'Application Not Selected'}
      </h1>
      <p style="margin:0 0 24px;font-size:15px;color:${isAccepted ? '#bbf7d0' : '#fecaca'};line-height:1.6;">
        ${isAccepted ? `Your application for <strong style="color:#fff;">${data.category}</strong> has been <strong>accepted</strong>!` : `Your application for <strong style="color:#fff;">${data.category}</strong> was not selected this time.`}
      </p>
      <table cellpadding="0" cellspacing="0" align="center">
        <tr><td style="background:${isAccepted ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'linear-gradient(135deg,#dc2626,#b91c1c)'};border-radius:50px;padding:10px 28px;">
          <span style="font-size:13px;font-weight:700;color:#fff;letter-spacing:0.5px;">${isAccepted ? '✓ ACCEPTED' : '✕ NOT SELECTED'}</span>
        </td></tr>
      </table>
    </td></tr></table>
  </td></tr>

  <!-- BODY -->
  <tr><td style="padding:40px 48px 0;">
    <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:#111827;">Hi ${data.fullName} ${isAccepted ? '🌟' : '👋'},</p>
    <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.8;">
      ${isAccepted
        ? `We are thrilled to inform you that your application for the <strong style="color:#16a34a;">${data.category}</strong> internship at <strong>GrowX</strong> has been <strong style="color:#16a34a;">officially accepted</strong>! Welcome to the GrowX family. Our team will reach out to you shortly with onboarding details.`
        : `Thank you for your interest in the <strong style="color:#dc2626;">${data.category}</strong> internship at <strong>GrowX</strong>. After careful review, we regret to inform you that we are unable to move forward with your application at this time. We encourage you to keep building your skills and apply again in the future.`
      }
    </p>
  </td></tr>

  <!-- DIVIDER -->
  <tr><td style="padding:0 48px;"><table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);"></td>
  </tr></table></td></tr>

  ${isAccepted ? `
  <!-- NEXT STEPS (accepted only) -->
  <tr><td style="padding:32px 48px 0;">
    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
      <td style="background:linear-gradient(135deg,#16a34a,#15803d);border-radius:8px;padding:6px 14px;">
        <span style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1.5px;">🚀 Your Next Steps</span>
      </td>
    </tr></table>
    ${[
      ['📧', 'Check Your Email',    'Watch for our onboarding email with all details.',       '#dcfce7', '#16a34a'],
      ['📋', 'Complete Formalities', 'Submit any required documents when requested.',          '#d1fae5', '#059669'],
      ['💻', 'Setup Your Workspace', 'Prepare your development environment and tools.',        '#ecfdf5', '#10b981'],
      ['🤝', 'Meet Your Team',       'Get introduced to your mentor and team members.',        '#f0fdf4', '#22c55e'],
    ].map(([icon, title, desc, bg, color]) => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
      <tr>
        <td width="48" valign="middle" style="padding-right:14px;">
          <div style="width:40px;height:40px;border-radius:12px;background:${bg};border:1px solid ${color}30;
                      text-align:center;line-height:40px;font-size:18px;">${icon}</div>
        </td>
        <td style="background:${bg};border:1px solid ${color}30;border-radius:12px;padding:12px 16px;">
          <p style="margin:0 0 2px;font-size:13px;font-weight:800;color:${color};">${title}</p>
          <p style="margin:0;font-size:12px;color:#6b7280;">${desc}</p>
        </td>
      </tr>
    </table>`).join('')}
  </td></tr>` : `
  <!-- ENCOURAGEMENT (rejected) -->
  <tr><td style="padding:32px 48px 0;">
    <table width="100%" cellpadding="0" cellspacing="0"
      style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:1px solid #fcd34d;border-radius:16px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;">💪 Keep Going — Don't Give Up!</p>
        ${[
          'Strengthen your skills with online courses and projects.',
          'Build a strong portfolio to showcase your work.',
          'Apply to other internship categories that match your skills.',
          'We welcome you to apply again in the next cycle!',
        ].map(t => `<p style="margin:4px 0;font-size:13px;color:#78350f;"><span style="color:#d97706;font-weight:700;">→</span> ${t}</p>`).join('')}
      </td></tr>
    </table>
  </td></tr>`}

  <!-- DIVIDER -->
  <tr><td style="padding:32px 48px 0;"><table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);"></td>
  </tr></table></td></tr>

  <!-- APPLICATION SUMMARY -->
  <tr><td style="padding:32px 48px 0;">
    <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr>
      <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:8px;padding:6px 14px;">
        <span style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1.5px;">📋 Your Application</span>
      </td>
    </tr></table>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
      ${[['💼','Category',data.category],['🎓','College',data.college],['📚','Course',data.course],['📅','Year',data.year],['⏱','Duration',data.duration]]
        .filter(([,, v]) => v)
        .map(([emoji, label, value], i) => `
      <tr style="background:${i % 2 === 0 ? '#fafafa' : '#fff'};">
        <td style="padding:12px 20px;width:44%;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:14px;">${emoji}</span>
          <span style="font-size:13px;font-weight:600;color:#6b7280;margin-left:8px;">${label}</span>
        </td>
        <td style="padding:12px 20px;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:13px;font-weight:700;color:#111827;">${value}</span>
        </td>
      </tr>`).join('')}
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding:32px 48px 0;text-align:center;">
    <table cellpadding="0" cellspacing="0" align="center"><tr>
      <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:14px;box-shadow:0 8px 24px rgba(79,70,229,0.35);">
        <a href="https://growx.onrender.com" target="_blank"
          style="display:inline-block;padding:16px 40px;font-size:15px;font-weight:800;color:#fff;text-decoration:none;">🌐 Visit GrowX Platform</a>
      </td>
    </tr></table>
  </td></tr>

  <!-- CONTACT -->
  <tr><td style="padding:24px 48px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border:1px solid #e0e7ff;border-radius:16px;">
      <tr><td style="padding:18px 24px;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:800;color:#4f46e5;text-transform:uppercase;letter-spacing:0.5px;">📬 Questions?</p>
        <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.7;">Contact us at
          <a href="mailto:${process.env.MAIL_USER}" style="color:#4f46e5;font-weight:700;text-decoration:none;">${process.env.MAIL_USER}</a>.
          We respond within 24 hours.
        </p>
      </td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:32px 48px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
      <td style="height:1px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);"></td>
    </tr></table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="text-align:center;">
      <p style="margin:0 0 8px;font-size:20px;font-weight:900;color:#111827;">Grow<span style="color:#4f46e5;">X</span></p>
      <p style="margin:0 0 12px;font-size:13px;color:#9ca3af;">Empowering the next generation of tech talent</p>
      <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:14px;"><tr>
        <td style="height:3px;width:60px;background:linear-gradient(90deg,#6366f1,#8b5cf6);border-radius:2px;"></td>
      </tr></table>
      <p style="margin:0;font-size:12px;color:#d1d5db;">© ${year} GrowX · All rights reserved</p>
    </td></tr></table>
  </td></tr>

  <!-- bottom rainbow bar -->
  <tr><td style="height:5px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#f59e0b,#22c55e);"></td></tr>

</table>
</td></tr></table>
</body></html>`;

  await transporter.sendMail({
    from: `"GrowX Internship" <${process.env.MAIL_USER}>`,
    to,
    subject: isAccepted
      ? `🎉 Congratulations! You're Accepted — ${data.category} Internship | GrowX`
      : `📩 Application Update — ${data.category} Internship | GrowX`,
    html,
  });
};

export const updateInternshipStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Internship.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    // Send status email (non-blocking)
    if (status === 'accepted' || status === 'rejected') {
      sendStatusEmail(application.email, {
        fullName: application.fullName,
        category: application.category,
        college:  application.college,
        course:   application.course,
        year:     application.year,
        duration: application.duration,
      }, status).catch(err => console.error('Status email failed:', err.message));
    }

    res.status(200).json({ success: true, message: "Status updated", data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInternship = async (req, res) => {
  try {
    const application = await Internship.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    res.status(200).json({ success: true, message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
