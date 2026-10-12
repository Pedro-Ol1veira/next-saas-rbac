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
import { requestPasswordRecovery } from './routes/auth/requestPasswordRecovery';
import { resetPassword } from './routes/auth/resetPassword';
import { authenticateWithGithub } from './routes/auth/authenticateWithGithub';
import { env } from '@saas/env';
import { createOrganization } from './routes/orgs/createOrganization';
import { getMemberShip } from './routes/orgs/getMemberShip';
import { getOrganization } from './routes/orgs/getOrganization';
import { getOrganizations } from './routes/orgs/getOrganizations';
import { updateOrganization } from './routes/orgs/updateOrganization';
import { shutdownOrganization } from './routes/orgs/shutdownOrganization';
import { transferOrganization } from './routes/orgs/transferOrganization';
import { createProject } from './routes/projects/createProject';
import { deleteProject } from './routes/projects/deleteProject';
import { getProject } from './routes/projects/getProject';
import { getProjects } from './routes/projects/getProjects';
import { UpdateProject } from './routes/projects/updateProject';
import { getMembers } from './routes/members/getMembers';
import { updateMember } from './routes/members/updateMember';
import { removeMember } from './routes/members/removeMember';
import { createInvite } from './routes/invites/createInvite';
import { getInvite } from './routes/invites/getInvite';
import { getInvites } from './routes/invites/getInvites';
import { acceptInvite } from './routes/invites/acceptInvite';
import { rejectInvite } from './routes/invites/rejectInvite';
import { revokeInvite } from './routes/invites/revokeInvite';
import { getPedingInvites } from './routes/invites/getPedingInvites';
import { getOrganizationBilling } from './routes/billing/getOrganizationBilling';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      }
    }
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  
})

app.setErrorHandler(errorHandler);

app.register(fastifyCors);

app.register(createAccount);
app.register(authenticateWithPassword);
app.register(getProfile);
app.register(requestPasswordRecovery);
app.register(resetPassword);
app.register(authenticateWithGithub);
app.register(createOrganization);
app.register(getMemberShip);
app.register(getOrganization);
app.register(getOrganizations);
app.register(updateOrganization);
app.register(shutdownOrganization);
app.register(transferOrganization);
app.register(createProject);
app.register(deleteProject);
app.register(getProject);
app.register(getProjects);
app.register(UpdateProject);
app.register(getMembers);
app.register(updateMember);
app.register(removeMember);
app.register(createInvite);
app.register(getInvite);
app.register(getInvites);
app.register(acceptInvite);
app.register(rejectInvite);
app.register(revokeInvite);
app.register(getPedingInvites);
app.register(getOrganizationBilling);



app.listen({ port: env.PORT }).then(() => {
    console.log(`Server is running on port ${env.PORT}`);
});