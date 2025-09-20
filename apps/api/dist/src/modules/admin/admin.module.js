"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./admin.controller");
const users_module_1 = require("../users/users.module");
const tickets_controller_1 = require("./tickets.controller");
const finance_controller_1 = require("./finance.controller");
const content_controller_1 = require("./content.controller");
const appointments_controller_1 = require("./appointments.controller");
const reports_controller_1 = require("./reports.controller");
const settings_controller_1 = require("./settings.controller");
const realtime_module_1 = require("../../realtime/realtime.module");
const services_controller_1 = require("./services.controller");
const kb_controller_1 = require("./kb.controller");
const notifications_controller_1 = require("./notifications.controller");
const quotes_controller_1 = require("./quotes.controller");
const customers_controller_1 = require("./customers.controller");
const blog_notification_service_1 = require("./blog-notification.service");
const mail_service_1 = require("../auth/mail.service");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, realtime_module_1.RealtimeModule],
        controllers: [
            admin_controller_1.AdminController,
            tickets_controller_1.TicketsController,
            finance_controller_1.FinanceController,
            content_controller_1.ContentController,
            appointments_controller_1.AppointmentsController,
            reports_controller_1.ReportsController,
            settings_controller_1.SettingsController,
            services_controller_1.ServicesAdminController,
            kb_controller_1.KBAdminController,
            notifications_controller_1.AdminNotificationsController,
            quotes_controller_1.QuotesAdminController,
            customers_controller_1.AdminCustomersController
        ],
        providers: [blog_notification_service_1.BlogNotificationService, mail_service_1.MailService],
        exports: [blog_notification_service_1.BlogNotificationService]
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map