import { prisma } from '../config/db';
import { emailService } from './email.service';
import { NotificationType } from '@prisma/client';

export class NotificationService {
  /**
   * Dispatches an in-app notification to a user, with optional email alert
   */
  async createNotification(opts: {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
    sendEmail?: boolean;
  }) {
    const notif = await prisma.notification.create({
      data: {
        userId: opts.userId,
        title: opts.title,
        message: opts.message,
        type: opts.type || 'INFO',
        link: opts.link,
      },
      include: {
        user: { select: { email: true, name: true } },
      },
    });

    if (opts.sendEmail && notif.user?.email) {
      await emailService.sendEmail({
        to: notif.user.email,
        subject: `[Notification] ${opts.title}`,
        html: `<p>Hello ${notif.user.name},</p><p>${opts.message}</p>${
          opts.link ? `<p><a href="${opts.link}">View details</a></p>` : ''
        }`,
      });
    }

    return notif;
  }

  /**
   * Alert all active admins about a major event (e.g., new DSR request, snag complaint, or price alert)
   */
  async alertAdmins(opts: {
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
  }) {
    const admins = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] },
        active: true,
      },
      select: { id: true, email: true },
    });

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: opts.title,
          message: opts.message,
          type: opts.type || 'INFO',
          link: opts.link,
        },
      });
    }

    const adminEmail = process.env.FDP_ADMIN_EMAIL || 'info@fairdealng.com';
    await emailService.sendEmail({
      to: adminEmail,
      subject: `[Admin Alert] ${opts.title}`,
      html: `<p><strong>${opts.title}</strong></p><p>${opts.message}</p>`,
    });
  }
}

export const notificationService = new NotificationService();
