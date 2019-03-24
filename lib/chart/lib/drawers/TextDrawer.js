import {inherit, EVN} from "../../helpers/helpers.js";
import Drawer from "../Drawer.js";


/**
 *  @class TextDrawer extends Drawer
 */
function TextDrawer(options){
    Drawer.call(this,arguments);
}
inherit(TextDrawer, Drawer);
var proto = TextDrawer.prototype;

proto._draw = function(ev){
    let viewer = ev.viewer;
    let ctx = viewer.ctx;   
    let pt = ev.point;
    let opacity = 1;
    
    let fontArr = [];
    if(pt.style)
        fontArr.push(pt.style);
    if(pt.weight)
        fontArr.push(pt.weight);
    if(pt.size)
        fontArr.push(pt.size+'px');
    if(pt.family)
        fontArr.push(pt.family);
    if(pt.hasOwnProperty('opacity'))
        opacity = pt.opacity;
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.textBaseline = pt.baseline;
    ctx.textAlign = pt.align;
    ctx.font = fontArr.join(' ');
    ctx.fillStyle = pt.color;
    ctx.fillText(pt.text.toString(), pt.x, pt.y);
    ctx.restore();
}

export default TextDrawer;