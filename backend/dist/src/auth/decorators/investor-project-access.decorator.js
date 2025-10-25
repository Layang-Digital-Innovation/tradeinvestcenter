"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireProjectAccess = RequireProjectAccess;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const investor_project_access_guard_1 = require("../guards/investor-project-access.guard");
function RequireProjectAccess() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, investor_project_access_guard_1.InvestorProjectAccessGuard));
}
//# sourceMappingURL=investor-project-access.decorator.js.map