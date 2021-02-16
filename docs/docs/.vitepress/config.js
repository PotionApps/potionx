module.exports = {
    lang: 'en-US',
    title: 'Potionx',
    description: 'Documentation for deploying apps on PotionX.',
    themeConfig: {
        nav: [
            { text: 'Docs', link: '/', activeMatch: '^/$|^/(conventions|guide|generators)/' },
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
    return [
        {
            text: 'Conventions',
            children: [
                { text: 'Overview', link: '/conventions/overview' }
            ]
        },
        {
            text: 'Docs',
            children: [
                { text: 'What is Potionx?', link: '/' },
                { text: 'Getting Started', link: '/guide/getting-started' },
                { text: 'Conventions and File Structure', link: '/guide/conventions-and-file-structure' },
                { text: 'Deployment', link: '/guide/deployment' },
                { text: 'Forms', link: '/guide/forms' }
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