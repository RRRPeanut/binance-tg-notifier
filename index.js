const Binance = require('binance-api-node').default;
const TelegramBot = require('node-telegram-bot-api');

// Создаем экземпляр клиента Binance API
const client = new Binance();

// Переменная для хранения предыдущей цены ETH
let previousPrice = 0;

// Перечисление для условий сравнения
const ComparisonCondition = {
  GreaterThan: 'greaterThan',
  LessThanOrEqual: 'lessThanOrEqual',
  GreaterThanOrEqual: 'greaterThanOrEqual',
  LessThan: 'lessThan',
  Equal: 'equal',
};

// Массив для хранения условий
const conditions = [];

// Создаем экземпляр телеграм-бота с указанием токена
const bot = new TelegramBot('', { polling: true });

// Функция для обработки команды /addCondition
bot.onText(/\/addCondition (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const commandParams = match[1].split(' ');
  const conditionType = commandParams[0];
  const value = parseFloat(commandParams[1]);

  // Проверяем, является ли переданное условие допустимым
  if (Object.values(ComparisonCondition).includes(conditionType)) {
    // Добавляем условие в массив
    conditions.push({ condition: conditionType, value, chatId });

    // Отправляем сообщение об успешном добавлении условия
    bot.sendMessage(chatId, 'Условие успешно добавлено');
  } else {
    // Отправляем сообщение об ошибке
    bot.sendMessage(chatId, 'Недопустимое условие');
  }
});

// Функция для получения цены ETH токена с Binance и проверки условий
async function getETHPrice() {
  try {
    const ticker = await client.prices({ symbol: 'ETHUSDT' });
    const ethPrice = parseFloat(ticker['ETHUSDT']);
    // console.log(`Текущая цена ETH: ${ethPrice}`);

    // Проверяем условия и выполняем соответствующие действия
    conditions.forEach((condition, index) => {
      switch (condition.condition) {
        case ComparisonCondition.GreaterThan:
          if (ethPrice > condition.value) {
            console.log(`Условие ${condition.condition} ${condition.value} выполнено`);
            // Отправляем сообщение пользователю
            bot.sendMessage(condition.chatId, `Условие ${condition.condition} ${condition.value} выполнено`);
            // Выполняем необходимые действия
            // ...

            // Удаляем условие из массива
            conditions.splice(index, 1);
          }
          break;
        case ComparisonCondition.LessThanOrEqual:
          if (ethPrice <= condition.value) {
            console.log(`Условие ${condition.condition} ${condition.value} выполнено`);
            // Отправляем сообщение пользователю
            bot.sendMessage(condition.chatId, `Условие ${condition.condition} ${condition.value} выполнено`);
            // Выполняем необходимые действия
            // ...

            // Удаляем условие из массива
            conditions.splice(index, 1);
          }
          break;
        case ComparisonCondition.GreaterThanOrEqual:
          if (ethPrice >= condition.value) {
            console.log(`Условие ${condition.condition} ${condition.value} выполнено`);
            // Отправляем сообщение пользователю
            bot.sendMessage(condition.chatId, `Условие ${condition.condition} ${condition.value} выполнено`);
            // Выполняем необходимые действия
            // ...

            // Удаляем условие из массива
            conditions.splice(index, 1);
          }
          break;
        case ComparisonCondition.LessThan:
          if (ethPrice < condition.value) {
            console.log(`Условие ${condition.condition} ${condition.value} выполнено`);
            // Отправляем сообщение пользователю
            bot.sendMessage(condition.chatId, `Условие ${condition.condition} ${condition.value} выполнено`);
            // Выполняем необходимые действия
            // ...

            // Удаляем условие из массива
            conditions.splice(index, 1);
          }
          break;
        case ComparisonCondition.Equal:
          if (ethPrice === condition.value) {
            console.log(`Условие ${condition.condition} ${condition.value} выполнено`);
            // Отправляем сообщение пользователю
            bot.sendMessage(condition.chatId, `Условие ${condition.condition} ${condition.value} выполнено`);
            // Выполняем необходимые действия
            // ...

            // Удаляем условие из массива
            conditions.splice(index, 1);
          }
          break;
        default:
          break;
      }
    });

    // Обновляем предыдущую цену ETH
    previousPrice = ethPrice;

    // Запускаем следующий цикл через 1 секунду
    setTimeout(getETHPrice, 1000);
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

// Запускаем функцию получения цены ETH
getETHPrice();
