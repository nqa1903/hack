interface IFeedBack {
    id: number;
    name: string;
    score: number;
}

class FeedBack implements IFeedBack {
    id: number;
    name: string;
    score: number;

    constructor(id: number, name: string, score: number) {
        this.id = id;
        this.name = name;
        this.score = score;
    }

    createFeedback(reviewText: string, selectedScore: number) {
        const feedbackId = Date.now();

        const newFeedback: IFeedBack = {
            id: feedbackId,
            name: this.name,
            score: selectedScore 
        };

        const existingFeedback = JSON.parse(localStorage.getItem('feedbackData') || '[]') as IFeedBack[];

        existingFeedback.push(newFeedback);

        localStorage.setItem('feedbackData', JSON.stringify(existingFeedback));

        const feedbackContainer = document.querySelector('.feedback') as HTMLElement;
        const feedbackRate = document.createElement('div');
        feedbackRate.classList.add('feedback-rate');

        const rewriteButton = document.createElement('i');
        rewriteButton.classList.add('fa', 'fa-pencil-square-o', 'delete-button');
        rewriteButton.setAttribute('aria-hidden', 'true');

        const deleteButton = document.createElement('i');
        deleteButton.classList.add('fa', 'fa-times', 'rewrite');
        deleteButton.setAttribute('aria-hidden', 'true');
        deleteButton.addEventListener('click', () => {
            this.deleteFeedback(feedbackRate);
        });

        const feedbackScore = document.createElement('div');
        feedbackScore.classList.add('feedback-score');
        feedbackScore.textContent = newFeedback.score.toString(); 

        const feedbackReview = document.createElement('div');
        feedbackReview.classList.add('feedback-review');
        feedbackReview.textContent = reviewText;

        const feedbackButtons = document.createElement('div');
        feedbackButtons.classList.add('feedback-button');

        feedbackButtons.appendChild(rewriteButton);
        feedbackButtons.appendChild(deleteButton);
        feedbackRate.appendChild(feedbackScore);
        feedbackRate.appendChild(feedbackReview);
        feedbackRate.appendChild(feedbackButtons);

        feedbackContainer.appendChild(feedbackRate);
    }

    deleteFeedback(feedbackRate: HTMLElement){
        const confirmDelete = confirm ("Bạn có muốn xóa bình luận ?");
        if(confirmDelete){
            feedbackRate.remove();
        }
    }
}

function renderScore() {
    const scores = [1,2,3,4,5,6,7,8,9,10];
    let listScore = document.querySelector("#list-score") as HTMLElement;
    listScore.innerHTML = '';

    let scoreHtmls = scores.map(score=> {
        return `
            <li class="score-rate" data-score="${score}">${score}</li>
        `;
    });

    listScore.innerHTML = scoreHtmls.join("");
}

renderScore();

const scoreRates = document.querySelectorAll('.score-rate') as NodeListOf<HTMLElement>;
let selectedScore: number = 0;
scoreRates.forEach(rate => {
    rate.addEventListener('click', () => {
        selectedScore = parseInt(rate.getAttribute('data-score') || '0');

        scoreRates.forEach(rate => {
            rate.classList.remove('active'); 
        });
        rate.classList.add('active'); 
    });
});

const inputReview = document.querySelector('.review-input') as HTMLInputElement;
const formReview = document.querySelector('.review') as HTMLFormElement;
const feedback = new FeedBack(1, "10 đỉm", 10);

formReview.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const reviewText = inputReview.value; 
    feedback.createFeedback(reviewText, selectedScore); 

    inputReview.value = ''; 
    selectedScore = 0;
    renderScore(); 
});
