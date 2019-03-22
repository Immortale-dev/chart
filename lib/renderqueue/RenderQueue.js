function RenderQueue(){
    this._evs = [];
    this._sbs = [];
    this._running = false;
    this._disabled = false;
    this._time = null;
}
var proto = RenderQueue.prototype;
var raf = window.requestAnimationFrame;

Object.defineProperty(proto, 'running', {
    get: function(){ return this._running; }
});

Object.defineProperty(proto, 'length', {
    get: function(){ return this._evs.length; }
});

Object.defineProperty(proto, 'disabled', {
    get: function(){ return this._disabled; }
});

proto.start = function(){
    this._disabled = false;
}

proto.push = function(obj){
    this._evs.push(obj);
    this._checkState();
}

proto.stop = function(){
    this._disabled = true;
}

proto.subscribe = function(fn){
    this._sbs.push(fn);
}

proto.unsubscribe = function(fn){
    let ind = this._sbs.indexOf(fn);
    if(ind < 0)
        return;
    this._sbs.splice(ind,1);
}

proto._ping = function(){
    let curr = this._evs.splice(0);
    let t = performance.now();
    for(let it of this._sbs)
    it({time:t-this._time,data:curr});
    this._time = t;
}

proto._run = function(){
    raf(()=>{
        if(!this.length || this.disabled)
            return this._running = false;
        this._ping();
        this._run();
    });
}

proto._checkState = function(){
    if(this.running || this.disabled)
        return;
    this._running = true;
    this._time = performance.now();
    this._run();
}

export default RenderQueue;