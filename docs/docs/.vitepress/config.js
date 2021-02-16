module.exports = {
    lang: 'en-US',
    title: 'Potionx',
    description: 'Documentation for deploying apps on PotionX.',
    themeConfig: {
        nav: [
            { text: 'Docs', link: '/', activeMatch: '^/$|^/(guide|generators)/' },
            {
                text: 'Github',
                link: 'https://github.com/PotionApps/potionx'
            }
        ],
        sidebar: {
            '/generators/': getGuideSidebar(),
            '/guide/': getGuideSidebar(),
            '/': getGuideSidebar()
        }
    }
}

function getGuideSidebar() {
    return [
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