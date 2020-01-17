const key = '501f7e1348222aa1391af5f0ca54da0b'
const token = 'e94e0961cd9a05d783691c9bee72797b43403469804b0bc25649493b8beae640'
const id = '5e1d65ead5ab7432fe711032';

window.onload = function () {
    this.console.log(key)
    this.console.log(token);
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
        getCard(listData[i]['id'],i)
    }
    
    
    
}


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

function getCard(listId,listNumber) {
    fetch(`https://api.trello.com/1/lists/${listId}/cards?fields=id,name,badges,labels&key=${key}&token=${token}`)
    .then((cardData) => {
        return cardData.json()
    }).then((cardData) => {
        console.log(cardData)
        showCard(cardData,listNumber,listId);
    })
}

function showCard (cardData,listNumber,listId) {
    for(let i = 0; i < cardData.length;i++) {
        let fullSec = document.getElementsByClassName('list-each-section')[listNumber];
        let fullCard = document.createElement('div')
        fullCard.setAttribute('class', 'full-card')
        let newDiv = document.createElement('button')
        newDiv.setAttribute('class', 'card-name')
        newDiv.setAttribute('id', `${cardData[i]['id']}`)
        newDiv.setAttribute('onclick','openPopup(this)')
        fullSec.appendChild(fullCard);
        fullCard.appendChild(newDiv);
        let boardHeading = document.createTextNode(`${cardData[i]['name']}`)
        newDiv.appendChild(boardHeading)
        let deleteCard = document.createElement('button')
        deleteCard.setAttribute('class', 'delete-card')
        deleteCard.setAttribute('onclick','deleteSelectCard(this)')
        deleteCard.setAttribute('id', `${cardData[i]['id']}`)
        let deleteText = document.createTextNode('del')
        deleteCard.appendChild(deleteText)
        fullCard.appendChild(deleteCard)
    }
    let fullSec = document.getElementsByClassName('list-each-section')[listNumber];
    let cardInput = document.createElement('input');
    cardInput.setAttribute('class','card-input');
    cardInput.setAttribute('placeholder', 'Add new card')
    cardInput.setAttribute('onkeydown', 'makeNewCard(this)')
    cardInput.setAttribute('id', listId)
    fullSec.appendChild(cardInput)
}

function makeNewCard(newCardName) {
    if(event.key === 'Enter') {
        event.preventDefault()
        let CardName = newCardName.value;
        let thisListId = newCardName.id
        fetch(`https://api.trello.com/1/cards?name=${CardName}&idList=${thisListId}&keepFromSource=all&key=${key}&token=${token}`, { method: 'post' })
        .then((newListData) => {
            return newListData
        }).then((newListData) => {
            console.log(newListData);
        })
    }
}


function deleteSelectCard(clicked) {
    let toDelete = clicked.id;
    console.log(toDelete);
    fetch(`https://api.trello.com/1/cards/${toDelete}?key=${key}&token=${token}`, { method: 'delete' })
    .then((deleted) => {
        return deleted
    }).then((deleted) => {
        console.log(deleted);
    })
}

function openPopup(selected) {
    let selectCard = selected.id;
    document.getElementsByClassName('overlay')[0].style.display = 'block';
    document.getElementsByClassName('checklist-full')[0].style.display = 'block';
    let checklistFull = document.getElementsByClassName('checklist-full')[0]
    let cardHeading = document.createElement('div');
    cardHeading.setAttribute('class', 'card-heading');
    let cardText = document.getElementById(selectCard).innerText;
    cardHeading.innerText = `${cardText}`
    checklistFull.appendChild(cardHeading);
    let checklistInput = document.createElement('input');
    checklistInput.setAttribute('class','checklist-input');
    checklistInput.setAttribute('placeholder', 'Add new checklist')
    checklistInput.setAttribute('onkeydown', 'makeNewCheckList(this)')
    checklistFull.appendChild(checklistInput)
    getChecklistData(selectCard);
}

function getChecklistData(cardId) {
    fetch(`https://api.trello.com/1/cards/${cardId}/checklists?checkItems=all&checkItem_fields=name%2CnameData%2Cpos%2Cstate&filter=all&fields=all&key=${key}&token=${token}`)
    .then((checklistData) => {
        return checklistData.json()
    }).then((checklistData) => {
        console.log(checklistData)
        displayChecklist(checklistData);
    })
}

function displayChecklist(checklistData) {
    
    let checklistFull = document.getElementsByClassName('checklist-full')[0]
    let checklistItems = document.createElement('div') 
    checklistItems.setAttribute('class', 'checklist-items')   
    checklistFull.appendChild(checklistItems)
    // for loop
    for(let i = 0; i < checklistData[0]['checkItems'].length; i++) {
        let eachChecklistItem = document.createElement('div');
        eachChecklistItem.setAttribute('class','checklist-item-full');
        checklistItems.appendChild(eachChecklistItem);
        let checklistBox = document.createElement('input');
        checklistBox.setAttribute('type', 'checkbox');
        checklistBox.setAttribute('class', 'list-checkbox');
        eachChecklistItem.appendChild(checklistBox);
        let checklistText = document.createElement('div');
        checklistText.setAttribute('class', 'checklist-text');
        checklistText.innerText = `${checklistData[0]['checkItems'][i]['name']}`
        eachChecklistItem.appendChild(checklistText);
        let deleteChecklist = document.createElement('button');
        deleteChecklist.setAttribute('class', 'delete-checklist')
        deleteChecklist.setAttribute('onclick', 'deleteChecklistItem(this)');
        let delChecklistText = document.createTextNode('del')
        deleteChecklist.appendChild(delChecklistText)
        eachChecklistItem.appendChild(deleteChecklist);
    }

}

function closePopUp() {
    document.getElementsByClassName('overlay')[0].style.display = 'none';
    document.getElementsByClassName('checklist-full')[0].style.display = 'none';

}