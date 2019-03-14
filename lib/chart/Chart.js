import {inherit, createCanvas} from "./helpers/helpers.js";
import Events from "./helpers/Events.js";
import Viewer from "./lib/Viewer.js";
import EVN from "./helpers/evn.js";
import DRW from "./helpers/drw.js";
import VIE from "./helpers/vie.js";

function Chart(options){
    
    
    this.super.constructor.call(this);
    this._init();
    
}
var proto = Chart.prototype;
inherit(Chart, Events);


proto.add = function(viewer){
    if(!(viewer instanceof Viewer))
        throw new Error();  ///@TODO
    this._viewers.push(viewer);
}

proto.remove = function(viewer){
    let ind = this._viewers.indexOf(viewer);
    if(ind < 0)
        return;
    this._viewers.splice(ind,1);
}

proto.render = function(){
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
}

Chart.VIE = VIE;
Chart.EVN = EVN;
Chart.DRW = DRW;


export default Chart;