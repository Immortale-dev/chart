import {inherit, EVN} from "../../helpers/helpers.js";
import Drawer from "../Drawer.js";

///@TODO add options and use them

function TextDrawer(options){
    Drawer.call(this,arguments);
}
inherit(TextDrawer, Drawer);
var proto = TextDrawer.prototype;

proto._draw = function(ev){
    let viewer = ev.viewer;
    let ctx = viewer.ctx;   
    let pt = ev.point;
    
    let fontArr = [];
    if(pt.style)
        fontArr.push(pt.style);
    if(pt.weight)
        fontArr.push(pt.weight);
    if(pt.size)
        fontArr.push(pt.size+'px');
    if(pt.family)
        fontArr.push(pt.family);
    
    ctx.save();
    ctx.textBaseline = pt.baseline;
    ctx.textAlign = pt.align;
    ctx.font = fontArr.join(' ');
    ctx.fillStyle = pt.color;
    ctx.fillText(pt.text.toString(), pt.x, pt.y);
    ctx.restore();
}

export default TextDrawer;