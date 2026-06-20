document.addEventListener('DOMContentLoaded', () => {

    // --- 1. УНИВЕРСАЛЬНЫЙ НАБЛЮДАТЕЛЬ ДЛЯ АНИМАЦИИ ПО СКРОЛЛУ ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('invitation')) {
                    entry.target.classList.add('show');
                } else {
                    entry.target.classList.add('active');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Срабатывает, когда 15% блока показалось на экране
    });

    const elementsToAnimate = document.querySelectorAll('.invitation, .reveal, .heart-separator');
    elementsToAnimate.forEach(el => observer.observe(el));


    // --- 2. БЕЗЛИМИТНАЯ ОТПРАВКА АНКЕТЫ В ТЕЛЕГРАМ БОТ ---
    const form = document.getElementById('weddingForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const successCustomText = document.getElementById('successCustomText');

    const telegramToken = '8828320032:AAEkPKH4stG9IrYygY-IlAHYV2JILpjt2ng';
    const telegramChatId = '887212864';

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Запрещаем браузеру обновлять страницу

            if (submitBtn) {
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;
            }

            // Извлекаем данные из полей вашей формы
            const formData = new FormData(form);
            const guestName = formData.get('Имя_Фамилия') || 'Не указано';
            const attendance = formData.get('Присутствие') || 'Не указано';
            const coupleName = formData.get('Имя_пары') || '';

            // Формируем красивый текст сообщения для Telegram
            let messageText = `<b>🔔 Новая анкета гостя!</b>\n\n`;
            messageText += `<b>👤 Имя и Фамилия:</b> ${guestName}\n`;
            messageText += `<b>❓ Присутствие:</b> ${attendance}\n`;

            if (coupleName.trim() !== '') {
                messageText += `<b>👩‍❤️‍👨 Имя пары:</b> ${coupleName}\n`;
            }

            // Создаем безопасную закодированную строку для передачи кириллицы
            const encodedText = encodeURIComponent(messageText);
            const url = `https://telegram.org{telegramToken}/sendMessage?chat_id=${telegramChatId}&text=${encodedText}&parse_mode=HTML`;

            // Отправляем скрытый POST-запрос к серверам API Telegram
            fetch(url, { method: 'POST' })
                .then(response => {
                    if (response.ok) {
                        // Если гость ответил, что не придет — плавно меняем текст в вашей плашке благодарности
                        if (attendance.includes('К сожалению, не смогу') && successCustomText) {
                            successCustomText.textContent = 'Нам очень жаль, что вы не сможете разделить с нами этот день, но мы искренне благодарим вас за ответ!';
                        }

                        // Ваша фирменная анимация плавного скрытия анкеты
                        form.classList.add('fade-out');

                        setTimeout(() => {
                            form.style.display = 'none';
                            if (successMessage) {
                                successMessage.style.display = 'block';
                                setTimeout(() => {
                                    successMessage.classList.add('visible');
                                }, 50);
                            }
                        }, 400);

                        form.reset(); // Полностью очищаем поля формы для следующих гостей

                    } else {
                        alert('Ой, что-то пошло не так на стороне сервера. Пожалуйста, попробуйте отправить еще раз!');
                        if (submitBtn) {
                            submitBtn.textContent = 'Отправить';
                            submitBtn.disabled = false;
                        }
                    }
                })
                .catch(error => {
                    alert('Произошла техническая заминка. Пожалуйста, попробуйте отправить анкету еще раз!');
                    if (submitBtn) {
                        submitBtn.textContent = 'Отправить';
                        submitBtn.disabled = false;
                    }
                });
        });
    }


    // --- 3. ИНТЕРАКТИВНЫЙ ТАЙМЕР ОБРАТНОГО ОТСЧЕТА ---
    function initWeddingCountdown() {
        // Устанавливаем точную дату свадьбы: 20 августа 2026, 16:00
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
                const container = document.querySelector('.countdown-container');
                if (container) {
                    container.innerHTML = "<p class='success-text' style='width:100%; text-align:center; font-style:italic;'>Этот счастливый день настал!</p>";
                }
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
