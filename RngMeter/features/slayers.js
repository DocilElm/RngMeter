import { data, PREFIX } from "../index";
import config from "../config";
import { slayers_rng } from "../utils/slayers_rng";
import { abc, short_number, slayer_gui_names, slayer_names, slayer_colored_names, slayer_short_names } from "../utils/utils";
import "../utils/utils"

let slayer_type = null;
register("chat", (slayer_name) => {
    for(let i=0; i<slayer_short_names.length; i++) {
        if(slayer_name.includes(slayer_short_names[i])) {
            if(config.config_auto_detect_slayer) {config.config_slayer = i}
            slayer_type = i;
            break;
        }
    }
}).setCriteria("   ${slayer_name} Slayer LVL ${*} - ${*}!");

register("chat", (xp) => {
    let xp_gained = parseInt(xp.replace(",", ""))
    data.slayer_score[slayer_type] = xp_gained;
    data.save();
    slayer_type = null;
}).setCriteria("   RNG Meter - ${xp} Stored XP");


register("step", () => {
    if(config.config_type == 0 || !World.isLoaded() || Player.getContainer() == null) return;

    let container = Player.getContainer();
    let container_name = container.getName();

    if(container_name.includes("RNG Meter")) {
        let slayer_index = slayer_gui_names.indexOf(container_name);
        if(slayer_index == -1) return;

        container.getItems().filter(e => e!==null).forEach(e => {
            e.getLore().forEach(lore => {
                if(lore.includes("SELECTED")) {
                    data.slayer_rng[slayer_index] = e.getName();
                    let i = -1;
                    e.getLore().map( (value, index) => {
                        if(value.includes("Progress: ")) {
                            i = index+1;
                        }
                    })
                    if(i!=-1) {
                        data.slayer_score[slayer_index] = parseInt(e.getLore()[i].split("/")[0].removeFormatting().trim().replace(",", ""));
                    }
                    data.save();
                    return;
                }
            })
        })
    }
}).setFps(2);

register("renderOverlay", () => {
    if(!config.config_display || config.config_type == 0 || !World.isLoaded()) return;

    if(abc.isOpen()) {
        Renderer.drawStringWithShadow("Click anywhere to move!", Renderer.screen.getWidth()/2 - Renderer.getStringWidth("Click anywhere to move!")/2, Renderer.screen.getHeight()/2)
    }
    
    let score = data.slayer_score[config.config_slayer];
    let rng = data.slayer_rng[config.config_slayer];
    let slayer_colored_name = slayer_colored_names[config.config_slayer];
    if(score==0 || rng=="") return;

    let rng_progress = ((score/slayers_rng.Slayers[config.config_slayer][rng.substring(2,rng.length)])*100).toFixed(2) > 100 ?"100%":`${((score/slayers_rng.Slayers[config.config_slayer][rng.substring(2,rng.length)])*100).toFixed(2)}%`;
    let txt = `${PREFIX}${slayer_colored_name}\n&dRNG: ${rng}\n&dProgress: &7${short_number(score)}&d/&6${short_number(slayers_rng.Slayers[config.config_slayer][rng.substring(2,rng.length)])} &7(${rng_progress})`;
    Renderer.drawStringWithShadow(txt, data.x, data.y);
});