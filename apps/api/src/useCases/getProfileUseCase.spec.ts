import { GetProfileUseCase } from './getProfileUseCase';
import { InMemoryUserRepository } from '@/repositories/inMemory/inMemoryUserRepository';
import { InMemoryMemberRepository } from '@/repositories/inMemory/inMemoryMemberRepository';
import { BadRequestError } from '@/http/routes/_errors/badRequestError';

let sut: GetProfileUseCase;
let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryMemberRepository: InMemoryMemberRepository;

describe('Get Profile UseCase', () => {
    beforeEach(() => {
        inMemoryMemberRepository = new InMemoryMemberRepository();
        inMemoryUserRepository = new InMemoryUserRepository(inMemoryMemberRepository);
        sut = new GetProfileUseCase(inMemoryUserRepository);
    });
    
    it('should be able to get a user profile', async () => {
        inMemoryUserRepository.users.push({
            id: 'user-01',
            name: 'John Doe',
            email: 'johnDoe@example.com',
            passwordHash: 'hashed-password',
            avatarUrl: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    
        const user = await sut.execute({ userId: 'user-01'});
        
        expect(user).toEqual(expect.objectContaining({
            id: 'user-01',
            name: 'John Doe',
            email: 'johnDoe@example.com',
        }));
    });

    it('should not be able to get an non-existent user profile', async () => {
    
        await expect(
            sut.execute({ userId: 'user-01'})
        ).rejects.toBeInstanceOf(BadRequestError);
    });

});
