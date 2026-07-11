import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { faker } from "@faker-js/faker";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg(connectionString ?? '');

export const prisma = new PrismaClient({ adapter });

async function seed() {
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();
    const passwordHash = await hash('123456', 1);

    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatarUrl: 'https://github.com/diego3g.png',
            passwordHash,
        }
    });

    const user1 = await prisma.user.create({
        data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            avatarUrl: faker.image.avatarGitHub(),
            passwordHash
        }
    });

    const user2 = await prisma.user.create({
        data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            avatarUrl: faker.image.avatarGitHub(),
            passwordHash
        }
    });


    await prisma.organization.create({
        data: {
            name: 'Acme Inc (Admin)',
            domain: 'acme.com',
            slug: 'acme-admin',
            avatarUrl: faker.image.avatarGitHub(),
            shouldAttachUserByDomain: true,
            ownerId: user.id,
            projects: {
                createMany: {
                    data: [
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id])
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id])
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id])
                        },
                    ]
                }
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: user.id,
                            role: 'ADMIN'
                        },
                        {
                            userId: user1.id,
                            role: 'MEMBER'
                        },
                        {
                            userId: user2.id,
                            role: 'MEMBER'
                        }
                    ]
                }
            }
        }
    })

    await prisma.organization.create({
        data: {
            name: 'Acme Inc (Member)',
            slug: 'acme-member',
            avatarUrl: faker.image.avatarGitHub(),
            ownerId: user.id,
            projects: {
                createMany: {
                    data: [
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id])
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id])
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id])
                        },
                    ]
                }
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: user.id,
                            role: 'MEMBER'
                        },
                        {
                            userId: user1.id,
                            role: 'ADMIN'
                        },
                        {
                            userId: user2.id,
                            role: 'MEMBER'
                        }
                    ]
                }
            }
        }
    })

    await prisma.organization.create({
        data: {
            name: 'Acme Inc (Billing)',
            slug: 'acme-billing',
            avatarUrl: faker.image.avatarGitHub(),
            ownerId: user.id,
            projects: {
                createMany: {
                    data: [
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id])
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id])
                        },
                        {
                            name: faker.lorem.words(5),
                            slug: faker.lorem.slug(5),
                            description: faker.lorem.paragraph(),
                            avatarUrl: faker.image.avatarGitHub(),
                            ownerId: faker.helpers.arrayElement([user.id, user1.id, user2.id])
                        },
                    ]
                }
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: user.id,
                            role: 'BILLING'
                        },
                        {
                            userId: user1.id,
                            role: 'ADMIN'
                        },
                        {
                            userId: user2.id,
                            role: 'MEMBER'
                        }
                    ]
                }
            }
        }
    })


}

seed().then(() => {
    console.log("Seeding completed.");
})

