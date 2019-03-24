import Chart from "../chart/Chart.js";
import TeleAxis from "./lib/TeleAxis.js";
import AnimCap from "../animcap/AnimCap.js";
import RenderQueue from "../renderqueue/RenderQueue.js";
import Scroller from "./lib/Scroller.js";
import Checkboxes from "./lib/Checkboxes.js";

function Telechart(options = {}){
    
    this._init(options);
}
var proto = Telechart.prototype;



/**
 *  @TODOs:
 *   remove chart => remove checkbox
 *   resize chart
 *   DOCs
 *   Optimize Render for huge data
 *   RECIEVE AN OFFER :D
 */


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
        tickness: options.tickness || this.lineTickness,
        opacity: 1
    }, data);
    
    let bottomChart = new Chart.Viewer(Chart.D.LineDrawer, {
        width: width,
        height: mapHeight,
        top: height + axisThickness,
        bounds: {minX: this.xFrames.min, maxX: this.xFrames.max, minY: this.yFrames.min, maxY: this.yFrames.max},
        color: options.color,
        tickness: 1
    }, data);
    
    this._checkboxes.add({
        title: options.title,
        color: options.color,
        checked: true
    });
    
    this._topCharts.push(topChart);
    this._bottomCharts.push(bottomChart);
    
    chart.add(topChart);
    chart.add(bottomChart);
    
    this._render();
}

proto.removeChart = function(index){
    ///@TODO;
}

proto.resize = function(options){
    ///@TODO;
}

proto.mousemove = function(fn){
    this._mousemove.push(fn);
}

proto.setXFrames = function(xFrames){
    if(!xFrames)
        return;
    this.xFrames = xFrames || this.xFrames;
}

