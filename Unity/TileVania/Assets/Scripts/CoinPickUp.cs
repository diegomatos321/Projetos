using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CoinPickUp : MonoBehaviour
{
    [SerializeField] private AudioClip coinSfx;
    private Animator animator;

    // Start is called before the first frame update
    void Start()
    {
        this.animator = this.GetComponent<Animator>();
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.tag != "Player")
            return;
    
        AudioSource.PlayClipAtPoint(this.coinSfx, Camera.main.transform.position);
        Destroy(this.gameObject);
    }
}
