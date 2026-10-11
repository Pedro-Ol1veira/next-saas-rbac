import { api } from "./api-client";

interface GetProfileResponse {
    user: {
        id: string;
        name: string | null;
        email: string;
        avatar_url: string | null;
    }
}

export async function getProfile() {
    
    const res = await api.get('profile').json<GetProfileResponse>();

    return res;
}