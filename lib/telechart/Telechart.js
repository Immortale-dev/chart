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
    if(!obj){
        this._view.min = this.xFrames.min;
        this._view.max = this.xFrames.max;
    }
    else{
        this._view.min = obj.min;
        this._view.max = obj.max;
    }
    this._calcBounds();
    this._updateBounds();
    this._updateScroller();
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
    
    this._setView(options.view);
    
    ///@TODO
}

proto._render = function(){
    this._chart.render();
}

proto._updateAxisValues = function(){
    
}

proto._updateBounds = function(){
    let bounds = this._generateBounds();
    this._xAxis.setBounds({min: bounds.minX, max: bounds.maxX});
    this._yAxis.setBounds({min: bounds.minY, max: bounds.maxY});
    this._grid.setBounds({minX: (bounds.minX-this.xFrames.min)/(this.xFrames.max-this.xFrames.min), maxX: (bounds.maxX-this.xFrames.min)/(this.xFrames.max-this.xFrames.min), minY: (bounds.minY-this.yFrames.min)/(this.yFrames.max-this.yFrames.min), maxY: (bounds.maxY-this.yFrames.min)/(this.yFrames.max-this.yFrames.min)});
    
    let xAxisCount = this._calcXAxisCount();
    let yAxisCount = this._calcYAxisCount();
    
    this._xAxis.setValues({from:this.xFrames.min, to:this.xFrames.max, count: xAxisCount});
    this._yAxis.setValues({from:this.yFrames.min, to:this.yFrames.max, count: yAxisCount});
    
    if(xAxisCount != this._xAxisCount){
        this._animateXAxis(xAxisCount/this._xAxisCount);
        this._xAxisCount = xAxisCount;
    }
    if(yAxisCount != this._yAxisCount){
        this._animateYAxis(yAxisCount/this._yAxisCount);
        this._yAxisCount = yAxisCount;
    }

    for(let it of this._topCharts){
        it.setBounds(bounds);
    }
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
    this._yBounds.min = Math.max(this.yFrames.min, Math.floor( ymins.reduce((a,b)=>Math.min(a,b))/this.yPrecision )*this.yPrecision);
    this._yBounds.max = Math.min(this.yFrames.max, Math.ceil( ymaxs.reduce((a,b)=>Math.max(a,b))/this.yPrecision )*this.yPrecision);
}

proto._animateXAxis = function(coof){
    
}

proto._calcXAxisCount = function(){
    let cs = Math.floor(this.width/this.xAxisDistance);
    let timeLine = this.xFrames.max-this.xFrames.min;
    let curLine = this._xBounds.max-this._xBounds.min;
    let cc = Math.floor(Math.log2(Math.floor(timeLine/curLine)))-1;
    cc = 2<<cc;
    if(!cc) cc = 1;
    return cc*cs;
}

proto._calcYAxisCount = function(){
    let cs = Math.floor(this.height/this.yAxisDistance);
    let timeLine = this.yFrames.max-this.yFrames.min;
    let curLine = this._yBounds.max-this._yBounds.min;
    let cc = Math.floor(Math.log2(Math.floor(timeLine/curLine)))-1;
    cc = 2<<cc;
    if(!cc) cc = 1;
    return cc*cs;
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
        }
    });
    xAxis.ondata((a)=>{
        let d = new Date(a.x);
        a.text = this.monthes[d.getMonth()]+' '+d.getDate();
        return a;
    });
    let xAxisCount = this._calcXAxisCount();
    xAxis.setValues({
        from: this.xFrames.min,
        to: this.xFrames.max,
        count: xAxisCount,
    });
    
    //this._xAxisCount = xAxisCount;
    this._xAxisState = {
        state: 0,
        curCount: xAxisCount,
        newCount: xAxisCount
    };
    
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
        }
    });
    yAxis.ondata((a)=>{
        a.text = Math.round(a.y);
        return a;
    });
    let yAxisCount = this._calcYAxisCount();
    yAxis.setValues({
        from: this.yFrames.min,
        to: this.yFrames.max,
        count: yAxisCount,
    });
    
    this._yAxisState = {
        state: 0,
        curCount: yAxisCount,
        newCount: yAxisCount
    };
    //this._yAxisCount = yAxisCount;
    
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
    let scrOuter = document.createElement('div');
    let scrInner = document.createElement('div');
    let scrLeft = document.createElement('div');
    let scrRight = document.createElement('div');
    
    let draggerLeft = document.createElement('div');
    let draggerRight = document.createElement('div');
    let dragger = document.createElement('div');
    
    scrInner.appendChild(dragger);
    scrInner.appendChild(draggerLeft);
    scrInner.appendChild(draggerRight);
    
    scrOuter.appendChild(scrInner);
    scrOuter.appendChild(scrLeft);
    scrOuter.appendChild(scrRight);
    
    let outerStyles = {
        position: 'absolute',
        top: this.height+this.axisThickness+'px',
        height: this.mapHeight+'px',
        left: 0,
        right: 0,
    };
    let innerStyle = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        boxSizing: 'border-box',
        //borderTop: 'solid 4px '+this.mapBorderColor,
        //borderBottom: 'solid 4px '+this.mapBorderColor,
        borderTop: 'solid 1px '+this.mapBorderColor,
        borderBottom: 'solid 1px '+this.mapBorderColor,
    };
    let leftStyle = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 0,
        backgroundColor: this.mapFadeColor,
    };
    let rightStyle = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: 0,
        backgroundColor: this.mapFadeColor,
    }
    let draggerSideStyles = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 4+'px',
        cursor: 'w-resize',
        backgroundColor: this.mapBorderColor,
    };
    let draggerStyle = {
        position: 'absolute',
        left: 4+'px',
        right: 4+'px',
        top: 0,
        bottom: 0,
    };
    
    _applyStyles(scrOuter, outerStyles);
    _applyStyles(scrInner, innerStyle);
    _applyStyles(scrLeft, leftStyle);
    _applyStyles(scrRight, rightStyle);
    
    _applyStyles(dragger, draggerStyle);
    _applyStyles(draggerLeft, draggerSideStyles);
    _applyStyles(draggerRight, draggerSideStyles);
    
    draggerLeft.style.left = 0;
    draggerRight.style.right = 0;
    
    this._block.appendChild(scrOuter);
    
    this._scroller = {
        outer: scrOuter,
        inner: scrInner,
        left: scrLeft,
        right: scrRight
    };
    
    function _applyStyles(dom, styles){
        for(let i in styles){
            if(styles.hasOwnProperty(i))
            dom.style[i] = styles[i];
        }
    }
}

proto._init = function(options){
    
    this._defaults();
    this.setOptions(options);
    
    this._createBlock();
    
    this._createChart();
    
    this._chart.appendCanvas(this._block);
    this.el.appendChild(this._block);
    
    this._createPlate();
    this._createXAxis();
    this._createYAxis(); 
    
    this._createScroller();
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
    ///@TODO
}


export default Telechart;