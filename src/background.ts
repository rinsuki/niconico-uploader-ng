browser.menus.create({
    id: "add-ng-user",
    title: "この動画の投稿者をNGに追加",
    contexts: ["link"],
    documentUrlPatterns: ["https://www.nicovideo.jp/ranking", "https://www.nicovideo.jp/ranking?*"],
    targetUrlPatterns: ["https://www.nicovideo.jp/watch/*"],
    async onclick(info, tab) {
        // 動画IDを取得
        const videoIdRegEx = info.linkUrl?.match(/\/watch\/(([a-z]{2})?[0-9]+)/)
        if (videoIdRegEx == null) return
        const videoId = videoIdRegEx[1]
        // 投稿者情報を取得
        const res: {webextUploaderId?: string, webextUploaderType?: string} = await browser.tabs.executeScript(tab.id, {
            frameId: info.frameId,
            code: `Object.assign({}, document.querySelector(${JSON.stringify(`a[href^="https://www.nicovideo.jp/watch/${videoId}"]`)}).parentElement.dataset)`
        }).then(o => o[0])
        console.log(res)
        if (res.webextUploaderId == null || res.webextUploaderType == null) return console.log("res invalid")
        const uploaderId = res.webextUploaderId
        const uploaderType = res.webextUploaderType
        // NGに追加
        const storageKey = "ngUploaderIds:" + uploaderType
        const current = (await browser.storage.local.get(storageKey))[storageKey] as string[] ?? []
        console.log(current)
        if (current.includes(uploaderId)) return // もうある
        await browser.storage.local.set({
            [storageKey]: [...current, uploaderId],
        })
    }
})