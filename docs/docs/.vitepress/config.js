module.exports = {
    lang: 'en-US',
    title: 'Potionx',
    description: 'Documentation for deploying apps on PotionX.',
    themeConfig: {
        nav: [
            { text: 'Guide', link: '/', activeMatch: '^/$|^/(conventions|guide|generators)/' },
            {
                text: 'Github',
                link: 'https://github.com/PotionApps/potionx'
            }
        ],
        sidebar: {
            '/conventions/': getGuideSidebar(),
            '/generators/': getGuideSidebar(),
            '/guide/': getGuideSidebar(),
            '/': getGuideSidebar()
        }
    }
}

function getGuideSidebar() {
    return [{
            text: 'Guide',
            children: [
                { text: 'Introduction', link: '/' },
                { text: 'Getting Started', link: '/guide/getting-started' },
                { text: 'Deployment', link: '/guide/deployment' },
                { text: 'Forms (@potionapps/forms)', link: '/guide/forms' },
                // permissions
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
            text: 'Generators',
            children: [
                { text: 'Model', link: '/generators/model' },
                { text: 'UI', link: '/generators/ui' }
            ]
        }
    ]
}