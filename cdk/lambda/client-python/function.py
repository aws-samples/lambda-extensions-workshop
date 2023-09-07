import os
import json
import random
import time

MAX_SLEEP = 3 * 1000
ERROR_RATE = 10
THROW_ERRORS = os.environ.get('THROW_ERRORS') == 'true'

print(f'Throw error is {"enabled" if THROW_ERRORS else "disabled"}')

def handler(event, context):
    if THROW_ERRORS:
        throw_error()

    time_to_sleep = random_sleep()
    print(f'Sleeping {time_to_sleep} ms')

    time.sleep(time_to_sleep / 1000)  # Sleep time is in seconds

    response = {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

    return response

def throw_error():
    if random.randint(1, 100) <= ERROR_RATE:
        raise Exception('Oh no! We got an error :(')

def random_sleep():
    return random.randint(0, MAX_SLEEP)