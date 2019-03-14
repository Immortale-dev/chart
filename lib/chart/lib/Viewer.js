import {inherit, createCanvas} from "../helpers/helpers.js";
import DRWN from "../helpers/drwn.js";
import Drawer from "../lib/Drawer.js";



function Viewer(dt, options = {}, data = []){
    
    ///@TODO
    if(!(dt instanceof Drawer))
        throw new Error(); 
    
    this.drawer = new dt(options);
    
    this._init(options,data);
    
}
var proto = Viewer.prototype;


proto.resize = function(w,h){
    this.width = w;
    this.height = h;
    this._updateDrawerData();
}

proto.move = function(l,t){
    this.left = l;
    this.top = t;
}

proto.setData = function(data){
    if(!data) return;
    this.data = data;
    this._updateDrawerData();
}

proto.render = function(){
    
    ///@TODO
    if(!this.ctx)
        throw new Error();
    
    var ctx = this.ctx;
    this.clear();
    ctx.save();
    ctx.translate(this.left,this.top);
    if(this.options.clip)
        this._clip();
    this.drawer.draw(ctx);
    ctx.restore();
}

proto.clear = function(){
    this.ctx.clearRect(left,top,left+width,top+height);
}

proto.setBounds = function(bounds){
    if(!bounds) return;
    this.bounds.minX = bounds.minX || this.bounds.minX;
    this.bounds.maxX = bounds.maxX || this.bounds.maxX;
    this.bounds.minY = bounds.minY || this.bounds.minY;
    this.bounds.maxY = bounds.maxY || this.bounds.maxY;
    this._updateDrawerData();
}

proto.disable = function(){
    this.disabled = true;
}

proto.enable = function(){
    this.disabled = false;
}

proto.setContext = function(ctx){
    this.ctx = ctx;
}

this._clip = function(){
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.rect(0,0,this.width,this.height);
    ctx.clip();
}

this._updateDrawerData = function(){
    var data = this.data.map((a)=>{
        let b = {...a};
        b.x = (b.x-this.bounds.minX)/(this.bounds.maxX-this.bounds.minX)*this.width;
        b.y = (b.y-this.bounds.minY)/(this.bounds.maxY-this.bounds.minY)*this.height;
    });
    this.drawer.setData(data);
}

proto._defaults = function(){
    this.disabled = false;
    this.data = [];
    this.bounds = {
        minX:0,
        maxX:0,
        minY:0,
        maxY:0
    };
    this._defaultOptions = {
        width: 400,
        height: 400,
        top:0,
        left:0,
        clip:true,
    };
}

proto._init = function(options, data){
    this._defaults();
    this.options = {...this._defaultOptions, ...options};
    this.setBounds(this.options.bounds);
    delete this.options.bounds;
    
    this.setData(data);
    
    this.width = this.options.width;
    this.height = this.options.height;
    this.top = this.options.top;
    this.left = this.options.left;
}



export default Viewer;