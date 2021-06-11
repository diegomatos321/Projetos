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

export (int) var MAX_SPEED = 200
export (int) var JUMP_FORCE = 400
export (int) var GRAVITY_FORCE = 1200

var direction_input := Vector2.ZERO
var velocity := Vector2.ZERO
var prevState: int = -1
var currentState: int = IDLE

func _physics_process(dt: float) -> void:
	
	gravity(dt)
	
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
	pass

func idleState(dt: float) -> void:
	handleBasicInputs()
	animation_mode.travel("idle")
	pass

func combatIdleState(dt: float) -> void:
	handleBasicInputs()
	animation_mode.travel("combat_idle")
	pass

func runState(dt: float) -> void:
	handleBasicInputs()
	animation_mode.travel("run")
	
	velocity.x = direction_input.x * MAX_SPEED
	move()
	pass

func jumpState(dt: float) -> void:
	print("JUMP STATE")
	velocity.y += direction_input.y * JUMP_FORCE
	move()
	
	changeState(IDLE)
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
	
	direction_input.normalized()
	pass

func gravity(dt: float) -> void:
	if is_on_floor():
		velocity.y = 0
	else:
		velocity.y += GRAVITY_FORCE * dt
	
	move()
	pass

func move() -> void:
	move_and_slide(velocity, Vector2.UP)
	pass

func changeState(newState) -> void:
	prevState = currentState
	currentState = newState
	pass
