export default {
  name: 'redcircle',
  async init (S) {
    const name = 'redcircle';
    const svgEditor = this;
    const svgCanvas = svgEditor.canvas;
    const {$, importLocale} = S, // {svgcontent}
      // addElem = svgCanvas.addSVGElementFromJson,
      editingitex = false;
    const strings = await importLocale();
    let selElems,
      started, newFO;

    function showPanel (on) {
      console.log('showPanel ' + on);
      $('#redcircle_panel').toggle(on);
    }

    /**
    * @param {string} attr
    * @param {string|Float} val
    * @returns {undefined}
    */
    function setAttr (attr, val) {
      svgCanvas.changeSelectedAttribute(attr, val);
      svgCanvas.call('changed', selElems);
    }

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
      key: 'O',
      events: {
        click () {
          svgCanvas.setMode(name);
          svgEditor.toolButtonClick('#tool_' + name);
          showPanel(true);
        }
      }
    }];
    const contextTools = [{
      type: 'input',
      panel: name + '_panel',
      id: name + '_pos',
      size: 2,
      defval: '',
      events: {
        change () {
          console.log("position number changed to " + this.value);
          setAttr('position', this.value);
        }
      }
    }];
    return {
      name: strings.name,
      svgicons: svgEditor.curConfig.extIconsPath + name + '-icons.xml',
      buttons: strings.buttons.map((button, i) => {
        return Object.assign(buttons[i], button);
      }),
      context_tools: strings.contextTools.map((contextTool, i) => {
        return Object.assign(contextTools[i], contextTool);
      }),
      callback () {
        $('#' + name + '_panel').hide();

        // const endChanges = function () {
        //   // Todo: Missing?
        // };

        // // TODO: Needs to be done after orig icon loads
        // setTimeout(function () {
        //   console.log("when is this called");
        //   // debugger;
        //   // Create source save/cancel buttons
        //   /* const save = */ $('#tool_source_save').clone().hide().attr('id', 'polygon_save').unbind().appendTo('#tool_source_back').click(function () {
        //     if (!editingitex) {
        //       return;
        //     }
        //     // Todo: Uncomment the setItexString() function above and handle ajaxEndpoint?
        //     /*
        //     if (!setItexString($('#svg_source_textarea').val())) {
        //       const ok = await $.confirm('Errors found. Revert to original?', function (ok) {
        //       if (!ok) {
        //         return false;
        //       }
        //       endChanges();
        //     } else { */
        //     endChanges();
        //     // }
        //     // setSelectMode();
        //   });

        //   /* const cancel = */ $('#tool_source_cancel').clone().hide().attr('id', 'polygon_cancel').unbind().appendTo('#tool_source_back').click(function () {
        //     endChanges();
        //   });
        // }, 3000);
      },
      mouseDown (opts) {
        if (svgCanvas.getMode() !== this.name) {
          return undefined;
        }
        // // const e = opts.event;
        // const rgb = svgCanvas.getColor('fill');
        // // const ccRgbEl = rgb.substring(1, rgb.length);
        // const sRgb = svgCanvas.getColor('stroke');
        // // ccSRgbEl = sRgb.substring(1, rgb.length);
        // const sWidth = svgCanvas.getStrokeWidth();
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
              { element:"circle",
                attr: {
                  id: svgCanvas.getNextId(),
                  cx: 15,
                  cy: 15,
                  r: 15,
                  fill: "#eb244c",
                  'marker-end': '',
                  'stroke-width': 0
                },
                children: []},
              { element:"text",
                attr: {
                  fill: "#ffffff",
                  "font-family": "serif",
                  "font-size": 24,
                  "text-anchor": "middle",
                  x: 15,
                  y: 24
                },
                children: [""]},
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
      },
      selectedChanged (opts) {
        console.log('selectedChanged');
        // Use this to update the current selected elements
        const elem = singleSelectedObject(opts);
        if (elem != null) {
          showPanel(true);
          if ((typeof(elem.lastChild.firstChild) != 'undefined') && (elem.lastChild.firstChild != null)) {
            console.log(elem.lastChild.firstChild.textContent);
            $('#' + name + '_pos').val(elem.lastChild.firstChild.textContent);
          }
        } else {
          showPanel(false);
        }
      },
      elementChanged (opts) {
        console.log('elementChanged');
        const elem = singleSelectedObject(opts);
        if (elem != null) {
          showPanel(true);
          elem.lastChild.innerHTML = $('#' + name + '_pos').val()
        } else {
          showPanel(false);
        }
      }
    };
  }
};
