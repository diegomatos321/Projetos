using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class ChangeLevel : MonoBehaviour
{
    [SerializeField] private string NextLevel = "Level1";

    void OnTriggerEnter2D(Collider2D col)
    {
        SceneManager.LoadScene(this.NextLevel);
    }
}
