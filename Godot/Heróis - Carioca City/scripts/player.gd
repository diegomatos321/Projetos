extends KinematicBody2D

enum PlayerStates {
	IDLE,
	MOVE,
	RUN,
	JUMP,
	CROUNCH
};

var currentState = PlayerStates.IDLE;
var velocityVector = Vector2()

export (int) var speed # pixels / sec
export (int) var jump_force # pixels / sec
export (int) var gravity

func _ready():
	
	pass # Replace with function body.

func _process(dt):
	handlePlayerMovement(dt)
	handlePlayerAnimation()
	
	pass

func handlePlayerMovement(dt):
	currentState = PlayerStates.IDLE
	velocityVector.x = 0
	velocityVector.y += gravity * dt
	
	if Input.is_action_pressed("ui_right"):
		velocityVector.x = cos(Vector2.RIGHT.angle()) * speed
		get_node("AnimatedSprite").flip_h = false
		currentState = PlayerStates.MOVE
	elif Input.is_action_pressed("ui_left"):
		velocityVector.x = cos(Vector2.LEFT.angle()) * speed
		get_node("AnimatedSprite").flip_h = true
		currentState = PlayerStates.MOVE
	else:
		velocityVector.x = 0
	
	if is_on_floor():
		velocityVector.y = 0
		
		if Input.is_action_just_pressed("ui_up"):
			velocityVector.y = sin(Vector2.UP.angle()) * jump_force
			currentState = PlayerStates.JUMP
	
	move_and_slide(velocityVector, Vector2(0, -1));
	pass

func handlePlayerAnimation():
	if currentState == PlayerStates.IDLE:
		get_node("AnimatedSprite").play("idle")
	
	if currentState == PlayerStates.MOVE:
		get_node("AnimatedSprite").play("start_run")
	
	pass


func _on_AnimatedSprite_animation_finished():
	print(get_node("AnimatedSprite").animation)
	
	if get_node("AnimatedSprite").animation == "start_run":
		print("Start Run animation")
		get_node("AnimatedSprite").play("run")
	pass 
