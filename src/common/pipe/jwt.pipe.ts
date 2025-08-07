import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../auth/service/auth/auth.applicationServiceImpl';
import { ConfigService } from '@nestjs/config';
import { ConfigException } from '../exception/internal.exception';

@Injectable()
export class JwtPipe implements PipeTransform {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private getSecret() {
    const secret = this.configService.get('JWT_SECRET');
    if (!secret) {
      throw new ConfigException({
        clientMsg: '서버에 문제가 생겼습니다. 다시 시도해주세요.',
        devMsg: '토큰 시크릿이 없습니다. 환경변수 파일을 확인해주세요',
      });
    }
    return secret;
  }

  private extractJwtTokenFrom(value: any) {
    return value.substring(7);
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new UnauthorizedException('인증 토큰이 필요합니다.');
    }

    if (!value.startsWith('Bearer ')) {
      throw new UnauthorizedException('올바른 인증 토큰이 아닙니다.');
    }

    const token = this.extractJwtTokenFrom(value);
    const secret = this.getSecret();
    try {
      return this.jwtService.verify<JwtPayload>(token, { secret });
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 인증 토큰입니다.');
    }
  }
}
