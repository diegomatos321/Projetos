using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Wheel : MonoBehaviour
{
    [SerializeField] private LayerMask groundLayerMask;

    private CircleCollider2D collider;
    private Rigidbody2D rigidbody2D;

    // Start is called before the first frame update
    void Start()
    {
        this.collider = GetComponent<CircleCollider2D>();    
        this.rigidbody2D = GetComponent<Rigidbody2D>();
    }

    public bool IsGrounded() {
        float extraHeight = 0.1f;
        float distance = this.collider.bounds.extents.y + extraHeight;
        Vector2 centerOfObject = this.collider.bounds.center;
        RaycastHit2D raycastToGround = Physics2D.Raycast(centerOfObject, Vector2.down, distance, this.groundLayerMask);

        Color rayColor;

        if (raycastToGround.collider != null) {
            rayColor = Color.green;
        } else {
            rayColor = Color.red;
        }

        Debug.DrawRay(this.collider.bounds.center, Vector2.down * distance, rayColor);

        return raycastToGround.collider != null;
    }

    public void Forward(Vector2 engineForce, int input) {
        this.rigidbody2D.AddRelativeForce(engineForce * input, ForceMode2D.Impulse);
    }
}
