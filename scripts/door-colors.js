import { libWrapper } from '../lib/shim.js';

Hooks.once("init", () => {
    libWrapper.register("door-colors", "DoorControl.prototype.draw", doorColors, "WRAPPER");
});

async function doorColors(wrapped, ...args) {
    const _this = await wrapped(...args);
    const color = this.wall.data.flags["door-colors"]?.color;
    if (color) {
        _this.icon.tint = foundry.utils.colorStringToHex(color);
        _this.icon.alpha = 0.8;
    } else _this.icon.tint = 0xFFFFFF;

    const doorType = this.wall.data.door;
    const doorState = this.wall.data.ds;
    if (doorState !== 2 || doorType !== 2) return _this;
    else {_this.icon.texture = await loadTexture("modules/door-colors/padlock-secret.png")};

    return _this;
}

Hooks.on("renderWallConfig", async (wallConfig, html, data) => {
    if (!data.isDoor) return;

    const snippet = await renderTemplate("modules/door-colors/templates/doorColorsSnippet.hbs", data);
    html.find("div.form-group").last().after(snippet);
    wallConfig.activateListeners(html);
    wallConfig.setPosition({height: "auto"});
});

Hooks.on("updateWall", (wallDocument, data, options, userID) => {
    if (wallDocument.data.door) wallDocument._object.doorControl.draw();
});
