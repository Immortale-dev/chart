
import Axis from "../../chart/lib/viewers/Axis.js";
import {inherit} from "../../chart/helpers/helpers.js";
import AnimCap from "../../animcap/AnimCap.js";

function TeleAxis(opts){
    Axis.call(this,opts);
    
    ///@TODO weird property assign;
    this.distance = opts.distance || 60;
    this.animationTime = opts.animationTime || 400;
    this.setFrames(opts.frames);
    
    this.AC = new AnimCap();

    let count = this._calcCount();
    this._state = {
        state: 0,
        curCount: count,
        newCount: count
    };
    
    if(opts.ondata)
        this.ondata(opts.ondata);
    
    this.setValues({
        from: this.frames.min,
        to: this.frames.max,
        count: count,
    });
}
inherit(TeleAxis, Axis);
var proto = Axis.prototype;


proto.setFrames = function(frames){
    this.frames = frames;
}

proto._calcCount = function(){
    let prop = this.direction === 'x' ? 'width' : 'height';
    let cs = Math.floor(this[prop]/this.distance);
    let timeLine = this.frames.max-this.frames.min;
    let curLine = this.bounds.max-this.bounds.min;
    let cc = Math.floor(Math.log2(Math.floor(timeLine/curLine)))-1;
    cc = 2<<cc;
    if(!cc) cc = 1;
    return cc*cs;
}

proto.onforce = function(fn){
    this._forcefn = fn;
}

proto.view = function(min, max){
    
    this.setBounds({min,max});
    
    let count = this._calcCount();

    if(count == this._state.newCount){
        this.setData(this.getData());
        return;
    }
    
    this._state.state = 1;
    this._state.newCount = count;
    
    let oldData = this.getData();

    let ops = [];
    if(count > this._state.curCount){
        this.setValues({from: this.frames.min, to: this.frames.max, count:count});
        let ndata = this.getData();
        let ndataCoof = count/this._state.curCount;
        for(let i=0;i<ndata.length;i++){
            if(i%ndataCoof)
                ndata[i].opacity = 0;
            ops.push({f: ndata[i].opacity, t: 1});
        }
        this.setData(this.data);
        this._state.curCount = count;
    }
    else{
        let ndata = this.getData();
        let ndataCoof = this._state.curCount/count;
        for(let i=0;i<ndata.length;i++){
            ops.push({f: ndata[i].opacity || 1, t: (i%ndataCoof) ? 0 : 1 });
        }
    }
    
    this.AC.animate('main',{time: this.animationTime})((coof, finished)=>{
        for(let i=0;i<ops.length;i++){
            let op = ops[i];
            let c = (op.t-op.f)*coof+op.f;
            this.data[i].opacity = c;
        }
        this.setData(this.data);
        if(finished){
            if(this._state.newCount < this._state.curCount){                
                this.setValues({from: this.frames.min, to: this.frames.max, count:count});
            }
            this._state.curCount = count;
        }
        this._forcefn && this._forcefn();
    });
}

export default TeleAxis;