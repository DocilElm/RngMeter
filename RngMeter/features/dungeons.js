import { data, PREFIX } from "../index";
import config from "../config";
import { dungeons_rng } from "../utils/dungeons_rng";
import { abc, short_number } from "../utils/utils";
import "../utils/utils"
let all_floors = [19,20,21,22,23,24,25,28,29,30,31,32,33,34]
let all_floors_name = ["F1","F2","F3","F4","F5","F6","F7","M1","M2","M3","M4","M5","M6","M7"]
let all_floors_name_full = ["Floor I","Floor II","Floor III","Floor IV","Floor V","Floor VI","Floor VII","Floor I","Floor II","Floor III","Floor IV","Floor V","Floor VI","Floor VII"]
register("chat", (floor, rng) => {
    if(floor.includes(all_floors_name[config.config_floor])){
        data.dungeon_score = 0;
        data.dungeon_rng = rng;
        data.save();
    }
}).setCriteria("You set your Catacombs (${floor}) RNG Meter to drop ${rng}!");
register("chat", (floor) => {
    if(floor.includes(all_floors_name[config.config_floor])){
        data.dungeon_score = 0;
        data.dungeon_rng = null;
        data.save();
    }
}).setCriteria("You reset your selected drop for your Catacombs (${floor}) RNG Meter!");
let is_in_floor = false;
register("chat", (dung_type, floor) => {
    let dungeons_mode = config.config_floor <= 6 ?"The" : "Master Mode";
    if(dung_type.includes(`${dungeons_mode}`) && floor == all_floors_name_full[config.config_floor]){
        is_in_floor = true;
    }
}).setCriteria("${}${dung_type} Catacombs - ${floor}");
register("chat", (score, rank) => {
    if(!config.config_display) return;
    if(is_in_floor){
        if(rank == "(S)"){
            data.score += Math.trunc(score*.7)/2;
            data.save();
        }else if(rank == "(S+)"){
            data.score += parseInt(score)/2;
            data.save();
        }
    }
}).setCriteria("${*}Team Score: ${score} ${rank}");
register("step", () => {
    if(!config.config_display || !World.isLoaded()) return;
    else if(Player.getContainer() !=null && Player.getContainer().getName() == "Catacombs RNG Meter") {
        let score = Player.getContainer().getStackInSlot(all_floors[config.config_floor]);
        if(!score || score == null || !score.getLore() || score.getLore() == null) return;
        else if(score.getLore()[17].includes("selected. Choose one to start")) {
            data.dungeon_score = 0;
            data.dungeon_rng = null;
            data.save();
            return;
        }
        data.dungeon_score = parseInt(score.getLore()[20].split("/")[0].removeFormatting().trim().replace(",",""));
        data.dungeon_rng = score.getLore()[17].removeFormatting();
        data.save();
    }
}).setFps(2);
register("renderOverlay", () => {
    if(!config.config_display || config.config_type == 1 || !World.isLoaded()) return;
    if(data.dungeon_score == 0 || data.dungeon_rng == null) return;
    if (abc.isOpen()) {
        const txt = "Click anywhere to move!"
        Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
    }
    if (!data.dungeon_score && abc.isOpen()) return;
    let dungeons_type = config.config_floor <= 6 ? "Normal_Mode" : "Master_Mode";
    let dung_rng = dungeons_rng[dungeons_type][config.config_floor][data.dungeon_rng];
    if(dung_rng == undefined) {
        data.dungeon_score = 0;
        data.dungeon_rng = null;
        data.save();
        return;
    }
    let floor_colored = config.config_floor <= 6 ? `&a` : `&4`;
    let tscore = data.dungeon_score >= dung_rng ?`&6`:`&7`;
    let rng_progress = ((data.dungeon_score/dung_rng)*100).toFixed(2) > 100 ?"100%":`${((data.dungeon_score/dung_rng)*100).toFixed(2)}%`;
    if(config.config_style==0) {
        Renderer.drawStringWithShadow(`${PREFIX} ${floor_colored}${all_floors_name_full[config.config_floor]}\n&dRNG: ${dungeons_rng.Item_Names[data.dungeon_rng]}\n&dScore: ${tscore}${short_number(data.dungeon_score)}&d/&6${short_number(dung_rng)} ${tscore}(${rng_progress})`, data.x, data.y)
    } else {
        let dung_color = dungeons_type == "Normal_Mode" ? "a" : "c";
        let tscore = data.dungeon_score >= dung_rng ?`&b`:`&7`;
        Renderer.drawStringWithShadow(`&${dung_color}RNG: ${dungeons_rng.Item_Names[data.dungeon_rng]}\n&${dung_color}Score: ${tscore}${short_number(data.dungeon_score)}&7/&b${short_number(dung_rng)} ${tscore}(${rng_progress})`, data.x, data.y)
    }
});
register("worldLoad", () => is_in_floor = false);