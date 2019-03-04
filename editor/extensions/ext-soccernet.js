//Steps to make a new single shape tool called "myshape"
//duplicate this file and rename to ext-myshape.js
//rename all soccernet to myshape
//Optional: pick a unique hotkey, button.key, see toolButtons in svg-edit.js
//update the shape for call to addSVGElementFromJson
//copy the extension/ext-locale/soccernet folder and contents to extension/ext-locale/myshape, edit language files
//add the svg for you button icon to soccer-icons.xml with the id tool_myshape
//load the extension in svg-editor.js
//test to determine correct position, update button.position as needed
export default {
  name: 'soccernet',
  async init (S) {
    const name = 'soccernet';
    const svgEditor = this;
    const svgCanvas = svgEditor.canvas;
    const {$, importLocale} = S, // {svgcontent}
      // addElem = svgCanvas.addSVGElementFromJson,
      editingitex = false;
    const strings = await importLocale();
    let selElems,
      started, newFO;

      /**
    * @param {string} attr
    * @param {string|Float} val
    * @returns {undefined}
    */

    const singleSelectedObject = function(opts) {
      selElems = opts.elems;
      if (selElems.length != 1) {
        return null;
      }
      const elem = selElems[0];
      if (elem && elem.getAttribute('shape') === name) {
        return elem;
      } else {
        return null;
      }
    }

    const buttons = [{
      id: 'tool_' + name,
      type: 'mode',
      position: 12,
      //key: '',
      events: {
        click () {
          svgCanvas.setMode(name);
          svgEditor.toolButtonClick('#tool_' + name);
        }
      }
    }];
    return {
      name: strings.name,
      svgicons: svgEditor.curConfig.extIconsPath + 'soccer-icons.xml',
      buttons: strings.buttons.map((button, i) => {
        return Object.assign(buttons[i], button);
      }),
      callback () {
      },
      mouseDown (opts) {
        if (svgCanvas.getMode() !== this.name) {
          return undefined;
        }
        const zoom = svgCanvas.getZoom();
        // console.log("Zoom is "+ zoom);

        // //these are relative to the canvas
        // console.log("start at "+opts.start_x+","+opts.start_y);
        const startX = opts.start_x * zoom;
        const startY = opts.start_y * zoom;

        started = true;
        newFO = svgCanvas.addSVGElementFromJson(
          {
            element: "g",
            attr: {
              id: svgCanvas.getNextId(),
              shape: this.name
            },
            children: [
              { element: "rect",
                attr: {
                  id: svgCanvas.getNextId(),
                  d: "m6.621088,11.912862l-1.0324,-3.1772l-2.5276,-0.636l-1.8964,1.5844c0.0038,0.0448 0.0024,0.0896 0.0068,0.1342c0.16,1.561 0.784,3.0272 1.8038,4.239c0.033,0.0392 0.0692,0.0752 0.1028,0.1138l2.0856,-0.0806l1.4574,-2.1776l0,0.00001l0,-0.00001z",
                  fill: "none",
                  height: 18.83525,
                  width: 99.96114,
                  x: 0.125,
                  y: 0.375,
                  'marker-end': 'none',
                  'stroke-miterlimit': 10,
                  'stroke-width': 2,
                  stroke: "#000"
                },
                children: []},
                { element: "polyline",
                attr: {
                  id: svgCanvas.getNextId(),
                  points: "69.33166261011502,19.210252175425012 69.33166261011502,11.675124991583289 61.64607400394743,7.925537563811304 53.94836522099649,11.675124991583289 53.94836522099649,19.210252175425012",
                  fill: "none",
                  'fill-rule': "evenodd",
                  'marker-end': 'none',
                  'stroke-miterlimit': 10,
                  'stroke-width': 2,
                  stroke: "#000"
                },
                children: []},
              { element: "polyline",
                attr: {
                  id: svgCanvas.getNextId(),
                  points: "46.26277661482891,0.375 46.26277661482891,7.904992186600111 53.94836522099649,11.675124991583289 61.64607400394743,7.904992186600111 61.64607400394743,0.375",
                  fill: "none",
                  'fill-rule': "evenodd",
                  'marker-end': 'none',
                  'stroke-miterlimit': 10,
                  'stroke-width': 2,
                  stroke: "#000"
                },
                children: []},
                { element: "polyline",
                attr: {
                  id: svgCanvas.getNextId(),
                  points: "84.71495537497685,19.210252175425012 84.71495537497685,11.675124991583289 77.02209743729327,7.925537563811304 69.33166261011502,11.675124991583289",
                  fill: "none",
                  'fill-rule': "evenodd",
                  'marker-end': 'none',
                  'stroke-miterlimit': 10,
                  'stroke-width': 2,
                  stroke: "#000"
                },
                children: []},
              { element: "line",
                attr: {
                  id: svgCanvas.getNextId(),
                  x1: 77.01725,
                  y1: 7.90499,
                  x2: 77.01725,
                  y2: 0.375,
                  points: "",
                  'marker-end': 'none',
                  'stroke-miterlimit': 10,
                  'stroke-width': 2,
                  stroke: "#000"
                },
                children: []},
              { element: "polyline",
                attr: {
                  id: svgCanvas.getNextId(),
                  points: "100.08613258731202,11.675124991583289 92.40055322965782,7.925537563811304 84.71495537497685,11.675124991583289",
                  fill: "none",
                  'fill-rule': "evenodd",
                  'marker-end': 'none',
                  'stroke-miterlimit': 10,
                  'stroke-width': 2,
                  stroke: "#000"
                },
                children: []},
              { element: "line",
                attr: {
                  id: svgCanvas.getNextId(),
                  x1: 92.39934,
                  y1: 7.90499,
                  x2: 92.39934,
                  y2: 0.375,
                  points: "",
                  'marker-end': 'none',
                  'stroke-miterlimit': 10,
                  'stroke-width': 2,
                  stroke: "#000"
                },
                children: []},
              { element: "polyline",
                attr: {
                  id: svgCanvas.getNextId(),
                  points: "53.94836522099649,19.210252175425012 53.94836522099649,11.675124991583289 46.26277661482891,7.925537563811304 38.56506320762128,11.675124991583289 38.56506320762128,19.210252175425012",
                  fill: "none",
                  'fill-rule': "evenodd",
                  'marker-end': 'none',
                  'stroke-miterlimit': 10,
                  'stroke-width': 2,
                  stroke: "#000"
                },
                children: []},
              { element: "polyline",
                attr: {
                  id: svgCanvas.getNextId(),
                  points: "30.87947691358204,0.375 30.87947691358204,7.904992186600111 38.56506320762128,11.675124991583289 46.26277661482891,7.904992186600111 46.26277661482891,0.375",
                  fill: "none",
                  'fill-rule': "evenodd",
                  'marker-end': 'none',
                  'stroke-miterlimit': 10,
                  'stroke-width': 2,
                  stroke: "#000"
                },
                children: []},
              { element: "polyline",
                attr: {
                  id: svgCanvas.getNextId(),
                  points: "15.50223845679102,0.375 15.50223845679102,7.904992186600111 23.193888307414454,11.675124991583289 30.87947691358204,7.904992186600111 30.87947691358204,0.375",
                  fill: "none",
                  'fill-rule': "evenodd",
                  'marker-end': 'none',
                  'stroke-miterlimit': 10,
                  'stroke-width': 2,
                  stroke: "#000"
                },
                children: []},
              { element: "polyline",
                attr: {
                  id: svgCanvas.getNextId(),
                  points: "23.193888307414454,19.210252175425012 23.193888307414454,11.675124991583289 15.50223845679102,7.925537563811304 7.810588606167585,11.675124991583289 7.810588606167585,19.210252175425012",
                  fill: "none",
                  'fill-rule': "evenodd",
                  'marker-end': 'none',
                  'stroke-miterlimit': 10,
                  'stroke-width': 2,
                  stroke: "#000"
                },
                children: []},
              { element: "polyline",
                attr: {
                  id: svgCanvas.getNextId(),
                  points: "0.125,7.904992186600111 7.810588606167585,11.675124991583289 15.50223845679102,7.904992186600111 15.50223845679102,0.375",
                  fill: "none",
                  'fill-rule': "evenodd",
                  'marker-end': 'none',
                  'stroke-miterlimit': 10,
                  'stroke-width': 2,
                  stroke: "#000"
                },
                children: []}
              ]}
        );
        svgCanvas.selectOnly([newFO]);
        svgCanvas.moveSelectedElements(startX, startY, false);

        return {
          started: true
        };
      },
      mouseMove (opts) {
        if (!started || svgCanvas.getMode() !== this.name) {
          return undefined;
        }

        return {
          started: true
        };
      },
      mouseUp (opts) {
        if (svgCanvas.getMode() !== this.name) {
          return undefined;
        }
        // const attrs = $(newFO).attr('edge');
        // const keep = (attrs.edge !== '0');
        // // svgCanvas.addToSelection([newFO], true);
        return {
          keep: true,
          element: newFO
        };
      // },
      // selectedChanged (opts) {
      //   // Use this to update the current selected elements
      //   const elem = singleSelectedObject(opts);
      //   if (elem != null) {
      //     showPanel(true);
      //     if ((typeof(elem.lastChild.firstChild) != 'undefined') && (elem.lastChild.firstChild != null)) {
      //       console.log(elem.lastChild.firstChild.textContent);
      //       $('#' + name + '_pos').val(elem.lastChild.firstChild.textContent);
      //     }
      //   } else {
      //     showPanel(false);
      //   }
      // },
      // elementChanged (opts) {
      //   console.log('elementChanged');
      //   const elem = singleSelectedObject(opts);
      //   if (elem != null) {
      //     showPanel(true);
      //     elem.lastChild.innerHTML = $('#' + name + '_pos').val()
      //   } else {
      //     showPanel(false);
      //   }
      }
    };
  }
};
