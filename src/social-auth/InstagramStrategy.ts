import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-instagram";

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, "instagram") {
    constructor() {
        super({
            clientID: process.env.APP_ID,
            clientSecret: process.env.APP_SECRET,
            callbackURL: "https://localhost:3000/auth/facebook/redirect",
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void
    ): Promise<any> {

        const payload = {
            profile,
            accessToken,
        };

        done(null, payload);
    }
}
