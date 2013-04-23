define(['mediator'], function () {
    var mediatorReal = new Mediator();

    var subscribers = [];

    var mediator = {
        subscribe: function(channel, callback) {
            subscribers.push({ channel: channel, identifier: callback });
            return mediatorReal.subscribe(channel, callback);
        },
        publish: function (channel, data) {
            return mediatorReal.publish(channel, data);
        },
        remove: function (channel, identifier) {
            return this.unsubscribe(channel, identifier);
        },
        unsubscribe: function (channel, identifier) {
            return mediatorReal.remove(channel, identifier);
        },
        once: function (a, b, c, d) {
            return mediatorReal.once(a, b, c, d);
        },
        clear: function () {
            // un-subscribe all
            for (var i = subscribers.length - 1; i >= 0; i--) {
                this.unsubscribe(subscribers[i].channel, subscribers[i].identifier);
            }
        }
    };

    return mediator;
});
