Hooks.once("init", () => {
    libWrapper.register("door-colors", "DoorControl.prototype.draw", doorColors, "WRAPPER");
});

async function doorColors(wrapped, ...args) {
    const _this = await wrapped(...args);
    const color = this.wall.document.flags["door-colors"]?.color;
    if (color) _this.icon.tint = foundry.utils.Color.from(color);
    return _this;
}

Hooks.on("renderWallConfig", async (wallConfig, html, data) => {
    const wall = wallConfig.object;
    if (!wall.door) return;

    const snippet = await renderTemplate("modules/door-colors/templates/doorColorsSnippet.hbs", data);
    html.find("div.form-group").last().after(snippet);
    wallConfig.activateListeners(html);
    wallConfig.setPosition({height: "auto"});
});

Hooks.on("updateWall", (wallDocument, data, options, userID) => {
    if (wallDocument.door) wallDocument._object.doorControl.draw();
});
