class Table {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, _x, filter = undefined, rotation = 0) {
      // Configuration object with defaults
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 310,
        containerHeight: _config.containerHeight || 200,
        margin: _config.margin || {top: 10, right: 5, bottom: 25, left: 40},
        reverseOrder: _config.reverseOrder || false,
        tooltipPadding: _config.tooltipPadding || 15
      }
      this.data = _data;

      this.initVis();
    }
    
    /**
     * Initialize scales/axes and append static elements, such as axis titles
     */
    initVis() {
      let vis = this;
  
      // Calculate inner chart size. Margin specifies the space around the actual chart.
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

      vis.table = new Tabulator(this.config.parentElement, {
        autoResize: false,
        height:500,
        width: 500,
        layout:"fitColumns",
        data: vis.data,
        columns:[
            {title:"Exoplanet", field:"pl_name", width:200},
            {title:"Mass", field:"pl_bmasse", width: 200},
            {title:"Radius", field:"pl_rade", width: 200},
            {title:"distance", field:"sy_dist", width: 200}
        ],


    });
  

    }
  
    /**
     * Prepare data and scales before we render it
     */
    updateVis() {
        let vis = this;
      //TODO: stuff?
  
      vis.renderVis();
    }
  
    /**
     * Bind data to visual elements
     */
    renderVis() {
      let vis = this;
      //TODO: stuff?
      
    }
  }
  
  