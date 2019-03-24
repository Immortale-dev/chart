import {inherit, EVN} from "../../helpers/helpers.js";
import Viewer from "../Viewer.js";
import TextDrawer from "../drawers/TextDrawer.js";

/** 
 *  @class Axis extends Viewer
 *  
 *  @arg options = {
 *      direction: <x|y>,
 *      bounds: {min,max},
 *      width: int,
 *      height: int,
 *      count: int,
 *      line: {
 *          thickness: int,
 *          color: string,
 *          from: int,
 *          to: int,
 *          opacity: float,
 *          offset: int,
 *      },
 *      text: {
 *          size: int,
 *          family: string,
 *          color: string,
 *          opacity: float,
 *          from: int,
 *          to: int,
 *          offset: int,
 *          baseline: string,
 *          align: string,
 *      }
 *  }
 */
function Axis(options){
    
    //Viewer.call(this,TextDrawer,arguments);
    
    this.drawer = new TextDrawer();
    
    this._init(options);
    
    this.direction = this.options.direction;
    this.setValues();
}

inherit(Axis, Viewer);
var proto = Axis.prototype;

///!Override
proto.setBounds = function(bounds){
    if(!bounds) return;
    this.bounds.min = bounds.min || this.bounds.min;
    this.bounds.max = bounds.max || this.bounds.max;
}

proto.setValues = function(opts = {}){
    if(Array.isArray(opts)){
        ///@TODO
    }
    let valuesFrom = opts.from || this.options.text.from || 0;
    let valuesTo = opts.to || this.options.text.to;
    let valuesCount = opts.count || this.options.count;
    let data = [];
    
    if(!valuesCount)
        return;

    for(let i=0;i<valuesCount;i++){
        data.push(valuesFrom + (valuesTo-valuesFrom)/(valuesCount)*i);
    }

    let ind = 0;
    var sdata = data.map(a=>{
        let ret = {
            [this.direction]: a, 
            text: a,
            align: this.options.text.align,
            baseline: this.options.text.baseline,
            size: this.options.text.size,
            color: this.options.text.color,
            opacity: this.options.text.opacity,
            family: this.options.text.family
        };
        if(this._dataValue)
            ret = this._dataValue(ret,ind++);
        return ret;
    });
    this.setData(sdata);
}

proto._updateDrawerDataX = function(a,b,ind,data){
    let dir = this.direction;
    if(dir === 'x'){
        return (b.x-this.bounds.min)/(this.bounds.max-this.bounds.min)*this.width + this.options.text.offsetX;
    }
    else{
        return this.options.text.offsetX;
    }
}

proto._updateDrawerDataY = function(a,b,ind,data){
    let dir = this.direction;
    if(dir === 'y'){
        return this.height - (b.y-this.bounds.min)/(this.bounds.max-this.bounds.min)*this.height + this.options.text.offsetY;
    }
    else{
        return this.options.text.offsetY;
    }
}

proto.ondata = function(fn){
    this._dataValue = fn;
}

proto._defaults = function(){
    this._dataValue;
    Viewer.prototype._defaults.call(this,arguments);
    
    this._defaultOptions.text = {
        size: 14,
        family: 'Arial',
        color: '#000',
        offsetX: 0,
        offsetY: 0,
        opacity: 1,
        from: 0,
        to: 0,
        baseline: 'top',
        align: 'left',
    };
    
    this.bounds.min = 0;
    this.bounds.max = 0;
}

export default Axis;