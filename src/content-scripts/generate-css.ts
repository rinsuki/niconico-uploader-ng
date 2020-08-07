(() => {
    const style = document.createElement("style")
    style.id = "webext:niconico-uploader-ng:hide-css"
    document.head.appendChild(style)
    async function reload() {
        const uploaderTypes = ["channel", "user"]
        const storage = await browser.storage.local.get(uploaderTypes.map(uploaderType => "ngUploaderIds:" + uploaderType))
        console.log(storage)
        const targets: string[] = []
        for (const uploaderType of uploaderTypes) {
            const ids = storage["ngUploaderIds:" + uploaderType]
            if (!Array.isArray(ids) || ids.length < 1) continue
            targets.push(...ids.map(id => `[data-webext-uploader-type="${uploaderType}"][data-webext-uploader-id="${id}"]`))
        }
        style.innerText = targets.join(",") + "{opacity:0}\n" + targets.map(k => k + ">a").join(",") + "{display:none}"
    }
    browser.storage.onChanged.addListener(reload)
    reload().catch(e => console.error(e))
})()