const getLink = key => {
    switch (key) {
        case ``:
        case `home`:
        case 'create':
        case 'inviteFriends':
            return `/${key}`
        default:
            return `badLink`
    }
}

export default getLink
