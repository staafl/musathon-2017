const getLink = key => {
    switch (key) {
        case ``:
        case `home`:
        case 'chooseSong':
        case 'room':
            return `/${key}`
        default:
            return `badLink`
    }
}

export default getLink
