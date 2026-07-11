import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import type { Request } from "express";

@Injectable()
export class InternalTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const expected = process.env.API_INTERNAL_TOKEN;
    if (!expected) return process.env.NODE_ENV !== "production";

    const request = context.switchToHttp().getRequest<Request>();
    return request.header("x-internal-api-key") === expected;
  }
}
