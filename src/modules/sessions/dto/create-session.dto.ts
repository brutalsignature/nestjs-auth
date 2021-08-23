export class CreateSessionDto {
  readonly userId: string;
  readonly refreshToken: string;
  readonly fingerprint: string;
  readonly userAgent: string;
  readonly ip: string;
}
