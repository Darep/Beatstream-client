define([
  'lib/mediator',
  'lib/api'
], function (mediator, Api) {

  function RefreshView() {
    this.running = false;
    this.refreshEl = $('.media-library-refresh');
    this.doneEl = $('.media-library-refresh-done');
    this.failEl = $('.media-library-refresh-fail');

    this.failEl.find('.dismiss-warning').click(function () {
      _this.failEl.removeClass('show');
    });
  }

  RefreshView.prototype.show = function() {
    if (this.running) {
      return;
    }

    var _this = this;

    this.running = true;
    this.refreshEl.addClass('show');

    Api.refreshMediaLibrary().always(function () {
      _this.refreshEl.removeClass('show');
      _this.running = false;
    })
    .done(function (data) {
      mediator.publish('medialibrary:refresh', data);

      _this.doneEl.addClass('show');

      setTimeout(function () {
        // TODO: use CSS3 instead
        _this.doneEl.fadeOut('slow');
      }, 3000);
    })
    .fail(function () {
      _this.failEl.addClass('show');
    });
  };

  RefreshView.prototype.hide = function () {
    // TODO: this
  };

  return RefreshView;
});
