import {Body, Controller, Post} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";
import {RefreshDto} from "./dto/refresh.dto";
import {AuthResponseDto} from "./dto/auth-response.dto";
import {RegisterDto} from "./dto/register.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @ApiOperation({summary: "Register (create user) (access + refresh)"})
  @Post("register")
  register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.auth.register(dto);
  }

  @ApiOperation({summary: "Login (access + refresh)"})
  @Post("login")
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.auth.login(dto);
  }

  @ApiOperation({summary: "Refresh (rotates refresh token)"})
  @Post("refresh")
  refresh(@Body() dto: RefreshDto): Promise<AuthResponseDto> {
    return this.auth.refresh(dto.refreshToken);
  }
}