proto.setYFrames = function(yFrames){
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

proto.setOptions = function(options){
    
    this.el = options.el;
    
    this.width = options.width || this.width;
    this.height = options.height || this.height;
    
    this.setXFrames(options.xFrames);
    this.setYFrames(options.yFrames);
    
    this._updateViewValues(options.view);
    
    this._xBounds.min = this._view.min;
    this._xBounds.max = this._view.max;
    this._yBounds.min = this.yFrames.min;
    this._yBounds.max = this.yFrames.max;
    
    this._setTextOptions(options);
    this._setMapOptions(options);
    this._setCheckboxOptions(options);
    this._setAxisChartsOptions(options);
    this._setAnimationOptions(options);
}

///@TODO recode this aweful
proto._initMousemove = function(){
    let hoverDiv = this._hoverBlock;

    hoverDiv.addEventListener('mousemove', mousemove.bind(this), false);
    hoverDiv.addEventListener('touchmove', mousemove.bind(this), false);
    hoverDiv.addEventListener('touchstart', mousemove.bind(this), false);
    hoverDiv.addEventListener('mouseleave', leave.bind(this), false);
    hoverDiv.addEventListener('touchend', leave.bind(this), false);
    

    function mousemove(e){
        let coof = _layerXCoof(e);
        for(let it of this._mousemove){
            it({coof: coof, x: this._view.min+(this._view.max-this._view.min)*coof, bounds: this._generateBounds()});
        }
    }
    function leave(e){
        let coof = _layerXCoof(e);
        for(let it of this._mousemove){
            it({coof: coof, x: this._view.min+(this._view.max-this._view.min)*coof, leave: true});
        }
    }
    
    function _layerXCoof(e){
        let cb = hoverDiv.getBoundingClientRect();
        let ex = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        let x = ex - cb.left;
        return x/cb.width;
    }
    
}

proto._setTextOptions = function(options){
    this.fontFamily = options.fontFamily || this.fontFamily;
}


proto._setAxisChartsOptions = function(options){
    this.axisThickness = options.axisThickness || this.axisThickness;
    this.xAxisDistance = options.xAxisDistance || this.xAxisDistance;
    this.yAxisDistance = options.yAxisDistance || this.yAxisDistance;
    this.axisFontColor = options.axisFontColor || this.axisFontColor;
    this.gridColor = options.gridColor || this.gridColor;
    this.lineTickness = options.lineTickness || this.lineTickness;
    this.gridTickness = options.gridTickness || this.gridTickness;
    this.axisFontSize = options.axisFontSize || this.axisFontSize;
    this.xAxisOffset = options.xAxisOffset || this.xAxisOffset;
    this.yAxisOffset = options.yAxisOffset || this.yAxisOffset;
    this.xAxisBaseline = options.xAxisBaseline || this.xAxisBaseline;
    this.xAxisAlign = options.xAxisAlign || this.xAxisAlign;
    this.yAxisBaseline = options.yAxisBaseline || this.yAxisBaseline;
    this.yAxisAlign = options.yAxisAlign || this.yAxisAlign;
    this.xPrecision = options.xPrecision || this.xPrecision;
    this.yPrecision = options.yPrecision || this.yPrecision;
}

proto._setMapOptions = function(options){
    this.mapHeight = options.mapHeight || this.mapHeight;
    this.mapFadeColor = options.mapFadeColor || this.mapFadeColor;
    this.mapBorderColor = options.mapBorderColor || this.mapBorderColor;
    this.mapLineTickness = options.mapLineTickness || this.mapLineTickness;
}

proto._setCheckboxOptions = function(options){
    this.checkboxPadding = options.checkboxPadding || this.checkboxPadding;
    this.checkboxDisplay = options.checkboxDisplay || this.checkboxDisplay;
    this.checkboxMargin = options.checkboxMargin || this.checkboxMargin;
}

proto._setAnimationOptions = function(options){
    this.animationTime = options.animationTime || this.animationTime;
    this.textAnimationTime = options.textAnimationTime || this.textAnimationTime;
}

proto._initRender = function(){
    let rq = new RenderQueue();
    rq.subscribe(()=>{
        this._chart.render();
    });
    this.RQ = rq;
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
    this._scroller.setView(min,max);
}

proto._render = function(bounds){
    ///@TODO set limit of render area;
    this.RQ.push({/*bounds*/});
}

proto._updateBounds = function(){
    let bounds = this._generateBounds();
    
    this._xAxis.view(bounds.minX, bounds.maxX);
    
    if(this._yBounds.min != this._yBoundsState.min || this._yBounds.max != this._yBoundsState.max){
        
        this._yBoundsState.min = this._yBounds.min;
        this._yBoundsState.max = this._yBounds.max;
        
        let aMin = {f: this._yAxis.bounds.min, t:this._yBounds.min};
        let aMax = {f: this._yAxis.bounds.max, t:this._yBounds.max};
        
        let AC = this.AC;
        AC.animate('yBounds',{time: this.animationTime})((coof, done)=>{
            let anMin = aMin.f+(aMin.t-aMin.f)*coof;
            let anMax = aMax.f+(aMax.t-aMax.f)*coof;
            this._yAxis.view(anMin, anMax);
            
            ///@TODO wtf with this line...
            this._grid.setBounds({minX: (bounds.minX-this.xFrames.min)/(this.xFrames.max-this.xFrames.min), maxX: (bounds.maxX-this.xFrames.min)/(this.xFrames.max-this.xFrames.min), minY: (anMin-this.yFrames.min)/(this.yFrames.max-this.yFrames.min), maxY: (anMax-this.yFrames.min)/(this.yFrames.max-this.yFrames.min)});
            
            this._grid.setValues({yCount: this._yAxis._state.newCount });
            
            this._yBoundsState.nmin = anMin;
            this._yBoundsState.nmax = anMax;
            
            for(let it of this._topCharts){
                it.setBounds({
                    minX: this._xBounds.min,
                    maxX: this._xBounds.max,
                    minY: anMin,
                    maxY: anMax
                });
            }
            this._render();
        });
        return;
    }
    
    for(let it of this._topCharts){
        it.setBounds({
            minX: this._xBounds.min,
            maxX: this._xBounds.max,
            minY: this._yBoundsState.nmin,
            maxY: this._yBoundsState.nmax
        });
    }
}

proto._calcBounds = function(){
    let xmins = [];
    let xmaxs = [];
    let ymins = [];
    let ymaxs = [];

    let cbs = this._checkboxes.get();

    let ind = 0;
    for(let it of this._topCharts){
        let cb = cbs[ind++];
        if(!cb.checked)
            continue;
        let yArr = it.getData().filter(a=>a.x>=this._view.min&&a.x<=this._view.max).map(a=>a.y);
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
    if(!ymins.length){
        this._yBounds.min = this.yFrames.min;
        this._yBounds.max = this.yFrames.max;
    }
    else{
        this._yBounds.min = Math.max(this.yFrames.min, Math.floor( ymins.reduce((a,b)=>Math.min(a,b))/this.yPrecision )*this.yPrecision);
        this._yBounds.max = Math.min(this.yFrames.max, Math.ceil( ymaxs.reduce((a,b)=>Math.max(a,b))/this.yPrecision )*this.yPrecision);
    }
    let yMinHeight = (this.yFrames.max-this.yFrames.min)*this.yMin;
    let xMinWidth = (this.xFrames.max-this.xFrames.min)*this.xMin;
    
    ///@TODO not best place to put it here
    if(this._yBounds.max - this._yBounds.min < yMinHeight){
        let h = yMinHeight - (this._yBounds.max - this._yBounds.min);
        this._yBounds.min = Math.floor((this._yBounds.min - h/2)/this.yPrecision)*this.yPrecision;
        this._yBounds.max = Math.ceil((this._yBounds.max + h/2)/this.yPrecision)*this.yPrecision;
        if(this._yBounds.min < this.yFrames.min){
            let plus = this.yFrames.min-this._yBounds.min;
            this._yBounds.min += plus;
            this._yBounds.max += plus;
        }
        if(this._yBounds.max > this.yFrames.max){
            let plus = this.yFrames.max-this._yBounds.max;
            this._yBounds.min += plus;
            this._yBounds.max += plus;
        }
    }
    
    if(this._xBounds.max - this._xBounds.min < xMinWidth){
        let h = xMinWidth - (this._xBounds.max - this._xBounds.min);
        
        this._xBounds.min = Math.floor((this._xBounds.min - h/2)/this.xPrecision)*this.xPrecision;
        this._xBounds.max = Math.ceil((this._xBounds.max + h/2)/this.xPrecision)*this.xPrecision;
        
        if(this._xBounds.min < this.xFrames.min){
            let plus = this.xFrames.min-this._xBounds.min;
            this._xBounds.min += plus;
            this._xBounds.max += plus;
        }
        if(this._xBounds.max > this.xFrames.max){
            let plus = this.xFrames.max-this._xBounds.max;
            this._xBounds.min += plus;
            this._xBounds.max += plus;
        }
    }
    this._view.min = this._xBounds.min;
    this._view.max = this._xBounds.max;
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
        distance: this.xAxisDistance,
        animationTime: this.textAnimationTime,
        ondata: (a)=>{
            let d = new Date(a.x);
            a.text = this.monthes[d.getMonth()]+' '+d.getDate();
            return a;
        }
    });
    xAxis.onforce(()=>{
        this._render();
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
        ///TODO use different options value;
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
        distance: this.yAxisDistance,
        animationTime: this.textAnimationTime,
        ondata: (a)=>{
            a.text = Math.round(a.y);
            return a;
        }
    });
    yAxis.onforce(()=>{
        this._render();
    })
    this._yBoundsState = {min: this._yBounds.min, max: this._yBounds.max};
    this._yAxis = yAxis;
    this._chart.add(yAxis);
}

