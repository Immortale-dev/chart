import Chart from "../chart/Chart.js";
import TeleAxis from "./lib/TeleAxis.js";
import AnimCap from "../animcap/AnimCap.js";
import Scroller from "./lib/Scroller.js";

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
        bounds: {minX: this.xFrames.min, maxX: this.xFrames.max, minY: this.yFrames.min, maxY: this.yFrames.max},
        color: options.color,
        tickness: 1
    }, data);
    
    this._topCharts.push(topChart);
    this._bottomCharts.push(bottomChart);
    
    chart.add(topChart);
    chart.add(bottomChart);
}

proto.setXFrames = function(xFrames){
    ///@TODO
    if(!xFrames)
        return;
    this.xFrames = xFrames || this.xFrames;
}

proto.setYFrames = function(yFrames){
    ///@TODO
    if(!yFrames)
        return;
    this.yFrames = yFrames || this.yFrames;
}

proto.view = function(min, max){
    if(min === void(0))
        min = this.xFrames.min;
    if(max === void(0))
        max = this.xFrames.max;
    
    min = Math.min(Math.max(min, this.xFrames.min), this.xFrames.max);
    max = Math.min(Math.max(max, this.xFrames.min), this.xFrames.max);
    
    this._setView({min,max});
    this._render();
}

proto.viewCoof = function(min, max){
    if(min === void(0))
        min = 0;
    if(max == void(0))
        max = 1;
    
    min = this.xFrames.min + (this.xFrames.max-this.xFrames.min)*min;
    max = this.xFrames.min + (this.xFrames.max-this.xFrames.min)*max;
    
    this.view(min,max);
}

proto._setView = function(obj){
    this._updateViewValues(obj);
    this._calcBounds();
    this._updateBounds();
    this._updateScroller();
}

proto._updateViewValues = function(obj){
    if(!obj){
        this._view.min = this.xFrames.min;
        this._view.max = this.xFrames.max;
    }
    else{
        this._view.min = obj.min;
        this._view.max = obj.max;
    }
}

proto._updateScroller = function(){
    let min = (this._view.min-this.xFrames.min)/(this.xFrames.max-this.xFrames.min);
    let max = (this._view.max-this.xFrames.min)/(this.xFrames.max-this.xFrames.min);
    this._scroller.inner.style.left = min*100+'%';
    this._scroller.inner.style.width = (max-min)*100+'%';
    this._scroller.left.style.width = min*100+'%';
    this._scroller.right.style.width = (1-max)*100+'%';
}

proto.setOptions = function(options){
    this.el = options.el;
    
    this.setXFrames(options.xFrames);
    this.setYFrames(options.yFrames);
    
    this._updateViewValues(options.view);
    
    this._calcBounds();
    ///@TODO
}

proto._render = function(){
    this._chart.render();
}

proto._updateAxisValues = function(){
    
}

proto._updateBounds = function(){
    let bounds = this._generateBounds();
    //this._xAxis.setBounds({min: bounds.minX, max: bounds.maxX});
    //this._yAxis.setBounds({min: bounds.minY, max: bounds.maxY});
    
    //let xAxisCount = this._calcXAxisCount();
    //let yAxisCount = this._calcYAxisCount();
    
    this._xAxis.view(bounds.minX, bounds.maxX);
    
    if(this._yBounds.min != this._yBoundsState.min || this._yBounds.max != this._yBoundsState.max){
        
        this._yBoundsState.min = this._yBounds.min;
        this._yBoundsState.max = this._yBounds.max;
        
        let aMin = {f: this._yAxis.bounds.min, t:this._yBounds.min};
        let aMax = {f: this._yAxis.bounds.max, t:this._yBounds.max};
        
        let AC = this.AC;
        AC.animate('yBounds',{time: 300})((coof, done)=>{
            let anMin = aMin.f+(aMin.t-aMin.f)*coof;
            let anMax = aMax.f+(aMax.t-aMax.f)*coof;
            this._yAxis.view(anMin, anMax);
            this._grid.setBounds({minX: (bounds.minX-this.xFrames.min)/(this.xFrames.max-this.xFrames.min), maxX: (bounds.maxX-this.xFrames.min)/(this.xFrames.max-this.xFrames.min), minY: (anMin-this.yFrames.min)/(this.yFrames.max-this.yFrames.min), maxY: (anMax-this.yFrames.min)/(this.yFrames.max-this.yFrames.min)});
            this._grid.setValues({yCount: this._yAxis._state.newCount });
            
            for(let it of this._topCharts){
                it.setBounds({
                    minX: bounds.minX,
                    maxX: bounds.maxX,
                    minY: anMin,
                    maxY: anMax
                });
            }
            this._render();
        });
        return;
    }

    
    for(let it of this._topCharts){
        it.setBounds(bounds);
    }
    //this._xAxis.setValues({from:this.xFrames.min, to:this.xFrames.max, count: xAxisCount});
    //this._yAxis.setValues({from:this.yFrames.min, to:this.yFrames.max, count: yAxisCount});

    
}

