// console.log('hello depuis main');
// const technosDiv = document.querySelector('#technos');
//
// let technos = [
//     {id: 1, name: 'Angular', description: 'le framework front-end', url: 'https://angular.io/'},
//     {id: 2, name: 'Node', description: 'JavaScript côté backe-end', url: 'https://nodejs.org/en/'},
//     {id: 3, name: 'MongoDB', description: 'la célèbre base noSQL', url: 'https://www.mongodb.com/'},
//     {id: 4, name: 'PWA', description: 'rendre vos applications ++', url: 'https://developer.mozilla.org/en-US/Apps/Progressive'}
// ];
//
// function loadTechnologies(technos) {
//     const allTechnos = technos
//         .map(t => `<div><b>${t.name}</b> ${t.description} - site officiel </div>`)
//         .join('');
//
//     technosDiv.innerHTML = allTechnos;
// }
//
// loadTechnologies(technos);

//   OU

console.log('hello depuis main');
const technosDiv = document.querySelector('#technos');

function loadTechnologies() {
    fetch('http://localhost:3001/technos')
        .then(response => {
            response.json()
                .then(technos => {
                    technosDiv.innerHTML = technos.map(t => `<div><b>${t.name}</b> ${t.description}  <a href="${t.url}">site de ${t.name}</a> </div>`)
                        .join('');
                });
        })
        .catch(console.error);
}

loadTechnologies();



// if('serviceWorker' in navigator) { }
if(navigator.serviceWorker) {
    navigator.serviceWorker.register('sw.js').then(registration => {
        // public vapid key
        const publicKey = 'BBJRg9nSS9pmh13omNaYIQMiZakBi_9jx4jFAu_Cqy9LbKF16Rf_UAMxCus99E4YxaNBt09h0KfTE_wGMBa4qEE';
        registration.pushManager.getSubscription().then(subscription => {
            if(subscription) {
                console.log('souscription : ',subscription)
                // no more keys proprety directly visible on the subscription objet. So you have to use getKey()
                const keyArrayBuffer = subscription.getKey('p256dh');
                const authArrayBuffer = subscription.getKey('auth');
                const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(keyArrayBuffer)));
                const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(authArrayBuffer)));
                console.log('p256dh key', keyArrayBuffer, p256dh);
                console.log('auth key', authArrayBuffer, auth);
                return subscription;
            } else {
                //ask for subscription
                const convertedKey = urlBase64ToUint8Array(publicKey);
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedKey
                })
                    .then(newSubscription => {
                        console.log('new Subcription : ', newSubscription)
                    })
            }
        })
    })
        .catch(err => console.error);
}


function urlBase64ToUint8Array(base64String) {
    let padding = '='.repeat((4 - base64String.length % 4) % 4);
    let base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    let rawData = window.atob(base64);
    let outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// if (window.caches) {
//     caches.open('veille-techno-1.0');
//     caches.open('other-1.0');
//     caches.keys().then(console.log);
//     caches.open('veille-techno-1.0').then(cache => {
//         cache.addAll([
//             'index.html',
//             'main.js',
//             'vendors/bootstrap4.min.css'
//         ]);
//     })
// }

//Not persistante

// if(window.Notification && window.Notification !== 'denied') {
//     Notification.requestPermission(perm => {
//         if(perm === 'granted') {
//             const options = {
//                 body: 'Je suis le body de la notification',
//                 icon: 'images/icons/icon-192x192.png'
//             };
//             const notif = new Notification('Hello notification', options);
//             console.log('notification : ', notif);
//         } else {
//             console.log("L'autorisation de recevoir des notifications a été refusée");
//         }
//     })
// }
