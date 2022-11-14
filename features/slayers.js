import { data, PREFIX } from "../index";
import config from "../config";
import { slayers_rng } from "../utils/slayers_rng";
import { abc, short_number, slayer_gui_names, slayer_names, slayer_colored_names, slayer_short_names } from "../utils/utils";
import "../utils/utils"
let is_slayer = false;
register("chat", (slayer_name) => {
    if(slayer_name.includes(slayer_short_names[config.config_slayer])) is_slayer = true;
    else is_slayer = false;
}).setCriteria("   ${slayer_name} Slayer LVL ${*} - ${*}!");
register("chat", (xp) => {
    let xp_gained = parseInt(xp.replace(",", ""))
    if(is_slayer){
        data.slayer_score += Math.trunc(xp_gained - data.slayer_score);
        data.save();
    }
}).setCriteria("   RNG Meter - ${xp} Stored XP");
register("step", () => {
    if(config.config_type == 0 || !World.isLoaded()) return;
    if(Player.getContainer() !== null && Player.getContainer().getName() == slayer_gui_names[config.config_slayer]) {
        Player.getContainer().getItems().forEach((e) => {
            if(e !== null){
                e.getLore().forEach((lore) => {
                    if(lore.includes("SELECTED")){
                        data.slayer_rng = e.getName();
                        data.save()
                        e.getLore().map((value) => {
                            if(value.includes("/")){
                                data.slayer_score = parseInt(value.split("/")[0].removeFormatting().trim().replace(",", ""));
                                data.save()
                            }
                        })
                    }
                });
            }
        });
    }
    else if(Player.getContainer() !== null && Player.getContainer().getName().includes(slayer_names[config.config_slayer])){
        Player.getContainer().getItems().forEach((items) => {
            if(items !== null){
                items.getLore().forEach((lore) => {
                    if(lore.includes("RNG Meter")){
                        items.getLore().map((value) => {
                            if(value.includes("You don't have an RNG drop")) return;
                            if(value.includes("/")){
                                data.slayer_score = parseInt(value.split("/")[0].removeFormatting().trim().replace(",", ""));
                                data.save();
                            }
                            if(value.includes("Selected Drop")){
                                data.slayer_rng = `${items.getLore()[14]}`;
                                data.save();
                            }
                        });
                    }
                });
            }
        });
    }
    else if(Player.getContainer() !== null && Player.getContainer().getName().includes("Slayer")){
        Player.getContainer().getItems().forEach((items) => {
            if(items !== null){
                items.getLore().forEach((lore) => {
                    if(lore.includes("RNG Meter")){
                        if(!items.getLore()[1].includes(slayer_names[config.config_slayer])) return;
                        items.getLore().map((value) => {
                            if(value.includes("You don't have an RNG drop")) return;
                            if(value.includes("/")){
                                data.slayer_score = parseInt(value.split("/")[0].removeFormatting().trim().replace(",", ""));
                                data.save();
                            }
                            if(value.includes("Selected Drop")){
                                data.slayer_rng = items.getLore()[14];
                                data.save();
                            }
                        });
                    }
                });
            }
        });
    }
}).setFps(2);
register("renderOverlay", () => {
    if(!config.config_display || config.config_type == 0 || !World.isLoaded()) return;
    if(data.slayer_score == 0 || data.slayer_rng == null) return;
    if (abc.isOpen()) {
        const txt = "Click anywhere to move!"
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
    }
    if (!data.slayer_score && abc.isOpen()) return;
    let slayer_rng = slayers_rng.Slayers[config.config_slayer][data.slayer_rng.removeFormatting()];
    if(slayer_rng == undefined) {
        data.slayer_score = 0;
        data.slayer_rng = null;
        data.save();
        return;
    }
    let tscore = data.slayer_score >= slayer_rng ?`&6`:`&7`;
    let rng_progress = ((data.slayer_score/slayer_rng)*100).toFixed(2) > 100 ?"100%":`${((data.slayer_score/slayer_rng)*100).toFixed(2)}%`;
    if(config.config_style==0) {
        Renderer.drawStringWithShadow(`${PREFIX} ${slayer_colored_names[config.config_slayer]}\n&dRNG: ${data.slayer_rng}\n&dScore: ${tscore}${short_number(data.slayer_score)}&d/&6${short_number(slayer_rng)} ${tscore}(${rng_progress})`, data.x, data.y)
    } else {
        let tcolor = slayer_colored_names[config.config_slayer].substring(0,2)
        let tscore = data.slayer_score >= slayer_rng ?`&b`:`&7`;
        Renderer.drawStringWithShadow(`${tcolor}RNG: ${data.slayer_rng}\n${tcolor}Score: ${tscore}${short_number(data.slayer_score)}&7/&b${short_number(slayer_rng)} ${tscore}(${rng_progress})`, data.x, data.y)
    }
});