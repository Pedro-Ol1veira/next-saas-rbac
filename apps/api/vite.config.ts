import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        tsconfigPaths: true
    },
    test: {
        dir: 'src',
        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                    dir: 'src/useCases',
                    include: ['**/*.spec.ts'],
                }
            },
            {
                extends: true,
                test: {
                    name: 'e2e',
                    dir: "src/http/routes",
                    environment: './prisma/vitestTestEnvironments/vitestTestEnvironments.ts',
                    include: ['**/*.e2e-spec.ts'],
                }
            }
        ],
        globals: true,
    }
});