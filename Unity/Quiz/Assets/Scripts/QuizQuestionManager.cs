using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class QuizQuestionManager : MonoBehaviour
{
    [SerializeField] protected QuestionTemplate questionData;
    [SerializeField] protected TextMeshProUGUI questionTitle;
    [SerializeField] protected GameObject[] answersButtons;
    [SerializeField] protected Sprite correctAnswerSprite;
    [SerializeField] protected Sprite defaultAnswerSprite;

    private void Start()
    {
        this.DisplayQuestion();
    }

    private void DisplayQuestion()
    {
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
        } else {
            int correctAnswerIndex = this.questionData.GetCorrectAnswerIndex();

            this.answersButtons[correctAnswerIndex].GetComponent<Image>().sprite = this.correctAnswerSprite;
            string correctAnswerText = this.questionData.GetAnswer(correctAnswerIndex);
            questionTitle.text = "Que pena, você errou, a resposta correta é:\n" + correctAnswerText;
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
}