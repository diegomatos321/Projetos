using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CoinPickUp : MonoBehaviour
{
    private Animator animator;
    private AudioSource coinSfx;

    // Start is called before the first frame update
    void Start()
    {
        this.coinSfx = this.GetComponent<AudioSource>();
        this.animator = this.GetComponent<Animator>();
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        Debug.Log(other.tag);
        if (other.tag != "Player")
            return;
        
        
    }

    void PlaySfx()
    {
        this.coinSfx.Play();
    }

    void DestroyCoin()
    {
        Destroy(this.gameObject);
    }
}
