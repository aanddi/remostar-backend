import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Users } from '@prisma/client'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate({ id }: Pick<Users, 'id'>) {
    return this.prisma.users.findUnique({
      where: {
        id: id
      }
    })
  }
}