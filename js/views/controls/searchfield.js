define([], function () {

    function SearchField(el) {
        this.el = el;
        this.searchField = this.el.find('#search');
        this.clearButton = this.el.find('.clear');

        var self = this;

        this.events = {
            onSearch: function (searchString) {}
        };

        // Events
        this.searchField.keyup(function (e) {
            if (e.which == 27) {
                // clear field on Esc
                this.value = '';
            }

            searchString = this.value;
            self.events.onSearch(searchString);
        });

        this.clearButton.click(function (e) {
            e.preventDefault();
            e.stopPropagation();

            searchField.val('');
            self.events.onSearch('');
        }.bind(this));
    }

    return SearchField;

});
