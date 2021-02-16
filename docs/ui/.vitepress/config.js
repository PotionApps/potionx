module.exports = {
    lang: 'en-US',
    title: 'PotionX',
    description: 'Documentation for deploying apps on PotionX.',
    themeConfig: {
        nav: [
            { text: 'Guide', link: '/', activeMatch: '^/$|^/guide/' },
            {
                text: 'Roadmap',
                link: '/roadmap'
            },
            {
                text: 'Github',
                link: 'https://github.com/PotionApps/potionx'
            }
        ],
        sidebar: {
            '/guide/': getGuideSidebar(),
            '/': getGuideSidebar()
        }
    }
}

function getGuideSidebar() {
    return [{
            text: 'Introduction',
            children: [
                { text: 'What is PotionX?', link: '/' },
                { text: 'Getting Started', link: '/guide/getting-started' },
                { text: 'Deployment', link: '/guide/deployment' }
            ]
        },
        {
            text: 'Advanced',
            children: [

            ]
        }
    ]
}