proto._calcBounds = function(){
    let xmins = [];
    let xmaxs = [];
    let ymins = [];
    let ymaxs = [];

    for(let it of this._topCharts){
        //let xArr = it.getData().map(a=>a.x);
        let yArr = it.getData().filter(a=>a.x>=this._view.min&&a.x<=this._view.max).map(a=>a.y);
        //xmins.push(xArr.reduce((a,b)=>Math.min(a,b)));
        //xmaxs.push(xArr.reduce((a,b)=>Math.max(a,b)));
        if(yArr.length){
            ymins.push(yArr.reduce((a,b)=>Math.min(a,b)));
            ymaxs.push(yArr.reduce((a,b)=>Math.max(a,b)));
        }
    }
    this._xBounds.min = this._view.min;
    this._xBounds.max = this._view.max;
    if(!this._topCharts.length){
        this._yBounds.min = this.yFrames.min;
        this._yBounds.max = this.yFrames.max;
        return;
    }
    
    //this._xBounds.min = //Math.max(this.xFrames.min, Math.floor( xmins.reduce((a,b)=>Math.min(a,b))/this.xPrecision )*this.xPrecision);
    //this._xBounds.max = //Math.min(this.xFrames.max, Math.ceil( xmaxs.reduce((a,b)=>Math.max(a,b))/this.xPrecision )*this.xPrecision);
    if(!ymins.length){
        this._yBounds.min = this.yFrames.min;
        this._yBounds.max = this.yFrames.max;
        return;
    }
    this._yBounds.min = Math.max(this.yFrames.min, Math.floor( ymins.reduce((a,b)=>Math.min(a,b))/this.yPrecision )*this.yPrecision);
    this._yBounds.max = Math.min(this.yFrames.max, Math.ceil( ymaxs.reduce((a,b)=>Math.max(a,b))/this.yPrecision )*this.yPrecision);
    if(this._yBounds.max - this._yBounds.min < this.yMinHeight){
        
        let h = this.yMinHeight - (this._yBounds.max - this._yBounds.min);
        
        //this._yBounds.min = Math.floor((this._yBounds.min - h/2)/this.yPrecision)*this.yPrecision;
        this._yBounds.max = Math.ceil((this._yBounds.min + h)/this.yPrecision)*this.yPrecision;
    }
}

proto._generateBounds = function(){
    return {
        minX: this._xBounds.min,
        maxX: this._xBounds.max,
        minY: this._yBounds.min,
        maxY: this._yBounds.max,
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
            count: this._yAxis._state.newCount
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
    let xAxis = new TeleAxis({
        direction: 'x',
        width: width,
        top: height,
        height: axisThickness,
        frames: this.xFrames,
        bounds: {
            min: this._xBounds.min,
            max: this._xBounds.max,
        },
        text:{
            color: this.axisFontColor,
            size: this.axisFontSize,
            family: this.fontFamily,
            baseline: this.xAxisBaseline,
            align: this.xAxisAlign,
            offsetX: this.xAxisOffset.x,
            offsetY: this.xAxisOffset.y,
        },
        precision: 50,
        distance: 60,
        ondata: (a)=>{
            let d = new Date(a.x);
            a.text = this.monthes[d.getMonth()]+' '+d.getDate();
            return a;
        }
    });
    xAxis.onforce(()=>{
        this._chart.render();
    })
    this._xAxis = xAxis;
    this._chart.add(xAxis);
}

proto._createYAxis = function(){
    let mapHeight = this.mapHeight;
    let width = this.width;
    let height = this.height;
    let axisThickness = this.axisThickness;
    let yAxis = new TeleAxis({
        direction: 'y',
        width: axisThickness*3,
        height: height,
        frames: this.yFrames,
        bounds: {
            min: this._yBounds.min,
            max: this._yBounds.max,
        },
        text:{
            color: this.axisFontColor,
            size: this.axisFontSize,
            family: this.fontFamily,
            baseline: this.yAxisBaseline,
            align: this.yAxisAlign,
            offsetX: this.yAxisOffset.x,
            offsetY: this.yAxisOffset.y,
            opacity: 1
        },
        precision: 10,
        distance: 40,
        ondata: (a)=>{
            a.text = Math.round(a.y);
            return a;
        }
    });
    yAxis.onforce(()=>{
        this._chart.render();
    })
    this._yBoundsState = {min: this._yBounds.min, max: this._yBounds.max};
    this._yAxis = yAxis;
    this._chart.add(yAxis);
}

proto._createBlock = function(){
    let div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = this.width+'px';
    this._block = div;
}


proto._createScroller = function(){
 
    this._scroller = new Scroller({
        top: this.height+this.axisThickness,
        height: this.mapHeight,
        fadeColor: this.mapFadeColor,
        borderColor: this.mapBorderColor
    });
    
    this._block.appendChild(this._scroller.outer);
    
    this._scroller.onmove((obj)=>{
        this.viewCoof(obj.min,obj.max);
    });
}

proto._init = function(options){
    this._defaults();
    this.setOptions(options);
    
    this._createBlock();
    
    this._createChart();
    
    this._chart.appendCanvas(this._block);
    this.el.appendChild(this._block);
    
    this._createXAxis();
    this._createYAxis(); 
    this._createPlate();
    
    this._createScroller();
    
    this.AC = new AnimCap();
}

proto._defaults = function(){
    this._topCharts = [];
    this._bottomCharts = [];
    this.width = 800;
    this.height = 400;
    this.mapHeight = 50;
    this.axisThickness = 30;
    this.xAxisDistance = 60;
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
    this.xAxisOffset = {x: 5, y: 5};
    this.yAxisOffset = {x: 0, y: -5};
    this.xAxisBaseline = 'top';
    this.xAxisAlign = 'left';
    this.yAxisBaseline = 'bottom';
    this.yAxisAlign = 'left';
    this.yPrecision = 10;
    this.xPrecision = 50;
    this.fontFamily = '"Open Sans"';
    this.xFrames = {min: 0, max: 100};
    this.yFrames = {min: 0, max: 100};
    this._xBounds = {min: 0, max: 100};
    this._yBounds = {min: 0, max: 100};
    this._view = {min: 0, max: 100};
    this.monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    this._xAxisCount = 1;
    this._yAxisCount = 1;
    this._xAxisState = {};
    this._yAxisState = {};
    this.yMinHeight = 50;
    this._yBoundsState = {};
    ///@TODO
}


export default Telechart;