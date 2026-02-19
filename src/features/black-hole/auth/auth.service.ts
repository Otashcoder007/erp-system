import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

import {LoginDto} from "./dto/login.dto";
import {User} from "../entities/user.entity";
import {RefreshToken} from "../entities/refresh-token.entity";
import {RegisterDto} from "./dto/register.dto";

type AccessPayload = {sub: number; login: string; role: string};
type RefreshPayload = {sub: number};

@Injectable()
export class AuthService {
  private readonly accessSecret = process.env.JWT_ACCESS_SECRET ?? "access_secret";
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET ?? "refresh_secret";
  private readonly accessTtlSec = Number(process.env.JWT_ACCESS_TTL ?? 900); // 15m
  private readonly refreshTtlSec = Number(process.env.JWT_REFRESH_TTL ?? 1209600); // 14d

  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(RefreshToken) private readonly rtRepo: Repository<RefreshToken>
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usersRepo.findOne({where: {login: dto.login}});
    if (exists) throw new BadRequestException("Login already taken");

    const user = await this.usersRepo.save(
      this.usersRepo.create({
        role: dto.role,
        login: dto.login,
        password: await argon2.hash(dto.password),
        firstName: dto.firstName,
        lastName: dto.lastName,
        middleName: dto.middleName,
        profileImage: dto.profileImage,
        birthDate: dto.birthDate,
        gender: dto.gender,
      })
    );

    const accessToken = this.signAccess({sub: user.id, login: user.login, role: user.role});
    const refreshToken = this.signRefresh({sub: user.id});

    // reuse your existing refresh token persistence logic
    const tokenHash = await argon2.hash(refreshToken);
    const expiresAt = new Date(Date.now() + this.refreshTtlSec * 1000);

    const existing = await this.rtRepo.findOne({where: {userId: user.id}});
    if (existing) {
      existing.tokenHash = tokenHash;
      existing.expiresAt = expiresAt;
      await this.rtRepo.save(existing);
    } else {
      await this.rtRepo.save(this.rtRepo.create({userId: user.id, tokenHash, expiresAt}));
    }

    return {accessToken, refreshToken};
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({where: {login: dto.login}});
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const ok = await argon2.verify(user.password, dto.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    const accessToken = this.signAccess({sub: user.id, login: user.login, role: user.role});
    const refreshToken = this.signRefresh({sub: user.id});

    const tokenHash = await argon2.hash(refreshToken);
    const expiresAt = new Date(Date.now() + this.refreshTtlSec * 1000);

    const existing = await this.rtRepo.findOne({where: {userId: user.id}});
    if (existing) {
      existing.tokenHash = tokenHash;
      existing.expiresAt = expiresAt;
      await this.rtRepo.save(existing);
    } else {
      await this.rtRepo.save(this.rtRepo.create({userId: user.id, tokenHash, expiresAt}));
    }

    return {accessToken, refreshToken};
  }

  async refresh(refreshToken: string) {
    const payload = this.verifyRefresh(refreshToken);

    const record = await this.rtRepo.findOne({where: {userId: payload.sub}});
    if (!record) throw new UnauthorizedException("Refresh denied");
    if (record.expiresAt.getTime() < Date.now()) throw new UnauthorizedException("Refresh expired");

    const ok = await argon2.verify(record.tokenHash, refreshToken);
    if (!ok) throw new UnauthorizedException("Refresh denied");

    const user = await this.usersRepo.findOne({where: {id: payload.sub}});
    if (!user) throw new UnauthorizedException("User not found");

    const newAccessToken = this.signAccess({sub: user.id, login: user.login, role: user.role});
    const newRefreshToken = this.signRefresh({sub: user.id});

    record.tokenHash = await argon2.hash(newRefreshToken);
    record.expiresAt = new Date(Date.now() + this.refreshTtlSec * 1000);
    await this.rtRepo.save(record);

    return {accessToken: newAccessToken, refreshToken: newRefreshToken};
  }

  async logout(userId: number) {
    await this.rtRepo.delete({userId});
    return {ok: true};
  }

  private signAccess(payload: AccessPayload): string {
    return jwt.sign(payload, this.accessSecret, {expiresIn: this.accessTtlSec});
  }

  private signRefresh(payload: RefreshPayload): string {
    return jwt.sign(payload, this.refreshSecret, {expiresIn: this.refreshTtlSec});
  }

  private verifyRefresh(token: string): RefreshPayload {
    const decoded = jwt.verify(token, this.refreshSecret);

    // jsonwebtoken returns string | JwtPayload
    if (!decoded || typeof decoded !== "object") throw new UnauthorizedException("Invalid refresh token");

    const sub = (decoded as any).sub;
    const subNum = typeof sub === "number" ? sub : typeof sub === "string" && sub.trim() !== "" ? Number(sub) : NaN;

    if (!Number.isFinite(subNum)) throw new UnauthorizedException("Invalid refresh token");

    return {sub: subNum};
  }
}
