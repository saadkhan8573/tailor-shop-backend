import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authenticatedUserId = request.user?.id; // Assuming the authenticated user's ID is available in the request object after authentication.
    console.log('authenticatedUserId', authenticatedUserId);
    // If the user ID is not provided in the route parameter or does not match the authenticated user's ID, deny access.
    if (
      !authenticatedUserId ||
      (request.params.userId && +request.params.userId !== authenticatedUserId)
    ) {
      throw new UnauthorizedException(
        'You are not authorized to access this user information.',
      );
    }

    return true;
  }
}
