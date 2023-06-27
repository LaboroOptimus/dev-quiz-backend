const getOpenAiString = (question, answer) => {
    return `Напиши '1' если ответ правильный, '0' если неправильный. Вопрос: ${question} Ответ: ${answer}`
}

const getOpenAiExplainationString = (question) => {
    return `Напиши краткий ответ. Вопрос: ${question}`
}

module.exports = { getOpenAiString, getOpenAiExplainationString };