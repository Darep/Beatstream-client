define(['store'], function (store) {

    var ToggleButton = function (selector, storeKey) {
        this.button = $(selector);
        this.storeKey = storeKey;
        this._value = getFromStore(storeKey);

        this.button.click(function (e) {
            e.preventDefault();
            this.setValue(!this._value);
        }.bind(this));

        if (this._value) {
            this.button.addClass('enabled');
        }
    };

    ToggleButton.prototype.setValue = function(value) {
        this._value = value;
        if (value) {
            this.button.addClass('enabled');
        } else {
            this.button.removeClass('enabled');
        }
        store.set(this.storeKey, value);
    };

    ToggleButton.prototype.getValue = function() {
        return this._value;
    };


    // Private

    function getFromStore(key) {
        if (key && store.get(key)) {
            return store.get(key);
        } else {
            return false;
        }
    }

    return ToggleButton;
});
