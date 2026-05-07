const form = document.getElementById('expenseForm');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');

const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionList = document.getElementById('transactionList');
const clearAllBtn = document.getElementById('clearAll');

let transactions =
  JSON.parse(localStorage.getItem('transactions')) || [];

function saveTransactions() {
  localStorage.setItem(
    'transactions',
    JSON.stringify(transactions)
  );
}

function updateUI() {

  transactionList.innerHTML = '';

  if (transactions.length === 0) {

    transactionList.innerHTML = `
      <div class="empty">
        <h3>No Transactions Yet</h3>
        <p>Add your first income or expense.</p>
      </div>
    `;
  }

  let income = 0;
  let expense = 0;

  transactions.forEach((transaction, index) => {

    const item = document.createElement('div');

    item.classList.add(
      'transaction',
      transaction.type
    );

    item.innerHTML = `
      <div class="transaction-left">
        <h4>${transaction.text}</h4>
        <p>${transaction.type.toUpperCase()}</p>
      </div>

      <div class="transaction-right">

        <span class="transaction-amount">
          ${transaction.type === 'income' ? '+' : '-'}
          ₹${transaction.amount}
        </span>

        <button
          class="delete-btn"
          onclick="deleteTransaction(${index})"
        >
          ✕
        </button>

      </div>
    `;

    transactionList.appendChild(item);

    if (transaction.type === 'income') {
      income += Number(transaction.amount);
    } else {
      expense += Number(transaction.amount);
    }
  });

  const balance = income - expense;

  balanceEl.innerText =
    `₹${balance.toLocaleString()}`;

  animateValue(incomeEl, income, '+ ₹');
  animateValue(expenseEl, expense, '- ₹');
}

function animateValue(element, value, prefix = '₹') {

  let start = 0;

  const duration = 600;
  const increment = value / (duration / 16);

  clearInterval(element.counter);

  element.counter = setInterval(() => {

    start += increment;

    if (
      (increment > 0 && start >= value) ||
      (increment < 0 && start <= value)
    ) {

      start = value;
      clearInterval(element.counter);
    }

    element.innerText =
      `${prefix}${Math.floor(start).toLocaleString()}`;

  }, 16);
}

form.addEventListener('submit', (e) => {

  e.preventDefault();

  const text = textInput.value.trim();
  const amount = amountInput.value.trim();
  const type = typeInput.value;

  if (!text || !amount) return;

  const transaction = {
    text,
    amount: Number(amount),
    type
  };

  transactions.unshift(transaction);

  saveTransactions();
  updateUI();

  form.reset();
});

function deleteTransaction(index) {

  transactions.splice(index, 1);

  saveTransactions();
  updateUI();
}

clearAllBtn.addEventListener('click', () => {

  transactions = [];

  saveTransactions();
  updateUI();
});

updateUI();