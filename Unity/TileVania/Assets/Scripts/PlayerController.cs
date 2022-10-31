using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerController : MonoBehaviour
{
    [SerializeField] protected float speed = 10f;
    [SerializeField] protected float jumpSpeed = 14.5f;
    [SerializeField] protected float climbSpeed = 6f;
    [SerializeField] protected BoxCollider2D bodyCollider;
    [SerializeField] protected BoxCollider2D feetCollider;

    protected Vector2 playerInput;
    protected Rigidbody2D rigidbody;
    protected Animator animator;
    protected float initialGravityScale;
    protected bool isAlive = true;

    // Start is called before the first frame update
    void Start()
    {
        this.rigidbody = this.GetComponent<Rigidbody2D>();
        this.animator = this.GetComponent<Animator>();;
        this.initialGravityScale = this.rigidbody.gravityScale;
    }

    // Update is called once per frame
    void Update()
    {
        if (this.isAlive == false)
        {
            return;
        }

        this.MovePlayer();
        this.FlipPlayer();
        this.HandleAnimation();
        this.HandleClimb();
    }

    void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.tag == "Enemy")
        {
            this.Die();
        }
    }

    void OnTriggerEnter2D(Collider2D collider)
    {
        if (collider.gameObject.tag == "Enemy")
        {
            this.Die();
        }
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

    protected void HandleClimb()
    {
        if (this.bodyCollider.IsTouchingLayers(LayerMask.GetMask("Climbing")) == false)
        {
            this.rigidbody.gravityScale = this.initialGravityScale;
            this.animator.SetBool("isClimbing", false);
            return;
        }

        this.rigidbody.gravityScale = 0;
        this.rigidbody.velocity = new Vector2(this.rigidbody.velocity.x, this.playerInput.y * this.climbSpeed);

        if (Mathf.Abs(this.rigidbody.velocity.y) > Mathf.Epsilon)
        {
            this.transform.localScale = new Vector2(1, this.transform.localScale.y);
            this.animator.SetBool("isClimbing", true);
        } else {
            this.animator.SetBool("isClimbing", false);
        }
    }

    protected void Die()
    {
        this.isAlive = false;
        this.animator.SetTrigger("isDead");
    }

    protected void OnMove(InputValue value)
    {
        this.playerInput = value.Get<Vector2>();
    }

    protected void OnJump(InputValue value)
    {
        if (value.isPressed && this.feetCollider.IsTouchingLayers(LayerMask.GetMask("Plataforms")))
        {
            this.rigidbody.velocity += new Vector2(0f, this.jumpSpeed);
        }
    }
}
