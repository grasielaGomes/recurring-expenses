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
    //pegar as entradas
  },
  expenses() {
    //somar as saidas
  },
  total() {
    //entradas - saidas
  }
}

const htmlObj = {
  transactionsContainer: document.querySelector('.data-table tbody'),
  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = this.innerHTMLTransaction(transaction);
    this.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction) {
    return `
        <td class="description">${transaction.description}</td>
        <td class="expense">${transaction.amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img src="./src/images/minus.svg" alt="Remover despesa">
        </td>
    `
  }
}