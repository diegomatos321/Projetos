using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerBehavior : MonoBehaviour
{
    [SerializeField] private Wheel frontWheel;
    [SerializeField] private Wheel backWheel;
    [SerializeField] private Vector2 engineForce;
    [SerializeField] private float playerRotation = 10f;

    private Rigidbody2D playerRigidBody;
    private int playerSprintInput = 0;
    private float playerSprintToque = 0;

    // Start is called before the first frame update
    void Start()
    {
        this.playerRigidBody = GetComponent<Rigidbody2D>();
    }

    // Update is called once per frame
    void Update()
    {
        if (this.IsGrounded())
        {
            // this.playerRigidBody.AddRelativeForce(this.engineForce * this.playerSprintInput, ForceMode2D.Impulse);
            this.backWheel.Forward(this.engineForce, this.playerSprintInput);
        }

        this.playerRigidBody.AddTorque(this.playerRotation * this.playerSprintToque);
    }

    // TODO: Alterar InputAction para botão
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
        return this.backWheel.IsGrounded() || this.frontWheel.IsGrounded();
        /* float extraHeight = 0.1f;
        float distance = this.GetComponent<Collider>().bounds.extents.y + extraHeight;
        Vector2 centerOfPlayer = this.GetComponent<Collider>().bounds.center;
        RaycastHit2D raycastToGround = Physics2D.Raycast(centerOfPlayer, Vector2.down, distance, this.groundLayerMask);

        Color rayColor;

        if (raycastToGround.collider != null) {
            rayColor = Color.green;
        } else {
            rayColor = Color.red;
        }

        Debug.DrawRay(this.GetComponent<Collider>().bounds.center, Vector2.down * distance, rayColor);

        return raycastToGround.collider != null; */
    }
}
