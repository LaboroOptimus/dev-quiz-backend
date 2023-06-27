CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  isEmailVerified BOOLEAN,
  password VARCHAR(255),
  profileImage BYTEA
);

CREATE TABLE levels(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255)
);

CREATE TABLE topics(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255)
);

CREATE TABLE tests(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  isUserTest BOOLEAN,
  timer INTEGER,
  levelId INTEGER,
  creatorId INTEGER,
  FOREIGN KEY (levelId) REFERENCES levels(id),
  FOREIGN KEY (creatorId) REFERENCES users(id)
);

CREATE TABLE test_topics (
    id SERIAL PRIMARY KEY,
    testId INTEGER,
    topicId INTEGER,
    FOREIGN KEY (testId) REFERENCES tests (id),
    FOREIGN KEY (topicId) REFERENCES topics (id)
);

CREATE TABLE history(
  id SERIAL PRIMARY KEY,
  userId INTEGER,
  testId INTEGER,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (testId) REFERENCES tests(id),
  result JSON,
  userAnswers JSON,
  creationDate TIMESTAMP
);

CREATE TABLE questions(
  id SERIAL PRIMARY KEY,
  testId INTEGER,
  FOREIGN KEY (testId) REFERENCES tests(id),
  title TEXT,
  code TEXT,
  isCodeQuestion BOOLEAN,
  isMultipleAnswers BOOLEAN
);

CREATE TABLE answers(
  id SERIAL PRIMARY KEY,
  questionId INTEGER,
  FOREIGN KEY (questionId) REFERENCES questions(id),
  isCorrect BOOLEAN,
  title TEXT
);

CREATE TABLE userssessions(
  id SERIAL PRIMARY KEY,
  userId INTEGER,
  FOREIGN KEY (userId) REFERENCES users(id),
  jwt TEXT
);

create TABLE useravatars(
   id SERIAL PRIMARY KEY,
   image BYTEA,
)

/* Training */

create TABLE trainquestions(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255)
  levelId INTEGER,
  topicId INTEGER,
  isCodeQuestion: BOOLEAN,
  code: VARCHAR(255),
  FOREIGN KEY (levelId) REFERENCES levels(id),
  FOREIGN KEY (topicId) REFERENCES topics(id)
)

INSERT INTO trainquestions (title, levelId, topicId, isCodeQuestion, code) 
VALUES('Где можно использовать JavaScript?', 0, 2, FALSE, NULL);
	
INSERT INTO trainquestions (title, levelId, topicId, isCodeQuestion, code) 
VALUES('В чем отличие между локальной и глобальной переменной?', 0, 2, FALSE, NULL);

INSERT INTO trainquestions (title, levelId, topicId, isCodeQuestion, code)
VALUES('В чем разница между confirm и prompt?', 0, 2, FALSE, NULL);

INSERT INTO trainquestions (title, levelId, topicId, isCodeQuestion, code) 
VALUES('Что выведет этот код?', 0, 2, TRUE, 'let y = 1;let x = y = 2;alert(x);');

INSERT INTO trainquestions (title, levelId, topicId, isCodeQuestion, code) 
VALUES('Чему равно i в конце кода?', 0, 2, TRUE, 'for(var i=0; i<10; i++) {...}alert(i);');

INSERT INTO trainquestions (title, levelId, topicId, isCodeQuestion, code) 
VALUES('JSON - это...', 0, 2, FALSE, NULL);

INSERT INTO trainquestions (title, levelId, topicId, isCodeQuestion, code)  
VALUES('Можно ли в скрипте перевести посетителя на другую страницу сайта?', 0, 2, FALSE, NULL);



/* Training */



INSERT INTO tests (name, isUserTest, timer, levelId, creatorId)
VALUES('Начальный тест', FALSE,0,0,0);

INSERT INTO test_topics(testId, topicId)
VALUES(0, 0);

INSERT INTO test_topics(testId, topicId)
VALUES(0, 1);

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(0,'Где можно использовать JavaScript?',FALSE,FALSE, NULL);

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(0,'Какое количество сообщений будет выведено в консоль?',TRUE,FALSE,'for(var i = 10; i < 35; i += 5){<br> console.log(i); <br>)}');	

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(0,'В чем отличие между локальной и глобальной переменной?',FALSE,FALSE, NULL);

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Какая переменная записана неверно?',	FALSE,FALSE, NULL);
	      
INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'В чем разница между confirm и prompt?',FALSE,FALSE, NULL);

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Язык JavaScript является подвидом языка Java - верно?',FALSE,FALSE, NULL);

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Что будет на экране?',TRUE,FALSE,'alert(str); var str = "Hello";');		

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Что выведет этот код?',TRUE,FALSE,'let y = 1;let x = y = 2;alert(x);');

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Чему равно i в конце кода?',TRUE,FALSE,'for(var i=0; i<10; i++) {...}alert(i);');

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Как объявить функцию в JavaScript?',FALSE,FALSE, NULL);

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Какое из этих ключевых слов ООП не используется в JavaScript?',FALSE,FALSE, NULL);

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'JSON - это...',FALSE,FALSE, NULL);

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Можно ли в скрипте перевести посетителя на другую страницу сайта?',FALSE,FALSE,NULL);

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Какое сообщение покажет alert?',TRUE,FALSE,'var i = 5;  alert(++i);');	

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Расшифруйте аббревиатуру DOM',FALSE,FALSE, NULL);		

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Чем отличается const от let?',FALSE,FALSE,NULL);

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Как в JavaScript создать массив?',FALSE,FALSE,NULL);	

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Расшифруйте аббревиатуру API.',FALSE,FALSE,NULL);	

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Какой оператор завершает выполнение текущей функции и возвращает её значение?',	FALSE,	FALSE,NULL);

