
/**
 * ext-svgshapes.js
 *
 * @license MIT
 *
 * @copyright 2010 Christian Tzurcanu, 2010 Alexis Deveria
 *
 */
import {
  getStrokedBBoxDefaultVisible
} from '../utilities.js';

export default {
  name: 'svgshapes',
  async init ({$, importLocale}) {
    const strings = await importLocale();
    const svgEditor = this;
    const canv = svgEditor.canvas;
    const svgroot = canv.getRootElem();
    let lastBBox = {};

    // This populates the category list
    const {categories} = strings;

    //offset the viewbox by 
    const library = {
      basic: {
        data: {
          square: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="0 0 300 300"><g><path fill="none" stroke="#000" stroke-width="3" d="m0,0l300,0l0,300l-300,0z"/></g></svg></svg>',
          diamond: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><g><path fill="none" stroke="#000" stroke-width="3" d="m1,150l149,-149l149,149l-149,149l-149,-149z"/></g></svg></svg>',
          pentagon: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><g><path fill="none" stroke="#000" stroke-width="3" d="m1.00035,116.97758l148.99963,-108.4053l148.99998,108.4053l-56.91267,175.4042l-184.1741,0l-56.91284,-175.4042z"/></g></svg></svg>',
          hexagon: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><g><path fill="none" stroke="#000" stroke-width="3" d="m1,149.99944l63.85715,-127.71428l170.28572,0l63.85713,127.71428l-63.85713,127.71428l-170.28572,0l-63.85715,-127.71428z"/></g></svg></svg>',
          star_points_5: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><g><path fill="none" stroke="#000" stroke-width="3" d="m1,116.58409l113.82668,0l35.17332,-108.13487l35.17334,108.13487l113.82666,0l-92.08755,66.83026l35.17514,108.13487l-92.08759,-66.83208l-92.08757,66.83208l35.17515,-108.13487l-92.08758,-66.83026z"/></g></svg></svg>',
          arrow_up: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><g><path fill="none" stroke="#000" stroke-width="3" d="m1.49805,149.64304l148.50121,-148.00241l148.50121,148.00241l-74.25061,0l0,148.71457l-148.5012,0l0,-148.71457z"/></g></svg></svg>',
          uml_actor: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><g><path fill="none" stroke="#000" stroke-width="3" marker-end="none" d="m40.5,100l219,0m-108.99991,94.00006l107,105m-107.00009,-106.00006l-100,106m99.5,-231l0,125m33.24219,-158.75781c0,18.35916 -14.88303,33.24219 -33.24219,33.24219c-18.35916,0 -33.2422,-14.88303 -33.2422,-33.24219c0.00002,-18.35915 14.88304,-33.24219 33.2422,-33.24219c18.35916,0 33.24219,14.88304 33.24219,33.24219z"/></g></svg></svg>',
          cross: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><g><path fill="none" stroke="#000" stroke-width="3" d="m0.99844,99.71339l98.71494,0l0,-98.71495l101.26279,0l0,98.71495l98.71495,0l0,101.2628l-98.71495,0l0,98.71494l-101.26279,0l0,-98.71494l-98.71494,0z"/></g></svg></svg>'
        },
        scale: 30,
        buttons: []
      }
    };
  
    const modeId = 'svgshapelib';
    const startClientPos = {};

    let currentD, curShapeId, curShape, startX, startY;
    let curLib = library.basic;

    /**
    *
    * @returns {undefined}
    */
    function loadIcons () {
      $('#svgshape_buttons').empty().append(curLib.buttons);
    }

    /**
    * @typedef {PlainObject} module:Extension.Shapes.Shapes
    * @property {PlainObject.<string, string>} data
    * @property {Integer} [size]
    * @property {boolean} [fill]
    */

    /**
    * @param {string|"basic"} cat Category ID
    * @param {module:Extension.Shapes.Shapes} shapes
    * @returns {undefined}
    */
    function makeButtons (cat, shapes) {
      // console.log("Make buttons for " + cat + " out of " + shapes);
      const shapeIcon = new DOMParser().parseFromString(
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"></svg>',"image/svg+xml"
      );

      const svgElem = $(document.importNode(shapeIcon.documentElement, true));

      const {data} = shapes;

      curLib.buttons = Object.entries(data).map(([id, item]) => {
        const icon = svgElem.clone();
        let newNode = new DOMParser().parseFromString(item, "image/svg+xml");
        icon.append(newNode.documentElement);

        const iconBtn = icon.wrap('<div class="tool_button">').parent().attr({
          id: modeId + '_' + id,
          title: id
        });
        // Store for later use
        return iconBtn[0];
      });
    }

    function convertDomToJson(dom) {
      const result = {};
      if (dom.tagName == "svg") {
        return convertDomToJson(dom.firstChild);
      } else if (dom.tagName == "title") {
        console.log("ERROR: title tag not supported, please remove from svg shapel definition");
        return {};
      } else {
        result['element']=dom.tagName
        const attr = {};
        for(let i=0;i< dom.attributes.length; i++) {
          let pair = dom.attributes[i]; 
          if (pair.name == "style") {
            pair.value.split(";").forEach(function(sty) {
              let set = sty.split(":");
              attr[set[0]] = set[1];
            });
          } else {
            attr[pair.name] = pair.value;    
          }
        }
        result['attr'] = attr;
        const children = [];
        for(let i=0;i< dom.children.length; i++) {
          let child = dom.children[i]; 
          children.push(convertDomToJson(child));
        }
        if ((dom.tagName == 'text') && (dom.textContent.length > 0)) {
          console.log("node " + dom.tagName + " has text content " + dom.textContent);
          children.push(dom.textContent);
        }
        result['children'] = children;
      }
      return result;
    }

    /**
    * @param {string|"basic"} catId
    * @returns {undefined}
    */
    function loadLibrary (catId) {
      const lib = library[catId];

      if (!lib) {
        // console.log("load library for " + catId + " from " + svgEditor.curConfig.extIconsPath + 'svgshapelib/' + catId + '.json');

        $('#svgshape_buttons').html(strings.loading);
        $.getJSON(svgEditor.curConfig.extIconsPath + 'svgshapelib/' + catId + '.json', function (result) {
          // console.log("library loaded " + result.data);
          curLib = library[catId] = {
            data: result.data,
            size: result.size,
            fill: result.fill
          };
          makeButtons(catId, result);
          loadIcons();
        });
        return;
      }
      curLib = lib;
      if (!lib.buttons.length) { makeButtons(catId, lib); }
      loadIcons();
    }
    const buttons = [{
      id: 'tool_svgshapelib',
      icon: svgEditor.curConfig.extIconsPath + 'svgshapes.png',
      type: 'mode_flyout', // _flyout
      position: 6,
      events: {
        click () {
          canv.setMode(modeId);
          //svgEditor.toolButtonClick('#tool_svgshapelib_show');
        }
      }
    }];

    return {
      svgicons: svgEditor.curConfig.extIconsPath + 'ext-svgshapes.xml',
      buttons: strings.buttons.map((button, i) => {
        return Object.assign(buttons[i], button);
      }),
      callback () {
        $('<style>').text(`
          #svgshape_buttons {
            overflow: auto;
            width: 180px;
            max-height: 300px;
            display: table-cell;
            vertical-align: middle;
          }
          #svgshape_cats {
            min-width: 110px;
            display: table-cell;
            vertical-align: middle;
            height: 300px;
          }
          #svgshape_cats > div {
            line-height: 1em;
            padding: .5em;
            border:1px solid #B0B0B0;
            background: #E8E8E8;
            margin-bottom: -1px;
          }
          #svgshape_cats div:hover {
            background: #FFFFCC;
          }
          #svgshape_cats div.current {
            font-weight: bold;
          }
        `).appendTo('head');

        const btnDiv = $('<div id="svgshape_buttons">');
        $('#tools_svgshapelib > *').wrapAll(btnDiv);

        const shower = $('#tools_svgshapelib_show');

        loadLibrary('basic');

        // Do mouseup on parent element rather than each button
        $('#svgshape_buttons').mouseup(function (evt) {
          const btn = $(evt.target).closest('div.tool_button');

          if (!btn.length) { return; }

          const copy = btn.children().clone();
          shower.children(':not(.flyout_arrow_horiz)').remove();
          shower
            .append(copy)
            .attr('data-curopt', '#' + btn[0].id) // This sets the current mode
            .mouseup();
          canv.setMode(modeId);

          curShapeId = btn[0].id.substr((modeId + '_').length);
          currentD = curLib.data[curShapeId];

          $('.tools_flyout').fadeOut();
        });

        const shapeCats = $('<div id="svgshape_cats">');

        let catStr = '';
        $.each(categories, function (id, label) {
          catStr += '<div data-cat=' + id + '>' + label + '</div>';
        });

        shapeCats.html(catStr).children().bind('mouseup', function () {
          const catlink = $(this);
          catlink.siblings().removeClass('current');
          catlink.addClass('current');
          // console.log("mouse up on "+ catlink.attr('data-cat'));

          loadLibrary(catlink.attr('data-cat'));
          // Get stuff
          return false;
        });

        shapeCats.children().eq(0).addClass('current');

        $('#tools_svgshapelib').append(shapeCats);

        shower.mouseup(function () {
          // console.log("shower mouse up " + currentD + ":" + modeId);
          canv.setMode(currentD ? modeId : 'select');
        });
        $('#tool_svgshapelib').remove();

        const h = $('#tools_svgshapelib').height();
        $('#tools_svgshapelib').css({
          'margin-top': -(h / 2 - 15),
          'margin-left': 3
        });
        // Now add shape categories from locale
        const cats = {};
        Object.entries(categories).forEach(([o, categoryName]) => {
          cats['#svgshape_cats [data-cat="' + o + '"]'] = categoryName;
        });
        this.setStrings('content', cats);
      },
      mouseDown (opts) {
        const mode = canv.getMode();
        if (mode !== modeId) { return undefined; }
        const zoom = canv.getZoom();
        // console.log("Zoom is "+ zoom);

        // //these are relative to the canvas
        // console.log("start at "+opts.start_x+","+opts.start_y);
        startX = opts.start_x * zoom;
        // const x = startX + 10;
        startY = opts.start_y * zoom;
        // const y = startY + 10;
        // console.log("currentD " + currentD);
        
        const shape = new DOMParser().parseFromString(currentD,"image/svg+xml");
        const newShape = convertDomToJson(shape.documentElement);

        function svg_checkIDs (elem) {
          if (elem.attr && elem.attr.id) {
            elem.attr.id = canv.getNextId();
          }
          if (elem.children) elem.children.forEach(svg_checkIDs);
        }
        svg_checkIDs(newShape);

        curShape = canv.addSVGElementFromJson(newShape);
      
        canv.selectOnly([curShape]);
          
        lastBBox = getStrokedBBoxDefaultVisible([curShape]);
        // console.log("before scale "+lastBBox.x + " " +lastBBox.y + " " +lastBBox.width + " " +lastBBox.height);
        if (curLib.scale > 0) {
          let sx = (curLib.scale / lastBBox.width) || 1;
          let sy = (curLib.scale / lastBBox.height) || 1;
          sx = (sx+ sy) / 2;  
          console.log('scale ' + sx);
          curShape.setAttribute('transform', 'translate(' + 0 + ',' + 0 + ') scale(' + sx + ') translate(' + -(lastBBox.x) + ',' + -(lastBBox.y) + ')');
        } else {
          // curShape.setAttribute('translate(' + -(lastBBox.x) + ',' + -(lastBBox.y) + ')');
        }
        canv.recalculateDimensions(curShape);

        // console.log("startX=" + startX + " lastBBox.x=" + lastBBox.x);
        const cx = startX - lastBBox.x,
          cy = startY - lastBBox.y;

        canv.moveSelectedElements(cx, cy, false);
        
        lastBBox = getStrokedBBoxDefaultVisible([curShape]);
        // console.log("after all " + lastBBox.x + " " +lastBBox.y + " " +lastBBox.width + " " +lastBBox.height);

        return {
          started: true
        };
      },
      mouseMove (opts) {
        // console.log("mouseMove");
        const mode = canv.getMode();
        if (mode !== modeId) { return; }

        const zoom = canv.getZoom();
        const evt = opts.event;

        const x = opts.mouse_x;
        const y = opts.mouse_y;

        const tlist = canv.getTransformList(curShape),
          box = curShape.getBBox(),
          left = box.x, top = box.y;
          // {width, height} = box,
        // const dx = (x - startX), dy = (y - startY);

        if (curLib.scale > 0) {

          const newbox = {
            x: Math.min(startX, x),
            y: Math.min(startY, y),
            width: Math.max(curLib.scale,Math.abs(x - startX)),
            height: Math.max(curLib.scale,Math.abs(y - startY))
          };
          // console.log(newbox.x + " " +newbox.y + " " +newbox.width + " " +newbox.height);

          /*
          // This is currently serving no purpose, so commenting out
          let sy = height ? (height + dy) / height : 1,
            sx = width ? (width + dx) / width : 1;
          */

          let sx = (newbox.width / lastBBox.width) || 1;
          let sy = (newbox.height / lastBBox.height) || 1;
          // console.log(sx + ":" + sy);
          // Not perfect, but mostly works...
          let tx = 0;
          if (x < startX) {
            tx = lastBBox.width;
          }
          let ty = 0;
          if (y < startY) {
            ty = lastBBox.height;
          }

          // update the transform list with translate,scale,translate
          const translateOrigin = svgroot.createSVGTransform(),
            scale = svgroot.createSVGTransform(),
            translateBack = svgroot.createSVGTransform();

          translateOrigin.setTranslate(-(left + tx), -(top + ty));
          if (evt.shiftKey) {
            const max = Math.min(Math.abs(sx), Math.abs(sy));

            sx = max * (sx < 0 ? -1 : 1);
            sy = max * (sy < 0 ? -1 : 1);
          }
          scale.setScale(sx, sy);

          translateBack.setTranslate(left + tx, top + ty);
          tlist.appendItem(translateBack);
          tlist.appendItem(scale);
          tlist.appendItem(translateOrigin);
        }
        
        canv.recalculateDimensions(curShape);

        lastBBox = curShape.getBBox();
      },
      mouseUp (opts) {
        const mode = canv.getMode();
        if (mode !== modeId) { return undefined; }

        const keepObject = true;//(opts.event.clientX !== startClientPos.x && opts.event.clientY !== startClientPos.y);

        return {
          keep: keepObject,
          element: curShape,
          started: false
        };
      },
      selectedChanged (opts) {
        // console.log("svgshapes selectedChanged opts=" + JSON.stringify(opts));
      }
    };
  }
};
