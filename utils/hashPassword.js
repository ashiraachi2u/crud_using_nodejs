import { createHash } from 'crypto';

export function hashPassword(password) {
    const hash = createHash('sha256');
    hash.update(password);
    const hashedPassword = hash.digest('hex');
    return hashedPassword;
}