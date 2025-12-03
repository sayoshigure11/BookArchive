import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'BookArchive',
        short_name: 'BookArchive',
        description: '本棚の管理をするアプリです。',
        start_url: '/',
        display: 'standalone',
        background_color: '#2EC6FE',
            theme_color: '#8936FF',
        lang: "ja",
        icons: [
            {
                purpose: 'maskable',
                sizes: '512x512',
                src: '/icon512_maskable.png',
                type: 'image/png'
            },
            {
                purpose: 'any',
                src: '/icon512_rounded.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
    // {
    //     "theme_color": "#8936FF",
    //     "background_color": "#2EC6FE",
    //     "icons": [
    //         {
    //             "purpose": "maskable",
    //             "sizes": "512x512",
    //             "src": "icon512_maskable.png",
    //             "type": "image/png"
    //         },
    //         {
    //             "purpose": "any",
    //             "sizes": "512x512",
    //             "src": "icon512_rounded.png",
    //             "type": "image/png"
    //         }
    //     ],
    //     "orientation": "any",
    //     "display": "standalone",
    //     "dir": "auto",
    //     "lang": "ja",
    //     "name": "BookArchive",
    //     "short_name": "BookArchive",
    //     "start_url": "https://book-archive-xi.vercel.app/",
    //     "scope": "https://book-archive-xi.vercel.app/",
    //     "description": "本棚の管理をするアプリです。"
    // }
}