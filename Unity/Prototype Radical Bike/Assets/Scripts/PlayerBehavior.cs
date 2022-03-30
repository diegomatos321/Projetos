using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerBehavior : MonoBehaviour
{
    [SerializeField] private Wheel frontWheel;
    [SerializeField] private Wheel backWheel;
    [SerializeField] private float speed = 150f;
    [SerializeField] private float rotation = 800f;

    private Rigidbody2D playerRigidBody;
    private Vector2 movementInput;
    private int jumpInput;
    private float playerRotationInput = 0;

    // Start is called before the first frame update
    void Start()
    {
        this.playerRigidBody = GetComponent<Rigidbody2D>();
    }

    void FixedUpdate()
    {
        this.backWheel.Forward(this.speed, this.movementInput);
        this.frontWheel.Forward(this.speed, this.movementInput);

        this.playerRigidBody.AddTorque(-this.rotation * this.movementInput.x * Time.fixedDeltaTime);
    }

    public void ReadPlayerMovementInput(InputAction.CallbackContext context){
        if (context.canceled) {
            this.movementInput = Vector2.zero;
            return;
        };

        this.movementInput = context.ReadValue<Vector2>();
    }

    private bool IsGrounded() {
        return this.backWheel.IsGrounded() || this.frontWheel.IsGrounded();
    }
}
