using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class QuizQuestionManager : MonoBehaviour
{
    protected enum GAME_STATES 
    {
        PLAYING,
        GAME_OVER,
        GAME_WON,
        NEXT_QUESTION,
        GAME_FINISHED
    }

    [Header("Quiz Screens")]
    [SerializeField] protected GameObject MainGameScreen;
    [SerializeField] protected GameObject GameFinishedScreen;

    [Header("Question Data")]
    [SerializeField] protected TextMeshProUGUI questionTitle;
    [SerializeField] protected List<QuestionTemplate> questionList;
    [SerializeField] protected float timeToAnswerTheQuestions = 30f;
    [SerializeField] protected float timeToShowCorrectAnswer = 10f;
    
    [Header("Answers Buttons Data")]
    [SerializeField] protected GameObject[] answersButtons;
    [SerializeField] protected Sprite correctAnswerSprite;
    [SerializeField] protected Sprite defaultAnswerSprite;
    
    [Header("Timer")]
    [SerializeField] protected Image circularTimer;

    [Header("Slider")]
    [SerializeField] protected Slider slider;

    protected QuestionTemplate currentQuestion;
    protected int currentQuestionIndex;
    protected float currentTimeToAnswerTheQuestions;
    protected float currentTimeToShowCorrectAnswer;
    protected GAME_STATES CURRENT_GAME_STATE;
    protected bool hasShowedAnswer;

    private void Start()
    {
        this.MainGameScreen.SetActive(true);
        this.GameFinishedScreen.SetActive(false);

        this.currentQuestionIndex = 0;
        this.CURRENT_GAME_STATE = GAME_STATES.PLAYING;
        this.hasShowedAnswer = false;

        this.currentQuestion = this.questionList[this.currentQuestionIndex];

        this.slider.value = this.currentQuestionIndex;
        this.slider.maxValue = this.questionList.Count;

        this.DisplayQuestion();
        this.SetDefaultAnswerSprite();
        this.ResetTimer();
    }

    private void Update()
    {
        switch (this.CURRENT_GAME_STATE)
        {
            case GAME_STATES.PLAYING:
                this.currentTimeToAnswerTheQuestions = this.UpdateTimer(this.currentTimeToAnswerTheQuestions, timeToAnswerTheQuestions);
                break;
            case GAME_STATES.GAME_OVER:
                if (hasShowedAnswer == false)
                {
                    this.ShowAnswer(-1);
                    this.SetAnswerInteractable(false);
                }

                this.currentTimeToShowCorrectAnswer = this.UpdateTimer(this.currentTimeToShowCorrectAnswer, this.timeToShowCorrectAnswer);
                break;
            case GAME_STATES.GAME_WON:
                this.currentTimeToShowCorrectAnswer = this.UpdateTimer(this.currentTimeToShowCorrectAnswer, this.timeToShowCorrectAnswer);
                break;
            case GAME_STATES.NEXT_QUESTION:
                this.currentQuestionIndex++;
                this.slider.value = this.currentQuestionIndex;

                if (this.currentQuestionIndex >= this.questionList.Count)
                {
                    this.CURRENT_GAME_STATE = GAME_STATES.GAME_FINISHED;
                    return;
                }

                this.currentQuestion = this.questionList[this.currentQuestionIndex];

                this.hasShowedAnswer = false;
                this.SetAnswerInteractable(true);
                this.SetDefaultAnswerSprite();
                this.ResetTimer();
                
                this.DisplayQuestion();
                this.CURRENT_GAME_STATE = GAME_STATES.PLAYING;
                
                break;
            case GAME_STATES.GAME_FINISHED:
                if(this.GameFinishedScreen.active == false)
                {
                    Debug.Log("Show Game Finished Screen");
                    this.MainGameScreen.SetActive(false);
                    this.GameFinishedScreen.SetActive(true);                    
                }

                break;
        }
    }

    public void OnAnswerSelected(int index)
    {
        ShowAnswer(index);

        this.SetAnswerInteractable(false);
    }

    public void RestartGame()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }

    private void DisplayQuestion()
    {
        this.questionTitle.text = this.currentQuestion.GetQuestion();

        for (int index = 0; index < this.answersButtons.Length; index++)
        {
            GameObject currentAnswerButton = this.answersButtons[index];

            TextMeshProUGUI answerButtonLabel = currentAnswerButton.GetComponentInChildren<TextMeshProUGUI>();
            answerButtonLabel.text = this.currentQuestion.GetAnswer(index);
        }
    }

    private void ShowAnswer(int index)
    {
        if (index == this.currentQuestion.GetCorrectAnswerIndex())
        {
            Image buttonImage = this.answersButtons[index].GetComponent<Image>();
            buttonImage.sprite = this.correctAnswerSprite;
            this.questionTitle.text = "Parabéns! Você Acertou!";

            this.CURRENT_GAME_STATE = GAME_STATES.GAME_WON;
        }
        else
        {
            int correctAnswerIndex = this.currentQuestion.GetCorrectAnswerIndex();

            this.answersButtons[correctAnswerIndex].GetComponent<Image>().sprite = this.correctAnswerSprite;
            string correctAnswerText = this.currentQuestion.GetAnswer(correctAnswerIndex);
            this.questionTitle.text = "Que pena, você errou, a resposta correta é:\n" + correctAnswerText;

            this.CURRENT_GAME_STATE = GAME_STATES.GAME_OVER;
        }

        hasShowedAnswer = true;
    }

    protected void SetAnswerInteractable(bool newState) 
    {
        foreach (GameObject answerButton in this.answersButtons)
        {
            answerButton.GetComponent<Button>().interactable = newState;
        }
    }

    protected void NextQuestion() 
    {
        this.DisplayQuestion();
        this.SetAnswerInteractable(true);
    }

    protected void SetDefaultAnswerSprite()
    {
        foreach (GameObject answerButton in this.answersButtons)
        {
            answerButton.GetComponent<Image>().sprite = this.defaultAnswerSprite;
        }
    }

    protected float UpdateTimer(float currentTime, float initialTime)
    {
        if (currentTime - Time.deltaTime <= 0) {
            if (this.CURRENT_GAME_STATE == GAME_STATES.PLAYING)
            {
                this.CURRENT_GAME_STATE = GAME_STATES.GAME_OVER;                
            } else if (this.CURRENT_GAME_STATE == GAME_STATES.GAME_WON) {
                this.CURRENT_GAME_STATE = GAME_STATES.NEXT_QUESTION;
            } else if (this.CURRENT_GAME_STATE == GAME_STATES.GAME_OVER) {
                this.CURRENT_GAME_STATE = GAME_STATES.NEXT_QUESTION;
            }
            currentTime = 0;
        } else {
            currentTime -= Time.deltaTime;
        }

        this.circularTimer.fillAmount = currentTime / initialTime;

        return currentTime;
    }

    private void ResetTimer()
    {
        this.currentTimeToAnswerTheQuestions = this.timeToAnswerTheQuestions;
        this.currentTimeToShowCorrectAnswer = this.timeToShowCorrectAnswer;
    }
}