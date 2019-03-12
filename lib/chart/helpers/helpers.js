import EVN from "./evn.js";

function inherit(fn, fnp){
    fn.prototype = Object.create(fnp.prototype);
    fn.prototype.super = fnp.prototype;
    fn.prototype.constructor = fn;
}

var createCanvas = function(){
    var c = document.createElement('canvas');
    return c;
}

export {inherit, createCanvas, EVN};