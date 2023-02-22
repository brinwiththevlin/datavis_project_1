console.log("Hello world");
// const parseTime = d3.timeParse("%Y-%m-%d");

d3.csv('.\\data\\exoplanets-1.csv')
  .then(data => {
  	console.log('Data loading complete. Work with dataset.');

    const hab_range = 
    {
      "A": {"inner": 8.5, "outer":21.5},
      "F": {"inner": 1.5, "outer": 2.2},
      "K": {"inner": 0.95, "outer": 1.4},
      "G": {"inner": 0.38, "outer":0.56},
      "M": {"inner": 0.08, "outer": .12}
    }

    function habitable(star_type, dist){
      return ( hab_range.hasOwnProperty(star_type) ) ? dist > hab_range[star_type]['inner'] && dist < hab_range[star_type]["outer"] : undefined;
    }

    //process the data - this is a forEach function.  You could also do a regular for loop.... 
    data.forEach(d => { //ARROW function - for each object in the array, pass it as a parameter to this function
      d.disc_year = +d.disc_year;
      d.pl_bmasse = +d.pl_bmasse;
      d.pl_orbeccen = +d.pl_orbeccen;
      d.pl_orbsmax = +d.pl_orbsmax;
      d.pl_rade = +d.pl_rade;
      d.st_mass = +d.st_mass;
      d.st_rad = +d.st_rad;
      d.sy_dist = +d.sy_dist;
      d.sy_pnum = +d.sy_pnum;
      d.sy_snum = +d.sy_snum;
      d.st_spectype_code = d.st_spectype[0];
      d.habitable = habitable(d.st_spectype_code, d.pl_orbsmax);

    });


    //lets plot

    planet_bar = new Barchart({ parentElement: '#chart1'}, data, "sy_pnum");
    planet_bar.updateVis();
    star_bar = new Barchart({ parentElement: '#chart2'}, data, "sy_snum");
    star_bar.updateVis();
    spec_bar = new Barchart({ parentElement: '#chart3'}, data, "st_spectype_code", (({ A,F,K,G,M, unknown}) => ({ A,F,K,G,M, unknown })));
    spec_bar.updateVis();
    disc_method_bar = new Barchart({ parentElement: '#chart4', containerWidth: 800}, data, "discoverymethod", filter=undefined, rotation=10);
    disc_method_bar.updateVis();
    hab_bar = new groupedBarChart({ parentElement: "#chart5"}, data, 'spectral type', 'count');
    hab_bar.updateVis();
    disc_year_line = new LineChart({ parentElement: "#chart6"}, data, 'disc_year')
    disc_year_line.updateVis();
    radius_scatter = new Scatterplot({ parentElement: "#chart7"}, data)
    radius_scatter.updateVis();
    dist_hist = new Histogram({ parentElement: '#chart8'}, data)
    dist_hist.updateVis();
    // hab_bar = new StackedBarChart({ parentElement: '#chart5'}, data, 'habitable', 'st_spectype_code', (({ A,F,K,G,M}) => ({ A,F,K,G,M})))
    // hab_bar.updateVis();

    console.log(data)
})
.catch(error => {
    // console.error('Error loading the data');
    console.log(error);
});



d3.select('#sorting1').on('click', d => {
  planet_bar.config.reverseOrder = true;
  planet_bar.updateVis();
}) 
d3.select('#sorting2').on('click', d => {
  star_bar.config.reverseOrder = true;
  star_bar.updateVis();
}) 
d3.select('#sorting3').on('click', d => {
  spec_bar.config.reverseOrder = true;
  spec_bar.updateVis();
})

