using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerBehavior : MonoBehaviour
{
    [SerializeField] private Wheel frontWheel;
    [SerializeField] private Wheel backWheel;
    [SerializeField] private float engineForce = 1f;
    [SerializeField] private float playerRotation = 10f;

    private Rigidbody2D playerRigidBody;
    private int playerSprintInput = 0;
    private float playerSprintToque = 0;

    // Start is called before the first frame update
    void Start()
    {
        this.playerRigidBody = GetComponent<Rigidbody2D>();
    }

    void FixedUpdate()
    {
        this.backWheel.Forward(this.engineForce, this.playerSprintInput);

        this.playerRigidBody.AddTorque(this.playerRotation * this.playerSprintToque * Time.fixedDeltaTime);
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
    }
}
