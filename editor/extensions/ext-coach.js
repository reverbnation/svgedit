//Steps to make a new single shape tool called "myshape"
//duplicate this file and rename to ext-myshape.js
//rename all coach to myshape
//optional pick a unique hotkey, button.key
//update the shape for call to addSVGElementFromJson
//copy the extension/ext-locale/coach folder and contents to extension/ext-locale/myshape, edit language files
//add the svg for you button icon to soccer-icons.xml with the id tool_myshape
//load the extension in svg-editor.js
//test to determine correct position, update button.position as needed
export default {
  name: 'coach',
  async init (S) {
    const name = 'coach';
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
      position: 10,
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
            element: "path",
            attr: {
              id: svgCanvas.getNextId(),
              shape: this.name,
              d: "m6.24273,5.13443c0,-2.42234 1.9621,-4.38443 4.38443,-4.38443c2.42234,0 4.38443,1.9621 4.38443,4.38443c0,2.42234 -1.96209,4.38443 -4.38443,4.38443c-2.42234,0 -4.38443,-1.9621 -4.38443,-4.38443zm14.74121,12.41075l0,-2.21426c0,-2.32973 -1.88756,-4.21864 -4.21864,-4.21864l-12.28985,0c-2.32973,0 -4.21864,1.88892 -4.21864,4.21864l0,2.21426c-0.00408,0.05026 -0.0068,0.10189 -0.0068,0.15418l0,12.75376c0,0.99098 0.80285,1.79382 1.79383,1.79382c0.98962,0 1.79451,-0.80284 1.79451,-1.79382l0,-12.56493l1.2029,0l0,14.36012l0.00883,0l0,20.2904c0,1.31904 1.07114,2.39086 2.39154,2.39086c1.32109,0 2.39154,-1.07045 2.39154,-2.39086l0,-20.2904l1.57784,0l0,20.2904c0,1.31904 1.0718,2.39086 2.39154,2.39086c1.32108,0 2.39154,-1.07045 2.39154,-2.39086l0,-20.2904l0.00747,0l0,-14.36012l1.2029,0l0,12.56425c0,0.99098 0.80487,1.79451 1.79451,1.79451c0.99099,0 1.79383,-0.80351 1.79383,-1.79451l0,-12.75375c-0.00067,-0.05298 -0.00475,-0.10325 -0.00883,-0.1535z",
              fill: "#eee",
              'marker-end': 'none',
              'stroke': "#000",
              'stroke-width': 2
            },
            children: []}
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
