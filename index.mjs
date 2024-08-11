import chalk from 'chalk';
import gradient from 'gradient-string';
import HlrLookupClient from 'node-hlr-client';
import readline from 'readline';
import Nmap from 'node-nmap';
import ping from 'ping';
import axios from 'axios'; // Подключаем axios для HTTP-пинга
import { exec } from 'child_process'; // Для выполнения командных операций

// Установка клиента HLR
const client = new HlrLookupClient('YOUR_API_KEY', 'YOUR_API_SECRET');

// Установка интерфейса для ввода пользователя
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



// Функция для отображения меню с радужным градиентом
function showMenu() {
    const menuBorder = gradient.rainbow('█████████████████████████████████████████████████████████████████');
    console.log(menuBorder);
    console.log(gradient.rainbow('██                                                             ██'));
    console.log(gradient.rainbow('██   1. Проверить номер телефона (HLR Lookup)                  ██'));
    console.log(gradient.rainbow('██   2. Сканировать IP-адрес с помощью nmap                    ██'));
    console.log(gradient.rainbow('██   3. Проверить задержку (пинг) IP-адреса                    ██'));
    console.log(gradient.rainbow('██   4. Проверить HTTP-пинг IP-адреса                          ██'));
    console.log(gradient.rainbow('██   5. Анализировать трассировку (traceroute) IP-адреса       ██'));
    console.log(gradient.rainbow('██   6. Выход                                                  ██'));
    console.log(gradient.rainbow('██                                                             ██'));
    console.log(menuBorder);
}

// Функция для обработки выбора пользователя
function handleOption(option) {
    switch (option.trim()) {
        case '1':
            rl.question('Введите номер телефона (в формате +1234567890): ', (phoneNumber) => {
                client.lookup(phoneNumber, (err, response) => {
                    if (err) {
                        console.error(chalk.red('Ошибка при выполнении запроса HLR:'), err);
                    } else {
                        console.log(chalk.green('Результат HLR Lookup:'), response);
                    }
                    rl.close();
                });
            });
            break;
        case '2':
            rl.question('Введите IP-адрес для сканирования: ', (ipAddress) => {
                scanIP(ipAddress);
            });
            break;
        case '3':
            rl.question('Введите IP-адрес для пинга: ', (ipAddress) => {
                pingIP(ipAddress);
            });
            break;
        case '4':
            rl.question('Введите IP-адрес для HTTP-пинга: ', (ipAddress) => {
                httpPing(ipAddress);
            });
            break;
        case '5':
            rl.question('Введите IP-адрес для трассировки: ', (ipAddress) => {
                tracerouteIP(ipAddress);
            });
            break;
        case '6':
            console.log(gradient.rainbow('Выход из программы.'));
            rl.close();
            break;
        default:
            console.log(chalk.red('Неверный выбор. Попробуйте снова.'));
            rl.close();
            break;
    }
}

// Функция для сканирования IP-адреса
function scanIP(ip) {
    console.log(chalk.yellow(`Запуск сканирования IP: ${ip}`));
    const nmap = new Nmap.NmapScan(ip, '-T4 -A'); // Опции могут быть изменены в зависимости от ваших потребностей
    nmap.on('complete', (data) => {
        if (data.length === 0) {
            console.log(chalk.red('Результаты сканирования пусты. Возможно, IP не доступен или нет открытых портов.'));
        } else {
            console.log(chalk.green('Результаты сканирования IP:'));
            data.forEach(result => {
                console.log(chalk.cyan(`Hostname: ${result.hostname}`));
                console.log(chalk.cyan(`IP Address: ${result.ip}`));
                console.log(chalk.cyan(`Operating System: ${result.osNmap}`));
                console.log(chalk.cyan(`Open Ports:`));
                result.openPorts.forEach(port => {
                    console.log(`  ${port.port} - ${port.name} (Protocol: ${port.protocol})`);
                });
                console.log(''); // Для разделения результатов
            });
        }
        rl.close();
    });
    nmap.on('error', (error) => {
        console.error(chalk.red('Ошибка при сканировании IP:'), error);
        rl.close();
    });
    nmap.startScan();
}

// Функция для пинга IP-адреса
function pingIP(ip) {
    console.log(chalk.yellow(`Запуск пинга IP: ${ip}`));
    ping.promise.probe(ip, { min_reply: 10 })
        .then((response) => {
            console.log(chalk.green('Результаты пинга IP:'));
            console.log(`IP Address: ${response.host}`);
            console.log(`Packet Loss: ${response.packetLoss}%`);
            console.log(`Average RTT: ${response.avg} ms`);
            console.log(`Response Times: ${response.time}`);
            console.log(''); // Для разделения результатов
            rl.close();
        })
        .catch((error) => {
            console.error(chalk.red('Ошибка при выполнении пинга:'), error);
            rl.close();
        });
}

// Функция для HTTP-пинга IP-адреса
function httpPing(ip) {
    console.log(chalk.yellow(`Запуск HTTP-пинга IP: ${ip}`));
    axios.get(`http://${ip}`)
        .then(response => {
            console.log(chalk.green(`HTTP-пинг успешен. Статус код: ${response.status}`));
        })
        .catch(error => {
            console.log(chalk.red('Ошибка при выполнении HTTP-пинга:'), error.message);
        })
        .finally(() => {
            rl.close();
        });
}

// Функция для анализа трассировки IP-адреса
function tracerouteIP(ip) {
    console.log(chalk.yellow(`Запуск трассировки IP: ${ip}`));
    exec(`tracert ${ip}`, (error, stdout, stderr) => {
        if (error) {
            console.error(chalk.red(`Ошибка при выполнении трассировки: ${error.message}`));
            return;
        }
        if (stderr) {
            console.error(chalk.red(`Ошибка: ${stderr}`));
            return;
        }
        console.log(chalk.green(`Результаты трассировки IP:`));
        console.log(stdout);
        rl.close();
    });
}

// Показ меню при запуске
showMenu();
rl.question(gradient.rainbow('Выберите опцию (1, 2, 3, 4, 5 или 6): '), handleOption);
