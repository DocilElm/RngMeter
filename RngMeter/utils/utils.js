import { data } from "../index";
export let abc = new Gui()
register("command", () => {
    abc.open();
}).setName("rdisplaychange");
register("dragged", (dx, dy, x, y) => {
    if (!abc.isOpen()) return;
    data.x = x;
    data.y = y;
    data.save();
});
export const short_number = (num) => {
    if(num == undefined) return;
    return num.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export const slayer_gui_names = ["Revenant Horror RNG Meter", "Tarantula Broodfather RNG Meter", "Sven Packmaster RNG Meter", "Voidgloom Seraph RNG Meter", "Inferno Demonlord RNG Meter"]
export const slayer_names = ["Revenant Horror", "Tarantula Broodfather", "Sven Packmaster", "Voidgloom Seraph", "Inferno Demonlord"]
export const slayer_colored_names = ["&aRevenant Horror", "&4Tarantula Broodfather", "&8Sven Packmaster", "&5Voidgloom Seraph", "&6Inferno Demonlord"]
export const slayer_short_names = ["Zombie", "Spider", "Wolf", "Enderman", "Blaze"]