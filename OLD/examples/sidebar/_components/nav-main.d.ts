import type { LucideIcon } from 'lucide-react'
export declare function NavMain({
	className,
	items,
	searchResults,
}: {
	items: {
		title: string
		url: string
		icon: LucideIcon
		isActive?: boolean
		items?: {
			title: string
			url: string
		}[]
	}[]
	searchResults: React.ComponentProps<typeof SidebarSearch>['results']
} & React.ComponentProps<'ul'>): import('react/jsx-runtime').JSX.Element
declare function SidebarSearch({
	results,
}: {
	results: {
		title: string
		teaser: string
		url: string
	}[]
}): import('react/jsx-runtime').JSX.Element
//# sourceMappingURL=nav-main.d.ts.map
