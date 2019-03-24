import {inherit, createCanvas} from "./helpers/helpers.js";
import Events from "./helpers/Events.js";
import Viewer from "./lib/Viewer.js";
import Drawer from "./lib/Drawer.js";
import EVN from "./helpers/evn.js";
import DRW from "./helpers/drw.js";
import VIE from "./helpers/vie.js";



/**
 *  @class Chart extends Events
 *
 *  @TODOs
 *   DOCs,
 *   Errors
 *   Better way to merge options
 */
function Chart(options){
    
    
    Events.call(this);
    
    this._init(options);
    
}
inherit(Chart, Events);
var proto = Chart.prototype;


proto.clear = function(){
    this.ctx.clearRect(0,0,this.width,this.height);
}

proto.add = function(viewer){
    if(!(viewer instanceof Viewer))
        throw new Error();  ///@TODO
    viewer.setContext(this.ctx);
    this._viewers.push(viewer);
}

proto.remove = function(viewer){
    let ind = this._viewers.indexOf(viewer);
    if(ind < 0)
        return;
    this._viewers.splice(ind,1);
}

proto.appendCanvas = function(el){
    if(!el)
        el = this.el;
    if(!el)
        return;
    el.appendChild(this.canvas);
}

proto.render = function(opts){
    this.clear(opts);
    for(let it of this._viewers)
        it.render();
}

proto.resize = function(width,height){
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
}

proto._defaults = function(){
    this._viewers = [];
    this._defaultOptions = {
        width: 400,
        height: 400,
    };
}

proto._init = function(options){
    this._defaults();
    this.options = {...this._defaultOptions, ...options};
    this.canvas = createCanvas();
    this.resize(this.options.width, this.options.height);
    this.ctx = this.canvas.getContext('2d');
    this.el = this.options.el;
    //this.appendCanvas();
}

Chart.V = VIE;
Chart.E = EVN;
Chart.D = DRW;
Chart.Drawer = Drawer;
Chart.Viewer = Viewer;


export default Chart;