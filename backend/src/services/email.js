import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Email service for sending emails using Resend
 */
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    // Check if Resend is configured
    if (!resend || !process.env.RESEND_API_KEY) {
      console.log('\n=== EMAIL (Development Mode - Not Sent) ===');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Content:', htmlContent.substring(0, 200) + '...');
      console.log('💡 Configure RESEND_API_KEY to send real emails');
      console.log('==================\n');
      return { success: true, mode: 'development' };
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: Array.isArray(to) ? to : [to],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email sent successfully via Resend');
    console.log('   To:', to);
    console.log('   Subject:', subject);
    console.log('   Message ID:', data?.id);
    
    return { success: true, data };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (email, confirmationLink) => {
  const subject = 'Welcome to Footylytics - Verify Your Email';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">⚽ Footylytics</h1>
      </div>
      <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937; margin-top: 0;">Welcome to Footylytics!</h2>
        <p style="color: #4b5563; font-size: 16px;">Hi there! 👋</p>
        <p style="color: #4b5563; font-size: 16px;">We're excited to have you join our community of football fans. Please verify your email address to get started:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationLink}" style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">⏱️ This link will expire in 24 hours.</p>
        <p style="color: #6b7280; font-size: 14px;">🔒 If you didn't create an account, please ignore this email.</p>
        
        <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #1e40af; font-size: 14px; margin: 0;"><strong>What's next?</strong></p>
          <p style="color: #1e40af; font-size: 14px; margin: 5px 0 0 0;">After verification, explore live scores, fixtures, standings, and upgrade to Premium for AI-powered predictions!</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Footylytics. All rights reserved.<br/>
          Made with ❤️ for football fans worldwide
        </p>
      </div>
    </div>
  `;

  return await sendEmail(email, subject, htmlContent);
};

export const sendMatchNotificationEmail = async (email, matchData) => {
  const subject = `⚽ Match Starting Soon: ${matchData.homeTeam} vs ${matchData.awayTeam}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">⚽ Match Alert</h1>
      </div>
      <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937; margin-top: 0;">Match Starting Soon!</h2>
        
        <div style="background: white; padding: 25px; border-radius: 12px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">${matchData.competition}</p>
          </div>
          
          <div style="display: flex; align-items: center; justify-content: space-between; margin: 20px 0;">
            <div style="text-align: center; flex: 1;">
              <img src="${matchData.homeTeamCrest}" alt="${matchData.homeTeam}" style="width: 60px; height: 60px; object-fit: contain; margin-bottom: 10px;" />
              <p style="color: #1f2937; font-size: 16px; font-weight: bold; margin: 0;">${matchData.homeTeam}</p>
            </div>
            
            <div style="text-align: center; padding: 0 20px;">
              <p style="color: #2563eb; font-size: 24px; font-weight: bold; margin: 0;">VS</p>
            </div>
            
            <div style="text-align: center; flex: 1;">
              <img src="${matchData.awayTeamCrest}" alt="${matchData.awayTeam}" style="width: 60px; height: 60px; object-fit: contain; margin-bottom: 10px;" />
              <p style="color: #1f2937; font-size: 16px; font-weight: bold; margin: 0;">${matchData.awayTeam}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">⏰ Kick-off Time</p>
            <p style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${matchData.matchTime}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/live-scores" style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Watch Live
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Footylytics. All rights reserved.<br/>
          You're receiving this because you subscribed to match notifications
        </p>
      </div>
    </div>
  `;

  return await sendEmail(email, subject, htmlContent);
};

export const sendPremiumWelcomeEmail = async (email, userName) => {
  const subject = 'Welcome to Footylytics Premium! 🎉';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">⚽ Footylytics Premium</h1>
      </div>
      <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937; margin-top: 0;">Welcome to Premium! 🎉</h2>
        <p style="color: #4b5563; font-size: 16px;">Hi ${userName}! 👋</p>
        <p style="color: #4b5563; font-size: 16px;">Thank you for upgrading to Footylytics Premium! You now have access to:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <ul style="color: #4b5563; font-size: 14px; line-height: 1.8;">
            <li>🤖 <strong>AI-Powered Predictions</strong> - Get match predictions with confidence scores</li>
            <li>📊 <strong>Advanced Analytics</strong> - Detailed statistics and charts</li>
            <li>🚫 <strong>Ad-Free Experience</strong> - Enjoy without distractions</li>
            <li>⚡ <strong>Priority Notifications</strong> - Be the first to know</li>
            <li>🎯 <strong>Head-to-Head Analysis</strong> - Deep dive into team matchups</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/predictions" style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Explore Premium Features
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Footylytics. All rights reserved.<br/>
          Questions? Contact us at support@footylytics.com
        </p>
      </div>
    </div>
  `;

  return await sendEmail(email, subject, htmlContent);
};
