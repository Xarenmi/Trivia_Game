//Fetching API
class Category {
    constructor(id, difficulty, type) {
        this.id = id;
        this.difficulty = difficulty;
        this.questionType = type;
        this.url = '';
        this.questions = [];
        this.setURL();
        this.fetchData();
    }

    setURL() {
        let url = 'https://opentdb.com/api.php?amount=10';

        if (this.id) {
            url += `&category=${this.id}`;
        }

        if (this.difficulty) {
            url += `&difficulty=${this.difficulty}`;
        }

        if (this.questionType) {
            url += `&type=${this.questionType}`;
        }

        this.url = url;
    }

    fetchData() {
        fetch(this.url, { cache: 'no-cache' })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Request failed');
            })
            .then((data) => {
                this.questions = data.results;
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    async fetchQuestions() {
        while (this.questions.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.questions.map((object) => {
            object.question = object.question.replace(/&quot;/g, '"');
            object.question = object.question.replace(/&#039;/g, "'");
            object.question = object.question.replace(/&amp;/g, '&');
            object.question = object.question.replace(/&Uuml;/g, 'ü');
            object.question = object.question.replace(/&rsquo;/g, '’');
        });

        return this.questions;
    }

    static shuffle(question) {

        let allAnswers = [];
        allAnswers.push(question.correct_answer);

        if (question.type === 'multiple') {
            for (const answer of question.incorrect_answers) {
                allAnswers.push(answer);
            }
        } else {
            allAnswers.push(question.incorrect_answers[0]);
        }

        let getRandomIndex = () => Math.floor(Math.random() * allAnswers.length);
        let allShuffled = [];

        for (let i = allAnswers.length; i > 0; i--) {
            let randomIndex = getRandomIndex()
            allShuffled.push(allAnswers[randomIndex]);
            allAnswers.splice(randomIndex, 1);
        }

        return allShuffled;
    }
}

export default Category;