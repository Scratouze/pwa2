const webPush = require('web-push');
const pushServerKeys = require('./pushServerKeys.json');
const pushClientSubscription = require('./pushClientSubscription.json');
// console.log(pushServerKeys, pushClientSubscription);

webPush.setVapidDetails('mailto:hornet-yop@hotmail.com', pushServerKeys.publicKey, pushServerKeys.privateKey);

const subscription = {
    endpoint: pushClientSubscription.endpoint,
    keys : {
        auth: pushClientSubscription.keys.auth,
        p256dh: pushClientSubscription.keys.p256dh
    }
};

webPush.sendNotification(subscription, 'Notification envoyée depuis le serveur push node :)')
    .then(res => console.log('ma push Notification a bien été poussée',res))
    .catch(err => console.error());