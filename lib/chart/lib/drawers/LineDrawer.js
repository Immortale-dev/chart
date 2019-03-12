import {inherit, createCanvas, EVN} from "./helpers/helpers.js";
import Drawer from "../Drawer.js";

function LineDrawer(options){
    this.super.constructor.call(this,arguments);
}
inherit(LineDrawer, Drawer);
var proto = LineDrawer.prototype;

proto._draw = function(ev){
    if(!ev.index)
        return;
    let ctx = ev.ctx;   
    let pt = ev.point;
    let ppt = ev.data[ev.index-1];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ppt.x, ppt.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    ctx.restore();
}

export default LineDrawer;