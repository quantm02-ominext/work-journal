import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		include: ['src/**/*.test.{ts,tsx}'],
		setupFiles: ['src/tests/setup-test.ts'],
		restoreMocks: true,
		coverage: {
			include: ['src/**/*.{ts,tsx}'],
			all: true,
		},
	},
})
