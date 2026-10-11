
import { api } from "./api-client";

interface GetBillingResponse {
    billing: {
        seats: {
            amount: number;
            unit: number;
            price: number;
        };
        projects: {
            amount: number;
            unit: number;
            price: number;
        };
        total: number;
    }
}

export async function getBilling(slug: string) {
    
    const res = await api.get(`organization/${slug}/billing`).json<GetBillingResponse>();
    
    return res;
}