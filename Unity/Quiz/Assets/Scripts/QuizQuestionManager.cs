using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class QuizQuestionManager : MonoBehaviour
{
    protected enum GAME_STATES 
    {
        PLAYING,
        GAME_OVER,
        GAME_WON
    }

    [SerializeField] protected QuestionTemplate questionData;
    [SerializeField] protected TextMeshProUGUI questionTitle;
    [SerializeField] protected GameObject[] answersButtons;
    [SerializeField] protected Sprite correctAnswerSprite;
    [SerializeField] protected Sprite defaultAnswerSprite;
    [SerializeField] protected Image circularTimer;
    [SerializeField] protected float timeToAnswerTheQuestions = 30f;
    [SerializeField] protected float timeToShowCorrectAnswer = 10f;

    protected float currentTimeToAnswerTheQuestions;
    protected float currentTimeToShowCorrectAnswer;
    protected GAME_STATES CURRENT_GAME_STATE = GAME_STATES.PLAYING;

    private void Start()
    {
        this.DisplayQuestion();
    }

    private void Update()
    {
        if (this.CURRENT_GAME_STATE == GAME_STATES.PLAYING)
        {
            this.UpdateTimer();
        }
    }

    private void DisplayQuestion()
    {
        this.currentTimeToAnswerTheQuestions = this.timeToAnswerTheQuestions;
        this.currentTimeToShowCorrectAnswer = this.timeToShowCorrectAnswer;

        this.questionTitle.text = this.questionData.GetQuestion();

        for (int index = 0; index < this.answersButtons.Length; index++)
        {
            GameObject currentAnswerButton = this.answersButtons[index];

            TextMeshProUGUI answerButtonLabel = currentAnswerButton.GetComponentInChildren<TextMeshProUGUI>();
            answerButtonLabel.text = this.questionData.GetAnswer(index);
        }
    }

    public void OnAnswerSelected(int index) 
    {

        if (index == this.questionData.GetCorrectAnswerIndex())
        {
            Image buttonImage = this.answersButtons[index].GetComponent<Image>();
            buttonImage.sprite = this.correctAnswerSprite;
            this.questionTitle.text = "Parabéns! Você Acertou!";

            this.CURRENT_GAME_STATE = GAME_STATES.GAME_WON;
        } else {
            int correctAnswerIndex = this.questionData.GetCorrectAnswerIndex();

            this.answersButtons[correctAnswerIndex].GetComponent<Image>().sprite = this.correctAnswerSprite;
            string correctAnswerText = this.questionData.GetAnswer(correctAnswerIndex);
            this.questionTitle.text = "Que pena, você errou, a resposta correta é:\n" + correctAnswerText;

            this.CURRENT_GAME_STATE = GAME_STATES.GAME_OVER;
        }

        this.SetAnswerInteractable(false);
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

    protected void UpdateTimer()
    {
        if (this.currentTimeToAnswerTheQuestions - Time.deltaTime <= 0) {
            this.CURRENT_GAME_STATE = GAME_STATES.GAME_OVER;
            this.currentTimeToAnswerTheQuestions = 0;
        } else {
            this.currentTimeToAnswerTheQuestions -= Time.deltaTime;
        }


        this.circularTimer.fillAmount = this.currentTimeToAnswerTheQuestions / this.timeToAnswerTheQuestions;
    }
}