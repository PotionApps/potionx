module.exports = {
    lang: 'en-US',
    title: 'Potionx',
    description: 'Documentation for deploying apps on Potionx.',
    themeConfig: {
        nav: [
            { text: 'Documentation', link: '/', activeMatch: '^/$|^/(conventions|docs)/' },
            { text: 'API', link: '/potionx/overview', activeMatch: '^/(api|form|ui)/' },
            {
                text: 'Github',
                link: 'https://github.com/PotionApps/potionx'
            }
        ],
        sidebar: {
            '/potionx/': getApiSidebar(),
            '/forms/': getApiSidebar(),
            '/ui/': getApiSidebar(),
            '/conventions/': getDocsSidebar(),
            '/docs/': getDocsSidebar(),
            '/': getDocsSidebar()
        }
    }
}

function getApiSidebar() {
    return [{
            text: 'Potionx',
            children: [
                { text: 'Overview', link: '/potionx/overview' }
            ]
        },
        {
            text: 'Forms',
            children: [
                { text: 'Hooks', link: '/forms/hooks' },
                { text: 'Validation', link: '/forms/validation' }
            ]
        },
        {
            text: 'UI',
            children: [
                { text: 'Overview', link: '/ui/overview' },
                { text: 'Components', link: '/ui/components' },
                { text: 'Hooks', link: '/ui/hooks' },
                { text: 'Themes', link: '/ui/themes' }
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