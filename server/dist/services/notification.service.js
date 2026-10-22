"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const db_1 = require("../config/db");
const email_service_1 = require("./email.service");
class NotificationService {
    /**
     * Dispatches an in-app notification to a user, with optional email alert
     */
    async createNotification(opts) {
        const notif = await db_1.prisma.notification.create({
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
            await email_service_1.emailService.sendEmail({
                to: notif.user.email,
                subject: `[Notification] ${opts.title}`,
                html: `<p>Hello ${notif.user.name},</p><p>${opts.message}</p>${opts.link ? `<p><a href="${opts.link}">View details</a></p>` : ''}`,
            });
        }
        return notif;
    }
    /**
     * Alert all active admins about a major event (e.g., new DSR request, snag complaint, or price alert)
     */
    async alertAdmins(opts) {
        const admins = await db_1.prisma.user.findMany({
            where: {
                role: { in: ['ADMIN', 'SUPER_ADMIN'] },
                active: true,
            },
            select: { id: true, email: true },
        });
        for (const admin of admins) {
            await db_1.prisma.notification.create({
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
        await email_service_1.emailService.sendEmail({
            to: adminEmail,
            subject: `[Admin Alert] ${opts.title}`,
            html: `<p><strong>${opts.title}</strong></p><p>${opts.message}</p>`,
        });
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
