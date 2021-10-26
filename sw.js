// console.log('hello depuis le Service Worker');
const cacheName= 'veille-techno-1.2';

self.addEventListener('install', evt => {
    console.log('instal evet', evt);
    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
            'index.html',
            'main.js',
            'style.css',
            'vendors/bootstrap4.min.css',
            'add_techno.html',
            'add_techno.js',
            'contact.html',
            'contact.js'
        ])
    });

    evt.waitUntil(cachePromise);
});

self.addEventListener('activate', evt => {
    console.log('active evt', evt);
    let cacheCleanPromise = caches.keys().then(keys => {
        keys.forEach(key => {
            if(key !== cacheName) {
                return caches.delete(key);
            }
        })
    })
    evt.waitUntil(cacheCleanPromise);
});

self.addEventListener('fetch', evt => {
    // if(!navigator.onLine) {
    //     const headers = {headers : {'Content-Type': 'text/html;charset=utf-8'}};
    //     evt.respondWith(new Response('<h1>Pas de conection internet</h1><div>Application en mode dégradée. Veuillez vous connecter</div>', headers))
    // }

    // console.log('fetch', evt.request.url)


    // --------- Strategie de cache only with network fallback

    // evt.respondWith(
    //     caches.match(evt.request).then(res => {
    //         if (res) {
    //             console.log(`url fetchée depuis le cache ${evt.request.url}`, res);
    //             return res;
    //         }
    //         return fetch(evt.request).then(newResponse => {
    //             console.log(`url récupérée sur le reseau puis mise en cache  ${evt.request.url}`, newResponse);
    //             caches.open(cacheName).then(cache => cache.put(evt.request, newResponse));
    //             return newResponse.clone();
    //         })
    //     } )
    // )


    // ---------Strategie de network first with cache fallback

    evt.respondWith(
        fetch(evt.request).then(res => {
            console.log(`${evt.request.url} fetchée depuis le réseau`);
            caches.open(cacheName).then(cache => cache.put(evt.request, res));
            return res.clone();
        }).catch(err => {
            console.log(`${evt.request.url} fetchée depuis le cache`);
            return caches.match(evt.request);
        })
    );
});

// NOtification depuis le SW "not persistante"

// self.registration.showNotification('Notification depuis le SW', {
//     body: 'je suis une notification "persistante"',
//     actions : [
//         {action:'accept', title: 'accepter'},
//         {action:'refuse', title: 'refuser'}
//     ]
// });
//
// // self.addEventListener('notificationclose', evt => {
// //     console.log('notification fermée', evt);
// // })
//
// self.addEventListener('notificationclick', evt => {
//     if(evt.action === 'accept') {
//         console.log('vous avez accepté')
//     } else if (evt.action === 'refuse') {
//         console.log('vous avez refusé')
//         console.log('vous avez refusé')
//     } else {
//         console.log('vous n\'avez pas choisi de réponse');
//     }
//     evt.notification.close();
// });

self.addEventListener('push', evt => {
    console.log('push event', evt);
    console.log('data envoyé par la push notificiation de dev tools : ', evt.data.text());
    const title = evt.data.text();
    evt.waitUntil(self.registration.showNotification(title, { body: 'ca marche', image: 'images/icons/icon-256x256.png'}));
});