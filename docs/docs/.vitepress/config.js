module.exports = {
    lang: 'en-US',
    title: 'Potionx',
    description: 'Documentation for deploying apps on PotionX.',
    themeConfig: {
        nav: [
            { text: 'Docs', link: '/', activeMatch: '^/$|^/(conventions|docs|guide|generators)/' },
            { text: 'API', link: '/api/overview', activeMatch: '^/$|^/api/'},
            { text: 'Roadmap', link: '/roadmap' },
            {
                text: 'Github',
                link: 'https://github.com/PotionApps/potionx'
            }
        ],
        search: true,
        searchMaxSuggestions: 10,
        searchPlaceholder: 'Search...',
        sidebar: {
            '/api/': getApiSidebar(),
            '/conventions/': getDocsSidebar(),
            '/docs/': getDocsSidebar(),
            '/': getDocsSidebar()
        }
    }
}

function getApiSidebar() {
    return [{
        text: 'API',
        children: [
            { text: 'Overview', link: '/api/overview' },
            { text: 'Forms', link: '/api/forms' },
        ]
    }]
}

function getDocsSidebar() {
    return [{
            text: 'Docs',
            children: [
                { text: 'Introduction', link: '/' },
                { text: 'Getting Started', link: '/docs/getting-started' },
                { text: 'Generators', link: '/docs/generators' },
                { text: 'Packages', link: '/docs/packages' },
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
        }
    ]
}