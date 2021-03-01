module.exports = {
    lang: 'en-US',
    title: 'Potionx',
    description: 'Documentation for deploying apps on Potionx.',
    themeConfig: {
        nav: [
            { text: 'Documentation', link: '/', activeMatch: '^/$|^/(conventions|docs|api)/' },
            {
                text: 'Github',
                link: 'https://github.com/PotionApps/potionx'
            },
            // { text: 'Roadmap', link: '/roadmap' },
            // // { text: 'Sponsor', link: '/sponsor' },
            { text: 'Discord', link: 'https://discord.gg/JydTNZCS' },
            { text: 'Twitter', link: 'https://twitter.com/Potionapps' }
        ],
        sidebar: {
            '/api/': getDocsSidebar(),
            '/conventions/': getDocsSidebar(),
            '/docs/': getDocsSidebar(),
            '/': getDocsSidebar()
        }
    }
}

function getDocsSidebar() {
    return [{
            text: 'Docs',
            children: [
                { text: 'Introduction', link: '/' },
                { text: 'Getting Started', link: '/docs/getting-started' },
                { text: 'Generators', link: '/docs/generators' },
                { text: 'Permissions', link: '/docs/permissions' },
                { text: 'Deployment', link: '/docs/deployment' },
            ]
        },
        {
            text: 'Architecture and Conventions',
            children: [
                { text: 'Overview', link: '/conventions/overview' },
                { text: 'Data Layer', link: '/conventions/data-layer' },
                { text: 'GraphQL Layer', link: '/conventions/graphql-layer' },
                { text: 'Web Layer', link: '/conventions/web-layer' }
            ]
        },
        {
            text: 'API',
            children: [
                { text: 'Potionx', link: '/api/potionx' },
                { text: 'Forms', link: '/api/forms' },
                { text: 'UI', link: '/api/ui' },
            ]
        }
    ]
}