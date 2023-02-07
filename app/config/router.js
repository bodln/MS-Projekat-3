const getBaseUrl = () => {
    let url = window.location.toString()
    url = url.split("/")
    while(url[url.length-1] != "app") {
        url.pop()
    }

    return url.join("/")
}

const base = getBaseUrl()

const relativeRoute = {
    multiplier: "/pages/multiplier/multiplier.html",
    multiplierOprimized: "/pages/multiplier-optimized/multiplierOptimized.html",
    divider: "/pages/divider/divider.html",
    dividerOptimized: "/pages/divider-optimised/dividerOptimized.html",
}

const Route = (relativePath) => {
    window.location.replace(base+relativePath)
}

const routeMultiplier = () => {
    Route(relativeRoute.multiplier)
}

const routeMultiplierOptimized = () => {
    Route(relativeRoute.multiplierOprimized)
}

const routeDivider = () => {
    Route(relativeRoute.divider)
}

const routeDividerOptimized = () => {
    Route(relativeRoute.dividerOptimized)
}

export {Route, routeMultiplier, routeMultiplierOptimized, routeDivider, routeDividerOptimized}