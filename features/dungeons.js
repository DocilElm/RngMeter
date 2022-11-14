import { data, PREFIX } from "../index";
import config from "../config";
import { dungeons_rng } from "../utils/dungeons_rng";
import { abc, short_number } from "../utils/utils";
import "../utils/utils"

let all_floors = [19,20,21,22,23,24,25,28,29,30,31,32,33,34]
let all_floors_name = ["F1","F2","F3","F4","F5","F6","F7","M1","M2","M3","M4","M5","M6","M7"]
let should_add = null;
let current_floor = null;

register("step", () => {
    if(!World.isLoaded()) return;
    try {
        let scoreb = Scoreboard.getLines(false)
        if(scoreb.length == 0) return;
        if(scoreb[3].getName().includes("The Cata")) {
            current_floor = scoreb[3].getName().substring(scoreb[3].getName().indexOf("(")+1, scoreb[3].getName().indexOf(")"))
            if(config.config_auto_detect_floor) {config.config_floor = all_floors_name.indexOf(current_floor)}
        } else if (scoreb[2].getName().includes("The Cata")) {
            current_floor = scoreb[2].getName().substring(scoreb[2].getName().indexOf("(")+1, scoreb[2].getName().indexOf(")"))
            if(config.config_auto_detect_floor) {config.config_floor = all_floors_name.indexOf(current_floor)}
        } else {
            current_floor = null;
        }
    } catch(error) {console.log(error);}
}).setFps(1)

register("chat", (floor, rng) => {
    console.log("set" + floor + " " + rng)
    data.dungeons_rng[all_floors_name.indexOf(floor)] = rng;
    data.save();
}).setCriteria("You set your Catacombs (${floor}) RNG Meter to drop ${rng}!");

register("chat", (floor) => {
    console.log(floor + " reset")
    data.dungeons_rng[all_floors_name.indexOf(floor)] = null;
    data.save();
}).setCriteria("You reset your selected drop for your Catacombs (${floor}) RNG Meter!");

register("chat", () => {
    should_add = false;
    console.log("should_add: " + should_add)
}).setCriteria("${*} Catacombs - ${*} Stats");

register("worldLoad", () => {
    should_add = true;
})

register("chat", (score, rank) => {
    if(!should_add || !current_floor) return;
    if(data.dungeon_score[all_floors_name.indexOf(current_floor)]>=dungeons_rng[i <= 6 ? "Normal_Mode" : "Master_Mode"][all_floors_name.indexOf(current_floor)][data.dungeon_rng[all_floors_name.indexOf(current_floor)]]) {
        data.dungeon_score[all_floors_name.indexOf(current_floor)] = (data.dungeon_score[all_floors_name.indexOf(current_floor)] + Math.trunc(score*(rank=="(S)" ? .7 : rank=="(S+)" ? 1 : 0)))-dungeons_rng[i <= 6 ? "Normal_Mode" : "Master_Mode"][all_floors_name.indexOf(current_floor)][data.dungeon_rng[all_floors_name.indexOf(current_floor)]]
    }else {
        data.dungeon_score[all_floors_name.indexOf(current_floor)] += Math.trunc(score*(rank=="(S)" ? .7 : rank=="(S+)" ? 1 : 0))
    }
    data.save();
}).setCriteria("${*}Team Score: ${score} ${rank}");

register("step", () => {
    if(!World.isLoaded()) return;
    else if(Player.getContainer() !=null && Player.getContainer().getName() == "Catacombs RNG Meter") {
        for(let i=0; i<all_floors.length; i++) {
            let score = Player.getContainer().getStackInSlot(all_floors[i]);
            if(!score || score == null || !score.getLore() || score.getLore() == null) return;
            else if(score.getLore()[17].includes("selected. Choose one to start")) {
                data.dungeon_score[i] = 0;
                data.dungeon_rng[i] = null;
                data.save();
                return;
            }
            data.dungeon_score[i] = parseInt(score.getLore()[20].split("/")[0].removeFormatting().trim().replace(",",""));
            data.dungeon_rng[i] = score.getLore()[17].removeFormatting();
            data.save();
        }
    }
}).setFps(2);

register("renderOverlay", () => {
    if(!config.config_display || config.config_type == 1 || !World.isLoaded()) return;
    if(data.dungeon_score.length == 0 || data.dungeon_rng.length == 0) {
        Renderer.drawStringWithShadow(`${PREFIX} &fOpen The Catacombs RNG Menu!`, data.x, data.y);
        return;
    }

    if (abc.isOpen()) {
        Renderer.drawStringWithShadow("Click anywhere to move!", Renderer.screen.getWidth()/2 - Renderer.getStringWidth("Click anywhere to move!")/2, Renderer.screen.getHeight()/2)
    }

    if(config.config_display_all) {
        if(config.config_style == 0) {
            Renderer.drawStringWithShadow(`${PREFIX}`,data.x,data.y-10)
        }
        for(let i=((config.config_display_mm&&!config.config_display_normal) ? 7 : 0); i<all_floors.length-(config.config_display_mm ? 0 : 7); i++) {
            let score = data.dungeon_score[i];
            let rng = dungeons_rng.Item_Names[data.dungeon_rng[i]];
            let meter_rng = dungeons_rng[i <= 6 ? "Normal_Mode" : "Master_Mode"][i][data.dungeon_rng[i]];
            if(score == 0 || rng == null) continue;
            let txt = config.config_style == 0 ? `${i<=6 ? "&a" : "&c"}${all_floors_name[i]}&f: &f${rng} &7${short_number(score)}&d/&6${short_number(meter_rng)} &7(${((score/meter_rng)*100).toFixed(2)}%)` : `${i<=6 ? "&a" : "&c"}${rng}: &7${short_number(score)}${i<=6 ? "&a" : "&c"}/&7${short_number(meter_rng)} &7(${((score/meter_rng)*100).toFixed(2)}%)`;
            Renderer.drawStringWithShadow(txt, data.x, data.y + ((i-((config.config_display_mm&&!config.config_display_normal) ? 7 : 0))*10));
        }
    } else {
        let score = data.dungeon_score[config.config_floor];
        let rng = dungeons_rng.Item_Names[data.dungeon_rng[config.config_floor]];
        let meter_rng = dungeons_rng[config.config_floor <= 6 ? "Normal_Mode" : "Master_Mode"][config.config_floor][data.dungeon_rng[config.config_floor]];
        if(score == 0 || rng == null) return;
        let txt = config.config_style == 0 ? `${PREFIX}\n${config.config_floor<=6 ? "&a" : "&c"}${all_floors_name[config.config_floor]}&f: &f${rng}\n${config.config_floor<=6 ? "&a" : "&c"}Score&f: &7${short_number(score)}&d/&6${short_number(meter_rng)} &7(${((score/meter_rng)*100).toFixed(2)}%)` : `${config.config_floor<=6 ? "&a" : "&c"}${rng}: &7${short_number(score)}${config.config_floor<=6 ? "&a" : "&c"}/&7${short_number(meter_rng)} &7(${((score/meter_rng)*100).toFixed(2)}%)`;
        Renderer.drawStringWithShadow(txt, data.x, data.y);
    }
});