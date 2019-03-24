import {inherit, EVN} from "../../helpers/helpers.js";
import Viewer from "../Viewer.js";
import LineDrawer from "../drawers/LineDrawer.js";

function Plate(options){
    
    this.drawer = new LineDrawer();

    this._init(options);
    
    this.setValues();
    
    
}
inherit(Plate, Viewer);
var proto = Plate.prototype;

proto.ondata = function(fn){
    this._dataValue = fn;
}

proto._defaults = function(){
    
    Viewer.prototype._defaults.call(this);
    
    this._dataValue;
    let def = this._defaultOptions;
    def.tickness = 1;
    def.color = '#000';
    
    def.x = {
        ///@TODO more options?
        count: 0
    };
    def.y = {
        count: 0
    };
    def.bounds = {
        minX: 0,
        minY: 0,
        maxX: 1,
        maxY: 1,
    };
    
}

proto.setValues = function(obj = {}){
    if(Array.isArray(obj)){
        ///@TODO
    }
    let xData = [];
    let yData = [];
    let xC = obj.xCount || this.options.x.count;
    let yC = obj.yCount || this.options.y.count;
    if(xC){
        for(let i=0;i<xC;i++){
            xData.push(1/(xC-1)*i);
        }
        xData.push(1);
    }
    if(yC){
        for(let i=0;i<yC;i++){
            yData.push(1/(yC)*i);
        }
    }
    let data = [];
    for(let it of xData){
        data.push({x:it,y:0,end:1});
        data.push({x:it,y:1});
    }
    for(let it of yData){
        data.push({x:0,y:it,end:1});
        data.push({x:1,y:it});
    }
    let ind = 0;
    let sdata = data.map(a=>{
        a.color = this.options.color;
        a.tickness = this.options.tickness;
        if(this._dataValue)
            a = this._dataValue(a,ind++);
        return a;
    });
    this.setData(sdata);
}

export default Plate;