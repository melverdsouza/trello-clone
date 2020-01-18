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
            reload();
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
            reload();
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
        reload()
    })
}

function openPopup(selected) {
    let selectCard = selected.id;
    document.getElementsByClassName('overlay')[0].style.display = 'block';
    document.getElementsByClassName('checklist-full')[0].style.display = 'block';
    let checklistFull = document.getElementsByClassName('checklist-full')[0]
    let headingFull = document.createElement('div');
    headingFull.setAttribute('class', 'heading-full')
    let cardHeading = document.createElement('div');
    cardHeading.setAttribute('class', 'card-heading');
    let cardText = document.getElementById(selectCard).innerText;
    cardHeading.innerText = `${cardText}`
    let closeChecklist = document.createElement('button');
    closeChecklist.setAttribute('class', 'close-checklist')
    closeChecklist.setAttribute('onclick', 'closePopUp()')
    closeChecklist.innerText = `X`
    checklistFull.appendChild(headingFull);
    headingFull.appendChild(cardHeading);
    headingFull.appendChild(closeChecklist)
    let checklistInput = document.createElement('input');
    checklistInput.setAttribute('class','checklist-input');
    checklistInput.setAttribute('id', selectCard)
    checklistInput.setAttribute('placeholder', 'Add new checklist')
    checklistInput.setAttribute('onkeydown', 'getCheckListId(this)')
    checklistFull.appendChild(checklistInput)
    getChecklistData(selectCard);
}

function getChecklistData(selectCard) {
    fetch(`https://api.trello.com/1/cards/${selectCard}/checklists?checkItems=all&checkItem_fields=name%2CnameData%2Cpos%2Cstate&filter=all&fields=all&key=${key}&token=${token}`)
    .then((checklistData) => {
        return checklistData.json()
    }).then((checklistData) => {
        console.log(checklistData)
        displayChecklist(checklistData,selectCard);
    })
}

function displayChecklist(checklistData,selectCard) {
    let checklistFull = document.getElementsByClassName('checklist-full')[0];
    let checklistHeadFull = document.createElement('div');
    checklistHeadFull.setAttribute('class', 'checklist-head-full');
    checklistFull.appendChild(checklistHeadFull)
    let checklistHead = document.createElement('div');
    checklistHead.setAttribute('class', 'checklist-head');
    let checklistHeadText = document.createTextNode(`${checklistData[0]['name']}`);
    checklistHead.appendChild(checklistHeadText);
    checklistHeadFull.appendChild(checklistHead);
    let checklistHeadDelete = document.createElement('button');
    let del = document.createTextNode('del');
    checklistHeadDelete.appendChild(del)
    checklistHeadDelete.setAttribute('class', 'del')
    checklistHeadDelete.setAttribute('id', `${checklistData[0]['id']}`)
    checklistHeadDelete.setAttribute('onclick', 'deleteChecklist(this)')
    checklistHeadFull.appendChild(checklistHeadDelete)
    let checklistItemInput = document.createElement('input')
    checklistItemInput.setAttribute('type', 'text');
    checklistItemInput.setAttribute('placeholder', 'Add checklist item')
    checklistItemInput.setAttribute('onkeydown', 'addChecklistItem(this)')
    checklistItemInput.setAttribute('id', `${checklistData[0]['id']}`)
    checklistItemInput.setAttribute('class', 'checklist-item-input')
    checklistFull.appendChild(checklistItemInput);
    // let checklistItemFull = document.createElement('div');
    // checklistFull.appendChild(checklistItemFull);
    
}

function getCheckListId(inputValue) {
    if(event.key === 'Enter') {
        let newChecklist = inputValue.value
        let thisCardId = inputValue.id
        console.log(newChecklist)
        console.log(thisCardId)
        getChecklist(thisCardId,newChecklist)
        // checklistReload(cardNum)
    }
}

function getChecklist(thisCardId, newChecklist) {
    fetch(`https://api.trello.com/1/checklists?idCard=${thisCardId}&name=${newChecklist}&pos=top&key=${key}&token=${token}`, { method: 'post' })
        .then((newListData) => {
            return newListData
        }).then((newListData) => {
            console.log(newListData);
            // postChecklist(newListData[0]['id'])
        })
}




// function deleteChecklistItem(delList) {
//     let toDelListItem = delList.id
//     let toDelList = document.getElementById(toDelListItem).parentElement.id;
//     fetch(`https://api.trello.com/1/checklists/${toDelList}/checkItems/${toDelListItem}?key=${key}&token=${token}`, { method: 'delete' })
//         .then((newListData) => {
//             return newListData
//         }).then((newListData) => {
//             console.log(newListData);
//             checklistReload();
//         })
// }

function closePopUp() {
    document.getElementsByClassName('overlay')[0].style.display = 'none';
    document.getElementsByClassName('checklist-full')[0].style.display = 'none';
    fullChecklistReload();
}

function reload() {
    let checkChild = document.getElementsByClassName('list-full')[0]
    while(checkChild.firstChild) {
        checkChild.removeChild(checkChild.firstChild)
    }
    document.getElementsByClassName('board-name')[0].remove();
    showBoard();
    this.getList()
}

function checklistReload(thisCardId) {
    let checklistChild = document.getElementsByClassName('checklist-full')[0]
    while(checklistChild.firstChild) {
        checklistChild.removeChild(checklistChild.firstChild)
    }
    let unique = document.getElementsByClassName('card-name')
    closePopUp()
    
    for(let i = 0; i < unique.length;i++) {
        if(unique[i].id === thisCardId) {
            unique[i].click()
        }
    }
}

function fullChecklistReload() {
    let checklistChild = document.getElementsByClassName('checklist-full')[0]
    while(checklistChild.firstChild) {
        checklistChild.removeChild(checklistChild.firstChild)
    }
}