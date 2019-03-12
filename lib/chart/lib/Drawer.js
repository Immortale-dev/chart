import {inherit, createCanvas, EVN} from "./helpers/helpers.js";
import Events from "./helpers/Events.js";
import EV from "./helpers/EV.js";


/** 
 * @class Draw extends Events
 */
function Drawer(options){
    
    this._defaults;
    this._init;
    
    /////////////////////////
    this.super.constructor.call(this);
    this._init();
}
inherit(Drawer, Events);
var proto = Drawer.prototype;



proto.resize = function(w,h){
    this.width = w;
    this.height = h;
}

proto.move = function(l,t){
    this.left = l;
    this.top = t;
}

proto.setData = function(d){
    this.data = d;
}

proto.getData = function(){
    return this.data.slice(0);
}

proto.draw = function(ctx){
    let ind = 0;
    for(let pt of data){
        let ev = new EV.DrawerDrawEv(ctx,pt,ind,this.data);
        if(this.firable(EVN.DRAWERDRAW)){
            this.fire(EVN.DRAWERDRAW, ev, ()=>{ this._draw(ev) });
        }
        else{
            this._draw(ev);
        }
        ind++;
    }
}


proto._draw = function(){
    ///! Override;
}


proto._defaults = function(){
    this._defaultOptions = {
        width: 400,
        height: 400,
        top:0,
        left:0,
    };
}

proto._init = function(options = {}, data = null){
    
    this._defaults();
    this.options = {...this._defaultOptions, ...options};
    this.data = [];
    
    this.width = this.options.width;
    this.height = this.options.height;
    this.top = this.options.top;
    this.left = this.options.left;
    
}

