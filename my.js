document.addEventListener("DOMContentLoaded", function () {
  const transactionsList = document.getElementById("transactionsList");
  const accountsList = document.getElementById("accountsList");
  const accountSelect = document.getElementById("accountSelect");
  const changeAmountInput = document.getElementById("changeAmount");
  const balanceForm = document.getElementById("balanceForm");
  const accountForm = document.getElementById("accountForm");
  const transactionForm = document.getElementById("transactionForm");
  const transactionTypeSelect = document.getElementById("transactionType");
  const transactionCategorySelect = document.getElementById(
    "transactionCategory"
  );
  const transactionAmountInput = document.getElementById("transactionAmount");
  const transactionAccountSelect =
    document.getElementById("transactionAccount");
  const transactionCommentInput = document.getElementById("transactionComment");
  const transactionDateInput = document.getElementById("transactionDate");

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let accounts = JSON.parse(localStorage.getItem("accounts")) || [
    { id: "account1", name: "Счет 1", balance: 0 },
    { id: "account2", name: "Счет 2", balance: 0 },
    { id: "account3", name: "Счет 3", balance: 0 },
  ];

  function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  function saveAccounts() {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }

  function updateAccountSelect() {
    accountSelect.innerHTML = "";
    accounts.forEach(function (account) {
      const option = document.createElement("option");
      option.value = account.id;
      option.textContent = account.name;
      accountSelect.appendChild(option);
      const transactionAccountOption = document.createElement("option");
      transactionAccountOption.value = account.id;
      transactionAccountOption.textContent = account.name;
      transactionAccountSelect.appendChild(transactionAccountOption);
    });
  }

  function displayAccounts() {
    accountsList.innerHTML = "";
    accounts.forEach(function (account) {
      const li = document.createElement("li");
      li.textContent = `${account.name}: ${account.balance} злотых`;
      accountsList.appendChild(li);
    });
  }

  function updateBalance(accountId, changeAmount) {
    const account = accounts.find((acc) => acc.id === accountId);
    account.balance += parseFloat(changeAmount);
    saveAccounts();
    displayAccounts();
  }

  function displayTransactions() {
    transactionsList.innerHTML = "";
    transactions.forEach(function (transaction) {
      const transactionElement = document.createElement("div");
      transactionElement.classList.add("transaction");
      transactionElement.innerHTML = `
                <strong>${
                  transaction.type === "income" ? "Доход" : "Расход"
                }</strong>: ${transaction.amount} злотых (${
        transaction.category
      }) [${transaction.account}]
                <br>Комментарий: ${transaction.comment}
                <br>Дата: ${transaction.date}
            `;
      transactionsList.appendChild(transactionElement);
    });
  }

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let day = now.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    return `${year}-${month}-${day}`;
  }

  function resetTransactionForm() {
    transactionAmountInput.value = "";
    transactionCategorySelect.value = ""; // Очищаем выбранную категорию
    transactionAccountSelect.value = ""; // Очищаем выбранный счет
    transactionCommentInput.value = "";
    transactionDateInput.value = getCurrentDate(); // Устанавливаем текущую дату
  }

  // Устанавливаем категорию "Зарплата" по умолчанию при загрузке страницы
  transactionCategorySelect.innerHTML = `
        <option value="Зарплата">Зарплата</option>
        <option value="Подарок">Подарок</option>
        <option value="Другое">Другое</option>
    `;
  transactionCategorySelect.value = "Зарплата";

  transactionTypeSelect.addEventListener("change", function () {
    const selectedType = transactionTypeSelect.value;
    if (selectedType === "income") {
      transactionCategorySelect.innerHTML = `
                <option value="Зарплата">Зарплата</option>
                <option value="Подарок">Подарок</option>
                <option value="Другое">Другое</option>
            `;
    } else if (selectedType === "expense") {
      transactionCategorySelect.innerHTML = `
                <option value="Продукты">Продукты</option>
                <option value="Дорога">Дорога</option>
                <option value="Развлечение">Развлечение</option>
                <option value="Здоровье">Здоровье</option>
                <option value="Пополнение телефона">Пополнение телефона</option>
                <option value="Семья">Семья</option>
                <option value="Спорт">Спорт</option>
                <option value="Подарки">Подарки</option>
                <option value="Дом">Дом</option>
                <option value="Образование">Образование</option>
                <option value="Другое">Другое</option>
            `;
    }
  });

  transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const transactionType = transactionTypeSelect.value;
    const transactionAmount = parseFloat(transactionAmountInput.value);
    const transactionCategory = transactionCategorySelect.value;
    const transactionAccount = transactionAccountSelect.value;
    const transactionComment = transactionCommentInput.value;
    const transactionDate = transactionDateInput.value || getCurrentDate();

    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      alert("Пожалуйста, введите корректную сумму транзакции.");
      return;
    }

    const transaction = {
      type: transactionType,
      amount: transactionAmount,
      category: transactionCategory,
      account: transactionAccount,
      comment: transactionComment,
      date: transactionDate,
    };

    transactions.push(transaction);
    saveTransactions();
    displayTransactions();
    updateBalance(
      transactionAccount,
      transactionType === "income" ? transactionAmount : -transactionAmount
    );

    resetTransactionForm();
  });

  balanceForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const accountId = accountSelect.value;
    const changeAmount = parseFloat(changeAmountInput.value);

    if (isNaN(changeAmount)) {
      alert("Пожалуйста, введите корректную сумму для изменения баланса.");
      return;
    }

    updateBalance(accountId, changeAmount);

    changeAmountInput.value = "";
  });

  accountForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newAccountName = document
      .getElementById("newAccountName")
      .value.trim();
    if (newAccountName === "") {
      alert("Пожалуйста, введите название нового счета.");
      return;
    }

    const newAccountId = "account" + (accounts.length + 1);
    const newAccount = {
      id: newAccountId,
      name: newAccountName,
      balance: 0,
    };

    accounts.push(newAccount);
    saveAccounts();
    updateAccountSelect();
    displayAccounts();

    document.getElementById("newAccountName").value = "";
  });

  updateAccountSelect();
  displayAccounts();
  displayTransactions();
});
