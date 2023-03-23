import {randomBytes, scrypt as _scrypt} from 'crypto';
import {promisify} from 'util';
import {BadRequestException} from "@nestjs/common";
const scrypt = promisify(_scrypt);

const createPasswordHash=async (password)=>{
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    return result;
}


const validatePasswordHash=async(passwordToValidate,passwordHash)=>{
    const [salt, storedHash] = passwordHash.split('.');

    const hash = (await scrypt(passwordToValidate, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
        return false;
    }
    return true
}

export { createPasswordHash, validatePasswordHash };
