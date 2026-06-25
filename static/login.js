// Обработка отправки формы на бэкенд Flask
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const card = document.querySelector('.auth-container');

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput
            })
        });

        const result = await response.json();

        if (result.success) {
            errorMessage.textContent = "";
            window.location.href = result.redirect;
        } else {
            errorMessage.textContent = result.message;
            card.classList.add('shake');
            setTimeout(() => card.classList.remove('shake'), 500);
        }
    } catch (error) {
        errorMessage.textContent = "Ошибка сервера. Попробуйте позже.";
        console.error("Ошибка авторизации:", error);
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
    }
});

// Логика переключения режима скрытия пароля
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.classList.add('hidden-mode'); // Навешиваем класс для отображения креста поверх глаза
    } else {
        passwordInput.type = 'password';
        this.classList.remove('hidden-mode'); // Возвращаем чистый глаз
    }
});
