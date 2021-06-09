extends KinematicBody2D

onready var Player = get_parent()
onready var animationTree = get_node("AnimationTree")
onready var animation_mode = animationTree.get("parameters/playback")

var velocityVector = Vector2()

export (int) var speed # pixels / sec
export (int) var jump_force # pixels / sec
export (int) var gravity

func _ready():
	
	pass # Replace with function Player.

func _process(dt):
	pass

func _physics_process(dt):
	handlePlayerMovement(dt)
	pass

func handlePlayerMovement(dt):
	velocityVector.x = 0
	velocityVector.y += gravity * dt
	
	if Input.is_action_pressed("ui_right"):
		velocityVector.x = speed
		# Player.flip_h = false
		animation_mode.travel("run_right")
	elif Input.is_action_pressed("ui_left"):
		velocityVector.x = -speed
		# Player.flip_h = true
		animation_mode.travel("run_left")
	else:
		velocityVector.x = 0
		animation_mode.travel("idle")
	
	if is_on_floor():
		velocityVector.y = 0
		
		if Input.is_action_just_pressed("ui_up"):
			velocityVector.y = -jump_force
	
	move_and_slide(velocityVector, Vector2(0, -1));
	pass
