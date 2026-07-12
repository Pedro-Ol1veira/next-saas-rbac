import { expect, describe, beforeEach, it } from 'vitest';

import { CreateAccountUseCase } from './createAccountUseCase';
import { InMemoryUserRepository } from '@/repositories/inMemory/inMemoryUserRepository';
import { InMemoryMemberRepository } from '@/repositories/inMemory/inMemoryMemberRepository';
import { InMemoryOrganizationRepository } from '@/repositories/inMemory/inMemoryOrganizationRepository';
import { BadRequestError } from '@/http/routes/_errors/badRequestError';

let sut: CreateAccountUseCase;
let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryMemberRepository: InMemoryMemberRepository;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;

describe('Create Account UseCase', () => {
    beforeEach(() => {
        inMemoryMemberRepository = new InMemoryMemberRepository();
        inMemoryUserRepository = new InMemoryUserRepository(inMemoryMemberRepository);
        inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
        sut = new CreateAccountUseCase(inMemoryUserRepository, inMemoryOrganizationRepository);
    });
    
    it('should be able to create a new account', async () => {
        await sut.execute({
            name: 'John Doe',
            email: 'johnDoe@example.com',
            password: '123456'
        });

        expect(inMemoryUserRepository.users).toHaveLength(1);
        expect(inMemoryUserRepository.users[0]).toEqual(expect.objectContaining({
            name: 'John Doe',
            email: 'johnDoe@example.com',
        }));
    });

    it('should not be able to create a new account with an existing email', async () => {
        await sut.execute({
            name: 'John Doe',
            email: 'johnDoe@example.com',
            password: '123456'
        });

        await expect(sut.execute({
            name: 'Jane Doe',
            email: 'johnDoe@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(BadRequestError);
    });

    it('should be able to create a new account and auto join an organization by domain', async () => {
        inMemoryOrganizationRepository.organizations.push({
            id: 'org-01',
            name: 'Example Organization',
            domain: 'example.com',
            shouldAttachUserByDomain: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            avatarUrl: '',
            ownerId: 'owner-01',
            slug: 'example-org'
        });

        await sut.execute({
            name: 'John Doe',
            email: 'johnDoe@example.com',
            password: '123456'
        });

        expect(inMemoryMemberRepository.members).toHaveLength(1);
        expect(inMemoryMemberRepository.members[0]).toEqual(expect.objectContaining({
            userId: inMemoryUserRepository.users[0].id,
            organizationId: 'org-01'
        }));
    });
});
