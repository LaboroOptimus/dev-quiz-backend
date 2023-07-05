const db = require('../db');

const result = JSON.parse(process.argv[2]);
const userId = process.argv[3];
const testId = process.argv[4]

const analytics = async () => {
    const userStatisticsRows = await db.query(`SELECT * from users WHERE id=${userId}`)
    const testTopicsRows = await db.query(`SELECT * from test_topics WHERE testId=${testId}`);
    
    const testTopics = testTopicsRows?.rows?.map((item) => item); // массив тем теста

    let userPassedTestByTopics = {...userStatisticsRows.rows[0].passedtestbytopics};
    for(let i = 0; i < testTopics.length; i++) {

        if(userPassedTestByTopics[testTopics[i].topicid]) {
            userPassedTestByTopics[testTopics[i].topicid] = userPassedTestByTopics[testTopics[i].topicid] + 1; 
        }
        else {
            userPassedTestByTopics[testTopics[i].topicid] = 1
        }
    }
    await db.query('UPDATE users SET passedTestByTopics = $1 WHERE id = $2', [userPassedTestByTopics, userId])
    
    const answers = Object.keys(result).length; // всего тестовых ответов
    const correctAnswers = Object.values(result).filter((item) => item !== true).length; // кол-во правильных ответов
    const corrrectPercent = correctAnswers / (answers / 100); // процентов правильных ответов
    
    let correctAnswersByTopics = {...userStatisticsRows.rows[0]?.correctanswersbytopics };
    
    for(let i = 0; i < testTopics.length; i++) {
        if(correctAnswersByTopics[testTopics[i].topicid]) {
            correctAnswersByTopics[testTopics[i].topicid] = (correctAnswersByTopics[testTopics[i].topicid] + corrrectPercent)/2
        }
        else {
            correctAnswersByTopics[testTopics[i].topicid] = corrrectPercent;
        }
    }
    await db.query('UPDATE users SET correctAnswersByTopics = $1 WHERE id = $2', [correctAnswersByTopics, userId])
}

analytics()