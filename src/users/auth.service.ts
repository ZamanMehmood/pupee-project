import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {randomBytes, scrypt as _scrypt} from 'crypto';
import {promisify} from 'util';
import {successResponse} from '../utils/response';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {
    }

    async signup(email: string, password: string, user_type: string,user_name: string) {
        // See if email is in use
        const user = await this.usersService.findByEmail(email);
        const userByEmail = await this.usersService.findByEmail(email);

        const verifyUser = await this.usersService.findVerifyUserByEmail(email);

        if (user) {
            throw new BadRequestException('email in use');
        }else if(userByEmail){
            throw new BadRequestException('username already exist');
        }

        // Hash the users password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        // Create a new user and save it
        const createUser = await this.usersService.create({
            email,
            password: result,
            user_type,
            user_name
        });

        // return the user
        return createUser;
    }

    async signin(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }

        return user;
    }

    async resetPassword(
        email: string,
        currentPassword: string,
        newPassword: string,
    ) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(currentPassword, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('worng current_password');
        }

        const saltNew = randomBytes(8).toString('hex');

        // Hash the salt and the password together
        const hashNew = (await scrypt(newPassword, saltNew, 32)) as Buffer;

        // Join the hashed result and the salt together
        const result = saltNew + '.' + hashNew.toString('hex');

        user.password = result;
        await user.save();
        return successResponse(200, 'Password updated', {});
    }


}