INSERT INTO questions (testid,title, isCodeQuestion, isMultipleAnswers, code) 
VALUES(	0,'Что такое замыкание в JavaScript?',FALSE,FALSE,NULL);																	
															

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	1	,	FALSE	,'	серверные приложения'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	1	,	FALSE	,'	мобильные приложения'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	1	,	FALSE	,'	веб-приложения'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	1	,	TRUE	,'	можно во всех перечисленных'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	1	,	FALSE	,'	прикладное программное обеспечение'	);	

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	2	,	TRUE	,'	5'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	2	,	FALSE	,'	6'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	2	,	FALSE	,'	15'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	2	,	FALSE	,'	25'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	2	,	FALSE	,'	такой цикл работать не будет'	);	

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	3	,	FALSE	,'	отличий нет'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	3	,	FALSE	,'	локальные видны повсюду, глобальные только в функциях'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	3	,	FALSE	,'	глобальные можно переопределять, локальные нельзя'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	3,	TRUE	,'	локальные можно переопределять, глобальные нельзя'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	3	,	FALSE	,'	глобальные видны повсюду, локальные только в функциях'	);	

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	4	,	FALSE	,'	var num = "STRING";'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	4	,	FALSE	,'	var isDone = 0;'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	4	,	FALSE	,'	var b = false;'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	4	,	TRUE	,'	var number = 12,5;	');		

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	5	,	FALSE	,'	ничем не отличаются'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	5	,	FALSE	,'	confirm вызывает диалоговое окно с полем для ввода, prompt - окно с подтверждением'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	5	,	TRUE	,'	prompt вызывает диалоговое окно с полем для ввода, confirm - окно с подтверждением;	');																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	6	,	FALSE	,'	да'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	6	,	TRUE	,'	нет'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	6	,	FALSE	,'	наоборот, Java - подвид JavaScript'	);																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	7	,	FALSE	,'	Hello'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	7	,	TRUE	,'	undefined'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	7	,	FALSE	,'	будет ошибка'	);																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	8	,	FALSE	,'	1'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	8	,	TRUE	,'	2'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	8	,	FALSE	,'	x	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	8	,	FALSE	,'	у = 2	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	8	,	FALSE	,'	в коде явно какая-то ошибка'	);																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	9	,	FALSE	,'	undefined	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	9	,	TRUE	,'	9'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	9	,	FALSE	,'	10'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	9	,	FALSE	,'	нет такой переменной после цикла'	);																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	10	,	FALSE	,'	function:MyFunction()	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	10	,	TRUE	,'	function MyFunction()	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	10	,	FALSE	,'	function = MyFunction()');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	10	,	FALSE	,'	function = New MyFunction()'	);																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	11	,	FALSE	,'	new	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	11	,	TRUE	,'	все есть	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	11	,	FALSE	,'	this'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	11	,	FALSE	,'	instanceOf	');																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	12	,	TRUE	,'	JavaScript Object Notation'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	12	,	FALSE	,'	название следующей версии JavaScript	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	12	,	FALSE	,'	JavaScript Over Network'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	12	,	FALSE	,'	имя создателя JavaScript	');																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	13	,	FALSE	,'	 да, но только в рамках текущего сайта'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	13	,	FALSE	,'	нет, нельзя	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	13	,	TRUE	,'	да, куда угодно	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	13	,	FALSE	,'	5	');																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	14	,	FALSE	,'	6	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	14	,	TRUE	,'	7	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	14	,	FALSE	,'	undefined	');																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	15	,	TRUE	,'	Document Object Model'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	15	,	FALSE	,'	Digital Optical Modulation'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	15	,	FALSE	,'	Domestic Object Mode'	);																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	16	,	FALSE	,'	const - не является частью JavaScript'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	16	,	FALSE	,'	переменные, объявленные через const, находятся в глобальной видимости'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	16	,	TRUE	,'	объявление const задаёт константу, то есть значение, которое нельзя менять	');																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	17	,	TRUE	,'	var array = new Array( ) или var array = [ ]'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	17	,	FALSE	,'	var array = new Array{ } или var new array = [ ]	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	17	,	FALSE	,'	int new Array( ) или var new Array( )	');																			

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	18	,	FALSE	,'	Analog Programm Interface	');																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	18	,	TRUE	,'	Application Programming Interface'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	18	,	FALSE	,'	Academy Provide Infinite	');	

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	19	,	FALSE	,'	case'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	19	,	TRUE	,'	return	');		
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	19	,	FALSE	,'	break	');		

INSERT  INTO answers(questionId, isCorrect,title) VALUES(	20	,	FALSE	,'	способность функции вызывать саму себя'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	20	,	FALSE	,'	способность функции запоминать все переменные'	);																			
INSERT  INTO answers(questionId, isCorrect,title) VALUES(	20	,	TRUE	,'	способность функции запоминать область видимости, в которой эта функция была объявлена'	);