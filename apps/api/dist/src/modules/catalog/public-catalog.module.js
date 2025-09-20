"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicCatalogModule = void 0;
const common_1 = require("@nestjs/common");
const public_catalog_controller_1 = require("./public-catalog.controller");
const public_kb_controller_1 = require("./public-kb.controller");
const public_blog_controller_1 = require("./public-blog.controller");
const blog_subscription_controller_1 = require("./blog-subscription.controller");
const mail_service_1 = require("../auth/mail.service");
let PublicCatalogModule = class PublicCatalogModule {
};
exports.PublicCatalogModule = PublicCatalogModule;
exports.PublicCatalogModule = PublicCatalogModule = __decorate([
    (0, common_1.Module)({
        controllers: [public_catalog_controller_1.PublicCatalogController, public_kb_controller_1.PublicKBController, public_blog_controller_1.PublicBlogController, blog_subscription_controller_1.BlogSubscriptionController],
        providers: [mail_service_1.MailService]
    })
], PublicCatalogModule);
//# sourceMappingURL=public-catalog.module.js.map