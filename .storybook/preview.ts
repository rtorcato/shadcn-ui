import type { Preview } from '@storybook/react-vite'

import '../src/styles/globals.css'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: 'light',
			values: [
				{ name: 'light', value: '#ffffff' },
				{ name: 'dark', value: '#0a0a0a' },
			],
		},
	},
	globalTypes: {
		theme: {
			name: 'Theme',
			description: 'Light or dark theme',
			defaultValue: 'light',
			toolbar: {
				icon: 'circlehollow',
				items: [
					{ value: 'light', title: 'Light' },
					{ value: 'dark', title: 'Dark' },
				],
			},
		},
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals.theme as string
			if (typeof document !== 'undefined') {
				document.documentElement.classList.toggle('dark', theme === 'dark')
			}
			return Story()
		},
	],
}

export default preview
