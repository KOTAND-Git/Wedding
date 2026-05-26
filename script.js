document.addEventListener('DOMContentLoaded', () => {

    // Создаем один универсальный наблюдатель
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Если это блок .invitation, добавляем 'show'
                if (entry.target.classList.contains('invitation')) {
                    entry.target.classList.add('show');
                }
                // Для всех остальных (например, .reveal) добавляем 'active'
                else {
                    entry.target.classList.add('active');
                }

                // Перестаем следить за элементом, когда он уже появился
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Срабатывает, когда 15% блока показалось на экране
    });

    // Собираем все элементы, которые нужно анимировать
    const elementsToAnimate = document.querySelectorAll('.invitation, .reveal, .heart-separator');

    // Запускаем наблюдение за каждым
    elementsToAnimate.forEach(el => observer.observe(el));

    // --- ОБРАБОТКА ИНТЕРАКТИВНОЙ ОТПРАВКИ АНКЕТЫ ---
    const form = document.getElementById('weddingForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const successCustomText = document.getElementById('successCustomText');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Запрещаем браузеру уходить на страницу Formspree

            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            // Собираем данные из полей анкеты
            const formData = new FormData(form);
            const attendance = formData.get('Присутствие');

            try {
                // Отправляем данные на сервера Formspree через фоновый запрос
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Если гость ответил, что не сможет прийти, меняем текст благодарности
                    if (attendance === 'К сожалению, не смогу') {
                        successCustomText.textContent = 'Нам очень жаль, что вы не сможете разделить с нами этот день, но мы искренне благодарим вас за ответ!';
                    }

                    // Плавно скрываем форму
                    form.classList.add('fade-out');

                    setTimeout(() => {
                        form.style.display = 'none'; // Полностью убираем форму
                        successMessage.style.display = 'block'; // Включаем блок спасибо

                        // Запускаем плавное проявление блока спасибо через микро-задержку
                        setTimeout(() => {
                            successMessage.classList.add('visible');
                        }, 50);
                    }, 400);

                } else {
                    // Если сервер выдал ошибку
                    alert('Ой, что-то пошло не так. Пожалуйста, попробуйте отправить еще раз!');
                    submitBtn.textContent = 'Отправить';
                    submitBtn.disabled = false;
                }
            } catch (error) {
                // Если пропал интернет в момент отправки
                alert('Ошибка соединения. Проверьте подключение к интернету.');
                submitBtn.textContent = 'Отправить';
                submitBtn.disabled = false;
            }
        });
    }

    // --- ИНТЕРАКТИВНЫЙ ТАЙМЕР ОБРАТНОГО ОТСЧЕТА ---
    function initWeddingCountdown() {
        // Устанавливаем дату свадьбы: 20 августа 2026, 16:00
        // В JS месяцы идут с 0, поэтому август — это 7
        const weddingDate = new Date(2026, 7, 20, 16, 0, 0).getTime();

        const daysVal = document.getElementById('days');
        const hoursVal = document.getElementById('hours');
        const minutesVal = document.getElementById('minutes');
        const secondsVal = document.getElementById('seconds');

        if (!daysVal) return;

        function updateCountdown() {
            const now = new Date().getTime();
            const difference = weddingDate - now;

            if (difference < 0) {
                document.querySelector('.countdown-container').innerHTML = "<p class='success-text' style='width:100%; text-align:center; font-style:italic;'>Этот счастливый день настал!</p>";
                clearInterval(countdownInterval);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            daysVal.textContent = days < 10 ? '0' + days : days;
            hoursVal.textContent = hours < 10 ? '0' + hours : hours;
            minutesVal.textContent = minutes < 10 ? '0' + minutes : minutes;
            secondsVal.textContent = seconds < 10 ? '0' + seconds : seconds;
        }

        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    initWeddingCountdown();
});


