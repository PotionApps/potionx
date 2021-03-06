module.exports = {
    lang: 'en-US',
    title: 'Potionx',
    description: 'Documentation for deploying apps on Potionx.',
    themeConfig: {
        nav: [
            { text: 'Documentation', link: '/', activeMatch: '^/$|^/(conventions|docs)/' },
            { text: 'API', link: '/ui/overview', activeMatch: '^/(potionx|forms|ui)/' },
            { text: 'Issues/Requests/Roadmap', link: 'https://potion.hellonext.co/' },
            { text: 'Github', link: 'https://github.com/PotionApps/potionx' }
        ],
        sidebar: {
            '/conventions/': getDocsSidebar(),
            '/docs/': getDocsSidebar(),
            '/forms/': getApiSidebar(),
            '/potionx/': getApiSidebar(),
            '/roadmap': getRoadmapSidebar(),
            '/ui/': getApiSidebar(),
            '/': getDocsSidebar()
        },
        // algolia: {
        //     apiKey: '25626fae796133dc1e734c6bcaaeac3c',
        //     indexName: 'docsearch',
        // }
    }
}

function getApiSidebar() {
    return [
        // {
        //     text: 'Potionx',
        //     children: [
        //         { text: 'Overview', link: '/potionx/overview' }
        //     ]
        // },
        {
            text: 'UI',
            children: [
                { text: 'Overview', link: '/ui/overview' },
                { text: 'Components', link: '/ui/components' },
                { text: 'Generators', link: '/ui/generators' },
                { text: 'Hooks', link: '/ui/hooks' }
            ]
        },
        {
            text: 'Forms',
            children: [
                { text: 'Hooks', link: '/forms/hooks' },
                { text: 'Validation', link: '/forms/validation' }
            ]
        }
    ]
}

function getDocsSidebar() {
    return [{
            text: 'Docs',
            children: [
                { text: 'Introduction', link: '/' },
                { text: 'Getting Started', link: '/docs/getting-started' },
                { text: 'Social Logins', link: '/docs/social' },
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
        }
    ]
}

function getRoadmapSidebar() {
    return [{
        children: [
            { text: 'Documentation', link: '/' },
            { text: 'Conventions', link: '/conventions/overview' },
            { text: 'UI', link: '/ui/overview' },
            { text: 'Forms', link: '/forms/hooks' }
        ]
    }]
}