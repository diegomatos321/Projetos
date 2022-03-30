using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CollectCoin : MonoBehaviour
{
    private Animator animator;
    private CircleCollider2D collider;

    private void Start() {
        animator = GetComponent<Animator>();
        collider = GetComponent<CircleCollider2D>();
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        Debug.Log(other.tag);
        if (other.CompareTag("Player"))
        {
            // Destroy(this.gameObject);
            collider.enabled = false;
            animator.SetBool("finish", true);
        }
    }

    private void DestroyObject() {
        Destroy(this.gameObject);
    }
}
