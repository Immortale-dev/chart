import {inherit, EVN} from "../helpers/helpers.js";
import Events from "../helpers/Events.js";
import EV from "../helpers/EV.js";


/** 
 * @class Draw extends Events
 */
function Drawer(options = {}, data = []){
    
    this._defaults;
    this._init;
    
    /////////////////////////
    Events.call(this,arguments);
    this._init(options, data);
}
inherit(Drawer, Events);
var proto = Drawer.prototype;


proto.setData = function(d){
    if(!d) return;
    this.data = d;
}

proto.getData = function(){
    return this.data.slice(0);
}

proto.draw = function(vie){
    let ind = 0;
    for(let pt of this.data){
        let ev = new EV.DrawerDrawEv(vie,pt,ind,this.data);
        if(this.firable(EVN.DRAWERDRAW)){
            this.fire(EVN.DRAWERDRAW, ev, ()=>{ this._draw(ev) });
        }
        else{
            this._draw(ev);
        }
        ind++;
    }
}


proto._draw = function(ev){
    ///@TODO default draw fn?
}


proto._defaults = function(){
    ///@TODO default options?
    this.data = [];
    this._defaultOptions = {
        
    };
}

proto._init = function(options = {}, data = []){
    
    this._defaults();
    this.options = {...this._defaultOptions, ...options};
    this.setData(data);
    
}

export default Drawer;

