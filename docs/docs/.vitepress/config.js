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
            '/ui/': getApiSidebar(),
            '/': getDocsSidebar()
        },
        algolia: {
            apiKey: 'd8859c9fe1863fa59d35b9fc7f807452',
            indexName: 'potionapps',
        }
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
                { text: 'Tutorials', link: '/docs/tutorials' },
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