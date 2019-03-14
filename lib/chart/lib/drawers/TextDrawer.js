import {inherit, createCanvas, EVN} from "./helpers/helpers.js";
import Drawer from "../Drawer.js";

///@TODO add options and use them

function TextDrawer(options){
    this.super.constructor.call(this,arguments);
}
inherit(TextDrawer, Drawer);
var proto = TextDrawer.prototype;

proto._draw = function(ev){
    let ctx = ev.ctx;   
    let pt = ev.point;
    ctx.save();
    ctx.fillText(pt.text, pt.x, pt.y);
    ctx.restore();
}

export default TextDrawer;