import Chart from "../chart/Chart.js";

function Telechart(options = {}){
    
    this._init(options);
}
var proto = Telechart.prototype;




proto.addChart = function(options, data){
    
    let mapHeight = this.mapHeight;
    let width = this.width;
    let height = this.height;
    let axisThickness = this.axisThickness;
    let font = this.font;
    
    let chart = this._chart;
    
    let bounds = this._generateBounds();
    
    let topChart = new Chart.Viewer(Chart.D.LineDrawer, {
        width: width,
        height: height,
        bounds,
        color: options.color,
        tickness: options.tickness
    }, data);
    
    let bottomChart = new Chart.Viewer(Chart.D.LineDrawer, {
        width: width,
        height: mapHeight,
        top: height + axisThickness,
        bounds,
        color: options.color,
        tickness: 1
    }, data);
    
    this._topCharts.push(topChart);
    this._bottomCharts.push(bottomChart);
    
    chart.add(topChart);
    chart.add(bottomChart);
    
    chart.render();
    
}

proto.setOptions = function(options){
    this.el = options.el;
    this.xBounds = options.xBounds || this.xBounds;
    this.yBounds = options.yBounds || this.yBounds;
    ///@TODO
}

proto._calcXAxisCount = function(){
    return 10;
}

proto._calcYAxisCount = function(){
    return 8;
}

proto._generateBounds = function(){
    return {
        minX: this.xBounds.min,
        maxX: this.xBounds.max,
        minY: this.yBounds.min,
        maxY: this.yBounds.max,
    }
}

proto._createChart = function(){
    let mapHeight = this.mapHeight;
    let width = this.width;
    let height = this.height;
    let axisThickness = this.axisThickness;
    
    let chart = new Chart({
        el: this.el,
        width: width,
        height: height+mapHeight+axisThickness
    });
    this._chart = chart;
}

proto._createPlate = function(){
    let width = this.width;
    let height = this.height;
    
    let plate = new Chart.V.Plate({
        width: width,
        height: height,
        tickness: this.gridTickness,
        color: this.gridColor,
        y:{
            count: this._calcYAxisCount()
        }
    });
    
    this._grid = plate;
    this._chart.add(plate);
}

proto._createXAxis = function(){
    let mapHeight = this.mapHeight;
    let width = this.width;
    let height = this.height;
    let axisThickness = this.axisThickness;
    
    let xAxis = new Chart.V.Axis({
        direction: 'x',
        width: width,
        top: height,
        height: axisThickness,
        bounds: {
            min: this.xBounds.min,
            max: this.xBounds.max,
        },
        text:{
            color: this.axisFontColor,
            size: this.axisFontSize,
            family: this.fontFamily,
            baseline: this.xAxisBaseline,
            align: this.xAxisAlign,
            offsetX: this.xAxisOffset.x,
            offsetY: this.xAxisOffset.y,
        }
    });
    xAxis.ondata((a)=>{
        let d = new Date(a.x);
        a.text = this.monthes[d.getMonth()]+' '+d.getDate();
        return a;
    });
    xAxis.setValues({
        from: this.xAxisFrames.min,
        to: this.xAxisFrames.max,
        count: this._calcXAxisCount(),
    });
    
    this._xAxis = xAxis;
    this._chart.add(xAxis);
}

proto._createYAxis = function(){
    
    let mapHeight = this.mapHeight;
    let width = this.width;
    let height = this.height;
    let axisThickness = this.axisThickness;
    
    let yAxis = new Chart.V.Axis({
        width: axisThickness*3,
        height: height,
        direction: 'y',
        bounds: {
            min: this.yBounds.min,
            max: this.yBounds.max,
        },
        text:{
            color: this.axisFontColor,
            size: this.axisFontSize,
            family: this.fontFamily,
            baseline: this.yAxisBaseline,
            align: this.yAxisAlign,
            offsetX: this.yAxisOffset.x,
            offsetY: this.yAxisOffset.y,
        }
    });
    yAxis.ondata((a)=>{
        a.text = Math.round(a.y);
        return a;
    });
    yAxis.setValues({
        from: this.yAxisFrames.min,
        to: this.yAxisFrames.max,
        count: this._calcYAxisCount(),
    });
    
    this._yAxis = yAxis;
    this._chart.add(yAxis);
}

proto._init = function(options){
    
    this._defaults();
    this.setOptions(options);
    
    this._createChart();
    
    this._createPlate();
    this._createXAxis();
    this._createYAxis();

    this._chart.render();    
}

proto._defaults = function(){
    this._topCharts = [];
    this._bottomCharts = [];
    this.width = 800;
    this.height = 400;
    this.mapHeight = 50;
    this.axisThickness = 30;
    this.xAxisDistance = 50;
    this.yAxisDistance = 40;
    this.timingFunction = function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t }; //EasyInOutQuad
    this.animationTime = 500;
    this.axisFontColor = '#96a2aa';
    this.gridColor = '#ecf0f3';
    this.mapFadeColor = 'rgba(240, 249, 253, 0.8)';
    this.mapBorderColor = 'rgba(148, 203, 241, 0.25)';
    this.lineTickness = 2;
    this.gridTickness = 1;
    this.mapLineTickness = 1;
    this.axisFontSize = 11;
    this.el;
    this.xBounds = {min: 0, max: 100};
    this.yBounds = {min: 0, max: 100};
    this.xAxisOffset = {x: 5, y: 5};
    this.yAxisOffset = {x: 0, y: -5};
    this.xAxisBaseline = 'top';
    this.xAxisAlign = 'left';
    this.yAxisBaseline = 'bottom';
    this.yAxisAlign = 'left';
    this.fontFamily = '"Open Sans"';
    this.xAxisFrames = {min: 0, max: 100};
    this.yAxisFrames = {min: 0, max: 100};
    this.timeFrames = {min: 0, max: 100};
    this.valueFrames = {min: 0, max: 100};
    this.monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    ///@TODO
}


export default Telechart;