using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerBehavior : MonoBehaviour
{
    [SerializeField] private Vector2 engineForce;
    [SerializeField] private float torqueForce = 10f;
    [SerializeField] private LayerMask groundLayerMask;

    private Rigidbody2D playerRigidBody;
    private CapsuleCollider2D collider;
    private int playerSprintInput = 0;
    private float playerSprintToque = 0;

    // Start is called before the first frame update
    void Start()
    {
        this.playerRigidBody = GetComponent<Rigidbody2D>();
        this.collider = GetComponent<CapsuleCollider2D>();
    }

    // Update is called once per frame
    void Update()
    {
        if (this.IsGrounded())
        {
            this.playerRigidBody.AddRelativeForce(this.engineForce * this.playerSprintInput);
        }

        this.playerRigidBody.AddTorque(this.torqueForce * this.playerSprintToque);
    }

    public void Sprint(InputAction.CallbackContext context){
        if (context.canceled) {
            this.playerSprintInput = 0;
            return;
        }

        this.playerSprintInput = 1;
    }

    public void ChangeDirection(InputAction.CallbackContext context) {
        if (context.canceled) {
            this.playerSprintToque = 0;
            return;
        };

        this.playerSprintToque = context.ReadValue<float>();
    }

    private bool IsGrounded() {
        float extraHeight = 0.1f;
        float distance = this.collider.bounds.extents.y + extraHeight;
        Vector2 centerOfPlayer = this.collider.bounds.center;
        RaycastHit2D raycastToGround = Physics2D.Raycast(centerOfPlayer, Vector2.down, distance, this.groundLayerMask);

        Color rayColor;

        if (raycastToGround.collider != null) {
            rayColor = Color.green;
        } else {
            rayColor = Color.red;
        }

        Debug.DrawRay(this.collider.bounds.center, Vector2.down * distance, rayColor);

        return raycastToGround.collider != null;
    }
}
