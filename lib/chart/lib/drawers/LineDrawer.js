import {inherit, createCanvas, EVN} from "../../helpers/helpers.js";
import Drawer from "../Drawer.js";

function LineDrawer(options){
    Drawer.call(this,arguments);
}
inherit(LineDrawer, Drawer);
var proto = LineDrawer.prototype;

proto._draw = function(ev){
    if(!ev.index)
        return;
    let viewer = ev.viewer;
    let ctx = viewer.ctx;  
    let pt = ev.point;
    let ppt = ev.data[ev.index-1];
    let tickness = pt.tickness || viewer.options.tickness || 1;
    let color = pt.color || viewer.options.color || '#000';
    if(pt.end)
        return;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = tickness;
    ctx.beginPath();
    ctx.moveTo(Math.round(ppt.x)+0.5, Math.round(ppt.y)-0.5);
    ctx.lineTo(Math.round(pt.x)+0.5, Math.round(pt.y)-0.5);
    ctx.stroke();
    ctx.restore();
}

export default LineDrawer;