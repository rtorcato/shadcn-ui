import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import type { ReactNode } from 'react'

// Placeholder landing page so '/' resolves. The branded marketing hero lands
// in #7 (brand theme + marketing landing page).
export default function Home(): ReactNode {
	const { siteConfig } = useDocusaurusContext()
	return (
		<Layout title={siteConfig.title} description={siteConfig.tagline}>
			<main
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
					padding: '6rem 1rem',
					gap: '1.5rem',
				}}
			>
				<h1 style={{ fontSize: '2.75rem', margin: 0 }}>{siteConfig.title}</h1>
				<p style={{ fontSize: '1.25rem', maxWidth: '42rem', opacity: 0.8 }}>{siteConfig.tagline}</p>
				<Link className="button button--primary button--lg" to="/docs">
					Get started
				</Link>
			</main>
		</Layout>
	)
}
