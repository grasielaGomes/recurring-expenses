const Modal = {
  activate(){
    document.querySelector('.modal-overlay').classList.toggle('active');
  }
}

const transactions = [
  {
    id: 1,
    description: 'Internet',
    amount: 50000,
    date: '23/08/2021'
  },
  {
    id: 2,
    description: 'Netflix',
    amount: 4000,
    date: '23/08/2021'
  }
];

const Transaction = {
  incomes() {
    return document.getElementById('income-display').value;
  },
  expenses() {
    return transactions.reduce((acc, { amount }) => acc + amount, 0);
  },
  total() {
    return (this.incomes() || 0 ) - this.expenses();
  }
}
Transaction.expenses();

const Utils = {
  formatCurrency (value) {
    let signal = "";
    if(value < 0 ) signal = "-";
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
    return signal + value;
  }
}

const htmlCards = {
  cardTotal: document.querySelector('.total'),
  expense: document.getElementById('expense-display'),
  total: document.getElementById('total-display'),
  changeValueVisibility() {
    if(transactions.length === 0){
      this.expense.classList.toggle('hidden');
      this.total.classList.toggle('hidden');
    }
  },
  updateBalance(){
    this.expense.innerText = Utils.formatCurrency(Transaction.expenses());
    this.total.innerText = Utils.formatCurrency(Transaction.total());
    Transaction.total() < 0 
      ? this.cardTotal.style.backgroundColor = 'var(--custom-pink)'
      : this.cardTotal.style.backgroundColor = 'var(--custom-green'
  }
}

htmlCards.updateBalance();
htmlCards.changeValueVisibility();


const htmlTableElement = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = this.innerHTMLTransaction(transaction);
    this.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction) {
    const amount = Utils.formatCurrency(transaction.amount);
    return `
        <td class="description">${transaction.description}</td>
        <td class="expense">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img src="./src/images/minus.svg" alt="Remover despesa">
        </td>
    `
  }
}



transactions.forEach(t => htmlTableElement.addTransaction(t));