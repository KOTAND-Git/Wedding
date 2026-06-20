// --- 2. БЕЗЛИМИТНАЯ ОТПРАВКА АНКЕТЫ В ТЕЛЕГРАМ БОТ (ФИНАЛЬНЫЙ КОДИРОВАННЫЙ ФИКС) ---
const form = document.getElementById('weddingForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const successCustomText = document.getElementById('successCustomText');

const telegramToken = '8828320032:AAEkPKH4stG9IrYygY-IlAHYV2JILpjt2ng';
const telegramChatId = '887212864';

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Запрещаем перезагрузку страницы

        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        // 1. Поштучно собираем данные из полей вашей разметки
        const guestNameInput = form.querySelector('input[name="Имя_Фамилия"]');
        const attendanceInput = form.querySelector('input[name="Присутствие"]:checked');
        const coupleNameInput = form.querySelector('input[name="Имя_пары"]');

        const guestName = guestNameInput ? guestNameInput.value.trim() : 'Не указано';
        const attendance = attendanceInput ? attendanceInput.value : 'Не указано';
        const coupleName = coupleNameInput ? coupleNameInput.value.trim() : '';

        // 2. Формируем красивый текст сообщения для Telegram
        let messageText = `<b>🔔 Новая анкета гостя!</b>\n\n`;
        messageText += `<b>👤 Имя и Фамилия:</b> ${guestName}\n`;
        messageText += `<b>❓ Присутствие:</b> ${attendance}\n`;

        if (coupleName !== '') {
            messageText += `<b>👩‍❤️‍👨 Имя пары:</b> ${coupleName}\n`;
        }

        // 3. Отправляем через классический URL-Query формат (самый надежный способ для GitHub Pages)
        const encodedText = encodeURIComponent(messageText);
        const url = `https://telegram.org{telegramToken}/sendMessage?chat_id=${telegramChatId}&text=${encodedText}&parse_mode=HTML`;

        try {
            const response = await fetch(url, { method: 'POST' });

            if (response.ok) {
                // Если гость ответил, что не придет — меняем текст благодарности
                if (attendance.includes('К сожалению, не смогу')) {
                    if (successCustomText) {
                        successCustomText.textContent = 'Нам очень жаль, что вы не сможете разделить с нами этот день, но мы искренне благодарим вас за ответ!';
                    }
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

                form.reset(); // Очищаем форму

            } else {
                alert('Ой, что-то пошло не так на стороне сервера. Пожалуйста, попробуйте отправить еще раз!');
                submitBtn.textContent = 'Отправить';
                submitBtn.disabled = false;
            }
        } catch (error) {
            alert('Ошибка соединения. Проверьте подключение к интернету.');
            submitBtn.textContent = 'Отправить';
            submitBtn.disabled = false;
        }
    });
}
