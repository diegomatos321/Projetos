using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyWalkToSides : MonoBehaviour
{
    [SerializeField] protected float speed = 1f;
    [SerializeField] protected Transform WallChecker;

    protected Rigidbody2D rigidbody;
    protected bool isFacingRight = true;

    // Start is called before the first frame update
    void Start()
    {
        this.rigidbody = this.GetComponent<Rigidbody2D>();
    }

    // Update is called once per frame
    void Update()
    {
        this.CheckForWall();
        this.HandleMove();
    }

    protected void CheckForWall()
    {
        RaycastHit2D hit;

        if (this.rigidbody.velocity.x > 0)
        {
            hit = Physics2D.Raycast(this.WallChecker.position, Vector3.right, 0.1f, LayerMask.GetMask("Plataforms"));
        } else {
            hit = Physics2D.Raycast(this.WallChecker.position, Vector3.left, 0.1f, LayerMask.GetMask("Plataforms"));
        }

        if (hit.collider != null)
        {
            this.speed = -this.speed;;
        }
    }

    protected void HandleMove()
    {
        if (this.rigidbody.velocity.x > 0)
        {
            this.transform.localScale = new Vector2(1, this.transform.localScale.y);
        } else {
            this.transform.localScale = new Vector2(-1, this.transform.localScale.y);
        }

        this.rigidbody.velocity = new Vector2(this.speed, this.rigidbody.velocity.y);
    }
}
