import {Body, Controller, Get, HttpStatus, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import { SocialAuthService } from './service-auth.service';
import { Request } from "express";
import {WeddingAnniversaryDto} from "../wedding/dtos/wedding-anniversary.dto";
import {CreateUser} from "./dtos/social-auth.dto";

@Controller('auth')
export class SocialAuthController {
  constructor(private socialAuthService: SocialAuthService) {}
    @Get("/facebook")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/facebook/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: Request): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: req.user,
        };
    }


    @Get("/instagram")
    @UseGuards(AuthGuard("instagram"))
    async instagramLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/instagram/redirect")
    @UseGuards(AuthGuard("instagram"))
    async instagramLoginRedirect(@Req() req: Request): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: req.user,
        };
    }



    @Get("/google")
    @UseGuards(AuthGuard("google"))
    async googleLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/google/redirect")
    @UseGuards(AuthGuard("google"))
    async googleLoginRedirect(@Req() req: Request): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: req.user,
        };
    }


    @Post('/')
    async socialAuth(@Body() body: CreateUser) {
        const wedding = await this.socialAuthService.socialAuth(body);
        return wedding;
    }

}