proto._createBlock = function(){
    let div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = this.width+'px';

    let stDiv = document.createElement('div');
    
    let hoverDiv = document.createElement('div');
    hoverDiv.classList.add('telechart__hover');
    hoverDiv.style.height = this.height;
    hoverDiv.style.position = 'absolute';
    hoverDiv.style.width = 100+'%';
    hoverDiv.style.top = 0;
    hoverDiv.style.left = 0;
    
    div.appendChild(stDiv);
    div.appendChild(hoverDiv);
    
    this._hoverBlock = hoverDiv;
    this._stylesBlock = stDiv;
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

proto._createCheckboxes = function(){
    let cb = new Checkboxes({
        padding: this.checkboxPadding,
        color: this.axisFontColor,
        display: this.checkboxDisplay,
        margin: this.checkboxMargin,
        borderColor: this.gridColor,
    });
    this._checkboxes = cb;
    let st = cb.generateStyles();
    this._stylesBlock.appendChild(st);
    this._block.appendChild(cb.block);
    cb.onchange((cb,index)=>{
        let chrt = this._topCharts[index];
        let bchrt = this._bottomCharts[index];
        let chrtData = chrt.getData();
        let chind = +cb.checked;
        let chobj = {f:chrt.options.opacity, t:chind};
        if(chind)
            chrt.enable();
        this.AC.animate('chart_'+index,{time: this.animationTime})((coof, done)=>{
            let nop = chobj.f + (chobj.t-chobj.f)*coof;
            chrt.options.opacity = nop;
            bchrt.options.opacity = nop;
            chrt.setData(chrtData);
            if(!chind && done)
                chrt.disable();
            this._render();
        });
        this._setView({min:this._view.min, max:this._view.max});
        this._render();
    });
}

proto._init = function(options){
    this._defaults();
    this.setOptions(options);
    
    this._initRender();
    
    this._createBlock();
    
    this._createChart();
    
    this._chart.appendCanvas(this._block);
    this.el.appendChild(this._block);
    
    this._createXAxis();
    this._createYAxis(); 
    this._createPlate();
    
    this._createScroller();
    this._createCheckboxes();
    
    this._initMousemove();
    
    this.AC = new AnimCap();
}

proto._defaults = function(){
    ///@TODO I do not like such options definition, but there is not much time left...
    this.width = 800;
    this.height = 400;
    this.mapHeight = 50;
    this.axisThickness = 30;
    this.xAxisDistance = 50;
    this.yAxisDistance = 40;
    this.animationTime = 300;
    this.textAnimationTime = 500;
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
    this.yPrecision = 15;
    this.xPrecision = 50;
    this.fontFamily = '"Open Sans"';
    this.xFrames = {min: 0, max: 100};
    this.yFrames = {min: 0, max: 100};
    this.monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    this.yMin = 0.2;
    this.xMin = 0.1;
    this._topCharts = [];
    this._bottomCharts = [];
    this._xBounds = {min: 0, max: 100};
    this._yBounds = {min: 0, max: 100};
    this._view = {min: 0, max: 100};
    this._xAxisCount = 1;
    this._yAxisCount = 1;
    this._xAxisState = {};
    this._yAxisState = {};
    this._yBoundsState = {};
    this._mousemove = [];
}


export default Telechart;