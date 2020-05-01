var elementsRow,
    currentRowsItemName,
    rowsPerPage = 3,
    currentPage = 1,
    itemsIndex;

//UI Object with a collection of named values
const UI = {
    nameInput: document.querySelector('input#Name'),
    itemPriceInput: document.querySelector('input#Price'),
    amountInput: document.querySelector('input#Quantity'),
    addButton: document.querySelector('button.addTask'),
    goodsTable: document.querySelector('table tbody'),
    paginationList: document.querySelector('ul.paginationList'),
    okButton: document.getElementById('okBtn'),
    allEditLabels: document.getElementsByClassName('editLabel'),
    allrubbishBoxes: document.getElementsByClassName('rubbishBox'),
    pageRange: document.getElementById('numberOfRows'),
};

// Model
const goods = []; //Array of items;
const itemsInWarehouse = []; //Array of itmes' names - created mainly for using "Includes"

class Item {
    constructor(name, price, amount) {
        this.name = name;
        this.price = price;
        this.amount = amount;
        this.checked = false;
    }
    priceWithoutPvm() {
        return this.price * 0.79;
    }
    totalAmount() {
        return this.amount * this.price;
    }
}

function drawTable(page = 1) {

    UI.paginationList.innerHTML = '';
    UI.goodsTable.innerHTML = '';
    rowsPerPage = $("#numberOfRows option:selected").val()
    let quantumLevel = Math.floor((goods.length - 1) / rowsPerPage);

    page = (quantumLevel + 1 < page)? quantumLevel + 1 : page;
    
    for (let a = 1; a <= quantumLevel + 1; a++) {
        UI.paginationList.innerHTML += ` 
        <li onclick='drawTable(${a});'>${a}</li>`;
    }

    if(goods.length == 0){
        return;
    }
    for (let i = page * rowsPerPage - rowsPerPage; i < rowsPerPage * page; i++) {
        if (i > goods.length - 1) {
            break;
        }
        UI.goodsTable.innerHTML += `

        <tr>
            <td class='editableName'>${goods[i].name}</td>
            <td>${(goods[i].priceWithoutPvm()).toFixed(2)}</td>
            <td class='editablePrice'>${goods[i].price}</td>
            <td class='editableAmount'>${goods[i].amount}</td> 
            <td>${(goods[i].totalAmount()).toFixed(2)}</td> 
            <td><img class='rubbishBox' src='images/rubbishBox.png' onclick='deleteRow(${i});'></td>
            <td><label class='editLabel' onclick='editRow(${i});'><input type="radio" class='radioBtn' name='radio'>Edit</label></td> 
        </tr>
        `;
    }
}

function deleteRow(row) {

    goods.splice(row, 1);
    itemsInWarehouse.splice(row, 1);

    let rowsPerPage = $("#numberOfRows option:selected").val(),
        quantumLevel = Math.floor(row/ rowsPerPage),
        setPage = quantumLevel+1;

    drawTable(setPage);

}

// Edit button Click
function editRow(row) {

    for (let a = 0; a < UI.allEditLabels.length; a++) {
        UI.allEditLabels[a].style.display = 'none';
        UI.allrubbishBoxes[a].style.display = 'none';

    }

    UI.paginationList.style.display = 'none';
    UI.pageRange.style.display = 'none';
    UI.addButton.style.display = 'none';
    UI.okButton.style.display = 'block';
    UI.nameInput.value = goods[row].name;
    UI.itemPriceInput.value = goods[row].price;
    UI.amountInput.value = goods[row].amount;

    currentRowsItemName = goods[row].name;
    elementsRow = row;

}

//After OK button Click
function editConfirmation() {

    if (UI.nameInput.value === '' || UI.itemPriceInput.value === '' || UI.amountInput.value === '') {
        alert('Please fill inn all fields');
    }
    else {
        let itemName = UI.nameInput.value.toString();

        if (itemsInWarehouse.includes(itemName) && itemName != currentRowsItemName) {
            itemsIndex = itemsInWarehouse.indexOf(itemName);
            UI.nameInput.value = currentRowsItemName;
            alert(`Item already exists (${itemsIndex + 1} row). Please adjust the existing one instead of adding a duplicate.`);
        }else {
            for (let a = 0; a < UI.allEditLabels.length; a++) {
                UI.allEditLabels[a].style.display = 'block';
                UI.allrubbishBoxes[a].style.display = 'block';
            }

            UI.pageRange.style.display = 'block';
            UI.paginationList.style.display = 'flex';
            UI.addButton.style.display = 'block';
            UI.okButton.style.display = 'none';

            goods[elementsRow].name = UI.nameInput.value;
            goods[elementsRow].price = UI.itemPriceInput.value;
            goods[elementsRow].amount = UI.amountInput.value;
            itemsInWarehouse[elementsRow] = UI.nameInput.value;
            
            drawTable(currentPage);
            deleteInput();

        }  
    }
}

UI.addButton.addEventListener('click', () => {

    if (UI.nameInput.value === '' || UI.itemPriceInput.value === '' || UI.amountInput.value === '') {
        alert('Fill in all fields');
        return;
    }
    if (!isProductInWarehouse()) {
        itemsInWarehouse.push(UI.nameInput.value);
        goods.push(new Item(UI.nameInput.value, UI.itemPriceInput.value, UI.amountInput.value));
    } else {
        goods[itemsIndex].amount = parseInt(goods[itemsIndex].amount) + parseInt(UI.amountInput.value);
    }


    let rowsPerPage = $("#numberOfRows option:selected").val(),
        quantumLevel = Math.floor((goods.length - 1) / rowsPerPage),
        currentPage = quantumLevel+1;

    drawTable(currentPage);
    deleteInput();

});


function isProductInWarehouse() {

    let itemName = UI.nameInput.value.toString();

    if (itemsInWarehouse.includes(itemName)) {
        itemsIndex = itemsInWarehouse.indexOf(itemName);
        return true;
    } else {
        return false;
    }
}

function deleteInput() {

    UI.nameInput.value = '';
    UI.itemPriceInput.value = '';
    UI.amountInput.value = '';

}
