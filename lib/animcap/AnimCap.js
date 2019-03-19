import RenderQueue from "../renderqueue/RenderQueue.js";

function AnimCap(opts){
    this._rq = new RenderQueue();
    this._tf = opts.timingFunction || AnimCap.T.linear;
    this._ids = {};
}
var proto = AnimCap.prototype;
var raf = window.requestAnimationFrame;

AnimCap.T = {
    linear: function (t) { return t },
    easeInQuad: function (t) { return t*t },
    easeOutQuad: function (t) { return t*(2-t) },
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    easeInCubic: function (t) { return t*t*t },
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    easeInQuart: function (t) { return t*t*t*t },
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    easeInQuint: function (t) { return t*t*t*t*t },
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
};

proto.animate = function(id, opts){
    let time = opts.time;
    let tf = opts.timingFunction || this._tf;
    let tnow = 0;
    let rq = this._rq;
    return (cb)=>{
        let sfn = (a)=>{
            let t = a.time;
            tnow += t;
            if(tnow > time)
                tnow = time;
            let coof = tf(tnow/time);
            cb(coof);
            if(time === tnow){
                rq.unsubscribe(sfn);
            }
            rq.push(id);
        }
        rq.subscribe(sfn);
        rq.push(id);
    }
}