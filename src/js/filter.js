let ids = new Set();

function load() {
    console.dir(localStorage.filteredUsers);
    if (localStorage.filteredUsers) {
        ids = new Set(JSON.parse(localStorage.filteredUsers));
        console.dir(ids);
    }
}
function isFiltered(user) {
    return ids.has(user.id.toString());
}

function isInitial(user) {
    return !ids.has(user.id.toString());
}

const isMatching = (user, chunk) => {
    return (user.first_name.toLowerCase().indexOf(chunk.toLowerCase()) >= 0) ||
        (user.last_name.toLowerCase().indexOf(chunk.toLowerCase()) >= 0);
};

function move(id, from) {
    if (from === 'initial') {
        ids.add(id);
    } else {
        ids.delete(id);
    }
}

function getIds() {
    return ids;
}

module.exports = {
    ids: getIds,
    move: move,
    load: load,
    isFiltered: isFiltered,
    isInitial: isInitial,
    isMatching: isMatching,
};