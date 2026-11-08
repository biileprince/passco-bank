"use server";

import { Resend } from "resend";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(data: ContactFormData) {
  try {
    // Validate the data
    const validatedData = contactFormSchema.parse(data);

    // Get session to check if user is logged in
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Save to database with userId if logged in
    await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        projectType: validatedData.projectType,
        budget: validatedData.budget || null,
        message: validatedData.message,
        userId: session?.user?.id || null, // Link to user if logged in
      },
    });

    // Send email using Resend
    try {
      const emailResult = await resend.emails.send({
        from: "AxiomCraft <onboarding@resend.dev>", // Using Resend test domain
        to: ["biileprinceyennuyar5@gmail.com"],
        replyTo: validatedData.email,
        subject: `🎯 New Website Inquiry from ${validatedData.name}${session?.user ? " (Registered User)" : ""}`,
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: 600; color: #6366f1; margin-bottom: 5px; }
              .value { background: white; padding: 12px; border-radius: 4px; border-left: 3px solid #6366f1; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">🎉 New Project Inquiry</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone wants to work with you!</p>
              </div>
              <div class="content">
                ${
                  session?.user
                    ? `
                <div class="field">
                  <div class="label">✅ User Status</div>
                  <div class="value" style="background: #d1fae5; border-left-color: #10b981;">Registered User - User ID: ${session.user.id}</div>
                </div>
                `
                    : `
                <div class="field">
                  <div class="label">👤 User Status</div>
                  <div class="value" style="background: #fef3c7; border-left-color: #f59e0b;">Guest (Not logged in)</div>
                </div>
                `
                }
                <div class="field">
                  <div class="label">👤 Name</div>
                  <div class="value">${validatedData.name}</div>
                </div>
                <div class="field">
                  <div class="label">📧 Email</div>
                  <div class="value">${validatedData.email}</div>
                </div>
                ${
                  validatedData.phone
                    ? `
                <div class="field">
                  <div class="label">📞 Phone</div>
                  <div class="value">${validatedData.phone}</div>
                </div>
                `
                    : ""
                }
                <div class="field">
                  <div class="label">💼 Project Type</div>
                  <div class="value">${validatedData.projectType}</div>
                </div>
                ${
                  validatedData.budget
                    ? `
                <div class="field">
                  <div class="label">💰 Budget</div>
                  <div class="value">${validatedData.budget}</div>
                </div>
                `
                    : ""
                }
                <div class="field">
                  <div class="label">💬 Message</div>
                  <div class="value" style="white-space: pre-wrap;">${
                    validatedData.message
                  }</div>
                </div>
                <div class="footer">
                  <p>Reply directly to this email to respond to ${
                    validatedData.name
                  }</p>
                  <p style="margin-top: 10px; font-size: 12px;">Sent from AxiomCraft Contact Form</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      });

      if (emailResult.error) {
        console.error("Resend error:", emailResult.error);
        // Don't throw - data is already saved to database
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue - message is saved in database
    }

    return {
      success: true,
      message:
        "Thank you for reaching out! We'll get back to you within 24 hours.",
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      message:
        "Something went wrong. Please try again or email us directly at biileprinceyennuyar5@gmail.com",
    };
  }
}
