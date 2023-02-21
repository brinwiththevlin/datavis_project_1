class StackedBarChart {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _y, _stack_by, filter) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 400,
      containerHeight: 200,
      margin: {top: 10, right: 10, bottom: 30, left: 30},
    }
    this.dict = {};
    _data.forEach(d =>{
      if (d[_stack_by] in this.dict){
        if (d[_y] in this.dict[d[_stack_by]]){
          this.dict[d[_stack_by]][d[_y]] += 1;
        }
        else{
          this.dict[d[_stack_by]][d[_y]] = 1;
        }
      }
      else{
        var entry = {}
        entry[d[_y]] = 1
        this.dict[d[_stack_by]] = entry;
      }
    })
    
    this.dict = (filter)(this.dict);
    this.array = Object.entries(this.dict).map(([group, obj]) => ({ group, ...obj }))
    console.log(this.dict);
    this.y = _y;
    this.stack_by = _stack_by;
    this.data = _data;
    this.initVis();
  }
  
  /**
   * Initialize scales/axes and append static chart elements
   */
  initVis() {
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleBand()
        .range([0, vis.width])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]);
    
    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale);
    vis.yAxis = d3.axisLeft(vis.yScale).ticks(6);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    // Initialize stack generator and specify the categories or layers
    // that we want to show in the chart
    vis.stack = d3.stack()
        .keys(['true', 'false']);
    vis.updateVis();
  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;

    vis.xScale.domain(Object.keys(vis.dict));
    vis.yScale.domain([0, d3.max(vis.array, d => d.true + d.false)]);

    // Call stack generator on the dataset
    vis.stackedData = vis.stack(vis.array);

    vis.renderVis();
  }

  /**
   * This function contains the D3 code for binding data to visual elements
   * Important: the chart is not interactive yet and renderVis() is intended
   * to be called only once; otherwise new paths would be added on top
   */
  renderVis() {
    let vis = this;

    vis.chart.selectAll('category')
        .data(vis.stackedData)
      .join('g')
        .attr('class', d => `category cat-${d.key}`)
      .selectAll('rect')
        .data(d => d)
      .join('rect')
        .attr('x', d => vis.xScale(d.data[this.stack_by]))
        .attr('y', d => vis.yScale(d[1]))
        .attr('height', d => vis.yScale(d[0]) - vis.yScale(d[1]))
        .attr('width', vis.xScale.bandwidth());

    // Update the axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}