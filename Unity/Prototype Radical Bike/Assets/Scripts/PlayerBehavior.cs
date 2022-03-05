using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerBehavior : MonoBehaviour
{
    [SerializeField] private Rigidbody2D frontWheel;
    [SerializeField] private Rigidbody2D backWheel;
    [SerializeField] private float speed = 100f;
    [SerializeField] private float rotationSpeed = 500f;

    private Rigidbody2D playerRigidBody;
    private int playerInput = 0;
    private float playerRotationInput = 0;

    // Start is called before the first frame update
    void Start()
    {
        this.playerRigidBody = GetComponent<Rigidbody2D>();
    }

    void FixedUpdate()
    {
        this.backWheel.AddTorque(-this.speed * this.playerInput * Time.fixedDeltaTime);
        this.frontWheel.AddTorque(-this.speed * this.playerInput * Time.fixedDeltaTime);

        this.playerRigidBody.AddTorque(this.rotationSpeed * this.playerRotationInput * Time.fixedDeltaTime);
    }

    // TODO: Alterar InputAction para botão
    public void Sprint(InputAction.CallbackContext context){
        if (context.canceled) {
            this.playerInput = 0;
            return;
        }

        this.playerInput = 1;
    }

    public void ChangeDirection(InputAction.CallbackContext context) {
        if (context.canceled) {
            this.playerRotationInput = 0;
            return;
        };

        this.playerRotationInput = context.ReadValue<float>();
    }

    /* private bool IsGrounded() {
        return this.backWheel.IsGrounded() || this.frontWheel.IsGrounded();
    } */
}
