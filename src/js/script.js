const Modal = {
  activate () {
    document.querySelector('.modal-overlay').classList.toggle('active');
  }
}

const Storage = {
  getIncomes () {
    return localStorage.getItem("recurringExpenses:incomes") || '';
  },
  setIncomes (incomes) {
    localStorage.setItem("recurringExpenses:incomes", incomes);
  },
  getTransactions () {
    return JSON.parse(localStorage.getItem("recurringExpenses:transactions")) || [];
  },
  setTransactions (transactions) {
    localStorage.setItem("recurringExpenses:transactions", JSON.stringify(transactions));
  }
}

const Transaction = {
  all: Storage.getTransactions(),
  add (transaction) {
    this.all.push(transaction);
    Add.reload();
  },
  remove (index) {
    this.all.splice(index, 1);
    Add.reload();
  },
  income () {
    return document.getElementById('income-display').value;
  },
  expenses () {
    return this.all
      .reduce((acc, { amount }) => acc + amount, 0);
  },
  total () {
    return Utils.formatAmount(this.income()) - this.expenses();
  }
}

const htmlCards = {
  cardTotal: document.querySelector('.total'),
  income: document.getElementById('income-display'),
  expense: document.getElementById('expense-display'),
  total: document.getElementById('total-display'),
  changeValueVisibility (condition) {
    if(condition){
      this.expense.classList.remove('hidden');
      this.total.classList.remove('hidden');
    }
  },
  updateBalance () {
    this.income.value = Utils.formatCurrency(Transaction.income());
    this.expense.innerText = Utils.formatCurrency(Transaction.expenses());
    this.total.innerText = Utils.formatCurrency(Transaction.total());
    Utils.changeBgColor(this.cardTotal, Transaction.total() > 0);
  },
  clearIncomeValue () {
    this.income.addEventListener('click', e => e.target.value ='');
  },
  updateIncomeValue () {
    this.income.addEventListener('blur', function (e) {
      let digits = Utils.replaceToDigits(e.target.value);
      let total = parseInt(digits) - Transaction.expenses();
      htmlCards.income.value = Utils.formatCurrency(e.target.value);
      document.getElementById('total-display').innerHTML = Utils.formatCurrency(total);
      Utils.changeBgColor(htmlCards.cardTotal, total >= 0);
      Storage.setIncomes(digits);
      htmlCards.changeValueVisibility(true);
    });
  }
}

const htmlTableElement = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  addTransaction (transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = this.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;
    this.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction (transaction, index) {
    const amount = Utils.formatCurrency(transaction.amount);
    return `
        <td class="description">${transaction.description}</td>
        <td class="expense">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img onclick="Transaction.remove(${index})" src="./src/images/minus.svg" alt="Remover despesa">
        </td>
    `
  },
  clearTransactions () {
    this.transactionsContainer.innerHTML = "";
  }
}

const Form = {
  description: document.querySelector('input#expense-description'),
  amount: document.querySelector('input#expense-amount'),
  date: document.querySelector('input#expense-date'),
  getValues () {
    return {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value
    }
  },
  clearFields () {
    this.description.value = '';
    this.amount.value = '';
    this.date.value = '';
  },
  validateFields () {
    const { description, amount, date } = this.getValues();
    if (description.trim() === "" || amount.trim() === "" || date.trim() === "") throw new Error("Por favor, preencha todos os campos.");
  },
  formatValues () {
    let { description, amount, date } = this.getValues();
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
    return {
      description,
      amount,
      date
    }
  },
  submit (event) {
    try {
      event.preventDefault();
      this.validateFields();
      Transaction.add(this.formatValues());
      htmlCards.changeValueVisibility();
      this.clearFields();
      Modal.activate();
      App.reload();
    } catch (e) {
      const errorMessage = document.querySelector('#form-error');
      errorMessage.innerText = e.message;
      errorMessage.classList.remove('hidden');
      window.setTimeout(() => errorMessage.classList.add('hidden'), 2000);
    }
  }
}

const Utils = {
  formatCurrency (value) {
    let signal = "";
    if (value < 0) signal = "-";
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
    return signal + value;
  },
  formatAmount (value) {
    value = this.replaceToDigits(value);
    return Number(value);
  },
  formatDate (value) {
    const splittedDate = value.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
  changeBgColor (element, condition) {
    if (condition) element.style.backgroundColor = 'var(--custom-green)';
    else element.style.backgroundColor = 'var(--custom-pink)';
  },
  replaceToDigits (value) {
    return value.replace(/\D/g, "");
  }
}

const Add = {
  init () {
    Transaction.all.forEach((transaction, index) => htmlTableElement.addTransaction(transaction, index));
    htmlCards.clearIncomeValue();
    htmlCards.updateIncomeValue();
    htmlCards.updateBalance();
    Storage.setTransactions(Transaction.all);
    htmlCards.changeValueVisibility(Storage.getTransactions().length > 0);
  },
  reload () {
    htmlTableElement.clearTransactions();
    Add.init();
  }
}

Add.init();




