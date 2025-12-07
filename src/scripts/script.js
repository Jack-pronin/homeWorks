window.onload = function () {
    const form = document.getElementById("form");
    const fullName = document.getElementById("fullName");
    const userName = document.getElementById("userName");
    const email = document.getElementById('email');
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const checkbox = document.getElementById("checkbox");
    const mainButton = document.getElementById("mainButton");
    const popup = document.getElementById("popup");
    const popupButton = document.getElementById("popup__button");
    const link = document.getElementsByClassName("main__account-link")[0];


    const errors = {
        fullName: document.getElementById("fullNameError"),
        userName: document.getElementById("userNameError"),
        email: document.getElementById("emailError"),
        password: document.getElementById("passwordError"),
        confirmPassword: document.getElementById("confirmPasswordError"),
        checkbox: document.getElementById("checkboxError")
    };

    const patterns = {
        fullName: /^[a-zа-яё\s]+$/i,
        userName: /^[a-zа-яё0-9_-]+$/i,
        email: /(\w+@[a-z_]+?\.[a-z]{2,6})$/i,
        password: /^(?=.*[A-ZА-ЯЁ])(?=.*\d)(?=.*[!^?@#$%&.\\]).{8,}$/
    };

    fullName.onkeydown = (e) => {
        let number = parseInt(e.key);
        if (!isNaN(number)) {
            return false;
        }
    }
    userName.onkeydown = (e) => {
        if (e.key === "." || e.key === ",") {
            return false;
        }
    }
    checkbox.onchange = () => {
        if (checkbox.checked) {
            clearError(checkbox);
            console.log("Согласен");
        } else {
            showError(checkbox, 'Нужно согласие с правилами!');
            console.log("Не согласен");
        }
    }

    validateField(fullName, patterns.fullName, 'Full Name может содержать только буквы и пробел');
    validateField(userName, patterns.userName, 'Username может содержать только буквы, цифры, _ и -');
    validateField(email, patterns.email, 'Введите корректный E-mail');
    validateField(password, patterns.password, 'Минимум 8 символов: 1 заглавная, 1 цифра, 1 спецсимвол');
    confirmPassword.oninput = () => clearError(confirmPassword);

    form.addEventListener("submit", errorForm);
    link.addEventListener("click", modalWindow);

    // Окно регистрации
    function modalWindow() {
        form.removeEventListener("submit", errorForm);
        link.removeEventListener("click", modalWindow);
        clearError(userName);
        clearError(password);
        validateField(userName, /.?/, '');
        validateField(password, /.?/, '');

        form.reset();
        popup.style.display = "none";

        document.getElementById("main__title").innerText = "Log in to the system";
        let labels = document.querySelectorAll(".form__label");
        for (let i = 0; i < labels.length; i += 2) {
            labels[i].remove();
        }
        document.getElementsByClassName("form__checkbox")[0].remove();
        mainButton.innerText = "Sign in";
        document.getElementsByClassName("main__account-link")[0].textContent = 'Registration';

        link.addEventListener("click", () => location.reload());
        form.addEventListener("submit", signIn);
    }

    // Обработчик для формы регистрации
    function errorForm(e) {
        e.preventDefault();
        let inputs = document.querySelectorAll(".form__input");
        let count = 0;
        for (let i = 0; i < inputs.length; i++) {
            clearError(inputs[i]);
            if (!inputs[i].value) {
                showError(inputs[i], `Заполните поле ${inputs[i].parentElement.innerText}`);
                count++;
            }
        }
        if (!checkbox.checked) {
            showError(checkbox, 'Нужно согласие с правилами!');
            count++;
        } else {
            clearError(checkbox);
        }
        if (count > 0) return false;

        if (!patterns.fullName.test(fullName.value)) {
            showError(fullName, 'Full Name может содержать только буквы и пробел');
            count++;
        } else {
            clearError(fullName);
        }

        if (!patterns.userName.test(userName.value)) {
            showError(userName, 'Username может содержать только буквы, цифры, _ и -');
            count++;
        } else {
            clearError(userName);
        }

        if (!patterns.email.test(email.value)) {
            showError(email, 'Введите корректный E-mail');
            count++;
        } else {
            clearError(email);
        }

        if (!patterns.password.test(password.value)) {
            showError(password, 'Минимум 8 символов: 1 заглавная, 1 цифра, 1 спецсимвол');
            count++;
        } else {
            clearError(password);
        }

        if (confirmPassword.value !== password.value) {
            showError(confirmPassword, 'Пароли не совпадают');
            count++;
        } else {
            clearError(confirmPassword);
        }

        if (count > 0) return false;

        saveUser();
        popup.style.display = "flex";
        popupButton.onclick = () => {
            modalWindow();
        };
    }

    // Обработчик для формы авторизации
    function signIn(e) {
        e.preventDefault();

        let inputs = document.querySelectorAll(".form__input");
        inputs.forEach((input) => {
            clearError(input);
            if (!input.value) {
                showError(input, `Заполните поле ${input.parentElement.innerText}`);
                return false;
            }
        });

        if (userName.value && password.value) {
            const clients = JSON.parse(localStorage.getItem('clients')) || [];
            for (let client of clients) {

                if (client.userName === userName.value) {
                    clearError(userName);
                    if (client.password === password.value) {
                        userWindow(client.fullName);
                    } else {
                        showError(password, 'Неверный пароль');
                        return false;
                    }
                    break;

                } else {
                    showError(userName, 'Такой пользователь не зарегистрирован');
                }
            }
        }
    }

    // Сохранение пользователя в LocalStorage
    function saveUser() {
        const user = {
            fullName: fullName.value,
            userName: userName.value,
            email: email.value,
            password: password.value
        };

        // Получаем существующий массив или создаем новый
        let clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients.push(user);
        localStorage.setItem('clients', JSON.stringify(clients));
    }

    // Функция показа ошибки
    function showError(element, message) {
        element.parentElement.classList.add('error');
        if (errors[element.id]) {
            errors[element.id].textContent = message;
            errors[element.id].classList.add('error-visible');
        }
    }

    // Функция очистки ошибки
    function clearError(element) {
        element.parentElement.classList.remove('error');
        if (errors[element.id]) {
            errors[element.id].textContent = '';
            errors[element.id].classList.remove('error-visible');
        }
    }

    // Валидация поля в реальном времени
    function validateField(field, pattern, errorMsg) {
        field.addEventListener('input', () => {
            if (!pattern.test(field.value)) {
                showError(field, errorMsg);
            } else {
                clearError(field);
            }
        });
    }

    // Окно для пользователя
    function userWindow(name) {
        form.removeEventListener("submit", signIn);
        document.getElementById("main__title").innerText = `Welcome, ${name}!`;
        document.getElementsByClassName("main__text")[0].remove();
        document.getElementsByClassName("main__account-link")[0].remove();
        let labels = document.querySelectorAll(".form__label");

        for (let i = 0; i < labels.length; i++) {
            labels[i].remove();
        }

        mainButton.innerText = "Exit";
        mainButton.addEventListener("click", () => location.reload());
    }
}
