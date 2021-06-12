extends KinematicBody2D

enum {
	IDLE,
	COMBAT_IDLE,
	JUMP,
	RUN,
	COMBAT
}

onready var animationTree: AnimationTree = get_node("AnimationTree")
onready var animation_mode: AnimationNodeStateMachinePlayback = animationTree.get("parameters/playback")
onready var animation_conditions = animationTree.get("parameters/conditions")

export (int) var MAX_SPEED = 130
export (int) var JUMP_FORCE = 400
export (int) var GRAVITY_FORCE = 1200

var direction_input := Vector2.ZERO
var velocity := Vector2.ZERO
var prevState: int = -1
var currentState: int = IDLE

func _physics_process(dt: float) -> void:
	applyGravity(dt)
	
	match currentState:
		IDLE:
			idleState(dt)
		COMBAT_IDLE:
			combatIdleState(dt)
		JUMP:
			jumpState(dt)
		RUN:
			runState(dt)
		COMBAT:
			combatState(dt)
	
	move()
	pass

func idleState(dt: float) -> void:
	handleBasicInputs()
	velocity.x = 0
	animation_mode.travel("idle")
	pass

func combatIdleState(dt: float) -> void:
	handleBasicInputs()
	animation_mode.travel("combat_idle")
	pass

func runState(dt: float) -> void:
	handleBasicInputs()
	
	if test_move(transform, velocity):
		changeState(prevState)
		return
	
	velocity.x = direction_input.x * MAX_SPEED
	
	if velocity.x > 0:
		animation_mode.travel("run_right")
	elif velocity.x < 0:
		animation_mode.travel("run_left")
	
	pass

var isJumping = false
func jumpState(dt: float) -> void:
	if !isJumping:
		velocity.y = direction_input.y * JUMP_FORCE
		isJumping = true

	if is_on_floor():
		isJumping = false
		changeState(prevState)
	pass

func combatState(dt: float) -> void:
	
	pass

func handleBasicInputs() -> void:
	direction_input.x = 0
	direction_input.y = 0
	
	if Input.is_action_pressed("ui_right"):
		direction_input.x = 1
		changeState(RUN)
	elif Input.is_action_pressed("ui_left"):
		direction_input.x = -1
		changeState(RUN)
	else:
		if currentState == COMBAT:
			changeState(COMBAT_IDLE)
		else:
			changeState(IDLE)
	
	if is_on_floor():
		if Input.is_action_just_pressed("ui_up"):
			direction_input.y = -1
			changeState(JUMP)
	
	if Input.is_action_pressed("attack"):
		changeState(COMBAT)
	pass

func applyGravity(dt: float) -> void:
	velocity.y += GRAVITY_FORCE * dt
	pass

func move() -> void:
	velocity = move_and_slide(velocity, Vector2.UP)
	pass

func changeState(newState) -> void:
	if currentState != newState:
		prevState = currentState
		currentState = newState
	pass
