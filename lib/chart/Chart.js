import {inherit, createCanvas} from "./helpers/helpers.js";
import Events from "./helpers/Events.js";
import EVN from "./helpers/evn.js";
import DRWN from "./helpers/drwn.js";

function Chart(options){
    
    
    this.super.constructor.call(this);
    
}
var proto = Chart.prototype;
inherit(Chart, Events);


proto.add = function(){
    ///@TODO
}

proto.remove = function(){
    ///@TODO
}

proto.render = function(){
    ///@TODO
}

proto.resize = function(width,height){
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
}

proto._defaults = function(){
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

Chart.EVN = EVN;
Chart.DRWN = DRWN;


export default Chart;