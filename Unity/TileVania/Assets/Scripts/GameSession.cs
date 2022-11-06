using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class GameSession : MonoBehaviour
{
    public static GameSession Instance { get; private set; }

    [SerializeField] private int lives = 3;
    [SerializeField] private int score = 0;

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(this.gameObject);           
        } else {
            Instance = this;
        }

        DontDestroyOnLoad(this.gameObject);
    }

    public void HandleDeath()
    {
        if (this.lives > 1)
        {
            this.lives--;
            
            int currentScene = SceneManager.GetActiveScene().buildIndex;
            SceneManager.LoadScene(currentScene);
        } else {
            SceneManager.LoadScene(0);
        }
    }
}
