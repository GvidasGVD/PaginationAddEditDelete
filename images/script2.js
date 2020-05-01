const UI = {
    pavadinimasInput: document.querySelector('input#Pavadinimas'),
    vienetoKainaInput: document.querySelector('input#VienetoKaina'),
    kiekisInput: document.querySelector('input#Kiekis'),
    addButton: document.querySelector('button.addTask'),
    goodsTable: document.querySelector('table tbody')
};

// Model
const goods = [];
const esamiProduktai = [];

class Item {
    constructor(pavadinimas, kaina, kiekis) {
        this.name = pavadinimas;
        this.price = kaina;
        this.amount = kiekis;
        this.checked = false;
    }
    priceWithoutPvm() {
        return this.price * 0.79;
    }
    totalAmount() {
        return this.amount * this.price;
    }
    checkingTheRow() {
        this.checked = true;
        console.log(goods);
    }
}
// Controller

//
function drawTable() {
    UI.goodsTable.innerHTML = '';

    for (let good of goods) {
        UI.goodsTable.innerHTML += `
        <tr>
            <td class='editableName'>${good.name}</td>
            <td>${(good.priceWithoutPvm()).toFixed(2)}</td>
            <td class='editablePrice'>${good.price}</td>
            <td class='editableAmount'>${good.amount}</td> 
            <td>${(good.totalAmount()).toFixed(2)}</td> 
            <td><input type="checkbox" class='checkBox'></td>
            <td><label class='editLabel' onclick='editRow();'><input type="radio" class='radioBtn' name='radio'>Edit</label></td> 
        </tr>
        `;
    }
}

function deleteRow() {
    var deletedRows = 0,
        maxLength = goods.length;
    for (let i = 0; i < maxLength; i++) {
        if (document.getElementsByClassName('checkBox')[i].checked) {
            goods.splice(i - deletedRows, 1);
            esamiProduktai.splice(i - deletedRows, 1);
            deletedRows++;
        }
    }
    drawTable();
}

var elementoEile;
function editRow() {
    let allEditLabels = document.getElementsByClassName("editLabel");
    for (let a = 0; a < allEditLabels.length; a++) {
        allEditLabels[a].style.display = 'none';
    }
    document.getElementById('addBtn').style.display = 'none';
    document.getElementById('deleteBtn').style.display = 'none';
    for (let i = 0; i < goods.length; i++) {
        if (document.getElementsByClassName('radioBtn')[i].checked) {
            console.log(goods[i]);
            document.getElementById('okBtn').style.display = 'block';
            UI.pavadinimasInput.value = goods[i].name;
            UI.vienetoKainaInput.value = goods[i].price;
            UI.kiekisInput.value = goods[i].amount;
            elementoEile = i;
        }
    }
}

function editConfirmation() {
    let allEditLabels = document.getElementsByClassName("editLabel");
    for (let a = 0; a < allEditLabels.length; a++) {
        allEditLabels[a].style.display = 'block';
    }
    document.getElementById('addBtn').style.display = 'block';
    document.getElementById('deleteBtn').style.display = 'block';
    goods[elementoEile].name =  UI.pavadinimasInput.value;
    goods[elementoEile].price =  UI.vienetoKainaInput.value;
    goods[elementoEile].amount =  UI.kiekisInput.value;
    esamiProduktai[elementoEile] =  UI.pavadinimasInput.value;
    document.getElementById('okBtn').style.display = 'none';
    drawTable();
    deleteInput();
}

UI.addButton.addEventListener('click', () => {
    if (UI.pavadinimasInput.value === '' || UI.vienetoKainaInput.value === '' || UI.kiekisInput.value === '') {
        alert('Suveskite visus laukelius');
        return;
    }
    if (!checkForProductInWarehouse()) {
        esamiProduktai.push(UI.pavadinimasInput.value);
        goods.push(new Item(UI.pavadinimasInput.value, UI.vienetoKainaInput.value, UI.kiekisInput.value));
    } else {
        goods[prekesIndeksas].amount = parseInt(goods[prekesIndeksas].amount) + parseInt(UI.kiekisInput.value);
    }
    drawTable();
    deleteInput();
});

var prekesIndeksas;
function checkForProductInWarehouse() {
    var prekesPavadinimas = UI.pavadinimasInput.value.toString();

    if (esamiProduktai.includes(prekesPavadinimas)) {
        prekesIndeksas = esamiProduktai.indexOf(prekesPavadinimas);
        return true;
    } else {
        return false;
    }
}

function deleteInput() {
    UI.pavadinimasInput.value = '';
    UI.vienetoKainaInput.value = '';
    UI.kiekisInput.value = '';
}
