/**
 * ext-arrows.js
 *
 * @license MIT
 *
 * @copyright 2010 Alexis Deveria
 *
 */
export default {
  name: 'arrows',
  async init (S) {

    const contextTools = [
      {
        type: 'select',
        panel: 'arrow_panel',
        id: 'arrow_list',
        defval: 'end',
        events: {
          change: setArrow
        }
      }
    ];  
    const strings = await S.importLocale();
    const svgEditor = this;
    const svgCanvas = svgEditor.canvas;
    const // {svgcontent} = S,
      addElem = svgCanvas.addSVGElementFromJson,
      {nonce, $} = S,
      prefix = 'se_arrow_';

    let selElems, arrowprefix, randomizeIds = S.randomize_ids;

    /**
    * @param {Window} win
    * @param {!(string|Integer)} n
    * @returns {undefined}
    */
    function setArrowNonce (win, n) {
      randomizeIds = true;
      arrowprefix = prefix + n + '_';
      pathdata.fw.id = arrowprefix + 'fw';
      pathdata.bk.id = arrowprefix + 'bk';
    }

    /**
    * @param {Window} win
    * @returns {undefined}
    */
    function unsetArrowNonce (win) {
      randomizeIds = false;
      arrowprefix = prefix;
      pathdata.fw.id = arrowprefix + 'fw';
      pathdata.bk.id = arrowprefix + 'bk';
    }

    svgCanvas.bind('setnonce', setArrowNonce);
    svgCanvas.bind('unsetnonce', unsetArrowNonce);

    if (randomizeIds) {
      arrowprefix = prefix + nonce + '_';
    } else {
      arrowprefix = prefix;
    }

    const pathdata = {
      fw: {d: 'm0,0l10,5l-10,5l5,-5l-5,-5z', refx: 8, id: arrowprefix + 'fw'},
      bk: {d: 'm10,0l-10,5l10,5l-5,-5l5,-5z', refx: 2, id: arrowprefix + 'bk'}
    };

    $('#arrow_list').val(contextTools[0].defval);
    addMarker("fw", contextTools[0].defval);

    /**
     * Gets linked element.
     * @param {Element} elem
     * @param {string} attr
     * @returns {Element}
    */
    function getLinked (elem, attr) {
      const str = elem.getAttribute(attr);
      if (!str) { return null; }
      const m = str.match(/\(#(.*)\)/);
      if (!m || m.length !== 2) {
        return null;
      }
      return svgCanvas.getElem(m[1]);
    }

    /**
    * @param {boolean} on
    * @returns {undefined}
    */
    function showPanel (on) {
      let was_on=$('#arrow_panel').is(":visible");
      let val = contextTools[0].defval;
      $('#arrow_panel').toggle(on);
      if (on && was_on) {
        // const el = selElems[0];
        // const end = el.getAttribute('marker-end');
        // const start = el.getAttribute('marker-start');
        // const mid = el.getAttribute('marker-mid');
        val = $('#arrow_list :selected').val();
      }
      $('#arrow_list').val(val);
      setArrowWithVal(val);

    }

    /**
    *
    * @returns {undefined}
    */
    function resetMarker () {
      const el = selElems[0];
      el.removeAttribute('marker-start');
      el.removeAttribute('marker-mid');
      el.removeAttribute('marker-end');
    }
    /**
    * @param {"bk"|"fw"} dir
    * @param {"both"|"mid"|"end"|"start"} type
    * @param {string} id
    * @returns {Element}
    */
    function addMarker (dir, type, id) {
      // TODO: Make marker (or use?) per arrow type, since refX can be different
      id = id || arrowprefix + dir;

      const data = pathdata[dir];

      if (type === 'mid') {
        data.refx = 5;
      }

      let marker = svgCanvas.getElem(id);
      if (!marker) {
        marker = addElem({
          element: 'marker',
          attr: {
            viewBox: '0 0 10 10',
            id,
            refY: 5,
            markerUnits: 'strokeWidth',
            markerWidth: 5,
            markerHeight: 5,
            orient: 'auto',
            style: 'pointer-events:none' // Currently needed for Opera
          }
        });
        const arrow = addElem({
          element: 'path',
          attr: {
            d: data.d,
            fill: '#000000'
          }
        });
        marker.append(arrow);
        svgCanvas.findDefs().append(marker);
      }

      marker.setAttribute('refX', data.refx);

      return marker;
    }

    /**
    *
    * @returns {undefined}
    */
    function setArrow () {
      return setArrowWithVal(this.value);
    }
    function setArrowWithVal (type) {
      resetMarker();

      if (type === 'none') {
        return;
      }

      // Set marker on element
      let dir = 'fw';
      if (type === 'mid_bk') {
        type = 'mid';
        dir = 'bk';
      } else if (type === 'both') {
        addMarker('bk', type);
        svgCanvas.changeSelectedAttribute('marker-start', 'url(#' + pathdata.bk.id + ')');
        type = 'end';
        dir = 'fw';
      } else if (type === 'start') {
        dir = 'bk';
      }

      addMarker(dir, type);
      svgCanvas.changeSelectedAttribute('marker-' + type, 'url(#' + pathdata[dir].id + ')');
      svgCanvas.call('changed', selElems);
    }

    /**
    * @param {Element} elem
    * @returns {undefined}
    */
    function colorChanged (elem) {
      const color = elem.getAttribute('stroke');
      const mtypes = ['start', 'mid', 'end'];
      const defs = svgCanvas.findDefs();

      $.each(mtypes, function (i, type) {
        const marker = getLinked(elem, 'marker-' + type);
        if (!marker) { return; }

        const curColor = $(marker).children().attr('fill');
        const curD = $(marker).children().attr('d');
        if (curColor === color) { return; }

        const allMarkers = $(defs).find('marker');
        let newMarker = null;
        // Different color, check if already made
        allMarkers.each(function () {
          const attrs = $(this).children().attr(['fill', 'd']);
          if (attrs.fill === color && attrs.d === curD) {
            // Found another marker with this color and this path
            newMarker = this; // eslint-disable-line consistent-this
          }
        });

        if (!newMarker) {
          // Create a new marker with this color
          const lastId = marker.id;
          const dir = lastId.includes('_fw') ? 'fw' : 'bk';

          newMarker = addMarker(dir, type, arrowprefix + dir + allMarkers.length);

          $(newMarker).children().attr('fill', color);
        }

        $(elem).attr('marker-' + type, 'url(#' + newMarker.id + ')');

        // Check if last marker can be removed
        let remove = true;
        $(S.svgcontent).find('line, polyline, path, polygon').each(function () {
          const element = this; // eslint-disable-line consistent-this
          $.each(mtypes, function (j, mtype) {
            if ($(element).attr('marker-' + mtype) === 'url(#' + marker.id + ')') {
              remove = false;
              return remove;
            }
            return undefined;
          });
          if (!remove) { return false; }
          return undefined;
        });

        // Not found, so can safely remove
        if (remove) {
          $(marker).remove();
        }
      });
    }

    return {
      name: strings.name,
      context_tools: strings.contextTools.map((contextTool, i) => {
        return Object.assign(contextTools[i], contextTool);
      }),
      callback () {
        $('#arrow_panel').hide();
        // Set ID so it can be translated in locale file
        $('#arrow_list option')[0].id = 'connector_no_arrow';
      },
      async addLangData ({lang, importLocale}) {
        const {langList} = await importLocale();
        return {
          data: langList
        };
      },
      selectedChanged (opts) {
        // Use this to update the current selected elements
        selElems = opts.elems;

        const markerElems = ['line', 'path', 'polyline', 'polygon'];
        let i = selElems.length;
        while (i--) {
          const elem = selElems[i];
          if (elem && markerElems.includes(elem.tagName)) {
            if (opts.selectedElement && !opts.multiselected) {
              showPanel(true);
            } else {
              showPanel(false);
            }
          } else {
            showPanel(false);
          }
        }
      },
      elementChanged (opts) {
        const elem = opts.elems[0];
        if (elem && (
          elem.getAttribute('marker-start') ||
          elem.getAttribute('marker-mid') ||
          elem.getAttribute('marker-end')
        )) {
          // const start = elem.getAttribute('marker-start');
          // const mid = elem.getAttribute('marker-mid');
          // const end = elem.getAttribute('marker-end');
          // Has marker, so see if it should match color
          colorChanged(elem);
        }
      }
    };
  }
};
