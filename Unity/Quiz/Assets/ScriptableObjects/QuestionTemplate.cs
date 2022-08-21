using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(menuName = "Quiz Question", fileName = "New Question")]
public class QuestionTemplate : ScriptableObject
{
    [TextArea(4,6)]
    [SerializeField] protected string question;
    [SerializeField] protected string[] answers = new string[4];
    [SerializeField] protected int correctAnswerIndex = 0;

    public string GetQuestion() {
        return this.question;
    }

    public int GetCorrectAnswerIndex() {
        return this.correctAnswerIndex;
    }

    public string GetAnswer(int index) {
        if (index < 0 || index > this.answers.Length - 1)
        {
            return this.answers[0];
        }

        return this.answers[index];
    }
}
