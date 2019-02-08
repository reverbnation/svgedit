
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
          blue_triangle: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="0 0 38.43 38.43"><g><polygon points="19.22 0 0 33.28 38.43 33.28 19.22 0" style="fill:#364fc7"/></g></svg></svg>',
          red_circle: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="0 0 31.95 31.95"><circle cx="15.98" cy="15.98" r="15.98" style="fill:#eb244c"/></svg></svg>',
          fb_goal: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="0 0 98.47 23.45"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><rect x="1" y="1" width="96.47" height="21.45" transform="translate(98.47 23.45) rotate(180)" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px"/><polyline points="67.79 22.45 67.79 13.88 60.37 9.6 52.95 13.88 52.95 22.45" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px;fill-rule:evenodd"/><polyline points="45.53 1 45.53 9.57 52.95 13.85 60.37 9.57 60.37 1" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px;fill-rule:evenodd"/><polyline points="82.63 22.45 82.63 13.88 75.21 9.6 67.79 13.88" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px;fill-rule:evenodd"/><line x1="75.21" y1="9.57" x2="75.21" y2="1" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px"/><polyline points="97.47 13.88 90.05 9.6 82.63 13.88" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px;fill-rule:evenodd"/><line x1="90.05" y1="9.57" x2="90.05" y2="1" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px"/><polyline points="52.95 22.45 52.95 13.88 45.53 9.6 38.1 13.88 38.1 22.45" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px;fill-rule:evenodd"/><polyline points="30.68 1 30.68 9.57 38.1 13.85 45.53 9.57 45.53 1" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px;fill-rule:evenodd"/><polyline points="15.84 1 15.84 9.57 23.26 13.85 30.68 9.57 30.68 1" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px;fill-rule:evenodd"/><polyline points="23.26 22.45 23.26 13.88 15.84 9.6 8.42 13.88 8.42 22.45" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px;fill-rule:evenodd"/><polyline points="1 9.57 8.42 13.85 15.84 9.57 15.84 1" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px;fill-rule:evenodd"/></g></g></svg></svg>',
          ball: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="0 0 16 16"><g id="svg_6"><path d="m8,16l0,-8l-8,0a8,8 0 0 0 8,8z" style="fill:#000;stroke:#000;stroke-width:2px;" id="svg_2"/><path d="m8,0l0,8l8,0a8,8 0 0 0 -8,-8z" style="fill:#000;stroke:#000;stroke-width:2px;" id="svg_3"/><path d="m0,8a8,8 0 1 0 16,0"  style="fill:none;stroke:#000;stroke-width:2px;" id="svg_1"/><path d="m16,8a8,8 0 1 0 -16,0"  style="fill:none;stroke:#000;stroke-width:2px;" id="svg_4"/></g></svg></svg>',
          square: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="0 0 300 300"><path fill="none" stroke="#000" stroke-width="3" d="m0,0l300,0l0,300l-300,0z"/></svg></svg>',
          diamond: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><path fill="none" stroke="#000" stroke-width="3" d="m1,150l149,-149l149,149l-149,149l-149,-149z"/></svg></svg>',
          pentagon: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><path fill="none" stroke="#000" stroke-width="3" d="m1.00035,116.97758l148.99963,-108.4053l148.99998,108.4053l-56.91267,175.4042l-184.1741,0l-56.91284,-175.4042z"/></svg></svg>',
          hexagon: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><path fill="none" stroke="#000" stroke-width="3" d="m1,149.99944l63.85715,-127.71428l170.28572,0l63.85713,127.71428l-63.85713,127.71428l-170.28572,0l-63.85715,-127.71428z"/></svg></svg>',
          star_points_5: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><path fill="none" stroke="#000" stroke-width="3" d="m1,116.58409l113.82668,0l35.17332,-108.13487l35.17334,108.13487l113.82666,0l-92.08755,66.83026l35.17514,108.13487l-92.08759,-66.83208l-92.08757,66.83208l35.17515,-108.13487l-92.08758,-66.83026z"/></svg></svg>',
          arrow_up: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><path fill="none" stroke="#000" stroke-width="3" d="m1.49805,149.64304l148.50121,-148.00241l148.50121,148.00241l-74.25061,0l0,148.71457l-148.5012,0l0,-148.71457z"/></svg></svg>',
          man: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><path fill="none" stroke="#000" stroke-width="3" d="m125.90131,25.2503c0,-13.33112 10.79823,-24.12934 24.12934,-24.12934c13.33113,0 24.12932,10.79822 24.12932,24.12934c0,13.33112 -10.79819,24.12934 -24.12932,24.12934c-13.33113,0 -24.12934,-10.79822 -24.12934,-24.12934zm81.12696,68.30144l0,-12.18601c0,-12.82147 -10.38806,-23.21696 -23.21696,-23.21696l-67.63607,0c-12.82147,0 -23.21695,10.39549 -23.21695,23.21696l0,12.18601c-0.02242,0.2766 -0.03739,0.56071 -0.03739,0.84853l0,70.18918c0,5.4538 4.41839,9.87215 9.87218,9.87215c5.44633,0 9.87589,-4.41837 9.87589,-9.87215l0,-69.14999l6.62006,0l0,79.02961l0.04859,0l0,111.66646c0,7.25925 5.89491,13.15787 13.16164,13.15787c7.27048,0 13.16164,-5.89114 13.16164,-13.15787l0,-111.66646l8.68347,0l0,111.66646c0,7.25925 5.89856,13.15787 13.16162,13.15787c7.27045,0 13.16161,-5.89114 13.16161,-13.15787l0,-111.66646l0.04112,0l0,-79.02961l6.62007,0l0,69.14623c0,5.45381 4.42955,9.8759 9.8759,9.8759c5.45386,0 9.87218,-4.42209 9.87218,-9.8759l0,-70.18916c-0.00371,-0.29156 -0.02617,-0.56819 -0.0486,-0.8448z" style="fill:#eee"/></svg></svg>',
          uml_actor: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><path fill="none" stroke="#000" stroke-width="3" d="m40.5,100l219,0m-108.99991,94.00006l107,105m-107.00009,-106.00006l-100,106m99.5,-231l0,125m33.24219,-158.75781c0,18.35916 -14.88303,33.24219 -33.24219,33.24219c-18.35916,0 -33.2422,-14.88303 -33.2422,-33.24219c0.00002,-18.35915 14.88304,-33.24219 33.2422,-33.24219c18.35916,0 33.24219,14.88304 33.24219,33.24219z"/></svg></svg>',
          cross: '<svg xmlns="http://www.w3.org/2000/svg"><svg viewBox="-15 -15 330 330"><path fill="none" stroke="#000" stroke-width="3" d="m0.99844,99.71339l98.71494,0l0,-98.71495l101.26279,0l0,98.71495l98.71495,0l0,101.2628l-98.71495,0l0,98.71494l-101.26279,0l0,-98.71494l-98.71494,0z"/></svg></svg>'
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

        // //these are relative to the canvas
        startX = opts.start_x;
        const x = startX + 10;
        startY = opts.start_y;
        const y = startY + 10;
        // console.log("start at "+startX+","+startY);
        // console.log("currentD " + currentD);
        
        // let newshapetext = '{"element":"g","attr":{},"children":[{"element":"polygon","attr":{"points":"19.22 0 0 33.28 38.43 33.28 19.22 0","fill":"#364fc7"},"children":[]}]}';
        // let newshapetext = '{"element":"g","attr":{},"children":[{"element":"polygon","attr":{"fill":"#364fc7","points":"19.22 0 0 33.28 38.43 33.28 19.22 0"},"children":[]}]}'
        //let newshapetext ='{"element":"g","attr":{"id":"svg_4","fill-opacity":"1","stroke-opacity":"1"},"children":[{"element":"ellipse","attr":{"fill":"#000000","stroke":"#000000","stroke-width":"null","stroke-dasharray":"null","stroke-linejoin":"null","stroke-linecap":"null","fill-opacity":"0","style":"pointer-events:inherit","cx":"101","cy":"155","rx":"53","ry":"45","id":"svg_1","stroke-opacity":"1"},"children":[]},{"element":"ellipse","attr":{"fill":"#000000","stroke":"#000000","stroke-width":"null","stroke-dasharray":"null","stroke-linejoin":"null","stroke-linecap":"null","fill-opacity":"0","cx":"234","cy":"174","rx":"103","ry":"99","id":"svg_3","stroke-opacity":"1"},"children":[]}]}';
        // const newShape = JSON.parse(newshapetext);

        const shape = new DOMParser().parseFromString(currentD,"image/svg+xml");
        const newShape = convertDomToJson(shape.documentElement);
        // curShape = canv.addSVGElementFromJson({
        //   element: 'path',
        //   curStyles: true,
        //   attr: {
        //     d: currentD,
        //     id: canv.getNextId(),
        //     opacity: curStyle.opacity / 2,
        //     style: 'pointer-events:none'
        //   }
        // });

        // // Make sure shape uses absolute values
        // if ((/[a-z]/).test(currentD)) {
        //   currentD = curLib.data[curShapeId] = canv.pathActions.convertPath(curShape);
        //   curShape.setAttribute('d', currentD);
        //   canv.pathActions.fixEnd(curShape);
        // }

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
    
        let sx = (curLib.scale / lastBBox.width) || 1;
        let sy = (curLib.scale / lastBBox.height) || 1;
        sx = (sx+ sy) / 2;
        // console.log('scale ' + sx);
        curShape.setAttribute('transform', 'translate(' + 0 + ',' + 0 + ') scale(' + sx + ') translate(' + -(lastBBox.x) + ',' + -(lastBBox.y) + ')');
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

        const x = opts.mouse_x / zoom;
        const y = opts.mouse_y / zoom;

        const tlist = canv.getTransformList(curShape),
          box = curShape.getBBox(),
          left = box.x, top = box.y;
          // {width, height} = box,
        // const dx = (x - startX), dy = (y - startY);

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
        if (!evt.shiftKey) {
          const max = Math.min(Math.abs(sx), Math.abs(sy));

          sx = max * (sx < 0 ? -1 : 1);
          sy = max * (sy < 0 ? -1 : 1);
        }
        scale.setScale(sx, sy);

        translateBack.setTranslate(left + tx, top + ty);
        tlist.appendItem(translateBack);
        tlist.appendItem(scale);
        tlist.appendItem(translateOrigin);

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
      }
    };
  }
};
