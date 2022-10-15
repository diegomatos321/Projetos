using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerController : MonoBehaviour
{
    [SerializeField] protected float speed = 10f;
    [SerializeField] protected float jumpSpeed = 10f;

    protected Vector2 playerInput;
    protected Rigidbody2D rigidbody;
    protected Animator animator;
    protected Collider2D body;

    // Start is called before the first frame update
    void Start()
    {
        this.rigidbody = this.GetComponent<Rigidbody2D>();
        this.animator = this.GetComponent<Animator>();
        this.body = this.GetComponentInChildren<Collider2D>();  
    }

    // Update is called once per frame
    void Update()
    {
        this.MovePlayer();
        this.FlipPlayer();
        this.HandleAnimation();
    }

    protected void MovePlayer()
    {
        Vector2 playerVelocity = new Vector2(this.playerInput.x * this.speed, this.rigidbody.velocity.y);

        this.rigidbody.velocity = playerVelocity;
    }

    protected void FlipPlayer()
    {
        if (Mathf.Abs(this.rigidbody.velocity.x) <= Mathf.Epsilon)
        {
            return;
        }

        this.transform.localScale = new Vector2(Mathf.Sign(this.rigidbody.velocity.x), this.transform.localScale.y);
    }

    protected void HandleAnimation()
    {
        if (Mathf.Abs(this.rigidbody.velocity.x) <= Mathf.Epsilon)
        {
            this.animator.SetBool("isRunning", false);
            return;
        }

        this.animator.SetBool("isRunning", true);
    }

    protected void OnMove(InputValue value)
    {
        this.playerInput = value.Get<Vector2>();
    }

    protected void OnJump(InputValue value)
    {
        if (value.isPressed && this.body.IsTouchingLayers(LayerMask.GetMask("Ground")))
        {
            this.rigidbody.velocity += new Vector2(0f, this.jumpSpeed);
        }
    }
}
