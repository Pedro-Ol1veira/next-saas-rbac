import { app } from "@/http/server";
import { createAndAuthenticateUser } from "@/test/utils/createAndAuthenticateUser";
import request from "supertest";


describe('[GET] /profile', async (t) => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should get the authenticated user profile', async () => {

        const { token } = await createAndAuthenticateUser(app);
        
        const response = await request(app.server)
            .get('/profile')
            .set('Authorization', `Bearer ${token}`)
            .send()
        
        expect(response.status).toBe(200);
        expect(response.body.user).toEqual(expect.objectContaining({
            id: expect.any(String),
            name: 'teste',
            email: 'teste@exemple.com'
        }));
    });
})