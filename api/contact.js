// Vercel Serverless Function for handling contact form submissions
// This uses the Resend API for sending emails

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            name,
            publisher,
            email,
            phone,
            services,
            bookTitle,
            author,
            genre,
            target,
            synopsis,
            format,
            effects,
            deadline,
            launchDate
        } = req.body;

        // Format the services list
        const servicesList = services && services.length > 0
            ? services.join(', ')
            : 'Not specified';

        // Create HTML email content
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    h1 {
                        color: #0000FF;
                        border-bottom: 2px solid #0000FF;
                        padding-bottom: 10px;
                    }
                    h2 {
                        color: #0000FF;
                        margin-top: 30px;
                    }
                    .field {
                        margin: 15px 0;
                    }
                    .label {
                        font-weight: bold;
                        color: #666;
                        display: inline-block;
                        min-width: 120px;
                    }
                    .value {
                        color: #333;
                    }
                    .services {
                        background: #f5f5f5;
                        padding: 10px;
                        border-radius: 5px;
                        margin: 10px 0;
                    }
                    .synopsis {
                        background: #f9f9f9;
                        padding: 15px;
                        border-left: 3px solid #0000FF;
                        margin: 15px 0;
                        white-space: pre-wrap;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        font-size: 12px;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <h1>New Project Inquiry from ${name}</h1>

                <h2>Contact Information</h2>
                <div class="field">
                    <span class="label">Name:</span>
                    <span class="value">${name}</span>
                </div>
                <div class="field">
                    <span class="label">Publisher:</span>
                    <span class="value">${publisher || 'Not provided'}</span>
                </div>
                <div class="field">
                    <span class="label">Email:</span>
                    <span class="value"><a href="mailto:${email}">${email}</a></span>
                </div>
                <div class="field">
                    <span class="label">Phone:</span>
                    <span class="value">${phone || 'Not provided'}</span>
                </div>

                <h2>Services Requested</h2>
                <div class="services">${servicesList}</div>

                <h2>Book Information</h2>
                <div class="field">
                    <span class="label">Title:</span>
                    <span class="value">${bookTitle || 'Not provided'}</span>
                </div>
                <div class="field">
                    <span class="label">Author:</span>
                    <span class="value">${author || 'Not provided'}</span>
                </div>
                <div class="field">
                    <span class="label">Genre:</span>
                    <span class="value">${genre || 'Not provided'}</span>
                </div>
                <div class="field">
                    <span class="label">Target Audience:</span>
                    <span class="value">${target || 'Not provided'}</span>
                </div>

                <h2>Synopsis & Selling Points</h2>
                <div class="synopsis">${synopsis || 'Not provided'}</div>

                <h2>Project Details</h2>
                <div class="field">
                    <span class="label">Format & Size:</span>
                    <span class="value">${format || 'Not provided'}</span>
                </div>
                <div class="field">
                    <span class="label">Special Effects:</span>
                    <span class="value">${effects || 'Not provided'}</span>
                </div>
                <div class="field">
                    <span class="label">Deadline:</span>
                    <span class="value">${deadline || 'Not provided'}</span>
                </div>
                <div class="field">
                    <span class="label">Launch Date:</span>
                    <span class="value">${launchDate || 'Not provided'}</span>
                </div>

                <div class="footer">
                    This inquiry was submitted via the Raison d'Être contact form.
                </div>
            </body>
            </html>
        `;

        // Plain text version for email clients that don't support HTML
        const textContent = `
New Project Inquiry from ${name}

CONTACT INFORMATION
Name: ${name}
Publisher: ${publisher || 'Not provided'}
Email: ${email}
Phone: ${phone || 'Not provided'}

SERVICES REQUESTED
${servicesList}

BOOK INFORMATION
Title: ${bookTitle || 'Not provided'}
Author: ${author || 'Not provided'}
Genre: ${genre || 'Not provided'}
Target Audience: ${target || 'Not provided'}

SYNOPSIS & SELLING POINTS
${synopsis || 'Not provided'}

PROJECT DETAILS
Format & Size: ${format || 'Not provided'}
Special Effects: ${effects || 'Not provided'}
Deadline: ${deadline || 'Not provided'}
Launch Date: ${launchDate || 'Not provided'}

---
This inquiry was submitted via the Raison d'Être contact form.
        `;

        // Using Resend API (you'll need to set up an account at resend.com)
        // Alternative: You can use SendGrid, Mailgun, or any other email service
        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY is not configured');
            // Fallback: Log the submission (you can see this in Vercel logs)
            console.log('Form submission received:', req.body);

            // Still return success to the user
            return res.status(200).json({
                success: true,
                message: 'Form received (email service not configured yet)'
            });
        }

        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Raison d\'Être Form <onboarding@resend.dev>',
                to: 'hello@raisondetrebooks.com',
                subject: `New Project Inquiry from ${name}`,
                reply_to: email,
                html: htmlContent,
                text: textContent,
            }),
        });

        if (!emailResponse.ok) {
            throw new Error('Failed to send email');
        }

        // Optional: Send auto-reply to the client
        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Raison d\'Être <onboarding@resend.dev>',
                to: email,
                subject: 'We received your inquiry!',
                html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <h1 style="color: #0000FF; font-size: 32px; text-align: center; margin-bottom: 30px;">Thanks ${name}!</h1>
                        <p style="font-size: 18px; line-height: 1.6; color: #333; text-align: center;">
                            We've received your project inquiry and we're excited to work with you!
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #666; text-align: center;">
                            Our team will review your requirements and send you a personalized quote within 24 hours.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #666; text-align: center; margin-top: 40px;">
                            If you have any urgent questions, feel free to reach out directly at<br>
                            <a href="mailto:hello@raisondetrebooks.com" style="color: #0000FF;">hello@raisondetrebooks.com</a>
                        </p>
                        <div style="text-align: center; margin-top: 60px; padding-top: 30px; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 14px;">
                                Raison d'Être - Book Studio<br>
                                We make your books look gooood!
                            </p>
                        </div>
                    </div>
                `,
                text: `Thanks ${name}!\n\nWe've received your project inquiry and we're excited to work with you!\n\nOur team will review your requirements and send you a personalized quote within 24 hours.\n\nIf you have any urgent questions, feel free to reach out directly at hello@raisondetrebooks.com\n\n---\nRaison d'Être - Book Studio\nWe make your books look gooood!`
            }),
        });

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error processing form:', error);
        return res.status(500).json({
            error: 'Failed to process form submission'
        });
    }
}