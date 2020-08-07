interface Video {
    id: string
    owner: {
        ownerType: "user" | "channel"
        id: string
    }
}
interface Lane {
    videoList: Video[]
}

(() => {
    const app = document.getElementById("MatrixRanking-app")
    if (app == null) return
    const appJSON: {lanes: Lane[]} = JSON.parse(app.dataset.app!)

    const observer = new MutationObserver(() => {
        for (const video of appJSON.lanes.flatMap(l => l.videoList)) {
            const elms = document.querySelectorAll(`a[href="/watch/${video.id}"]`)
            for (const elm of elms) {
                const parent = elm.parentElement
                if (parent == null) continue
                parent.dataset.webextUploaderId = video.owner.id
                parent.dataset.webextUploaderType = video.owner.ownerType
            }
        }
    })
    observer.observe(app, {
        childList: true,
        subtree: true,
    })
})()

