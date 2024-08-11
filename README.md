# Power Tool

## Установка

1. Скачайте [последнюю версию](https://github.com/ваш-репозиторий/releases) и распакуйте архив.
2. Запустите `install.bat` для автоматического добавления `power.exe` в системную переменную PATH.
3. Связь с поддержкой проекта [Telegram](https://t.me/ragotn)
4. Проект создан при поддержке culturing
5. Связь с разработчиком - culturing(Discord)
6. Github - https://github.com/fine1337

## Использование

После установки вы можете использовать команду `power` в командной строке.

## Команды

- `power -h` — Показывает справочную информацию.

## Что бы использовать функцию сканирования номера телефона Вам нужно
1. Зайти на [Сайт](https://www.hlr-lookups.com/)
2. Зарегистрироваться 
3. Зайти в [Клик](https://www.hlr-lookups.com/en/api-settings#apiCredentials)
4. Скопировать API Key и API Secret
5. Зайти в файл index.mjs
6. В 11 строке найти const client = new HlrLookupClient('YOUR_API_KEY', 'YOUR_API_SECRET');
7. Заменить YOUR_API_KEY и YOUR_API_SECRET на те которые вам дал сайт.

## Библиотеки
1. chalk@4.1.0
2. gradient-string@1.1.0
3. node-hlr-client@1.0.0
4. readline@1.3.0
5. node-nmap@1.0.0
6. ping@0.4.0
7. axios@0.21.1