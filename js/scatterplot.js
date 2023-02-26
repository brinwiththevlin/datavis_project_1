class Scatterplot {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 45},
      tooltipPadding: _config.tooltipPadding || 15
    }
    this.data = data;
    this.initVis();
  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Initialize scales
    // vis.colorScale = d3.scaleOrdinal()
    //     .range(['#d3eecd', '#7bc77e', '#2a8d46']) // light green to dark green
    //     .domain(['Easy','Intermediate','Difficult']);

    vis.xScale = d3.scaleLog()
        .range([0, vis.width]);

    vis.yScale = d3.scaleLog()
        .range([vis.height, 0]);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(6)
        .tickSize(-vis.height - 10)
        .tickPadding(10)
        // .tickFormat(d => d + ' km');

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSize(-vis.width - 10)
        // .tickFormat(d3.formatPrefix('.1s', 1e3))
        .tickPadding(10);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart 
    // and position it according to the given margin config
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    // Append both axis titles
    vis.chart.append('text')
        .attr('class', 'axis-title')
        .attr('y', vis.height - 15)
        .attr('x', vis.width + 10)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('radius');

    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '.71em')
        .text('mass');
  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;
    vis.data = vis.data.filter(d => {return d.pl_rade !== 0 && d.pl_bmasse !== 0});
    // Specificy accessor functions
    // vis.colorValue = d => d.difficulty;
    vis.xValue = d => d.pl_rade;
    vis.yValue = d => d.pl_bmasse;

    // Set the scale input domains
    vis.xScale.domain([1e-1, d3.max(vis.data, vis.xValue)]);
    vis.yScale.domain([1e-2, d3.max(vis.data, vis.yValue)]);

    vis.renderVis();
  }

  /**
   * Bind data to visual elements.
   */
  renderVis() {
    let vis = this;

    // Add circles
    const circles = vis.chart.selectAll('.point')
        .data(vis.data, d => d.trail)
      .join('circle')
        .attr('class', 'point')
        .attr('r', 4)
        .attr('cy', d => vis.yScale(vis.yValue(d)))
        .attr('cx', d => vis.xScale(vis.xValue(d)))
        // .attr('fill', d => vis.colorScale(vis.colorValue(d)));

    // Tooltip event listeners
    circles
        .on('mouseenter', () => {
          d3.select("#tooltip").style('display', 'block');
          d3.select("#tooltip").style('opacity', 1)
        })
        .on('mouseover', (event,d) => {
          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(`
              <div class="tooltip-title">${d.pl_name}</div>
              <div><i>${d.sys_name}</i></div>
              <ul>
                <li>${d.pl_rade} earth radius</li>
                <li>${d.pl_bmasse} (Earth mass)</li>
              </ul>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
          d3.select('#tooltip').style('opacity', 0);
        });
    
    // Update the axes/gridlines
    // We use the second .call() to remove the axis and just show gridlines
    vis.xAxisG
        .call(vis.xAxis)
        .call(g => g.select('.domain').remove());

    vis.yAxisG
        .call(vis.yAxis)
        .call(g => g.select('.domain').remove())
  }
}