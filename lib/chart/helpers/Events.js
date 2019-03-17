function Events(){
    
    this.on;
    this.off;
    this.fire;
    
    this._evs = {};
    ////////////////////////
    
}

var proto = Events.prototype;

proto.on = function(name, fn){
    let evs = this._evs;
    if(!evs[name])
        evs[name] = [];
    evs[name].push(fn);
}

proto.off = function(name, fn){
    let evs = this._evs;
    if(!evs[name])
        return;
    let ind = evs[name].indexOf(fn);
    if(ind<0)
        return;
    evs[name].splice(ind,1);
}

proto.firable = function(name){
    return !!this._evs[name];
}

proto.fire = function(name, ...args){
    let evs = this._evs;
    if(!evs[name])
        return;
    for(let it of evs[name])
        it.call(this, args);
}

export default Events;