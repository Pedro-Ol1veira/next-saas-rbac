import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import { createAccount } from './routes/auth/createAccount';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { authenticateWithPassword } from './routes/auth/authenticateWithPassword';
import fastifyJwt from '@fastify/jwt';
import { getProfile } from './routes/auth/getProfile';
import { errorHandler } from './errorHandler';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: "my-secret-key",
  
})

app.setErrorHandler(errorHandler);

app.register(fastifyCors);

app.register(createAccount);
app.register(authenticateWithPassword);
app.register(getProfile);



app.listen({ port: 3333 }).then(() => {
    console.log("Server is running on port 3333");
});