define([
    'slickgrid'
],
function () {
    // set jQuery.event.drag plugin's default drag start distance
    jQuery.event.special.drag.defaults.distance = 7;

    var SLICKGRID_COLUMNS = [
        { id: 'np', resizable: false, width: 22 },
        { id: 'artist', name: 'Artist', field: 'artist', sortable: true },
        { id: 'tracknum', name: '', field: 'tracknum', sortable: false, resizable: false, cssClass: 'tracknum', width: 30 },
        { id: 'title', name: 'Title', field: 'title', sortable: true },
        { id: 'album', name: 'Album', field: 'album', sortable: true },
        { id: 'duration', name: 'Duration', field: 'nice_length', sortable: true, cssClass: 'duration', width: 30 },
        { id: 'path', name: '', field: 'path' }
    ];

    var SLICKGRID_OPTIONS = {
        editable: false,
        forceFitColumns: true,
        enableAutoTooltips: true,
        enableCellNavigation: true,
        enableColumnReorder: false,  // this will be dynamically changed based on playlist type
        multiSelect: true,
        rowHeight: 22
    };

    function PlaylistView() {
        this.dataView = undefined;
        this.grid = undefined;
        this.searchString = '';

        this.events = {
            onSongSelect: function () {}
        };

        this.initSlickGrid('#slickgrid');
    }

    PlaylistView.prototype.initSlickGrid = function (selector) {
        this.dataView = new Slick.Data.DataView({ inlineFilters: true });
        this.grid = new Slick.Grid(selector, this.dataView, SLICKGRID_COLUMNS, SLICKGRID_OPTIONS);

        this.grid.setSelectionModel( new Slick.RowSelectionModel() );
        this.grid.setColumns( SLICKGRID_COLUMNS.slice(0, -1) );  // slice(), so path column is hidden

        // Hook SlickGrid events

        var self = this,
            dataView = this.dataView,
            grid = this.grid;

        // Model events (like, super required)
        this.dataView.onRowCountChanged.subscribe(function (e, args) {
            grid.updateRowCount();
            grid.render();
        });

        this.dataView.onRowsChanged.subscribe(function (e, args) {
            grid.invalidateRows(args.rows);
            grid.render();
        });

        // Mouse events
        this.grid.onClick.subscribe(function (e) {
            var cell = grid.getCellFromEvent(e);
            grid.setSelectedRows([cell.row]);
        });

        this.grid.onDblClick.subscribe(function (e) {
            var cell = grid.getCellFromEvent(e);
            var dataItem = grid.getDataItem(cell.row);
            self.selectSong(dataItem.id);

            e.stopPropagation();
        });

        // Keyboard events
        this.grid.onKeyDown.subscribe(function (e) {
            if (e.keyCode == keyCode.ENTER) {
                var rows = grid.getSelectedRows();

                if (!rows || rows.length <= 0) {
                    return;
                }

                var dataItem = grid.getDataItem(rows[0]);
                self.selectSong(dataItem.id);

                e.stopPropagation();
            }
        });

        // this.grid.onSelectedRowsChanged.subscribe(function (e) {
        //     //var row = this.grid.getSelectedRows()[0];
        // });

        // Drag events
        this.grid.onDragInit.subscribe(function (e, dd) {
            // we're handling drags! Don't you come here knockin'!
            e.stopImmediatePropagation();
        });

        this.grid.onDragStart.subscribe(function (e, dd) {
            // Add the song(s) that we are dragging into the event object
            var dataitem,
                data = [],
                song_count = 0,
                draggingSelectedRows = false,
                cell = grid.getCellFromEvent(e),
                rows = grid.getSelectedRows();

            // check if dragging previously selected rows
            for (var i = 0; i < rows.length; i++) {
                dataItem = grid.getDataItem(rows[i]);
                data[i] = dataItem;
                if (rows[i] === cell.row) {
                    draggingSelectedRows = true;
                }
                song_count++;
            }

            if (draggingSelectedRows === false) {
                dataItem = grid.getDataItem(cell.row);
                data = [];
                data[0] = dataItem;
                song_count = 1;
            }

            dd.draggedSongs = data;
            self.events.onDragStart(e, dd);

            // tell grid that we're handling drags!
            e.stopImmediatePropagation();
        });

        // let the other module handle drag and dragEnd events
        grid.onDrag.subscribe(self.events.onDrag);
        grid.onDragEnd.subscribe(self.events.onDragEnd);

        // Other events
        this.grid.onSort.subscribe(function (e, args) {
            var sortcol = args.sortCol.field;
            dataView.sort(trackComparison, args.sortAsc);
        });
    };

    PlaylistView.prototype.resizeCanvas = function () {
        this.grid.resizeCanvas();
    };

    PlaylistView.prototype.setPlaylist = function (playlist) {
        console.log(playlist);
        // Remove "now playing"-style row(s) from current grid
        this.grid.removeCellCssStyles('currentSong_playing');

        // Update data view model
        this.dataView.beginUpdate();
        this.dataView.setItems(playlist);

        // Filtering
        this.dataView.setFilterArgs({ searchString: this.searchString });
        this.dataView.setFilter(searchFilter);

        this.dataView.endUpdate();

        this.dataView.syncGridSelection(this.grid, false);
        this.dataView.syncGridCellCssStyles(this.grid, 'currentSong_playing');
    };

    PlaylistView.prototype.updateHeader = function (name, songCount) {
        // update playlist header data
        if (songCount === undefined) {
            songCount = 0;
        }

        var prettyCount = commify( parseInt(songCount, 10) );
        $('.page-header .count').text(prettyCount);
        $('.page-header.text').html( pluralize(songCount, 'song', 'songs') );
        $('.page-header .info h2').html(name);
    };

    PlaylistView.prototype.selectSong = function (id) {
        var song,
            tmpCellsObject = {},
            row = dataView.getRowById(id);

        if (row === undefined) {
            return; // song is not on the current list
        }

        song = dataView.getItemById(id);
        this.events.onSongSelect(song);

        // Set now playing icon
        grid.removeCellCssStyles('currentSong_playing');
        tmpCellsObject[row] = { np: 'playing' };
        grid.addCellCssStyles('currentSong_playing', tmpCellsObject);

        grid.setSelectedRows([row]);
        grid.scrollRowIntoView(row);
    };


    // Private

    function searchFilter(item, args) {
        if (args.searchString === "") {
            return true;
        }

        var searchStr = args.searchString.toLowerCase();
        searchStr = searchStr.split(' ');

        var match = true;

        for (var i = 0; i < searchStr.length; i++) {
            var str = searchStr[i];

            if (str[0] === '"') {
                if (str[str.length - 1] !== '"') {
                    for (var j = i + 1; j < searchStr.length; j++) {
                        var nextStr = searchStr[j];
                        str = str + " " + nextStr;
                        if (nextStr[nextStr.length - 1] === '"') {
                            i = j;
                            break;
                        }
                    }
                }
                if (str[str.length - 1] === '"') {
                    str = str.substr(1, str.length - 2);
                }
                else {
                    str = str.substr(1, str.length - 1);
                }
            }

            if ((item.title && item.title.toLowerCase().indexOf(str) != -1) ||
                (item.artist && item.artist.toLowerCase().indexOf(str) != -1) ||
                (item.album && item.album.toLowerCase().indexOf(str) != -1))
            {
                match = true;
            } else {
                return false;
            }
        }

        return match;
    }

    function trackComparison(a, b) {
        var x = a[sortcol],
            y = b[sortcol];

        if (!x) { return -1; }
        if (!y) { return 1; }

        if (sortcol == 'album') {
            x = a['album'] + ' ' + a['tracknum'];
            y = b['album'] + ' ' + b['tracknum'];
        }
        else if (sortcol == 'artist') {
            x = a['artist'] + ' ' + a['album'] + ' ' + a['tracknum'];
            y = b['artist'] + ' ' + b['album'] + ' ' + b['tracknum'];
        }

        return naturalsort(x, y);
    }

    function naturalsort(a, b) {
      function chunkify(t) {
        var tz = [], x = 0, y = -1, n = 0, i, j;

        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
          var m = (i == 46 || (i >=48 && i <= 57));
          if (m !== n) {
            tz[++y] = "";
            n = m;
          }
          tz[y] += j;
        }
        return tz;
      }

      var aa = chunkify(a.toLowerCase());
      var bb = chunkify(b.toLowerCase());

      for (x = 0; aa[x] && bb[x]; x++) {
        if (aa[x] !== bb[x]) {
          var c = Number(aa[x]), d = Number(bb[x]);
          if (c == aa[x] && d == bb[x]) {
            return c - d;
          } else return (aa[x] > bb[x]) ? 1 : -1;
        }
      }
      return aa.length - bb.length;
    }

    function pluralize(count, singular_text, plural_text) {
        if (count === 1) {
            return singular_text;
        } else if (!plural_text) {
            return singular_text + 's';
        } else {
            return plural_text;
        }
    }


    return PlaylistView;
});
