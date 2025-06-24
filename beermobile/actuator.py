import RPi.GPIO as GPIO
import time
import sys
import tty
import termios
import select

# --- Pin Definitions (using BCM numbering) ---
# We'll use the pins previously designated for 'Motor A' as a single set
# for controlling your linear actuator with the DRV8833.
# IMPORTANT: These are BCM GPIO numbers. Ensure your physical wiring
# on your Raspberry Pi matches these BCM numbers.
ACTUATOR_IN1_PIN = 2   # Connected to DRV8833 AIN1 (for one direction)
ACTUATOR_IN2_PIN = 3   # Connected to DRV8833 AIN2 (for the other direction)
ACTUATOR_ENABLE_PIN = 12 # Connected to DRV8833 nSLEEP (or A_ENABLE) - for speed control

# --- GPIO Setup ---
GPIO.setwarnings(False) # Disable warnings for GPIO channel usage
GPIO.setmode(GPIO.BCM) # Use Broadcom (BCM) GPIO numbers

# Set up IN1, IN2, and Enable as output pins
GPIO.setup(ACTUATOR_IN1_PIN, GPIO.OUT)
GPIO.setup(ACTUATOR_IN2_PIN, GPIO.OUT)
GPIO.setup(ACTUATOR_ENABLE_PIN, GPIO.OUT)

# Initialize Software PWM instance for the ENABLE pin
PWM_FREQUENCY = 100 # Hz, a common frequency for motor control
pwm_actuator_enable = GPIO.PWM(ACTUATOR_ENABLE_PIN, PWM_FREQUENCY)
pwm_actuator_enable.start(0) # Start with motor off (0% duty cycle)

# Default speed for the actuator (0-100%)
CURRENT_SPEED = 75

print(f"GPIO pins for linear actuator control initialized:")
print(f"  Direction Pin 1 (Extend) = BCM GPIO {ACTUATOR_IN1_PIN}")
print(f"  Direction Pin 2 (Retract) = BCM GPIO {ACTUATOR_IN2_PIN}")
print(f"  Enable Pin (Speed)       = BCM GPIO {ACTUATOR_ENABLE_PIN}")
print(f"Using RPi.GPIO Software PWM on Enable pin at {PWM_FREQUENCY} Hz.")
print(f"Default speed set to {CURRENT_SPEED}%.")

def set_actuator_state(direction, speed_percent):
    """
    Controls the linear actuator direction and speed.
    direction: 'extend', 'retract', 'stop'
    speed_percent: 0-100 (this will be the duty cycle for PWM on the enable pin)
    """
    if not (0 <= speed_percent <= 100):
        print("Error: Speed percentage must be between 0 and 100.")
        return

    # Set duty cycle for the enable pin
    duty_cycle = speed_percent

    if direction == 'extend':
        GPIO.output(ACTUATOR_IN1_PIN, GPIO.HIGH) # Set direction for extend
        GPIO.output(ACTUATOR_IN2_PIN, GPIO.LOW)
        pwm_actuator_enable.ChangeDutyCycle(duty_cycle) # Apply PWM for speed
    elif direction == 'retract':
        GPIO.output(ACTUATOR_IN1_PIN, GPIO.LOW) # Set direction for retract
        GPIO.output(ACTUATOR_IN2_PIN, GPIO.HIGH)
        pwm_actuator_enable.ChangeDutyCycle(duty_cycle) # Apply PWM for speed
    elif direction == 'stop':
        # Setting both IN pins LOW for a brake/coast stop
        GPIO.output(ACTUATOR_IN1_PIN, GPIO.LOW)
        GPIO.output(ACTUATOR_IN2_PIN, GPIO.LOW)
        pwm_actuator_enable.ChangeDutyCycle(0) # Cut power via enable pin
    else:
        print(f"Invalid direction: '{direction}'. Use 'extend', 'retract', or 'stop'.")

def main():
    """Main function to run the actuator control loop."""
    print("\n--- Linear Actuator Control (Hold-to-move - Software PWM) ---")
    print(f"  Direction Pin 1 (Extend) = BCM GPIO {ACTUATOR_IN1_PIN}")
    print(f"  Direction Pin 2 (Retract) = BCM GPIO {ACTUATOR_IN2_PIN}")
    print(f"  Enable Pin (Speed)       = BCM GPIO {ACTUATOR_ENABLE_PIN}")
    print(f"Using RPi.GPIO Software PWM on Enable pin at {PWM_FREQUENCY} Hz.")
    print("-------------------------------------------------")
    print(f"HOLD 'u' to extend (UP) at {CURRENT_SPEED}%")
    print(f"HOLD 'j' to retract (DOWN) at {CURRENT_SPEED}%")
    print("Release key to STOP")
    print("Press 'q' to QUIT and cleanup.")
    print("-------------------------------------------------")
    
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    last_action = 'stop'

    try:
        tty.setraw(sys.stdin.fileno()) # Set terminal to raw mode for single character input
        while True:
            # Check for key press without blocking
            if select.select([sys.stdin], [], [], 0) == ([sys.stdin], [], []):
                char = sys.stdin.read(1) # Read a single character
                if char.lower() == 'u':
                    if last_action != 'extend':
                        print(f" -> Extending (UP)...")
                        set_actuator_state('extend', CURRENT_SPEED)
                        last_action = 'extend'
                elif char.lower() == 'j':
                    if last_action != 'retract':
                        print(f" -> Retracting (DOWN)...")
                        set_actuator_state('retract', CURRENT_SPEED)
                        last_action = 'retract'
                elif char.lower() == 'q':
                    print(" -> Quitting.")
                    break
            else:
                # No key is being pressed, stop the motor
                if last_action != 'stop':
                    print(" -> Key released. Stopping.")
                    set_actuator_state('stop', 0) # Stop by cutting power (duty cycle 0)
                    last_action = 'stop'
            
            time.sleep(0.05) # Small delay to prevent high CPU usage in the loop

    except Exception as e:
        print(f"\nAn error occurred: {e}")
    finally:
        print("\nExiting. Restoring terminal and cleaning up GPIO...")
        # Restore terminal settings
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        
        # Cleanup GPIO
        try:
            pwm_actuator_enable.stop() # Stop the PWM instance
            print("PWM instance stopped.")
        except Exception as e:
            print(f"Error stopping PWM instance: {e}")
        
        GPIO.cleanup() # Reset all GPIO pins used by this script
        print("GPIO cleanup complete.")

if __name__ == "__main__":
    main()