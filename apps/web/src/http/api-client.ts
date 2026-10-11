import ky from 'ky';
import { getCookie } from 'cookies-next';
import { env } from '@saas/env';

export const api = ky.create({
    prefix: env.NEXT_PUBLIC_API_URL,
    hooks: {
        beforeRequest: [
            async ({request}) => {

                if(typeof window === 'undefined') {
                    const { cookies: serverCookies } = await import('next/headers');

                    const cookieStorage = await serverCookies();
                    const token = cookieStorage.get('token')?.value;

                    if(token) request.headers.set('Authorization', `Bearer ${token}`);
                } else {
                    const token = getCookie('token');

                    if(token) request.headers.set('Authorization', `Bearer ${token}`);
                }
                
            }
        ],
    }
});