const id = '5e1d65ead5ab7432fe711032';

window.onload = function () {
    showBoard();
    this.getList()
}

// gets the name of the board
function showBoard() {
    fetch(`https://api.trello.com/1/boards/${id}?actions=all&boardStars=none&cards=none&card_pluginData=false&checklists=none&customFields=false&fields=name%2Cdesc%2CdescData%2Cclosed%2CidOrganization%2Cpinned%2Curl%2CshortUrl%2Cprefs%2ClabelNames&lists=open&members=none&memberships=none&membersInvited=none&membersInvited_fields=all&pluginData=false&organization=false&organization_pluginData=false&myPrefs=false&tags=false&key=${key}&token=${token}`)
    .then((boardData) => {
        return boardData.json()
    }).then((boardData) => {
        boardName(boardData)
        console.log(boardData['name']);
        console.log(boardData['id']);
    })
}

// displays the board name
function boardName(boardData) {
    let boards = document.getElementById('boards');
    let newSpan = document.createElement('span');
    newSpan.setAttribute('class','board-name')
    let boardHeading = document.createTextNode(`${boardData['name']}`)
    newSpan.appendChild(boardHeading);
    boards.appendChild(newSpan);
}

// to make a list-heading

function getList() {
    fetch(`https://api.trello.com/1/boards/${id}/lists/all?key=${key}&token=${token}`)
    .then((listData) => {
        return listData.json()
    }).then((listData) => {
        makeList(listData)
        console.log(listData)
    })
}

function  makeList(listData) {
    for(let i = 0; i < listData.length;i++) {
        let listFull = document.getElementsByClassName('list-full')[0];
        let listSection = document.createElement('div');
        listSection.setAttribute('class','list-each-section');
        listFull.appendChild(listSection)
        let listHeading = document.createElement('div');
        listHeading.setAttribute('class','list-heading');
        // listHeading[0].createTextNode(`${listData[0]['name']}`)
        listSection.appendChild(listHeading);
        listHeading.innerText = `${listData[i]['name']}`
        getCard(listData[i]['id'])
    }
    
    
    
}

// check how to make a post
// function makeCard() {
//     https://api.trello.com/1/cards?key=501f7e1348222aa1391af5f0ca54da0b&token=e94e0961cd9a05d783691c9bee72797b43403469804b0bc25649493b8beae640&name=hope it works&pos=top&idList=5e1db1038b4058084050f7b3&keepFromSource=all    
// }

async function postList() {
    if(event.key === 'Enter') {
        event.preventDefault()
        let newListName = document.getElementsByClassName('add-list')[0].value;
        await fetch(`https://api.trello.com/1/lists?key=${key}&token=${token}&name=${newListName}&idBoard=${id}`, { method: 'post' })
        .then((newListData) => {
            return newListData
        }).then((newListData) => {
            console.log(newListData);
        })
    }
}

function getCard(listId) {
    fetch(`https://api.trello.com/1/lists/${listId}/cards?fields=id,name,badges,labels&key=${key}&token=${token}`)
    .then((cardData) => {
        return cardData.json()
    }).then((cardData) => {
        showCard(cardData);
        console.log(cardData)
    })
}

function showCard (cardData) {
    
}