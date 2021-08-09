const Modal = {
  activate () {
    document.querySelector('.modal-overlay').classList.toggle('active');
  }
}

const Transaction = {
  all: [
    {
      description: 'Internet',
      amount: 50000,
      date: '23/08/2021'
    },
    {
      description: 'Netflix',
      amount: 4000,
      date: '23/08/2021'
    }
  ],
  income: document
    .getElementById('income-display'),
  add(transaction) {
    this.all.push(transaction);
    Add.reload();
  },
  remove(index){
    this.all.splice(index, 1);
    App.reload();
  },
  expenses() {
    return this.all
      .reduce((acc, { amount }) => acc + amount, 0);
  },
  total() {
    return this.income.value - this.expenses();
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
  changeBgColor (element, condition) {
    if (condition) element.style.backgroundColor = 'var(--custom-green)';
    else element.style.backgroundColor = 'var(--custom-pink)';
  }
}

const htmlCards = {
  cardTotal: document.querySelector('.total'),
  expense: document.getElementById('expense-display'),
  total: document.getElementById('total-display'),
  changeValueVisibility () {
    if (Transaction.all.length === 0) {
      this.expense.classList.toggle('hidden');
      this.total.classList.toggle('hidden');
    }
  },
  updateBalance () {
    this.expense.innerText = Utils.formatCurrency(Transaction.expenses());
    this.total.innerText = Utils.formatCurrency(Transaction.total());
    Utils.changeBgColor(this.cardTotal, Transaction.total() > 0);
  },
  getIncomeValue() {
    Transaction.income.addEventListener('blur', function (e) {
      let digits = e.target.value.replace(/\D/g, "");
      let total = parseInt(digits) - Transaction.expenses();
      Transaction.income.value = Utils.formatCurrency(e.target.value);
      document.getElementById('total-display').innerHTML = Utils.formatCurrency(total);
      Utils.changeBgColor(htmlCards.cardTotal, total >= 0);
    });
  }
}

const htmlTableElement = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  addTransaction (transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = this.innerHTMLTransaction(transaction);
    this.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction (transaction) {
    const amount = Utils.formatCurrency(transaction.amount);
    return `
        <td class="description">${transaction.description}</td>
        <td class="expense">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img src="./src/images/minus.svg" alt="Remover despesa">
        </td>
    `
  },
  clearTransactions() {
    this.transactionsContainer.innerHTML = "";
  }
}

const Form = {
  description: document.querySelector('input#expense-description'),
  amount: document.querySelector('input#expense-amount'),
  date: document.querySelector('input#expense-date'),
  validateFields(){},
  formatData(){},
  submit(event){
    event.preventDefault();
    this.validateFields();
    this.formatData();
  }
}

const Add = {
  init(){
    Transaction.all.forEach(t => htmlTableElement.addTransaction(t));
    htmlCards.updateBalance();
    htmlCards.changeValueVisibility();
    htmlCards.getIncomeValue();
  },
  reload(){
    htmlTableElement.clearTransactions();
    Add.init();
  }
}

Add.init();

Transaction.add({
  description: 'TV a cabo',
  amount: 53000,
  date: '23/08/2021'
});



